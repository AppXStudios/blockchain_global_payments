import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import payoutsService from '../../services/payoutsService';
import PayoutHistoryTable from './components/PayoutHistoryTable';
import CreatePayoutForm from './components/CreatePayoutForm';
import TwoFactorVerification from './components/TwoFactorVerification';
import PayoutStatusTracker from './components/PayoutStatusTracker';
import BatchPayoutManager from './components/BatchPayoutManager';
import SecurityAuditPanel from './components/SecurityAuditPanel';

const PayoutManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('history');
  const [payouts, setPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBatchManager, setShowBatchManager] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [pendingPayoutData, setPendingPayoutData] = useState(null);
  const [availableBalance, setAvailableBalance] = useState({});

  // Load payouts from Supabase
  const loadPayouts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: payoutsError } = await payoutsService?.getPayouts();

      if (payoutsError) {
        throw new Error(payoutsError?.message || 'Failed to load payouts');
      }

      const formattedPayouts = data?.map(payout => ({
        id: payout?.id,
        payoutId: payout?.payout_id,
        amount: payout?.amount?.toString(),
        currency: payout?.currency?.toLowerCase(),
        destinationAddress: payout?.destination_address,
        addressLabel: payout?.metadata?.address_label || 'Wallet Address',
        status: payout?.status,
        fiatAmount: payout?.metadata?.fiat_amount || '0.00',
        networkFee: payout?.fee_amount?.toString() || '0',
        transactionId: payout?.tx_hash || null,
        createdAt: payout?.created_at,
        completedAt: payout?.completed_at || null,
        confirmedAt: payout?.confirmed_at || null,
        processedAt: payout?.processed_at || null,
        failureReason: payout?.failed_reason || null,
        confirmationCode: payout?.confirmation_code || null,
        network: payout?.network || 'mainnet',
        destinationTag: payout?.destination_tag || null,
        requiresConfirmation: payout?.requires_confirmation || false,
        timestamps: {
          created: payout?.created_at,
          verification: payout?.confirmed_at,
          processing: payout?.processed_at,
          blockchain: payout?.tx_hash ? payout?.updated_at : null,
          confirmation: payout?.confirmed_at,
          completed: payout?.completed_at,
          failed: payout?.status === 'failed' ? payout?.updated_at : null
        }
      })) || [];

      setPayouts(formattedPayouts);

      // Load available balance
      await loadAvailableBalance();

    } catch (error) {
      console.error('Error loading payouts:', error);
      setError(error?.message || 'Failed to load payouts. Please try again.');
      setPayouts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load available balance for payouts
  const loadAvailableBalance = async () => {
    try {
      const { data: balance, error: balanceError } = await payoutsService?.getAvailableBalance();

      if (balanceError) {
        console.error('Error loading balance:', balanceError);
        return;
      }

      // Set available balance or use default values
      setAvailableBalance(balance || {
        btc: "0.00000",
        eth: "0.00000",
        usdt: "0.00",
        usdc: "0.00",
        ltc: "0.00000",
        xrp: "0.00"
      });
    } catch (error) {
      console.error('Error loading available balance:', error);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadPayouts();
    } else if (!authLoading && !user) {
      setIsLoading(false);
      setError('Please sign in to view payouts');
    }
  }, [authLoading, user]);

  const tabs = [
    { id: 'history', label: 'Payout History', icon: 'History' },
    { id: 'create', label: 'Create Payout', icon: 'Plus' },
    { id: 'batch', label: 'Batch Payouts', icon: 'Layers' },
    { id: 'security', label: 'Security & Audit', icon: 'Shield' }
  ];

  const handleCreatePayout = async (payoutData) => {
    try {
      setPendingPayoutData(payoutData);
      
      // For high-value payouts, require 2FA
      if (parseFloat(payoutData?.amount) >= 1000) {
        setShow2FA(true);
        setShowCreateForm(false);
      } else {
        await processPayoutCreation(payoutData);
      }
    } catch (error) {
      setError('Failed to initiate payout creation: ' + error?.message);
    }
  };

  const processPayoutCreation = async (payoutData) => {
    try {
      const { data: newPayout, error: createError } = await payoutsService?.createPayout({
        amount: parseFloat(payoutData?.amount),
        currency: payoutData?.currency?.toLowerCase(),
        destination_address: payoutData?.destinationAddress,
        destination_tag: payoutData?.destinationTag || null,
        network: payoutData?.network || 'mainnet',
        metadata: {
          address_label: payoutData?.addressLabel || 'Payout Address',
          fiat_amount: payoutData?.fiatAmount || '0.00',
          description: payoutData?.description || 'Cryptocurrency payout'
        }
      });

      if (createError) {
        throw new Error(createError?.message || 'Failed to create payout');
      }

      // Refresh payouts list
      await loadPayouts();
      
      setShow2FA(false);
      setPendingPayoutData(null);
      setActiveTab('history');
      
      // Show success message
      alert('Payout created successfully and is now processing!');

    } catch (error) {
      setError('Failed to create payout: ' + error?.message);
      setShow2FA(false);
      setPendingPayoutData(null);
    }
  };

  const handleCreateBatchPayout = async (batchData) => {
    try {
      setIsLoading(true);

      // Create multiple payouts from batch data
      const batchResults = await Promise.allSettled(
        batchData?.payouts?.map(async (payoutData) => {
          return await payoutsService?.createPayout({
            amount: parseFloat(payoutData?.amount),
            currency: payoutData?.currency?.toLowerCase(),
            destination_address: payoutData?.address,
            metadata: {
              address_label: payoutData?.label || 'Batch Payout',
              batch_id: `batch_${Date.now()}`,
              description: `Batch payout - ${batchData?.name || 'Unnamed batch'}`
            }
          });
        })
      );

      const successful = batchResults?.filter(result => result?.status === 'fulfilled')?.length;
      const failed = batchResults?.filter(result => result?.status === 'rejected')?.length;

      if (successful > 0) {
        alert(`Batch payout created! ${successful} successful, ${failed} failed`);
      } else {
        throw new Error('All batch payouts failed');
      }

      // Refresh payouts list
      await loadPayouts();
      setShowBatchManager(false);
      setActiveTab('history');

    } catch (error) {
      setError('Failed to create batch payout: ' + error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerification = async (code) => {
    if (pendingPayoutData && code) {
      await processPayoutCreation(pendingPayoutData);
    }
  };

  const handleViewPayoutDetails = (payout) => {
    setSelectedPayout(payout);
  };

  const handleRetryPayout = async (payout) => {
    try {
      const { error: retryError } = await payoutsService?.retryPayout(payout?.id);

      if (retryError) {
        throw new Error(retryError?.message || 'Failed to retry payout');
      }

      alert('Payout retry initiated successfully');
      await loadPayouts(); // Refresh the list
    } catch (error) {
      setError('Failed to retry payout: ' + error?.message);
    }
  };

  const handleCancelPayout = async (payout) => {
    try {
      const { error: cancelError } = await payoutsService?.cancelPayout(payout?.id);

      if (cancelError) {
        throw new Error(cancelError?.message || 'Failed to cancel payout');
      }

      alert('Payout cancelled successfully');
      await loadPayouts(); // Refresh the list
    } catch (error) {
      setError('Failed to cancel payout: ' + error?.message);
    }
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'history':
        return (
          <PayoutHistoryTable
            payouts={payouts}
            onViewDetails={handleViewPayoutDetails}
            onRetryPayout={handleRetryPayout}
            onCancelPayout={handleCancelPayout}
            loading={isLoading}
          />
        );
      case 'create':
        return (
          <CreatePayoutForm
            onCreatePayout={handleCreatePayout}
            availableBalance={availableBalance}
            onClose={() => setActiveTab('history')}
          />
        );
      case 'batch':
        return (
          <BatchPayoutManager
            onCreateBatchPayout={handleCreateBatchPayout}
            onClose={() => setActiveTab('history')}
            availableBalance={availableBalance}
          />
        );
      case 'security':
        return <SecurityAuditPanel payouts={payouts} />;
      default:
        return null;
    }
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payout management...</p>
        </div>
      </div>
    );
  }

  // Show error state for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🔒</div>
          <p className="text-foreground text-lg mb-2">Authentication Required</p>
          <p className="text-muted-foreground">Please sign in to manage payouts</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payout Management - Blockchain Global Payments</title>
        <meta name="description" content="Secure cryptocurrency payout management with multi-signature authorization, batch processing, and comprehensive audit trails." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Payout Management</h1>
                <p className="text-muted-foreground mt-1">
                  Create and track cryptocurrency withdrawals with enhanced security
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => loadPayouts()}
                  iconName="RefreshCw"
                  loading={isLoading}
                >
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowBatchManager(true)}
                  iconName="Layers"
                >
                  Batch Payouts
                </Button>
                <Button
                  variant="default"
                  onClick={() => setShowCreateForm(true)}
                  iconName="Plus"
                  className="gradient-primary text-white"
                >
                  Create Payout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <Icon name="AlertCircle" size={20} className="text-red-500 mr-3" />
              <div>
                <p className="text-red-700 font-medium">Error</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setError(null)}
                className="ml-auto"
                iconName="X"
              />
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-border bg-card">
          <div className="px-6">
            <nav className="flex space-x-8">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-smooth ${
                    activeTab === tab?.id
                      ? 'border-accent text-accent' :'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span className="font-medium">{tab?.label}</span>
                  {tab?.id === 'history' && payouts?.filter(p => p?.status === 'pending')?.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {payouts?.filter(p => p?.status === 'pending')?.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {isLoading && activeTab === 'history' ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted/20 rounded w-1/4"></div>
              <div className="h-64 bg-muted/20 rounded"></div>
            </div>
          ) : (
            getTabContent()
          )}
        </div>

        {/* Modals */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
              <CreatePayoutForm
                onCreatePayout={handleCreatePayout}
                availableBalance={availableBalance}
                onClose={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        )}

        {showBatchManager && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto m-4">
              <BatchPayoutManager
                onCreateBatchPayout={handleCreateBatchPayout}
                onClose={() => setShowBatchManager(false)}
                availableBalance={availableBalance}
              />
            </div>
          </div>
        )}

        {show2FA && pendingPayoutData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="m-4">
              <TwoFactorVerification
                onVerify={handle2FAVerification}
                onCancel={() => {
                  setShow2FA(false);
                  setPendingPayoutData(null);
                }}
                payoutDetails={pendingPayoutData}
              />
            </div>
          </div>
        )}

        {selectedPayout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
              <div className="glassmorphism rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Payout Details
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPayout(null)}
                    iconName="X"
                  />
                </div>
                <PayoutStatusTracker payout={selectedPayout} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PayoutManagement;