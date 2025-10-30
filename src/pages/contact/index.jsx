import React from 'react';
import { Helmet } from 'react-helmet';
import ContactHero from './components/ContactHero';
import ContactForm from './components/ContactForm';
import ContactInfo from './components/ContactInfo';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - Blockchain Global Payments</title>
        <meta name="description" content="Get in touch with our expert team for sales inquiries, technical support, or partnership opportunities. Fast response times and global support coverage." />
        <meta name="keywords" content="contact, support, crypto payments, blockchain, technical help, sales" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Main Content */}
          <div className="container mx-auto px-6 py-16 lg:py-24">
            <ContactHero />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              {/* Contact Form */}
              <div className="order-2 lg:order-1">
                <ContactForm />
              </div>

              {/* Contact Information */}
              <div className="order-1 lg:order-2">
                <ContactInfo />
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-16 text-center">
              <div className="glassmorphism rounded-2xl p-8 border border-border max-w-4xl mx-auto">
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                  Prefer to Email Directly?
                </h2>
                <p className="text-muted-foreground mb-6">
                  You can also reach us directly at the email addresses below based on your inquiry type:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-accent font-medium mb-1">Sales Inquiries</div>
                    <a 
                      href="mailto:sales@blockchainpayments.com" 
                      className="text-sm text-muted-foreground hover:text-accent transition-smooth"
                    >
                      sales@blockchainpayments.com
                    </a>
                  </div>
                  <div className="text-center">
                    <div className="text-accent font-medium mb-1">Technical Support</div>
                    <a 
                      href="mailto:support@blockchainpayments.com" 
                      className="text-sm text-muted-foreground hover:text-accent transition-smooth"
                    >
                      support@blockchainpayments.com
                    </a>
                  </div>
                  <div className="text-center">
                    <div className="text-accent font-medium mb-1">Partnerships</div>
                    <a 
                      href="mailto:partnerships@blockchainpayments.com" 
                      className="text-sm text-muted-foreground hover:text-accent transition-smooth"
                    >
                      partnerships@blockchainpayments.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;