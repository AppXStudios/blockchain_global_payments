import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, currency = false, loading = false }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    if (!loading && value) {
      const duration = 1500;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [value, loading]);

  const formatValue = (val) => {
    if (currency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })?.format(val);
    }
    return new Intl.NumberFormat('en-US')?.format(val);
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className={`glassmorphism p-6 rounded-xl border border-border transition-all duration-300 hover:shadow-elevation-md ${
      isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
            <Icon name={icon} size={20} color="var(--color-accent)" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={16} />
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="h-8 w-32 skeleton rounded"></div>
        ) : (
          <div className="text-2xl font-bold text-foreground">
            {formatValue(animatedValue)}
          </div>
        )}
        <p className="text-xs text-muted-foreground">Last 30 days</p>
      </div>
    </div>
  );
};

export default KPICard;