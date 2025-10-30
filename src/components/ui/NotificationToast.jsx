import React, { useState, useEffect, createContext, useContext } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

// Notification Context
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      autoClose: true,
      duration: 5000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    if (newNotification?.autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification?.duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev?.filter(notification => notification?.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Individual Toast Component
const Toast = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(notification?.id);
    }, 200);
  };

  const getToastStyles = () => {
    const baseStyles = "flex items-start space-x-3 p-4 rounded-lg glassmorphism border shadow-elevation-md transition-all duration-200 ease-out";
    
    const typeStyles = {
      success: "border-success/30 bg-success/10",
      error: "border-error/30 bg-error/10",
      warning: "border-warning/30 bg-warning/10",
      info: "border-accent/30 bg-accent/10",
    };

    const animationStyles = isExiting 
      ? "opacity-0 transform translate-x-full scale-95" 
      : isVisible 
        ? "opacity-100 transform translate-x-0 scale-100" 
        : "opacity-0 transform translate-x-full scale-95";

    return `${baseStyles} ${typeStyles?.[notification?.type]} ${animationStyles}`;
  };

  const getIconName = () => {
    const iconMap = {
      success: 'CheckCircle',
      error: 'XCircle',
      warning: 'AlertTriangle',
      info: 'Info',
    };
    return iconMap?.[notification?.type];
  };

  const getIconColor = () => {
    const colorMap = {
      success: 'var(--color-success)',
      error: 'var(--color-error)',
      warning: 'var(--color-warning)',
      info: 'var(--color-accent)',
    };
    return colorMap?.[notification?.type];
  };

  return (
    <div className={getToastStyles()}>
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <Icon 
          name={getIconName()} 
          size={20} 
          color={getIconColor()}
        />
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0">
        {notification?.title && (
          <div className="font-medium text-foreground mb-1">
            {notification?.title}
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          {notification?.message}
        </div>
        {notification?.action && (
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={notification?.action?.onClick}
              className="text-xs"
            >
              {notification?.action?.label}
            </Button>
          </div>
        )}
      </div>
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-md hover:bg-muted/50 transition-smooth"
      >
        <Icon name="X" size={16} color="currentColor" />
      </button>
    </div>
  );
};

// Notification Container
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications?.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-80 space-y-2 max-w-sm w-full">
      {notifications?.map((notification) => (
        <Toast
          key={notification?.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

// Hook for easy notification usage
export const useToast = () => {
  const { addNotification } = useNotifications();

  const toast = {
    success: (message, options = {}) => {
      return addNotification({
        type: 'success',
        message,
        ...options,
      });
    },
    error: (message, options = {}) => {
      return addNotification({
        type: 'error',
        message,
        autoClose: false, // Errors should be manually dismissed
        ...options,
      });
    },
    warning: (message, options = {}) => {
      return addNotification({
        type: 'warning',
        message,
        ...options,
      });
    },
    info: (message, options = {}) => {
      return addNotification({
        type: 'info',
        message,
        ...options,
      });
    },
  };

  return toast;
};

export default NotificationContainer;