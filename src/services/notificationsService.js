import { supabase } from '../lib/supabase';

// Notifications service for BGP notification management
export const notificationsService = {
  // Get all notifications for current user
  async getNotifications(filters = {}) {
    try {
      let query = supabase
        ?.from('notifications')
        ?.select('*')
        ?.order('created_at', { ascending: false });

      // Apply filters
      if (filters?.isRead !== undefined) {
        query = query?.eq('is_read', filters?.isRead);
      }
      if (filters?.type) {
        query = query?.eq('type', filters?.type);
      }
      if (filters?.priority) {
        query = query?.eq('priority', filters?.priority);
      }
      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;
      return { data: data || [], error };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error loading notifications.' } 
      };
    }
  },

  // Create new notification
  async createNotification(notificationData) {
    try {
      const { data, error } = await supabase
        ?.from('notifications')
        ?.insert([{
          type: notificationData?.type || 'info',
          title: notificationData?.title,
          message: notificationData?.message,
          priority: notificationData?.priority || 1,
          action_url: notificationData?.actionUrl,
          action_label: notificationData?.actionLabel,
          expires_at: notificationData?.expiresAt,
          is_read: false
        }])
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error creating notification.' } 
      };
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
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
        error: { message: 'Network error marking notification as read.' } 
      };
    }
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const { data, error } = await supabase
        ?.from('notifications')
        ?.update({ is_read: true })
        ?.eq('is_read', false)
        ?.select();

      return { data: data || [], error };
    } catch (error) {
      return { 
        data: [], 
        error: { message: 'Network error marking all notifications as read.' } 
      };
    }
  },

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const { error } = await supabase
        ?.from('notifications')
        ?.delete()
        ?.eq('id', notificationId);

      return { error };
    } catch (error) {
      return { error: { message: 'Network error deleting notification.' } };
    }
  },

  // Delete all read notifications
  async deleteAllRead() {
    try {
      const { error } = await supabase
        ?.from('notifications')
        ?.delete()
        ?.eq('is_read', true);

      return { error };
    } catch (error) {
      return { error: { message: 'Network error deleting read notifications.' } };
    }
  },

  // Get notification statistics
  async getNotificationStats() {
    try {
      const { data, error } = await supabase
        ?.from('notifications')
        ?.select('type, is_read, priority, created_at');

      if (error) {
        return { data: null, error };
      }

      // Calculate statistics
      const stats = {
        total: data?.length || 0,
        unread: 0,
        read: 0,
        byType: {},
        byPriority: {},
        recent: 0 // Last 24 hours
      };

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      data?.forEach(notification => {
        // Read/unread counts
        if (notification?.is_read) {
          stats.read += 1;
        } else {
          stats.unread += 1;
        }

        // By type
        const type = notification?.type || 'info';
        stats.byType[type] = (stats?.byType?.[type] || 0) + 1;

        // By priority
        const priority = notification?.priority || 1;
        stats.byPriority[priority] = (stats?.byPriority?.[priority] || 0) + 1;

        // Recent notifications
        if (new Date(notification?.created_at) > oneDayAgo) {
          stats.recent += 1;
        }
      });

      return { data: stats, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading notification statistics.' } 
      };
    }
  },

  // Subscribe to real-time notifications
  subscribeToNotifications(callback) {
    try {
      const { data: user } = supabase?.auth?.getUser();
      
      const subscription = supabase
        ?.channel('notifications')
        ?.on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user?.user?.id}`
        }, (payload) => {
          callback?.(payload?.new);
        })
        ?.subscribe();

      return subscription;
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      return null;
    }
  },

  // Unsubscribe from real-time notifications
  unsubscribeFromNotifications(subscription) {
    try {
      if (subscription) {
        supabase?.removeChannel(subscription);
      }
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
    }
  },

  // Create system notification templates
  async createSystemNotification(type, data) {
    const templates = {
      payment_received: {
        type: 'success',
        title: 'Payment Received',
        message: `New payment of ${data?.amount} ${data?.currency} received successfully`,
        priority: 2,
        actionUrl: `/payments-management?payment=${data?.paymentId}`,
        actionLabel: 'View Payment'
      },
      payment_failed: {
        type: 'error',
        title: 'Payment Failed',
        message: `Payment of ${data?.amount} ${data?.currency} has failed`,
        priority: 3,
        actionUrl: `/payments-management?payment=${data?.paymentId}`,
        actionLabel: 'View Details'
      },
      api_key_created: {
        type: 'info',
        title: 'API Key Created',
        message: `New API key "${data?.keyName}" has been generated for your account`,
        priority: 1,
        actionUrl: '/api-keys-management',
        actionLabel: 'Manage Keys'
      },
      payout_completed: {
        type: 'success',
        title: 'Payout Completed',
        message: `Payout of ${data?.amount} ${data?.currency} has been processed successfully`,
        priority: 2,
        actionUrl: '/payout-management',
        actionLabel: 'View Payouts'
      },
      webhook_failed: {
        type: 'warning',
        title: 'Webhook Delivery Failed',
        message: `Webhook delivery to ${data?.url} failed after ${data?.retries} attempts`,
        priority: 2,
        actionUrl: '/webhook-management',
        actionLabel: 'Check Webhooks'
      }
    };

    const template = templates?.[type];
    if (!template) {
      return { data: null, error: { message: 'Unknown notification type' } };
    }

    return this.createNotification(template);
  }
};

export default notificationsService;