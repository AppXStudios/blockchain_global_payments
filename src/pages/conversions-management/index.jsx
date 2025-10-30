import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import ConversionTable from './components/ConversionTable';
import ConversionFilters from './components/ConversionFilters';
import MarketRatesWidget from './components/MarketRatesWidget';
import ConversionStats from './components/ConversionStats';
import RateAlerts from './components/RateAlerts';
import { conversionsService } from '../../services/conversionsService';

const ConversionsManagement = () => {
  const [conversions, setConversions] = useState([]);
  const [filteredConversions, setFilteredConversions] = useState([]);
  const [marketRates, setMarketRates] = useState([]);
  const [conversionStats, setConversionStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    currencyPair: '',
    status: '',
    minRate: '',
    maxRate: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'desc'
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load initial data
  useEffect(() => {
    loadConversionsData();
    loadMarketRates();
    loadConversionStats();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [filters, conversions]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const loadConversionsData = async () => {
    setLoading(true);
    try {
      const { data, error } = await conversionsService?.getConversions({ limit: 1000 });
      if (error) {
        setError(error?.message || 'Failed to load conversions');
        return;
      }
      setConversions(data || []);
    } catch (err) {
      setError('Network error loading conversions data');
    } finally {
      setLoading(false);
    }
  };

  const loadMarketRates = async () => {
    try {
      const { data, error } = await conversionsService?.getCurrentMarketRates();
      if (error) {
        console.log('Error loading market rates:', error?.message);
        return;
      }
      setMarketRates(data || []);
    } catch (err) {
      console.log('Network error loading market rates');
    }
  };

  const loadConversionStats = async () => {
    try {
      const { data, error } = await conversionsService?.getConversionStats('30d');
      if (error) {
        console.log('Error loading conversion stats:', error?.message);
        return;
      }
      setConversionStats(data);
    } catch (err) {
      console.log('Network error loading conversion stats');
    }
  };

  const applyFilters = () => {
    let filtered = [...conversions];

    // Date range filter
    if (filters?.dateFrom) {
      filtered = filtered?.filter(conversion => 
        new Date(conversion?.created_at) >= new Date(filters?.dateFrom)
      );
    }
    if (filters?.dateTo) {
      filtered = filtered?.filter(conversion => 
        new Date(conversion?.created_at) <= new Date(filters?.dateTo)
      );
    }

    // Currency pair filter
    if (filters?.currencyPair) {
      const [crypto, fiat] = filters?.currencyPair?.split('/');
      filtered = filtered?.filter(conversion => 
        conversion?.currency_crypto === crypto && conversion?.currency_fiat === fiat
      );
    }

    // Status filter
    if (filters?.status) {
      filtered = filtered?.filter(conversion => conversion?.status === filters?.status);
    }

    // Rate range filter
    if (filters?.minRate && filters?.maxRate) {
      filtered = filtered?.filter(conversion => {
        const rate = parseFloat(conversion?.exchange_rate || 0);
        return rate >= parseFloat(filters?.minRate) && rate <= parseFloat(filters?.maxRate);
      });
    }

    // Apply sorting
    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        const aValue = a?.[sortConfig?.key];
        const bValue = b?.[sortConfig?.key];
        
        if (sortConfig?.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    setFilteredConversions(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleRefresh = () => {
    loadConversionsData();
    loadMarketRates();
    loadConversionStats();
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar onToggleCollapse={handleSidebarToggle} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading conversions data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onToggleCollapse={handleSidebarToggle} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Conversions Management</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Monitor and analyze cryptocurrency-to-fiat exchange operations
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Statistics Cards */}
            {conversionStats && (
              <ConversionStats stats={conversionStats} />
            )}

            {/* Market Rates and Rate Alerts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
              <div className="xl:col-span-2">
                <MarketRatesWidget rates={marketRates} />
              </div>
              <div className="xl:col-span-1">
                <RateAlerts />
              </div>
            </div>

            {/* Filters */}
            <ConversionFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              conversions={conversions}
            />

            {/* Conversion Table */}
            <ConversionTable
              conversions={filteredConversions}
              sortConfig={sortConfig}
              onSort={handleSort}
              loading={loading}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConversionsManagement;