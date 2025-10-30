import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const CreatePayoutForm = ({ onSubmit, onCancel }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    walletAddress: '',
    description: '',
    priority: 'normal',
    memo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Add missing data arrays
  const currencies = [
    { value: 'USD', label: 'USD', fee: '0.005 USD' },
    { value: 'BTC', label: 'Bitcoin', fee: '0.0001 BTC' },
    { value: 'ETH', label: 'Ethereum', fee: '0.002 ETH' }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority', description: 'Process within 24 hours' },
    { value: 'normal', label: 'Normal Priority', description: 'Process within 2-4 hours' },
    { value: 'high', label: 'High Priority', description: 'Process within 30 minutes' }
  ];

  // Add missing handler function
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Add missing handler function
  const handleViewBalance = () => {
    navigate('/wallet');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Process payout
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Simulate payout creation
        setTimeout(() => {
          setIsSubmitting(false);
          navigate('/payout-management?success=true');
        }, 2000);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error('Payout creation failed:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/payout-management');
    }
  };

  const handleSaveDraft = () => {
    // Save as draft
    console.log('Saving payout draft:', formData);
    navigate('/payout-management');
  };

  const handleViewHistory = () => {
    navigate('/payout-management?tab=history');
  };

  const handleCheckAddress = () => {
    // Could open a modal or navigate to address validation
    navigate('/documentation');
  };

  const handleViewFees = () => {
    navigate('/pricing');
  };

  // Auto-fill demo data
  const fillDemoData = () => {
    setFormData({
      amount: '0.05',
      currency: 'USD',
      walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      description: 'Weekly payout to affiliate',
      priority: 'normal',
      memo: ''
    });
    setErrors({});
  };

  const selectedCurrency = currencies?.find(c => c?.value === formData?.currency);
  const selectedPriority = priorities?.find(p => p?.value === formData?.priority);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo Data Helper */}
      <div className="glassmorphism p-4 rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-foreground">Quick Demo</h4>
            <p className="text-sm text-muted-foreground">Fill form with sample payout data</p>
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
      {/* Amount & Currency */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Payout Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            name="amount"
            value={formData?.amount}
            onChange={handleInputChange}
            placeholder="0.05"
            error={errors?.amount}
            required
            disabled={isLoading}
            step="0.00000001"
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
            {selectedCurrency && (
              <p className="text-xs text-muted-foreground mt-1">
                Network fee: {selectedCurrency?.fee}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Destination Address */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-foreground">
            Destination Address
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCheckAddress}
            iconName="Search"
            iconPosition="left"
            className="text-xs"
          >
            Validate Address
          </Button>
        </div>
        
        <Input
          type="text"
          name="walletAddress"
          value={formData?.walletAddress}
          onChange={handleInputChange}
          placeholder="Enter cryptocurrency address..."
          error={errors?.walletAddress}
          required
          disabled={isLoading}
        />
        
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} color="#f59e0b" className="mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>Warning:</strong> Double-check the address. Crypto transactions cannot be reversed.
            </div>
          </div>
        </div>
      </div>
      {/* Priority & Description */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Priority Level
          </label>
          <select
            name="priority"
            value={formData?.priority}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
            disabled={isLoading}
          >
            {priorities?.map(priority => (
              <option key={priority?.value} value={priority?.value}>
                {priority?.label}
              </option>
            ))}
          </select>
          {selectedPriority && (
            <p className="text-xs text-muted-foreground mt-1">
              {selectedPriority?.description}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData?.description}
            onChange={handleInputChange}
            placeholder="Describe the purpose of this payout..."
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
          label="Internal Memo (Optional)"
          type="text"
          name="memo"
          value={formData?.memo}
          onChange={handleInputChange}
          placeholder="Internal reference or note"
          disabled={isLoading}
        />
      </div>
      {/* Balance & Fee Information */}
      <div className="glassmorphism p-4 rounded-lg border border-border">
        <h4 className="font-medium text-foreground mb-3">Transaction Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payout Amount:</span>
            <span className="text-foreground font-medium">
              {formData?.amount || '0'} {formData?.currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Network Fee:</span>
            <span className="text-foreground font-medium">
              {selectedCurrency?.fee || 'N/A'}
            </span>
          </div>
          <div className="border-t border-border pt-2 mt-2">
            <div className="flex justify-between font-medium">
              <span className="text-foreground">Total Deducted:</span>
              <span className="text-foreground">
                {formData?.amount ? `${parseFloat(formData?.amount) + 0.005} ${formData?.currency}` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleViewBalance}
            iconName="Wallet"
            iconPosition="left"
            className="text-xs"
          >
            View Balance
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleViewFees}
            iconName="Info"
            iconPosition="left"
            className="text-xs"
          >
            Fee Structure
          </Button>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="glassmorphism p-4 rounded-lg border border-border">
        <h4 className="font-medium text-foreground mb-3">Quick Actions</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleViewHistory}
            iconName="History"
            iconPosition="left"
            className="text-xs"
          >
            Payout History
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard-overview')}
            iconName="BarChart"
            iconPosition="left"
            className="text-xs"
          >
            Analytics
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/merchant-settings')}
            iconName="Settings"
            iconPosition="left"
            className="text-xs"
          >
            Settings
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
            onClick={handleViewHistory}
            iconName="History"
          >
            View History
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting}
            className="gradient-primary text-white"
            iconName="Send"
            iconPosition="right"
          >
            {isSubmitting ? 'Processing...' : 'Request Payout'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreatePayoutForm;