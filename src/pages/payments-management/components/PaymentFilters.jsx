import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';


const PaymentFilters = ({ onFiltersChange, resultsCount }) => {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    currency: '',
    status: '',
    amountMin: '',
    amountMax: '',
    search: ''
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'expired', label: 'Expired' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const currencyOptions = [
    { value: '', label: 'All Currencies' },
    { value: 'BTC', label: 'Bitcoin (BTC)' },
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'USDT', label: 'Tether (USDT)' },
    { value: 'USDC', label: 'USD Coin (USDC)' },
    { value: 'LTC', label: 'Litecoin (LTC)' },
    { value: 'XRP', label: 'Ripple (XRP)' },
    { value: 'ADA', label: 'Cardano (ADA)' },
    { value: 'DOT', label: 'Polkadot (DOT)' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      dateFrom: '',
      dateTo: '',
      currency: '',
      status: '',
      amountMin: '',
      amountMax: '',
      search: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="glassmorphism border border-border rounded-lg p-6 mb-6">
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search by transaction ID, customer email, or reference..."
          value={filters?.search}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
          className="max-w-md"
        />
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        {/* Date Range */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              placeholder="From"
              value={filters?.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
            />
            <Input
              type="date"
              placeholder="To"
              value={filters?.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
            />
          </div>
        </div>

        {/* Currency Filter */}
        <Select
          label="Currency"
          options={currencyOptions}
          value={filters?.currency}
          onChange={(value) => handleFilterChange('currency', value)}
          placeholder="All currencies"
        />

        {/* Status Filter */}
        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="All statuses"
        />

        {/* Amount Range */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">Amount Range (USD)</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters?.amountMin}
              onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters?.amountMax}
              onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
            />
          </div>
        </div>
      </div>
      {/* Results Summary and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {resultsCount?.toLocaleString()} transactions found
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFilters;