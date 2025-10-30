import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = ({ onGetStarted, onViewDocs }) => {
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState({
    volume: 0,
    currencies: 0,
    countries: 0,
    transactions: 0
  });

  const targetStats = {
    volume: 2847000000,
    currencies: 300,
    countries: 180,
    transactions: 15847293
  };

  useEffect(() => {
    const animateCounters = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setAnimatedStats({
          volume: Math.floor(targetStats?.volume * easeOut),
          currencies: Math.floor(targetStats?.currencies * easeOut),
          countries: Math.floor(targetStats?.countries * easeOut),
          transactions: Math.floor(targetStats?.transactions * easeOut)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedStats(targetStats);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    };

    const timeout = setTimeout(animateCounters, 500);
    return () => clearTimeout(timeout);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000)?.toFixed(1)}B`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000)?.toFixed(1)}M`;
    }
    return num?.toLocaleString();
  };

  const handleViewDemo = () => {
    navigate('/hosted-checkout');
  };

  const statsData = [
    {
      label: "Transaction Volume",
      value: formatNumber(animatedStats?.volume),
      icon: "TrendingUp",
      description: "Processed this month"
    },
    {
      label: "Cryptocurrencies",
      value: `${animatedStats?.currencies}+`,
      icon: "Coins",
      description: "Supported currencies"
    },
    {
      label: "Countries",
      value: `${animatedStats?.countries}+`,
      icon: "Globe",
      description: "Global coverage"
    },
    {
      label: "Transactions",
      value: formatNumber(animatedStats?.transactions),
      icon: "Activity",
      description: "Total processed"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/20 to-cyan-400/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-violet-500/20 to-accent/20 rounded-full blur-3xl opacity-20" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-tight">
              Enterprise{" "}
              <span className="text-gradient bg-gradient-to-r from-accent to-cyan-400 bg-clip-text text-transparent">
                Crypto Payments
              </span>
              <br />
              Made Simple
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Accept cryptocurrency payments across 300+ currencies and 180+ countries with our 
              enterprise-grade payment infrastructure. White-labeled, secure, and developer-friendly.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="default"
              size="lg"
              onClick={onGetStarted}
              iconName="ArrowRight"
              iconPosition="right"
              className="gradient-primary text-white hover:opacity-90 px-8 py-4 text-lg font-medium"
            >
              Get Started Free
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={onViewDocs}
              iconName="BookOpen"
              iconPosition="left"
              className="px-8 py-4 text-lg font-medium"
            >
              View Documentation
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={handleViewDemo}
              iconName="Play"
              iconPosition="left"
              className="px-8 py-4 text-lg font-medium text-accent hover:bg-accent/10"
            >
              Live Demo
            </Button>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-wrap justify-center items-center gap-6 pt-8"
          >
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Shield" size={16} color="var(--color-success)" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Lock" size={16} color="var(--color-success)" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="CheckCircle" size={16} color="var(--color-success)" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Zap" size={16} color="var(--color-accent)" />
              <span>99.9% Uptime</span>
            </div>
          </motion.div>
        </div>

        {/* Animated Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statsData?.map((stat, index) => (
            <motion.div
              key={stat?.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="glassmorphism p-6 rounded-xl border border-border hover:border-accent/30 transition-all duration-200 group cursor-pointer"
              onClick={() => navigate('/dashboard-overview')}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-200">
                  <Icon 
                    name={stat?.icon} 
                    size={24} 
                    color="var(--color-accent)" 
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
                    {stat?.value}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {stat?.label}
                  </div>
                  <div className="text-xs text-muted-foreground opacity-80">
                    {stat?.description}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;