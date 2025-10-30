import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const UsageAnalytics = ({ analyticsData }) => {
  const { dailyUsage, endpointUsage, topKeys, rateLimitHits } = analyticsData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glassmorphism border border-border rounded-lg p-3 shadow-elevation-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {entry?.name}: {entry?.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glassmorphism border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={20} className="text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Total Requests</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-foreground">
              {analyticsData?.totalRequests?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-success">+12.5% from last week</div>
          </div>
        </div>

        <div className="glassmorphism border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Key" size={20} className="text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Active Keys</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-foreground">
              {analyticsData?.activeKeys || '0'}
            </div>
            <div className="text-xs text-muted-foreground">of {analyticsData?.totalKeys || '0'} total</div>
          </div>
        </div>

        <div className="glassmorphism border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
            <span className="text-sm font-medium text-muted-foreground">Rate Limit Hits</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-foreground">
              {analyticsData?.rateLimitHits || '0'}
            </div>
            <div className="text-xs text-warning">Last 24 hours</div>
          </div>
        </div>

        <div className="glassmorphism border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={20} className="text-success" />
            <span className="text-sm font-medium text-muted-foreground">Success Rate</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-foreground">
              {analyticsData?.successRate || '99.9'}%
            </div>
            <div className="text-xs text-success">Excellent performance</div>
          </div>
        </div>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Usage Chart */}
        <div className="glassmorphism border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Daily API Usage</h3>
            <Icon name="TrendingUp" size={20} className="text-accent" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="var(--color-accent)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Endpoint Usage Chart */}
        <div className="glassmorphism border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Endpoint Usage</h3>
            <Icon name="BarChart3" size={20} className="text-accent" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={endpointUsage} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  type="number"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  type="category"
                  dataKey="endpoint" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="requests" 
                  fill="var(--color-accent)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Top API Keys Table */}
      <div className="glassmorphism border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Top API Keys by Usage</h3>
          <Icon name="Crown" size={20} className="text-accent" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Key Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Requests (24h)</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Success Rate</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Used</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {topKeys?.map((key, index) => (
                <tr key={key?.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground">{key?.name}</span>
                      {index < 3 && (
                        <Icon 
                          name="Medal" 
                          size={16} 
                          className={
                            index === 0 ? 'text-yellow-500' : 
                            index === 1 ? 'text-gray-400': 'text-orange-600'
                          } 
                        />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">
                    {key?.requests?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm ${key?.successRate >= 99 ? 'text-success' : key?.successRate >= 95 ? 'text-warning' : 'text-error'}`}>
                      {key?.successRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {key?.lastUsed}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      key?.status === 'active' ?'bg-success/10 text-success border border-success/20' :'bg-muted text-muted-foreground border border-border'
                    }`}>
                      {key?.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalytics;