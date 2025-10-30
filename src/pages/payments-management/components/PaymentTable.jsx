import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import PaymentStatusBadge from './PaymentStatusBadge';

const PaymentTable = ({ payments, onRowClick, onBulkAction, selectedRows, onRowSelect }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [selectAll, setSelectAll] = useState(false);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (newSelectAll) {
      onRowSelect(payments?.map(p => p?.id));
    } else {
      onRowSelect([]);
    }
  };

  const handleRowSelect = (paymentId) => {
    const newSelected = selectedRows?.includes(paymentId)
      ? selectedRows?.filter(id => id !== paymentId)
      : [...selectedRows, paymentId];
    onRowSelect(newSelected);
    setSelectAll(newSelected?.length === payments?.length);
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatAmount = (amount, currency) => {
    return `${parseFloat(amount)?.toLocaleString()} ${currency}`;
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

  return (
    <div className="glassmorphism border border-border rounded-lg overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedRows?.length > 0 && (
        <div className="bg-accent/10 border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {selectedRows?.length} transaction{selectedRows?.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('export')}
                iconName="Download"
                iconPosition="left"
              >
                Export Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('refund')}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Bulk Refund
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/20 border-b border-border sticky top-0">
            <tr>
              <th className="w-12 px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-border bg-input text-accent focus:ring-accent focus:ring-offset-background"
                />
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-accent transition-smooth"
                >
                  <span>Transaction ID</span>
                  <Icon name={getSortIcon('id')} size={14} color="currentColor" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-accent transition-smooth"
                >
                  <span>Amount</span>
                  <Icon name={getSortIcon('amount')} size={14} color="currentColor" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('currency')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-accent transition-smooth"
                >
                  <span>Currency</span>
                  <Icon name={getSortIcon('currency')} size={14} color="currentColor" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-accent transition-smooth"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={14} color="currentColor" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('customerEmail')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-accent transition-smooth"
                >
                  <span>Customer</span>
                  <Icon name={getSortIcon('customerEmail')} size={14} color="currentColor" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-accent transition-smooth"
                >
                  <span>Date</span>
                  <Icon name={getSortIcon('createdAt')} size={14} color="currentColor" />
                </button>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments?.map((payment, index) => (
              <tr
                key={payment?.id}
                className={`hover:bg-muted/10 transition-smooth cursor-pointer ${
                  index % 2 === 0 ? 'bg-background' : 'bg-muted/5'
                }`}
                onClick={() => onRowClick(payment)}
              >
                <td className="px-6 py-4" onClick={(e) => e?.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRows?.includes(payment?.id)}
                    onChange={() => handleRowSelect(payment?.id)}
                    className="rounded border-border bg-input text-accent focus:ring-accent focus:ring-offset-background"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm text-foreground">{payment?.id}</span>
                    <button
                      onClick={(e) => {
                        e?.stopPropagation();
                        navigator.clipboard?.writeText(payment?.id);
                      }}
                      className="p-1 rounded hover:bg-muted/20 transition-smooth"
                    >
                      <Icon name="Copy" size={12} color="currentColor" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-foreground">
                      ${parseFloat(payment?.usdAmount)?.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground">
                      {formatAmount(payment?.cryptoAmount, payment?.currency)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-accent">
                        {payment?.currency?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{payment?.currency}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <PaymentStatusBadge status={payment?.status} size="sm" />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-foreground">{payment?.customerName}</div>
                    <div className="text-muted-foreground">{payment?.customerEmail}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(payment?.createdAt)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right" onClick={(e) => e?.stopPropagation()}>
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onRowClick(payment)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MoreHorizontal"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Empty State */}
      {payments?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="CreditCard" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or check back later for new transactions.
          </p>
          <Button variant="outline" iconName="RefreshCw" iconPosition="left">
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;