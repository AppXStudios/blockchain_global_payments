import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const InvoiceForm = ({ onNext }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    description: '',
    customerEmail: '',
    customerName: '',
    expiresIn: '24'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    // Process form data
    console.log('Invoice data:', formData);
    if (onNext) {
      onNext(formData);
    } else {
      navigate('/invoice-creation?step=preview');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard-overview');
  };

  const handleSaveDraft = () => {
    // Save as draft
    console.log('Saving draft:', formData);
    navigate('/dashboard-overview');
  };

  const handleViewTemplates = () => {
    navigate('/invoice-creation?tab=templates');
  };

  const handleViewPayments = () => {
    navigate('/payments');
  };

  const handleConfigureWebhooks = () => {
    navigate('/settings/webhooks');
  };

  // Auto-fill demo data
  const fillDemoData = () => {
    setFormData({
      customerEmail: 'customer@example.com',
      customerName: 'John Doe',
      amount: '299.99',
      currency: 'USD',
      description: 'Monthly subscription payment',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0],
      memo: 'Payment due within 7 days',
      redirectUrl: 'https://yoursite.com/success',
      webhook: 'https://yoursite.com/webhook'
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo Data Helper */}
      <div className="glassmorphism p-4 rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-foreground">Quick Demo</h4>
            <p className="text-sm text-muted-foreground">Fill form with sample data</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillDemoData}
            iconName="Zap"
            iconPosition="left"
          >
            Use Demo Data
          </Button>
        </div>
      </div>

      {/* Customer Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Customer Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Customer Email"
            type="email"
            name="customerEmail"
            value={formData?.customerEmail}
            onChange={handleInputChange}
            placeholder="customer@example.com"
            error={errors?.customerEmail}
            required
            disabled={isLoading}
          />
          
          <Input
            label="Customer Name (Optional)"
            type="text"
            name="customerName"
            value={formData?.customerName}
            onChange={handleInputChange}
            placeholder="John Doe"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Payment Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            name="amount"
            value={formData?.amount}
            onChange={handleInputChange}
            placeholder="100.00"
            error={errors?.amount}
            required
            disabled={isLoading}
            step="0.01"
            min="0"
          />
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Currency
            </label>
            <select
              name="currency"
              value={formData?.currency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
              disabled={isLoading}
            >
              {currencies?.map(currency => (
                <option key={currency?.value} value={currency?.value}>
                  {currency?.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData?.description}
            onChange={handleInputChange}
            placeholder="Describe what this payment is for..."
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-accent focus:border-transparent resize-none ${
              errors?.description ? 'border-red-500' : 'border-border'
            }`}
            disabled={isLoading}
          />
          {errors?.description && (
            <p className="mt-1 text-sm text-red-500">{errors?.description}</p>
          )}
        </div>

        <Input
          label="Due Date (Optional)"
          type="date"
          name="dueDate"
          value={formData?.dueDate}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </div>

      {/* Advanced Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Advanced Options</h3>
        
        <Input
          label="Internal Memo (Optional)"
          type="text"
          name="memo"
          value={formData?.memo}
          onChange={handleInputChange}
          placeholder="Internal note for this invoice"
          disabled={isLoading}
        />

        <Input
          label="Success Redirect URL (Optional)"
          type="url"
          name="redirectUrl"
          value={formData?.redirectUrl}
          onChange={handleInputChange}
          placeholder="https://yoursite.com/success"
          disabled={isLoading}
        />

        <Input
          label="Webhook URL (Optional)"
          type="url"
          name="webhook"
          value={formData?.webhook}
          onChange={handleInputChange}
          placeholder="https://yoursite.com/webhook"
          disabled={isLoading}
        />
      </div>

      {/* Quick Actions */}
      <div className="glassmorphism p-4 rounded-lg border border-border">
        <h4 className="font-medium text-foreground mb-3">Need Help?</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleViewTemplates}
            iconName="FileText"
            iconPosition="left"
            className="text-xs"
          >
            Templates
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleViewPayments}
            iconName="CreditCard"
            iconPosition="left"
            className="text-xs"
          >
            View Payments
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleConfigureWebhooks}
            iconName="Webhook"
            iconPosition="left"
            className="text-xs"
          >
            Setup Webhooks
          </Button>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            iconName="Save"
          >
            Save Draft
          </Button>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleViewTemplates}
            iconName="Template"
          >
            Templates
          </Button>
          <Button
            type="submit"
            variant="default"
            className="gradient-primary text-white"
            iconName="ArrowRight"
            iconPosition="right"
          >
            Create Invoice
          </Button>
        </div>
      </div>
    </form>
  );
};

export default InvoiceForm;