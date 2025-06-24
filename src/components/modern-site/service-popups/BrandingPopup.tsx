import React from 'react';
import { colors, typography } from '../../../theme/theme';
import { X, Palette, Layers, PenTool, Lightbulb, MessageSquare, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

interface BrandingPopupProps {
  onClose: () => void;
}

interface BrandingService {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const BrandingPopup: React.FC<BrandingPopupProps> = ({ onClose }) => {
  const buttonColor = colors.primary.yellow; // #FFCC00
  
  const brandingServices: BrandingService[] = [
    {
      id: 'brand-strategy',
      title: 'Brand Strategy',
      description: 'Develop a comprehensive brand strategy that defines your positioning, voice, and values to connect with your target audience.',
      icon: <Compass size={32} className="text-yellow-400" />
    },
    {
      id: 'visual-identity',
      title: 'Visual Identity',
      description: 'Create a distinctive visual identity including logos, color palettes, typography, and design elements that represent your brand.',
      icon: <Palette size={32} className="text-blue-400" />
    },
    {
      id: 'logo-design',
      title: 'Logo Design',
      description: 'Design a memorable, versatile logo that captures your brand essence and works across all platforms and materials.',
      icon: <PenTool size={32} className="text-pink-400" />
    },
    {
      id: 'brand-guidelines',
      title: 'Brand Guidelines',
      description: 'Develop comprehensive brand guidelines to ensure consistent application of your brand across all touchpoints.',
      icon: <Layers size={32} className="text-purple-400" />
    },
    {
      id: 'brand-messaging',
      title: 'Brand Messaging',
      description: 'Craft clear, compelling messaging that communicates your brand\'s value proposition and resonates with your audience.',
      icon: <MessageSquare size={32} className="text-green-400" />
    },
    {
      id: 'brand-experience',
      title: 'Brand Experience',
      description: 'Design cohesive brand experiences across digital and physical touchpoints to build strong emotional connections.',
      icon: <Lightbulb size={32} className="text-orange-400" />
    }
  ];
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-[#1a1a1a] rounded-lg border border-gray-800 w-full max-w-5xl max-h-[90vh] overflow-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className={`${typography.fontSize['2xl']} ${typography.fontFamily.light} ${typography.tracking.tight} text-white`}>
            Branding & Identity
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-8">
            <p className={`${typography.fontSize.lg} ${typography.fontFamily.light} ${typography.tracking.tight} text-gray-300`}>
              Your brand is more than just a logo—it's the emotional connection you build with your audience. We help you create a memorable brand that stands out in the digital landscape:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandingServices.map((service) => (
              <motion.div 
                key={service.id}
                className="bg-black/30 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
                whileHover={{ y: -5 }}
              >
                <div className="mb-4">
                  {service.icon}
                </div>
                <h3 className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} text-white mb-2`}>
                  {service.title}
                </h3>
                <p className={`${typography.fontSize.sm} ${typography.fontFamily.light} ${typography.tracking.tight} text-gray-400`}>
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 bg-black/20 p-6 rounded-lg border border-gray-800">
            <h3 className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} text-white mb-4`}>
              Why Branding Matters
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-yellow-400 font-light mb-2">Recognition & Trust</h4>
                <p className="text-gray-400 text-sm mb-4">A consistent, professional brand builds recognition and trust with your audience, making them more likely to choose you over competitors.</p>
                
                <h4 className="text-yellow-400 font-light mb-2">Emotional Connection</h4>
                <p className="text-gray-400 text-sm">Strong branding creates an emotional connection with your audience, fostering loyalty and advocacy.</p>
              </div>
              
              <div>
                <h4 className="text-yellow-400 font-light mb-2">Differentiation</h4>
                <p className="text-gray-400 text-sm mb-4">In crowded markets, distinctive branding helps you stand out and communicate your unique value proposition.</p>
                
                <h4 className="text-yellow-400 font-light mb-2">Increased Value</h4>
                <p className="text-gray-400 text-sm">Companies with strong, consistent branding are perceived as more valuable and can command premium pricing.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-black rounded-md transition-colors duration-300 text-sm font-light tracking-tight"
            style={{ 
              backgroundColor: buttonColor,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = `${buttonColor}dd`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = buttonColor;
            }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BrandingPopup;