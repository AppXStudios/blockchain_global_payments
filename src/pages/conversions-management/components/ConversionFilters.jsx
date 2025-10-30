import React, { useState, useEffect } from 'react';
import { CalendarIcon, FilterIcon, X } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { conversionsService } from '../../../services/conversionsService';

const ConversionFilters = ({ filters, onFilterChange, conversions }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [currencyPairs, setCurrencyPairs] = useState([]);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);

  useEffect(() => {
    loadCurrencyPairs();
  }, []);

  useEffect(() => {
    // Count applied filters
    let count = 0;
    if (filters?.dateFrom) count++;
    if (filters?.dateTo) count++;
    if (filters?.currencyPair) count++;
    if (filters?.status) count++;
    if (filters?.minRate || filters?.maxRate) count++;
    setAppliedFiltersCount(count);
  }, [filters]);

  const loadCurrencyPairs = async () => {
    try {
      const { data, error } = await conversionsService?.getCurrencyPairs();
      if (!error && data) {
        setCurrencyPairs(data);
      }
    } catch (err) {
      console.log('Error loading currency pairs');
    }
  };

  const handleDateRangePreset = (preset) => {
    const today = new Date();
    let dateFrom = '';
    
    switch (preset) {
      case '7d':
        dateFrom = format(subDays(today, 7), 'yyyy-MM-dd');
        break;
      case '30d':
        dateFrom = format(subDays(today, 30), 'yyyy-MM-dd');
        break;
      case '90d':
        dateFrom = format(subDays(today, 90), 'yyyy-MM-dd');
        break;
      default:
        dateFrom = '';
    }
    
    onFilterChange({
      dateFrom,
      dateTo: format(today, 'yyyy-MM-dd')
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      dateFrom: '',
      dateTo: '',
      currencyPair: '',
      status: '',
      minRate: '',
      maxRate: ''
    });
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            {appliedFiltersCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {appliedFiltersCount} active
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {appliedFiltersCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                showFilters 
                  ? 'border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <FilterIcon className="w-4 h-4 mr-1" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Range */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="date"
                      value={filters?.dateFrom}
                      onChange={(e) => onFilterChange({ dateFrom: e?.target?.value })}
                      className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="From date"
                    />
                    <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={filters?.dateTo}
                      onChange={(e) => onFilterChange({ dateTo: e?.target?.value })}
                      className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="To date"
                    />
                    <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['7d', '30d', '90d']?.map(preset => (
                    <button
                      key={preset}
                      onClick={() => handleDateRangePreset(preset)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors duration-150"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency Pair Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Currency Pair
                </label>
                <select
                  value={filters?.currencyPair}
                  onChange={(e) => onFilterChange({ currencyPair: e?.target?.value })}
                  className="block w-full py-2 px-3 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Pairs</option>
                  {currencyPairs?.map(pair => (
                    <option key={pair} value={pair}>{pair}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Conversion Status
                </label>
                <select
                  value={filters?.status}
                  onChange={(e) => onFilterChange({ status: e?.target?.value })}
                  className="block w-full py-2 px-3 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions?.map(option => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rate Range */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Exchange Rate Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.00000001"
                    placeholder="Min rate"
                    value={filters?.minRate}
                    onChange={(e) => onFilterChange({ minRate: e?.target?.value })}
                    className="block w-full py-2 px-3 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    step="0.00000001"
                    placeholder="Max rate"
                    value={filters?.maxRate}
                    onChange={(e) => onFilterChange({ maxRate: e?.target?.value })}
                    className="block w-full py-2 px-3 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Showing {conversions?.length} results
                </span>
                <span>
                  Click column headers to sort data
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversionFilters;