import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const TrustSection = () => {
  const securityFeatures = [
    {
      icon: "Shield",
      title: "SOC 2 Type II Certified",
      description: "Independently audited security controls and compliance standards"
    },
    {
      icon: "Lock",
      title: "256-bit SSL Encryption",
      description: "End-to-end encryption for all data transmission and storage"
    },
    {
      icon: "Key",
      title: "Multi-Signature Wallets",
      description: "Enhanced security with multiple approval requirements"
    },
    {
      icon: "Eye",
      title: "Real-time Monitoring",
      description: "24/7 fraud detection and transaction monitoring"
    }
  ];

  const complianceBadges = [
    {
      name: "PCI DSS",
      description: "Payment Card Industry Data Security Standard",
      icon: "CreditCard"
    },
    {
      name: "GDPR",
      description: "General Data Protection Regulation Compliant",
      icon: "Shield"
    },
    {
      name: "ISO 27001",
      description: "Information Security Management System",
      icon: "Award"
    },
    {
      name: "AML/KYC",
      description: "Anti-Money Laundering & Know Your Customer",
      icon: "UserCheck"
    }
  ];

  const stats = [
    {
      value: "99.9%",
      label: "Uptime SLA",
      description: "Guaranteed availability"
    },
    {
      value: "&lt;100ms",
      label: "API Response",
      description: "Lightning fast processing"
    },
    {
      value: "0",
      label: "Security Breaches",
      description: "Since inception in 2019"
    },
    {
      value: "24/7",
      label: "Support",
      description: "Enterprise assistance"
    }
  ];

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
            Trusted by{" "}
            <span className="text-gradient bg-gradient-to-r from-accent to-cyan-400 bg-clip-text text-transparent">
              Enterprise
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Bank-grade security, enterprise compliance, and 99.9% uptime SLA. 
            Your business and customers deserve the highest level of protection.
          </p>
        </motion.div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {securityFeatures?.map((feature, index) => (
            <motion.div
              key={feature?.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="glassmorphism p-6 rounded-xl border border-border text-center hover:border-success/30 transition-all duration-200 group"
            >
              <div className="mb-4">
                <div className="inline-flex p-3 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors duration-200">
                  <Icon 
                    name={feature?.icon} 
                    size={24} 
                    color="var(--color-success)" 
                  />
                </div>
              </div>
              <h3 className="text-sm font-heading font-semibold text-foreground mb-2">
                {feature?.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature?.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats?.map((stat, index) => (
            <div key={stat?.label} className="text-center">
              <div className="text-2xl lg:text-3xl font-heading font-bold text-accent mb-1">
                {stat?.value}
              </div>
              <div className="text-sm font-medium text-foreground mb-1">
                {stat?.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat?.description}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Compliance Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="text-center">
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
              Compliance & Certifications
            </h3>
            <p className="text-muted-foreground">
              Meeting the highest industry standards for security and compliance
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {complianceBadges?.map((badge, index) => (
              <motion.div
                key={badge?.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="glassmorphism p-4 rounded-lg border border-border text-center hover:border-accent/30 transition-all duration-200 group"
              >
                <div className="mb-3">
                  <div className="inline-flex p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-200">
                    <Icon 
                      name={badge?.icon} 
                      size={20} 
                      color="var(--color-accent)" 
                    />
                  </div>
                </div>
                <div className="text-sm font-heading font-semibold text-foreground mb-1">
                  {badge?.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {badge?.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;