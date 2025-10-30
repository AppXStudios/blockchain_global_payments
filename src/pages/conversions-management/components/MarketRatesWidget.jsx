import React, { useState, useEffect } from 'react';
import { TrendingUpIcon, TrendingDownIcon, RefreshCwIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { conversionsService } from '../../../services/conversionsService';

const MarketRatesWidget = ({ rates }) => {
  const [selectedPair, setSelectedPair] = useState('');
  const [historicalData, setHistoricalData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(false);
  const [refreshTime, setRefreshTime] = useState(new Date());

  useEffect(() => {
    if (rates?.length > 0 && !selectedPair) {
      setSelectedPair(rates?.[0]?.pair);
    }
  }, [rates]);

  useEffect(() => {
    if (selectedPair) {
      loadHistoricalData(selectedPair);
    }
  }, [selectedPair]);

  const loadHistoricalData = async (currencyPair) => {
    setLoadingChart(true);
    try {
      const { data, error } = await conversionsService?.getHistoricalRates(currencyPair, 7);
      if (!error && data) {
        setHistoricalData(data);
      }
    } catch (err) {
      console.log('Error loading historical data');
    } finally {
      setLoadingChart(false);
    }
  };

  const formatRate = (rate) => {
    if (!rate) return '-';
    const numRate = parseFloat(rate);
    return numRate?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 });
  };

  const getPercentageChange = (current, previous) => {
    if (!current || !previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const handleRefresh = () => {
    setRefreshTime(new Date());
    if (selectedPair) {
      loadHistoricalData(selectedPair);
    }
  };

  // Calculate percentage changes (mock calculation for demonstration)
  const ratesWithChanges = rates?.map((rate, index) => {
    // Mock previous rate (in real app, this would come from historical data)
    const mockPreviousRate = parseFloat(rate?.rate) * (0.95 + Math.random() * 0.1);
    const change = getPercentageChange(parseFloat(rate?.rate), mockPreviousRate);
    
    return {
      ...rate,
      change,
      isPositive: change >= 0
    };
  });

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Real-Time Exchange Rates
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Current market rates for popular cryptocurrency pairs
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              Last updated: {format(refreshTime, 'HH:mm:ss')}
            </span>
            <button
              onClick={handleRefresh}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors duration-150"
              title="Refresh rates"
            >
              <RefreshCwIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* Current Rates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {ratesWithChanges?.slice(0, 6)?.map((rate) => (
            <div 
              key={rate?.pair}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedPair === rate?.pair
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => setSelectedPair(rate?.pair)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">
                  {rate?.pair}
                </div>
                <div className={`flex items-center text-sm ${
                  rate?.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {rate?.isPositive ? (
                    <TrendingUpIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDownIcon className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(rate?.change)?.toFixed(2)}%
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900">
                {formatRate(rate?.rate)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Updated: {format(new Date(rate?.lastUpdated), 'HH:mm')}
              </div>
            </div>
          ))}
        </div>

        {/* Historical Chart */}
        {selectedPair && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">
                7-Day Rate History: {selectedPair}
              </h4>
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e?.target?.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500"
              >
                {rates?.map(rate => (
                  <option key={rate?.pair} value={rate?.pair}>
                    {rate?.pair}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-64">
              {loadingChart ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatRate(value)}
                      domain={['dataMin - dataMin*0.01', 'dataMax + dataMax*0.01']}
                    />
                    <Tooltip 
                      labelFormatter={(value) => `Date: ${format(new Date(value), 'MMM dd, yyyy')}`}
                      formatter={(value) => [formatRate(value), 'Rate']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {historicalData?.length === 0 && !loadingChart && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-sm">No historical data available</div>
                  <div className="text-xs mt-1">for {selectedPair}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {ratesWithChanges?.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">No market rates available</div>
            <div className="text-gray-500 text-sm">
              Market rate data will appear here when conversions are processed
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketRatesWidget;