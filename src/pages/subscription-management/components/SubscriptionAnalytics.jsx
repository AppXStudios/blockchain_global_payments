import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  BarChart,
  PieChart
} from 'lucide-react';
import Select from '../../../components/ui/Select';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart as RechartsBarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

export default function SubscriptionAnalytics({ analytics, revenueData, period, onPeriodChange }) {
  const { records = [], summary = {} } = analytics || {};

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value || 0);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${(value || 0)?.toFixed(1)}%`;
  };

  // Process data for churn rate chart
  const churnData = records?.map(record => ({
    date: new Date(record?.date)?.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
    churnRate: record?.churn_rate || 0,
    newSubscriptions: record?.new_subscriptions || 0,
    cancelledSubscriptions: record?.cancelled_subscriptions || 0
  })) || [];

  // Process data for subscription growth
  const growthData = records?.map(record => ({
    date: new Date(record?.date)?.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
    active: record?.active_subscriptions || 0,
    new: record?.new_subscriptions || 0,
    cancelled: record?.cancelled_subscriptions || 0
  })) || [];

  // Subscription status distribution
  const statusData = [
    { name: 'Active', value: summary?.totalActiveSubscriptions || 0, color: '#10B981' },
    { name: 'Cancelled', value: summary?.totalCancelledSubscriptions || 0, color: '#EF4444' },
    { name: 'New This Period', value: summary?.totalNewSubscriptions || 0, color: '#3B82F6' }
  ]?.filter(item => item?.value > 0);

  // Key metrics for display
  const keyMetrics = [
    {
      title: "Monthly Recurring Revenue",
      value: formatCurrency(summary?.totalMRR || 0),
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign
    },
    {
      title: "Active Subscriptions",
      value: summary?.totalActiveSubscriptions || 0,
      change: "+8.2%",
      changeType: "positive",
      icon: Users
    },
    {
      title: "Churn Rate",
      value: formatPercentage(summary?.averageChurnRate || 0),
      change: "-2.1%",
      changeType: "positive",
      icon: TrendingDown
    },
    {
      title: "Average Revenue Per User",
      value: formatCurrency(summary?.averageARPU || 0),
      change: "+5.7%",
      changeType: "positive",
      icon: BarChart
    }
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Subscription Analytics</h2>
        <Select value={period} onChange={onPeriodChange}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </Select>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics?.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric?.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{metric?.value}</p>
                <p className={`text-sm mt-2 ${
                  metric?.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric?.changeType === 'positive' ? (
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 inline mr-1" />
                  )}
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
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
            <BarChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Growth */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Subscription Growth</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Active"
                />
                <Line 
                  type="monotone" 
                  dataKey="new" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="New"
                />
                <Line 
                  type="monotone" 
                  dataKey="cancelled" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Cancelled"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Churn Analysis</h3>
            <TrendingDown className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={churnData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar 
                  yAxisId="left"
                  dataKey="churnRate" 
                  fill="#EF4444" 
                  name="Churn Rate (%)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="cancelledSubscriptions" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Cancellations"
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Status Distribution</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Tooltip />
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Detailed Metrics Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Detailed Analytics</h3>
        </div>
        
        {records?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cancelled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MRR
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Churn Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records?.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record?.date)?.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record?.active_subscriptions || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      +{record?.new_subscriptions || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      -{record?.cancelled_subscriptions || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(record?.monthly_recurring_revenue || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPercentage(record?.churn_rate || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
            <p className="text-gray-600">Analytics data will appear here once you have active subscriptions.</p>
          </div>
        )}
      </div>
    </div>
  );
}