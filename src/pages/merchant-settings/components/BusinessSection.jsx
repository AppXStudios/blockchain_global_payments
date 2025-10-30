import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const BusinessSection = ({ businessData, onSave }) => {
  const [formData, setFormData] = useState({
    defaultCurrency: businessData?.defaultCurrency || 'USD',
    payoutWallet: businessData?.payoutWallet || '',
    minimumPayout: businessData?.minimumPayout || '100',
    autoPayoutEnabled: businessData?.autoPayoutEnabled || false,
    payoutFrequency: businessData?.payoutFrequency || 'weekly'
  });

  const [notifications, setNotifications] = useState({
    paymentReceived: businessData?.notifications?.paymentReceived || true,
    paymentFailed: businessData?.notifications?.paymentFailed || true,
    payoutProcessed: businessData?.notifications?.payoutProcessed || true,
    securityAlerts: businessData?.notifications?.securityAlerts || true,
    weeklyReports: businessData?.notifications?.weeklyReports || false,
    marketingEmails: businessData?.notifications?.marketingEmails || false,
    webhookFailures: businessData?.notifications?.webhookFailures || true
  });

  const [hasChanges, setHasChanges] = useState(false);

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'BTC', label: 'Bitcoin (BTC)' },
    { value: 'ETH', label: 'Ethereum (ETH)' }
  ];

  const payoutFrequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave({
      ...formData,
      notifications
    });
    setHasChanges(false);
  };

  return (
    <div className="space-y-8">
      {/* Payout Configuration */}
      <div className="glassmorphism p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Payout Configuration</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Select
            label="Default Currency"
            options={currencyOptions}
            value={formData?.defaultCurrency}
            onChange={(value) => handleFormChange('defaultCurrency', value)}
            description="Primary currency for your business operations"
          />
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Payout Wallet Address
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData?.payoutWallet}
                onChange={(e) => handleFormChange('payoutWallet', e?.target?.value)}
                placeholder="Enter wallet address"
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent pr-10"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth">
                <Icon name="Copy" size={16} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cryptocurrency will be sent to this address
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Minimum Payout Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData?.minimumPayout}
                onChange={(e) => handleFormChange('minimumPayout', e?.target?.value)}
                placeholder="100"
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                {formData?.defaultCurrency}
              </span>
            </div>
          </div>
          
          <Select
            label="Auto Payout Frequency"
            options={payoutFrequencyOptions}
            value={formData?.payoutFrequency}
            onChange={(value) => handleFormChange('payoutFrequency', value)}
            disabled={!formData?.autoPayoutEnabled}
            description="How often automatic payouts are processed"
          />
        </div>
        
        <div className="mt-6">
          <Checkbox
            label="Enable Automatic Payouts"
            description="Automatically process payouts when minimum amount is reached"
            checked={formData?.autoPayoutEnabled}
            onChange={(e) => handleFormChange('autoPayoutEnabled', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Notification Preferences */}
      <div className="glassmorphism p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h3>
        
        <div className="space-y-6">
          {/* Payment Notifications */}
          <div>
            <h4 className="font-medium text-foreground mb-4 flex items-center space-x-2">
              <Icon name="CreditCard" size={16} />
              <span>Payment Notifications</span>
            </h4>
            <div className="space-y-3 ml-6">
              <Checkbox
                label="Payment Received"
                description="Get notified when payments are successfully processed"
                checked={notifications?.paymentReceived}
                onChange={(e) => handleNotificationChange('paymentReceived', e?.target?.checked)}
              />
              <Checkbox
                label="Payment Failed"
                description="Get notified when payments fail or are declined"
                checked={notifications?.paymentFailed}
                onChange={(e) => handleNotificationChange('paymentFailed', e?.target?.checked)}
              />
              <Checkbox
                label="Payout Processed"
                description="Get notified when payouts are completed"
                checked={notifications?.payoutProcessed}
                onChange={(e) => handleNotificationChange('payoutProcessed', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Security Notifications */}
          <div>
            <h4 className="font-medium text-foreground mb-4 flex items-center space-x-2">
              <Icon name="Shield" size={16} />
              <span>Security Notifications</span>
            </h4>
            <div className="space-y-3 ml-6">
              <Checkbox
                label="Security Alerts"
                description="Get notified about suspicious account activity"
                checked={notifications?.securityAlerts}
                onChange={(e) => handleNotificationChange('securityAlerts', e?.target?.checked)}
              />
              <Checkbox
                label="Webhook Failures"
                description="Get notified when webhook deliveries fail"
                checked={notifications?.webhookFailures}
                onChange={(e) => handleNotificationChange('webhookFailures', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Marketing & Reports */}
          <div>
            <h4 className="font-medium text-foreground mb-4 flex items-center space-x-2">
              <Icon name="Mail" size={16} />
              <span>Marketing & Reports</span>
            </h4>
            <div className="space-y-3 ml-6">
              <Checkbox
                label="Weekly Reports"
                description="Receive weekly summary of your payment activity"
                checked={notifications?.weeklyReports}
                onChange={(e) => handleNotificationChange('weeklyReports', e?.target?.checked)}
              />
              <Checkbox
                label="Marketing Emails"
                description="Receive updates about new features and promotions"
                checked={notifications?.marketingEmails}
                onChange={(e) => handleNotificationChange('marketingEmails', e?.target?.checked)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Save Changes */}
      {hasChanges && (
        <div className="glassmorphism p-4 rounded-lg border border-warning/30 bg-warning/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
              <span className="text-sm text-foreground">You have unsaved changes</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFormData({
                    defaultCurrency: businessData?.defaultCurrency || 'USD',
                    payoutWallet: businessData?.payoutWallet || '',
                    minimumPayout: businessData?.minimumPayout || '100',
                    autoPayoutEnabled: businessData?.autoPayoutEnabled || false,
                    payoutFrequency: businessData?.payoutFrequency || 'weekly'
                  });
                  setNotifications({
                    paymentReceived: businessData?.notifications?.paymentReceived || true,
                    paymentFailed: businessData?.notifications?.paymentFailed || true,
                    payoutProcessed: businessData?.notifications?.payoutProcessed || true,
                    securityAlerts: businessData?.notifications?.securityAlerts || true,
                    weeklyReports: businessData?.notifications?.weeklyReports || false,
                    marketingEmails: businessData?.notifications?.marketingEmails || false,
                    webhookFailures: businessData?.notifications?.webhookFailures || true
                  });
                  setHasChanges(false);
                }}
              >
                Discard
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                iconName="Save"
                iconPosition="left"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessSection;