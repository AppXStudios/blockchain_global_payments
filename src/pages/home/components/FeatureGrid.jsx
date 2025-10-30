import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FeatureGrid = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      id: 'payments',
      title: 'Multi-Currency Payments',
      description: 'Accept payments in 300+ cryptocurrencies and traditional payment methods with automatic conversion and settlement.',
      icon: 'CreditCard',
      color: 'from-blue-500 to-cyan-500',
      stats: '300+ Currencies',
      path: '/payments-management',
      benefits: ['Real-time conversion', 'Low transaction fees', 'Global reach']
    },
    {
      id: 'invoicing',
      title: 'Smart Invoicing',
      description: 'Create professional invoices with QR codes, payment links, and automatic cryptocurrency price updates.',
      icon: 'FileText',
      color: 'from-green-500 to-emerald-500',
      stats: 'Dynamic Pricing',
      path: '/invoice-creation',
      benefits: ['Auto-generated QR codes', 'Multi-language support', 'Custom branding']
    },
    {
      id: 'payouts',
      title: 'Instant Payouts',
      description: 'Automated payout system with multi-signature security and batch processing for efficient fund management.',
      icon: 'ArrowUpRight',
      color: 'from-purple-500 to-violet-500',
      stats: '< 5min Settlement',
      path: '/payout-management',
      benefits: ['Batch processing', 'Multi-sig security', 'Instant settlement']
    },
    {
      id: 'conversions',
      title: 'Currency Exchange',
      description: 'Built-in exchange functionality with competitive rates and automatic conversion between cryptocurrencies.',
      icon: 'ArrowRightLeft',
      color: 'from-orange-500 to-red-500',
      stats: 'Best Rates',
      path: '/conversions-management',
      benefits: ['Real-time rates', 'Low spreads', 'Cross-chain support']
    },
    {
      id: 'subscriptions',
      title: 'Recurring Payments',
      description: 'Set up subscription services with automated billing cycles and customer management features.',
      icon: 'Calendar',
      color: 'from-teal-500 to-cyan-500',
      stats: 'Auto-Billing',
      path: '/subscription-management',
      benefits: ['Flexible billing cycles', 'Customer portal', 'Dunning management']
    },
    {
      id: 'api',
      title: 'Developer API',
      description: 'Comprehensive REST API with SDKs, webhooks, and real-time notifications for seamless integration.',
      icon: 'Code',
      color: 'from-indigo-500 to-purple-500',
      stats: '99.9% Uptime',
      path: '/documentation',
      benefits: ['RESTful API', 'Real-time webhooks', 'Multiple SDKs']
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Detailed reporting dashboard with transaction insights, revenue analytics, and performance metrics.',
      icon: 'BarChart3',
      color: 'from-pink-500 to-rose-500',
      stats: 'Real-time Data',
      path: '/dashboard-overview',
      benefits: ['Custom reports', 'Export data', 'Performance insights']
    },
    {
      id: 'security',
      title: 'Enterprise Security',
      description: 'Bank-level security with multi-signature wallets, KYC/AML compliance, and fraud prevention.',
      icon: 'Shield',
      color: 'from-amber-500 to-orange-500',
      stats: 'SOC 2 Certified',
      path: '/system-status',
      benefits: ['Multi-sig wallets', 'KYC/AML compliant', 'Fraud protection']
    }
  ];

  const handleFeatureClick = (path) => {
    navigate(path);
  };

  const handleLearnMore = () => {
    navigate('/documentation');
  };

  const handleViewAllFeatures = () => {
    navigate('/pricing');
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
              Everything You Need for
              <span className="text-gradient bg-gradient-to-r from-accent to-cyan-400 bg-clip-text text-transparent">
                {" "}Crypto Payments
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive payment infrastructure designed for enterprises, startups, and everything in between.
              Accept, manage, and convert cryptocurrency payments with ease.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features?.map((feature, index) => (
            <motion.div
              key={feature?.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredFeature(feature?.id)}
              onMouseLeave={() => setHoveredFeature(null)}
              onClick={() => handleFeatureClick(feature?.path)}
              className="group relative glassmorphism p-6 rounded-xl border border-border hover:border-accent/30 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-elevation-lg"
            >
              {/* Feature Icon */}
              <div className="mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature?.color} p-3 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon 
                    name={feature?.icon} 
                    size={24} 
                    color="white" 
                  />
                </div>
              </div>

              {/* Feature Content */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-heading font-semibold text-foreground group-hover:text-accent transition-colors duration-200">
                    {feature?.title}
                  </h3>
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                    {feature?.stats}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature?.description}
                </p>

                {/* Benefits List (shown on hover) */}
                <div className={`space-y-1 transition-all duration-300 ${
                  hoveredFeature === feature?.id ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
                } overflow-hidden`}>
                  {feature?.benefits?.map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Icon name="Check" size={12} color="var(--color-success)" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Feature Action */}
                <div className="pt-2">
                  <button 
                    onClick={(e) => {
                      e?.stopPropagation();
                      handleFeatureClick(feature?.path);
                    }}
                    className="flex items-center space-x-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors duration-200"
                  >
                    <span>Explore Feature</span>
                    <Icon name="ArrowRight" size={14} color="currentColor" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
              Ready to Get Started?
            </h3>
            <p className="text-muted-foreground">
              Join thousands of businesses already using our platform
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              size="lg"
              onClick={handleLearnMore}
              iconName="BookOpen"
              iconPosition="left"
              className="gradient-primary text-white hover:opacity-90"
            >
              Learn More
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={handleViewAllFeatures}
              iconName="Grid3x3"
              iconPosition="left"
            >
              View All Features
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureGrid;