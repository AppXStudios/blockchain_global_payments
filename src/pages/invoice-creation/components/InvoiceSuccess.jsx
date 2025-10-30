import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const InvoiceSuccess = ({ invoiceData, onCreateAnother, onViewInvoices }) => {
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const mockInvoiceUrl = "https://pay.blockchainpayments.com/invoice/inv_1234567890abcdef";
  const mockInvoiceId = "INV-2024-001234";
  const mockQrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + encodeURIComponent(mockInvoiceUrl);

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    })?.format(amount || 0);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(mockInvoiceUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleSendEmail = () => {
    // Mock email sending
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = mockQrCodeUrl;
    link.download = `invoice-qr-${mockInvoiceId}.png`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
          <Icon name="CheckCircle" size={32} color="var(--color-success)" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Invoice Created Successfully!</h2>
        <p className="text-muted-foreground">
          Your payment link is ready to share with customers
        </p>
      </div>
      {/* Invoice Details Card */}
      <div className="glassmorphism rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Invoice Details</h3>
            <p className="text-sm text-muted-foreground">ID: {mockInvoiceId}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {formatAmount(invoiceData?.amount, invoiceData?.currency)}
            </div>
            <div className="text-sm text-muted-foreground">{invoiceData?.description}</div>
          </div>
        </div>

        {/* Payment Link */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Payment Link
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm font-mono">
                {mockInvoiceUrl}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                iconName={copied ? "Check" : "Copy"}
                className={copied ? "text-success border-success" : ""}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {/* QR Code */}
          {invoiceData?.enableQrCode && (
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg">
                <img 
                  src={mockQrCodeUrl}
                  alt="QR code for cryptocurrency payment containing wallet address and payment amount"
                  className="w-48 h-48"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Sharing Options */}
      <div className="glassmorphism rounded-xl p-6 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Share Invoice</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Email */}
          {invoiceData?.customerEmail && (
            <Button
              variant="outline"
              onClick={handleSendEmail}
              iconName={emailSent ? "Check" : "Mail"}
              iconPosition="left"
              className={emailSent ? "text-success border-success" : ""}
              fullWidth
            >
              {emailSent ? "Email Sent!" : "Send Email"}
            </Button>
          )}

          {/* Download QR */}
          {invoiceData?.enableQrCode && (
            <Button
              variant="outline"
              onClick={handleDownloadQR}
              iconName="Download"
              iconPosition="left"
              fullWidth
            >
              Download QR
            </Button>
          )}

          {/* Copy Link */}
          <Button
            variant="outline"
            onClick={handleCopyLink}
            iconName={copied ? "Check" : "Link"}
            iconPosition="left"
            className={copied ? "text-success border-success" : ""}
            fullWidth
          >
            {copied ? "Link Copied!" : "Copy Link"}
          </Button>
        </div>
      </div>
      {/* Invoice Configuration Summary */}
      <div className="glassmorphism rounded-xl p-6 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Configuration Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="text-foreground font-medium">
                {formatAmount(invoiceData?.amount, invoiceData?.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expiration:</span>
              <span className="text-foreground">{invoiceData?.expirationHours} hours</span>
            </div>
            {invoiceData?.customerEmail && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer:</span>
                <span className="text-foreground">{invoiceData?.customerEmail}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">QR Code:</span>
              <Icon 
                name={invoiceData?.enableQrCode ? "Check" : "X"} 
                size={16} 
                color={invoiceData?.enableQrCode ? "var(--color-success)" : "var(--color-muted-foreground)"} 
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Partial Payments:</span>
              <Icon 
                name={invoiceData?.allowPartialPayments ? "Check" : "X"} 
                size={16} 
                color={invoiceData?.allowPartialPayments ? "var(--color-success)" : "var(--color-muted-foreground)"} 
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Customer Info:</span>
              <Icon 
                name={invoiceData?.requireCustomerInfo ? "Check" : "X"} 
                size={16} 
                color={invoiceData?.requireCustomerInfo ? "var(--color-success)" : "var(--color-muted-foreground)"} 
              />
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          onClick={onCreateAnother}
          iconName="Plus"
          iconPosition="left"
          className="min-w-[160px]"
        >
          Create Another
        </Button>
        <Button
          variant="default"
          onClick={onViewInvoices}
          iconName="FileText"
          iconPosition="left"
          className="gradient-primary text-white min-w-[160px]"
        >
          View All Invoices
        </Button>
      </div>
      {/* Next Steps */}
      <div className="glassmorphism rounded-xl p-6 border border-border">
        <h3 className="font-semibold text-foreground mb-4">What's Next?</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-3">
            <Icon name="ArrowRight" size={16} color="var(--color-accent)" className="mt-0.5" />
            <div>
              <span className="text-foreground font-medium">Share the payment link</span>
              <p className="text-muted-foreground">Send the link to your customer via email, SMS, or any messaging platform</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="ArrowRight" size={16} color="var(--color-accent)" className="mt-0.5" />
            <div>
              <span className="text-foreground font-medium">Monitor payment status</span>
              <p className="text-muted-foreground">Track payments in real-time through your dashboard or webhook notifications</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="ArrowRight" size={16} color="var(--color-accent)" className="mt-0.5" />
            <div>
              <span className="text-foreground font-medium">Receive confirmation</span>
              <p className="text-muted-foreground">Get notified when the payment is completed and confirmed on the blockchain</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSuccess;