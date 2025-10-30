import { supabase } from '../lib/supabase';

// Subscriptions service for BGP subscription management
export const subscriptionsService = {
  // Get all subscription plans
  async getSubscriptionPlans(filters = {}) {
    try {
      let query = supabase
        ?.from('subscription_plans')
        ?.select('*')
        ?.order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }
      if (filters?.billing_interval) {
        query = query?.eq('billing_interval', filters?.billing_interval);
      }

      const { data, error } = await query;
      return { data: data || [], error };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading subscription plans.' } 
      };
    }
  },

  // Get all subscriptions
  async getSubscriptions(filters = {}) {
    try {
      let query = supabase
        ?.from('subscriptions')
        ?.select(`
          *,
          subscription_plans (
            name,
            description,
            amount,
            currency,
            billing_interval
          ),
          subscriber:subscriber_id (
            full_name,
            email
          )
        `)
        ?.order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }
      if (filters?.plan_id) {
        query = query?.eq('plan_id', filters?.plan_id);
      }
      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;
      return { data: data || [], error };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading subscriptions.' } 
      };
    }
  },

  // Create new subscription plan
  async createSubscriptionPlan(planData) {
    try {
      const { data, error } = await supabase
        ?.from('subscription_plans')
        ?.insert([{
          plan_id: `plan_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`,
          name: planData?.name,
          description: planData?.description,
          amount: planData?.amount,
          currency: planData?.currency || 'USD',
          billing_interval: planData?.billing_interval || 'monthly',
          trial_days: planData?.trial_days || 0,
          max_subscribers: planData?.max_subscribers,
          features: planData?.features || [],
          metadata: planData?.metadata || {}
        }])
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error creating subscription plan.' } 
      };
    }
  },

  // Update subscription plan  
  async updateSubscriptionPlan(planId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('subscription_plans')
        ?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', planId)
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error updating subscription plan.' } 
      };
    }
  },

  // Create new subscription
  async createSubscription(subscriptionData) {
    try {
      const { data, error } = await supabase
        ?.from('subscriptions')
        ?.insert([{
          subscription_id: await this.generateSubscriptionId(),
          plan_id: subscriptionData?.plan_id,
          subscriber_id: subscriptionData?.subscriber_id,
          merchant_id: subscriptionData?.merchant_id,
          subscriber_email: subscriptionData?.subscriber_email,
          billing_amount: subscriptionData?.billing_amount,
          billing_currency: subscriptionData?.billing_currency || 'USD',
          current_period_start: subscriptionData?.current_period_start || new Date()?.toISOString(),
          current_period_end: subscriptionData?.current_period_end,
          next_billing_date: subscriptionData?.next_billing_date,
          trial_start: subscriptionData?.trial_start,
          trial_end: subscriptionData?.trial_end,
          payment_method: subscriptionData?.payment_method || {},
          metadata: subscriptionData?.metadata || {}
        }])
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error creating subscription.' } 
      };
    }
  },

  // Update subscription status
  async updateSubscriptionStatus(subscriptionId, status, additionalData = {}) {
    try {
      const updateData = {
        status,
        ...additionalData,
        updated_at: new Date()?.toISOString()
      };

      // Add timestamp for status changes
      if (status === 'cancelled') {
        updateData.cancelled_at = new Date()?.toISOString();
      } else if (status === 'paused') {
        updateData.paused_at = new Date()?.toISOString();
      } else if (status === 'active' && additionalData?.was_paused) {
        updateData.resumed_at = new Date()?.toISOString();
        updateData.paused_at = null;
      }

      const { data, error } = await supabase
        ?.from('subscriptions')
        ?.update(updateData)
        ?.eq('id', subscriptionId)
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error updating subscription status.' } 
      };
    }
  },

  // Get subscription analytics
  async getSubscriptionAnalytics(filters = {}) {
    try {
      const dateFilter = new Date();
      const period = filters?.period || '30d';
      
      if (period === '7d') {
        dateFilter?.setDate(dateFilter?.getDate() - 7);
      } else if (period === '30d') {
        dateFilter?.setDate(dateFilter?.getDate() - 30);
      } else if (period === '90d') {
        dateFilter?.setDate(dateFilter?.getDate() - 90);
      }

      let query = supabase
        ?.from('subscription_analytics')
        ?.select(`
          *,
          subscription_plans (
            name,
            amount,
            currency
          )
        `)
        ?.gte('date', dateFilter?.toISOString()?.split('T')?.[0])
        ?.order('date', { ascending: true });

      if (filters?.plan_id) {
        query = query?.eq('plan_id', filters?.plan_id);
      }

      const { data, error } = await query;
      
      // Calculate summary metrics
      if (data && !error) {
        const summary = {
          totalActiveSubscriptions: 0,
          totalNewSubscriptions: 0,
          totalCancelledSubscriptions: 0,
          totalMRR: 0,
          averageChurnRate: 0,
          averageARPU: 0
        };

        data?.forEach(record => {
          summary.totalActiveSubscriptions = Math.max(summary?.totalActiveSubscriptions, record?.active_subscriptions || 0);
          summary.totalNewSubscriptions += record?.new_subscriptions || 0;
          summary.totalCancelledSubscriptions += record?.cancelled_subscriptions || 0;
          summary.totalMRR += record?.monthly_recurring_revenue || 0;
          summary.averageChurnRate += record?.churn_rate || 0;
          summary.averageARPU += record?.average_revenue_per_user || 0;
        });

        if (data?.length > 0) {
          summary.averageChurnRate = summary?.averageChurnRate / data?.length;
          summary.averageARPU = summary?.averageARPU / data?.length;
          summary.totalMRR = summary?.totalMRR / data?.length; // Get average MRR
        }

        return { data: { records: data, summary }, error };
      }

      return { data: { records: data || [], summary: {} }, error };
    } catch (error) {
      return { 
        data: { records: [], summary: {} }, 
        error: { message: 'Network error loading subscription analytics.' } 
      };
    }
  },

  // Get subscription revenue trends
  async getRevenueTrends(period = '30d') {
    try {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate?.setDate(startDate?.getDate() - days);

      const { data, error } = await supabase
        ?.from('subscription_analytics')
        ?.select('date, monthly_recurring_revenue, active_subscriptions, new_subscriptions, cancelled_subscriptions')
        ?.gte('date', startDate?.toISOString()?.split('T')?.[0])
        ?.order('date', { ascending: true });

      if (error) {
        return { data: [], error };
      }

      // Fill in missing dates with 0
      const chartData = [];
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date?.setDate(date?.getDate() - (days - 1 - i));
        const dateStr = date?.toISOString()?.split('T')?.[0];
        
        const existingData = data?.find(record => record?.date === dateStr);
        chartData?.push({
          date: date?.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
          revenue: existingData?.monthly_recurring_revenue || 0,
          activeSubscriptions: existingData?.active_subscriptions || 0,
          newSubscriptions: existingData?.new_subscriptions || 0,
          cancelledSubscriptions: existingData?.cancelled_subscriptions || 0
        });
      }

      return { data: chartData, error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading revenue trends.' } 
      };
    }
  },

  // Get upcoming renewals
  async getUpcomingRenewals(days = 7) {
    try {
      const endDate = new Date();
      endDate?.setDate(endDate?.getDate() + days);

      const { data, error } = await supabase
        ?.from('subscriptions')
        ?.select(`
          *,
          subscription_plans (
            name,
            amount,
            currency
          )
        `)
        ?.eq('status', 'active')
        ?.gte('next_billing_date', new Date()?.toISOString())
        ?.lte('next_billing_date', endDate?.toISOString())
        ?.order('next_billing_date', { ascending: true });

      return { data: data || [], error };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading upcoming renewals.' } 
      };
    }
  },

  // Generate subscription ID
  async generateSubscriptionId() {
    return `sub_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`;
  },

  // Cancel subscription
  async cancelSubscription(subscriptionId, reason = '') {
    try {
      const { data, error } = await this.updateSubscriptionStatus(subscriptionId, 'cancelled', {
        cancelled_at: new Date()?.toISOString(),
        metadata: { cancellation_reason: reason }
      });

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error cancelling subscription.' } 
      };
    }
  },

  // Pause subscription
  async pauseSubscription(subscriptionId) {
    try {
      const { data, error } = await this.updateSubscriptionStatus(subscriptionId, 'paused', {
        paused_at: new Date()?.toISOString()
      });

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error pausing subscription.' } 
      };
    }
  },

  // Resume subscription
  async resumeSubscription(subscriptionId) {
    try {
      const { data, error } = await this.updateSubscriptionStatus(subscriptionId, 'active', {
        was_paused: true,
        resumed_at: new Date()?.toISOString()
      });

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error resuming subscription.' } 
      };
    }
  }
};

export default subscriptionsService;