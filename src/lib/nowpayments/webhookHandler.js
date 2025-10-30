/**
 * BGP Webhook Handler for NOWPayments IPN Processing
 * Handles incoming NOWPayments webhooks and updates BGP database
 * SERVER-SIDE ONLY - Never expose to client
 */

import { supabase } from '../supabase.js';
import { verifyIpnFromHeaders, mapNpToBgpStatus, generateIpnSignature } from './hmac.js';

// Browser guard
if (typeof window !== 'undefined') {
  throw new Error('Webhook handler must not run in browser - server-side only!');
}

class BGPWebhookHandler {
  constructor() {
    this.ipnSecret = process.env?.NOWPAYMENTS_IPN_SECRET;
    
    if (!this.ipnSecret) {
      throw new Error('NOWPAYMENTS_IPN_SECRET environment variable is required');
    }
  }

  /**
   * Process incoming NOWPayments IPN webhook
   * @param {object} headers - Request headers
   * @param {object} payload - IPN payload from NOWPayments
   * @returns {object} - Processing result
   */
  async processIpn(headers, payload) {
    try {
      // Verify HMAC signature
      const verification = verifyIpnFromHeaders(headers, payload, this.ipnSecret);
      
      // Log webhook event for audit trail
      const webhookLogId = await this.logWebhookEvent(payload, verification);
      
      if (!verification?.verified) {
        console.warn('IPN verification failed:', verification?.error);
        return {
          success: false,
          error: 'Invalid signature',
          webhookLogId,
          httpStatus: 401
        };
      }

      // Process the verified IPN
      const result = await this.handleVerifiedIpn(payload, webhookLogId);
      
      return {
        success: true,
        result,
        webhookLogId,
        httpStatus: 200
      };
      
    } catch (error) {
      console.error('IPN processing error:', error);
      
      return {
        success: false,
        error: error?.message,
        httpStatus: 500
      };
    }
  }

  /**
   * Handle verified IPN and update payment status
   * @param {object} payload - Verified IPN payload
   * @param {string} webhookLogId - Webhook log ID for reference
   * @returns {object} - Processing result
   */
  async handleVerifiedIpn(payload, webhookLogId) {
    const { 
      payment_id: npPaymentId,
      payment_status: npStatus,
      pay_address: payAddress,
      price_amount: priceAmount,
      price_currency: priceCurrency,
      pay_amount: payAmount,
      pay_currency: payCurrency,
      actually_paid: actuallyPaid,
      outcome_amount: outcomeAmount,
      outcome_currency: outcomeCurrency
    } = payload;

    if (!npPaymentId) {
      throw new Error('payment_id is required in IPN payload');
    }

    // Map NOWPayments status to BGP status
    const bgpStatus = mapNpToBgpStatus(npStatus);
    
    // Find payment in BGP database using external_id (stores NP payment_id)
    const { data: existingPayments, error: findError } = await supabase?.from('payments')?.select('id, merchant_id, status, amount_fiat, currency_fiat')?.eq('external_id', npPaymentId);

    if (findError) {
      throw new Error(`Database error finding payment: ${findError.message}`);
    }

    if (!existingPayments || existingPayments?.length === 0) {
      console.warn(`Payment not found for NOWPayments ID: ${npPaymentId}`);
      return {
        action: 'ignored',
        reason: 'Payment not found in BGP database',
        npPaymentId
      };
    }

    const payment = existingPayments?.[0];
    
    // Prepare update data
    const updateData = {
      status: bgpStatus,
      updated_at: new Date()?.toISOString()
    };

    // Add payment-specific fields based on status
    if (bgpStatus === 'completed') {
      updateData.paid_at = new Date()?.toISOString();
      updateData.confirmed_at = new Date()?.toISOString();
    } else if (bgpStatus === 'failed') {
      updateData.failed_at = new Date()?.toISOString();
    }

    // Add crypto payment details if available
    if (payAddress) updateData.pay_address = payAddress;
    if (payAmount) updateData.amount_crypto = parseFloat(payAmount);
    if (payCurrency) updateData.currency_crypto = payCurrency;
    if (actuallyPaid) updateData.amount_received = parseFloat(actuallyPaid);

    // Update payment in database
    const { data: updatedPayment, error: updateError } = await supabase?.from('payments')?.update(updateData)?.eq('id', payment?.id)?.select()?.single();

    if (updateError) {
      throw new Error(`Database error updating payment: ${updateError.message}`);
    }

    // Create payment log entry
    await this.createPaymentLog(payment?.id, bgpStatus, 'IPN status update', {
      npPaymentId,
      npStatus,
      webhookLogId,
      payAddress,
      amountReceived: actuallyPaid,
      payCurrency
    });

    // Send webhook to merchant if configured
    await this.sendMerchantWebhook(payment?.merchant_id, updatedPayment, bgpStatus);

    return {
      action: 'updated',
      paymentId: payment?.id,
      oldStatus: payment?.status,
      newStatus: bgpStatus,
      npPaymentId
    };
  }

