import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useRouter } from 'next/router';

const CompletionStep = ({ data, onPrevious }) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [processingStep, setProcessingStep] = useState(0);

  const processingSteps = [
    { label: 'Validating company information', icon: 'Building' },
    { label: 'Verifying website ownership', icon: 'Globe' },
    { label: 'Setting up payout wallets', icon: 'Wallet' },
    { label: 'Configuring merchant account', icon: 'Settings' },
    { label: 'Generating API credentials', icon: 'Key' }
  ];

  useEffect(() => {
    const processSteps = async () => {
      for (let i = 0; i < processingSteps?.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setProcessingStep(i + 1);
      }
      
      // Final delay before completion
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsProcessing(false);
    };

    processSteps();
  }, []);

  const handleGoToDashboard = () => {
    router?.push('/dashboard-overview');
  };

  const handleViewDocumentation = () => {
    router?.push('/documentation');
  };

  if (isProcessing) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-accent/10 border border-accent/20">
              <div className="animate-spin">
                <Icon name="Loader2" size={48} color="var(--color-accent)" />
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
            Setting Up Your Account
          </h2>
          <p className="text-muted-foreground">
            Please wait while we configure your merchant account...
          </p>
        </div>
        <div className="space-y-4">
          {processingSteps?.map((step, index) => {
            const isCompleted = index < processingStep;
            const isActive = index === processingStep;
            const isPending = index > processingStep;

            return (
              <div
                key={index}
                className={`
                  flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300
                  ${isCompleted 
                    ? 'border-success/30 bg-success/10' 
                    : isActive 
                      ? 'border-accent/30 bg-accent/10' :'border-border bg-muted/20'
                  }
                `}
              >
                <div
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300
                    ${isCompleted 
                      ? 'bg-success text-white' 
                      : isActive 
                        ? 'bg-accent text-white' :'bg-muted text-muted-foreground'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Icon name="Check" size={20} color="white" />
                  ) : isActive ? (
                    <div className="animate-spin">
                      <Icon name="Loader2" size={20} color="white" />
                    </div>
                  ) : (
                    <Icon name={step?.icon} size={20} color="currentColor" />
                  )}
                </div>
                <div className="flex-1">
                  <div
                    className={`
                      font-medium transition-colors duration-300
                      ${isCompleted 
                        ? 'text-success' 
                        : isActive 
                          ? 'text-accent' :'text-muted-foreground'
                      }
                    `}
                  >
                    {step?.label}
                  </div>
                </div>
                {isCompleted && (
                  <Icon name="CheckCircle" size={20} color="var(--color-success)" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="p-6 rounded-full bg-success/10 border border-success/20">
            <Icon name="CheckCircle" size={48} color="var(--color-success)" />
          </div>
        </div>
        
        <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
          Account Setup Complete!
        </h2>
        <p className="text-muted-foreground">
          Your merchant account has been successfully configured and is ready to accept crypto payments.
        </p>
      </div>
      {/* Account Summary */}
      <div className="glassmorphism rounded-lg p-6 border border-border">
        <h3 className="text-lg font-medium text-foreground mb-4">
          Account Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Business Name</div>
              <div className="font-medium text-foreground">{data?.businessName}</div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Website</div>
              <div className="font-medium text-foreground">{data?.websiteUrl}</div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Contact Email</div>
              <div className="font-medium text-foreground">{data?.contactEmail}</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Merchant ID</div>
              <div className="font-mono text-sm text-foreground">
                BGP_{Math.random()?.toString(36)?.substring(2, 10)?.toUpperCase()}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Payout Wallets</div>
              <div className="font-medium text-foreground">
                {data?.wallets?.filter(w => w?.isVerified)?.length || 0} configured
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Account Status</div>
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                <span className="font-medium text-success">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Next Steps */}
      <div className="glassmorphism rounded-lg p-6 border border-border">
        <h3 className="text-lg font-medium text-foreground mb-4">
          What's Next?
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <Icon name="Code" size={20} color="var(--color-accent)" />
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">
                Integrate Payment API
              </h4>
              <p className="text-sm text-muted-foreground">
                Use our REST API or JavaScript SDK to start accepting crypto payments on your website.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <Icon name="FileText" size={20} color="var(--color-accent)" />
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">
                Create Your First Invoice
              </h4>
              <p className="text-sm text-muted-foreground">
                Generate hosted payment links for quick crypto payment collection.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <Icon name="Webhook" size={20} color="var(--color-accent)" />
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">
                Configure Webhooks
              </h4>
              <p className="text-sm text-muted-foreground">
                Set up real-time notifications for payment status updates.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* API Credentials Preview */}
      <div className="glassmorphism rounded-lg p-6 border border-accent/30 bg-accent/10">
        <div className="flex items-start space-x-3">
          <Icon name="Key" size={24} color="var(--color-accent)" />
          <div className="flex-1">
            <h4 className="font-medium text-accent mb-1">
              API Credentials Generated
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Your API keys have been generated and are available in your dashboard.
              Keep them secure and never share them publicly.
            </p>
            <div className="bg-card rounded-md p-3 border border-border">
              <div className="text-xs text-muted-foreground mb-1">API Key (Test Mode)</div>
              <div className="font-mono text-sm text-foreground">
                bgp_test_sk_{Math.random()?.toString(36)?.substring(2, 32)}...
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          variant="default"
          onClick={handleGoToDashboard}
          className="gradient-primary text-white flex-1"
          iconName="LayoutDashboard"
          iconPosition="left"
        >
          Go to Dashboard
        </Button>
        
        <Button
          variant="outline"
          onClick={handleViewDocumentation}
          className="flex-1"
          iconName="Book"
          iconPosition="left"
        >
          View Documentation
        </Button>
      </div>
      {/* Support Info */}
      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground">
          Need help getting started? Check out our{' '}
          <button 
            onClick={handleViewDocumentation}
            className="text-accent hover:underline"
          >
            documentation
          </button>{' '}
          or{' '}
          <button 
            onClick={() => router?.push('/contact')}
            className="text-accent hover:underline"
          >
            contact support
          </button>
          .
        </p>
      </div>
    </div>
  );
};

export default CompletionStep;