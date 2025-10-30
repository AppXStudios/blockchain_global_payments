import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvoicePreview = ({ invoiceData, onEdit }) => {
  const mockInvoiceUrl = "https://pay.blockchainpayments.com/invoice/inv_1234567890abcdef";
  const mockQrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(mockInvoiceUrl);

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    })?.format(amount || 0);
  };

  const formatExpiration = (hours) => {
    const now = new Date();
    const expiration = new Date(now.getTime() + (hours * 60 * 60 * 1000));
    return expiration?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!invoiceData?.amount) {
    return (
      <div className="glassmorphism rounded-xl p-8 border border-border">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Icon name="Eye" size={24} color="var(--color-muted-foreground)" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Invoice Preview</h3>
          <p className="text-muted-foreground">
            Fill out the form to see a preview of your invoice
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <div className="glassmorphism rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Invoice Preview</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            iconName="Edit"
            iconPosition="left"
          >
            Edit
          </Button>
        </div>

        {/* Mock Hosted Page Preview */}
        <div className="bg-background rounded-lg border border-border p-6 space-y-6">
          {/* Header */}
          <div className="text-center border-b border-border pb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Icon name="Zap" size={16} color="white" />
              </div>
              <span className="font-heading text-lg font-semibold">BGP</span>
            </div>
            <p className="text-sm text-muted-foreground">Secure Cryptocurrency Payment</p>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {formatAmount(invoiceData?.amount, invoiceData?.currency)}
              </div>
              <p className="text-muted-foreground">{invoiceData?.description}</p>
            </div>

            {/* QR Code */}
            {invoiceData?.enableQrCode && (
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg">
                  <img 
                    src={mockQrCodeUrl}
                    alt="QR code for cryptocurrency payment containing wallet address and amount"
                    className="w-32 h-32"
                  />
                </div>
              </div>
            )}

            {/* Payment Info */}
            <div className="glassmorphism rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-warning font-medium">Pending Payment</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expires:</span>
                <span className="text-foreground">{formatExpiration(invoiceData?.expirationHours)}</span>
              </div>
              {invoiceData?.customerEmail && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="text-foreground">{invoiceData?.customerEmail}</span>
                </div>
              )}
            </div>

            {/* Mock Payment Button */}
            <Button
              variant="default"
              fullWidth
              className="gradient-primary text-white"
              disabled
            >
              Select Cryptocurrency
            </Button>
          </div>
        </div>
      </div>
      {/* Invoice Details */}
      <div className="glassmorphism rounded-xl p-6 border border-border">
        <h4 className="font-medium text-foreground mb-4">Invoice Configuration</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount:</span>
            <span className="text-foreground font-medium">
              {formatAmount(invoiceData?.amount, invoiceData?.currency)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Description:</span>
            <span className="text-foreground">{invoiceData?.description}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Expiration:</span>
            <span className="text-foreground">{invoiceData?.expirationHours} hours</span>
          </div>
          {invoiceData?.successUrl && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Success URL:</span>
              <span className="text-foreground truncate max-w-[200px]">{invoiceData?.successUrl}</span>
            </div>
          )}
          {invoiceData?.webhookUrl && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Webhook URL:</span>
              <span className="text-foreground truncate max-w-[200px]">{invoiceData?.webhookUrl}</span>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-4 pt-4 border-t border-border">
          <h5 className="text-sm font-medium text-foreground mb-2">Features Enabled</h5>
          <div className="flex flex-wrap gap-2">
            {invoiceData?.enableQrCode && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-accent/10 text-accent text-xs">
                <Icon name="QrCode" size={12} className="mr-1" />
                QR Code
              </span>
            )}
            {invoiceData?.allowPartialPayments && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-success/10 text-success text-xs">
                <Icon name="CreditCard" size={12} className="mr-1" />
                Partial Payments
              </span>
            )}
            {invoiceData?.requireCustomerInfo && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-warning/10 text-warning text-xs">
                <Icon name="User" size={12} className="mr-1" />
                Customer Info Required
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;