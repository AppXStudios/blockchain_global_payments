import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import PaymentStatusBadge from './PaymentStatusBadge';

const PaymentMobileCard = ({ payment, onSelect, isSelected, onViewDetails }) => {
  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="glassmorphism border border-border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(payment?.id)}
            className="rounded border-border bg-input text-accent focus:ring-accent focus:ring-offset-background"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm text-foreground">{payment?.id?.slice(0, 8)}...</span>
              <button
                onClick={() => copyToClipboard(payment?.id)}
                className="p-1 rounded hover:bg-muted/20 transition-smooth"
              >
                <Icon name="Copy" size={12} color="currentColor" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{formatDate(payment?.createdAt)}</p>
          </div>
        </div>
        <PaymentStatusBadge status={payment?.status} size="sm" />
      </div>
      {/* Amount and Currency */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-foreground">
            ${parseFloat(payment?.usdAmount)?.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            {parseFloat(payment?.cryptoAmount)?.toLocaleString()} {payment?.currency}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-sm font-bold text-accent">
              {payment?.currency?.charAt(0)}
            </span>
          </div>
          <span className="text-sm font-medium text-foreground">{payment?.currency}</span>
        </div>
      </div>
      {/* Customer Info */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="User" size={14} color="var(--color-muted-foreground)" />
          <span className="text-sm font-medium text-foreground">{payment?.customerName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Mail" size={14} color="var(--color-muted-foreground)" />
          <span className="text-sm text-muted-foreground">{payment?.customerEmail}</span>
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(payment)}
          iconName="Eye"
          iconPosition="left"
        >
          View Details
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="MoreHorizontal"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentMobileCard;