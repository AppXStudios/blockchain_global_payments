import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  
  // Check if user is authenticated
  const isAuthenticated = location?.pathname?.includes('/dashboard') || 
                          location?.pathname?.includes('/payments') || 
                          location?.pathname?.includes('/invoice') || 
                          location?.pathname?.includes('/payout') || 
                          location?.pathname?.includes('/api-keys') || 
                          location?.pathname?.includes('/webhook') || 
                          location?.pathname?.includes('/merchant') ||
                          location?.pathname?.includes('/conversions') ||
                          location?.pathname?.includes('/subscription');

  const merchantNavItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard-overview', 
      icon: 'LayoutDashboard',
      description: 'Overview & Analytics'
    },
    { 
      label: 'Payments', 
      path: '/payments-management', 
      icon: 'CreditCard',
      description: 'Transaction Management'
    },
    { 
      label: 'Invoices', 
      path: '/invoice-creation', 
      icon: 'FileText',
      description: 'Payment Links & Billing'
    },
    { 
      label: 'Payouts', 
      path: '/payout-management', 
      icon: 'ArrowUpRight',
      description: 'Withdrawal Management'
    },
    { 
      label: 'Conversions', 
      path: '/conversions-management', 
      icon: 'ArrowRightLeft',
      description: 'Currency Exchange'
    },
    { 
      label: 'Subscriptions', 
      path: '/subscription-management', 
      icon: 'Calendar',
      description: 'Recurring Payments'
    },
    { 
      label: 'API Keys', 
      path: '/api-keys-management', 
      icon: 'Key',
      description: 'Integration Credentials'
    },
    { 
      label: 'Webhooks', 
      path: '/webhook-management', 
      icon: 'Webhook',
      description: 'Event Notifications'
    },
    { 
      label: 'Settings', 
      path: '/merchant-settings', 
      icon: 'Settings',
      description: 'Account Configuration'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleAccountAction = (action) => {
    setAccountDropdownOpen(false);
    if (action === 'settings') {
      navigate('/merchant-settings');
    } else if (action === 'logout') {
      // Handle logout logic here
      navigate('/authentication');
    }
  };

  const toggleAccountDropdown = () => {
    setAccountDropdownOpen(!accountDropdownOpen);
  };

  if (!isAuthenticated) {
    return null; // Don't render sidebar for public pages
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block ${
        isCollapsed ? 'lg:w-16' : 'lg:w-64'
      } glassmorphism border-r border-border transition-all duration-200`}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                  <Icon name="Zap" size={20} color="white" />
                </div>
                <span className="font-heading text-lg font-semibold text-foreground">
                  BGP
                </span>
              </div>
            )}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
              >
                <Icon 
                  name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                  size={20} 
                  color="currentColor" 
                />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {merchantNavItems?.map((item) => {
              const isActive = location?.pathname === item?.path;
              return (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-smooth hover:bg-muted group ${
                    isActive
                      ? 'bg-accent text-accent-foreground shadow-glow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={isCollapsed ? item?.label : ''}
                >
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    color="currentColor"
                    className={isActive ? 'text-accent-foreground' : ''}
                  />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item?.label}</div>
                      <div className="text-xs opacity-70 truncate">{item?.description}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Account Section */}
          <div className="p-4 border-t border-border">
            <div className="relative">
              <button
                onClick={toggleAccountDropdown}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-smooth"
              >
                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium text-foreground truncate">Merchant Account</div>
                      <div className="text-xs text-muted-foreground truncate">merchant@example.com</div>
                    </div>
                    <Icon name="ChevronUp" size={16} color="currentColor" />
                  </>
                )}
              </button>

              {/* Account Dropdown */}
              {accountDropdownOpen && !isCollapsed && (
                <div className="absolute bottom-full left-0 right-0 mb-2 glassmorphism border border-border rounded-lg shadow-elevation-lg">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => handleAccountAction('settings')}
                      className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-smooth text-left"
                    >
                      <Icon name="Settings" size={16} color="currentColor" />
                      <span className="text-sm">Account Settings</span>
                    </button>
                    <button
                      onClick={() => handleAccountAction('logout')}
                      className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-smooth text-left text-error"
                    >
                      <Icon name="LogOut" size={16} color="currentColor" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glassmorphism border-t border-border">
        <div className="flex items-center justify-around py-2">
          {merchantNavItems?.slice(0, 4)?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-smooth ${
                  isActive
                    ? 'text-accent' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon 
                  name={item?.icon} 
                  size={20} 
                  color="currentColor" 
                />
                <span className="text-xs font-medium">{item?.label}</span>
              </button>
            );
          })}
          
          {/* More Menu */}
          <button
            onClick={toggleAccountDropdown}
            className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-smooth text-muted-foreground hover:text-foreground"
          >
            <Icon name="MoreHorizontal" size={20} color="currentColor" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>

        {/* Mobile More Menu Dropdown */}
        {accountDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm"
              onClick={() => setAccountDropdownOpen(false)}
            />
            <div className="absolute bottom-full left-4 right-4 mb-2 z-70 glassmorphism border border-border rounded-lg shadow-elevation-lg">
              <div className="p-4 space-y-2">
                {merchantNavItems?.slice(4)?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-smooth text-left"
                  >
                    <Icon name={item?.icon} size={20} color="currentColor" />
                    <div>
                      <div className="font-medium text-foreground">{item?.label}</div>
                      <div className="text-xs text-muted-foreground">{item?.description}</div>
                    </div>
                  </button>
                ))}
                <div className="border-t border-border pt-2 mt-2">
                  <button
                    onClick={() => handleAccountAction('logout')}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-smooth text-left text-error"
                  >
                    <Icon name="LogOut" size={20} color="currentColor" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;