  /**
   * Log webhook event for audit trail
   * @param {object} payload - IPN payload
   * @param {object} verification - Signature verification result
   * @returns {string} - Webhook log ID
   */
  async logWebhookEvent(payload, verification) {
    try {
      const { data, error } = await supabase?.from('webhook_logs')?.insert([{
          webhook_id: null, // IPN webhooks don't have a specific webhook config
          payment_id: null, // Will be updated after payment lookup
          event_type: 'nowpayments.ipn',
          payload,
          response_status: verification?.verified ? 200 : 401,
          response_body: verification?.verified ? 'Verified' : verification?.error,
          attempt_number: 1,
          delivered_at: verification?.verified ? new Date()?.toISOString() : null
        }])?.select('id')?.single();

      if (error) {
        console.error('Failed to log webhook event:', error);
        return null;
      }

      return data?.id;
    } catch (error) {
      console.error('Webhook logging error:', error);
      return null;
    }
  }

  /**
   * Create payment log entry
   * @param {string} paymentId - BGP payment ID
   * @param {string} status - New payment status
   * @param {string} message - Log message
   * @param {object} data - Additional log data
   */
  async createPaymentLog(paymentId, status, message, data = {}) {
    try {
      await supabase?.from('payment_logs')?.insert([{
          payment_id: paymentId,
          status,
          message,
          data,
          created_at: new Date()?.toISOString()
        }]);
    } catch (error) {
      console.error('Failed to create payment log:', error);
    }
  }

  /**
   * Send webhook to merchant (if configured)
   * @param {string} merchantId - Merchant user ID
   * @param {object} payment - Payment data
   * @param {string} status - Payment status
   */
  async sendMerchantWebhook(merchantId, payment, status) {
    try {
      // Get merchant webhook configuration
      const { data: webhooks, error } = await supabase?.from('webhooks')?.select('id, url, secret, events')?.eq('user_id', merchantId)?.eq('status', 'active');

      if (error || !webhooks || webhooks?.length === 0) {
        return; // No webhooks configured
      }

      const eventType = `payment.${status}`;
      
      for (const webhook of webhooks) {
        // Check if this webhook is subscribed to this event
        if (!webhook?.events?.includes(eventType)) {
          continue;
        }

        // Prepare webhook payload (BGP branded)
        const webhookPayload = {
          event: eventType,
          payment: {
            id: payment?.payment_id, // BGP payment ID
            amount: payment?.amount_fiat,
            currency: payment?.currency_fiat,
            status,
            created_at: payment?.created_at,
            updated_at: payment?.updated_at,
            metadata: payment?.metadata
          },
          timestamp: new Date()?.toISOString()
        };

        // Send webhook (implement actual HTTP request here)
        await this.deliverWebhook(webhook, webhookPayload, payment?.id);
      }
    } catch (error) {
      console.error('Merchant webhook delivery error:', error);
    }
  }

  /**
   * Deliver webhook to merchant endpoint
   * @param {object} webhook - Webhook configuration
   * @param {object} payload - Webhook payload
   * @param {string} paymentId - Payment ID for logging
   */
  async deliverWebhook(webhook, payload, paymentId) {
    try {
      // Generate BGP webhook signature
      const signature = webhook?.secret 
        ? generateIpnSignature(payload, webhook?.secret)
        : null;

      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'BGP-Webhooks/1.0'
      };

      if (signature) {
        headers['X-BGP-Signature'] = signature;
      }

      const response = await fetch(webhook?.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        timeout: 30000 // 30 second timeout
      });

      const responseText = await response?.text()?.catch(() => '');

      // Log webhook delivery
      await supabase?.from('webhook_logs')?.insert([{
          webhook_id: webhook?.id,
          payment_id: paymentId,
          event_type: payload?.event,
          payload,
          response_status: response?.status,
          response_body: responseText?.substring(0, 1000), // Limit response body length
          attempt_number: 1,
          delivered_at: response?.ok ? new Date()?.toISOString() : null
        }]);

    } catch (error) {
      console.error('Webhook delivery failed:', error);
      
      // Log failed delivery
      await supabase?.from('webhook_logs')?.insert([{
          webhook_id: webhook?.id,
          payment_id: paymentId,
          event_type: payload?.event,
          payload,
          response_status: 0,
          response_body: error?.message,
          attempt_number: 1,
          delivered_at: null
        }]);
    }
  }
}

// Export singleton instance
export const webhookHandler = new BGPWebhookHandler();

// Helper function for processing IPN in API routes
export async function processNowPaymentsIpn(headers, payload) {
  return webhookHandler?.processIpn(headers, payload);
}

export default webhookHandler;