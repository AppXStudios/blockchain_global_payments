import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SecurityAuditPanel = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [showDetails, setShowDetails] = useState({});

  const timeframeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  const securityMetrics = {
    totalPayouts: 47,
    totalAmount: '12.847 BTC',
    failedAttempts: 3,
    suspiciousActivity: 1,
    uniqueAddresses: 23,
    averageAmount: '0.273 BTC'
  };

  const recentActivity = [
    {
      id: 1,
      type: 'payout_created',
      description: 'Payout created for 0.5 BTC',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, US',
      timestamp: new Date(Date.now() - 300000),
      status: 'success',
      riskLevel: 'low'
    },
    {
      id: 2,
      type: 'failed_2fa',
      description: 'Failed 2FA verification attempt',
      ipAddress: '203.0.113.45',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      location: 'Unknown',
      timestamp: new Date(Date.now() - 1800000),
      status: 'failed',
      riskLevel: 'medium'
    },
    {
      id: 3,
      type: 'payout_completed',
      description: 'Payout completed: 0.25 ETH',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, US',
      timestamp: new Date(Date.now() - 3600000),
      status: 'success',
      riskLevel: 'low'
    },
    {
      id: 4,
      type: 'suspicious_login',
      description: 'Login from new device detected',
      ipAddress: '198.51.100.23',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
      location: 'London, UK',
      timestamp: new Date(Date.now() - 7200000),
      status: 'warning',
      riskLevel: 'high'
    },
    {
      id: 5,
      type: 'address_added',
      description: 'New withdrawal address added to address book',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, US',
      timestamp: new Date(Date.now() - 10800000),
      status: 'success',
      riskLevel: 'low'
    }
  ];

  const suspiciousPatterns = [
    {
      id: 1,
      pattern: 'Multiple failed 2FA attempts',
      description: '3 failed attempts from IP 203.0.113.45 in the last hour',
      severity: 'medium',
      recommendation: 'Consider temporarily blocking this IP address',
      timestamp: new Date(Date.now() - 1800000)
    }
  ];

  const getActivityIcon = (type) => {
    const iconMap = {
      payout_created: 'Plus',
      payout_completed: 'CheckCircle',
      failed_2fa: 'Shield',
      suspicious_login: 'AlertTriangle',
      address_added: 'BookOpen'
    };
    return iconMap?.[type] || 'Activity';
  };

  const getActivityColor = (status, riskLevel) => {
    if (status === 'failed' || riskLevel === 'high') return 'text-error';
    if (status === 'warning' || riskLevel === 'medium') return 'text-warning';
    return 'text-success';
  };

  const getRiskBadge = (riskLevel) => {
    const config = {
      low: { color: 'text-success bg-success/10 border-success/30', label: 'Low Risk' },
      medium: { color: 'text-warning bg-warning/10 border-warning/30', label: 'Medium Risk' },
      high: { color: 'text-error bg-error/10 border-error/30', label: 'High Risk' }
    };

    const { color, label } = config?.[riskLevel] || config?.low;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${color}`}>
        {label}
      </span>
    );
  };

  const toggleDetails = (id) => {
    setShowDetails(prev => ({
      ...prev,
      [id]: !prev?.[id]
    }));
  };

  const formatTimestamp = (timestamp) => {
    return timestamp?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="glassmorphism rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Security Overview</h3>
            <p className="text-sm text-muted-foreground">
              Monitor payout security metrics and audit trails
            </p>
          </div>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e?.target?.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
          >
            {timeframeOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              {securityMetrics?.totalPayouts}
            </div>
            <div className="text-xs text-muted-foreground">Total Payouts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              {securityMetrics?.totalAmount}
            </div>
            <div className="text-xs text-muted-foreground">Total Amount</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-error">
              {securityMetrics?.failedAttempts}
            </div>
            <div className="text-xs text-muted-foreground">Failed Attempts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-warning">
              {securityMetrics?.suspiciousActivity}
            </div>
            <div className="text-xs text-muted-foreground">Suspicious Activity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              {securityMetrics?.uniqueAddresses}
            </div>
            <div className="text-xs text-muted-foreground">Unique Addresses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground">
              {securityMetrics?.averageAmount}
            </div>
            <div className="text-xs text-muted-foreground">Average Amount</div>
          </div>
        </div>
      </div>
      {/* Suspicious Activity Alerts */}
      {suspiciousPatterns?.length > 0 && (
        <div className="glassmorphism rounded-lg border border-border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
            <h3 className="text-lg font-semibold text-foreground">Security Alerts</h3>
          </div>

          <div className="space-y-4">
            {suspiciousPatterns?.map((pattern) => (
              <div key={pattern?.id} className="glassmorphism rounded-lg p-4 border border-warning/30 bg-warning/5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">{pattern?.pattern}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pattern?.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      pattern?.severity === 'high' ? 'text-error bg-error/10 border-error/30' :
                      pattern?.severity === 'medium'? 'text-warning bg-warning/10 border-warning/30' : 'text-success bg-success/10 border-success/30'
                    }`}>
                      {pattern?.severity?.charAt(0)?.toUpperCase() + pattern?.severity?.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-accent bg-accent/10 rounded p-2 mt-3">
                  <strong>Recommendation:</strong> {pattern?.recommendation}
                </div>
                
                <div className="text-xs text-muted-foreground mt-2">
                  Detected: {formatTimestamp(pattern?.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Recent Activity Log */}
      <div className="glassmorphism rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">
              Detailed audit trail of payout-related actions
            </p>
          </div>
          <Button variant="outline" size="sm" iconName="Download">
            Export Log
          </Button>
        </div>

        <div className="space-y-3">
          {recentActivity?.map((activity) => (
            <div key={activity?.id} className="glassmorphism rounded-lg border border-border">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity?.status, activity?.riskLevel)} bg-current/10`}>
                      <Icon 
                        name={getActivityIcon(activity?.type)} 
                        size={16} 
                        color="currentColor"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-foreground">
                          {activity?.description}
                        </span>
                        {getRiskBadge(activity?.riskLevel)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatTimestamp(activity?.timestamp)} • {activity?.location}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleDetails(activity?.id)}
                    iconName={showDetails?.[activity?.id] ? "ChevronUp" : "ChevronDown"}
                  />
                </div>

                {showDetails?.[activity?.id] && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">IP Address:</span>
                        <span className="ml-2 font-mono text-foreground">{activity?.ipAddress}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <span className="ml-2 text-foreground">{activity?.location}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-muted-foreground">User Agent:</span>
                        <div className="mt-1 font-mono text-xs text-foreground bg-muted/30 p-2 rounded">
                          {activity?.userAgent}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" iconName="MoreHorizontal">
            Load More Activity
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityAuditPanel;