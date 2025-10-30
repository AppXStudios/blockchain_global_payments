import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FeatureComparisonTable = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const comparisonData = [
    {
      category: "Payment Processing",
      features: [
        { name: "Processing Fee", starter: "1.8%", growth: "1.6%", enterprise: "1.4%" },
        { name: "Monthly Transaction Limit", starter: "$50K", growth: "$500K", enterprise: "Unlimited" },
        { name: "Settlement Time", starter: "24-48 hours", growth: "12-24 hours", enterprise: "Instant" },
        { name: "Multi-currency Support", starter: "50+ currencies", growth: "150+ currencies", enterprise: "300+ currencies" }
      ]
    },
    {
      category: "API & Integration",
      features: [
        { name: "REST API Access", starter: true, growth: true, enterprise: true },
        { name: "Webhook Events", starter: "Basic", growth: "Advanced", enterprise: "Premium" },
        { name: "Rate Limits", starter: "1K/hour", growth: "10K/hour", enterprise: "100K/hour" },
        { name: "SDK Support", starter: false, growth: true, enterprise: true }
      ]
    },
    {
      category: "Security & Compliance",
      features: [
        { name: "PCI DSS Compliance", starter: true, growth: true, enterprise: true },
        { name: "2FA Authentication", starter: true, growth: true, enterprise: true },
        { name: "IP Allowlisting", starter: false, growth: true, enterprise: true },
        { name: "Custom Security Policies", starter: false, growth: false, enterprise: true }
      ]
    },
    {
      category: "Support & Services",
      features: [
        { name: "Support Channel", starter: "Email", growth: "Email + Chat", enterprise: "24/7 Phone + Dedicated" },
        { name: "Response Time", starter: "48 hours", growth: "24 hours", enterprise: "1 hour" },
        { name: "Technical Integration", starter: "Documentation", growth: "Guided Setup", enterprise: "White-glove" },
        { name: "Account Manager", starter: false, growth: false, enterprise: true }
      ]
    }
  ];

  const renderFeatureValue = (value) => {
    if (typeof value === 'boolean') {
      return (
        <Icon 
          name={value ? "Check" : "X"} 
          size={16} 
          color={value ? "var(--color-success)" : "var(--color-muted-foreground)"} 
        />
      );
    }
    return <span className="text-sm text-foreground">{value}</span>;
  };

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Detailed Feature Comparison
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Compare all features across our pricing tiers to find the perfect fit for your business needs.
        </p>
      </div>
      <div className="glassmorphism border border-border rounded-2xl overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-6 text-foreground font-semibold">Features</th>
                <th className="text-center p-6 text-foreground font-semibold">Starter</th>
                <th className="text-center p-6 text-foreground font-semibold">Growth</th>
                <th className="text-center p-6 text-foreground font-semibold">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData?.map((category, categoryIndex) => (
                <React.Fragment key={categoryIndex}>
                  <tr className="bg-muted/20">
                    <td colSpan={4} className="p-4 font-semibold text-foreground border-b border-border">
                      {category?.category}
                    </td>
                  </tr>
                  {category?.features?.map((feature, featureIndex) => (
                    <tr key={featureIndex} className="border-b border-border hover:bg-muted/10 transition-colors">
                      <td className="p-4 text-muted-foreground">{feature?.name}</td>
                      <td className="p-4 text-center">{renderFeatureValue(feature?.starter)}</td>
                      <td className="p-4 text-center">{renderFeatureValue(feature?.growth)}</td>
                      <td className="p-4 text-center">{renderFeatureValue(feature?.enterprise)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Accordion */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/10 transition-colors"
          >
            <span className="font-semibold text-foreground">View Feature Comparison</span>
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={20} 
              color="currentColor" 
            />
          </button>
          
          {isExpanded && (
            <div className="border-t border-border">
              {comparisonData?.map((category, categoryIndex) => (
                <div key={categoryIndex} className="border-b border-border last:border-b-0">
                  <div className="p-4 bg-muted/20 font-semibold text-foreground">
                    {category?.category}
                  </div>
                  {category?.features?.map((feature, featureIndex) => (
                    <div key={featureIndex} className="p-4 space-y-3">
                      <div className="font-medium text-foreground">{feature?.name}</div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-muted-foreground mb-1">Starter</div>
                          <div>{renderFeatureValue(feature?.starter)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-muted-foreground mb-1">Growth</div>
                          <div>{renderFeatureValue(feature?.growth)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-muted-foreground mb-1">Enterprise</div>
                          <div>{renderFeatureValue(feature?.enterprise)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureComparisonTable;