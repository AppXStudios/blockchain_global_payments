import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import InvoiceTemplates from './components/InvoiceTemplates';
import InvoiceSuccess from './components/InvoiceSuccess';

const InvoiceCreation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    description: '',
    customerEmail: '',
    expirationHours: '24',
    successUrl: '',
    webhookUrl: '',
    allowPartialPayments: false,
    requireCustomerInfo: true,
    enableQrCode: true
  });

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    
    // Mock API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFormData(data);
      setCurrentStep('success');
    } catch (error) {
      console.error('Failed to create invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (templateData) => {
    setFormData(templateData);
    setShowTemplates(false);
  };

  const handleSaveTemplate = (template) => {
    // Mock save template
    console.log('Saving template:', template);
  };

  const handleCreateAnother = () => {
    setCurrentStep('form');
    setFormData({
      amount: '',
      currency: 'USD',
      description: '',
      customerEmail: '',
      expirationHours: '24',
      successUrl: '',
      webhookUrl: '',
      allowPartialPayments: false,
      requireCustomerInfo: true,
      enableQrCode: true
    });
  };

  const handleViewInvoices = () => {
    navigate('/payments-management');
  };

  const handleEditPreview = () => {
    // Focus on form if needed
    document.querySelector('input[type="number"]')?.focus();
  };

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <InvoiceSuccess
            invoiceData={formData}
            onCreateAnother={handleCreateAnother}
            onViewInvoices={handleViewInvoices}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard-overview')}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Create Invoice</h1>
                <p className="text-muted-foreground">Generate hosted payment links for cryptocurrency transactions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowTemplates(!showTemplates)}
                iconName="Template"
                iconPosition="left"
              >
                {showTemplates ? 'Hide Templates' : 'Templates'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/payments-management')}
                iconName="FileText"
                iconPosition="left"
              >
                View Invoices
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Form and Templates */}
          <div className="xl:col-span-2 space-y-8">
            {/* Templates Section */}
            {showTemplates && (
              <InvoiceTemplates
                onSelectTemplate={handleSelectTemplate}
                onSaveTemplate={handleSaveTemplate}
                currentFormData={formData}
              />
            )}

            {/* Invoice Form */}
            <InvoiceForm
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              initialData={formData}
              onChange={setFormData}
            />

            {/* Quick Stats */}
            <div className="glassmorphism rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4">Invoice Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">127</div>
                  <div className="text-xs text-muted-foreground">Total Invoices</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">89</div>
                  <div className="text-xs text-muted-foreground">Paid</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">23</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-error">15</div>
                  <div className="text-xs text-muted-foreground">Expired</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <InvoicePreview
                invoiceData={formData}
                onEdit={handleEditPreview}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="border-t border-border bg-card/50">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-6">Need Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glassmorphism rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-3 mb-3">
                  <Icon name="BookOpen" size={20} color="var(--color-accent)" />
                  <h3 className="font-medium text-foreground">Documentation</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Learn how to create and manage invoices effectively
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/documentation')}
                  iconName="ExternalLink"
                  iconPosition="right"
                >
                  View Docs
                </Button>
              </div>

              <div className="glassmorphism rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-3 mb-3">
                  <Icon name="Code" size={20} color="var(--color-accent)" />
                  <h3 className="font-medium text-foreground">API Integration</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Integrate invoice creation into your applications
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/api-keys-management')}
                  iconName="ExternalLink"
                  iconPosition="right"
                >
                  API Keys
                </Button>
              </div>

              <div className="glassmorphism rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-3 mb-3">
                  <Icon name="MessageCircle" size={20} color="var(--color-accent)" />
                  <h3 className="font-medium text-foreground">Support</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Get help from our support team
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/contact')}
                  iconName="ExternalLink"
                  iconPosition="right"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreation;