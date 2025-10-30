import React from 'react';
import Icon from '../../../components/AppIcon';

const WebhookMetrics = ({ metrics }) => {
  const metricCards = [
    {
      title: 'Success Rate',
      value: `${metrics?.successRate}%`,
      change: metrics?.successRateChange,
      icon: 'TrendingUp',
      color: metrics?.successRate >= 95 ? 'success' : metrics?.successRate >= 90 ? 'warning' : 'error'
    },
    {
      title: 'Total Events',
      value: metrics?.totalEvents?.toLocaleString(),
      change: metrics?.totalEventsChange,
      icon: 'Activity',
      color: 'accent'
    },
    {
      title: 'Avg Response Time',
      value: `${metrics?.avgResponseTime}ms`,
      change: metrics?.responseTimeChange,
      icon: 'Clock',
      color: metrics?.avgResponseTime <= 1000 ? 'success' : metrics?.avgResponseTime <= 3000 ? 'warning' : 'error'
    },
    {
      title: 'Failed Events',
      value: metrics?.failedEvents?.toLocaleString(),
      change: metrics?.failedEventsChange,
      icon: 'AlertTriangle',
      color: metrics?.failedEvents === 0 ? 'success' : 'error'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      success: {
        bg: 'bg-success/10',
        text: 'text-success',
        icon: 'var(--color-success)'
      },
      warning: {
        bg: 'bg-warning/10',
        text: 'text-warning',
        icon: 'var(--color-warning)'
      },
      error: {
        bg: 'bg-error/10',
        text: 'text-error',
        icon: 'var(--color-error)'
      },
      accent: {
        bg: 'bg-accent/10',
        text: 'text-accent',
        icon: 'var(--color-accent)'
      }
    };
    return colors?.[color] || colors?.accent;
  };

  const getChangeIcon = (change) => {
    if (change > 0) return 'TrendingUp';
    if (change < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getChangeColor = (change, isInverse = false) => {
    if (change === 0) return 'text-muted-foreground';
    const isPositive = isInverse ? change < 0 : change > 0;
    return isPositive ? 'text-success' : 'text-error';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards?.map((metric, index) => {
        const colors = getColorClasses(metric?.color);
        const isFailedEvents = metric?.title === 'Failed Events';
        
        return (
          <div key={index} className="glassmorphism rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div className={`h-12 w-12 rounded-lg ${colors?.bg} flex items-center justify-center`}>
                <Icon name={metric?.icon} size={24} color={colors?.icon} />
              </div>
              {metric?.change !== undefined && (
                <div className={`flex items-center space-x-1 text-sm ${getChangeColor(metric?.change, isFailedEvents)}`}>
                  <Icon name={getChangeIcon(metric?.change)} size={16} />
                  <span>{Math.abs(metric?.change)}%</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-foreground">{metric?.value}</h3>
              <p className="text-sm text-muted-foreground mt-1">{metric?.title}</p>
            </div>
            {/* Status Indicator */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Last 24 hours</span>
                <div className={`h-2 w-2 rounded-full ${colors?.bg}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WebhookMetrics;