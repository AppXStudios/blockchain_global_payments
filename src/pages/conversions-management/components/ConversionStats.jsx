import React from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  DollarSign, 
  ArrowLeftRight, 
  CheckCircle,
  Clock 
} from 'lucide-react';

const ConversionStats = ({ stats }) => {
  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return '$0.00';
    const numAmount = parseFloat(amount);
    return numAmount?.toLocaleString('en-US', { 
      style: 'currency', 
      currency: currency?.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatCrypto = (amount) => {
    if (!amount) return '0.00000000';
    const numAmount = parseFloat(amount);
    return numAmount?.toFixed(8);
  };

  const formatPercentage = (value) => {
    if (!value) return '0.0%';
    return `${parseFloat(value)?.toFixed(1)}%`;
  };

  const formatNumber = (value) => {
    if (!value) return '0';
    return parseFloat(value)?.toLocaleString();
  };

  const getConversionRate = () => {
    if (!stats?.totalConversions || stats?.totalConversions === 0) return 0;
    return (stats?.completedConversions / stats?.totalConversions) * 100;
  };

  const statsCards = [
    {
      name: 'Total Conversions',
      value: formatNumber(stats?.totalConversions),
      icon: ArrowLeftRight,
      color: 'blue',
      subtitle: 'Conversion transactions'
    },
    {
      name: 'Total Volume (Fiat)',
      value: formatCurrency(stats?.totalVolumeFiat),
      icon: DollarSign,
      color: 'green',
      subtitle: 'Fiat currency converted'
    },
    {
      name: 'Total Volume (Crypto)',
      value: formatCrypto(stats?.totalVolumeCrypto),
      icon: ArrowUp,
      color: 'purple',
      subtitle: 'Cryptocurrency exchanged'
    },
    {
      name: 'Total Fees Collected',
      value: formatCurrency(stats?.totalFees),
      icon: ArrowDown,
      color: 'indigo',
      subtitle: 'Conversion fees earned'
    },
    {
      name: 'Completed Rate',
      value: formatPercentage(getConversionRate()),
      icon: CheckCircle,
      color: 'emerald',
      subtitle: `${stats?.completedConversions || 0} of ${stats?.totalConversions || 0} completed`
    },
    {
      name: 'Average Rate',
      value: stats?.averageRate?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 }),
      icon: Clock,
      color: 'orange',
      subtitle: 'Across all conversions'
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      icon: 'bg-blue-500'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      icon: 'bg-green-500'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      icon: 'bg-purple-500'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      icon: 'bg-indigo-500'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      icon: 'bg-emerald-500'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      icon: 'bg-orange-500'
    }
  };

  return (
    <div className="mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">Conversion Statistics</h2>
        <p className="text-sm text-gray-500">
          30-day overview of conversion activity and performance
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsCards?.map((stat) => {
          const IconComponent = stat?.icon;
          const colors = colorClasses?.[stat?.color];
          
          return (
            <div key={stat?.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`inline-flex items-center justify-center p-3 ${colors?.icon} rounded-md shadow-lg`}>
                      <IconComponent className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat?.name}
                      </dt>
                      <dd className={`text-lg font-medium ${colors?.text}`}>
                        {stat?.value}
                      </dd>
                      <dd className="text-xs text-gray-400 mt-1">
                        {stat?.subtitle}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className={`${colors?.bg} px-5 py-3`}>
                <div className="text-sm">
                  <span className={`font-medium ${colors?.text}`}>
                    Last 30 days
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Additional Insights */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currency Pairs Summary */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Active Currency Pairs
          </h3>
          {stats?.currencyPairs?.length > 0 ? (
            <div className="space-y-2">
              {stats?.currencyPairs?.slice(0, 5)?.map((pair, index) => (
                <div key={pair} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium text-gray-700">{pair}</span>
                  <span className="text-xs text-gray-500">Active</span>
                </div>
              ))}
              {stats?.currencyPairs?.length > 5 && (
                <div className="text-sm text-gray-500 mt-2">
                  +{stats?.currencyPairs?.length - 5} more pairs
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No active currency pairs</div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getConversionRate()}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatPercentage(getConversionRate())}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Fee Rate</span>
              <span className="text-sm font-medium text-gray-900">
                {stats?.totalVolumeFiat > 0 
                  ? formatPercentage((stats?.totalFees / stats?.totalVolumeFiat) * 100)
                  : '0.0%'
                }
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Daily Average</span>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(stats?.totalConversions / 30)} conversions
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionStats;