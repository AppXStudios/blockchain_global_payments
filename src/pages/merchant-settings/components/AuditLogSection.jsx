import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const AuditLogSection = () => {
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('7days');

  const auditLogs = [
    {
      id: 1,
      action: "Profile Updated",
      description: "Company name changed from \'TechCorp Inc\' to \'TechCorp Solutions Inc'",
      timestamp: "2024-10-29T14:30:00Z",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 118.0.0.0",
      type: "profile",
      severity: "info"
    },
    {
      id: 2,
      action: "Password Changed",
      description: "Account password was successfully updated",
      timestamp: "2024-10-28T09:15:00Z",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 118.0.0.0",
      type: "security",
      severity: "warning"
    },
    {
      id: 3,
      action: "2FA Enabled",
      description: "Two-factor authentication was enabled for the account",
      timestamp: "2024-10-27T16:45:00Z",
      ipAddress: "192.168.1.101",
      userAgent: "Safari 17.0",
      type: "security",
      severity: "success"
    },
    {
      id: 4,
      action: "API Key Created",
      description: "New API key \'Production Key\' was generated",
      timestamp: "2024-10-26T11:20:00Z",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 118.0.0.0",
      type: "api",
      severity: "info"
    },
    {
      id: 5,
      action: "Webhook Updated",
      description: "Webhook endpoint updated to https://api.example.com/webhooks",
      timestamp: "2024-10-25T13:10:00Z",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 118.0.0.0",
      type: "webhook",
      severity: "info"
    },
    {
      id: 6,
      action: "Failed Login Attempt",
      description: "Multiple failed login attempts detected from unknown IP",
      timestamp: "2024-10-24T22:30:00Z",
      ipAddress: "203.0.113.45",
      userAgent: "Unknown",
      type: "security",
      severity: "error"
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'profile', label: 'Profile Changes' },
    { value: 'security', label: 'Security Events' },
    { value: 'api', label: 'API Activities' },
    { value: 'webhook', label: 'Webhook Events' }
  ];

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' },
    { value: 'custom', label: 'Custom range' }
  ];

  const filteredLogs = auditLogs?.filter(log => 
    filterType === 'all' || log?.type === filterType
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getSeverityIcon = (severity) => {
    const iconMap = {
      success: 'CheckCircle',
      warning: 'AlertTriangle',
      error: 'XCircle',
      info: 'Info'
    };
    return iconMap?.[severity] || 'Info';
  };

  const getSeverityColor = (severity) => {
    const colorMap = {
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
      info: 'var(--color-accent)'
    };
    return colorMap?.[severity] || 'var(--color-accent)';
  };

  const getTypeIcon = (type) => {
    const iconMap = {
      profile: 'User',
      security: 'Shield',
      api: 'Key',
      webhook: 'Webhook'
    };
    return iconMap?.[type] || 'Activity';
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glassmorphism p-6 rounded-lg border border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h3 className="text-lg font-semibold text-foreground">Activity Log</h3>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Select
              options={filterOptions}
              value={filterType}
              onChange={setFilterType}
              placeholder="Filter by type"
              className="w-full sm:w-48"
            />
            <Select
              options={dateRangeOptions}
              value={dateRange}
              onChange={setDateRange}
              placeholder="Select date range"
              className="w-full sm:w-48"
            />
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
          </div>
        </div>
      </div>
      {/* Audit Log Entries */}
      <div className="glassmorphism rounded-lg border border-border overflow-hidden">
        <div className="divide-y divide-border">
          {filteredLogs?.map((log) => (
            <div key={log?.id} className="p-6 hover:bg-muted/30 transition-smooth">
              <div className="flex items-start space-x-4">
                {/* Type Icon */}
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Icon name={getTypeIcon(log?.type)} size={16} color="var(--color-muted-foreground)" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-foreground">{log?.action}</h4>
                    <Icon 
                      name={getSeverityIcon(log?.severity)} 
                      size={16} 
                      color={getSeverityColor(log?.severity)} 
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {log?.description}
                  </p>
                  
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{formatTimestamp(log?.timestamp)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Globe" size={12} />
                      <span>{log?.ipAddress}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Monitor" size={12} />
                      <span>{log?.userAgent}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MoreHorizontal"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="p-6 border-t border-border bg-muted/20">
          <div className="text-center">
            <Button
              variant="outline"
              iconName="ChevronDown"
              iconPosition="right"
            >
              Load More Activities
            </Button>
          </div>
        </div>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glassmorphism p-6 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-foreground mb-2">24</div>
          <div className="text-sm text-muted-foreground">Activities This Week</div>
        </div>
        <div className="glassmorphism p-6 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-foreground mb-2">3</div>
          <div className="text-sm text-muted-foreground">Security Events</div>
        </div>
        <div className="glassmorphism p-6 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-foreground mb-2">12</div>
          <div className="text-sm text-muted-foreground">API Activities</div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogSection;