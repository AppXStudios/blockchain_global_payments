import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProfileSection = ({ profileData, onSave, onLogoUpload, isLoading }) => {
  const [formData, setFormData] = useState({
    companyName: profileData?.companyName || '',
    contactEmail: profileData?.contactEmail || '',
    contactPhone: profileData?.contactPhone || '',
    businessDescription: profileData?.businessDescription || '',
    website: profileData?.website || '',
    address: profileData?.address || '',
    city: profileData?.city || '',
    country: profileData?.country || '',
    postalCode: profileData?.postalCode || ''
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [logoPreview, setLogoPreview] = useState(profileData?.logo || null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(formData);
    setHasChanges(false);
  };

  const handleLogoUpload = (file) => {
    if (file && file?.type?.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e?.target?.result);
        onLogoUpload(file);
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const file = e?.dataTransfer?.files?.[0];
    handleLogoUpload(file);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="space-y-8">
      {/* Company Logo Section */}
      <div className="glassmorphism p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Company Logo</h3>
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6 space-y-4 lg:space-y-0">
          {/* Logo Preview */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted border border-border">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Company logo preview showing uploaded business branding"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="Building" size={32} color="var(--color-muted-foreground)" />
                </div>
              )}
            </div>
          </div>

          {/* Upload Area */}
          <div className="flex-1">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-smooth ${
                isDragOver
                  ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Icon name="Upload" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your logo here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                PNG, JPG up to 2MB. Recommended: 200x200px
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleLogoUpload(e?.target?.files?.[0])}
                className="hidden"
                id="logo-upload"
              />
              <label htmlFor="logo-upload">
                <Button variant="outline" size="sm" asChild>
                  <span>Choose File</span>
                </Button>
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* Company Information */}
      <div className="glassmorphism p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Company Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Company Name"
            type="text"
            value={formData?.companyName}
            onChange={(e) => handleInputChange('companyName', e?.target?.value)}
            placeholder="Enter company name"
            required
          />
          <Input
            label="Website"
            type="url"
            value={formData?.website}
            onChange={(e) => handleInputChange('website', e?.target?.value)}
            placeholder="https://example.com"
          />
          <Input
            label="Contact Email"
            type="email"
            value={formData?.contactEmail}
            onChange={(e) => handleInputChange('contactEmail', e?.target?.value)}
            placeholder="contact@company.com"
            required
          />
          <Input
            label="Contact Phone"
            type="tel"
            value={formData?.contactPhone}
            onChange={(e) => handleInputChange('contactPhone', e?.target?.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Business Description
          </label>
          <textarea
            value={formData?.businessDescription}
            onChange={(e) => handleInputChange('businessDescription', e?.target?.value)}
            placeholder="Describe your business and services..."
            rows={4}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
          />
        </div>
      </div>
      {/* Business Address */}
      <div className="glassmorphism p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Business Address</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <Input
              label="Street Address"
              type="text"
              value={formData?.address}
              onChange={(e) => handleInputChange('address', e?.target?.value)}
              placeholder="123 Business Street"
            />
          </div>
          <Input
            label="City"
            type="text"
            value={formData?.city}
            onChange={(e) => handleInputChange('city', e?.target?.value)}
            placeholder="New York"
          />
          <Input
            label="Country"
            type="text"
            value={formData?.country}
            onChange={(e) => handleInputChange('country', e?.target?.value)}
            placeholder="United States"
          />
          <Input
            label="Postal Code"
            type="text"
            value={formData?.postalCode}
            onChange={(e) => handleInputChange('postalCode', e?.target?.value)}
            placeholder="10001"
          />
        </div>
      </div>
      {/* Save Changes */}
      {hasChanges && (
        <div className="glassmorphism p-4 rounded-lg border border-warning/30 bg-warning/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
              <span className="text-sm text-foreground">You have unsaved changes</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFormData({
                    companyName: profileData?.companyName || '',
                    contactEmail: profileData?.contactEmail || '',
                    contactPhone: profileData?.contactPhone || '',
                    businessDescription: profileData?.businessDescription || '',
                    website: profileData?.website || '',
                    address: profileData?.address || '',
                    city: profileData?.city || '',
                    country: profileData?.country || '',
                    postalCode: profileData?.postalCode || ''
                  });
                  setHasChanges(false);
                }}
              >
                Discard
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                loading={isLoading}
                iconName="Save"
                iconPosition="left"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;