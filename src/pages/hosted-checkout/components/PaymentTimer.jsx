import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PaymentTimer = ({ expiresAt, onExpired, onRefresh }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()?.getTime();
      const expiry = new Date(expiresAt)?.getTime();
      const difference = expiry - now;
      
      if (difference > 0) {
        setTimeLeft(difference);
        setIsExpired(false);
      } else {
        setTimeLeft(0);
        setIsExpired(true);
        onExpired?.();
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpired]);

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes?.toString()?.padStart(2, '0')}:${seconds?.toString()?.padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalTime = 15 * 60 * 1000; // 15 minutes in milliseconds
    return Math.max(0, (timeLeft / totalTime) * 100);
  };

  const getTimerColor = () => {
    const minutes = Math.floor(timeLeft / (1000 * 60));
    if (minutes <= 2) return 'text-error';
    if (minutes <= 5) return 'text-warning';
    return 'text-success';
  };

  if (isExpired) {
    return (
      <div className="bg-error/10 border border-error/30 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-error/20 flex items-center justify-center">
              <Icon name="Clock" size={20} color="var(--color-error)" />
            </div>
            <div>
              <h4 className="font-medium text-error">Payment Expired</h4>
              <p className="text-sm text-muted-foreground">
                The payment window has closed. Please refresh to get new rates.
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-smooth"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} className={getTimerColor()} />
          <span className="text-sm font-medium text-foreground">Payment Window</span>
        </div>
        <div className={`font-mono text-lg font-bold ${getTimerColor()}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${
            timeLeft <= 2 * 60 * 1000 
              ? 'bg-error' 
              : timeLeft <= 5 * 60 * 1000 
                ? 'bg-warning' :'bg-success'
          }`}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Exchange rates are locked for this duration. Complete payment before expiry.
      </p>
    </div>
  );
};

export default PaymentTimer;