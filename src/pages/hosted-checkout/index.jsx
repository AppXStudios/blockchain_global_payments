import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaymentHeader from './components/PaymentHeader';
import CurrencySelector from './components/CurrencySelector';
import PaymentTimer from './components/PaymentTimer';
import QRCodeDisplay from './components/QRCodeDisplay';
import PaymentInstructions from './components/PaymentInstructions';
import PaymentStatus from './components/PaymentStatus';

const HostedCheckout = () => {
  const [searchParams] = useSearchParams();
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('waiting');
  const [paymentAddress, setPaymentAddress] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [transactionId, setTransactionId] = useState('');
  const [confirmations, setConfirmations] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('mobile');
  const [sessionExpiry, setSessionExpiry] = useState(null);

  // Mock invoice data
  const mockInvoice = {
    id: "INV-2024-001234",
    amount: 250.00,
    description: "Premium Subscription - Annual Plan\nAccess to all features and priority support",
    currency: "USD",
    createdAt: new Date()?.toISOString(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000)?.toISOString() // 15 minutes from now
  };

  // Mock merchant data
  const mockMerchant = {
    id: "merchant_123",
    name: "TechFlow Solutions",
    website: "techflow.com",
    logo: "https://images.unsplash.com/photo-1711509424072-70600119ab46",
    logoAlt: "TechFlow Solutions logo featuring modern geometric design in blue and white"
  };

  // Mock cryptocurrency data
  const mockCurrencies = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    network: "Bitcoin",
    networkFee: "2.50",
    confirmations: "2 blocks (~20 min)",
    icon: "https://images.unsplash.com/photo-1579623261984-41f9a81d4044",
    iconAlt: "Bitcoin orange circular logo with white B symbol"
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    network: "Ethereum",
    networkFee: "1.80",
    confirmations: "12 blocks (~3 min)",
    icon: "https://images.unsplash.com/photo-1666092109883-4b1f221ffa58",
    iconAlt: "Ethereum diamond-shaped logo in blue and purple gradient"
  },
  {
    symbol: "LTC",
    name: "Litecoin",
    network: "Litecoin",
    networkFee: "0.25",
    confirmations: "6 blocks (~15 min)",
    icon: "https://images.unsplash.com/photo-1644926054948-8c1155eeb0e1",
    iconAlt: "Litecoin silver circular logo with white L symbol"
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    network: "Ethereum (ERC-20)",
    networkFee: "1.50",
    confirmations: "12 blocks (~3 min)",
    icon: "https://images.unsplash.com/photo-1684222373369-006e7e5ad3a6",
    iconAlt: "Tether green circular logo with white T symbol"
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    network: "Ethereum (ERC-20)",
    networkFee: "1.50",
    confirmations: "12 blocks (~3 min)",
    icon: "https://images.unsplash.com/photo-1642465599822-f8c8caa350d8",
    iconAlt: "USD Coin blue circular logo with white dollar symbol"
  },
  {
    symbol: "ADA",
    name: "Cardano",
    network: "Cardano",
    networkFee: "0.17",
    confirmations: "15 blocks (~8 min)",
    icon: "https://images.unsplash.com/photo-1696950984481-779fd52d01a2",
    iconAlt: "Cardano blue circular logo with white geometric symbol"
  }];


  // Mock exchange rates (USD per crypto unit)
  const mockExchangeRates = {
    BTC: 43250.00,
    ETH: 2680.50,
    LTC: 72.30,
    USDT: 1.00,
    USDC: 1.00,
    ADA: 0.38
  };

  // Mock payment addresses
  const mockAddresses = {
    BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    ETH: "0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF",
    LTC: "ltc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
    USDT: "0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF",
    USDC: "0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF",
    ADA: "addr1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlhvdsm3c4t6c4d"
  };

  useEffect(() => {
    // Initialize session expiry
    setSessionExpiry(new Date(Date.now() + 15 * 60 * 1000));

    // Auto-select first currency if none selected
    if (!selectedCurrency && mockCurrencies?.length > 0) {
      handleCurrencySelect(mockCurrencies?.[0]);
    }

    // Simulate payment status polling
    const statusInterval = setInterval(() => {
      if (paymentStatus === 'pending') {
        // Simulate random progression
        const random = Math.random();
        if (random > 0.7) {
          setPaymentStatus('confirming');
          setTransactionId('0x1234567890abcdef1234567890abcdef12345678');
          setConfirmations(1);
        }
      } else if (paymentStatus === 'confirming') {
        setConfirmations((prev) => {
          const newConfirmations = Math.min(prev + 1, 12);
          if (newConfirmations >= 12) {
            setPaymentStatus('confirmed');
          }
          return newConfirmations;
        });
      }
    }, 5000);

    return () => clearInterval(statusInterval);
  }, [paymentStatus, selectedCurrency]);

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    const rate = mockExchangeRates?.[currency?.symbol];
    const amount = (mockInvoice?.amount / rate)?.toFixed(8);
    setCryptoAmount(parseFloat(amount));
    setPaymentAddress(mockAddresses?.[currency?.symbol]);
    setPaymentStatus('waiting');
    setTransactionId('');
    setConfirmations(0);
  };

  const handleSessionExpired = () => {
    setPaymentStatus('expired');
  };

  const handleRefreshSession = () => {
    setSessionExpiry(new Date(Date.now() + 15 * 60 * 1000));
    setPaymentStatus('waiting');
    setTransactionId('');
    setConfirmations(0);
  };

  const handleCopyAddress = () => {
    // Simulate payment detection after address copy
    setTimeout(() => {
      if (paymentStatus === 'waiting') {
        setPaymentStatus('pending');
      }
    }, 3000);
  };

  const handleRetryPayment = () => {
    setPaymentStatus('waiting');
    setTransactionId('');
    setConfirmations(0);
    handleRefreshSession();
  };

  // Detect mobile device
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i?.test(navigator.userAgent);
    setPaymentMethod(isMobile ? 'mobile' : 'desktop');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PaymentHeader invoice={mockInvoice} merchant={mockMerchant} />
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Payment Setup */}
          <div className="space-y-6">
            {/* Payment Timer */}
            {sessionExpiry &&
            <PaymentTimer
              expiresAt={sessionExpiry}
              onExpired={handleSessionExpired}
              onRefresh={handleRefreshSession} />

            }

            {/* Currency Selection */}
            {paymentStatus !== 'confirmed' && paymentStatus !== 'failed' &&
            <CurrencySelector
              currencies={mockCurrencies}
              selectedCurrency={selectedCurrency}
              onCurrencySelect={handleCurrencySelect}
              exchangeRates={mockExchangeRates} />

            }

            {/* Payment Instructions */}
            {selectedCurrency && paymentStatus === 'waiting' &&
            <PaymentInstructions
              currency={selectedCurrency}
              paymentMethod={paymentMethod} />

            }
          </div>

          {/* Right Column - Payment Execution */}
          <div className="space-y-6">
            {/* QR Code & Address */}
            {selectedCurrency && paymentAddress && (paymentStatus === 'waiting' || paymentStatus === 'pending') &&
            <QRCodeDisplay
              paymentAddress={paymentAddress}
              amount={cryptoAmount}
              currency={selectedCurrency}
              onCopyAddress={handleCopyAddress} />

            }

            {/* Payment Status */}
            <PaymentStatus
              status={paymentStatus}
              transactionId={transactionId}
              confirmations={confirmations}
              requiredConfirmations={12}
              onRetry={handleRetryPayment}
              successUrl={searchParams?.get('success_url') || 'https://techflow.com/success'}
              failureUrl={searchParams?.get('cancel_url') || 'https://techflow.com/cancel'} />

          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="glassmorphism rounded-lg p-6 max-w-2xl mx-auto">
            <h4 className="font-heading text-lg font-semibold text-foreground mb-3">
              Secure Crypto Payments
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Your payment is processed securely through Blockchain Global Payments. 
              We support 300+ cryptocurrencies across 180+ countries with enterprise-grade security.
            </p>
            <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-success rounded-full"></span>
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-success rounded-full"></span>
                <span>PCI Compliant</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-success rounded-full"></span>
                <span>24/7 Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default HostedCheckout;