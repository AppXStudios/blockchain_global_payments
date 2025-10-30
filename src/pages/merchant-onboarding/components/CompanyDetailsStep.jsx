import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const CompanyDetailsStep = ({ data, onUpdate, onNext, onPrevious }) => {
  const [formData, setFormData] = useState({
    businessName: data?.businessName || '',
    registrationNumber: data?.registrationNumber || '',
    businessType: data?.businessType || '',
    country: data?.country || '',
    address: data?.address || '',
    city: data?.city || '',
    postalCode: data?.postalCode || '',
    contactEmail: data?.contactEmail || '',
    contactPhone: data?.contactPhone || '',
    ...data
  });

  const [errors, setErrors] = useState({});

  const businessTypes = [
    { value: 'corporation', label: 'Corporation' },
    { value: 'llc', label: 'Limited Liability Company (LLC)' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
    { value: 'nonprofit', label: 'Non-Profit Organization' },
    { value: 'other', label: 'Other' }
  ];

  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'gb', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'au', label: 'Australia' },
    { value: 'sg', label: 'Singapore' },
    { value: 'jp', label: 'Japan' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.businessName?.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData?.businessType) {
      newErrors.businessType = 'Business type is required';
    }

    if (!formData?.country) {
      newErrors.country = 'Country is required';
    }

    if (!formData?.contactEmail?.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (!formData?.address?.trim()) {
      newErrors.address = 'Business address is required';
    }

    if (!formData?.city?.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onUpdate(formData);
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
          Company Details
        </h2>
        <p className="text-muted-foreground">
          Tell us about your business to get started with crypto payments.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Business Name"
            type="text"
            placeholder="Enter your business name"
            value={formData?.businessName}
            onChange={(e) => handleInputChange('businessName', e?.target?.value)}
            error={errors?.businessName}
            required
          />
        </div>

        <Input
          label="Registration Number"
          type="text"
          placeholder="Business registration number"
          description="Optional - helps with verification"
          value={formData?.registrationNumber}
          onChange={(e) => handleInputChange('registrationNumber', e?.target?.value)}
          error={errors?.registrationNumber}
        />

        <Select
          label="Business Type"
          placeholder="Select business type"
          options={businessTypes}
          value={formData?.businessType}
          onChange={(value) => handleInputChange('businessType', value)}
          error={errors?.businessType}
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Business Address"
            type="text"
            placeholder="Enter your business address"
            value={formData?.address}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            error={errors?.address}
            required
          />
        </div>

        <Input
          label="City"
          type="text"
          placeholder="Enter city"
          value={formData?.city}
          onChange={(e) => handleInputChange('city', e?.target?.value)}
          error={errors?.city}
          required
        />

        <Input
          label="Postal Code"
          type="text"
          placeholder="Enter postal code"
          value={formData?.postalCode}
          onChange={(e) => handleInputChange('postalCode', e?.target?.value)}
          error={errors?.postalCode}
        />

        <Select
          label="Country"
          placeholder="Select country"
          options={countries}
          value={formData?.country}
          onChange={(value) => handleInputChange('country', value)}
          error={errors?.country}
          required
          searchable
        />

        <Input
          label="Contact Email"
          type="email"
          placeholder="business@example.com"
          value={formData?.contactEmail}
          onChange={(e) => handleInputChange('contactEmail', e?.target?.value)}
          error={errors?.contactEmail}
          required
        />

        <Input
          label="Contact Phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          description="Optional - for account verification"
          value={formData?.contactPhone}
          onChange={(e) => handleInputChange('contactPhone', e?.target?.value)}
          error={errors?.contactPhone}
        />
      </div>
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled
          className="opacity-50 cursor-not-allowed"
        >
          Previous
        </Button>
        <Button
          variant="default"
          onClick={handleNext}
          className="gradient-primary text-white"
        >
          Continue to Website Verification
        </Button>
      </div>
    </div>
  );
};

export default CompanyDetailsStep;