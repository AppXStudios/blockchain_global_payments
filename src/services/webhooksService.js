import { supabase } from '../lib/supabase';

// Webhooks service for BGP webhook management
export const webhooksService = {
  // Get all webhooks for current user
  async getWebhooks() {
    try {
      const { data, error } = await supabase
        ?.from('webhooks')
        ?.select(`
          *,
          webhook_logs (
            id,
            event_type,
            delivery_status,
            response_status,
            response_body,
            created_at
          )
        `)
        ?.order('created_at', { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading webhooks.' } 
      };
    }
  },

  // Create new webhook endpoint
  async createWebhook(webhookData) {
    try {
      const { data, error } = await supabase
        ?.from('webhooks')
        ?.insert([{
          url: webhookData?.url,
          events: webhookData?.events || ['payment.completed', 'payment.failed'],
          secret: webhookData?.secret,
          status: 'active'
        }])
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error creating webhook.' } 
      };
    }
  },

  // Update webhook
  async updateWebhook(webhookId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('webhooks')
        ?.update(updates)
        ?.eq('id', webhookId)
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error updating webhook.' } 
      };
    }
  },

  // Delete webhook
  async deleteWebhook(webhookId) {
    try {
      const { error } = await supabase
        ?.from('webhooks')
        ?.delete()
        ?.eq('id', webhookId);

      return { error };
    } catch (error) {
      return { error: { message: 'Network error deleting webhook.' } };
    }
  },

  // Get webhook logs
  async getWebhookLogs(webhookId, limit = 50) {
    try {
      let query = supabase
        ?.from('webhook_logs')
        ?.select('*')
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      if (webhookId) {
        query = query?.eq('webhook_id', webhookId);
      }

      const { data, error } = await query;
      return { data: data || [], error };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading webhook logs.' } 
      };
    }
  },

  // Test webhook endpoint
  async testWebhook(webhookId) {
    try {
      // First get webhook details
      const { data: webhook, error: webhookError } = await supabase
        ?.from('webhooks')
        ?.select('*')
        ?.eq('id', webhookId)
        ?.single();

      if (webhookError || !webhook) {
        return { data: null, error: webhookError || { message: 'Webhook not found' } };
      }

      // Create test payload
      const testPayload = {
        event: 'webhook.test',
        webhook_id: webhookId,
        timestamp: new Date()?.toISOString(),
        data: {
          test: true,
          message: 'This is a test webhook delivery'
        }
      };

      // Log the test attempt
      await supabase
        ?.from('webhook_logs')
        ?.insert([{
          webhook_id: webhookId,
          event_type: 'webhook.test',
          payload: testPayload,
          delivery_status: 'pending'
        }]);

      return { 
        data: { 
          message: 'Test webhook queued for delivery',
          payload: testPayload 
        }, 
        error: null 
      };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error testing webhook.' } 
      };
    }
  },

  // Get webhook delivery statistics
  async getWebhookStats(webhookId = null, period = '30d') {
    try {
      const dateFilter = new Date();
      if (period === '7d') {
        dateFilter?.setDate(dateFilter?.getDate() - 7);
      } else if (period === '30d') {
        dateFilter?.setDate(dateFilter?.getDate() - 30);
      } else if (period === '90d') {
        dateFilter?.setDate(dateFilter?.getDate() - 90);
      }

      let query = supabase
        ?.from('webhook_logs')
        ?.select('delivery_status, response_status, created_at')
        ?.gte('created_at', dateFilter?.toISOString());

      if (webhookId) {
        query = query?.eq('webhook_id', webhookId);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error };
      }

      // Calculate statistics
      const stats = {
        totalDeliveries: data?.length || 0,
        successfulDeliveries: 0,
        failedDeliveries: 0,
        pendingDeliveries: 0,
        successRate: 0,
        averageResponseTime: 0
      };

      data?.forEach(log => {
        if (log?.delivery_status === 'delivered' && log?.response_status >= 200 && log?.response_status < 300) {
          stats.successfulDeliveries += 1;
        } else if (log?.delivery_status === 'failed') {
          stats.failedDeliveries += 1;
        } else if (log?.delivery_status === 'pending') {
          stats.pendingDeliveries += 1;
        }
      });

      stats.successRate = stats?.totalDeliveries > 0 
        ? (stats?.successfulDeliveries / stats?.totalDeliveries) * 100 
        : 0;

      return { data: stats, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading webhook statistics.' } 
      };
    }
  }
};

export default webhooksService;