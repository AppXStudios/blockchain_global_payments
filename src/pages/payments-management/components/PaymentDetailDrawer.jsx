import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PaymentDetailDrawer = ({ payment, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !payment) return null;

  const handleDownloadReceipt = async () => {
    setIsLoading(true);
    try {
      // Simulate download functionality
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a blob with receipt content
      const receiptContent = `
        PAYMENT RECEIPT
        ================
        Payment ID: ${payment?.id || 'N/A'}
        Amount: ${payment?.amount || '0'} ${payment?.currency || 'USD'}
        Status: ${payment?.status || 'Unknown'}
        Date: ${payment?.createdAt ? new Date(payment.createdAt)?.toLocaleString() : 'N/A'}
        Customer: ${payment?.customer?.email || 'Anonymous'}
        
        Thank you for your payment!
      `;
      
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${payment?.id || 'unknown'}.txt`;
      document.body?.appendChild(a);
      a?.click();
      document.body?.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading receipt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCheckout = () => {
    if (payment?.checkoutUrl) {
      window.open(payment?.checkoutUrl, '_blank');
    } else {
      // Navigate to hosted checkout with payment details
      navigate('/hosted-checkout', { state: { paymentId: payment?.id } });
    }
  };

  const handleRefundPayment = () => {
    // Navigate to refund page or open refund modal
    navigate('/payments-management', { 
      state: { 
        action: 'refund', 
        paymentId: payment?.id 
      } 
    });
    onClose?.();
  };

  const handleViewCustomer = () => {
    // Navigate to customer management or details
    navigate('/merchant-settings', { 
      state: { 
        tab: 'customers', 
        customerId: payment?.customer?.id 
      } 
    });
    onClose?.();
  };

  const handleCreateInvoice = () => {
    // Navigate to invoice creation with pre-filled data
    navigate('/invoice-creation', { 
      state: { 
        customer: payment?.customer,
        amount: payment?.amount,
        currency: payment?.currency
      } 
    });
    onClose?.();
  };

  const handleViewTransactionHistory = () => {
    // Navigate to transaction history filtered by this customer
    navigate('/payments-management', { 
      state: { 
        filter: 'customer', 
        customerId: payment?.customer?.id 
      } 
    });
    onClose?.();
  };

  const handleContactCustomer = () => {
    if (payment?.customer?.email) {
      window.location.href = `mailto:${payment?.customer?.email}?subject=Regarding Payment ${payment?.id}`;
    } else {
      // Navigate to contact management
      navigate('/contact');
    }
  };

  const handleViewDashboard = () => {
    navigate('/dashboard-overview');
    onClose?.();
  };

  const handleViewBlockchainExplorer = () => {
    if (payment?.txHash) {
      const explorerUrl = `https://btc.com/search/${payment?.txHash}`;
      window.open(explorerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleViewApiKeys = () => {
    navigate('/api-keys-management');
    onClose?.();
  };

  const handleViewWebhooks = () => {
    navigate('/webhook-management');
    onClose?.();
  };

  const handleViewPayouts = () => {
    navigate('/payout-management');
    onClose?.();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 glassmorphism border-l border-border shadow-2xl overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Payment Details</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-smooth"
            >
              <Icon name="X" size={20} color="currentColor" />
            </button>
          </div>

          {/* Payment Info */}
          <div className="space-y-6">
            <div className="glassmorphism p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Payment ID</span>
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded cursor-pointer hover:bg-muted/80 transition-smooth"
                      onClick={() => navigator.clipboard?.writeText(payment?.id || '')}>
                  {payment?.id || 'N/A'}
                </code>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-lg font-semibold text-foreground">
                  {payment?.amount || '0'} {payment?.currency || 'USD'}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  payment?.status === 'completed' 
                    ? 'bg-success/10 text-success' 
                    : payment?.status === 'pending' ?'bg-warning/10 text-warning' :'bg-error/10 text-error'
                }`}>
                  {payment?.status || 'Unknown'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm text-foreground">
                  {payment?.createdAt ? new Date(payment.createdAt)?.toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            {payment?.customer && (
              <div className="glassmorphism p-4 rounded-xl border border-border">
                <h3 className="font-medium text-foreground mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <button
                      onClick={() => navigator.clipboard?.writeText(payment?.customer?.email || '')}
                      className="text-sm text-foreground hover:text-accent transition-smooth cursor-pointer"
                    >
                      {payment?.customer?.email || 'N/A'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="text-sm text-foreground">
                      {payment?.customer?.name || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction Details */}
            <div className="glassmorphism p-4 rounded-xl border border-border">
              <h3 className="font-medium text-foreground mb-3">Transaction Details</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Method</span>
                  <span className="text-sm text-foreground">
                    {payment?.paymentMethod || 'Cryptocurrency'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Network Fee</span>
                  <span className="text-sm text-foreground">
                    {payment?.networkFee || '0.001'} {payment?.paymentCurrency || 'BTC'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Confirmation</span>
                  <span className="text-sm text-foreground">
                    {payment?.confirmations || '6'}/6
                  </span>
                </div>
                {payment?.txHash && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tx Hash</span>
                    <button
                      onClick={handleViewBlockchainExplorer}
                      className="text-sm text-accent hover:text-accent/80 transition-smooth flex items-center space-x-1"
                    >
                      <span className="font-mono">{payment?.txHash?.substring(0, 8)}...</span>
                      <Icon name="ExternalLink" size={12} color="currentColor" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Primary Actions */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadReceipt}
                  iconName="Download"
                  iconPosition="left"
                  isLoading={isLoading}
                  fullWidth
                >
                  Receipt
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewCheckout}
                  iconName="ExternalLink"
                  iconPosition="left"
                  fullWidth
                >
                  View Page
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefundPayment}
                  iconName="RotateCcw"
                  iconPosition="left"
                  fullWidth
                >
                  Refund
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewCustomer}
                  iconName="User"
                  iconPosition="left"
                  fullWidth
                >
                  Customer
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCreateInvoice}
                  iconName="FileText"
                  iconPosition="left"
                  fullWidth
                >
                  New Invoice
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewTransactionHistory}
                  iconName="History"
                  iconPosition="left"
                  fullWidth
                >
                  History
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleContactCustomer}
                  iconName="Mail"
                  iconPosition="left"
                  fullWidth
                >
                  Contact
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewDashboard}
                  iconName="BarChart3"
                  iconPosition="left"
                  fullWidth
                >
                  Dashboard
                </Button>
              </div>

              {/* Additional Quick Actions */}
              <div className="pt-4 border-t border-border space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewApiKeys}
                    iconName="Key"
                    iconPosition="left"
                    className="text-xs"
                  >
                    API Keys
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewWebhooks}
                    iconName="Webhook"
                    iconPosition="left"
                    className="text-xs"
                  >
                    Webhooks
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewPayouts}
                    iconName="ArrowUpRight"
                    iconPosition="left"
                    className="text-xs"
                  >
                    Payouts
                  </Button>
                </div>
              </div>

              <Button
                variant="default"
                size="sm"
                onClick={onClose}
                iconName="ArrowLeft"
                iconPosition="left"
                fullWidth
                className="mt-4"
              >
                Back to Payments
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentDetailDrawer;