import React from 'react';
import Icon from '../../../components/AppIcon';

const ContactInfo = () => {
  const contactDetails = [
    {
      icon: 'Clock',
      title: 'Business Hours',
      details: ['Monday - Friday: 9:00 AM - 6:00 PM PST', 'Saturday: 10:00 AM - 4:00 PM PST', 'Sunday: Closed']
    },
    {
      icon: 'MessageCircle',
      title: 'Response Time',
      details: ['Sales Inquiries: Within 2 hours', 'Technical Support: Within 4 hours', 'General Questions: Within 24 hours']
    },
    {
      icon: 'Mail',
      title: 'Email Support',
      details: ['sales@blockchainpayments.com', 'support@blockchainpayments.com', 'partnerships@blockchainpayments.com']
    },
    {
      icon: 'Phone',
      title: 'Phone Support',
      details: ['+1 (555) 123-4567', 'Available during business hours', 'For urgent technical issues only']
    }
  ];

  const alternativeChannels = [
    {
      icon: 'FileText',
      title: 'Documentation',
      description: 'Find answers in our comprehensive guides',
      link: '/documentation',
      linkText: 'Browse Docs'
    },
    {
      icon: 'Activity',
      title: 'System Status',
      description: 'Check real-time service availability',
      link: '/system-status',
      linkText: 'View Status'
    },
    {
      icon: 'HelpCircle',
      title: 'FAQ',
      description: 'Common questions and solutions',
      link: '/documentation#faq',
      linkText: 'View FAQ'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Contact Details */}
      <div className="glassmorphism rounded-2xl p-8 border border-border">
        <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
          Contact Information
        </h2>
        
        <div className="space-y-6">
          {contactDetails?.map((item, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <Icon name={item?.icon} size={20} color="var(--color-accent)" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-2">{item?.title}</h3>
                <div className="space-y-1">
                  {item?.details?.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-sm text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Alternative Resources */}
      <div className="glassmorphism rounded-2xl p-8 border border-border">
        <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
          Need Help Right Away?
        </h2>
        
        <div className="space-y-4">
          {alternativeChannels?.map((channel, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Icon name={channel?.icon} size={16} color="var(--color-accent)" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{channel?.title}</h3>
                  <p className="text-sm text-muted-foreground">{channel?.description}</p>
                </div>
              </div>
              <button
                onClick={() => window.location.href = channel?.link}
                className="text-sm text-accent hover:text-accent/80 font-medium transition-smooth"
              >
                {channel?.linkText}
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Emergency Contact */}
      <div className="glassmorphism rounded-2xl p-6 border border-warning/30 bg-warning/5">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground mb-2">Emergency Support</h3>
            <p className="text-sm text-muted-foreground mb-3">
              For critical payment processing issues affecting live transactions, contact our emergency support line.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-warning">+1 (555) 911-HELP</span>
              <span className="text-xs text-muted-foreground">Available 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;