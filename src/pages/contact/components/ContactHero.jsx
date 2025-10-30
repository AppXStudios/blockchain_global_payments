import React from 'react';
import Icon from '../../../components/AppIcon';

const ContactHero = () => {
  const supportStats = [
    {
      icon: 'Users',
      value: '10,000+',
      label: 'Merchants Supported',
      description: 'Businesses trust our platform'
    },
    {
      icon: 'Clock',
      value: '< 2hrs',
      label: 'Average Response',
      description: 'Fast support when you need it'
    },
    {
      icon: 'Star',
      value: '4.9/5',
      label: 'Support Rating',
      description: 'Rated by our customers'
    },
    {
      icon: 'Globe',
      value: '180+',
      label: 'Countries Served',
      description: 'Global support coverage'
    }
  ];

  return (
    <div className="text-center mb-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
          Get in <span className="text-gradient">Touch</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Have questions about crypto payments? Need technical support? Want to explore partnerships? 
          Our expert team is here to help you succeed with blockchain payments.
        </p>
      </div>
      {/* Support Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {supportStats?.map((stat, index) => (
          <div key={index} className="glassmorphism rounded-xl p-6 border border-border hover:border-accent/30 transition-smooth">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <Icon name={stat?.icon} size={24} color="var(--color-accent)" />
              </div>
              <div className="text-2xl font-heading font-bold text-foreground mb-1">
                {stat?.value}
              </div>
              <div className="text-sm font-medium text-foreground mb-1">
                {stat?.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat?.description}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Trust Indicators */}
      <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} color="var(--color-success)" />
          <span className="text-sm">Enterprise Security</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} color="var(--color-accent)" />
          <span className="text-sm">24/7 Monitoring</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={16} color="var(--color-success)" />
          <span className="text-sm">99.9% Uptime</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Users" size={16} color="var(--color-accent)" />
          <span className="text-sm">Expert Support Team</span>
        </div>
      </div>
    </div>
  );
};

export default ContactHero;