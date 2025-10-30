import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import dashboardService from '../../../services/dashboardService';

const SystemNotifications = ({ notifications = [], loading = false }) => {
  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'success':
        return { name: 'CheckCircle', color: 'text-green-500' };
      case 'warning':
        return { name: 'AlertTriangle', color: 'text-yellow-500' };
      case 'error':
        return { name: 'AlertCircle', color: 'text-red-500' };
      case 'info':
      default:
        return { name: 'Info', color: 'text-blue-500' };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await dashboardService?.markNotificationAsRead(notificationId);
      // Note: In a real app, you'd want to update the local state or refresh notifications
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-foreground">System Notifications</h3>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(3)]?.map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-muted rounded-full mt-1"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">System Notifications</h3>
          <Button variant="ghost" size="sm" iconName="Settings">
            Manage
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications?.length > 0 ? (
          <div className="divide-y divide-border">
            {notifications?.map((notification) => {
              const iconConfig = getNotificationIcon(notification?.type);
              return (
                <div 
                  key={notification?.id} 
                  className={`p-6 hover:bg-muted/20 transition-colors ${
                    !notification?.is_read ? 'bg-accent/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <Icon 
                        name={iconConfig?.name} 
                        size={16} 
                        className={iconConfig?.color} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${
                            !notification?.is_read ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification?.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification?.message}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(notification?.created_at)}
                            </span>
                            {notification?.priority > 2 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                High Priority
                              </span>
                            )}
                          </div>
                        </div>
                        {!notification?.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification?.id)}
                            className="ml-2 flex-shrink-0 text-xs text-accent hover:text-accent/80"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                      {notification?.action_url && notification?.action_label && (
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window?.open(notification?.action_url, '_blank')}
                          >
                            {notification?.action_label}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No notifications</h4>
            <p className="text-muted-foreground">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications?.length > 0 && (
        <div className="p-4 bg-muted/20 border-t border-border">
          <Button variant="ghost" size="sm" fullWidth>
            View All Notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default SystemNotifications;