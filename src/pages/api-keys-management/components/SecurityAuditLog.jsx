import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SecurityAuditLog = ({ auditLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [expandedLog, setExpandedLog] = useState(null);

  const filteredLogs = auditLogs?.filter(log => {
    const matchesSearch = log?.action?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         log?.ipAddress?.includes(searchTerm) ||
                         log?.keyName?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const matchesFilter = filterType === 'all' || log?.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'warning':
        return { name: 'AlertTriangle', color: 'text-warning' };
      case 'error':
        return { name: 'XCircle', color: 'text-error' };
      case 'info':
        return { name: 'Info', color: 'text-accent' };
      default:
        return { name: 'Activity', color: 'text-muted-foreground' };
    }
  };

  const getLogTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'error':
        return 'bg-error/10 text-error border-error/20';
      case 'info':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const toggleLogExpansion = (logId) => {
    setExpandedLog(expandedLog === logId ? null : logId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Security Audit Log</h2>
          <p className="text-sm text-muted-foreground">
            Monitor API key access attempts and security events
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconSize={16}
          >
            Export Logs
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
      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by action, IP address, or key name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
          />
        </div>
        <div className="flex space-x-2">
          {['all', 'success', 'warning', 'error', 'info']?.map((type) => (
            <Button
              key={type}
              variant={filterType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType(type)}
              className="capitalize"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>
      {/* Audit Log List */}
      <div className="space-y-3">
        {filteredLogs?.length === 0 ? (
          <div className="glassmorphism border border-border rounded-lg p-8 text-center">
            <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No logs found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterType !== 'all' ?'Try adjusting your search or filter criteria' :'No audit logs available at this time'
              }
            </p>
          </div>
        ) : (
          filteredLogs?.map((log) => {
            const logIcon = getLogIcon(log?.type);
            const isExpanded = expandedLog === log?.id;
            
            return (
              <div
                key={log?.id}
                className="glassmorphism border border-border rounded-lg p-4 hover:bg-muted/20 transition-smooth"
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <Icon 
                      name={logIcon?.name} 
                      size={20} 
                      className={logIcon?.color}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-foreground">
                            {log?.action}
                          </h4>
                          <span className={`px-2 py-1 text-xs rounded-full border ${getLogTypeColor(log?.type)}`}>
                            {log?.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Icon name="Key" size={12} />
                            <span>{log?.keyName}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Icon name="Globe" size={12} />
                            <span>{log?.ipAddress}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Icon name="Clock" size={12} />
                            <span>{log?.timestamp}</span>
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {log?.description}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLogExpansion(log?.id)}
                        iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                        iconSize={16}
                      />
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">User Agent</label>
                            <p className="text-sm text-foreground font-mono break-all">
                              {log?.userAgent}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Request ID</label>
                            <p className="text-sm text-foreground font-mono">
                              {log?.requestId}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Endpoint</label>
                            <p className="text-sm text-foreground font-mono">
                              {log?.endpoint}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Response Code</label>
                            <p className={`text-sm font-mono ${
                              log?.responseCode >= 200 && log?.responseCode < 300 
                                ? 'text-success' 
                                : log?.responseCode >= 400 
                                  ? 'text-error' :'text-warning'
                            }`}>
                              {log?.responseCode}
                            </p>
                          </div>
                        </div>
                        
                        {log?.additionalData && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Additional Data</label>
                            <pre className="mt-1 p-3 bg-input border border-border rounded-md text-xs text-foreground overflow-x-auto">
                              {JSON.stringify(log?.additionalData, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Load More */}
      {filteredLogs?.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            iconName="ChevronDown"
            iconSize={16}
          >
            Load More Logs
          </Button>
        </div>
      )}
    </div>
  );
};

export default SecurityAuditLog;