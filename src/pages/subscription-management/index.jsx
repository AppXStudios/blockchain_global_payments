import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, TrendingUp, Users, DollarSign, X, Edit, Eye } from 'lucide-react';
import { subscriptionsService } from '../../services/subscriptionsService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import SubscriptionPlanForm from './components/SubscriptionPlanForm';
import SubscriptionTable from './components/SubscriptionTable';
import SubscriptionAnalytics from './components/SubscriptionAnalytics';
import RevenueChart from './components/RevenueChart';
import UpcomingRenewals from './components/UpcomingRenewals';

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [analytics, setAnalytics] = useState({ records: [], summary: {} });
  const [revenueData, setRevenueData] = useState([]);
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState('overview');
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    plan: '',
    search: ''
  });
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, [selectedPeriod]);

  // Load all subscription data
  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        subscriptionsResult,
        plansResult,
        analyticsResult,
        revenueResult,
        renewalsResult
      ] = await Promise.all([
        subscriptionsService?.getSubscriptions(),
        subscriptionsService?.getSubscriptionPlans(),
        subscriptionsService?.getSubscriptionAnalytics({ period: selectedPeriod }),
        subscriptionsService?.getRevenueTrends(selectedPeriod),
        subscriptionsService?.getUpcomingRenewals(7)
      ]);

      if (subscriptionsResult?.error) {
        setError(`Failed to load subscriptions: ${subscriptionsResult?.error?.message}`);
      } else {
        setSubscriptions(subscriptionsResult?.data || []);
      }

      if (plansResult?.error) {
        setError(`Failed to load plans: ${plansResult?.error?.message}`);
      } else {
        setSubscriptionPlans(plansResult?.data || []);
      }

      if (analyticsResult?.error) {
        setError(`Failed to load analytics: ${analyticsResult?.error?.message}`);
      } else {
        setAnalytics(analyticsResult?.data || { records: [], summary: {} });
      }

      if (revenueResult?.error) {
        setError(`Failed to load revenue data: ${revenueResult?.error?.message}`);
      } else {
        setRevenueData(revenueResult?.data || []);
      }

      if (renewalsResult?.error) {
        setError(`Failed to load renewals: ${renewalsResult?.error?.message}`);
      } else {
        setUpcomingRenewals(renewalsResult?.data || []);
      }

    } catch (error) {
      setError(`Network error: ${error?.message || 'Failed to load data'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle plan creation/update
  const handlePlanSave = async (planData) => {
    try {
      if (editingPlan) {
        const { error } = await subscriptionsService?.updateSubscriptionPlan(editingPlan?.id, planData);
        if (error) {
          setError(`Failed to update plan: ${error?.message}`);
          return;
        }
      } else {
        const { error } = await subscriptionsService?.createSubscriptionPlan(planData);
        if (error) {
          setError(`Failed to create plan: ${error?.message}`);
          return;
        }
      }
      
      setShowPlanForm(false);
      setEditingPlan(null);
      await loadAllData();
    } catch (error) {
      setError(`Network error: ${error?.message}`);
    }
  };

  // Handle subscription status changes
  const handleSubscriptionAction = async (subscriptionId, action) => {
    try {
      let result;
      switch (action) {
        case 'pause':
          result = await subscriptionsService?.pauseSubscription(subscriptionId);
          break;
        case 'resume':
          result = await subscriptionsService?.resumeSubscription(subscriptionId);
          break;
        case 'cancel':
          result = await subscriptionsService?.cancelSubscription(subscriptionId, 'User requested cancellation');
          break;
        default:
          return;
      }

      if (result?.error) {
        setError(`Failed to ${action} subscription: ${result?.error?.message}`);
      } else {
        await loadAllData();
      }
    } catch (error) {
      setError(`Network error: ${error?.message}`);
    }
  };

  // Filter subscriptions based on current filters
  const filteredSubscriptions = subscriptions?.filter(subscription => {
    const matchesStatus = !filters?.status || subscription?.status === filters?.status;
    const matchesPlan = !filters?.plan || subscription?.plan_id === filters?.plan;
    const matchesSearch = !filters?.search || 
      subscription?.subscriber_email?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      subscription?.subscription_plans?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase());
    
    return matchesStatus && matchesPlan && matchesSearch;
  }) || [];

  // Calculate overview metrics
  const overviewMetrics = [
    {
      title: "Active Subscriptions",
      value: analytics?.summary?.totalActiveSubscriptions || 0,
      change: "+12%",
      changeType: "positive",
      icon: Users
    },
    {
      title: "Monthly Recurring Revenue",
      value: analytics?.summary?.totalMRR || 0,
      change: "+8.2%",
      changeType: "positive",
      icon: DollarSign,
      currency: true
    },
    {
      title: "Churn Rate",
      value: `${(analytics?.summary?.averageChurnRate || 0)?.toFixed(1)}%`,
      change: "-2.1%",
      changeType: "positive",
      icon: TrendingUp
    },
    {
      title: "Avg Revenue Per User",
      value: analytics?.summary?.averageARPU || 0,
      change: "+5.7%",
      changeType: "positive",
      icon: DollarSign,
      currency: true
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading subscription data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
              <p className="text-gray-600 mt-1">Manage recurring payment plans and subscriber billing cycles</p>
            </div>
            <Button 
              onClick={() => setShowPlanForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <X className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'subscriptions', label: 'Subscriptions' },
              { key: 'plans', label: 'Plans' },
              { key: 'analytics', label: 'Analytics' }
            ]?.map(tab => (
              <button
                key={tab?.key}
                onClick={() => setActiveTab(tab?.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab?.key
                    ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab?.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overviewMetrics?.map((metric, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric?.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {metric?.currency ? `$${typeof metric?.value === 'number' ? metric?.value?.toFixed(2) : metric?.value}` : metric?.value}
                      </p>
                      <p className={`text-sm mt-2 ${
                        metric?.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric?.change} from last period
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <metric.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart 
                data={revenueData} 
                period={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
              <UpcomingRenewals renewals={upcomingRenewals} />
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search subscriptions..."
                    className="pl-10"
                    value={filters?.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e?.target?.value }))}
                  />
                </div>
                <Select
                  value={filters?.status}
                  onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                </Select>
                <Select
                  value={filters?.plan}
                  onChange={(value) => setFilters(prev => ({ ...prev, plan: value }))}
                >
                  <option value="">All Plans</option>
                  {subscriptionPlans?.map(plan => (
                    <option key={plan?.id} value={plan?.id}>{plan?.name}</option>
                  ))}
                </Select>
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>

            {/* Subscriptions Table */}
            <SubscriptionTable
              subscriptions={filteredSubscriptions}
              onAction={handleSubscriptionAction}
              loading={loading}
            />
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptionPlans?.map(plan => (
                <div key={plan?.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{plan?.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{plan?.description}</p>
                    </div>
                    <div className="relative">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-gray-900">
                      ${plan?.amount}
                      <span className="text-base font-normal text-gray-600">
                        /{plan?.billing_interval}
                      </span>
                    </div>
                    {plan?.trial_days > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        {plan?.trial_days} day free trial
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    {plan?.features?.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setEditingPlan(plan);
                        setShowPlanForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>

                  <div className={`mt-4 px-2 py-1 rounded-full text-xs font-medium inline-block ${
                    plan?.status === 'active' ?'bg-green-100 text-green-800' :'bg-gray-100 text-gray-800'
                  }`}>
                    {plan?.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <SubscriptionAnalytics 
            analytics={analytics}
            revenueData={revenueData}
            period={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        )}

        {/* Plan Form Modal */}
        {showPlanForm && (
          <SubscriptionPlanForm
            plan={editingPlan}
            onSave={handlePlanSave}
            onCancel={() => {
              setShowPlanForm(false);
              setEditingPlan(null);
            }}
          />
        )}
      </div>
    </div>
  );
}