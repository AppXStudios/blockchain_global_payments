import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import WebhookEndpointConfig from './components/WebhookEndpointConfig';
import WebhookEventLog from './components/WebhookEventLog';
import WebhookPayloadViewer from './components/WebhookPayloadViewer';
import WebhookMetrics from './components/WebhookMetrics';
import WebhookTestPanel from './components/WebhookTestPanel';

const WebhookManagement = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isPayloadViewerOpen, setIsPayloadViewerOpen] = useState(false);
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(false);
  const [webhookEndpoint, setWebhookEndpoint] = useState(null);

  // Mock webhook metrics data
  const webhookMetrics = {
    successRate: 98.5,
    successRateChange: 2.1,
    totalEvents: 15847,
    totalEventsChange: 12.3,
    avgResponseTime: 245,
    responseTimeChange: -8.7,
    failedEvents: 23,
    failedEventsChange: -15.2
  };

  // Mock webhook events data
  const webhookEvents = [
    {
      id: 'evt_1234567890abcdef',
      eventType: 'payment.confirmed',
      status: 'success',
      attempts: 1,
      responseCode: 200,
      responseTime: 156,
      timestamp: new Date(Date.now() - 300000)?.toISOString(),
      verified: true,
      duration: '156ms',
      payload: {
        id: 'pay_1234567890',
        event: 'payment.confirmed',
        data: {
          id: 'pay_1234567890',
          amount: 0.00125,
          currency: 'BTC',
          status: 'confirmed',
          confirmations: 6,
          tx_hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
          customer_email: 'customer@example.com',
          confirmed_at: new Date()?.toISOString()
        }
      },
      requestHeaders: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': 'sha512=abc123def456...',
        'X-Webhook-Timestamp': '1698765432',
        'User-Agent': 'BGP-Webhooks/1.0'
      },
      responseBody: 'OK',
      signature: 'sha512=abc123def456789...',
      signatureTimestamp: '1698765432',
      verificationTime: 12
    },
    {
      id: 'evt_0987654321fedcba',
      eventType: 'payment.created',
      status: 'failed',
      attempts: 3,
      responseCode: 500,
      responseTime: null,
      timestamp: new Date(Date.now() - 600000)?.toISOString(),
      verified: false,
      duration: 'timeout',
      payload: {
        id: 'pay_0987654321',
        event: 'payment.created',
        data: {
          id: 'pay_0987654321',
          amount: 250.00,
          currency: 'ETH',
          status: 'pending',
          customer_email: 'user@example.com',
          created_at: new Date()?.toISOString()
        }
      },
      requestHeaders: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': 'sha512=def456ghi789...',
        'X-Webhook-Timestamp': '1698765132',
        'User-Agent': 'BGP-Webhooks/1.0'
      },
      errorMessage: 'Connection timeout after 30 seconds',
      signature: 'sha512=def456ghi789...',
      signatureTimestamp: '1698765132',
      nextRetry: new Date(Date.now() + 1800000)?.toISOString()
    },
    {
      id: 'evt_abcdef1234567890',
      eventType: 'payout.completed',
      status: 'success',
      attempts: 1,
      responseCode: 200,
      responseTime: 89,
      timestamp: new Date(Date.now() - 900000)?.toISOString(),
      verified: true,
      duration: '89ms',
      payload: {
        id: 'payout_abcdef123',
        event: 'payout.completed',
        data: {
          id: 'payout_abcdef123',
          amount: 1.5,
          currency: 'ETH',
          status: 'completed',
          destination_address: '0xabcdef1234567890abcdef1234567890abcdef12',
          tx_hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
          completed_at: new Date()?.toISOString()
        }
      },
      requestHeaders: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': 'sha512=ghi789jkl012...',
        'X-Webhook-Timestamp': '1698764832',
        'User-Agent': 'BGP-Webhooks/1.0'
      },
      responseBody: '{"status":"received","id":"webhook_12345"}',
      signature: 'sha512=ghi789jkl012...',
      signatureTimestamp: '1698764832',
      verificationTime: 8
    },
    {
      id: 'evt_fedcba0987654321',
      eventType: 'invoice.paid',
      status: 'retrying',
      attempts: 2,
      responseCode: 502,
      responseTime: 5000,
      timestamp: new Date(Date.now() - 1200000)?.toISOString(),
      verified: true,
      duration: '5000ms',
      payload: {
        id: 'inv_fedcba098',
        event: 'invoice.paid',
        data: {
          id: 'inv_fedcba098',
          amount: 99.99,
          currency: 'USDC',
          status: 'paid',
          customer_email: 'client@business.com',
          paid_at: new Date()?.toISOString()
        }
      },
      requestHeaders: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': 'sha512=jkl012mno345...',
        'X-Webhook-Timestamp': '1698764532',
        'User-Agent': 'BGP-Webhooks/1.0'
      },
      responseBody: 'Bad Gateway',
      errorMessage: 'Upstream server returned 502 Bad Gateway',
      signature: 'sha512=jkl012mno345...',
      signatureTimestamp: '1698764532',
      nextRetry: new Date(Date.now() + 900000)?.toISOString(),
      verificationTime: 15
    },
    {
      id: 'evt_1357924680abcdef',
      eventType: 'payment.failed',
      status: 'success',
      attempts: 1,
      responseCode: 200,
      responseTime: 234,
      timestamp: new Date(Date.now() - 1800000)?.toISOString(),
      verified: true,
      duration: '234ms',
      payload: {
        id: 'pay_1357924680',
        event: 'payment.failed',
        data: {
          id: 'pay_1357924680',
          amount: 0.005,
          currency: 'BTC',
          status: 'failed',
          failure_reason: 'insufficient_funds',
          customer_email: 'test@example.com',
          failed_at: new Date()?.toISOString()
        }
      },
      requestHeaders: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': 'sha512=mno345pqr678...',
        'X-Webhook-Timestamp': '1698763932',
        'User-Agent': 'BGP-Webhooks/1.0'
      },
      responseBody: 'Event processed successfully',
      signature: 'sha512=mno345pqr678...',
      signatureTimestamp: '1698763932',
      verificationTime: 11
    }
  ];

  const handleSaveEndpoint = (endpointData) => {
    setWebhookEndpoint(endpointData);
    // Show success notification
    console.log('Webhook endpoint saved:', endpointData);
  };

  const handleTestEndpoint = (endpointData) => {
    console.log('Testing webhook endpoint:', endpointData);
    // Implement test logic
  };

  const handleRetryEvent = (eventId) => {
    console.log('Retrying webhook event:', eventId);
    // Implement retry logic
  };

  const handleViewPayload = (event) => {
    setSelectedEvent(event);
    setIsPayloadViewerOpen(true);
  };

  const handleWebhookTest = (payload, result) => {
    console.log('Webhook test completed:', { payload, result });
    // Handle test result
  };

  useEffect(() => {
    document.title = 'Webhook Management - Blockchain Global Payments';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard-overview')}
                className="p-2 hover:bg-muted rounded-lg transition-smooth"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Webhook Management</h1>
                <p className="text-muted-foreground mt-1">
                  Configure and monitor event-driven integrations
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/api-keys-management')}
                iconName="Key"
              >
                API Keys
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/documentation')}
                iconName="BookOpen"
              >
                Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 space-y-8">
        {/* Metrics Overview */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Performance Metrics</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor webhook delivery performance and endpoint health
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>Real-time monitoring active</span>
            </div>
          </div>
          <WebhookMetrics metrics={webhookMetrics} />
        </div>

        {/* Endpoint Configuration */}
        <WebhookEndpointConfig
          onSave={handleSaveEndpoint}
          onTest={handleTestEndpoint}
          existingEndpoint={webhookEndpoint}
        />

        {/* Test Panel */}
        <WebhookTestPanel
          onTest={handleWebhookTest}
          isOpen={isTestPanelOpen}
          onToggle={() => setIsTestPanelOpen(!isTestPanelOpen)}
        />

        {/* Event Log */}
        <WebhookEventLog
          events={webhookEvents}
          onRetry={handleRetryEvent}
          onViewPayload={handleViewPayload}
        />

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Integration Guide */}
          <div className="glassmorphism rounded-lg p-6 border border-border">
            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Icon name="BookOpen" size={20} color="var(--color-accent)" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">Integration Guide</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn how to implement webhook handling in your application with proper security practices.
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/documentation')}
                    iconName="ExternalLink"
                  >
                    View Documentation
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="glassmorphism rounded-lg p-6 border border-border">
            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                <Icon name="Shield" size={20} color="var(--color-success)" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">Security Checklist</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={14} color="var(--color-success)" />
                    <span className="text-muted-foreground">HTTPS endpoint configured</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={14} color="var(--color-success)" />
                    <span className="text-muted-foreground">HMAC signature verification enabled</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={14} color="var(--color-success)" />
                    <span className="text-muted-foreground">Idempotency handling implemented</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertTriangle" size={14} color="var(--color-warning)" />
                    <span className="text-muted-foreground">Rate limiting recommended</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payload Viewer Modal */}
      <WebhookPayloadViewer
        event={selectedEvent}
        isOpen={isPayloadViewerOpen}
        onClose={() => {
          setIsPayloadViewerOpen(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
};

export default WebhookManagement;