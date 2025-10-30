import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

export default function SubscriptionPlanForm({ plan, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    currency: 'USD',
    billing_interval: 'monthly',
    trial_days: '',
    max_subscribers: '',
    features: [''],
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with existing plan data
  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan?.name || '',
        description: plan?.description || '',
        amount: plan?.amount?.toString() || '',
        currency: plan?.currency || 'USD',
        billing_interval: plan?.billing_interval || 'monthly',
        trial_days: plan?.trial_days?.toString() || '',
        max_subscribers: plan?.max_subscribers?.toString() || '',
        features: plan?.features?.length > 0 ? plan?.features : [''],
        status: plan?.status || 'active'
      });
    }
  }, [plan]);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Handle feature changes
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData?.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  // Add new feature field
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev?.features, '']
    }));
  };

  // Remove feature field
  const removeFeature = (index) => {
    if (formData?.features?.length > 1) {
      const newFeatures = formData?.features?.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        features: newFeatures
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Plan name is required';
    }

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (formData?.trial_days && parseInt(formData?.trial_days) < 0) {
      newErrors.trial_days = 'Trial days cannot be negative';
    }

    const validFeatures = formData?.features?.filter(f => f?.trim());
    if (validFeatures?.length === 0) {
      newErrors.features = 'At least one feature is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const planData = {
        name: formData?.name?.trim(),
        description: formData?.description?.trim(),
        amount: parseFloat(formData?.amount),
        currency: formData?.currency,
        billing_interval: formData?.billing_interval,
        trial_days: formData?.trial_days ? parseInt(formData?.trial_days) : 0,
        max_subscribers: formData?.max_subscribers ? parseInt(formData?.max_subscribers) : null,
        features: formData?.features?.filter(f => f?.trim()),
        status: formData?.status
      };

      await onSave?.(planData);
    } catch (error) {
      console.error('Error saving plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {plan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Name *
                </label>
                <Input
                  value={formData?.name}
                  onChange={(e) => handleChange('name', e?.target?.value)}
                  placeholder="e.g., Basic Plan"
                  className={errors?.name ? 'border-red-300' : ''}
                />
                {errors?.name && (
                  <p className="text-red-600 text-sm mt-1">{errors?.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  value={formData?.status}
                  onChange={(value) => handleChange('status', value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData?.description}
                onChange={(e) => handleChange('description', e?.target?.value)}
                placeholder="Brief description of the plan"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData?.amount}
                  onChange={(e) => handleChange('amount', e?.target?.value)}
                  placeholder="0.00"
                  className={errors?.amount ? 'border-red-300' : ''}
                />
                {errors?.amount && (
                  <p className="text-red-600 text-sm mt-1">{errors?.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <Select
                  value={formData?.currency}
                  onChange={(value) => handleChange('currency', value)}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Interval
                </label>
                <Select
                  value={formData?.billing_interval}
                  onChange={(value) => handleChange('billing_interval', value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trial Days
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData?.trial_days}
                  onChange={(e) => handleChange('trial_days', e?.target?.value)}
                  placeholder="0"
                  className={errors?.trial_days ? 'border-red-300' : ''}
                />
                {errors?.trial_days && (
                  <p className="text-red-600 text-sm mt-1">{errors?.trial_days}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Subscribers (Optional)
              </label>
              <Input
                type="number"
                min="1"
                value={formData?.max_subscribers}
                onChange={(e) => handleChange('max_subscribers', e?.target?.value)}
                placeholder="Leave empty for unlimited"
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Features</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Feature
              </Button>
            </div>

            <div className="space-y-2">
              {formData?.features?.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e?.target?.value)}
                    placeholder={`Feature ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    disabled={formData?.features?.length <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {errors?.features && (
              <p className="text-red-600 text-sm">{errors?.features}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Saving...' : (plan ? 'Update Plan' : 'Create Plan')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}