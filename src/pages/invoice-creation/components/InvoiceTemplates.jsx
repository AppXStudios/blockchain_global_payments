import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const InvoiceTemplates = ({ onSelectTemplate, onSaveTemplate, currentFormData }) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const mockTemplates = [
    {
      id: 'template_1',
      name: 'Standard Service Invoice',
      description: 'Basic service payment template',
      amount: '100.00',
      currency: 'USD',
      expirationHours: '24',
      allowPartialPayments: false,
      requireCustomerInfo: true,
      enableQrCode: true,
      usageCount: 15,
      lastUsed: new Date(Date.now() - 86400000 * 2)
    },
    {
      id: 'template_2',
      name: 'Product Purchase',
      description: 'E-commerce product payment',
      amount: '250.00',
      currency: 'USD',
      expirationHours: '72',
      allowPartialPayments: true,
      requireCustomerInfo: true,
      enableQrCode: true,
      usageCount: 8,
      lastUsed: new Date(Date.now() - 86400000 * 5)
    },
    {
      id: 'template_3',
      name: 'Subscription Payment',
      description: 'Monthly subscription billing',
      amount: '29.99',
      currency: 'USD',
      expirationHours: '168',
      allowPartialPayments: false,
      requireCustomerInfo: true,
      enableQrCode: false,
      usageCount: 42,
      lastUsed: new Date(Date.now() - 86400000 * 1)
    }
  ];

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    })?.format(amount || 0);
  };

  const formatLastUsed = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const handleSelectTemplate = (template) => {
    const templateData = {
      amount: template?.amount,
      currency: template?.currency,
      description: template?.description,
      expirationHours: template?.expirationHours,
      allowPartialPayments: template?.allowPartialPayments,
      requireCustomerInfo: template?.requireCustomerInfo,
      enableQrCode: template?.enableQrCode,
      customerEmail: '',
      successUrl: '',
      webhookUrl: ''
    };
    onSelectTemplate(templateData);
  };

  const handleSaveTemplate = () => {
    if (templateName?.trim()) {
      const template = {
        id: `template_${Date.now()}`,
        name: templateName,
        ...currentFormData,
        usageCount: 0,
        lastUsed: new Date()
      };
      onSaveTemplate(template);
      setTemplateName('');
      setShowSaveDialog(false);
    }
  };

  const canSaveTemplate = currentFormData?.amount && currentFormData?.description;

  return (
    <div className="glassmorphism rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Invoice Templates</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Quick-start with pre-configured invoice templates
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSaveDialog(true)}
          disabled={!canSaveTemplate}
          iconName="Save"
          iconPosition="left"
        >
          Save Current
        </Button>
      </div>
      {/* Templates Grid */}
      <div className="space-y-4">
        {mockTemplates?.map((template) => (
          <div
            key={template?.id}
            className="glassmorphism rounded-lg p-4 border border-border hover:border-accent/30 transition-smooth cursor-pointer group"
            onClick={() => handleSelectTemplate(template)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-foreground group-hover:text-accent transition-smooth">
                    {template?.name}
                  </h4>
                  <Icon name="Template" size={16} color="var(--color-muted-foreground)" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">{template?.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Icon name="DollarSign" size={12} />
                    <span>{formatAmount(template?.amount, template?.currency)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{template?.expirationHours}h</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="BarChart3" size={12} />
                    <span>{template?.usageCount} uses</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>{formatLastUsed(template?.lastUsed)}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {/* Feature Indicators */}
                <div className="flex space-x-1">
                  {template?.enableQrCode && (
                    <div className="w-2 h-2 rounded-full bg-accent" title="QR Code enabled" />
                  )}
                  {template?.allowPartialPayments && (
                    <div className="w-2 h-2 rounded-full bg-success" title="Partial payments allowed" />
                  )}
                  {template?.requireCustomerInfo && (
                    <div className="w-2 h-2 rounded-full bg-warning" title="Customer info required" />
                  )}
                </div>
                
                <Icon 
                  name="ChevronRight" 
                  size={16} 
                  color="var(--color-muted-foreground)"
                  className="group-hover:text-accent transition-smooth" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {mockTemplates?.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Icon name="FileText" size={24} color="var(--color-muted-foreground)" />
          </div>
          <h4 className="font-medium text-foreground mb-2">No Templates Yet</h4>
          <p className="text-muted-foreground text-sm">
            Create your first invoice to save it as a template
          </p>
        </div>
      )}
      {/* Save Template Dialog */}
      {showSaveDialog && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSaveDialog(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-60 w-full max-w-md">
            <div className="glassmorphism rounded-xl p-6 border border-border shadow-elevation-lg">
              <h4 className="font-semibold text-foreground mb-4">Save as Template</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e?.target?.value)}
                    placeholder="Enter template name"
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowSaveDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleSaveTemplate}
                    disabled={!templateName?.trim()}
                    className="gradient-primary text-white"
                  >
                    Save Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceTemplates;