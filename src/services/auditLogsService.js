import { supabase } from '../lib/supabase';

// Audit Logs service for BGP security and compliance logging
export const auditLogsService = {
  // Get audit logs for current user
  async getAuditLogs(filters = {}) {
    try {
      let query = supabase
        ?.from('audit_logs')
        ?.select('*')
        ?.order('created_at', { ascending: false });

      // Apply filters
      if (filters?.action) {
        query = query?.eq('action', filters?.action);
      }
      if (filters?.dateFrom) {
        query = query?.gte('created_at', filters?.dateFrom);
      }
      if (filters?.dateTo) {
        query = query?.lte('created_at', filters?.dateTo);
      }
      if (filters?.actorId) {
        query = query?.eq('actor_id', filters?.actorId);
      }
      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;
      return { data: data || [], error };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading audit logs.' } 
      };
    }
  },

  // Create new audit log entry
  async createAuditLog(logData) {
    try {
      const { data: user } = await supabase?.auth?.getUser();
      
      const { data, error } = await supabase
        ?.from('audit_logs')
        ?.insert([{
          actor_id: user?.user?.id || logData?.actorId,
          action: logData?.action,
          meta: {
            ...logData?.meta,
            ip_address: logData?.ipAddress,
            user_agent: logData?.userAgent,
            timestamp: new Date()?.toISOString()
          }
        }])
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error creating audit log.' } 
      };
    }
  },

  // Log user authentication events
  async logAuthEvent(action, metadata = {}) {
    return this.createAuditLog({
      action: `auth_${action}`, // auth_login, auth_logout, auth_failed, etc.
      meta: {
        event_type: 'authentication',
        ...metadata
      }
    });
  },

  // Log payment events
  async logPaymentEvent(action, paymentId, metadata = {}) {
    return this.createAuditLog({
      action: `payment_${action}`, // payment_created, payment_completed, etc.
      meta: {
        event_type: 'payment',
        payment_id: paymentId,
        ...metadata
      }
    });
  },

  // Log API key events
  async logApiKeyEvent(action, apiKeyId, metadata = {}) {
    return this.createAuditLog({
      action: `api_key_${action}`, // api_key_created, api_key_used, etc.
      meta: {
        event_type: 'api_key',
        api_key_id: apiKeyId,
        ...metadata
      }
    });
  },

  // Log payout events
  async logPayoutEvent(action, payoutId, metadata = {}) {
    return this.createAuditLog({
      action: `payout_${action}`, // payout_created, payout_confirmed, etc.
      meta: {
        event_type: 'payout',
        payout_id: payoutId,
        ...metadata
      }
    });
  },

  // Log webhook events
  async logWebhookEvent(action, webhookId, metadata = {}) {
    return this.createAuditLog({
      action: `webhook_${action}`, // webhook_created, webhook_delivered, etc.
      meta: {
        event_type: 'webhook',
        webhook_id: webhookId,
        ...metadata
      }
    });
  },

  // Log settings changes
  async logSettingsEvent(action, settingType, metadata = {}) {
    return this.createAuditLog({
      action: `settings_${action}`, // settings_updated, settings_reset, etc.
      meta: {
        event_type: 'settings',
        setting_type: settingType,
        ...metadata
      }
    });
  },

  // Get audit log statistics
  async getAuditStats(period = '30d') {
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
        ?.from('audit_logs')
        ?.select('action, created_at, meta')
        ?.gte('created_at', dateFilter?.toISOString());

      if (error) {
        return { data: null, error };
      }

      // Calculate statistics
      const stats = {
        total_events: data?.length || 0,
        events_by_action: {},
        events_by_type: {},
        events_by_day: {},
        unique_actors: new Set(),
        security_events: 0,
        recent_events: 0 // Last 24 hours
      };

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      data?.forEach(log => {
        // Count by action
        stats.events_by_action[log?.action] = (stats?.events_by_action?.[log?.action] || 0) + 1;

        // Count by event type
        const eventType = log?.meta?.event_type || 'unknown';
        stats.events_by_type[eventType] = (stats?.events_by_type?.[eventType] || 0) + 1;

        // Count by day
        const date = log?.created_at?.split('T')?.[0];
        stats.events_by_day[date] = (stats?.events_by_day?.[date] || 0) + 1;

        // Track unique actors
        if (log?.actor_id) {
          stats?.unique_actors?.add(log?.actor_id);
        }

        // Count security-related events
        if (log?.action?.includes('auth_') || log?.action?.includes('api_key_')) {
          stats.security_events += 1;
        }

        // Count recent events
        if (new Date(log?.created_at) > oneDayAgo) {
          stats.recent_events += 1;
        }
      });

      stats.unique_actors = stats?.unique_actors?.size;

      return { data: stats, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading audit statistics.' } 
      };
    }
  },

  // Get security alerts based on audit logs
  async getSecurityAlerts() {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      const { data, error } = await supabase
        ?.from('audit_logs')
        ?.select('*')
        ?.gte('created_at', oneHourAgo?.toISOString())
        ?.in('action', [
          'auth_failed',
          'api_key_unauthorized',
          'payment_suspicious',
          'settings_security_changed'
        ]);

      if (error) {
        return { data: [], error };
      }

      // Analyze for potential security issues
      const alerts = [];
      const failedLogins = data?.filter(log => log?.action === 'auth_failed');
      const unauthorizedApiCalls = data?.filter(log => log?.action === 'api_key_unauthorized');

      // Multiple failed login attempts
      if (failedLogins?.length >= 5) {
        alerts?.push({
          type: 'security',
          severity: 'high',
          title: 'Multiple Failed Login Attempts',
          message: `${failedLogins?.length} failed login attempts in the last hour`,
          timestamp: new Date()?.toISOString(),
          action_required: true
        });
      }

      // Unauthorized API access attempts
      if (unauthorizedApiCalls?.length >= 10) {
        alerts?.push({
          type: 'security',
          severity: 'medium',
          title: 'Suspicious API Activity',
          message: `${unauthorizedApiCalls?.length} unauthorized API calls detected`,
          timestamp: new Date()?.toISOString(),
          action_required: true
        });
      }

      return { data: alerts, error: null };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading security alerts.' } 
      };
    }
  },

  // Export audit logs for compliance
  async exportAuditLogs(filters = {}) {
    try {
      const { data, error } = await this.getAuditLogs({
        ...filters,
        limit: 10000 // Large limit for export
      });

      if (error) {
        return { data: null, error };
      }

      // Format for export
      const exportData = data?.map(log => ({
        timestamp: log?.created_at,
        actor: log?.actor_id,
        action: log?.action,
        ip_address: log?.meta?.ip_address,
        user_agent: log?.meta?.user_agent,
        details: JSON.stringify(log?.meta)
      }));

      return { data: exportData, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error exporting audit logs.' } 
      };
    }
  }
};

export default auditLogsService;