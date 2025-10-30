import { supabase } from '../lib/supabase';

// Payments service for BGP payment management
export const paymentsService = {
  // Get all payments for current user
  async getPayments(filters = {}) {
    try {
      let query = supabase
        ?.from('payments')
        ?.select(`
          *,
          payment_logs (
            id,
            status,
            message,
            created_at
          )
        `)
        ?.order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status) {
        query = query?.eq('status', filters?.status);
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
        error: { message: 'Network error loading payments.' } 
      };
    }
  },

  // Get single payment by ID
  async getPayment(paymentId) {
    try {
      const { data, error } = await supabase
        ?.from('payments')
        ?.select(`
          *,
          payment_logs (
            id,
            status,
            message,
            data,
            created_at
          )
        `)
        ?.eq('id', paymentId)
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading payment details.' } 
      };
    }
  },

  // Create new payment
  async createPayment(paymentData) {
    try {
      const { data, error } = await supabase
        ?.from('payments')
        ?.insert([{
          payment_id: `bgp_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`,
          amount_fiat: paymentData?.amountFiat,
          currency_fiat: paymentData?.currencyFiat,
          currency_crypto: paymentData?.currencyCrypto,
          description: paymentData?.description,
          callback_url: paymentData?.callbackUrl,
          success_url: paymentData?.successUrl,
          cancel_url: paymentData?.cancelUrl,
          metadata: paymentData?.metadata || {},
          expires_at: paymentData?.expiresAt
        }])
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error creating payment.' } 
      };
    }
  },

  // Update payment status
  async updatePaymentStatus(paymentId, status, additionalData = {}) {
    try {
      const { data, error } = await supabase
        ?.from('payments')
        ?.update({
          status,
          ...additionalData,
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', paymentId)
        ?.select()
        ?.single();

      // Log the status change
      if (data && !error) {
        await supabase
          ?.from('payment_logs')
          ?.insert([{
            payment_id: paymentId,
            status,
            message: `Payment status updated to ${status}`,
            data: additionalData
          }]);
      }

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error updating payment status.' } 
      };
    }
  },

  // Get payment statistics
  async getPaymentStats(period = '30d') {
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
        ?.from('payments')
        ?.select('amount_fiat, currency_fiat, status, created_at')
        ?.gte('created_at', dateFilter?.toISOString());

      if (error) {
        return { data: null, error };
      }

      // Calculate statistics
      const stats = {
        totalRevenue: 0,
        totalTransactions: data?.length || 0,
        successfulPayments: 0,
        failedPayments: 0,
        pendingPayments: 0,
        conversionRate: 0
      };

      data?.forEach(payment => {
        if (payment?.status === 'completed') {
          stats.totalRevenue += parseFloat(payment?.amount_fiat || 0);
          stats.successfulPayments += 1;
        } else if (payment?.status === 'failed') {
          stats.failedPayments += 1;
        } else if (payment?.status === 'pending') {
          stats.pendingPayments += 1;
        }
      });

      stats.conversionRate = stats?.totalTransactions > 0 
        ? (stats?.successfulPayments / stats?.totalTransactions) * 100 
        : 0;

      return { data: stats, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading payment statistics.' } 
      };
    }
  },

  // Get recent transactions
  async getRecentTransactions(limit = 10) {
    try {
      const { data, error } = await supabase
        ?.from('payments')
        ?.select('id, payment_id, amount_fiat, currency_fiat, status, created_at, description')
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      return { data: data || [], error };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading recent transactions.' } 
      };
    }
  }
};

export default paymentsService;