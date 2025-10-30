import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const BackButton = ({ 
  to, 
  fallback = '/',
  variant = 'ghost',
  size = 'sm',
  className = '',
  children,
  ...props 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (to) {
      // Navigate to specific route
      navigate(to);
    } else if (window.history?.length > 1) {
      // Go back in history if available
      navigate(-1);
    } else {
      // Fallback navigation
      navigate(fallback);
    }
  };

  // Get appropriate text based on current location
  const getBackText = () => {
    if (children) return children;
    
    const currentPath = location?.pathname;
    if (currentPath?.includes('/dashboard')) return 'Back to Dashboard';
    if (currentPath?.includes('/payments')) return 'Back to Payments';
    if (currentPath?.includes('/invoice')) return 'Back to Invoices';
    if (currentPath?.includes('/payout')) return 'Back to Payouts';
    if (currentPath?.includes('/api-keys')) return 'Back to API Keys';
    if (currentPath?.includes('/webhook')) return 'Back to Webhooks';
    if (currentPath?.includes('/merchant')) return 'Back to Settings';
    if (currentPath?.includes('/conversions')) return 'Back to Conversions';
    if (currentPath?.includes('/subscription')) return 'Back to Subscriptions';
    return 'Back';
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={`text-muted-foreground hover:text-foreground ${className}`}
      {...props}
    >
      <Icon name="ArrowLeft" size={16} className="mr-2" />
      {getBackText()}
    </Button>
  );
};

export default BackButton;