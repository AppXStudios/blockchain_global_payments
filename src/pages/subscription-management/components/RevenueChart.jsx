import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import Select from '../../../components/ui/Select';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function RevenueChart({ data, period, onPeriodChange }) {
  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value || 0);
  };

  // Calculate total revenue and growth
  const totalRevenue = data?.reduce((sum, item) => sum + (item?.revenue || 0), 0) || 0;
  const averageRevenue = data?.length > 0 ? totalRevenue / data?.length : 0;
  
  // Calculate growth (comparing first half vs second half of period)
  const midPoint = Math.floor(data?.length / 2);
  const firstHalf = data?.slice(0, midPoint);
  const secondHalf = data?.slice(midPoint);
  
  const firstHalfAvg = firstHalf?.length > 0 
    ? firstHalf?.reduce((sum, item) => sum + (item?.revenue || 0), 0) / firstHalf?.length 
    : 0;
  const secondHalfAvg = secondHalf?.length > 0 
    ? secondHalf?.reduce((sum, item) => sum + (item?.revenue || 0), 0) / secondHalf?.length 
    : 0;
    
  const growthRate = firstHalfAvg > 0 
    ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 
    : 0;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-md">
          <p className="text-sm font-medium text-gray-900">{`Date: ${label}`}</p>
          <p className="text-sm text-blue-600">
            {`Revenue: ${formatCurrency(payload?.[0]?.value)}`}
          </p>
          <p className="text-sm text-green-600">
            {`Subscriptions: ${payload?.[0]?.payload?.activeSubscriptions || 0}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Subscription Revenue</h3>
            <p className="text-sm text-gray-600">Track recurring revenue over time</p>
          </div>
        </div>
        <Select value={period} onChange={onPeriodChange}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Average Daily</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(averageRevenue)}
          </p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Growth Rate</p>
          <p className={`text-2xl font-bold mt-1 ${
            growthRate >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="h-5 w-5 inline mr-1" />
            {growthRate?.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        {data?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No revenue data</h3>
              <p className="text-gray-600">Revenue data will appear here once subscriptions generate income.</p>
            </div>
          </div>
        )}
      </div>

      {/* Period Summary */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Revenue Trend</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Showing data for the last {period === '7d' ? '7 days' : period === '30d' ? '30 days' : '90 days'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}