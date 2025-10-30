import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentPaymentsTable = ({ payments }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleViewAll = () => {
    navigate('/payments-management');
  };

  const handleViewPayment = (paymentId) => {
    navigate(`/payments-management?payment=${paymentId}`);
  };

  const handleCreatePayment = () => {
    navigate('/invoice-creation');
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    })?.format(amount || 0);
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const sortedPayments = payments?.slice()?.sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'date':
        return direction * (new Date(a?.created_at) - new Date(b?.created_at));
      case 'amount':
        return direction * (a?.amount_fiat - b?.amount_fiat);
      case 'status':
        return direction * a?.status?.localeCompare(b?.status);
      default:
        return 0;
    }
  });

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left hover:text-accent transition-smooth"
    >
      <span>{children}</span>
      {sortField === field && (
        <Icon
          name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'}
          size={16}
        />
      )}
    </button>
  );

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">Recent Payments</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewAll}
            iconName="ArrowRight"
            iconPosition="right"
          >
            View All
          </Button>
        </div>
      </div>
      {/* Table Content */}
      <div className="overflow-x-auto">
        {sortedPayments?.length > 0 ? (
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                  <SortButton field="date">Date</SortButton>
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                  Payment
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                  <SortButton field="amount">Amount</SortButton>
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">
                  <SortButton field="status">Status</SortButton>
                </th>
                <th className="text-right py-3 px-6 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedPayments?.map((payment) => (
                <tr 
                  key={payment?.id} 
                  className="hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => handleViewPayment(payment?.id)}
                >
                  <td className="py-4 px-6">
                    <div className="text-sm text-foreground">
                      {formatDate(payment?.created_at)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                          <Icon name="CreditCard" size={16} className="text-accent" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {payment?.payment_id || 'N/A'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payment?.description || 'No description'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-foreground">
                      {formatCurrency(payment?.amount_fiat, payment?.currency_fiat)}
                    </div>
                    {payment?.currency_crypto && (
                      <div className="text-xs text-muted-foreground">
                        {payment?.currency_crypto?.toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment?.status)}`}>
                      {payment?.status?.charAt(0)?.toUpperCase() + payment?.status?.slice(1) || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      iconPosition="left"
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleViewPayment(payment?.id);
                      }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center">
            <Icon name="CreditCard" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No payments yet</h4>
            <p className="text-muted-foreground mb-6">
              Your recent payment transactions will appear here once you start processing payments.
            </p>
            <Button 
              variant="default" 
              iconName="Plus" 
              iconPosition="left"
              onClick={handleCreatePayment}
            >
              Create Payment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentPaymentsTable;