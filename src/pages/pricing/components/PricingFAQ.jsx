import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PricingFAQ = () => {
  const [openItems, setOpenItems] = useState(new Set([0])); // First item open by default

  const faqData = [
    {
      question: "How does the processing fee work?",
      answer: `Our processing fees are charged per successful transaction and vary by plan tier. The Starter plan charges 1.8%, Growth plan 1.6%, and Enterprise plan 1.4%. These fees are automatically deducted from each transaction before settlement to your wallet.\n\nThere are no hidden fees, setup costs, or monthly minimums. You only pay when you process transactions.`
    },
    {
      question: "What cryptocurrencies do you support?",
      answer: `We support 300+ cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), Bitcoin Cash (BCH), and all major altcoins and stablecoins like USDT, USDC, and DAI.\n\nThe exact number of supported currencies varies by plan tier, with Starter supporting 50+, Growth supporting 150+, and Enterprise supporting our full 300+ currency suite.`
    },
    {
      question: "Can I change my plan later?",
      answer: `Yes, you can upgrade or downgrade your plan at any time from your dashboard. Plan changes take effect immediately, and you'll be charged or credited the prorated difference.\n\nDowngrading may affect certain features like API rate limits and currency support, but your existing integrations will continue to work seamlessly.`
    },
    {
      question: "What are the settlement times?",
      answer: `Settlement times vary by plan:\n• Starter: 24-48 hours\n• Growth: 12-24 hours\n• Enterprise: Instant settlement\n\nAll settlements are processed automatically to your designated cryptocurrency wallet addresses. You can configure multiple wallets for different currencies in your dashboard.`
    },
    {
      question: "Do you offer volume discounts?",
      answer: `Yes! Enterprise customers processing high volumes can qualify for custom pricing below our standard 1.4% rate. Volume discounts are available for businesses processing over $1M monthly.\n\nContact our sales team to discuss custom pricing based on your specific transaction volumes and requirements.`
    },
    {
      question: "What security measures are in place?",
      answer: `We implement enterprise-grade security including PCI DSS compliance, 2FA authentication, IP allowlisting, and end-to-end encryption. All funds are processed through secure, audited smart contracts.\n\nEnterprise customers can also implement custom security policies and have access to advanced monitoring and alerting systems.`
    },
    {
      question: "Is there an API rate limit?",
      answer: `Yes, API rate limits vary by plan:\n• Starter: 1,000 requests/hour\n• Growth: 10,000 requests/hour\n• Enterprise: 100,000 requests/hour\n\nRate limits reset every hour and are designed to accommodate typical usage patterns. Enterprise customers can request higher limits if needed.`
    },
    {
      question: "What support do you provide?",
      answer: `Support levels vary by plan:\n• Starter: Email support with 48-hour response\n• Growth: Email + live chat with 24-hour response\n• Enterprise: 24/7 phone support, dedicated account manager, and 1-hour response time\n\nAll plans include access to our comprehensive documentation and developer resources.`
    }
  ];

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems?.has(index)) {
      newOpenItems?.delete(index);
    } else {
      newOpenItems?.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get answers to common questions about our pricing, features, and services.
        </p>
      </div>
      <div className="max-w-4xl mx-auto space-y-4">
        {faqData?.map((item, index) => (
          <div
            key={index}
            className="glassmorphism border border-border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-elevation-md"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/10 transition-colors"
            >
              <h3 className="text-lg font-semibold text-foreground pr-4">
                {item?.question}
              </h3>
              <div className="flex-shrink-0">
                <Icon 
                  name={openItems?.has(index) ? "ChevronUp" : "ChevronDown"} 
                  size={20} 
                  color="currentColor"
                  className="transition-transform duration-200"
                />
              </div>
            </button>
            
            {openItems?.has(index) && (
              <div className="px-6 pb-6 border-t border-border">
                <div className="pt-4 text-muted-foreground leading-relaxed whitespace-pre-line">
                  {item?.answer}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Contact CTA */}
      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">
          Still have questions? We're here to help.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors font-medium"
        >
          <span>Contact our sales team</span>
          <Icon name="ArrowRight" size={16} color="currentColor" />
        </a>
      </div>
    </div>
  );
};

export default PricingFAQ;