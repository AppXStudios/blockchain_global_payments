import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PayoutWalletStep = ({ data, onUpdate, onNext, onPrevious }) => {
  const [formData, setFormData] = useState({
    wallets: data?.wallets || [{ currency: '', address: '', isVerified: false }],
    ...data
  });

  const [errors, setErrors] = useState({});
  const [verifyingWallet, setVerifyingWallet] = useState(null);

  const supportedCurrencies = [
    { value: 'btc', label: 'Bitcoin (BTC)', format: 'Legacy/SegWit/Bech32' },
    { value: 'eth', label: 'Ethereum (ETH)', format: '0x...' },
    { value: 'usdt', label: 'Tether (USDT)', format: 'ERC-20/TRC-20' },
    { value: 'usdc', label: 'USD Coin (USDC)', format: 'ERC-20' },
    { value: 'ltc', label: 'Litecoin (LTC)', format: 'Legacy/SegWit' },
    { value: 'ada', label: 'Cardano (ADA)', format: 'addr1...' },
    { value: 'dot', label: 'Polkadot (DOT)', format: '1...' },
    { value: 'matic', label: 'Polygon (MATIC)', format: '0x...' }
  ];

  const handleWalletChange = (index, field, value) => {
    const updatedWallets = [...formData?.wallets];
    updatedWallets[index] = { ...updatedWallets?.[index], [field]: value };
    
    if (field === 'currency') {
      updatedWallets[index].address = '';
      updatedWallets[index].isVerified = false;
    }
    
    setFormData(prev => ({ ...prev, wallets: updatedWallets }));
    
    // Clear errors for this wallet
    const errorKey = `wallet_${index}_${field}`;
    if (errors?.[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addWallet = () => {
    setFormData(prev => ({
      ...prev,
      wallets: [...prev?.wallets, { currency: '', address: '', isVerified: false }]
    }));
  };

  const removeWallet = (index) => {
    if (formData?.wallets?.length > 1) {
      const updatedWallets = formData?.wallets?.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, wallets: updatedWallets }));
    }
  };

  const validateWalletAddress = (currency, address) => {
    const patterns = {
      btc: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
      eth: /^0x[a-fA-F0-9]{40}$/,
      usdt: /^0x[a-fA-F0-9]{40}$|^T[A-Za-z1-9]{33}$/,
      usdc: /^0x[a-fA-F0-9]{40}$/,
      ltc: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$|^ltc1[a-z0-9]{39,59}$/,
      ada: /^addr1[a-z0-9]{98}$/,
      dot: /^1[a-zA-Z0-9]{47}$/,
      matic: /^0x[a-fA-F0-9]{40}$/
    };

    return patterns?.[currency]?.test(address) || false;
  };

  const verifyWallet = async (index) => {
    const wallet = formData?.wallets?.[index];
    
    if (!wallet?.currency || !wallet?.address) {
      setErrors(prev => ({
        ...prev,
        [`wallet_${index}_address`]: 'Please select currency and enter address'
      }));
      return;
    }

    if (!validateWalletAddress(wallet?.currency, wallet?.address)) {
      setErrors(prev => ({
        ...prev,
        [`wallet_${index}_address`]: 'Invalid wallet address format'
      }));
      return;
    }

    setVerifyingWallet(index);
    
    // Simulate verification process
    setTimeout(() => {
      const isValid = Math.random() > 0.2; // 80% success rate for demo
      
      const updatedWallets = [...formData?.wallets];
      updatedWallets[index] = { ...updatedWallets?.[index], isVerified: isValid };
      
      setFormData(prev => ({ ...prev, wallets: updatedWallets }));
      
      if (!isValid) {
        setErrors(prev => ({
          ...prev,
          [`wallet_${index}_address`]: 'Wallet verification failed. Please check the address.'
        }));
      }
      
      setVerifyingWallet(null);
    }, 2000);
  };

  const validateForm = () => {
    const newErrors = {};
    let hasValidWallet = false;

    formData?.wallets?.forEach((wallet, index) => {
      if (wallet?.currency && wallet?.address) {
        if (!validateWalletAddress(wallet?.currency, wallet?.address)) {
          newErrors[`wallet_${index}_address`] = 'Invalid wallet address format';
        } else if (wallet?.isVerified) {
          hasValidWallet = true;
        }
      }
    });

    if (!hasValidWallet) {
      newErrors.general = 'At least one verified wallet is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onUpdate(formData);
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
          Payout Wallet Configuration
        </h2>
        <p className="text-muted-foreground">
          Configure your cryptocurrency wallets to receive payouts from customer payments.
        </p>
      </div>
      <div className="space-y-6">
        {formData?.wallets?.map((wallet, index) => (
          <div key={index} className="glassmorphism rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-foreground">
                Wallet {index + 1}
              </h3>
              {formData?.wallets?.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWallet(index)}
                  iconName="Trash2"
                  className="text-error hover:text-error"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Cryptocurrency"
                placeholder="Select currency"
                options={supportedCurrencies}
                value={wallet?.currency}
                onChange={(value) => handleWalletChange(index, 'currency', value)}
                error={errors?.[`wallet_${index}_currency`]}
                required
                searchable
              />

              <div className="relative">
                <Input
                  label="Wallet Address"
                  type="text"
                  placeholder={
                    wallet?.currency 
                      ? `Enter ${supportedCurrencies?.find(c => c?.value === wallet?.currency)?.format || 'wallet address'}`
                      : 'Select currency first'
                  }
                  value={wallet?.address}
                  onChange={(e) => handleWalletChange(index, 'address', e?.target?.value)}
                  error={errors?.[`wallet_${index}_address`]}
                  disabled={!wallet?.currency}
                  required
                />
                
                {wallet?.isVerified && (
                  <div className="absolute right-3 top-8 flex items-center">
                    <Icon name="CheckCircle" size={20} color="var(--color-success)" />
                  </div>
                )}
              </div>
            </div>

            {wallet?.currency && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={16} color="var(--color-accent)" className="mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <strong>Format:</strong> {supportedCurrencies?.find(c => c?.value === wallet?.currency)?.format}
                    <br />
                    <strong>Network:</strong> Ensure your wallet supports the correct network for this currency.
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => verifyWallet(index)}
                loading={verifyingWallet === index}
                disabled={!wallet?.currency || !wallet?.address || wallet?.isVerified}
                iconName={wallet?.isVerified ? "CheckCircle" : "Shield"}
                iconPosition="left"
              >
                {wallet?.isVerified 
                  ? 'Verified' 
                  : verifyingWallet === index 
                    ? 'Verifying...' 
                    : 'Verify Wallet'
                }
              </Button>
            </div>
          </div>
        ))}

        {errors?.general && (
          <div className="glassmorphism rounded-lg p-4 border border-error/30 bg-error/10">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={20} color="var(--color-error)" />
              <span className="text-sm text-error">{errors?.general}</span>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={addWallet}
            iconName="Plus"
            iconPosition="left"
            disabled={formData?.wallets?.length >= 5}
          >
            Add Another Wallet
          </Button>
        </div>

        {/* Test Transaction Info */}
        <div className="glassmorphism rounded-lg p-6 border border-accent/30 bg-accent/10">
          <div className="flex items-start space-x-3">
            <Icon name="Zap" size={24} color="var(--color-accent)" />
            <div className="flex-1">
              <h4 className="font-medium text-accent mb-1">
                Test Transaction Available
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                After verification, we can send a small test transaction to confirm your wallet is working correctly.
                This helps ensure smooth payouts when you start processing payments.
              </p>
              <Button
                variant="outline"
                size="sm"
                iconName="Send"
                iconPosition="left"
                disabled={!formData?.wallets?.some(w => w?.isVerified)}
              >
                Request Test Transaction
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          iconName="ChevronLeft"
          iconPosition="left"
        >
          Previous
        </Button>
        <Button
          variant="default"
          onClick={handleNext}
          className="gradient-primary text-white"
          iconName="ChevronRight"
          iconPosition="right"
        >
          Continue to Logo Upload
        </Button>
      </div>
    </div>
  );
};

export default PayoutWalletStep;