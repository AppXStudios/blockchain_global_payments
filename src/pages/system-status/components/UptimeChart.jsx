import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UptimeChart = ({ uptimeData }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glassmorphism p-3 border border-border rounded-lg shadow-elevation-md">
          <p className="text-sm font-medium text-foreground mb-1">{label}</p>
          <p className="text-sm text-success">
            Uptime: {payload?.[0]?.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glassmorphism rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          30-Day Uptime History
        </h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <span>Uptime Percentage</span>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={uptimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[95, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="uptime" 
              stroke="var(--color-success)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-success)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-heading font-semibold text-success">99.98%</div>
          <div className="text-xs text-muted-foreground">This Month</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-heading font-semibold text-success">99.95%</div>
          <div className="text-xs text-muted-foreground">Last Month</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-heading font-semibold text-success">99.97%</div>
          <div className="text-xs text-muted-foreground">3 Months</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-heading font-semibold text-success">99.96%</div>
          <div className="text-xs text-muted-foreground">12 Months</div>
        </div>
      </div>
    </div>
  );
};

export default UptimeChart;