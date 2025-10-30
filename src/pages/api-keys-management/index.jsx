import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ApiKeyCard from './components/ApiKeyCard';
import CreateApiKeyModal from './components/CreateApiKeyModal';
import UsageAnalytics from './components/UsageAnalytics';
import SecurityAuditLog from './components/SecurityAuditLog';

const ApiKeysManagement = () => {
  const [activeTab, setActiveTab] = useState('keys');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for API keys
  const mockApiKeys = [
    {
      id: 'key_1',
      name: 'Production API Key',
      keyPreview: 'bgp_live_',
      key: 'bgp_live_sk_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
      status: 'active',
      createdAt: 'Oct 15, 2024',
      lastUsed: '2 minutes ago',
      permissions: ['payments.read', 'payments.write', 'invoices.read', 'invoices.write'],
      usage: 2847,
      rateLimit: 5000,
      ipAllowlist: ['192.168.1.100/24', '10.0.0.0/8']
    },
    {
      id: 'key_2',
      name: 'Development API Key',
      keyPreview: 'bgp_test_',
      key: 'bgp_test_sk_9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g9f8e7d6c5b4a',
      status: 'active',
      createdAt: 'Oct 10, 2024',
      lastUsed: '1 hour ago',
      permissions: ['payments.read', 'invoices.read'],
      usage: 156,
      rateLimit: 1000,
      ipAllowlist: []
    },
    {
      id: 'key_3',
      name: 'Mobile App API Key',
      keyPreview: 'bgp_live_',
      key: 'bgp_live_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
      status: 'inactive',
      createdAt: 'Sep 28, 2024',
      lastUsed: '3 days ago',
      permissions: ['payments.read', 'payouts.read'],
      usage: 0,
      rateLimit: 2000,
      ipAllowlist: ['203.0.113.0/24']
    }
  ];

  // Mock analytics data
  const mockAnalyticsData = {
    totalRequests: 125847,
    activeKeys: 2,
    totalKeys: 3,
    rateLimitHits: 12,
    successRate: 99.8,
    dailyUsage: [
      { date: 'Oct 22', requests: 4200 },
      { date: 'Oct 23', requests: 3800 },
      { date: 'Oct 24', requests: 4500 },
      { date: 'Oct 25', requests: 5200 },
      { date: 'Oct 26', requests: 4800 },
      { date: 'Oct 27', requests: 5500 },
      { date: 'Oct 28', requests: 6200 },
      { date: 'Oct 29', requests: 5800 }
    ],
    endpointUsage: [
      { endpoint: '/payments', requests: 15420 },
      { endpoint: '/invoices', requests: 8750 },
      { endpoint: '/payouts', requests: 4320 },
      { endpoint: '/webhooks', requests: 2180 },
      { endpoint: '/conversions', requests: 1890 }
    ],
    topKeys: [
      { id: 'key_1', name: 'Production API Key', requests: 28470, successRate: 99.9, lastUsed: '2 minutes ago', status: 'active' },
      { id: 'key_2', name: 'Development API Key', requests: 1560, successRate: 98.5, lastUsed: '1 hour ago', status: 'active' },
      { id: 'key_3', name: 'Mobile App API Key', requests: 0, successRate: 0, lastUsed: '3 days ago', status: 'inactive' }
    ]
  };

  // Mock audit logs
  const mockAuditLogs = [
    {
      id: 'log_1',
      type: 'success',
      action: 'API Key Authentication',
      description: 'Successful authentication for payment creation',
      keyName: 'Production API Key',
      ipAddress: '192.168.1.100',
      timestamp: '2024-10-29 16:05:32',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      requestId: 'req_1a2b3c4d5e6f',
      endpoint: 'POST /api/v1/payments',
      responseCode: 201,
      additionalData: {
        paymentAmount: 100.00,
        currency: 'USD'
      }
    },
    {
      id: 'log_2',
      type: 'warning',
      action: 'Rate Limit Approached',
      description: 'API key approaching rate limit threshold (80%)',
      keyName: 'Production API Key',
      ipAddress: '192.168.1.100',
      timestamp: '2024-10-29 15:45:18',
      userAgent: 'PostmanRuntime/7.32.3',
      requestId: 'req_2b3c4d5e6f7g',
      endpoint: 'GET /api/v1/payments',
      responseCode: 200,
      additionalData: {
        currentUsage: 4000,
        rateLimit: 5000
      }
    },
    {
      id: 'log_3',
      type: 'error',
      action: 'Invalid API Key',
      description: 'Authentication failed with invalid API key',
      keyName: 'Unknown',
      ipAddress: '203.0.113.45',
      timestamp: '2024-10-29 14:22:07',
      userAgent: 'curl/7.68.0',
      requestId: 'req_3c4d5e6f7g8h',
      endpoint: 'POST /api/v1/invoices',
      responseCode: 401,
      additionalData: {
        attemptedKey: 'bgp_live_sk_invalid***'
      }
    },
    {
      id: 'log_4',
      type: 'info',
      action: 'API Key Created',
      description: 'New API key created successfully',
      keyName: 'Development API Key',
      ipAddress: '192.168.1.50',
      timestamp: '2024-10-29 12:15:44',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      requestId: 'req_4d5e6f7g8h9i',
      endpoint: 'POST /api/v1/keys',
      responseCode: 201,
      additionalData: {
        permissions: ['payments.read', 'invoices.read'],
        ipAllowlist: []
      }
    },
    {
      id: 'log_5',
      type: 'success',
      action: 'Webhook Delivery',
      description: 'Webhook successfully delivered to merchant endpoint',
      keyName: 'Production API Key',
      ipAddress: '192.168.1.100',
      timestamp: '2024-10-29 11:30:22',
      userAgent: 'BGP-Webhook/1.0',
      requestId: 'req_5e6f7g8h9i0j',
      endpoint: 'POST /webhooks/payment.completed',
      responseCode: 200,
      additionalData: {
        webhookId: 'wh_1a2b3c4d',
        eventType: 'payment.completed'
      }
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setApiKeys(mockApiKeys);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredApiKeys = apiKeys?.filter(key =>
    key?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    key?.keyPreview?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleCreateKey = async (keyData) => {
    // Simulate API call
    const newKey = {
      id: `key_${Date.now()}`,
      ...keyData,
      keyPreview: 'bgp_live_',
      key: `bgp_live_sk_${Math.random()?.toString(36)?.substring(2, 50)}`,
      status: 'active',
      createdAt: new Date()?.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      lastUsed: 'Never',
      usage: 0
    };
    
    setApiKeys(prev => [newKey, ...prev]);
  };

  const handleRevealKey = (keyId) => {
    // In a real app, this would make an API call to reveal the key
    console.log('Revealing key:', keyId);
  };

  const handleRotateKey = (keyId) => {
    // Simulate key rotation
    setApiKeys(prev => prev?.map(key => 
      key?.id === keyId 
        ? { 
            ...key, 
            key: `bgp_live_sk_${Math.random()?.toString(36)?.substring(2, 50)}`,
            lastUsed: 'Just now'
          }
        : key
    ));
  };

  const handleDeleteKey = (keyId) => {
    if (window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys(prev => prev?.filter(key => key?.id !== keyId));
    }
  };

  const handleToggleStatus = (keyId) => {
    setApiKeys(prev => prev?.map(key => 
      key?.id === keyId 
        ? { 
            ...key, 
            status: key?.status === 'active' ? 'inactive' : 'active'
          }
        : key
    ));
  };

  const tabs = [
    { id: 'keys', label: 'API Keys', icon: 'Key' },
    { id: 'analytics', label: 'Usage Analytics', icon: 'BarChart3' },
    { id: 'audit', label: 'Security Audit', icon: 'Shield' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background lg:pl-64">
        <div className="p-6 lg:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3]?.map(i => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background lg:pl-64">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">API Keys Management</h1>
            <p className="text-muted-foreground mt-2">
              Secure access credential administration for merchant integrations
            </p>
          </div>
          <Button
            variant="default"
            onClick={() => setIsCreateModalOpen(true)}
            iconName="Plus"
            iconSize={20}
            className="gradient-primary text-white"
          >
            Create API Key
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-smooth ${
                  activeTab === tab?.id
                    ? 'border-accent text-accent' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'keys' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1 max-w-md">
                <Input
                  type="search"
                  placeholder="Search API keys..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                />
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconSize={16}
                >
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RefreshCw"
                  iconSize={16}
                >
                  Refresh
                </Button>
              </div>
            </div>

            {/* API Keys Grid */}
            {filteredApiKeys?.length === 0 ? (
              <div className="glassmorphism border border-border rounded-lg p-12 text-center">
                <Icon name="Key" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {searchTerm ? 'No matching API keys' : 'No API keys found'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search criteria' :'Create your first API key to start integrating with our platform'
                  }
                </p>
                {!searchTerm && (
                  <Button
                    variant="default"
                    onClick={() => setIsCreateModalOpen(true)}
                    iconName="Plus"
                    iconSize={16}
                    className="gradient-primary text-white"
                  >
                    Create API Key
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredApiKeys?.map((apiKey) => (
                  <ApiKeyCard
                    key={apiKey?.id}
                    apiKey={apiKey}
                    onReveal={handleRevealKey}
                    onRotate={handleRotateKey}
                    onDelete={handleDeleteKey}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <UsageAnalytics analyticsData={mockAnalyticsData} />
        )}

        {activeTab === 'audit' && (
          <SecurityAuditLog auditLogs={mockAuditLogs} />
        )}

        {/* Create API Key Modal */}
        <CreateApiKeyModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateKey={handleCreateKey}
        />
      </div>
    </div>
  );
};

export default ApiKeysManagement;