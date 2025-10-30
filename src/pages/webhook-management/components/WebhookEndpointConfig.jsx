import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const WebhookEndpointConfig = ({ onSave, onTest, existingEndpoint = null }) => {
  const [endpoint, setEndpoint] = useState({
    url: existingEndpoint?.url || '',
    secret: existingEndpoint?.secret || '',
    events: existingEndpoint?.events || [],
    isActive: existingEndpoint?.isActive ?? true,
    description: existingEndpoint?.description || ''
  });

  const [isGeneratingSecret, setIsGeneratingSecret] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const eventTypes = [
    { value: 'payment.created', label: 'Payment Created', description: 'New payment initiated' },
    { value: 'payment.confirmed', label: 'Payment Confirmed', description: 'Payment confirmed on blockchain' },
    { value: 'payment.completed', label: 'Payment Completed', description: 'Payment fully processed' },
    { value: 'payment.failed', label: 'Payment Failed', description: 'Payment failed or expired' },
    { value: 'payment.refunded', label: 'Payment Refunded', description: 'Payment refunded to customer' },
    { value: 'payout.created', label: 'Payout Created', description: 'New payout initiated' },
    { value: 'payout.completed', label: 'Payout Completed', description: 'Payout successfully sent' },
    { value: 'payout.failed', label: 'Payout Failed', description: 'Payout failed to process' },
    { value: 'invoice.created', label: 'Invoice Created', description: 'New invoice generated' },
    { value: 'invoice.paid', label: 'Invoice Paid', description: 'Invoice payment received' },
    { value: 'invoice.expired', label: 'Invoice Expired', description: 'Invoice payment window expired' }
  ];

  const handleGenerateSecret = () => {
    setIsGeneratingSecret(true);
    // Simulate secret generation
    setTimeout(() => {
      const newSecret = `whsec_${Math.random()?.toString(36)?.substring(2, 15)}${Math.random()?.toString(36)?.substring(2, 15)}`;
      setEndpoint(prev => ({ ...prev, secret: newSecret }));
      setIsGeneratingSecret(false);
      setShowSecret(true);
    }, 1000);
  };

  const handleSave = () => {
    if (endpoint?.url && endpoint?.secret && endpoint?.events?.length > 0) {
      onSave(endpoint);
    }
  };

  const handleTest = () => {
    if (endpoint?.url) {
      onTest(endpoint);
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return url?.startsWith('https://');
    } catch {
      return false;
    }
  };

  return (
    <div className="glassmorphism rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Webhook Endpoint Configuration</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your webhook endpoint to receive real-time event notifications
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            label="Active"
            checked={endpoint?.isActive}
            onChange={(e) => setEndpoint(prev => ({ ...prev, isActive: e?.target?.checked }))}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Configuration */}
        <div className="space-y-4">
          <Input
            label="Webhook URL"
            type="url"
            placeholder="https://your-domain.com/webhooks"
            value={endpoint?.url}
            onChange={(e) => setEndpoint(prev => ({ ...prev, url: e?.target?.value }))}
            description="Must be a valid HTTPS URL"
            error={endpoint?.url && !isValidUrl(endpoint?.url) ? "URL must be HTTPS" : ""}
            required
          />

          <Input
            label="Description"
            type="text"
            placeholder="Production webhook endpoint"
            value={endpoint?.description}
            onChange={(e) => setEndpoint(prev => ({ ...prev, description: e?.target?.value }))}
            description="Optional description for this endpoint"
          />

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Webhook Secret</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  type={showSecret ? "text" : "password"}
                  placeholder="Webhook signing secret"
                  value={endpoint?.secret}
                  onChange={(e) => setEndpoint(prev => ({ ...prev, secret: e?.target?.value }))}
                  disabled={isGeneratingSecret}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowSecret(!showSecret)}
                disabled={!endpoint?.secret}
              >
                <Icon name={showSecret ? "EyeOff" : "Eye"} size={16} />
              </Button>
              <Button
                variant="outline"
                onClick={handleGenerateSecret}
                loading={isGeneratingSecret}
                iconName="RefreshCw"
              >
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Used to verify webhook authenticity with HMAC-SHA512 signatures
            </p>
          </div>
        </div>

        {/* Right Column - Event Selection */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">Event Types</label>
            <Select
              placeholder="Select events to subscribe to"
              options={eventTypes}
              value={endpoint?.events}
              onChange={(selected) => setEndpoint(prev => ({ ...prev, events: selected }))}
              multiple
              searchable
              description="Choose which events trigger webhook calls"
              required
            />
          </div>

          {/* Security Best Practices */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Shield" size={20} color="var(--color-accent)" />
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Security Best Practices</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Always verify HMAC-SHA512 signatures</li>
                  <li>• Use HTTPS endpoints only</li>
                  <li>• Implement idempotency handling</li>
                  <li>• Return 200 status for successful processing</li>
                  <li>• Handle retries gracefully</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Info" size={14} />
          <span>Webhook deliveries are retried up to 3 times with exponential backoff</span>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={!endpoint?.url || !isValidUrl(endpoint?.url)}
            iconName="Send"
          >
            Test Endpoint
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={!endpoint?.url || !endpoint?.secret || endpoint?.events?.length === 0}
            iconName="Save"
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebhookEndpointConfig;