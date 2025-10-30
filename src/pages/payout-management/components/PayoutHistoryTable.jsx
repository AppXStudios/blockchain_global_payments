import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PayoutHistoryTable = ({ payouts, onViewDetails, onRetryPayout }) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'text-warning bg-warning/10 border-warning/30', icon: 'Clock' },
      processing: { color: 'text-accent bg-accent/10 border-accent/30', icon: 'Loader' },
      completed: { color: 'text-success bg-success/10 border-success/30', icon: 'CheckCircle' },
      failed: { color: 'text-error bg-error/10 border-error/30', icon: 'XCircle' },
      cancelled: { color: 'text-muted-foreground bg-muted border-border', icon: 'Ban' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config?.color}`}>
        <Icon name={config?.icon} size={12} color="currentColor" />
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedPayouts = useMemo(() => {
    let filtered = payouts;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered?.filter(payout => payout?.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered?.filter(payout => 
        payout?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        payout?.destinationAddress?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        payout?.currency?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];

      if (sortField === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortField === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [payouts, statusFilter, searchTerm, sortField, sortDirection]);

  const formatAmount = (amount, currency) => {
    return `${parseFloat(amount)?.toLocaleString()} ${currency?.toUpperCase()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateAddress = (address) => {
    return `${address?.slice(0, 8)}...${address?.slice(-8)}`;
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-muted-foreground hover:text-foreground transition-smooth"
    >
      <span>{children}</span>
      <div className="flex flex-col">
        <Icon 
          name="ChevronUp" 
          size={12} 
          color={sortField === field && sortDirection === 'asc' ? 'var(--color-accent)' : 'currentColor'} 
        />
        <Icon 
          name="ChevronDown" 
          size={12} 
          color={sortField === field && sortDirection === 'desc' ? 'var(--color-accent)' : 'currentColor'} 
        />
      </div>
    </button>
  );

  return (
    <div className="glassmorphism rounded-lg border border-border">
      {/* Header with Filters */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Payout History</h3>
            <p className="text-sm text-muted-foreground">
              Track and manage your cryptocurrency withdrawals
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            {/* Search */}
            <div className="relative">
              <Icon 
                name="Search" 
                size={16} 
                color="var(--color-muted-foreground)" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Search payouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e?.target?.value)}
              className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
            >
              {statusOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-6 py-4 text-left">
                <SortButton field="id">Payout ID</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="amount">Amount</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="currency">Currency</SortButton>
              </th>
              <th className="px-6 py-4 text-left">Destination</th>
              <th className="px-6 py-4 text-left">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="createdAt">Created</SortButton>
              </th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedPayouts?.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Icon name="ArrowUpRight" size={24} color="var(--color-muted-foreground)" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">No payouts found</p>
                      <p className="text-sm text-muted-foreground">
                        {statusFilter !== 'all' || searchTerm ?'Try adjusting your filters' :'Create your first payout to get started'
                        }
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedPayouts?.map((payout) => (
                <tr 
                  key={payout?.id} 
                  className="border-b border-border hover:bg-muted/20 transition-smooth"
                >
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-foreground">
                      {payout?.id}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">
                      {formatAmount(payout?.amount, payout?.currency)}
                    </div>
                    {payout?.fiatAmount && (
                      <div className="text-xs text-muted-foreground">
                        ≈ ${parseFloat(payout?.fiatAmount)?.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-xs font-medium text-accent">
                          {payout?.currency?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {payout?.currency?.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-foreground">
                      {truncateAddress(payout?.destinationAddress)}
                    </div>
                    {payout?.addressLabel && (
                      <div className="text-xs text-muted-foreground">
                        {payout?.addressLabel}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(payout?.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground">
                      {formatDate(payout?.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(payout)}
                        iconName="Eye"
                        iconSize={14}
                      >
                        View
                      </Button>
                      {payout?.status === 'failed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRetryPayout(payout)}
                          iconName="RotateCcw"
                          iconSize={14}
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Footer */}
      {filteredAndSortedPayouts?.length > 0 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredAndSortedPayouts?.length} of {payouts?.length} payouts
            </span>
            <div className="flex items-center space-x-2">
              <span>Rows per page:</span>
              <select className="bg-input border border-border rounded px-2 py-1 text-foreground">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutHistoryTable;