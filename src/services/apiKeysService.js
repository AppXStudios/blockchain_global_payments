import { supabase } from '../lib/supabase';

// API Keys service for BGP API key management
export const apiKeysService = {
  // Get all API keys for current user
  async getApiKeys() {
    try {
      const { data, error } = await supabase
        ?.from('api_keys')
        ?.select(`
          id,
          key_name,
          key_prefix,
          status,
          permissions,
          ip_whitelist,
          last_used_at,
          expires_at,
          created_at,
          updated_at
        `)
        ?.order('created_at', { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading API keys.' } 
      };
    }
  },

  // Create new API key
  async createApiKey(keyData) {
    try {
      // Generate key hash and prefix
      const keyPrefix = 'bgp_live_';
      const keySecret = Array.from(crypto?.getRandomValues(new Uint8Array(32)))
        ?.map(b => b?.toString(16)?.padStart(2, '0'))
        ?.join('');
      const keyHash = await crypto?.subtle?.digest('SHA-256', new TextEncoder()?.encode(keySecret))
        ?.then(buffer => Array.from(new Uint8Array(buffer))
        ?.map(b => b?.toString(16)?.padStart(2, '0'))
        ?.join(''));

      const { data, error } = await supabase
        ?.from('api_keys')
        ?.insert([{
          key_name: keyData?.name,
          key_prefix: keyPrefix,
          key_hash: keyHash,
          permissions: keyData?.permissions || ['read', 'write'],
          ip_whitelist: keyData?.ipWhitelist || [],
          expires_at: keyData?.expiresAt || null,
          status: 'active'
        }])
        ?.select()
        ?.single();

      if (error) {
        return { data: null, error };
      }

      // Return the key with the secret (only shown once)
      return { 
        data: {
          ...data,
          key_secret: `${keyPrefix}${keySecret}` // Full key shown only on creation
        }, 
        error: null 
      };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error creating API key.' } 
      };
    }
  },

  // Update API key
  async updateApiKey(keyId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('api_keys')
        ?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', keyId)
        ?.select(`
          id,
          key_name,
          key_prefix,
          status,
          permissions,
          ip_whitelist,
          last_used_at,
          expires_at,
          created_at,
          updated_at
        `)
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error updating API key.' } 
      };
    }
  },

  // Revoke API key
  async revokeApiKey(keyId) {
    try {
      const { data, error } = await supabase
        ?.from('api_keys')
        ?.update({ 
          status: 'revoked',
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', keyId)
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error revoking API key.' } 
      };
    }
  },

  // Delete API key
  async deleteApiKey(keyId) {
    try {
      const { error } = await supabase
        ?.from('api_keys')
        ?.delete()
        ?.eq('id', keyId);

      return { error };
    } catch (error) {
      return { error: { message: 'Network error deleting API key.' } };
    }
  },

  // Get API key usage analytics
  async getApiKeyUsage(keyId = null, period = '30d') {
    try {
      const dateFilter = new Date();
      if (period === '7d') {
        dateFilter?.setDate(dateFilter?.getDate() - 7);
      } else if (period === '30d') {
        dateFilter?.setDate(dateFilter?.getDate() - 30);
      } else if (period === '90d') {
        dateFilter?.setDate(dateFilter?.getDate() - 90);
      }

      // Get audit logs for API key usage
      let query = supabase
        ?.from('audit_logs')
        ?.select('action, meta, created_at')
        ?.eq('action', 'api_key_used')
        ?.gte('created_at', dateFilter?.toISOString())
        ?.order('created_at', { ascending: false });

      if (keyId) {
        query = query?.eq('meta->api_key_id', keyId);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error };
      }

      // Calculate usage statistics
      const usage = {
        totalRequests: data?.length || 0,
        requestsByDay: {},
        endpointUsage: {},
        ipAddresses: new Set(),
        errorRate: 0
      };

      data?.forEach(log => {
        const date = log?.created_at?.split('T')?.[0];
        usage.requestsByDay[date] = (usage?.requestsByDay?.[date] || 0) + 1;

        if (log?.meta?.endpoint) {
          usage.endpointUsage[log?.meta?.endpoint] = (usage?.endpointUsage?.[log?.meta?.endpoint] || 0) + 1;
        }

        if (log?.meta?.ip_address) {
          usage?.ipAddresses?.add(log?.meta?.ip_address);
        }
      });

      usage.ipAddresses = Array.from(usage?.ipAddresses);

      return { data: usage, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading API key usage.' } 
      };
    }
  },

  // Get security audit logs for API keys
  async getSecurityAuditLogs(limit = 50) {
    try {
      const { data, error } = await supabase
        ?.from('audit_logs')
        ?.select('*')
        ?.in('action', ['api_key_created', 'api_key_updated', 'api_key_revoked', 'api_key_deleted', 'api_key_used'])
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      return { data: data || [], error };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading security audit logs.' } 
      };
    }
  }
};

export default apiKeysService;