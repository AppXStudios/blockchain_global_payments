import React from 'react';

const BillingToggle = ({ billingCycle, onToggle }) => {
  return (
    <div className="flex items-center justify-center mb-12">
      <div className="flex items-center space-x-4 p-1 glassmorphism rounded-xl border border-border">
        <button
          onClick={() => onToggle('monthly')}
          className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            billingCycle === 'monthly' ?'gradient-primary text-white shadow-elevation-sm' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => onToggle('annual')}
          className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative ${
            billingCycle === 'annual' ?'gradient-primary text-white shadow-elevation-sm' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          Annual
          <span className="absolute -top-2 -right-2 bg-success text-white text-xs px-2 py-1 rounded-full">
            Save 20%
          </span>
        </button>
      </div>
    </div>
  );
};

export default BillingToggle;