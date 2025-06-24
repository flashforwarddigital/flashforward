import React, { useState } from 'react';

const PricingWindow: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      title: 'Basic Website Package',
      icon: '/WEBSITES.png',
      features: [
        'Custom Website Design',
        'Mobile Responsive',
        'Contact Form',
        'Basic SEO Setup',
        '1 Month Support'
      ],
      price: '$999',
      recommended: false
    },
    {
      title: 'Pro Business Package',
      icon: '/BRANDING.png',
      features: [
        'Everything in Basic',
        'E-commerce Integration',
        'Content Management System',
        'Advanced SEO',
        '3 Months Support',
        'Social Media Setup'
      ],
      price: '$2,499',
      recommended: true
    },
    {
      title: 'Enterprise Solution',
      icon: '/AI.png',
      features: [
        'Everything in Pro',
        'Custom Features',
        'API Integration',
        'Performance Optimization',
        '6 Months Support',
        'Analytics Setup',
        'Training & Documentation'
      ],
      price: '$4,999',
      recommended: false
    }
  ];

  return (
    <div className="win95-pricing">
      <div className="win95-pricing-header">
        <img src="/flashforward.png" alt="Flash Forward" className="win95-pricing-logo" />
        <h2 className="win95-pricing-title">Pricing Plans</h2>
      </div>
      
      <div className="win95-pricing-list">
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`win95-pricing-item ${selectedPlan === plan.title ? 'selected' : ''} ${plan.recommended ? 'recommended' : ''}`}
            onClick={() => setSelectedPlan(plan.title)}
          >
            <div className="win95-pricing-item-header">
              <img src={plan.icon} alt={plan.title} className="win95-pricing-item-icon" />
              <h3 className="win95-pricing-item-title">{plan.title}</h3>
              {plan.recommended && (
                <div className="win95-pricing-recommended">Recommended</div>
              )}
            </div>
            <div className="win95-pricing-item-content">
              <div className="win95-pricing-item-price">{plan.price}</div>
              <div className="win95-pricing-item-features">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="win95-pricing-feature">
                    <span className="win95-pricing-checkmark">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
              <button className="win95-button">Select Plan</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingWindow;