import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from './components/StepIndicator';
import CompanyDetailsStep from './components/CompanyDetailsStep';
import WebsiteVerificationStep from './components/WebsiteVerificationStep';
import PayoutWalletStep from './components/PayoutWalletStep';
import LogoUploadStep from './components/LogoUploadStep';
import CompletionStep from './components/CompletionStep';
import Icon from '../../components/AppIcon';

const MerchantOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const steps = [
    {
      id: 'company',
      title: 'Company Details',
      description: 'Business information'
    },
    {
      id: 'website',
      title: 'Website Verification',
      description: 'Domain ownership'
    },
    {
      id: 'wallets',
      title: 'Payout Wallets',
      description: 'Crypto addresses'
    },
    {
      id: 'logo',
      title: 'Logo Upload',
      description: 'Brand customization'
    },
    {
      id: 'complete',
      title: 'Complete',
      description: 'Account ready'
    }
  ];

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      // Simulate auth check
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      
      if (!isAuthenticated) {
        navigate('/authentication');
        return;
      }

      // Load saved progress
      const savedData = localStorage.getItem('onboardingProgress');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setOnboardingData(parsed?.data || {});
          setCurrentStep(parsed?.step || 1);
        } catch (error) {
          console.error('Error loading onboarding progress:', error);
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const updateStepData = (stepData) => {
    const updatedData = { ...onboardingData, ...stepData };
    setOnboardingData(updatedData);
    
    // Save progress to localStorage
    localStorage.setItem('onboardingProgress', JSON.stringify({
      step: currentStep,
      data: updatedData
    }));
  };

  const goToNextStep = () => {
    if (currentStep < steps?.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CompanyDetailsStep
            data={onboardingData}
            onUpdate={updateStepData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 2:
        return (
          <WebsiteVerificationStep
            data={onboardingData}
            onUpdate={updateStepData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 3:
        return (
          <PayoutWalletStep
            data={onboardingData}
            onUpdate={updateStepData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 4:
        return (
          <LogoUploadStep
            data={onboardingData}
            onUpdate={updateStepData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 5:
        return (
          <CompletionStep
            data={onboardingData}
            onPrevious={goToPreviousStep}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin">
            <Icon name="Loader2" size={48} color="var(--color-accent)" />
          </div>
          <div className="text-muted-foreground">Loading onboarding...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full glassmorphism border-b border-border">
        <div className="flex h-16 items-center justify-between px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="font-heading text-xl font-semibold text-foreground">
              Blockchain Global Payments
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {steps?.length}
            </div>
            <button
              onClick={() => navigate('/authentication')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
          {/* Progress Indicator */}
          <StepIndicator currentStep={currentStep} steps={steps} />

          {/* Step Content */}
          <div className="glassmorphism rounded-lg p-8 border border-border">
            {renderCurrentStep()}
          </div>

          {/* Help Section */}
          {currentStep < 5 && (
            <div className="mt-8 text-center">
              <div className="glassmorphism rounded-lg p-6 border border-border">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <Icon name="HelpCircle" size={20} color="var(--color-accent)" />
                  <h3 className="text-lg font-medium text-foreground">
                    Need Help?
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Our support team is here to help you get set up quickly and securely.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate('/documentation')}
                    className="inline-flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors"
                  >
                    <Icon name="Book" size={16} color="currentColor" />
                    <span className="text-sm font-medium">View Documentation</span>
                  </button>
                  <button
                    onClick={() => navigate('/contact')}
                    className="inline-flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors"
                  >
                    <Icon name="MessageCircle" size={16} color="currentColor" />
                    <span className="text-sm font-medium">Contact Support</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-4xl mx-auto px-6 py-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {new Date()?.getFullYear()} Blockchain Global Payments. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <button
                onClick={() => navigate('/documentation')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => navigate('/documentation')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </button>
              <button
                onClick={() => navigate('/system-status')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                System Status
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MerchantOnboarding;