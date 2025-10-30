import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const WebsiteVerificationStep = ({ data, onUpdate, onNext, onPrevious }) => {
  const [formData, setFormData] = useState({
    websiteUrl: data?.websiteUrl || '',
    verificationMethod: data?.verificationMethod || 'dns',
    verificationStatus: data?.verificationStatus || 'pending',
    ...data
  });

  const [errors, setErrors] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleVerifyWebsite = async () => {
    if (!formData?.websiteUrl?.trim()) {
      setErrors({ websiteUrl: 'Website URL is required' });
      return;
    }

    if (!validateUrl(formData?.websiteUrl)) {
      setErrors({ websiteUrl: 'Please enter a valid URL (e.g., https://example.com)' });
      return;
    }

    setIsVerifying(true);
    setErrors({});

    // Simulate verification process
    setTimeout(() => {
      const isValid = Math.random() > 0.3; // 70% success rate for demo
      
      if (isValid) {
        setVerificationResult({
          status: 'success',
          message: 'Website verified successfully! Domain ownership confirmed.',
          details: 'SSL certificate valid, domain accessible, and ownership verified.'
        });
        setFormData(prev => ({ ...prev, verificationStatus: 'verified' }));
      } else {
        setVerificationResult({
          status: 'error',
          message: 'Website verification failed. Please check your domain.',
          details: 'Unable to verify domain ownership. Ensure your website is accessible and try again.'
        });
        setFormData(prev => ({ ...prev, verificationStatus: 'failed' }));
      }
      
      setIsVerifying(false);
    }, 3000);
  };

  const handleNext = () => {
    if (formData?.verificationStatus === 'verified') {
      onUpdate(formData);
      onNext();
    }
  };

  const verificationToken = "bgp_verify_" + Math.random()?.toString(36)?.substring(2, 15);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
          Website Verification
        </h2>
        <p className="text-muted-foreground">
          Verify your website to enable crypto payment processing and build customer trust.
        </p>
      </div>
      <div className="space-y-6">
        <Input
          label="Website URL"
          type="url"
          placeholder="https://your-website.com"
          description="Enter your business website URL"
          value={formData?.websiteUrl}
          onChange={(e) => handleInputChange('websiteUrl', e?.target?.value)}
          error={errors?.websiteUrl}
          required
        />

        {/* Verification Methods */}
        <div className="glassmorphism rounded-lg p-6 border border-border">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Verification Methods
          </h3>
          
          <div className="space-y-4">
            {/* DNS Verification */}
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex-shrink-0 mt-1">
                <Icon name="Globe" size={20} color="var(--color-accent)" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">DNS Verification (Recommended)</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Add a TXT record to your domain's DNS settings to verify ownership.
                </p>
                <div className="bg-card rounded-md p-3 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Add this TXT record:</div>
                  <div className="font-mono text-sm text-foreground break-all">
                    bgp-verification={verificationToken}
                  </div>
                </div>
              </div>
            </div>

            {/* File Upload Verification */}
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/20 border border-border">
              <div className="flex-shrink-0 mt-1">
                <Icon name="FileText" size={20} color="var(--color-muted-foreground)" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">File Upload Verification</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload a verification file to your website's root directory.
                </p>
                <div className="bg-card rounded-md p-3 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Upload file to:</div>
                  <div className="font-mono text-sm text-foreground">
                    /bgp-verification.txt
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        {verificationResult && (
          <div className={`
            glassmorphism rounded-lg p-6 border
            ${verificationResult?.status === 'success' ?'border-success/30 bg-success/10' :'border-error/30 bg-error/10'
            }
          `}>
            <div className="flex items-start space-x-3">
              <Icon 
                name={verificationResult?.status === 'success' ? 'CheckCircle' : 'XCircle'} 
                size={24} 
                color={verificationResult?.status === 'success' ? 'var(--color-success)' : 'var(--color-error)'} 
              />
              <div className="flex-1">
                <h4 className={`font-medium mb-1 ${
                  verificationResult?.status === 'success' ? 'text-success' : 'text-error'
                }`}>
                  {verificationResult?.message}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {verificationResult?.details}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Verification Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleVerifyWebsite}
            loading={isVerifying}
            disabled={!formData?.websiteUrl || isVerifying}
            iconName="Shield"
            iconPosition="left"
            className="px-8"
          >
            {isVerifying ? 'Verifying Website...' : 'Verify Website'}
          </Button>
        </div>

        {/* Manual Review Option */}
        {formData?.verificationStatus === 'failed' && (
          <div className="glassmorphism rounded-lg p-6 border border-warning/30 bg-warning/10">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={24} color="var(--color-warning)" />
              <div className="flex-1">
                <h4 className="font-medium text-warning mb-1">
                  Need Help with Verification?
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  If automatic verification fails, our team can manually review your website.
                  This process typically takes 1-2 business days.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Mail"
                  iconPosition="left"
                >
                  Request Manual Review
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          iconName="ChevronLeft"
          iconPosition="left"
        >
          Previous
        </Button>
        <Button
          variant="default"
          onClick={handleNext}
          disabled={formData?.verificationStatus !== 'verified'}
          className="gradient-primary text-white"
          iconName="ChevronRight"
          iconPosition="right"
        >
          Continue to Payout Setup
        </Button>
      </div>
    </div>
  );
};

export default WebsiteVerificationStep;