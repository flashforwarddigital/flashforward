import React, { useState } from 'react';
import { colors, typography, spacing } from '../../theme/theme';
import { NeonCard } from './NeonCard';
import { AnimatePresence } from 'framer-motion';
import { posthog } from '../../lib/posthog';

// Import individual service popups
import WebDesignPopup from './service-popups/WebDesignPopup';
import BrandingPopup from './service-popups/BrandingPopup';
import ContentCreationPopup from './service-popups/ContentCreationPopup';
import AIAutomationPopup from './service-popups/AIAutomationPopup';
import SocialMediaPopup from './service-popups/SocialMediaPopup';
import GrowthStrategyPopup from './service-popups/GrowthStrategyPopup';

interface ServicesSectionProps {
  className?: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  color: string;
  buttonColor: string;
}

const services: Service[] = [
  {
    id: "web-design",
    title: "Web Design & Development",
    description: "Custom websites that look great and perform even better. We build with modern tech and focus on user experience.",
    color: colors.text.white,
    buttonColor: colors.primary.blue, // #008CFF
  },
  {
    id: "branding",
    title: "Branding & Identity",
    description: "Create a memorable brand that stands out. We help you develop your visual identity and brand guidelines.",
    color: colors.text.white,
    buttonColor: colors.primary.yellow, // #FFCC00
  },
  {
    id: "content",
    title: "Content Creation",
    description: "Engaging content that tells your story. From copywriting to video production, we've got you covered.",
    color: colors.text.white,
    buttonColor: colors.primary.pink, // #FF1493
  },
  {
    id: "ai",
    title: "AI & Automation",
    description: "Leverage the power of AI to streamline your business. We implement smart solutions that save time and money.",
    color: colors.text.white,
    buttonColor: colors.primary.green, // #00CC66
  },
  {
    id: "social",
    title: "Social Media",
    description: "Build your presence on social media. We create and manage content that engages your audience.",
    color: colors.text.white,
    buttonColor: colors.primary.purple, // #9933FF
  },
  {
    id: "growth",
    title: "Growth Strategy",
    description: "Scale your business with data-driven strategies. We help you identify and capture new opportunities.",
    color: colors.text.white,
    buttonColor: colors.primary.orange, // #FF6600
  }
];

const ServiceCard: React.FC<{ service: Service; index: number; onOpenDetails: () => void }> = ({ service, index, onOpenDetails }) => {
  return (
    <NeonCard index={index} hasPadding={true}>
      <div className="flex flex-col h-full">
        <h3 
          className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} mb-4`}
          style={{ color: colors.text.white }}
        >
          {service.title}
        </h3>
        <p className={`${colors.text.gray[400]} ${typography.fontFamily.light} ${typography.tracking.tight} flex-grow`}>
          {service.description}
        </p>
        <button 
          onClick={() => {
            posthog.capture('service_learn_more_clicked', { service_id: service.id });
            onOpenDetails();
          }}
          className="mt-4 px-4 py-2 text-black rounded-md transition-colors duration-300 text-sm font-light tracking-tight"
          style={{ 
            backgroundColor: service.buttonColor,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = `${service.buttonColor}dd`;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = service.buttonColor;
          }}
        >
          Learn More
        </button>
      </div>
    </NeonCard>
  );
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ className = "" }) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const openServiceDetails = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    posthog.capture('service_details_opened', { service_id: serviceId });
  };

  const closeServiceDetails = () => {
    posthog.capture('service_details_closed', { service_id: selectedServiceId });
    setSelectedServiceId(null);
  };

  // Render the appropriate popup based on the selected service
  const renderServicePopup = () => {
    switch (selectedServiceId) {
      case 'web-design':
        return <WebDesignPopup onClose={closeServiceDetails} />;
      case 'branding':
        return <BrandingPopup onClose={closeServiceDetails} />;
      case 'content':
        return <ContentCreationPopup onClose={closeServiceDetails} />;
      case 'ai':
        return <AIAutomationPopup onClose={closeServiceDetails} />;
      case 'social':
        return <SocialMediaPopup onClose={closeServiceDetails} />;
      case 'growth':
        return <GrowthStrategyPopup onClose={closeServiceDetails} />;
      default:
        return null;
    }
  };

  return (
    <section id="services" className={`${spacing.section.padding} ${typography.tracking.tight} bg-black/50 ${className}`}>
      <div className={`container mx-auto ${spacing.container.padding}`}>
        <h2 className={`${typography.fontSize['4xl']} sm:text-5xl lg:text-[64px] ${colors.text.white} text-center mb-12 ${typography.tracking.tighter} font-bold`}>
          our services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={index} 
              onOpenDetails={() => openServiceDetails(service.id)}
            />
          ))}
        </div>
      </div>
      
      <AnimatePresence>
        {selectedServiceId && renderServicePopup()}
      </AnimatePresence>
    </section>
  );
};