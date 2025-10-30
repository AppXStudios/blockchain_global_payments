import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QRCodeDisplay = ({ paymentAddress, amount, currency, onCopyAddress }) => {
  const [copied, setCopied] = useState(false);

  // Generate QR code URL (using a QR code service)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `${currency?.symbol?.toLowerCase()}:${paymentAddress}?amount=${amount}`
  )}`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard?.writeText(paymentAddress);
      setCopied(true);
      onCopyAddress?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleCopyAmount = async () => {
    try {
      await navigator.clipboard?.writeText(amount?.toString());
    } catch (err) {
      console.error('Failed to copy amount:', err);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
          Scan to Pay
        </h3>
        <p className="text-sm text-muted-foreground">
          Use your {currency?.name} wallet to scan this QR code
        </p>
      </div>
      {/* QR Code */}
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-white rounded-lg">
          <img
            src={qrCodeUrl}
            alt={`QR code for ${currency?.name} payment of ${amount} ${currency?.symbol} to address ${paymentAddress}`}
            className="w-48 h-48"
          />
        </div>
      </div>
      {/* Payment Details */}
      <div className="space-y-4">
        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Payment Address
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-3 bg-input border border-border rounded-lg font-mono text-sm text-foreground break-all">
              {paymentAddress}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyAddress}
              iconName={copied ? "Check" : "Copy"}
              className="flex-shrink-0"
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Amount to Send
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-3 bg-input border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-semibold text-foreground">
                  {amount} {currency?.symbol}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyAmount}
                  iconName="Copy"
                  iconSize={14}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Network Info */}
        <div className="glassmorphism rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Network:</span>
            <span className="font-medium text-foreground">{currency?.network}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground">Confirmations:</span>
            <span className="font-medium text-foreground">{currency?.confirmations}</span>
          </div>
        </div>
      </div>
      {/* Warning */}
      <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="AlertTriangle" size={16} color="var(--color-warning)" className="mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-warning mb-1">Important:</p>
            <p>Send only {currency?.name} ({currency?.symbol}) to this address. Sending other cryptocurrencies may result in permanent loss.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;