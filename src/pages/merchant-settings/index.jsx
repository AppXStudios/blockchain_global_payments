import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProfileSection from './components/ProfileSection';
import SecuritySection from './components/SecuritySection';
import BusinessSection from './components/BusinessSection';
import AuditLogSection from './components/AuditLogSection';
import DangerZoneSection from './components/DangerZoneSection';

const MerchantSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const profileData = {
    companyName: "TechCorp Solutions Inc",
    contactEmail: "contact@techcorp.com",
    contactPhone: "+1 (555) 123-4567",
    businessDescription: `TechCorp Solutions is a leading provider of innovative software solutions for enterprise clients. We specialize in cloud-based applications, data analytics, and digital transformation services.\n\nOur mission is to help businesses leverage technology to achieve their goals and drive growth in the digital age.`,
    website: "https://techcorp.com",
    address: "123 Innovation Drive",
    city: "San Francisco",
    country: "United States",
    postalCode: "94105",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center"
  };

  const securityData = {
    twoFactorEnabled: true,
    lastPasswordChange: "2024-10-15T10:30:00Z"
  };

  const businessData = {
    defaultCurrency: "USD",
    payoutWallet: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    minimumPayout: "100",
    autoPayoutEnabled: true,
    payoutFrequency: "weekly",
    notifications: {
      paymentReceived: true,
      paymentFailed: true,
      payoutProcessed: true,
      securityAlerts: true,
      weeklyReports: false,
      marketingEmails: false,
      webhookFailures: true
    }
  };

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'User',
      description: 'Company information and logo'
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Shield',
      description: 'Password and authentication'
    },
    {
      id: 'business',
      label: 'Business',
      icon: 'Building',
      description: 'Payout and notifications'
    },
    {
      id: 'audit',
      label: 'Audit Log',
      icon: 'Activity',
      description: 'Account activity history'
    },
    {
      id: 'danger',
      label: 'Danger Zone',
      icon: 'AlertTriangle',
      description: 'Account deletion and data export'
    }
  ];

  const handleProfileSave = async (data) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Profile saved:', data);
    setIsLoading(false);
  };

  const handleLogoUpload = async (file) => {
    setIsLoading(true);
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Logo uploaded:', file);
    setIsLoading(false);
  };

  const handlePasswordChange = async (passwordData) => {
    // Simulate password change
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Password changed:', passwordData);
  };

  const handleToggle2FA = async (enabled) => {
    // Simulate 2FA toggle
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('2FA toggled:', enabled);
  };

  const handleLogoutSession = async (sessionId) => {
    // Simulate session logout
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Session logged out:', sessionId);
  };

  const handleBusinessSave = async (data) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Business settings saved:', data);
    setIsLoading(false);
  };

  const handleExportData = async () => {
    // Simulate data export
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('Data exported');
  };

  const handleDeleteAccount = async () => {
    // Simulate account deletion
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Account deleted');
    navigate('/authentication');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSection
            profileData={profileData}
            onSave={handleProfileSave}
            onLogoUpload={handleLogoUpload}
            isLoading={isLoading}
          />
        );
      case 'security':
        return (
          <SecuritySection
            securityData={securityData}
            onPasswordChange={handlePasswordChange}
            onToggle2FA={handleToggle2FA}
            onLogoutSession={handleLogoutSession}
          />
        );
      case 'business':
        return (
          <BusinessSection
            businessData={businessData}
            onSave={handleBusinessSave}
          />
        );
      case 'audit':
        return <AuditLogSection />;
      case 'danger':
        return (
          <DangerZoneSection
            onExportData={handleExportData}
            onDeleteAccount={handleDeleteAccount}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 glassmorphism border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard-overview')}
              iconName="ArrowLeft"
            />
            <h1 className="text-lg font-semibold text-foreground">Settings</h1>
          </div>
        </div>
      </div>
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 glassmorphism border-r border-border">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard-overview')}
                iconName="ArrowLeft"
              />
              <h1 className="text-xl font-semibold text-foreground">Account Settings</h1>
            </div>

            <nav className="space-y-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-smooth ${
                    activeTab === tab?.id
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon 
                    name={tab?.icon} 
                    size={20} 
                    color="currentColor"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{tab?.label}</div>
                    <div className="text-xs opacity-70 truncate">{tab?.description}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glassmorphism border-t border-border">
          <div className="flex overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex-shrink-0 flex flex-col items-center space-y-1 p-3 min-w-0 transition-smooth ${
                  activeTab === tab?.id
                    ? 'text-accent' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={20} color="currentColor" />
                <span className="text-xs font-medium truncate">{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="max-w-4xl mx-auto p-6 pb-20 lg:pb-6">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {tabs?.find(tab => tab?.id === activeTab)?.label}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {tabs?.find(tab => tab?.id === activeTab)?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Section Header */}
            <div className="lg:hidden mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {tabs?.find(tab => tab?.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {tabs?.find(tab => tab?.id === activeTab)?.description}
              </p>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantSettings;