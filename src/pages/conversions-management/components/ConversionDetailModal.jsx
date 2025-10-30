import React from 'react';
import { X as XMarkIcon, Copy as CopyIcon, ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { format } from 'date-fns';

const ConversionDetailModal = ({ conversion, onClose }) => {
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

  const handleCopyToClipboard = (text) => {
    navigator?.clipboard?.writeText(text);
    // You could add a toast notification here
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config?.bg} ${config?.text}`}>
        {config?.label}
      </span>
    );
  };

  const feePercentage = conversion?.amount_fiat && conversion?.fee_amount 
    ? ((parseFloat(conversion?.fee_amount) / parseFloat(conversion?.amount_fiat)) * 100)?.toFixed(2)
    : '0.00';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Conversion Details
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Transaction ID: {conversion?.payment_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors duration-150"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Status and Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-2">Current Status</div>
            <div className="flex items-center justify-between">
              {getStatusBadge(conversion?.status)}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-2">Currency Pair</div>
            <div className="text-lg font-semibold text-gray-900">
              {conversion?.currency_crypto?.toUpperCase()} → {conversion?.currency_fiat?.toUpperCase()}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-2">Exchange Rate</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatRate(conversion?.exchange_rate)}
            </div>
          </div>
        </div>

        {/* Conversion Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Conversion Breakdown</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Source Amount</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(conversion?.amount_crypto, conversion?.currency_crypto)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Target Amount</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(conversion?.amount_fiat, conversion?.currency_fiat)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Amount Received</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(conversion?.amount_received, conversion?.currency_crypto)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Exchange Rate</span>
                <span className="font-medium text-gray-900">
                  {formatRate(conversion?.exchange_rate)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Network</span>
                <span className="font-medium text-gray-900">
                  {conversion?.network || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Fee Structure Analysis</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Fee Amount</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(conversion?.fee_amount, conversion?.fee_currency || conversion?.currency_fiat)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Fee Percentage</span>
                <span className="font-medium text-gray-900">
                  {feePercentage}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Fee Currency</span>
                <span className="font-medium text-gray-900">
                  {(conversion?.fee_currency || conversion?.currency_fiat)?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Net Amount</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(
                    parseFloat(conversion?.amount_fiat || 0) - parseFloat(conversion?.fee_amount || 0),
                    conversion?.currency_fiat
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Transaction Timeline</h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Conversion Created</div>
                <div className="text-xs text-gray-500">
                  {format(new Date(conversion?.created_at), 'MMM dd, yyyy HH:mm:ss')}
                </div>
              </div>
            </div>
            
            {conversion?.paid_at && (
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Payment Received</div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(conversion?.paid_at), 'MMM dd, yyyy HH:mm:ss')}
                  </div>
                </div>
              </div>
            )}
            
            {conversion?.confirmed_at && (
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Transaction Confirmed</div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(conversion?.confirmed_at), 'MMM dd, yyyy HH:mm:ss')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Technical Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-2">Transaction ID</div>
              <div className="flex items-center space-x-2">
                <code className="text-sm bg-white px-2 py-1 rounded border font-mono">
                  {conversion?.payment_id}
                </code>
                <button
                  onClick={() => handleCopyToClipboard(conversion?.payment_id)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-150"
                  title="Copy to clipboard"
                >
                  <CopyIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-2">Internal ID</div>
              <div className="flex items-center space-x-2">
                <code className="text-sm bg-white px-2 py-1 rounded border font-mono">
                  {conversion?.id}
                </code>
                <button
                  onClick={() => handleCopyToClipboard(conversion?.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-150"
                  title="Copy to clipboard"
                >
                  <CopyIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {conversion?.description && (
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500 mb-2">Description</div>
                <div className="text-sm text-gray-900 bg-white p-3 rounded border">
                  {conversion?.description}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={() => window.open(`/payments/${conversion?.id}`, '_blank')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <ExternalLinkIcon className="w-4 h-4 mr-1" />
            View in Payments
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversionDetailModal;