import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import KPICard from './components/KPICard';
import RevenueChart from './components/RevenueChart';
import RecentPaymentsTable from './components/RecentPaymentsTable';
import QuickActionsWidget from './components/QuickActionsWidget';
import SystemNotifications from './components/SystemNotifications';
import AccountHealthWidget from './components/AccountHealthWidget';
import dashboardService from '../../services/dashboardService';
import paymentsService from '../../services/paymentsService';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [kpiData, setKpiData] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load dashboard overview data
      const { data: overviewData, error: overviewError } = await dashboardService?.getDashboardOverview();
      if (overviewError) {
        throw new Error(overviewError?.message);
      }

      if (overviewData?.kpiData) {
        setKpiData(overviewData?.kpiData);
      }

      // Load recent payments
      const { data: paymentsData, error: paymentsError } = await paymentsService?.getRecentTransactions(10);
      if (paymentsError) {
        console.error('Error loading payments:', paymentsError);
      } else {
        setRecentPayments(paymentsData || []);
      }

      // Load notifications
      const { data: notificationsData, error: notificationsError } = await dashboardService?.getNotifications(5);
      if (notificationsError) {
        console.error('Error loading notifications:', notificationsError);
      } else {
        setNotifications(notificationsData || []);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Dashboard load error:', error);
      setError(error?.message || 'Failed to load dashboard data');
      
      // Set empty state instead of fallback mock data
      setKpiData([
        {
          title: "Total Revenue",
          value: 0,
          change: 0,
          changeType: "neutral",
          icon: "DollarSign",
          currency: true
        },
        {
          title: "Transactions",
          value: 0,
          change: 0,
          changeType: "neutral",
          icon: "CreditCard"
        },
        {
          title: "Conversion Rate",
          value: 0,
          change: 0,
          changeType: "neutral",
          icon: "TrendingUp"
        },
        {
          title: "Pending Payouts",
          value: 0,
          change: 0,
          changeType: "neutral",
          icon: "ArrowUpRight",
          currency: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [authLoading, user]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(() => {
      setLastUpdated(new Date());
      // Reload data in background without showing loading state
      loadDashboardData();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [user]);

  const handleRefresh = async () => {
    await loadDashboardData();
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-foreground">Please sign in to view your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard Overview - Blockchain Global Payments</title>
        <meta name="description" content="Comprehensive merchant dashboard with real-time payment analytics, transaction monitoring, and business intelligence for crypto payment processing." />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Main Content Area */}
        <div className="lg:pl-64">
          <div className="p-6 lg:p-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
                <p className="text-muted-foreground">
                  Welcome back{userProfile?.full_name ? `, ${userProfile?.full_name}` : ''}! Here's what's happening with your payments today.
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={16} />
                  <span>Last updated: {lastUpdated?.toLocaleTimeString()}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  iconName="RefreshCw" 
                  iconPosition="left"
                  loading={isLoading}
                  onClick={handleRefresh}
                >
                  Refresh
                </Button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <Icon name="AlertCircle" size={16} className="text-red-500 mr-2" />
                  <div className="flex-1">
                    <span className="text-red-700 text-sm font-medium">Failed to load dashboard data</span>
                    <p className="text-red-600 text-xs mt-1">{error}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {kpiData?.map((kpi, index) => (
                <KPICard
                  key={index}
                  title={kpi?.title}
                  value={kpi?.value}
                  change={kpi?.change}
                  changeType={kpi?.changeType}
                  icon={kpi?.icon}
                  currency={kpi?.currency}
                  loading={isLoading}
                />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
              {/* Revenue Chart - Takes 2 columns on xl screens */}
              <div className="xl:col-span-2">
                <RevenueChart />
              </div>

              {/* Sidebar Widgets */}
              <div className="space-y-6">
                <QuickActionsWidget />
                <AccountHealthWidget />
              </div>
            </div>

            {/* Bottom Section Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Recent Payments Table - Takes 2 columns on xl screens */}
              <div className="xl:col-span-2">
                <RecentPaymentsTable payments={recentPayments} loading={isLoading} />
              </div>

              {/* System Notifications */}
              <div>
                <SystemNotifications notifications={notifications} loading={isLoading} />
              </div>
            </div>

            {/* No Data State */}
            {!isLoading && !error && recentPayments?.length === 0 && (
              <div className="text-center py-12 mt-8">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-lg font-medium text-foreground mb-2">Welcome to BGP Dashboard!</h3>
                <p className="text-muted-foreground mb-6">
                  Start accepting cryptocurrency payments and watch your business grow
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => navigate('/invoice-creation')}
                    iconName="Plus"
                    className="gradient-primary text-white"
                  >
                    Create Your First Invoice
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/documentation')}
                    iconName="Book"
                  >
                    View Documentation
                  </Button>
                </div>
              </div>
            )}

            {/* Footer Stats */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">99.9%</div>
                  <div className="text-sm text-muted-foreground">API Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">180+</div>
                  <div className="text-sm text-muted-foreground">Countries Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">300+</div>
                  <div className="text-sm text-muted-foreground">Cryptocurrencies</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Padding for Navigation */}
        <div className="h-20 lg:hidden"></div>
      </div>
    </>
  );
};

export default DashboardOverview;