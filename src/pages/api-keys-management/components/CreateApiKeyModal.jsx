import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const CreateApiKeyModal = ({ isOpen, onClose, onCreateKey }) => {
  const [formData, setFormData] = useState({
    name: '',
    permissions: [],
    ipAllowlist: [''],
    rateLimit: 1000,
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false);

  const availablePermissions = [
    { id: 'payments.read', label: 'Read Payments', description: 'View payment transactions' },
    { id: 'payments.write', label: 'Create Payments', description: 'Create new payment requests' },
    { id: 'invoices.read', label: 'Read Invoices', description: 'View invoice data' },
    { id: 'invoices.write', label: 'Create Invoices', description: 'Create and manage invoices' },
    { id: 'payouts.read', label: 'Read Payouts', description: 'View payout information' },
    { id: 'payouts.write', label: 'Create Payouts', description: 'Initiate payout requests' },
    { id: 'webhooks.read', label: 'Read Webhooks', description: 'View webhook configurations' },
    { id: 'webhooks.write', label: 'Manage Webhooks', description: 'Create and modify webhooks' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handlePermissionChange = (permissionId, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev?.permissions, permissionId]
        : prev?.permissions?.filter(p => p !== permissionId)
    }));
  };

  const handleIpChange = (index, value) => {
    const newIpList = [...formData?.ipAllowlist];
    newIpList[index] = value;
    setFormData(prev => ({
      ...prev,
      ipAllowlist: newIpList
    }));
  };

  const addIpField = () => {
    setFormData(prev => ({
      ...prev,
      ipAllowlist: [...prev?.ipAllowlist, '']
    }));
  };

  const removeIpField = (index) => {
    if (formData?.ipAllowlist?.length > 1) {
      const newIpList = formData?.ipAllowlist?.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ipAllowlist: newIpList
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'API key name is required';
    }

    if (formData?.permissions?.length === 0) {
      newErrors.permissions = 'At least one permission must be selected';
    }

    // Validate IP addresses
    const validIps = formData?.ipAllowlist?.filter(ip => ip?.trim());
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
    
    for (const ip of validIps) {
      if (!ipRegex?.test(ip?.trim())) {
        newErrors.ipAllowlist = 'Invalid IP address format. Use CIDR notation (e.g., 192.168.1.1/24)';
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsCreating(true);
    try {
      const keyData = {
        ...formData,
        ipAllowlist: formData?.ipAllowlist?.filter(ip => ip?.trim()),
        createdAt: new Date()?.toISOString()
      };
      
      await onCreateKey(keyData);
      onClose();
      setFormData({
        name: '',
        permissions: [],
        ipAllowlist: [''],
        rateLimit: 1000,
        description: ''
      });
    } catch (error) {
      setErrors({ submit: 'Failed to create API key. Please try again.' });
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glassmorphism border border-border rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Create API Key</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Generate a new API key for your application integration
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
              iconSize={20}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
              
              <Input
                label="API Key Name"
                type="text"
                placeholder="e.g., Production API Key"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                error={errors?.name}
                required
              />

              <Input
                label="Description"
                type="text"
                placeholder="Optional description for this API key"
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
              />

              <Input
                label="Rate Limit (requests per hour)"
                type="number"
                placeholder="1000"
                value={formData?.rateLimit}
                onChange={(e) => handleInputChange('rateLimit', parseInt(e?.target?.value) || 1000)}
                min="100"
                max="10000"
              />
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground">Permissions</h3>
                <p className="text-sm text-muted-foreground">
                  Select the API endpoints this key can access
                </p>
                {errors?.permissions && (
                  <p className="text-sm text-error mt-1">{errors?.permissions}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availablePermissions?.map((permission) => (
                  <div key={permission?.id} className="p-4 border border-border rounded-lg">
                    <Checkbox
                      label={permission?.label}
                      description={permission?.description}
                      checked={formData?.permissions?.includes(permission?.id)}
                      onChange={(e) => handlePermissionChange(permission?.id, e?.target?.checked)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* IP Allowlist */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground">IP Allowlist</h3>
                <p className="text-sm text-muted-foreground">
                  Restrict API key usage to specific IP addresses (optional)
                </p>
                {errors?.ipAllowlist && (
                  <p className="text-sm text-error mt-1">{errors?.ipAllowlist}</p>
                )}
              </div>

              <div className="space-y-3">
                {formData?.ipAllowlist?.map((ip, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="192.168.1.1/24 or leave empty for all IPs"
                      value={ip}
                      onChange={(e) => handleIpChange(index, e?.target?.value)}
                      className="flex-1"
                    />
                    {formData?.ipAllowlist?.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIpField(index)}
                        iconName="Trash2"
                        iconSize={16}
                        className="text-error"
                      />
                    )}
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addIpField}
                  iconName="Plus"
                  iconSize={16}
                >
                  Add IP Address
                </Button>
              </div>
            </div>

            {/* Submit Error */}
            {errors?.submit && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-sm text-error">{errors?.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                loading={isCreating}
                iconName="Key"
                iconSize={16}
              >
                Create API Key
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateApiKeyModal;