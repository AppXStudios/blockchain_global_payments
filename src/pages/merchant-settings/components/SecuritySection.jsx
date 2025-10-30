import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const SecuritySection = ({ securityData, onPasswordChange, onToggle2FA, onLogoutSession }) => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const activeSessions = [
    {
      id: 1,
      device: "MacBook Pro - Chrome",
      location: "New York, NY",
      ipAddress: "192.168.1.100",
      lastActive: "2 minutes ago",
      isCurrent: true
    },
    {
      id: 2,
      device: "iPhone 15 Pro - Safari",
      location: "New York, NY",
      ipAddress: "192.168.1.101",
      lastActive: "1 hour ago",
      isCurrent: false
    },
    {
      id: 3,
      device: "Windows PC - Edge",
      location: "Los Angeles, CA",
      ipAddress: "203.0.113.45",
      lastActive: "2 days ago",
      isCurrent: false
    }
  ];

  const handlePasswordSubmit = async () => {
    if (passwordForm?.newPassword !== passwordForm?.confirmPassword) {
      return;
    }
    
    setIsChangingPassword(true);
    await onPasswordChange(passwordForm);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsChangingPassword(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev?.[field]
    }));
  };

  const getDeviceIcon = (device) => {
    if (device?.includes('iPhone') || device?.includes('iPad')) return 'Smartphone';
    if (device?.includes('MacBook') || device?.includes('Mac')) return 'Laptop';
    if (device?.includes('Windows')) return 'Monitor';
    return 'Globe';
  };

  return (
    <div className="space-y-8">
      {/* Password Change */}
      <div className="glassmorphism p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <div className="relative">
            <Input
              label="Current Password"
              type={showPasswords?.current ? "text" : "password"}
              value={passwordForm?.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e?.target?.value }))}
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name={showPasswords?.current ? "EyeOff" : "Eye"} size={16} />
            </button>
          </div>
          
          <div className="relative">
            <Input
              label="New Password"
              type={showPasswords?.new ? "text" : "password"}
              value={passwordForm?.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e?.target?.value }))}
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name={showPasswords?.new ? "EyeOff" : "Eye"} size={16} />
            </button>
          </div>
          
          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showPasswords?.confirm ? "text" : "password"}
              value={passwordForm?.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e?.target?.value }))}
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name={showPasswords?.confirm ? "EyeOff" : "Eye"} size={16} />
            </button>
          </div>
          
          <Button
            variant="default"
            onClick={handlePasswordSubmit}
            loading={isChangingPassword}
            disabled={!passwordForm?.currentPassword || !passwordForm?.newPassword || !passwordForm?.confirmPassword}
            iconName="Lock"
            iconPosition="left"
          >
            Update Password
          </Button>
        </div>
      </div>
      {/* Two-Factor Authentication */}
      <div className="glassmorphism p-6 rounded-lg border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add an extra layer of security to your account
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`text-sm ${securityData?.twoFactorEnabled ? 'text-success' : 'text-muted-foreground'}`}>
              {securityData?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <button
              onClick={() => onToggle2FA(!securityData?.twoFactorEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-smooth ${
                securityData?.twoFactorEnabled ? 'bg-accent' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securityData?.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        
        {securityData?.twoFactorEnabled && (
          <div className="mt-4 p-4 bg-success/10 border border-success/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} color="var(--color-success)" />
              <span className="text-sm text-success">Two-factor authentication is active</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last configured on October 15, 2024
            </p>
          </div>
        )}
      </div>
      {/* Active Sessions */}
      <div className="glassmorphism p-6 rounded-lg border border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Active Sessions</h3>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
        
        <div className="space-y-4">
          {activeSessions?.map((session) => (
            <div
              key={session?.id}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Icon name={getDeviceIcon(session?.device)} size={24} color="var(--color-muted-foreground)" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">{session?.device}</span>
                    {session?.isCurrent && (
                      <span className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {session?.location} • {session?.ipAddress}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last active: {session?.lastActive}
                  </p>
                </div>
              </div>
              
              {!session?.isCurrent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLogoutSession(session?.id)}
                  iconName="LogOut"
                  iconPosition="left"
                >
                  Sign Out
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;