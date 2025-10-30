import { supabase } from '../lib/supabase';

// Conversions service for BGP conversion management
export const conversionsService = {
  // Get conversion data (payments with exchange rates and conversion details)
  async getConversions(filters = {}) {
    try {
      let query = supabase
        ?.from('payments')
        ?.select(`
          id,
          payment_id,
          amount_fiat,
          amount_crypto,
          amount_received,
          currency_fiat,
          currency_crypto,
          exchange_rate,
          fee_amount,
          fee_currency,
          status,
          created_at,
          confirmed_at,
          paid_at,
          description,
          network
        `)
        ?.not('exchange_rate', 'is', null)
        ?.not('currency_crypto', 'is', null)
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
      if (filters?.currencyPair) {
        const [fiat, crypto] = filters?.currencyPair?.split('/');
        if (fiat) query = query?.eq('currency_fiat', fiat);
        if (crypto) query = query?.eq('currency_crypto', crypto);
      }
      if (filters?.minRate && filters?.maxRate) {
        query = query?.gte('exchange_rate', filters?.minRate)?.lte('exchange_rate', filters?.maxRate);
      }
      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;
      return { data: data || [], error };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading conversion data.' } 
      };
    }
  },

  // Get current market rates (latest conversion rates from recent payments)
  async getCurrentMarketRates() {
    try {
      const { data, error } = await supabase
        ?.from('payments')
        ?.select('currency_fiat, currency_crypto, exchange_rate, created_at')
        ?.not('exchange_rate', 'is', null)
        ?.not('currency_crypto', 'is', null)
        ?.order('created_at', { ascending: false })
        ?.limit(50);

      if (error) {
        return { data: [], error };
      }

      // Group by currency pair and get latest rates
      const ratesByPair = {};
      data?.forEach(payment => {
        const pair = `${payment?.currency_crypto}/${payment?.currency_fiat}`;
        if (!ratesByPair?.[pair] || new Date(payment?.created_at) > new Date(ratesByPair[pair]?.created_at)) {
          ratesByPair[pair] = {
            pair,
            rate: payment?.exchange_rate,
            lastUpdated: payment?.created_at,
            cryptoCurrency: payment?.currency_crypto,
            fiatCurrency: payment?.currency_fiat
          };
        }
      });

      return { data: Object.values(ratesByPair), error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading market rates.' } 
      };
    }
  },

  // Get conversion statistics
  async getConversionStats(period = '30d') {
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
        ?.select('amount_fiat, amount_crypto, fee_amount, currency_fiat, currency_crypto, exchange_rate, status, created_at')
        ?.not('exchange_rate', 'is', null)
        ?.not('currency_crypto', 'is', null)
        ?.gte('created_at', dateFilter?.toISOString());

      if (error) {
        return { data: null, error };
      }

      // Calculate conversion statistics
      const stats = {
        totalConversions: data?.length || 0,
        totalVolumeFiat: 0,
        totalVolumeCrypto: 0,
        totalFees: 0,
        completedConversions: 0,
        averageRate: 0,
        currencyPairs: new Set()
      };

      let totalRates = 0;
      let rateCount = 0;

      data?.forEach(conversion => {
        stats.totalVolumeFiat += parseFloat(conversion?.amount_fiat || 0);
        stats.totalVolumeCrypto += parseFloat(conversion?.amount_crypto || 0);
        stats.totalFees += parseFloat(conversion?.fee_amount || 0);
        
        if (conversion?.status === 'completed') {
          stats.completedConversions += 1;
        }
        
        if (conversion?.exchange_rate) {
          totalRates += parseFloat(conversion?.exchange_rate);
          rateCount += 1;
        }

        if (conversion?.currency_crypto && conversion?.currency_fiat) {
          stats?.currencyPairs?.add(`${conversion?.currency_crypto}/${conversion?.currency_fiat}`);
        }
      });

      stats.averageRate = rateCount > 0 ? totalRates / rateCount : 0;
      stats.currencyPairs = Array.from(stats?.currencyPairs);

      return { data: stats, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading conversion statistics.' } 
      };
    }
  },

  // Get historical rate data for charts
  async getHistoricalRates(currencyPair, days = 30) {
    try {
      const dateFilter = new Date();
      dateFilter?.setDate(dateFilter?.getDate() - days);

      const [crypto, fiat] = currencyPair?.split('/');
      
      const { data, error } = await supabase
        ?.from('payments')
        ?.select('exchange_rate, created_at, currency_fiat, currency_crypto')
        ?.eq('currency_fiat', fiat)
        ?.eq('currency_crypto', crypto)
        ?.not('exchange_rate', 'is', null)
        ?.gte('created_at', dateFilter?.toISOString())
        ?.order('created_at', { ascending: true });

      if (error) {
        return { data: [], error };
      }

      // Group by date and calculate daily averages
      const ratesByDate = {};
      data?.forEach(payment => {
        const date = payment?.created_at?.split('T')?.[0];
        if (!ratesByDate?.[date]) {
          ratesByDate[date] = {
            date,
            rates: [],
            count: 0
          };
        }
        ratesByDate?.[date]?.rates?.push(parseFloat(payment?.exchange_rate));
        ratesByDate[date].count += 1;
      });

      const historicalRates = Object.values(ratesByDate)?.map(dayData => ({
        date: dayData?.date,
        rate: dayData?.rates?.reduce((sum, rate) => sum + rate, 0) / dayData?.count,
        count: dayData?.count
      }));

      return { data: historicalRates, error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading historical rates.' } 
      };
    }
  },

  // Get available currency pairs
  async getCurrencyPairs() {
    try {
      const { data, error } = await supabase
        ?.from('payments')
        ?.select('currency_fiat, currency_crypto')
        ?.not('currency_crypto', 'is', null)
        ?.not('currency_fiat', 'is', null);

      if (error) {
        return { data: [], error };
      }

      const pairs = new Set();
      data?.forEach(payment => {
        if (payment?.currency_crypto && payment?.currency_fiat) {
          pairs?.add(`${payment?.currency_crypto}/${payment?.currency_fiat}`);
        }
      });

      return { data: Array.from(pairs), error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading currency pairs.' } 
      };
    }
  }
};

export default conversionsService;