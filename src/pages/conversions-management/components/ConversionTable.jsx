import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon, EyeIcon, ExternalLinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import ConversionDetailModal from './ConversionDetailModal';

const ConversionTable = ({ conversions, sortConfig, onSort, loading }) => {
  const [selectedConversion, setSelectedConversion] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const formatCurrency = (amount, currency) => {
    if (!amount) return '-';
    const numAmount = parseFloat(amount);
    if (currency?.toLowerCase()?.includes('usd') || currency?.toLowerCase() === 'eur') {
      return `$${numAmount?.toFixed(2)}`;
    }
    return `${numAmount?.toFixed(8)} ${currency?.toUpperCase()}`;
  };

  const formatRate = (rate) => {
    if (!rate) return '-';
    const numRate = parseFloat(rate);
    return numRate?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        {config?.label}
      </span>
    );
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) {
      return <ChevronUpIcon className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <ChevronUpIcon className="w-4 h-4 text-blue-600" />
      : <ChevronDownIcon className="w-4 h-4 text-blue-600" />;
  };

  const handleRowExpand = (conversionId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded?.has(conversionId)) {
      newExpanded?.delete(conversionId);
    } else {
      newExpanded?.add(conversionId);
    }
    setExpandedRows(newExpanded);
  };

  const handleViewDetails = (conversion) => {
    setSelectedConversion(conversion);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5]?.map(i => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Conversion History
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {conversions?.length} conversion records found
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {[
                  { key: 'payment_id', label: 'Transaction ID' },
                  { key: 'currency_crypto', label: 'Source Currency' },
                  { key: 'currency_fiat', label: 'Target Currency' },
                  { key: 'exchange_rate', label: 'Exchange Rate' },
                  { key: 'amount_fiat', label: 'Amount Converted' },
                  { key: 'fee_amount', label: 'Fees' },
                  { key: 'status', label: 'Status' },
                  { key: 'created_at', label: 'Timestamp' },
                  { key: 'actions', label: 'Actions' }
                ]?.map(column => (
                  <th 
                    key={column?.key}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column?.key !== 'actions' ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                    onClick={column?.key !== 'actions' ? () => onSort(column?.key) : undefined}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column?.label}</span>
                      {column?.key !== 'actions' && getSortIcon(column?.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {conversions?.map((conversion) => (
                <React.Fragment key={conversion?.id}>
                  <tr className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {conversion?.payment_id?.slice(0, 16)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {conversion?.currency_crypto?.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {conversion?.currency_fiat?.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatRate(conversion?.exchange_rate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(conversion?.amount_fiat, conversion?.currency_fiat)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(conversion?.fee_amount, conversion?.fee_currency || conversion?.currency_fiat)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(conversion?.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(conversion?.created_at), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRowExpand(conversion?.id)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                          title="Expand details"
                        >
                          <ExternalLinkIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewDetails(conversion)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
                          title="View details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expandable Row Details */}
                  {expandedRows?.has(conversion?.id) && (
                    <tr className="bg-gray-50">
                      <td colSpan="9" className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Conversion Details</h4>
                            <div className="space-y-1 text-gray-600">
                              <p>Crypto Amount: {formatCurrency(conversion?.amount_crypto, conversion?.currency_crypto)}</p>
                              <p>Amount Received: {formatCurrency(conversion?.amount_received, conversion?.currency_crypto)}</p>
                              <p>Network: {conversion?.network || 'N/A'}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Market Conditions</h4>
                            <div className="space-y-1 text-gray-600">
                              <p>Rate at Exchange: {formatRate(conversion?.exchange_rate)}</p>
                              <p>Fee Structure: {((parseFloat(conversion?.fee_amount || 0) / parseFloat(conversion?.amount_fiat || 1)) * 100)?.toFixed(2)}%</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                            <div className="space-y-1 text-gray-600">
                              <p>Created: {format(new Date(conversion?.created_at), 'MMM dd, yyyy HH:mm:ss')}</p>
                              {conversion?.paid_at && (
                                <p>Paid: {format(new Date(conversion?.paid_at), 'MMM dd, yyyy HH:mm:ss')}</p>
                              )}
                              {conversion?.confirmed_at && (
                                <p>Confirmed: {format(new Date(conversion?.confirmed_at), 'MMM dd, yyyy HH:mm:ss')}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          {conversions?.map((conversion) => (
            <div key={conversion?.id} className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-mono text-sm text-gray-900">
                  {conversion?.payment_id?.slice(0, 16)}...
                </div>
                {getStatusBadge(conversion?.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-gray-500">Pair:</span>
                  <span className="ml-1 font-medium">
                    {conversion?.currency_crypto?.toUpperCase()}/{conversion?.currency_fiat?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Rate:</span>
                  <span className="ml-1 font-medium">{formatRate(conversion?.exchange_rate)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Amount:</span>
                  <span className="ml-1 font-medium">
                    {formatCurrency(conversion?.amount_fiat, conversion?.currency_fiat)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Fee:</span>
                  <span className="ml-1 font-medium">
                    {formatCurrency(conversion?.fee_amount, conversion?.fee_currency || conversion?.currency_fiat)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {format(new Date(conversion?.created_at), 'MMM dd, yyyy HH:mm')}
                </div>
                <button
                  onClick={() => handleViewDetails(conversion)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {conversions?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No conversions found</div>
            <div className="text-gray-500 text-sm">
              No conversion records match your current filters
            </div>
          </div>
        )}
      </div>
      {/* Detail Modal */}
      {showDetailModal && selectedConversion && (
        <ConversionDetailModal
          conversion={selectedConversion}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </>
  );
};

export default ConversionTable;