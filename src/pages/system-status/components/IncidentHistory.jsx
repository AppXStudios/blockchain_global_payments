import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const IncidentHistory = ({ incidents }) => {
  const [expandedIncident, setExpandedIncident] = useState(null);

  const getIncidentSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-error';
      case 'major':
        return 'text-warning';
      case 'minor':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  const getIncidentSeverityBg = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-error/20';
      case 'major':
        return 'bg-warning/20';
      case 'minor':
        return 'bg-accent/20';
      default:
        return 'bg-muted/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return 'CheckCircle';
      case 'investigating':
        return 'Search';
      case 'monitoring':
        return 'Eye';
      default:
        return 'Clock';
    }
  };

  const toggleIncident = (incidentId) => {
    setExpandedIncident(expandedIncident === incidentId ? null : incidentId);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="glassmorphism rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Incident History
        </h3>
        <div className="text-sm text-muted-foreground">
          Last 30 days
        </div>
      </div>
      {incidents?.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-success/20">
              <Icon name="CheckCircle" size={32} color="var(--color-success)" />
            </div>
          </div>
          <h4 className="text-lg font-heading font-medium text-foreground mb-2">
            No Recent Incidents
          </h4>
          <p className="text-muted-foreground">
            All systems have been running smoothly for the past 30 days.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents?.map((incident) => (
            <div key={incident?.id} className="border border-border rounded-lg overflow-hidden">
              <div 
                className="p-4 hover:bg-muted/30 transition-smooth cursor-pointer"
                onClick={() => toggleIncident(incident?.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-2 rounded-lg ${getIncidentSeverityBg(incident?.severity)}`}>
                      <Icon 
                        name={getStatusIcon(incident?.status)} 
                        size={16} 
                        color={incident?.status === 'resolved' ? 'var(--color-success)' : 'var(--color-warning)'} 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-foreground">{incident?.title}</h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getIncidentSeverityBg(incident?.severity)} ${getIncidentSeverityColor(incident?.severity)}`}>
                          {incident?.severity}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {incident?.summary}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{incident?.date}</span>
                        <span>•</span>
                        <span>Duration: {formatDuration(incident?.duration)}</span>
                        <span>•</span>
                        <span>Affected: {incident?.affectedServices?.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Icon 
                    name={expandedIncident === incident?.id ? "ChevronUp" : "ChevronDown"} 
                    size={20} 
                    color="currentColor" 
                  />
                </div>
              </div>
              
              {expandedIncident === incident?.id && (
                <div className="px-4 pb-4 border-t border-border bg-muted/20">
                  <div className="pt-4 space-y-4">
                    <div>
                      <h5 className="font-medium text-foreground mb-2">Timeline</h5>
                      <div className="space-y-3">
                        {incident?.timeline?.map((event, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                            <div>
                              <div className="text-sm font-medium text-foreground">{event?.time}</div>
                              <div className="text-sm text-muted-foreground">{event?.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {incident?.postmortem && (
                      <div>
                        <h5 className="font-medium text-foreground mb-2">Post-mortem</h5>
                        <p className="text-sm text-muted-foreground">{incident?.postmortem}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentHistory;