import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentStatus = ({ 
  status, 
  transactionId, 
  confirmations, 
  requiredConfirmations,
  onRetry,
  successUrl,
  failureUrl 
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (status === 'pending' || status === 'confirming') {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'waiting':
        return {
          icon: 'Clock',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/20',
          title: 'Waiting for Payment',
          description: 'Send the exact amount to the address above to proceed',
          showProgress: false
        };
      case 'pending':
        return {
          icon: 'Loader2',
          color: 'text-warning',
          bgColor: 'bg-warning/20',
          title: 'Payment Detected',
          description: 'Your transaction has been detected and is being processed',
          showProgress: true,
          animate: true
        };
      case 'confirming':
        return {
          icon: 'Shield',
          color: 'text-accent',
          bgColor: 'bg-accent/20',
          title: 'Confirming Payment',
          description: `Waiting for network confirmations (${confirmations}/${requiredConfirmations})`,
          showProgress: true
        };
      case 'confirmed':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success/20',
          title: 'Payment Confirmed',
          description: 'Your payment has been successfully confirmed on the blockchain',
          showProgress: false
        };
      case 'failed':
        return {
          icon: 'XCircle',
          color: 'text-error',
          bgColor: 'bg-error/20',
          title: 'Payment Failed',
          description: 'There was an issue processing your payment. Please try again.',
          showProgress: false
        };
      default:
        return {
          icon: 'Clock',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/20',
          title: 'Initializing',
          description: 'Setting up payment processing...',
          showProgress: false
        };
    }
  };

  const config = getStatusConfig();
  const progressPercentage = status === 'confirming' 
    ? Math.min((confirmations / requiredConfirmations) * 100, 100)
    : status === 'pending' 
      ? 25 
      : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="text-center">
        {/* Status Icon */}
        <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full ${config?.bgColor} mb-4`}>
          <Icon 
            name={config?.icon} 
            size={32} 
            color={`var(--color-${config?.color?.replace('text-', '')})`}
            className={config?.animate ? 'animate-spin' : ''}
          />
        </div>

        {/* Status Title */}
        <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
          {config?.title}
        </h3>

        {/* Status Description */}
        <p className="text-muted-foreground mb-4">
          {config?.description}
        </p>

        {/* Progress Bar */}
        {config?.showProgress && (
          <div className="mb-4">
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  status === 'confirming' ? 'bg-accent' : 'bg-warning'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {status === 'confirming' 
                ? `${confirmations} of ${requiredConfirmations} confirmations`
                : `Processing... ${formatTime(timeElapsed)}`
              }
            </div>
          </div>
        )}

        {/* Transaction ID */}
        {transactionId && (
          <div className="glassmorphism rounded-lg p-3 mb-4">
            <div className="text-xs text-muted-foreground mb-1">Transaction ID</div>
            <div className="font-mono text-sm text-foreground break-all">
              {transactionId}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {status === 'confirmed' && successUrl && (
            <Button
              variant="default"
              fullWidth
              onClick={() => window.location.href = successUrl}
              className="gradient-primary text-white"
            >
              Continue to Merchant
            </Button>
          )}

          {status === 'failed' && (
            <div className="space-y-2">
              {onRetry && (
                <Button
                  variant="default"
                  fullWidth
                  onClick={onRetry}
                  iconName="RotateCcw"
                >
                  Try Again
                </Button>
              )}
              {failureUrl && (
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => window.location.href = failureUrl}
                >
                  Return to Merchant
                </Button>
              )}
            </div>
          )}

          {(status === 'waiting' || status === 'pending' || status === 'confirming') && (
            <Button
              variant="ghost"
              fullWidth
              onClick={() => window.location?.reload()}
              iconName="RefreshCw"
            >
              Refresh Status
            </Button>
          )}
        </div>

        {/* Additional Info */}
        {status === 'waiting' && (
          <div className="mt-4 p-3 bg-accent/10 border border-accent/30 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-accent">
              <Icon name="Info" size={16} />
              <span className="text-sm font-medium">
                Payment will be detected automatically
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;