import React from 'react';
import Icon from '../../../components/AppIcon';

const PayoutStatusTracker = ({ payout }) => {
  const getStatusSteps = () => {
    const baseSteps = [
      {
        id: 'created',
        label: 'Payout Created',
        description: 'Withdrawal request submitted',
        icon: 'Plus'
      },
      {
        id: 'verification',
        label: '2FA Verification',
        description: 'Two-factor authentication completed',
        icon: 'Shield'
      },
      {
        id: 'processing',
        label: 'Processing',
        description: 'Transaction being prepared',
        icon: 'Clock'
      },
      {
        id: 'blockchain',
        label: 'Blockchain Submission',
        description: 'Transaction broadcast to network',
        icon: 'Send'
      },
      {
        id: 'confirmation',
        label: 'Network Confirmation',
        description: 'Awaiting blockchain confirmations',
        icon: 'Loader'
      },
      {
        id: 'completed',
        label: 'Completed',
        description: 'Funds successfully transferred',
        icon: 'CheckCircle'
      }
    ];

    // Handle failed status
    if (payout?.status === 'failed') {
      return [
        ...baseSteps?.slice(0, -1),
        {
          id: 'failed',
          label: 'Failed',
          description: payout?.failureReason || 'Transaction failed',
          icon: 'XCircle'
        }
      ];
    }

    // Handle cancelled status
    if (payout?.status === 'cancelled') {
      return [
        ...baseSteps?.slice(0, 2),
        {
          id: 'cancelled',
          label: 'Cancelled',
          description: 'Withdrawal was cancelled',
          icon: 'Ban'
        }
      ];
    }

    return baseSteps;
  };

  const getCurrentStepIndex = () => {
    const statusMap = {
      'pending': 0,
      'verifying': 1,
      'processing': 2,
      'blockchain': 3,
      'confirming': 4,
      'completed': 5,
      'failed': -1,
      'cancelled': -1
    };
    return statusMap?.[payout?.status] || 0;
  };

  const getStepStatus = (stepIndex, currentIndex) => {
    if (payout?.status === 'failed' || payout?.status === 'cancelled') {
      const steps = getStatusSteps();
      if (stepIndex === steps?.length - 1) return 'error';
      if (stepIndex < currentIndex) return 'completed';
      return 'pending';
    }

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getStepStyles = (status) => {
    const styles = {
      completed: {
        circle: 'bg-success border-success text-white',
        line: 'bg-success',
        text: 'text-foreground',
        description: 'text-muted-foreground'
      },
      current: {
        circle: 'bg-accent border-accent text-white animate-pulse',
        line: 'bg-muted',
        text: 'text-accent font-medium',
        description: 'text-muted-foreground'
      },
      pending: {
        circle: 'bg-muted border-border text-muted-foreground',
        line: 'bg-muted',
        text: 'text-muted-foreground',
        description: 'text-muted-foreground'
      },
      error: {
        circle: 'bg-error border-error text-white',
        line: 'bg-muted',
        text: 'text-error font-medium',
        description: 'text-muted-foreground'
      }
    };
    return styles?.[status] || styles?.pending;
  };

  const getEstimatedTime = () => {
    const timeMap = {
      'pending': '~1 minute',
      'verifying': '~30 seconds',
      'processing': '~2-5 minutes',
      'blockchain': '~10-30 minutes',
      'confirming': '~30-60 minutes',
      'completed': 'Completed',
      'failed': 'Failed',
      'cancelled': 'Cancelled'
    };
    return timeMap?.[payout?.status] || 'Calculating...';
  };

  const steps = getStatusSteps();
  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="glassmorphism rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Payout Status</h3>
          <p className="text-sm text-muted-foreground">
            Track your withdrawal progress
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Estimated Time</div>
          <div className="text-sm font-medium text-foreground">
            {getEstimatedTime()}
          </div>
        </div>
      </div>
      {/* Payout Details */}
      <div className="glassmorphism rounded-lg p-4 mb-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Amount</div>
            <div className="font-medium text-foreground">
              {payout?.amount} {payout?.currency?.toUpperCase()}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Transaction ID</div>
            <div className="font-mono text-sm text-foreground">
              {payout?.transactionId || 'Pending...'}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Network Fee</div>
            <div className="text-sm text-foreground">
              {payout?.networkFee || '0.001'} {payout?.currency?.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
      {/* Status Steps */}
      <div className="space-y-4">
        {steps?.map((step, index) => {
          const status = getStepStatus(index, currentStepIndex);
          const styles = getStepStyles(status);
          const isLast = index === steps?.length - 1;

          return (
            <div key={step?.id} className="relative">
              <div className="flex items-start space-x-4">
                {/* Step Circle */}
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${styles?.circle}`}>
                    <Icon 
                      name={step?.icon} 
                      size={16} 
                      color="currentColor"
                      className={status === 'current' ? 'animate-pulse' : ''}
                    />
                  </div>
                  
                  {/* Connecting Line */}
                  {!isLast && (
                    <div className={`absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-8 transition-all duration-200 ${styles?.line}`} />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0 pb-8">
                  <div className={`text-sm font-medium transition-colors duration-200 ${styles?.text}`}>
                    {step?.label}
                  </div>
                  <div className={`text-xs mt-1 transition-colors duration-200 ${styles?.description}`}>
                    {step?.description}
                  </div>
                  
                  {/* Timestamp */}
                  {status === 'completed' && payout?.timestamps?.[step?.id] && (
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(payout.timestamps[step.id])?.toLocaleString()}
                    </div>
                  )}
                  
                  {/* Current Step Details */}
                  {status === 'current' && (
                    <div className="mt-3 p-3 rounded-lg bg-accent/10 border border-accent/30">
                      <div className="flex items-center space-x-2">
                        <Icon name="Clock" size={14} color="var(--color-accent)" />
                        <span className="text-xs text-accent font-medium">
                          In Progress
                        </span>
                      </div>
                      {step?.id === 'blockchain' && payout?.transactionId && (
                        <div className="mt-2">
                          <div className="text-xs text-muted-foreground mb-1">
                            Transaction Hash:
                          </div>
                          <div className="font-mono text-xs text-foreground break-all">
                            {payout?.transactionId}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Error Details */}
                  {status === 'error' && (
                    <div className="mt-3 p-3 rounded-lg bg-error/10 border border-error/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon name="AlertCircle" size={14} color="var(--color-error)" />
                        <span className="text-xs text-error font-medium">
                          Error Details
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {payout?.failureReason || 'An unexpected error occurred'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Blockchain Explorer Link */}
      {payout?.transactionId && (
        <div className="mt-6 pt-6 border-t border-border">
          <a
            href={`https://blockchair.com/${payout?.currency}/transaction/${payout?.transactionId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-sm text-accent hover:text-accent/80 transition-smooth"
          >
            <Icon name="ExternalLink" size={16} />
            <span>View on Blockchain Explorer</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default PayoutStatusTracker;