import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import PricingCard from './components/PricingCard';
import BillingToggle from './components/BillingToggle';
import FeatureComparisonTable from './components/FeatureComparisonTable';
import PricingFAQ from './components/PricingFAQ';
import TrustIndicators from './components/TrustIndicators';

const PricingPage = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small businesses and startups getting started with crypto payments.',
      processingFee: '1.8%',
      monthlyPrice: 0,
      annualPrice: 0,
      savings: null,
      monthlyLimit: '$50,000',
      ctaText: 'Start Free',
      additionalInfo: 'No setup fees or monthly charges',
      features: [
        { name: 'Accept 50+ cryptocurrencies', included: true },
        { name: 'Basic API access (1K requests/hour)', included: true },
        { name: 'Email support (48h response)', included: true },
        { name: 'Standard settlement (24-48h)', included: true },
        { name: 'Basic webhook events', included: true },
        { name: 'Dashboard analytics', included: true },
        { name: 'PCI DSS compliance', included: true },
        { name: 'IP allowlisting', included: false },
        { name: 'Priority support', included: false },
        { name: 'Custom branding', included: false }
      ]
    },
    {
      id: 'growth',
      name: 'Growth',
      description: 'Ideal for growing businesses that need advanced features and higher limits.',
      processingFee: '1.6%',
      monthlyPrice: 99,
      annualPrice: 950,
      savings: '$238',
      monthlyLimit: '$500,000',
      ctaText: 'Start Growth Plan',
      additionalInfo: '14-day free trial included',
      features: [
        { name: 'Accept 150+ cryptocurrencies', included: true },
        { name: 'Advanced API access (10K requests/hour)', included: true },
        { name: 'Email + chat support (24h response)', included: true },
        { name: 'Fast settlement (12-24h)', included: true },
        { name: 'Advanced webhook events', included: true },
        { name: 'Advanced analytics & reporting', included: true },
        { name: 'PCI DSS compliance', included: true },
        { name: 'IP allowlisting', included: true },
        { name: 'SDK support', included: true },
        { name: 'Custom branding', included: false }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations requiring maximum features, support, and customization.',
      processingFee: '1.4%',
      monthlyPrice: 499,
      annualPrice: 4790,
      savings: '$1,198',
      monthlyLimit: 'Unlimited',
      ctaText: 'Contact Sales',
      additionalInfo: 'Custom pricing for high volume',
      features: [
        { name: 'Accept 300+ cryptocurrencies', included: true },
        { name: 'Premium API access (100K requests/hour)', included: true },
        { name: '24/7 phone support + dedicated manager', included: true },
        { name: 'Instant settlement', included: true },
        { name: 'Premium webhook events', included: true },
        { name: 'White-label dashboard', included: true },
        { name: 'PCI DSS compliance', included: true },
        { name: 'Advanced security policies', included: true },
        { name: 'Full SDK suite', included: true },
        { name: 'Complete custom branding', included: true }
      ]
    }
  ];

  const handleSelectPlan = (plan) => {
    if (plan?.id === 'enterprise') {
      navigate('/contact', { state: { planType: 'enterprise' } });
    } else {
      navigate('/merchant-onboarding', { state: { selectedPlan: plan?.id } });
    }
  };

  const handleBillingToggle = (cycle) => {
    setBillingCycle(cycle);
  };

  return (
    <>
      <Helmet>
        <title>Pricing - Blockchain Global Payments</title>
        <meta name="description" content="Choose the perfect crypto payment processing plan for your business. Transparent pricing with no hidden fees. Start with 1.8% processing fee." />
        <meta name="keywords" content="crypto payment pricing, blockchain payment fees, cryptocurrency processing rates, payment gateway pricing" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 px-6 lg:px-8">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Simple, Transparent
                <span className="block text-gradient">Pricing</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                No hidden fees, no setup costs, no monthly minimums. Pay only when you process transactions with industry-leading rates.
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={16} color="var(--color-success)" />
                  <span>PCI DSS Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Globe" size={16} color="var(--color-success)" />
                  <span>180+ Countries</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Zap" size={16} color="var(--color-success)" />
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </div>

            {/* Billing Toggle */}
            <BillingToggle 
              billingCycle={billingCycle} 
              onToggle={handleBillingToggle} 
            />

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
              {pricingPlans?.map((plan, index) => (
                <PricingCard
                  key={plan?.id}
                  plan={plan}
                  isPopular={index === 1}
                  billingCycle={billingCycle}
                  onSelectPlan={handleSelectPlan}
                />
              ))}
            </div>

            {/* Enterprise CTA */}
            <div className="text-center mb-20">
              <div className="glassmorphism border border-border rounded-2xl p-8 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Need Higher Volume Processing?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  For businesses processing over $1M monthly, we offer custom enterprise pricing with dedicated support, enhanced security, and white-glove onboarding.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="default"
                    onClick={() => navigate('/contact')}
                    iconName="Phone"
                    iconPosition="left"
                    className="gradient-primary text-white"
                  >
                    Contact Sales
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/documentation')}
                    iconName="FileText"
                    iconPosition="left"
                  >
                    View Documentation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <FeatureComparisonTable />
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <TrustIndicators />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <PricingFAQ />
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 lg:px-8 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glassmorphism border border-accent/30 rounded-2xl p-12 relative overflow-hidden">
              {/* Background Gradient */}
              <div className="absolute inset-0 gradient-primary opacity-5"></div>
              
              <div className="relative">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Ready to Start Accepting Crypto Payments?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of businesses already using Blockchain Global Payments to process cryptocurrency transactions securely and efficiently.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => navigate('/merchant-onboarding')}
                    iconName="ArrowRight"
                    iconPosition="right"
                    className="gradient-primary text-white"
                  >
                    Get Started Free
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/authentication')}
                    iconName="LogIn"
                    iconPosition="left"
                  >
                    Sign In
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground mt-4">
                  No setup fees • No monthly minimums • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PricingPage;