import { supabase } from '../lib/supabase';

// Live payments service for real-time payment processing
export const livePaymentsService = {
  // Create a live payment session
  async createPaymentSession(paymentData) {
    try {
      const { data: user } = await supabase?.auth?.getUser();
      if (!user?.user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      // Generate unique payment session
      const sessionId = `session_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`;

      const { data, error } = await supabase
        ?.from('payments')
        ?.insert([{
          payment_id: sessionId,
          merchant_id: user?.user?.id,
          amount_fiat: paymentData?.amount,
          currency_fiat: paymentData?.currency || 'USD',
          currency_crypto: paymentData?.cryptoCurrency?.toLowerCase(),
          description: paymentData?.description || 'Live payment',
          callback_url: paymentData?.callbackUrl,
          success_url: paymentData?.successUrl,
          cancel_url: paymentData?.cancelUrl,
          metadata: {
            ...paymentData?.metadata,
            session_type: 'live',
            created_via: 'live_payment_form'
          },
          expires_at: new Date(Date.now() + (paymentData?.expirationMinutes || 30) * 60 * 1000)?.toISOString()
        }])
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error creating payment session.' } 
      };
    }
  },

  // Update payment with blockchain details
  async updatePaymentBlockchainData(paymentId, blockchainData) {
    try {
      const { data, error } = await supabase
        ?.from('payments')
        ?.update({
          amount_crypto: blockchainData?.amount,
          pay_address: blockchainData?.address,
          network: blockchainData?.network || 'mainnet',
          exchange_rate: blockchainData?.exchangeRate,
          required_confirmations: blockchainData?.requiredConfirmations || 1,
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', paymentId)
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error updating payment blockchain data.' } 
      };
    }
  },

  // Process payment confirmation
  async confirmPayment(paymentId, confirmationData) {
    try {
      const { data, error } = await supabase
        ?.from('payments')
        ?.update({
          status: 'completed',
          tx_hash: confirmationData?.txHash,
          block_number: confirmationData?.blockNumber,
          confirmations: confirmationData?.confirmations || 1,
          amount_received: confirmationData?.amountReceived,
          confirmed_at: new Date()?.toISOString(),
          paid_at: new Date()?.toISOString(),
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', paymentId)
        ?.eq('status', 'pending')
        ?.select()
        ?.single();

      // Log the confirmation
      if (data && !error) {
        await supabase
          ?.from('payment_logs')
          ?.insert([{
            payment_id: paymentId,
            status: 'completed',
            message: `Payment confirmed with transaction ${confirmationData?.txHash}`,
            data: confirmationData
          }]);
      }

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error confirming payment.' } 
      };
    }
  },

  // Mark payment as failed
  async failPayment(paymentId, reason, errorData = {}) {
    try {
      const { data, error } = await supabase
        ?.from('payments')
        ?.update({
          status: 'failed',
          failed_at: new Date()?.toISOString(),
          metadata: { 
            failure_reason: reason,
            error_data: errorData,
            failed_by_system: true
          },
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', paymentId)
        ?.select()
        ?.single();

      // Log the failure
      if (data && !error) {
        await supabase
          ?.from('payment_logs')
          ?.insert([{
            payment_id: paymentId,
            status: 'failed',
            message: `Payment failed: ${reason}`,
            data: { reason, ...errorData }
          }]);
      }

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error marking payment as failed.' } 
      };
    }
  },

  // Get live payment status with real-time updates
  async getPaymentStatus(paymentId) {
    try {
      const { data, error } = await supabase
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
        ?.eq('id', paymentId)
        ?.single();

      if (error) {
        return { data: null, error };
      }

      // Add computed fields
      const enrichedData = {
        ...data,
        is_expired: data?.expires_at ? new Date(data?.expires_at) < new Date() : false,
        time_remaining: data?.expires_at ? Math.max(0, new Date(data?.expires_at) - new Date()) : 0,
        confirmation_progress: data?.required_confirmations > 0 
          ? (data?.confirmations || 0) / data?.required_confirmations 
          : 0
      };

      return { data: enrichedData, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading payment status.' } 
      };
    }
  },

  // Subscribe to payment status updates
  subscribeToPaymentUpdates(paymentId, callback) {
    const subscription = supabase
      ?.channel(`payment_${paymentId}`)
      ?.on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'payments', 
          filter: `id=eq.${paymentId}` 
        }, 
        (payload) => {
          callback(payload?.new);
        }
      )
      ?.subscribe();

    return subscription;
  },

  // Unsubscribe from payment updates
  unsubscribeFromPaymentUpdates(subscription) {
    if (subscription) {
      supabase?.removeChannel(subscription);
    }
  },

  // Get supported cryptocurrencies for live payments
  async getSupportedCryptocurrencies() {
    try {
      // In a real implementation, this would come from configuration or API
      const supportedCurrencies = [
        { 
          symbol: 'BTC', 
          name: 'Bitcoin', 
          network: 'bitcoin',
          minAmount: '0.001',
          confirmations: 1,
          icon: '₿'
        },
        { 
          symbol: 'ETH', 
          name: 'Ethereum', 
          network: 'ethereum',
          minAmount: '0.01',
          confirmations: 12,
          icon: 'Ξ'
        },
        { 
          symbol: 'USDT', 
          name: 'Tether USD', 
          network: 'ethereum',
          minAmount: '10',
          confirmations: 12,
          icon: '₮'
        },
        { 
          symbol: 'USDC', 
          name: 'USD Coin', 
          network: 'ethereum',
          minAmount: '10',
          confirmations: 12,
          icon: '$'
        },
        { 
          symbol: 'LTC', 
          name: 'Litecoin', 
          network: 'litecoin',
          minAmount: '0.1',
          confirmations: 6,
          icon: 'Ł'
        }
      ];

      return { data: supportedCurrencies, error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading supported currencies.' } 
      };
    }
  },

  // Get current exchange rates
  async getExchangeRates(baseCurrency = 'USD') {
    try {
      // In a real implementation, this would call external APIs like CoinGecko or CoinMarketCap
      // For demo purposes, returning mock rates that would be live in production
      
      const rates = {
        BTC: 42000.50,
        ETH: 2500.25,
        USDT: 1.00,
        USDC: 1.00,
        LTC: 70.15,
        XRP: 0.52
      };

      const formattedRates = Object.entries(rates)?.map(([symbol, rate]) => ({
        symbol,
        rate,
        baseCurrency,
        lastUpdated: new Date()?.toISOString(),
        change24h: (Math.random() - 0.5) * 10 // Random change for demo
      }));

      return { data: formattedRates, error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading exchange rates.' } 
      };
    }
  },

  // Calculate payment amount in crypto
  calculateCryptoAmount(fiatAmount, exchangeRate) {
    try {
      const cryptoAmount = parseFloat(fiatAmount) / parseFloat(exchangeRate);
      return {
        amount: cryptoAmount,
        formatted: cryptoAmount?.toFixed(8),
        rate: parseFloat(exchangeRate)
      };
    } catch (error) {
      return {
        amount: 0,
        formatted: '0.00000000',
        rate: 0
      };
    }
  },

  // Validate payment parameters
  validatePaymentData(paymentData) {
    const errors = [];

    if (!paymentData?.amount || parseFloat(paymentData?.amount) <= 0) {
      errors?.push('Amount must be greater than zero');
    }

    if (!paymentData?.currency) {
      errors?.push('Currency is required');
    }

    if (!paymentData?.cryptoCurrency) {
      errors?.push('Cryptocurrency selection is required');
    }

    if (paymentData?.amount && parseFloat(paymentData?.amount) > 50000) {
      errors?.push('Amount exceeds maximum limit of $50,000');
    }

    if (paymentData?.amount && parseFloat(paymentData?.amount) < 1) {
      errors?.push('Amount must be at least $1.00');
    }

    return {
      isValid: errors?.length === 0,
      errors
    };
  }
};

export default livePaymentsService;