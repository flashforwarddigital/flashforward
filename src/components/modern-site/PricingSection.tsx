import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { colors, typography, spacing, transitions, effects } from '../../theme/theme';
import { NeonCard } from './NeonCard';

interface PricingSectionProps {
  className?: string;
}

interface SubscriptionCategory {
  title: string;
  color: string;
  services: Array<{
    name: string;
    price: number;
  }>;
}

interface PricingPlan {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  color: string;
}

const subscriptionCategories: Record<string, SubscriptionCategory> = {
  websites: {
    title: "Website Services",
    color: colors.text.white,
    services: [
      { name: "Website Hosting", price: 29 },
      { name: "SSL Certificate", price: 15 },
      { name: "Daily Backups", price: 19 },
      { name: "24/7 Support", price: 49 }
    ]
  },
  content: {
    title: "Content Services",
    color: colors.text.white,
    services: [
      { name: "Content Updates", price: 149 },
      { name: "Blog Writing", price: 199 },
      { name: "Social Media Management", price: 299 },
      { name: "Email Marketing", price: 99 }
    ]
  },
  ai: {
    title: "AI Services",
    color: colors.text.white,
    services: [
      { name: "AI Chatbot", price: 199 },
      { name: "AI Content Generation", price: 149 },
      { name: "AI Analytics", price: 99 },
      { name: "AI Automation", price: 249 }
    ]
  }
};

const pricingPlans: PricingPlan[] = [
  {
    title: "Basic",
    price: "$999",
    description: "Perfect for small businesses looking to establish their digital presence.",
    features: [
      "Custom Website Design",
      "Mobile Responsive",
      "Contact Form",
      "Basic SEO Setup",
      "1 Month Support"
    ],
    color: colors.text.white
  },
  {
    title: "Pro",
    price: "$2,499",
    description: "Ideal for growing businesses ready to expand their digital footprint.",
    features: [
      "Everything in Basic",
      "E-commerce Integration",
      "Content Management System",
      "Advanced SEO",
      "3 Months Support",
      "Social Media Setup"
    ],
    color: colors.text.white
  },
  {
    title: "Enterprise",
    price: "$4,999",
    description: "Comprehensive solution for established businesses seeking digital excellence.",
    features: [
      "Everything in Pro",
      "Custom Features",
      "API Integration",
      "Performance Optimization",
      "6 Months Support",
      "Analytics Setup",
      "Training & Documentation"
    ],
    color: colors.text.white
  }
];

const PricingCard: React.FC<{ plan: PricingPlan; index: number }> = ({ plan, index }) => {
  return (
    <NeonCard index={index} hasPadding={true}>
      <div className="flex flex-col h-full">
        <h3 
          className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} mb-4`}
          style={{ color: colors.text.white }}
        >
          {plan.title}
        </h3>
        <div 
          className={`${typography.fontSize['4xl']} ${typography.fontFamily.light} ${typography.tracking.tighter} mb-6`}
          style={{ color: colors.text.white }}
        >
          {plan.price}
        </div>
        <ul className="space-y-4 flex-grow">
          {plan.features.map((feature, i) => (
            <li 
              key={i}
              className={`${colors.text.gray[400]} ${typography.fontFamily.light} ${typography.tracking.tight} flex items-center`}
            >
              <span className="mr-2">•</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </NeonCard>
  );
};

export const PricingSection: React.FC<PricingSectionProps> = ({ className = "" }) => {
  const [pricingType, setPricingType] = useState<'packages' | 'subscription'>('packages');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const calculateTotal = () => {
    return Object.values(subscriptionCategories)
      .flatMap(category => category.services)
      .filter(service => selectedServices.includes(service.name))
      .reduce((total, service) => total + service.price, 0);
  };

  const toggleService = (serviceName: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceName) 
        ? prev.filter(name => name !== serviceName)
        : [...prev, serviceName]
    );
  };

  return (
    <section id="pricing" className={`${spacing.section.padding} ${typography.tracking.tight} bg-black/50 ${className}`}>
      <div className={`container mx-auto ${spacing.container.padding}`}>
        <h2 className={`${typography.fontSize['4xl']} sm:text-5xl lg:text-[64px] ${colors.text.white} text-center mb-12 ${typography.tracking.tighter} font-bold`}>
          pricing
        </h2>
        
        <div className="flex justify-center mb-12">
          <div className={`${colors.background.card} p-1 rounded-full`}>
            <div className="flex relative">
              <button
                onClick={() => setPricingType('packages')}
                className={`px-6 py-2 rounded-full text-sm ${typography.fontFamily.light} ${transitions.colors} relative z-10 ${
                  pricingType === 'packages' ? 'text-black' : colors.text.white
                }`}
              >
                Packages
              </button>
              <button
                onClick={() => setPricingType('subscription')}
                className={`px-6 py-2 rounded-full text-sm ${typography.fontFamily.light} ${transitions.colors} relative z-10 ${
                  pricingType === 'subscription' ? 'text-black' : colors.text.white
                }`}
              >
                Subscription
              </button>
              <motion.div
                className="absolute inset-1 rounded-full bg-[#008CFF]"
                initial={false}
                animate={{
                  x: pricingType === 'packages' ? 0 : '100%',
                  width: '50%'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>
        </div>

        {pricingType === 'subscription' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {Object.entries(subscriptionCategories).map(([key, category], index) => (
                <div key={key} className="flex flex-col items-center">
                  <h3 className={`${typography.fontSize['2xl']} ${typography.fontFamily.light} mb-6 text-center ${typography.tracking.tight}`} style={{ color: colors.text.white }}>
                    {category.title}
                  </h3>
                  
                  <NeonCard index={index} className="flex flex-col p-6 w-full">
                    <div className="space-y-4 w-full">
                      {category.services.map((service, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between rounded-lg border-[0.5px] ${transitions.all} hover:bg-black/20 p-4`}
                          style={{
                            borderColor: selectedServices.includes(service.name) ? colors.text.white : colors.border.dark
                          }}
                        >
                          <div className="flex items-center flex-grow mr-4">
                            <span className={`${colors.text.white} ${typography.fontFamily.light} mr-2`}>•</span>
                            <span className={`${colors.text.white} ${typography.fontFamily.light}`}>{service.name}</span>
                          </div>
                          <span className={`${typography.fontFamily.light} ${colors.text.white} mr-4`}>${service.price}/mo</span>
                          <button
                            onClick={() => toggleService(service.name)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent ${transitions.colors} ${effects.focus.outline}`}
                            style={{ 
                              backgroundColor: selectedServices.includes(service.name) ? colors.text.white : colors.border.light
                            }}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 ${transitions.all} ${
                                selectedServices.includes(service.name) ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </NeonCard>
                </div>
              ))}
            </div>

            <NeonCard className="mt-8 max-w-md mx-auto p-6">
              <div className="flex flex-col items-center w-full">
                <span className={`${colors.text.white} ${typography.fontFamily.light} mb-2 text-center`}>Total Monthly Investment</span>
                <span className={`${typography.fontSize['3xl']} ${typography.fontFamily.light} ${colors.text.white} mb-4 text-center`}>${calculateTotal()}/mo</span>
              </div>
            </NeonCard>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} plan={plan} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}; 