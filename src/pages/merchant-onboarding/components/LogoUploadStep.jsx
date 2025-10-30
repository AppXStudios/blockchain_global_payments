import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const LogoUploadStep = ({ data, onUpdate, onNext, onPrevious }) => {
  const [formData, setFormData] = useState({
    logo: data?.logo || null,
    logoPreview: data?.logoPreview || null,
    ...data
  });

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!allowedTypes?.includes(file?.type)) {
      return 'Please upload a valid image file (JPEG, PNG, or SVG)';
    }
    
    if (file?.size > maxFileSize) {
      return 'File size must be less than 5MB';
    }
    
    return null;
  };

  const handleFileSelect = (file) => {
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setUploadError('');
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({
        ...prev,
        logoPreview: e?.target?.result
      }));
    };
    reader?.readAsDataURL(file);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    // Simulate upload to Vercel Blob
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Mock successful upload
      const mockUrl = `https://blob.vercel-storage.com/logos/${Date.now()}-${file?.name}`;
      
      setFormData(prev => ({
        ...prev,
        logo: {
          url: mockUrl,
          filename: file?.name,
          size: file?.size,
          type: file?.type
        }
      }));
      
      setIsUploading(false);
    }, 2000);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    if (files?.length > 0) {
      handleFileSelect(files?.[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e?.target?.files);
    if (files?.length > 0) {
      handleFileSelect(files?.[0]);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({
      ...prev,
      logo: null,
      logoPreview: null
    }));
    setUploadProgress(0);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNext = () => {
    onUpdate(formData);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
          Upload Your Logo
        </h2>
        <p className="text-muted-foreground">
          Add your company logo to customize the checkout experience for your customers.
        </p>
      </div>
      <div className="space-y-6">
        {/* Upload Area */}
        {!formData?.logo && (
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
              ${isDragging 
                ? 'border-accent bg-accent/10' :'border-border hover:border-accent/50 hover:bg-muted/30'
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={allowedTypes?.join(',')}
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-accent/10 border border-accent/20">
                  <Icon name="Upload" size={32} color="var(--color-accent)" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {isDragging ? 'Drop your logo here' : 'Upload your company logo'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop your logo here, or click to browse files
                </p>
                
                <Button
                  variant="outline"
                  iconName="FolderOpen"
                  iconPosition="left"
                  disabled={isUploading}
                >
                  Choose File
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Supported formats: JPEG, PNG, SVG</div>
                <div>Maximum file size: 5MB</div>
                <div>Recommended size: 200x200px or larger</div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="glassmorphism rounded-lg p-6 border border-border">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="animate-spin">
                  <Icon name="Loader2" size={24} color="var(--color-accent)" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Uploading logo...</span>
                  <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Error */}
        {uploadError && (
          <div className="glassmorphism rounded-lg p-4 border border-error/30 bg-error/10">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={20} color="var(--color-error)" />
              <span className="text-sm text-error">{uploadError}</span>
            </div>
          </div>
        )}

        {/* Logo Preview */}
        {formData?.logo && (
          <div className="glassmorphism rounded-lg p-6 border border-border">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-lg border border-border overflow-hidden bg-card">
                  <Image
                    src={formData?.logoPreview || formData?.logo?.url}
                    alt="Company logo preview showing uploaded business branding"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Logo Uploaded Successfully
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>
                    <strong>Filename:</strong> {formData?.logo?.filename}
                  </div>
                  <div>
                    <strong>Size:</strong> {(formData?.logo?.size / 1024 / 1024)?.toFixed(2)} MB
                  </div>
                  <div>
                    <strong>Type:</strong> {formData?.logo?.type}
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef?.current?.click()}
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    Replace
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeLogo}
                    iconName="Trash2"
                    iconPosition="left"
                    className="text-error hover:text-error"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview in Checkout */}
        {formData?.logo && (
          <div className="glassmorphism rounded-lg p-6 border border-border">
            <h3 className="text-lg font-medium text-foreground mb-4">
              Checkout Preview
            </h3>
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={formData?.logoPreview || formData?.logo?.url}
                      alt="Company logo as it appears in customer checkout flow"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Your Company</h4>
                  <p className="text-sm text-muted-foreground">Secure Crypto Payment</p>
                </div>
                <div className="text-2xl font-bold text-foreground">$99.99</div>
                <Button variant="default" className="gradient-primary text-white" fullWidth>
                  Pay with Crypto
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Skip Option */}
        <div className="glassmorphism rounded-lg p-6 border border-border">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} color="var(--color-accent)" className="mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-1">
                Logo is Optional
              </h4>
              <p className="text-sm text-muted-foreground">
                You can skip this step and add your logo later from the merchant settings.
                A default placeholder will be used in the checkout until you upload a logo.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          iconName="ChevronLeft"
          iconPosition="left"
        >
          Previous
        </Button>
        <Button
          variant="default"
          onClick={handleNext}
          className="gradient-primary text-white"
          iconName="Check"
          iconPosition="right"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
};

export default LogoUploadStep;