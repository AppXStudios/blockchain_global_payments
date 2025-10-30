import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const WebhookTestPanel = ({ onTest, isOpen, onToggle }) => {
  const [testConfig, setTestConfig] = useState({
    eventType: 'payment.created',
    customPayload: '',
    useCustomPayload: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const eventTypeOptions = [
    { value: 'payment.created', label: 'Payment Created' },
    { value: 'payment.confirmed', label: 'Payment Confirmed' },
    { value: 'payment.completed', label: 'Payment Completed' },
    { value: 'payment.failed', label: 'Payment Failed' },
    { value: 'payout.created', label: 'Payout Created' },
    { value: 'payout.completed', label: 'Payout Completed' },
    { value: 'invoice.created', label: 'Invoice Created' },
    { value: 'invoice.paid', label: 'Invoice Paid' }
  ];

  const samplePayloads = {
    'payment.created': {
      id: 'pay_1234567890',
      event: 'payment.created',
      data: {
        id: 'pay_1234567890',
        amount: 100.00,
        currency: 'BTC',
        status: 'pending',
        customer_email: 'customer@example.com',
        created_at: new Date()?.toISOString()
      }
    },
    'payment.confirmed': {
      id: 'pay_1234567890',
      event: 'payment.confirmed',
      data: {
        id: 'pay_1234567890',
        amount: 100.00,
        currency: 'BTC',
        status: 'confirmed',
        confirmations: 3,
        tx_hash: '0x1234567890abcdef',
        confirmed_at: new Date()?.toISOString()
      }
    },
    'payout.created': {
      id: 'payout_1234567890',
      event: 'payout.created',
      data: {
        id: 'payout_1234567890',
        amount: 500.00,
        currency: 'ETH',
        status: 'pending',
        destination_address: '0xabcdef1234567890',
        created_at: new Date()?.toISOString()
      }
    }
  };

  const handleTest = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      let payload;
      if (testConfig?.useCustomPayload && testConfig?.customPayload) {
        payload = JSON.parse(testConfig?.customPayload);
      } else {
        payload = samplePayloads?.[testConfig?.eventType] || samplePayloads?.['payment.created'];
      }

      // Simulate webhook test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult = {
        success: Math.random() > 0.3,
        responseCode: Math.random() > 0.3 ? 200 : 500,
        responseTime: Math.floor(Math.random() * 1000) + 100,
        responseBody: Math.random() > 0.3 ? 'OK' : 'Internal Server Error',
        timestamp: new Date()?.toISOString()
      };

      setTestResult(mockResult);
      onTest(payload, mockResult);
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Invalid JSON payload',
        timestamp: new Date()?.toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayloadChange = (eventType) => {
    setTestConfig(prev => ({
      ...prev,
      eventType,
      customPayload: JSON.stringify(samplePayloads?.[eventType] || {}, null, 2)
    }));
  };

  if (!isOpen) {
    return (
      <div className="glassmorphism rounded-lg border border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Icon name="Send" size={20} color="var(--color-accent)" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Test Webhook Endpoint</h3>
              <p className="text-sm text-muted-foreground">Send test events to verify integration</p>
            </div>
          </div>
          <Button variant="outline" onClick={onToggle} iconName="ChevronDown">
            Expand
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glassmorphism rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Icon name="Send" size={20} color="var(--color-accent)" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Test Webhook Endpoint</h3>
              <p className="text-sm text-muted-foreground">Send test events to verify integration</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onToggle} iconName="ChevronUp" />
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Test Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select
              label="Event Type"
              options={eventTypeOptions}
              value={testConfig?.eventType}
              onChange={(value) => {
                setTestConfig(prev => ({ ...prev, eventType: value }));
                if (!testConfig?.useCustomPayload) {
                  handlePayloadChange(value);
                }
              }}
              description="Select the type of event to simulate"
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useCustomPayload"
                checked={testConfig?.useCustomPayload}
                onChange={(e) => {
                  const useCustom = e?.target?.checked;
                  setTestConfig(prev => ({ 
                    ...prev, 
                    useCustomPayload: useCustom,
                    customPayload: useCustom ? prev?.customPayload : JSON.stringify(samplePayloads?.[prev?.eventType] || {}, null, 2)
                  }));
                }}
                className="rounded border-border"
              />
              <label htmlFor="useCustomPayload" className="text-sm font-medium text-foreground">
                Use custom payload
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              variant="default"
              onClick={handleTest}
              loading={isLoading}
              disabled={!testConfig?.eventType}
              iconName="Send"
              fullWidth
            >
              {isLoading ? 'Sending Test Event...' : 'Send Test Event'}
            </Button>

            {testResult && (
              <div className={`p-4 rounded-lg border ${
                testResult?.success 
                  ? 'bg-success/10 border-success/20' :'bg-error/10 border-error/20'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Icon 
                    name={testResult?.success ? 'CheckCircle' : 'XCircle'} 
                    size={16} 
                    color={testResult?.success ? 'var(--color-success)' : 'var(--color-error)'} 
                  />
                  <span className={`text-sm font-medium ${
                    testResult?.success ? 'text-success' : 'text-error'
                  }`}>
                    {testResult?.success ? 'Test Successful' : 'Test Failed'}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  {testResult?.responseCode && (
                    <div>Response Code: {testResult?.responseCode}</div>
                  )}
                  {testResult?.responseTime && (
                    <div>Response Time: {testResult?.responseTime}ms</div>
                  )}
                  {testResult?.error && (
                    <div className="text-error">Error: {testResult?.error}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payload Editor */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Event Payload
          </label>
          <div className="relative">
            <textarea
              value={testConfig?.customPayload || JSON.stringify(samplePayloads?.[testConfig?.eventType] || {}, null, 2)}
              onChange={(e) => setTestConfig(prev => ({ ...prev, customPayload: e?.target?.value }))}
              disabled={!testConfig?.useCustomPayload}
              className="w-full h-64 p-4 bg-muted/30 border border-border rounded-lg font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
              placeholder="Enter custom JSON payload..."
            />
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  let payload = testConfig?.customPayload || JSON.stringify(samplePayloads?.[testConfig?.eventType] || {}, null, 2);
                  navigator.clipboard?.writeText(payload);
                }}
                iconName="Copy"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This payload will be sent to your webhook endpoint with proper HMAC-SHA512 signature
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebhookTestPanel;