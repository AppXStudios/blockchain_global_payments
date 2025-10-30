import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentHeader = ({ invoice, merchant }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/dashboard-overview');
  };

  const handleMerchantClick = () => {
    if (merchant?.website) {
      window.open(`https://${merchant?.website}`, '_blank');
    }
  };

  return (
    <header className="glassmorphism border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Back Button & Payment Info */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Icon name="CreditCard" size={16} color="white" />
              </div>
              <div>
                <h1 className="font-heading text-lg font-semibold text-foreground">
                  Secure Payment
                </h1>
                <p className="text-sm text-muted-foreground">
                  Invoice #{invoice?.id}
                </p>
              </div>
            </div>
          </div>

          {/* Right - Merchant Info */}
          <button
            onClick={handleMerchantClick}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-smooth text-left"
          >
            {merchant?.logo && (
              <img
                src={merchant?.logo}
                alt={merchant?.logoAlt || `${merchant?.name} logo`}
                className="h-10 w-10 rounded-lg object-cover border border-border"
              />
            )}
            <div>
              <div className="font-medium text-foreground">{merchant?.name}</div>
              <div className="text-sm text-muted-foreground">{merchant?.website}</div>
            </div>
            <Icon 
              name="ExternalLink" 
              size={16} 
              className="text-muted-foreground" 
            />
          </button>
        </div>

        {/* Payment Details */}
        <div className="mt-4 p-4 glassmorphism rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                ${invoice?.amount?.toFixed(2)} {invoice?.currency}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {invoice?.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Created</div>
              <div className="font-medium text-foreground">
                {new Date(invoice?.createdAt)?.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PaymentHeader;