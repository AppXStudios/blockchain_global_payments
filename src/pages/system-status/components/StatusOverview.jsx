import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const StatusOverview = ({ services }) => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    navigate('/contact');    
  };

  const handleViewDashboard = () => {
    navigate('/dashboard-overview');
  };

  const handleViewIncidents = () => {
    // Scroll to incidents section
    document.getElementById('incidents')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRefreshStatus = () => {
    window.location?.reload();
  };

  const handleServiceClick = (service) => {
    // Navigate to service details or handle service click
    console.log('Service clicked:', service);
  };

  const handleContactSupport = () => {
    navigate('/contact');
  };

  const handleViewDocumentation = () => {
    navigate('/documentation');
  };

  const overallStatus = 'operational'; // operational, degraded, outage

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-green-400 bg-green-400/10';
      case 'degraded':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'outage':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
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
      default:
        return 'HelpCircle';
    }
  };

  const getOverallStatusText = () => {
    switch (overallStatus) {
      case 'operational':
        return 'All systems operational';
      case 'degraded':
        return 'Some systems experiencing issues';
      case 'outage':
        return 'Major outage detected';
      default:
        return 'Status unknown';
    }
  };

  return (
    <div className="space-y-8">
      {/* Overall Status Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glassmorphism p-8 rounded-2xl border ${
          overallStatus === 'operational' ?'border-green-400/30 bg-green-400/5' 
            : overallStatus === 'degraded' ?'border-yellow-400/30 bg-yellow-400/5' :'border-red-400/30 bg-red-400/5'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${getStatusColor(overallStatus)}`}>
              <Icon 
                name={getStatusIcon(overallStatus)} 
                size={32} 
                color="currentColor" 
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {getOverallStatusText()}
              </h1>
              <p className="text-muted-foreground">
                Last updated: {new Date()?.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="outline"
              onClick={handleSubscribe}
              iconName="Bell"
              iconPosition="left"
            >
              Subscribe to Updates
            </Button>
            <Button
              variant="ghost"
              onClick={handleViewDashboard}
              iconName="LayoutDashboard"
              iconPosition="left"
            >
              View Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={handleViewIncidents}
              iconName="AlertTriangle"
              iconPosition="left"
            >
              View Incidents
            </Button>
            <Button
              variant="ghost"
              onClick={handleRefreshStatus}
              iconName="RefreshCw"
              iconPosition="left"
            >
              Refresh Status
            </Button>
          </div>
        </div>
      </motion.div>
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service, index) => (
          <motion.div
            key={service?.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glassmorphism p-6 rounded-xl border border-border hover:border-accent/30 transition-all duration-300 cursor-pointer group"
            onClick={() => handleServiceClick(service)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getStatusColor(service?.status)}`}>
                  <Icon 
                    name={getStatusIcon(service?.status)} 
                    size={20} 
                    color="currentColor" 
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    {service?.name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(service?.status)}`}>
                    {service?.status}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {service?.description}
            </p>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uptime</span>
                <span className="text-foreground font-medium">{service?.uptime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Response</span>
                <span className="text-foreground font-medium">{service?.responseTime}</span>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center text-accent text-sm font-medium group-hover:text-cyan-400 transition-colors">
                  <span>View Details</span>
                  <Icon name="ArrowRight" size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glassmorphism p-8 rounded-2xl border border-border"
      >
        <h2 className="text-xl font-bold text-foreground mb-6">Need Help?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            fullWidth
            onClick={handleContactSupport}
            iconName="MessageCircle"
            iconPosition="left"
            className="justify-start"
          >
            <div className="text-left">
              <div className="font-medium">Contact Support</div>
              <div className="text-xs text-muted-foreground">Get help with issues</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={handleViewDocumentation}
            iconName="BookOpen"
            iconPosition="left"
            className="justify-start"
          >
            <div className="text-left">
              <div className="font-medium">Documentation</div>
              <div className="text-xs text-muted-foreground">API guides & tutorials</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/api-keys-management')}
            iconName="Key"
            iconPosition="left"
            className="justify-start"
          >
            <div className="text-left">
              <div className="font-medium">API Status</div>
              <div className="text-xs text-muted-foreground">Check API keys & limits</div>
            </div>
          </Button>
        </div>
      </motion.div>
      {/* Status History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glassmorphism p-8 rounded-2xl border border-border"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
          <Button
            variant="ghost"
            onClick={() => navigate('/system-status')}
            iconName="History"
            iconPosition="left"
          >
            View History
          </Button>
        </div>
        
        <div className="space-y-4">
          {[
            {
              time: '2 hours ago',
              title: 'All systems operational',
              description: 'System maintenance completed successfully',
              status: 'operational'
            },
            {
              time: '1 day ago', 
              title: 'Scheduled maintenance',
              description: 'Brief maintenance window for payment processing',
              status: 'degraded'
            },
            {
              time: '3 days ago',
              title: 'Performance improvements',
              description: 'Enhanced response times for all API endpoints',
              status: 'operational'
            }
          ]?.map((event, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30">
              <div className={`p-1 rounded-full ${getStatusColor(event?.status)} mt-1`}>
                <Icon name={getStatusIcon(event?.status)} size={12} color="currentColor" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">{event?.title}</h4>
                  <span className="text-xs text-muted-foreground">{event?.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{event?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default StatusOverview;