import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import CodeBlock from './CodeBlock';

const DocumentationContent = ({ activeSection, searchQuery }) => {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState([]);

  const handleTryAPI = () => {
    navigate('/api-testing');
  };

  const handleGetStarted = () => {
    navigate('/getting-started');
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(prev => [...prev, code]);
    setTimeout(() => {
      setCopiedCode(prev => prev.filter(c => c !== code));
    }, 2000);
  };

  const handleContactSupport = () => {
    navigate('/support');
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  const handleQuickStart = () => {
    navigate('/merchant-onboarding');
  };

  const handleAPIKeys = () => {
    navigate('/api-keys-management');
  };

  const handleViewExample = () => {
    navigate('/hosted-checkout');
  };

  const handleContact = () => {
    navigate('/contact');
  };

  const handleDashboard = () => {
    navigate('/dashboard-overview');
  };

  const renderGetStartedContent = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Getting Started</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to Blockchain Global Payments API documentation. Get started with cryptocurrency payments in minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            icon: 'Key',
            title: 'Get API Keys',
            description: 'Create your account and generate API keys',
            action: 'Get Keys',
            handler: handleAPIKeys
          },
          {
            icon: 'Code',
            title: 'Make First Request',
            description: 'Test your integration with our sandbox',
            action: 'Try Now',
            handler: handleTryAPI
          },
          {
            icon: 'Webhook',
            title: 'Setup Webhooks',
            description: 'Receive real-time payment notifications',
            action: 'Configure',
            handler: () => navigate('/webhook-management')
          },
          {
            icon: 'Shield',
            title: 'Go Live',
            description: 'Switch to production and start accepting payments',
            action: 'Go Live',
            handler: handleGetStarted
          }
        ]?.map((step, index) => (
          <div key={index} className="glassmorphism p-6 rounded-xl border border-border hover:border-accent/30 transition-smooth">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Icon name={step?.icon} size={24} color="var(--color-accent)" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">{step?.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{step?.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={step?.handler}
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  {step?.action}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glassmorphism p-6 rounded-xl border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-4">Quick Integration</h3>
        <CodeBlock
          title="Quick Start Example"
          language="javascript"
          code={`// Install the SDK
npm install @bgp/crypto-payments

// Initialize client
import BGP from '@bgp/crypto-payments';
const client = new BGP('your-api-key');

// Create payment
const payment = await client.payments.create({
  amount: 100.00,
  currency: 'USD',
  paymentCurrency: 'BTC'
});

console.log(payment.checkoutUrl);`}
          onCopy={handleCopyCode}
          isCopied={copiedCode?.includes('Install the SDK')}
        />
        
        <div className="mt-4 flex space-x-3">
          <Button
            variant="default"
            onClick={handleGetStarted}
            iconName="Play"
            iconPosition="left"
          >
            Try Example
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/api-keys-management')}
            iconName="Key"
            iconPosition="left"
          >
            Get API Keys
          </Button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          variant="default"
          onClick={handleQuickStart}
          iconName="Rocket"
          iconPosition="left"
        >
          Quick Start
        </Button>
        <Button
          variant="outline"
          onClick={handleAPIKeys}
          iconName="Key"
          iconPosition="left"
        >
          Get API Keys
        </Button>
        <Button
          variant="ghost"
          onClick={handleViewExample}
          iconName="Play"
          iconPosition="left"
        >
          View Live Demo
        </Button>
      </div>

      {/* Help Links */}
      <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-foreground mb-2">Need Help?</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <button
            onClick={handleContact}
            className="text-accent hover:text-accent/80 transition-smooth"
          >
            Contact Support
          </button>
          <button
            onClick={handleDashboard}
            className="text-accent hover:text-accent/80 transition-smooth"
          >
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  const renderAPIContent = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-4">API Reference</h1>
        <p className="text-lg text-muted-foreground">
          Complete reference for all API endpoints, parameters, and responses.
        </p>
      </div>

      <div className="space-y-6">
        {[
          {
            method: 'POST',
            endpoint: '/payments',
            title: 'Create Payment',
            description: 'Create a new cryptocurrency payment',
            example: 'payment'
          },
          {
            method: 'GET',
            endpoint: '/payments/{id}',
            title: 'Get Payment',
            description: 'Retrieve payment details',
            example: 'payment'
          },
          {
            method: 'POST',
            endpoint: '/invoices',
            title: 'Create Invoice',
            description: 'Generate a hosted payment invoice',
            example: 'invoice'
          },
          {
            method: 'POST',
            endpoint: '/payouts',
            title: 'Create Payout',
            description: 'Send cryptocurrency to an address',
            example: 'payout'
          }
        ]?.map((endpoint, index) => (
          <div key={index} className="glassmorphism p-6 rounded-xl border border-border">
            <div className="flex items-center space-x-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                endpoint?.method === 'POST' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {endpoint?.method}
              </span>
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {endpoint?.endpoint}
              </code>
            </div>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {endpoint?.title}
            </h3>
            <p className="text-muted-foreground mb-4">
              {endpoint?.description}
            </p>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewExample(endpoint?.example)}
                iconName="Eye"
                iconPosition="left"
              >
                View Example
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTryAPI}
                iconName="Play"
                iconPosition="left"
              >
                Try API
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="glassmorphism p-6 rounded-xl border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-4">Need Help?</h3>
        <div className="flex space-x-4">
          <Button
            variant="default"
            onClick={handleContactSupport}
            iconName="MessageCircle"
            iconPosition="left"
          >
            Contact Support
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/system-status')}
            iconName="Activity"
            iconPosition="left"
          >
            System Status
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return renderGetStartedContent();
      case 'api-reference':
        return renderAPIContent();
      case 'webhooks':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Webhooks</h1>
              <p className="text-lg text-muted-foreground">
                Set up webhooks to receive real-time notifications about payment events.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Button
                variant="default"
                onClick={() => navigate('/webhook-management')}
                iconName="Webhook"
                iconPosition="left"
              >
                Setup Webhooks
              </Button>
              <Button
                variant="outline"
                onClick={handleContactSupport}
                iconName="HelpCircle"
                iconPosition="left"
              >
                Get Help
              </Button>
            </div>
          </div>
        );
      case 'sdks':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">SDKs & Libraries</h1>
              <p className="text-lg text-muted-foreground">
                Official SDKs and libraries for popular programming languages.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Button
                variant="default"
                onClick={handleGetStarted}
                iconName="Download"
                iconPosition="left"
              >
                Download SDKs
              </Button>
              <Button
                variant="outline"
                onClick={handleViewDashboard}
                iconName="Code"
                iconPosition="left"
              >
                View Examples
              </Button>
            </div>
          </div>
        );
      case 'guides':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Integration Guides</h1>
              <p className="text-lg text-muted-foreground">
                Step-by-step guides for common integration scenarios.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Button
                variant="default"
                onClick={() => navigate('/payments-management')}
                iconName="BookOpen"
                iconPosition="left"
              >
                Payment Integration
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/invoice-creation')}
                iconName="FileText"
                iconPosition="left"
              >
                Invoice Setup
              </Button>
            </div>
          </div>
        );
      default:
        return renderGetStartedContent();
    }
  };

  return (
    <div className="flex-1 p-8">
      {renderContent()}
    </div>
  );
};

export default DocumentationContent;