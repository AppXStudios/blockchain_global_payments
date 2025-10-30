import React from 'react';
import Icon from '../../../components/AppIcon';

const ServiceComponents = ({ services }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-success';
      case 'degraded':
        return 'text-warning';
      case 'outage':
        return 'text-error';
      case 'maintenance':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return 'CheckCircle';
      case 'degraded':
        return 'AlertTriangle';
      case 'outage':
        return 'XCircle';
      case 'maintenance':
        return 'Settings';
      default:
        return 'Clock';
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'operational':
        return `${baseClasses} bg-success/20 text-success`;
      case 'degraded':
        return `${baseClasses} bg-warning/20 text-warning`;
      case 'outage':
        return `${baseClasses} bg-error/20 text-error`;
      case 'maintenance':
        return `${baseClasses} bg-accent/20 text-accent`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  return (
    <div className="glassmorphism rounded-lg p-6 border border-border">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
        Service Components
      </h3>
      <div className="space-y-4">
        {services?.map((service) => (
          <div key={service?.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${service?.status === 'operational' ? 'bg-success/20' : service?.status === 'degraded' ? 'bg-warning/20' : service?.status === 'outage' ? 'bg-error/20' : 'bg-accent/20'}`}>
                <Icon 
                  name={service?.icon} 
                  size={20} 
                  color={service?.status === 'operational' ? 'var(--color-success)' : service?.status === 'degraded' ? 'var(--color-warning)' : service?.status === 'outage' ? 'var(--color-error)' : 'var(--color-accent)'} 
                />
              </div>
              
              <div>
                <div className="font-medium text-foreground">{service?.name}</div>
                <div className="text-sm text-muted-foreground">{service?.description}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {service?.responseTime && (
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{service?.responseTime}ms</div>
                  <div className="text-xs text-muted-foreground">Response Time</div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getStatusIcon(service?.status)} 
                  size={16} 
                  color={service?.status === 'operational' ? 'var(--color-success)' : service?.status === 'degraded' ? 'var(--color-warning)' : service?.status === 'outage' ? 'var(--color-error)' : 'var(--color-accent)'} 
                />
                <span className={getStatusBadge(service?.status)}>
                  {service?.status?.charAt(0)?.toUpperCase() + service?.status?.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceComponents;