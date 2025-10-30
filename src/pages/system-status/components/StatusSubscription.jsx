import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const StatusSubscription = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e?.preventDefault();
    if (!email) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
      setEmail('');
    }, 1500);
  };

  if (subscribed) {
    return (
      <div className="glassmorphism rounded-lg p-6 border border-border">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-success/20">
              <Icon name="CheckCircle" size={32} color="var(--color-success)" />
            </div>
          </div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            Successfully Subscribed!
          </h3>
          <p className="text-muted-foreground mb-4">
            You'll receive email notifications about system status updates and incidents.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setSubscribed(false)}
            className="text-sm"
          >
            Subscribe Another Email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glassmorphism rounded-lg p-6 border border-border">
      <div className="flex items-start space-x-4">
        <div className="p-2 rounded-lg bg-accent/20 flex-shrink-0">
          <Icon name="Bell" size={20} color="var(--color-accent)" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            Subscribe to Updates
          </h3>
          <p className="text-muted-foreground mb-4">
            Get notified about system status changes, planned maintenance, and incident updates.
          </p>
          
          <form onSubmit={handleSubscribe} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
              required
              className="w-full"
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                variant="default"
                loading={loading}
                disabled={!email}
                className="gradient-primary text-white flex-1 sm:flex-none"
              >
                Subscribe to Updates
              </Button>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={16} color="currentColor" />
                  <span>No spam</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Zap" size={16} color="currentColor" />
                  <span>Instant alerts</span>
                </div>
              </div>
            </div>
          </form>
          
          <div className="mt-4 p-3 rounded-lg bg-muted/30">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} color="var(--color-accent)" className="mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">What you'll receive:</strong> Critical incident alerts, 
                planned maintenance notifications, and monthly uptime reports. You can unsubscribe at any time.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusSubscription;