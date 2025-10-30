import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DocumentationSidebar = ({ activeSection, onSectionChange, isMobileOpen, onMobileClose }) => {
  const [expandedSections, setExpandedSections] = useState(['getting-started', 'api-reference']);

  const documentationSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'Rocket',
      items: [
        { id: 'quickstart', title: 'Quickstart Guide', path: '#quickstart' },
        { id: 'authentication', title: 'Authentication', path: '#authentication' },
        { id: 'sandbox', title: 'Sandbox Testing', path: '#sandbox' },
        { id: 'go-live', title: 'Going Live', path: '#go-live' }
      ]
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: 'Code',
      items: [
        { id: 'payments-api', title: 'Payments API', path: '#payments-api' },
        { id: 'invoices-api', title: 'Invoices API', path: '#invoices-api' },
        { id: 'payouts-api', title: 'Payouts API', path: '#payouts-api' },
        { id: 'conversions-api', title: 'Conversions API', path: '#conversions-api' },
        { id: 'webhooks-api', title: 'Webhooks API', path: '#webhooks-api' }
      ]
    },
    {
      id: 'webhooks',
      title: 'Webhooks',
      icon: 'Webhook',
      items: [
        { id: 'webhook-setup', title: 'Webhook Setup', path: '#webhook-setup' },
        { id: 'webhook-events', title: 'Event Types', path: '#webhook-events' },
        { id: 'webhook-verification', title: 'Signature Verification', path: '#webhook-verification' },
        { id: 'webhook-retry', title: 'Retry Logic', path: '#webhook-retry' }
      ]
    },
    {
      id: 'integration-guides',
      title: 'Integration Guides',
      icon: 'BookOpen',
      items: [
        { id: 'react-integration', title: 'React Integration', path: '#react-integration' },
        { id: 'nodejs-integration', title: 'Node.js Integration', path: '#nodejs-integration' },
        { id: 'python-integration', title: 'Python Integration', path: '#python-integration' },
        { id: 'php-integration', title: 'PHP Integration', path: '#php-integration' }
      ]
    },
    {
      id: 'security',
      title: 'Security',
      icon: 'Shield',
      items: [
        { id: 'api-keys', title: 'API Key Management', path: '#api-keys' },
        { id: 'ip-allowlist', title: 'IP Allowlisting', path: '#ip-allowlist' },
        { id: 'rate-limiting', title: 'Rate Limiting', path: '#rate-limiting' },
        { id: 'best-practices', title: 'Security Best Practices', path: '#best-practices' }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: 'AlertCircle',
      items: [
        { id: 'common-errors', title: 'Common Errors', path: '#common-errors' },
        { id: 'debugging', title: 'Debugging Guide', path: '#debugging' },
        { id: 'support', title: 'Getting Support', path: '#support' },
        { id: 'faq', title: 'FAQ', path: '#faq' }
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev?.includes(sectionId) 
        ? prev?.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleItemClick = (itemId) => {
    onSectionChange(itemId);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Documentation</h2>
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
            >
              <Icon name="X" size={20} color="currentColor" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-2">
          {documentationSections?.map((section) => (
            <div key={section?.id} className="space-y-1">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section?.id)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-smooth text-left"
              >
                <div className="flex items-center space-x-2">
                  <Icon name={section?.icon} size={16} color="currentColor" />
                  <span className="font-medium text-foreground">{section?.title}</span>
                </div>
                <Icon 
                  name={expandedSections?.includes(section?.id) ? "ChevronDown" : "ChevronRight"} 
                  size={16} 
                  color="currentColor" 
                />
              </button>

              {/* Section Items */}
              {expandedSections?.includes(section?.id) && (
                <div className="ml-6 space-y-1">
                  {section?.items?.map((item) => (
                    <button
                      key={item?.id}
                      onClick={() => handleItemClick(item?.id)}
                      className={`w-full text-left p-2 rounded-md text-sm transition-smooth ${
                        activeSection === item?.id
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {item?.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );

  // Desktop Sidebar
  if (!isMobileOpen) {
    return (
      <aside className="hidden lg:block w-80 glassmorphism border-r border-border">
        {sidebarContent}
      </aside>
    );
  }

  // Mobile Sidebar
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={onMobileClose}
      />
      
      {/* Mobile Drawer */}
      <aside className="fixed left-0 top-0 z-60 h-full w-80 glassmorphism border-r border-border lg:hidden animate-slide-in">
        {sidebarContent}
      </aside>
    </>
  );
};

export default DocumentationSidebar;