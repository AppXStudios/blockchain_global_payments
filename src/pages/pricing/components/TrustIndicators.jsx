import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustIndicators = () => {
  const trustBadges = [
    {
      icon: "Shield",
      title: "PCI DSS Compliant",
      description: "Level 1 certified for secure payment processing"
    },
    {
      icon: "Lock",
      title: "Bank-Grade Security",
      description: "256-bit SSL encryption and multi-layer protection"
    },
    {
      icon: "CheckCircle",
      title: "SOC 2 Type II",
      description: "Independently audited security controls"
    },
    {
      icon: "Globe",
      title: "Global Coverage",
      description: "Available in 180+ countries worldwide"
    }
  ];

  const complianceBadges = [
    {
      name: "GDPR Compliant",
      description: "Full compliance with European data protection regulations"
    },
    {
      name: "ISO 27001",
      description: "International standard for information security management"
    },
    {
      name: "AML/KYC",
      description: "Anti-money laundering and know your customer protocols"
    },
    {
      name: "CCPA Compliant",
      description: "California Consumer Privacy Act compliance"
    }
  ];

  return (
    <div className="mt-20">
      {/* Security Features */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Enterprise-Grade Security & Compliance
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your payments are protected by industry-leading security measures and compliance standards.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {trustBadges?.map((badge, index) => (
          <div
            key={index}
            className="text-center p-6 glassmorphism border border-border rounded-xl hover:shadow-elevation-md transition-all duration-200"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg gradient-primary mb-4">
              <Icon name={badge?.icon} size={24} color="white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{badge?.title}</h3>
            <p className="text-sm text-muted-foreground">{badge?.description}</p>
          </div>
        ))}
      </div>
      {/* Compliance Badges */}
      <div className="glassmorphism border border-border rounded-2xl p-8">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Regulatory Compliance
          </h3>
          <p className="text-muted-foreground">
            We maintain the highest standards of regulatory compliance across all jurisdictions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complianceBadges?.map((badge, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <Icon name="CheckCircle" size={16} color="var(--color-success)" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{badge?.name}</h4>
                <p className="text-sm text-muted-foreground">{badge?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-3xl font-bold text-foreground mb-2">99.9%</div>
          <div className="text-muted-foreground">Uptime SLA</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground mb-2">$50B+</div>
          <div className="text-muted-foreground">Processed Safely</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-foreground mb-2">10K+</div>
          <div className="text-muted-foreground">Trusted Merchants</div>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;