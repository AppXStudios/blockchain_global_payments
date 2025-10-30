import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/?.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setIsSuccess(false);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
        <div className="w-full max-w-md glassmorphism border border-border rounded-xl shadow-elevation-xl">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Reset Password
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your email to receive reset instructions
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
                disabled={isLoading}
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            {isSuccess ? (
              /* Success State */
              (<div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle" size={32} color="var(--color-success)" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Check Your Email
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent password reset instructions to{' '}
                    <span className="text-foreground font-medium">{email}</span>
                  </p>
                </div>
                <Button
                  variant="default"
                  onClick={handleClose}
                  fullWidth
                  className="gradient-primary text-white"
                >
                  Done
                </Button>
              </div>)
            ) : (
              /* Form State */
              (<form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm">
                    {error}
                  </div>
                )}
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e?.target?.value);
                    setError('');
                  }}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
                <div className="flex space-x-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    fullWidth
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    fullWidth
                    loading={isLoading}
                    className="gradient-primary text-white"
                  >
                    Send Reset Link
                  </Button>
                </div>
              </form>)
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordModal;