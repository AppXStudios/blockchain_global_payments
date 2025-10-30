import { supabase } from '../lib/supabase';

// Payouts service for BGP payout management
export const payoutsService = {
  // Get all payouts for current user
  async getPayouts(filters = {}) {
    try {
      let query = supabase
        ?.from('payouts')
        ?.select('*')
        ?.order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }
      if (filters?.currency) {
        query = query?.eq('currency', filters?.currency);
      }
      if (filters?.dateFrom) {
        query = query?.gte('created_at', filters?.dateFrom);
      }
      if (filters?.dateTo) {
        query = query?.lte('created_at', filters?.dateTo);
      }
      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;
      return { data: data || [], error };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading payouts.' } 
      };
    }
  },

  // Get single payout by ID
  async getPayout(payoutId) {
    try {
      const { data, error } = await supabase
        ?.from('payouts')
        ?.select('*')
        ?.eq('id', payoutId)
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading payout details.' } 
      };
    }
  },

  // Create new payout
  async createPayout(payoutData) {
    try {
      const { data: user } = await supabase?.auth?.getUser();
      if (!user?.user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      // Generate unique payout ID
      const payoutId = `bgp_payout_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`;

      const { data, error } = await supabase
        ?.from('payouts')
        ?.insert([{
          payout_id: payoutId,
          merchant_id: user?.user?.id,
          amount: payoutData?.amount,
          currency: payoutData?.currency?.toLowerCase(),
          destination_address: payoutData?.destination_address,
          destination_tag: payoutData?.destination_tag,
          network: payoutData?.network || 'mainnet',
          metadata: payoutData?.metadata || {},
          requires_confirmation: payoutData?.amount >= 1000 // Require confirmation for amounts >= $1000
        }])
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error creating payout.' } 
      };
    }
  },

  // Update payout status
  async updatePayoutStatus(payoutId, status, additionalData = {}) {
    try {
      const { data, error } = await supabase
        ?.from('payouts')
        ?.update({
          status,
          ...additionalData,
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', payoutId)
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error updating payout status.' } 
      };
    }
  },

  // Cancel payout
  async cancelPayout(payoutId, reason = 'Cancelled by user') {
    try {
      const { data, error } = await supabase
        ?.from('payouts')
        ?.update({
          status: 'cancelled',
          failed_reason: reason,
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', payoutId)
        ?.eq('status', 'pending') // Only allow cancelling pending payouts
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error cancelling payout.' } 
      };
    }
  },

  // Retry failed payout
  async retryPayout(payoutId) {
    try {
      const { data, error } = await supabase
        ?.from('payouts')
        ?.update({
          status: 'pending',
          failed_reason: null,
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', payoutId)
        ?.eq('status', 'failed') // Only allow retrying failed payouts
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error retrying payout.' } 
      };
    }
  },

  // Confirm payout (for 2FA verification)
  async confirmPayout(payoutId, confirmationCode) {
    try {
      const { data: user } = await supabase?.auth?.getUser();
      if (!user?.user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const { data, error } = await supabase
        ?.from('payouts')
        ?.update({
          status: 'processing',
          confirmation_code: confirmationCode,
          confirmed_by: user?.user?.id,
          confirmed_at: new Date()?.toISOString(),
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', payoutId)
        ?.eq('requires_confirmation', true)
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error confirming payout.' } 
      };
    }
  },

  // Get payout statistics
  async getPayoutStats(period = '30d') {
    try {
      const dateFilter = new Date();
      if (period === '7d') {
        dateFilter?.setDate(dateFilter?.getDate() - 7);
      } else if (period === '30d') {
        dateFilter?.setDate(dateFilter?.getDate() - 30);
      } else if (period === '90d') {
        dateFilter?.setDate(dateFilter?.getDate() - 90);
      }

      const { data, error } = await supabase
        ?.from('payouts')
        ?.select('amount, currency, status, created_at')
        ?.gte('created_at', dateFilter?.toISOString());

      if (error) {
        return { data: null, error };
      }

      // Calculate statistics
      const stats = {
        totalAmount: 0,
        totalPayouts: data?.length || 0,
        completedPayouts: 0,
        failedPayouts: 0,
        pendingPayouts: 0,
        successRate: 0,
        totalFees: 0
      };

      data?.forEach(payout => {
        if (payout?.status === 'completed') {
          stats.totalAmount += parseFloat(payout?.amount || 0);
          stats.completedPayouts += 1;
        } else if (payout?.status === 'failed') {
          stats.failedPayouts += 1;
        } else if (payout?.status === 'pending' || payout?.status === 'processing') {
          stats.pendingPayouts += 1;
        }
      });

      stats.successRate = stats?.totalPayouts > 0 
        ? (stats?.completedPayouts / stats?.totalPayouts) * 100 
        : 0;

      return { data: stats, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading payout statistics.' } 
      };
    }
  },

  // Get available balance for payouts
  async getAvailableBalance() {
    try {
      // In a real implementation, this would fetch from wallet service or hot wallet
      // For now, we'll calculate based on completed payments minus completed payouts
      
      const { data: payments, error: paymentsError } = await supabase
        ?.from('payments')
        ?.select('amount_fiat, amount_crypto, currency_crypto, status')
        ?.eq('status', 'completed');

      const { data: payouts, error: payoutsError } = await supabase
        ?.from('payouts')
        ?.select('amount, currency, status')
        ?.in('status', ['completed', 'processing']);

      if (paymentsError || payoutsError) {
        return { 
          data: null, 
          error: paymentsError || payoutsError 
        };
      }

      // Calculate available balance by currency
      const balance = {};

      // Add incoming amounts from completed payments
      payments?.forEach(payment => {
        const currency = payment?.currency_crypto?.toLowerCase() || 'unknown';
        if (!balance[currency]) balance[currency] = 0;
        balance[currency] += parseFloat(payment?.amount_crypto || 0);
      });

      // Subtract outgoing amounts from payouts
      payouts?.forEach(payout => {
        const currency = payout?.currency?.toLowerCase() || 'unknown';
        if (!balance[currency]) balance[currency] = 0;
        balance[currency] -= parseFloat(payout?.amount || 0);
      });

      // Ensure non-negative balances and format
      Object.keys(balance)?.forEach(currency => {
        balance[currency] = Math.max(0, balance[currency])?.toFixed(8);
      });

      return { data: balance, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading available balance.' } 
      };
    }
  },

  // Get minimum payout amounts by currency
  async getMinimumPayoutAmounts() {
    try {
      // Return minimum payout amounts for different currencies
      // In a real app, this would come from configuration or API
      const minimums = {
        btc: '0.001',
        eth: '0.01',
        usdt: '10.00',
        usdc: '10.00',
        ltc: '0.1',
        xrp: '20.0'
      };

      return { data: minimums, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading minimum amounts.' } 
      };
    }
  },

  // Validate payout address
  async validatePayoutAddress(address, currency, network = 'mainnet') {
    try {
      // Basic address validation
      // In a real app, this would use proper address validation libraries
      const validations = {
        btc: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
        eth: /^0x[a-fA-F0-9]{40}$/,
        usdt: /^0x[a-fA-F0-9]{40}$|^T[A-Za-z1-9]{33}$/,
        usdc: /^0x[a-fA-F0-9]{40}$/,
        ltc: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$|^ltc1[a-z0-9]{39,59}$/,
        xrp: /^r[0-9a-zA-Z]{24,34}$/
      };

      const regex = validations[currency?.toLowerCase()];
      const isValid = regex ? regex?.test(address) : false;

      return { 
        data: { 
          isValid, 
          currency: currency?.toLowerCase(),
          network,
          address 
        }, 
        error: null 
      };
    } catch (error) {
      return { 
        data: { isValid: false }, 
        error: { message: 'Network error validating address.' } 
      };
    }
  },

  // Estimate network fees
  async estimateNetworkFee(currency, amount, priority = 'medium') {
    try {
      // Estimated network fees by currency and priority
      // In a real app, this would call fee estimation APIs
      const feeEstimates = {
        btc: { low: '0.00005', medium: '0.0001', high: '0.0002' },
        eth: { low: '0.002', medium: '0.004', high: '0.008' },
        usdt: { low: '1.0', medium: '2.0', high: '4.0' },
        usdc: { low: '1.0', medium: '2.0', high: '4.0' },
        ltc: { low: '0.0001', medium: '0.0002', high: '0.0004' },
        xrp: { low: '0.1', medium: '0.2', high: '0.4' }
      };

      const currencyFees = feeEstimates[currency?.toLowerCase()];
      const estimatedFee = currencyFees ? currencyFees[priority] : '0';

      return { 
        data: { 
          currency: currency?.toLowerCase(),
          amount: amount?.toString(),
          priority,
          estimatedFee,
          feePercentage: ((parseFloat(estimatedFee) / parseFloat(amount)) * 100)?.toFixed(4)
        }, 
        error: null 
      };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error estimating fees.' } 
      };
    }
  }
};

export default payoutsService;