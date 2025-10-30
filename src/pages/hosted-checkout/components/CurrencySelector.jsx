import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CurrencySelector = ({ currencies, selectedCurrency, onCurrencySelect, exchangeRates }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filteredCurrencies = currencies?.filter(currency =>
    currency?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    currency?.symbol?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const displayedCurrencies = showAll ? filteredCurrencies : filteredCurrencies?.slice(0, 6);

  const getExchangeRate = (symbol) => {
    return exchangeRates?.[symbol] || 0;
  };

  const formatCryptoAmount = (usdAmount, rate) => {
    if (!rate) return '0.00000000';
    return (usdAmount / rate)?.toFixed(8);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="mb-4">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
          Select Payment Currency
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose your preferred cryptocurrency for payment
        </p>
      </div>
      {/* Search */}
      <div className="relative mb-4">
        <Icon 
          name="Search" 
          size={16} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
        />
        <input
          type="text"
          placeholder="Search currencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        />
      </div>
      {/* Currency Grid */}
      <div className="space-y-2 mb-4">
        {displayedCurrencies?.map((currency) => {
          const rate = getExchangeRate(currency?.symbol);
          const cryptoAmount = formatCryptoAmount(250, rate); // Assuming $250 invoice
          const isSelected = selectedCurrency?.symbol === currency?.symbol;
          
          return (
            <button
              key={currency?.symbol}
              onClick={() => onCurrencySelect(currency)}
              className={`w-full p-3 rounded-lg border transition-smooth text-left hover:bg-muted ${
                isSelected 
                  ? 'border-accent bg-accent/10' :'border-border hover:border-accent/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={currency?.icon}
                      alt={currency?.iconAlt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{currency?.name}</div>
                    <div className="text-xs text-muted-foreground">{currency?.symbol}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-mono text-sm text-foreground">
                    {cryptoAmount} {currency?.symbol}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ≈ ${rate?.toLocaleString()}
                  </div>
                </div>
              </div>
              {/* Network Info */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>Network: {currency?.network}</span>
                  <span>Fee: ~${currency?.networkFee}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {currency?.confirmations} confirmations
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {/* Show More/Less */}
      {filteredCurrencies?.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-sm text-accent hover:text-accent/80 transition-smooth"
        >
          {showAll ? 'Show Less' : `Show ${filteredCurrencies?.length - 6} More`}
        </button>
      )}
    </div>
  );
};

export default CurrencySelector;