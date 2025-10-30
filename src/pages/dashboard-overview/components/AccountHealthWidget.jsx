import React from 'react';
import Icon from '../../../components/AppIcon';

const AccountHealthWidget = () => {
  const healthMetrics = [
    {
      label: "API Status",
      status: "operational",
      value: "99.9%",
      description: "Uptime last 30 days"
    },
    {
      label: "Webhook Delivery",
      status: "warning",
      value: "94.2%",
      description: "Success rate"
    },
    {
      label: "Security Score",
      status: "good",
      value: "A+",
      description: "Account security rating"
    },
    {
      label: "Compliance",
      status: "operational",
      value: "Verified",
      description: "KYC & AML status"
    }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      operational: {
        color: 'text-success',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20',
        icon: 'CheckCircle'
      },
      good: {
        color: 'text-success',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20',
        icon: 'Shield'
      },
      warning: {
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        icon: 'AlertTriangle'
      },
      error: {
        color: 'text-error',
        bgColor: 'bg-error/10',
        borderColor: 'border-error/20',
        icon: 'XCircle'
      }
    };
    return configs?.[status] || configs?.operational;
  };

  const overallHealth = () => {
    const operationalCount = healthMetrics?.filter(m => 
      m?.status === 'operational' || m?.status === 'good'
    )?.length;
    const percentage = (operationalCount / healthMetrics?.length) * 100;
    
    if (percentage === 100) return { status: 'excellent', color: 'text-success' };
    if (percentage >= 75) return { status: 'good', color: 'text-success' };
    if (percentage >= 50) return { status: 'fair', color: 'text-warning' };
    return { status: 'poor', color: 'text-error' };
  };

  const health = overallHealth();

  return (
    <div className="glassmorphism p-6 rounded-xl border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Account Health</h3>
        <div className={`flex items-center space-x-2 ${health?.color}`}>
          <Icon name="Activity" size={16} />
          <span className="text-sm font-medium capitalize">{health?.status}</span>
        </div>
      </div>
      <div className="space-y-4">
        {healthMetrics?.map((metric, index) => {
          const config = getStatusConfig(metric?.status);
          return (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/10 transition-smooth">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${config?.bgColor} border ${config?.borderColor}`}>
                  <Icon name={config?.icon} size={14} color={`var(--color-${metric?.status === 'good' ? 'success' : metric?.status})`} />
                </div>
                <div>
                  <div className="font-medium text-foreground text-sm">{metric?.label}</div>
                  <div className="text-xs text-muted-foreground">{metric?.description}</div>
                </div>
              </div>
              <div className={`font-semibold ${config?.color}`}>
                {metric?.value}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Last updated:</span>
          <span className="text-foreground font-medium">
            {new Date()?.toLocaleTimeString()}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Overall Health Score</span>
          <span>85/100</span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-success to-accent h-2 rounded-full transition-all duration-500"
            style={{ width: '85%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AccountHealthWidget;