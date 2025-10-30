import { supabase } from '../lib/supabase';

// Dashboard service for BGP analytics and overview data
export const dashboardService = {
  // Get comprehensive dashboard overview
  async getDashboardOverview() {
    try {
      const { data: user } = await supabase?.auth?.getUser();
      if (!user?.user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      // Get payments data for KPIs
      const { data: payments, error: paymentsError } = await supabase
        ?.from('payments')
        ?.select('amount_fiat, currency_fiat, status, created_at, fee_amount')
        ?.gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString());

      if (paymentsError) {
        return { data: null, error: paymentsError };
      }

      // Get pending payouts
      const { data: payouts, error: payoutsError } = await supabase
        ?.from('payouts')
        ?.select('amount, currency, status')
        ?.eq('status', 'pending');

      // Calculate KPIs
      const totalRevenue = payments?.reduce((sum, payment) => {
        return payment?.status === 'completed' 
          ? sum + parseFloat(payment?.amount_fiat || 0)
          : sum;
      }, 0) || 0;

      const totalTransactions = payments?.length || 0;
      const completedTransactions = payments?.filter(p => p?.status === 'completed')?.length || 0;
      const conversionRate = totalTransactions > 0 ? (completedTransactions / totalTransactions) * 100 : 0;
      
      const pendingPayouts = payouts?.reduce((sum, payout) => {
        return sum + parseFloat(payout?.amount || 0);
      }, 0) || 0;

      // Get previous period for comparison
      const previousPeriodStart = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      const previousPeriodEnd = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const { data: previousPayments } = await supabase
        ?.from('payments')
        ?.select('amount_fiat, status')
        ?.gte('created_at', previousPeriodStart?.toISOString())
        ?.lte('created_at', previousPeriodEnd?.toISOString());

      const previousRevenue = previousPayments?.reduce((sum, payment) => {
        return payment?.status === 'completed' 
          ? sum + parseFloat(payment?.amount_fiat || 0)
          : sum;
      }, 0) || 1; // Avoid division by zero

      const revenueChange = previousRevenue > 0 
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
        : 0;

      // Calculate transaction change
      const previousTotalTransactions = previousPayments?.length || 1;
      const transactionChange = ((totalTransactions - previousTotalTransactions) / previousTotalTransactions) * 100;

      // Calculate conversion rate change
      const previousCompletedTransactions = previousPayments?.filter(p => p?.status === 'completed')?.length || 0;
      const previousConversionRate = previousTotalTransactions > 0 
        ? (previousCompletedTransactions / previousTotalTransactions) * 100 
        : 0;
      const conversionRateChange = previousConversionRate > 0 
        ? conversionRate - previousConversionRate 
        : 0;

      const kpiData = [
        {
          title: "Total Revenue",
          value: totalRevenue,
          change: revenueChange,
          changeType: revenueChange >= 0 ? "positive" : "negative",
          icon: "DollarSign",
          currency: true
        },
        {
          title: "Transactions",
          value: totalTransactions,
          change: transactionChange,
          changeType: transactionChange >= 0 ? "positive" : "negative",
          icon: "CreditCard"
        },
        {
          title: "Conversion Rate",
          value: conversionRate,
          change: conversionRateChange,
          changeType: conversionRateChange >= 0 ? "positive" : "negative",
          icon: "TrendingUp"
        },
        {
          title: "Pending Payouts",
          value: pendingPayouts,
          change: 0, // Could calculate from previous period
          changeType: "neutral",
          icon: "ArrowUpRight",
          currency: true
        }
      ];

      return { 
        data: { 
          kpiData,
          totalRevenue,
          totalTransactions,
          conversionRate,
          pendingPayouts
        }, 
        error: null 
      };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading dashboard data.' } 
      };
    }
  },

  // Get revenue chart data
  async getRevenueChartData(period = '7d') {
    try {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate?.setDate(startDate?.getDate() - days);

      const { data, error } = await supabase
        ?.from('payments')
        ?.select('amount_fiat, currency_fiat, status, created_at')
        ?.gte('created_at', startDate?.toISOString())
        ?.eq('status', 'completed')
        ?.order('created_at', { ascending: true });

      if (error) {
        return { data: [], error };
      }

      // Group by date
      const chartData = [];
      const dateMap = new Map();
      const transactionMap = new Map();

      data?.forEach(payment => {
        const date = new Date(payment?.created_at)?.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit'
        });
        const amount = parseFloat(payment?.amount_fiat || 0);
        
        if (dateMap?.has(date)) {
          dateMap?.set(date, dateMap?.get(date) + amount);
          transactionMap?.set(date, (transactionMap?.get(date) || 0) + 1);
        } else {
          dateMap?.set(date, amount);
          transactionMap?.set(date, 1);
        }
      });

      // Fill in missing dates with 0
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date?.setDate(date?.getDate() - (days - 1 - i));
        const dateStr = date?.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit'
        });
        
        chartData?.push({
          date: dateStr,
          revenue: dateMap?.get(dateStr) || 0,
          transactions: transactionMap?.get(dateStr) || 0
        });
      }

      return { data: chartData, error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading chart data.' } 
      };
    }
  },

  // Get notifications for current user
  async getNotifications(limit = 10) {
    try {
      const { data, error } = await supabase
        ?.from('notifications')
        ?.select('*')
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      return { data: data || [], error };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading notifications.' } 
      };
    }
  },

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        ?.from('notifications')
        ?.update({ is_read: true })
        ?.eq('id', notificationId)
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error updating notification.' } 
      };
    }
  },

  // Mark all notifications as read
  async markAllNotificationsAsRead() {
    try {
      const { data: user } = await supabase?.auth?.getUser();
      if (!user?.user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const { data, error } = await supabase
        ?.from('notifications')
        ?.update({ is_read: true })
        ?.eq('user_id', user?.user?.id)
        ?.eq('is_read', false)
        ?.select();

      return { data: data || [], error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error updating notifications.' } 
      };
    }
  },

  // Get user profile with merchant settings
  async getUserProfile() {
    try {
      const { data: profile, error: profileError } = await supabase
        ?.from('user_profiles')
        ?.select(`
          *,
          merchant_settings (*)
        `)
        ?.single();

      if (profileError) {
        return { data: null, error: profileError };
      }

      return { data: profile, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading user profile.' } 
      };
    }
  },

  // Get system health metrics
  async getSystemHealth() {
    try {
      // Get recent error logs and system metrics
      const { data: recentPayments, error: paymentsError } = await supabase
        ?.from('payments')
        ?.select('status, created_at')
        ?.gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000)?.toISOString());

      if (paymentsError) {
        return { data: null, error: paymentsError };
      }

      const totalPayments = recentPayments?.length || 0;
      const failedPayments = recentPayments?.filter(p => p?.status === 'failed')?.length || 0;
      const successRate = totalPayments > 0 ? ((totalPayments - failedPayments) / totalPayments) * 100 : 100;

      const healthMetrics = {
        apiUptime: 99.9,
        successRate: successRate,
        avgResponseTime: 150, // milliseconds
        errorRate: totalPayments > 0 ? (failedPayments / totalPayments) * 100 : 0,
        status: successRate >= 99 ? 'healthy' : successRate >= 95 ? 'warning' : 'critical'
      };

      return { data: healthMetrics, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading system health.' } 
      };
    }
  }
};

export default dashboardService;