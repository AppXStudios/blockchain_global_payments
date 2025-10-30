import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TwoFactorVerification = ({ onVerify, onCancel, payoutDetails }) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs?.current?.[0]) {
      inputRefs?.current?.[0]?.focus();
    }
  }, []);

  useEffect(() => {
    // Resend cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleCodeChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/?.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs?.current?.[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newCode?.every(digit => digit !== '') && newCode?.join('')?.length === 6) {
      handleVerify(newCode?.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e?.key === 'Backspace' && !verificationCode?.[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs?.current?.[index - 1]?.focus();
    } else if (e?.key === 'ArrowLeft' && index > 0) {
      inputRefs?.current?.[index - 1]?.focus();
    } else if (e?.key === 'ArrowRight' && index < 5) {
      inputRefs?.current?.[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e?.preventDefault();
    const pastedData = e?.clipboardData?.getData('text')?.replace(/\D/g, '')?.slice(0, 6);
    
    if (pastedData?.length === 6) {
      const newCode = pastedData?.split('');
      setVerificationCode(newCode);
      setError('');
      
      // Focus last input
      inputRefs?.current?.[5]?.focus();
      
      // Auto-submit
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (code) => {
    setIsVerifying(true);
    setError('');

    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock verification - accept "123456" as valid code
      if (code === '123456') {
        onVerify(code);
      } else {
        setError('Invalid verification code. Please try again.');
        setVerificationCode(['', '', '', '', '', '']);
        inputRefs?.current?.[0]?.focus();
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = () => {
    setResendCooldown(60);
    setError('');
    setVerificationCode(['', '', '', '', '', '']);
    inputRefs?.current?.[0]?.focus();
    
    // Here you would typically call an API to resend the code
    console.log('Resending verification code...');
  };

  const handleManualVerify = () => {
    const code = verificationCode?.join('');
    if (code?.length === 6) {
      handleVerify(code);
    }
  };

  return (
    <div className="glassmorphism rounded-lg border border-border p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
          <Icon name="Shield" size={32} color="var(--color-accent)" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Two-Factor Authentication
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code from your authenticator app to confirm this payout
        </p>
      </div>
      {/* Payout Summary */}
      <div className="glassmorphism rounded-lg p-4 mb-6 border border-border">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">Withdrawing</div>
          <div className="text-lg font-semibold text-foreground">
            {payoutDetails?.amount} {payoutDetails?.currency?.toUpperCase()}
          </div>
          <div className="text-xs text-muted-foreground font-mono mt-1">
            To: {payoutDetails?.destinationAddress?.slice(0, 12)}...{payoutDetails?.destinationAddress?.slice(-8)}
          </div>
        </div>
      </div>
      {/* Verification Code Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3 text-center">
          Verification Code
        </label>
        <div className="flex justify-center space-x-2 mb-4">
          {verificationCode?.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleCodeChange(index, e?.target?.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`w-12 h-12 text-center text-lg font-semibold bg-input border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth ${
                error ? 'border-error' : 'border-border'
              }`}
              disabled={isVerifying}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center justify-center space-x-2 text-sm text-error mb-4">
            <Icon name="AlertCircle" size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Resend Code */}
        <div className="text-center">
          <button
            onClick={handleResendCode}
            disabled={resendCooldown > 0}
            className="text-sm text-accent hover:text-accent/80 transition-smooth disabled:text-muted-foreground disabled:cursor-not-allowed"
          >
            {resendCooldown > 0 
              ? `Resend code in ${resendCooldown}s` 
              : 'Resend verification code'
            }
          </button>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleManualVerify}
          disabled={verificationCode?.join('')?.length !== 6 || isVerifying}
          loading={isVerifying}
          fullWidth
          className="gradient-primary text-white"
        >
          {isVerifying ? 'Verifying...' : 'Verify & Confirm Payout'}
        </Button>
        
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isVerifying}
          fullWidth
        >
          Cancel
        </Button>
      </div>
      {/* Security Notice */}
      <div className="mt-6 p-3 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} color="var(--color-accent)" className="mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Security Notice</p>
            <p>
              This verification step helps protect your account from unauthorized withdrawals. 
              Never share your 2FA codes with anyone.
            </p>
          </div>
        </div>
      </div>
      {/* Mock Credentials Helper */}
      <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/30">
        <div className="flex items-start space-x-2">
          <Icon name="Key" size={16} color="var(--color-accent)" className="mt-0.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-medium text-accent mb-1">Demo Mode</p>
            <p className="text-muted-foreground">
              Use verification code: <span className="font-mono font-medium text-accent">123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorVerification;