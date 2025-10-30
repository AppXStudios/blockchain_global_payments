import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PaymentInstructions = ({ currency, paymentMethod }) => {
  const [activeStep, setActiveStep] = useState(0);

  const walletInstructions = {
    mobile: [
      {
        title: "Open Your Wallet App",
        description: `Launch your ${currency?.name} wallet application on your mobile device`,
        icon: "Smartphone"
      },
      {
        title: "Scan QR Code",
        description: "Use the wallet\'s scan feature to capture the QR code above",
        icon: "QrCode"
      },
      {
        title: "Verify Details",
        description: "Confirm the payment amount and recipient address in your wallet",
        icon: "CheckCircle"
      },
      {
        title: "Send Payment",
        description: "Complete the transaction and wait for network confirmation",
        icon: "Send"
      }
    ],
    desktop: [
      {
        title: "Copy Payment Address",
        description: "Click the copy button to copy the payment address to your clipboard",
        icon: "Copy"
      },
      {
        title: "Open Your Wallet",
        description: `Launch your ${currency?.name} wallet software or web interface`,
        icon: "Wallet"
      },
      {
        title: "Create Transaction",
        description: "Paste the address and enter the exact amount shown above",
        icon: "Edit"
      },
      {
        title: "Send Payment",
        description: "Review transaction details and broadcast to the network",
        icon: "Send"
      }
    ],
    exchange: [
      {
        title: "Login to Exchange",
        description: "Access your cryptocurrency exchange account",
        icon: "LogIn"
      },
      {
        title: "Navigate to Withdraw",
        description: `Go to the withdrawal section and select ${currency?.name}`,
        icon: "ArrowUpRight"
      },
      {
        title: "Enter Details",
        description: "Paste the payment address and specify the exact amount",
        icon: "Edit"
      },
      {
        title: "Complete Withdrawal",
        description: "Confirm the withdrawal and complete any 2FA requirements",
        icon: "Shield"
      }
    ]
  };

  const currentInstructions = walletInstructions?.[paymentMethod] || walletInstructions?.mobile;

  const networkSpecificTips = {
    Bitcoin: [
      "Bitcoin transactions may take 10-60 minutes to confirm",
      "Network fees vary based on congestion - check current rates",
      "Use SegWit addresses when possible for lower fees"
    ],
    Ethereum: [
      "Ethereum transactions typically confirm in 1-5 minutes",
      "Gas fees fluctuate - check current network conditions",
      "Ensure you have enough ETH for gas fees"
    ],
    Litecoin: [
      "Litecoin transactions usually confirm in 2-5 minutes",
      "Lower fees compared to Bitcoin",
      "Compatible with most Bitcoin wallets"
    ],
    default: [
      "Transaction times vary by network congestion",
      "Always double-check the payment address",
      "Keep transaction ID for your records"
    ]
  };

  const tips = networkSpecificTips?.[currency?.name] || networkSpecificTips?.default;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
          Payment Instructions
        </h3>
        <p className="text-sm text-muted-foreground">
          Follow these steps to complete your {currency?.name} payment
        </p>
      </div>
      {/* Payment Method Selector */}
      <div className="flex space-x-2 mb-6">
        {Object.keys(walletInstructions)?.map((method) => (
          <button
            key={method}
            onClick={() => setActiveStep(0)}
            className={`px-3 py-1 text-xs rounded-full transition-smooth capitalize ${
              paymentMethod === method
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {method} Wallet
          </button>
        ))}
      </div>
      {/* Step-by-Step Instructions */}
      <div className="space-y-4 mb-6">
        {currentInstructions?.map((step, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 p-3 rounded-lg transition-smooth cursor-pointer ${
              activeStep === index
                ? 'bg-accent/10 border border-accent/30' :'hover:bg-muted/50'
            }`}
            onClick={() => setActiveStep(index)}
          >
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
              activeStep === index
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground'
            }`}>
              <Icon name={step?.icon} size={16} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-1">{step?.title}</h4>
              <p className="text-sm text-muted-foreground">{step?.description}</p>
            </div>
            <div className={`flex-shrink-0 text-xs font-medium px-2 py-1 rounded-full ${
              activeStep === index
                ? 'bg-accent/20 text-accent' :'bg-muted text-muted-foreground'
            }`}>
              {index + 1}
            </div>
          </div>
        ))}
      </div>
      {/* Network-Specific Tips */}
      <div className="glassmorphism rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Lightbulb" size={16} color="var(--color-accent)" />
          <h4 className="font-medium text-foreground">{currency?.name} Tips</h4>
        </div>
        <ul className="space-y-2">
          {tips?.map((tip, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
              <Icon name="ArrowRight" size={12} className="mt-1 flex-shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PaymentInstructions;