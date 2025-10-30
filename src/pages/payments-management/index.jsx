import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import paymentsService from '../../services/paymentsService';
import PaymentFilters from './components/PaymentFilters';
import PaymentTable from './components/PaymentTable';
import PaymentDetailDrawer from './components/PaymentDetailDrawer';
import PaymentMobileCard from './components/PaymentMobileCard';

const PaymentsManagement = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load payments from Supabase
  const loadPayments = async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: paymentsError } = await paymentsService?.getPayments({
        ...filters,
        limit: 100 // Load more records for filtering
      });

      if (paymentsError) {
        throw new Error(paymentsError?.message || 'Failed to load payments');
      }

      const formattedPayments = data?.map(payment => ({
        id: payment?.id,
        paymentId: payment?.payment_id,
        usdAmount: payment?.amount_fiat?.toLocaleString('en-US', { minimumFractionDigits: 2 }),
        cryptoAmount: payment?.amount_crypto?.toString() || '0',
        currency: payment?.currency_crypto?.toUpperCase() || payment?.currency_fiat?.toUpperCase(),
        status: payment?.status,
        customerName: payment?.metadata?.customer_name || 'N/A',
        customerEmail: payment?.metadata?.customer_email || 'N/A',
        ipAddress: payment?.metadata?.ip_address || 'N/A',
        userAgent: payment?.metadata?.user_agent || 'N/A',
        txHash: payment?.tx_hash || null,
        confirmations: payment?.confirmations || 0,
        networkFee: payment?.fee_amount?.toString() || '0',
        blockHeight: payment?.block_number?.toString() || 'N/A',
        createdAt: payment?.created_at,
        description: payment?.description || 'Payment transaction',
        network: payment?.network || 'mainnet',
        payAddress: payment?.pay_address || null,
        exchangeRate: payment?.exchange_rate || null,
        expiresAt: payment?.expires_at || null,
        confirmedAt: payment?.confirmed_at || null,
        paidAt: payment?.paid_at || null,
        failedAt: payment?.failed_at || null
      })) || [];

      setPayments(formattedPayments);
      setFilteredPayments(formattedPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
      setError(error?.message || 'Failed to load payments. Please try again.');
      setPayments([]);
      setFilteredPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadPayments();
    } else if (!authLoading && !user) {
      setIsLoading(false);
      setError('Please sign in to view payments');
    }
  }, [authLoading, user]);

  const handleFiltersChange = (filters) => {
    let filtered = [...payments];

    // Apply search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(payment =>
        payment?.id?.toLowerCase()?.includes(searchTerm) ||
        payment?.paymentId?.toLowerCase()?.includes(searchTerm) ||
        payment?.customerEmail?.toLowerCase()?.includes(searchTerm) ||
        payment?.customerName?.toLowerCase()?.includes(searchTerm) ||
        payment?.txHash?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Apply date range filter
    if (filters?.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered?.filter(payment => new Date(payment.createdAt) >= fromDate);
    }
    if (filters?.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate?.setHours(23, 59, 59, 999);
      filtered = filtered?.filter(payment => new Date(payment.createdAt) <= toDate);
    }

    // Apply currency filter
    if (filters?.currency && filters?.currency !== 'all') {
      filtered = filtered?.filter(payment => 
        payment?.currency?.toLowerCase() === filters?.currency?.toLowerCase()
      );
    }

    // Apply status filter
    if (filters?.status && filters?.status !== 'all') {
      filtered = filtered?.filter(payment => payment?.status === filters?.status);
    }

    // Apply amount range filter
    if (filters?.amountMin) {
      filtered = filtered?.filter(payment => 
        parseFloat(payment?.usdAmount?.replace(/,/g, '')) >= parseFloat(filters?.amountMin)
      );
    }
    if (filters?.amountMax) {
      filtered = filtered?.filter(payment => 
        parseFloat(payment?.usdAmount?.replace(/,/g, '')) <= parseFloat(filters?.amountMax)
      );
    }

    setFilteredPayments(filtered);
    setCurrentPage(1);
  };

  const handleRowClick = (payment) => {
    setSelectedPayment(payment);
    setIsDrawerOpen(true);
  };

  const handleBulkAction = async (action) => {
    try {
      if (action === 'export') {
        // Export selected payments to CSV
        const selectedPayments = payments?.filter(p => selectedRows?.includes(p?.id));
        const csvContent = generateCSV(selectedPayments);
        downloadCSV(csvContent, 'payments-export.csv');
      } else if (action === 'refund') {
        // Implement refund logic
        console.log('Refund action for payments:', selectedRows);
        // In a real app, you would call the refund API
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      setError('Failed to perform bulk action. Please try again.');
    }
  };

  const generateCSV = (data) => {
    const headers = [
      'Payment ID', 'USD Amount', 'Crypto Amount', 'Currency', 'Status',
      'Customer Email', 'TX Hash', 'Created At'
    ];
    
    const rows = data?.map(payment => [
      payment?.paymentId,
      payment?.usdAmount,
      payment?.cryptoAmount,
      payment?.currency,
      payment?.status,
      payment?.customerEmail,
      payment?.txHash || 'N/A',
      new Date(payment?.createdAt)?.toLocaleDateString()
    ]);

    return [headers, ...rows]?.map(row => row?.join(','))?.join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRowSelect = (selectedIds) => {
    setSelectedRows(selectedIds);
  };

  const handleCreateInvoice = () => {
    navigate('/invoice-creation');
  };

  const handleViewPayouts = () => {
    navigate('/payout-management');
  };

  const handleRefresh = () => {
    loadPayments();
  };

  // Pagination
  const totalPages = Math.ceil(filteredPayments?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments?.slice(startIndex, endIndex);

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your payments...</p>
        </div>
      </div>
    );
  }

  // Show error state for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">🔒</div>
          <p className="text-foreground text-lg mb-2">Authentication Required</p>
          <p className="text-muted-foreground">Please sign in to view payment transactions</p>
          <Button
            onClick={() => navigate('/authentication')}
            className="mt-4"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Payments Management - Blockchain Global Payments</title>
          <meta name="description" content="Comprehensive payment transaction management with real-time monitoring, advanced filtering, and detailed analytics for cryptocurrency payments." />
        </Helmet>
        <div className="min-h-screen bg-background">
          <div className="lg:pl-64">
            <div className="p-6 lg:p-8">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-muted/20 rounded w-1/4"></div>
                <div className="h-32 bg-muted/20 rounded"></div>
                <div className="h-96 bg-muted/20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payments Management - Blockchain Global Payments</title>
        <meta name="description" content="Comprehensive payment transaction management with real-time monitoring, advanced filtering, and detailed analytics for cryptocurrency payments." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="lg:pl-64">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Payments Management</h1>
                <p className="text-muted-foreground">
                  Monitor and analyze all cryptocurrency payment transactions in real-time
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  iconName="RefreshCw"
                  iconPosition="left"
                  loading={isLoading}
                >
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  onClick={handleViewPayouts}
                  iconName="ArrowUpRight"
                  iconPosition="left"
                >
                  View Payouts
                </Button>
                <Button
                  variant="default"
                  onClick={handleCreateInvoice}
                  iconName="Plus"
                  iconPosition="left"
                  className="gradient-primary text-white"
                >
                  Create Invoice
                </Button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="text-red-500 mr-3">⚠️</div>
                  <div>
                    <p className="text-red-700 font-medium">Error Loading Payments</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    className="ml-auto"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {/* Filters */}
            <PaymentFilters
              onFiltersChange={handleFiltersChange}
              resultsCount={filteredPayments?.length}
            />

            {/* Bulk Actions */}
            {selectedRows?.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-blue-700 font-medium">
                    {selectedRows?.length} payment{selectedRows?.length === 1 ? '' : 's'} selected
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('export')}
                      iconName="Download"
                    >
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRows([])}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <PaymentTable
                payments={currentPayments}
                onRowClick={handleRowClick}
                onBulkAction={handleBulkAction}
                selectedRows={selectedRows}
                onRowSelect={handleRowSelect}
                loading={isLoading}
              />
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {currentPayments?.map((payment) => (
                <PaymentMobileCard
                  key={payment?.id}
                  payment={payment}
                  onSelect={(id) => {
                    const newSelected = selectedRows?.includes(id)
                      ? selectedRows?.filter(selectedId => selectedId !== id)
                      : [...selectedRows, id];
                    setSelectedRows(newSelected);
                  }}
                  isSelected={selectedRows?.includes(payment?.id)}
                  onViewDetails={handleRowClick}
                />
              ))}
            </div>

            {/* No Data State */}
            {!isLoading && filteredPayments?.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💳</div>
                <h3 className="text-lg font-medium text-foreground mb-2">No Payments Found</h3>
                <p className="text-muted-foreground mb-6">
                  {payments?.length === 0 
                    ? 'No payment transactions have been recorded yet.' 
                    : 'No payments match your current filter criteria.'
                  }
                </p>
                {payments?.length === 0 ? (
                  <Button
                    onClick={handleCreateInvoice}
                    iconName="Plus"
                    className="gradient-primary text-white"
                  >
                    Create Your First Invoice
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleFiltersChange({})}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredPayments?.length)} of {filteredPayments?.length} transactions
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    iconName="ChevronLeft"
                  />
                  <span className="text-sm text-foreground px-3 py-1">
                    {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    iconName="ChevronRight"
                  />
                </div>
              </div>
            )}

            {/* Payment Detail Drawer */}
            <PaymentDetailDrawer
              payment={selectedPayment}
              isOpen={isDrawerOpen}
              onClose={() => {
                setIsDrawerOpen(false);
                setSelectedPayment(null);
              }}
            />
          </div>
        </div>
        {/* Mobile Bottom Padding for Navigation */}
        <div className="lg:hidden h-20"></div>
      </div>
    </>
  );
};

export default PaymentsManagement;