import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentStatusBadge = ({ status, size = 'default' }) => {
  const getStatusConfig = () => {
    const configs = {
      completed: {
        label: 'Completed',
        icon: 'CheckCircle',
        className: 'bg-success/10 text-success border-success/30'
      },
      pending: {
        label: 'Pending',
        icon: 'Clock',
        className: 'bg-warning/10 text-warning border-warning/30'
      },
      failed: {
        label: 'Failed',
        icon: 'XCircle',
        className: 'bg-error/10 text-error border-error/30'
      },
      expired: {
        label: 'Expired',
        icon: 'AlertTriangle',
        className: 'bg-muted/10 text-muted-foreground border-muted/30'
      },
      refunded: {
        label: 'Refunded',
        icon: 'RotateCcw',
        className: 'bg-accent/10 text-accent border-accent/30'
      },
      processing: {
        label: 'Processing',
        icon: 'Loader2',
        className: 'bg-accent/10 text-accent border-accent/30'
      }
    };
    return configs?.[status] || configs?.pending;
  };

  const config = getStatusConfig();
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span className={`inline-flex items-center space-x-1.5 rounded-full border font-medium ${sizeClasses} ${config?.className}`}>
      <Icon 
        name={config?.icon} 
        size={size === 'sm' ? 12 : 14} 
        color="currentColor"
        className={config?.icon === 'Loader2' ? 'animate-spin' : ''}
      />
      <span>{config?.label}</span>
    </span>
  );
};

export default PaymentStatusBadge;