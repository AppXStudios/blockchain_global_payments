import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const WebhookEventLog = ({ events, onRetry, onViewPayload }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [dateRange, setDateRange] = useState('7d');

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
    { value: 'pending', label: 'Pending' },
    { value: 'retrying', label: 'Retrying' }
  ];

  const eventTypeOptions = [
    { value: '', label: 'All Events' },
    { value: 'payment.created', label: 'Payment Created' },
    { value: 'payment.confirmed', label: 'Payment Confirmed' },
    { value: 'payment.completed', label: 'Payment Completed' },
    { value: 'payment.failed', label: 'Payment Failed' },
    { value: 'payout.created', label: 'Payout Created' },
    { value: 'payout.completed', label: 'Payout Completed' },
    { value: 'invoice.created', label: 'Invoice Created' },
    { value: 'invoice.paid', label: 'Invoice Paid' }
  ];

  const dateRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const getStatusBadge = (status, attempts) => {
    const badges = {
      success: { color: 'text-success', bg: 'bg-success/10', icon: 'CheckCircle' },
      failed: { color: 'text-error', bg: 'bg-error/10', icon: 'XCircle' },
      pending: { color: 'text-warning', bg: 'bg-warning/10', icon: 'Clock' },
      retrying: { color: 'text-accent', bg: 'bg-accent/10', icon: 'RotateCcw' }
    };

    const badge = badges?.[status] || badges?.pending;

    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${badge?.bg} ${badge?.color}`}>
        <Icon name={badge?.icon} size={12} />
        <span className="capitalize">{status}</span>
        {attempts > 1 && <span>({attempts})</span>}
      </div>
    );
  };

  const getResponseCodeBadge = (code) => {
    const isSuccess = code >= 200 && code < 300;
    const isClientError = code >= 400 && code < 500;
    const isServerError = code >= 500;

    let colorClass = 'text-muted-foreground bg-muted';
    if (isSuccess) colorClass = 'text-success bg-success/10';
    else if (isClientError) colorClass = 'text-warning bg-warning/10';
    else if (isServerError) colorClass = 'text-error bg-error/10';

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono ${colorClass}`}>
        {code || 'N/A'}
      </span>
    );
  };

  const filteredEvents = events?.filter(event => {
    const matchesSearch = !searchTerm || 
      event?.eventType?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      event?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const matchesStatus = !statusFilter || event?.status === statusFilter;
    const matchesEventType = !eventTypeFilter || event?.eventType === eventTypeFilter;
    
    return matchesSearch && matchesStatus && matchesEventType;
  });

  return (
    <div className="glassmorphism rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Webhook Event Log</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor webhook delivery attempts and debug integration issues
            </p>
          </div>
          <Button variant="outline" iconName="Download">
            Export Log
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            iconName="Search"
          />
          <Select
            placeholder="Filter by status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <Select
            placeholder="Filter by event type"
            options={eventTypeOptions}
            value={eventTypeFilter}
            onChange={setEventTypeFilter}
          />
          <Select
            placeholder="Date range"
            options={dateRangeOptions}
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </div>
      {/* Event List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Event
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Response
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Timestamp
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Duration
              </th>
              <th className="text-right p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredEvents?.map((event) => (
              <tr key={event?.id} className="hover:bg-muted/20 transition-smooth">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {event?.verified ? (
                        <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                          <Icon name="ShieldCheck" size={16} color="var(--color-success)" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                          <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{event?.eventType}</div>
                      <div className="text-sm text-muted-foreground font-mono">{event?.id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {getStatusBadge(event?.status, event?.attempts)}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    {getResponseCodeBadge(event?.responseCode)}
                    {event?.responseTime && (
                      <span className="text-xs text-muted-foreground">
                        {event?.responseTime}ms
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground">
                    {new Date(event.timestamp)?.toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(event.timestamp)?.toLocaleTimeString()}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {event?.duration || 'N/A'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewPayload(event)}
                      iconName="Eye"
                    >
                      View
                    </Button>
                    {event?.status === 'failed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRetry(event?.id)}
                        iconName="RotateCcw"
                      >
                        Retry
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEvents?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Webhook" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No webhook events found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter || eventTypeFilter 
                ? 'Try adjusting your filters to see more results' :'Webhook events will appear here once your endpoint receives notifications'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebhookEventLog;