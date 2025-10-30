import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import dashboardService from '../../../services/dashboardService';

const RevenueChart = () => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('30d');
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load chart data from Supabase
  const loadChartData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: chartError } = await dashboardService?.getRevenueChartData(timeRange);
      
      if (chartError) {
        throw new Error(chartError?.message);
      }

      setDailyData(data || []);
    } catch (error) {
      console.error('Chart data load error:', error);
      setError(error?.message || 'Failed to load chart data');
      // Fallback to empty data
      setDailyData([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts or time range changes
  useEffect(() => {
    loadChartData();
  }, [timeRange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glassmorphism p-3 rounded-lg border border-border shadow-elevation-md">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry?.dataKey === 'revenue' ? 'Revenue: ' : 'Transactions: '}
              </span>
              <span className="text-sm font-medium text-foreground">
                {entry?.dataKey === 'revenue' 
                  ? `$${entry?.value?.toLocaleString()}` 
                  : entry?.value?.toLocaleString()
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };

  const handleExportData = () => {
    if (dailyData?.length > 0) {
      const csvContent = "data:text/csv;charset=utf-8," +"Date,Revenue,Transactions\n"
        + dailyData?.map(row => `${row?.date},${row?.revenue},${row?.transactions}`)?.join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document?.createElement("a");
      link?.setAttribute("href", encodedUri);
      link?.setAttribute("download", `revenue_chart_${timeRange}.csv`);
      document?.body?.appendChild(link);
      link?.click();
      document?.body?.removeChild(link);
    }
  };

  return (
    <div className="glassmorphism p-6 rounded-xl border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Revenue Analytics</h3>
          <p className="text-sm text-muted-foreground">Daily performance overview</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
            <button
              onClick={() => handleTimeRangeChange('7d')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-smooth ${
                timeRange === '7d' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => handleTimeRangeChange('30d')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-smooth ${
                timeRange === '30d' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => handleTimeRangeChange('90d')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-smooth ${
                timeRange === '90d' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              90D
            </button>
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-smooth ${
                chartType === 'line' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-smooth ${
                chartType === 'bar' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Bar
            </button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            iconName="Download" 
            iconPosition="left"
            onClick={handleExportData}
            disabled={loading || dailyData?.length === 0}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <Icon name="AlertCircle" size={16} className="text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadChartData}
              className="ml-auto text-red-600 hover:text-red-700"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Chart Container */}
      <div className="h-80 w-full" aria-label="Revenue Analytics Chart">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : dailyData?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Icon name="BarChart3" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">No data available</h4>
              <p className="text-muted-foreground mb-4">
                Revenue data will appear here once you start processing payments.
              </p>
              <Button variant="outline" onClick={loadChartData}>
                Refresh Data
              </Button>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--color-accent)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'var(--color-accent)', strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="revenue" 
                  fill="var(--color-accent)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <span className="text-sm text-muted-foreground">Revenue</span>
          </div>
          {!loading && dailyData?.length > 1 && (
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} color="var(--color-success)" />
              <span className="text-sm text-success font-medium">
                {(() => {
                  const latestRevenue = dailyData?.[dailyData?.length - 1]?.revenue || 0;
                  const previousRevenue = dailyData?.[dailyData?.length - 2]?.revenue || 1;
                  const change = ((latestRevenue - previousRevenue) / previousRevenue) * 100;
                  return `${change >= 0 ? '+' : ''}${change?.toFixed(1)}% vs yesterday`;
                })()}
              </span>
            </div>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          Updated: {new Date()?.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;