import React from 'react';
import { colors, typography } from '../../../theme/theme';
import { X, Globe, Code, Smartphone, Zap, ShieldCheck, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface WebDesignPopupProps {
  onClose: () => void;
}

interface WebService {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const WebDesignPopup: React.FC<WebDesignPopupProps> = ({ onClose }) => {
  const buttonColor = colors.primary.blue; // #008CFF
  
  const webServices: WebService[] = [
    {
      id: 'custom-websites',
      title: 'Custom Website Design',
      description: 'Bespoke websites designed to reflect your brand identity and meet your specific business needs.',
      icon: <Globe size={32} className="text-blue-400" />
    },
    {
      id: 'ecommerce',
      title: 'E-commerce Solutions',
      description: 'Powerful online stores with secure payment processing, inventory management, and seamless user experience.',
      icon: <ShieldCheck size={32} className="text-green-400" />
    },
    {
      id: 'responsive-design',
      title: 'Responsive Design',
      description: 'Websites that look and function perfectly on all devices, from desktops to smartphones.',
      icon: <Smartphone size={32} className="text-yellow-400" />
    },
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'Clean, efficient code that ensures your website is fast, secure, and easy to maintain.',
      icon: <Code size={32} className="text-pink-400" />
    },
    {
      id: 'performance-optimization',
      title: 'Performance Optimization',
      description: 'Speed up your website for better user experience and improved search engine rankings.',
      icon: <Zap size={32} className="text-purple-400" />
    },
    {
      id: 'analytics-integration',
      title: 'Analytics & Tracking',
      description: 'Comprehensive analytics setup to track user behavior and measure your website\'s performance.',
      icon: <BarChart3 size={32} className="text-indigo-400" />
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
            Web Design & Development
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
              We create stunning, high-performance websites that captivate your audience and drive results. Our web design and development services include:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webServices.map((service) => (
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
          
          <div className="mt-12">
            <h3 className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} text-white mb-4`}>
              Our Web Development Process
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/20 p-6 rounded-lg border border-gray-800">
                <h4 className="text-blue-400 font-light mb-2">1. Discovery & Planning</h4>
                <p className="text-gray-400 text-sm">We start by understanding your business goals, target audience, and requirements to create a strategic plan for your website.</p>
              </div>
              
              <div className="bg-black/20 p-6 rounded-lg border border-gray-800">
                <h4 className="text-blue-400 font-light mb-2">2. Design & Prototyping</h4>
                <p className="text-gray-400 text-sm">Our designers create wireframes and visual designs that align with your brand and provide optimal user experience.</p>
              </div>
              
              <div className="bg-black/20 p-6 rounded-lg border border-gray-800">
                <h4 className="text-blue-400 font-light mb-2">3. Development</h4>
                <p className="text-gray-400 text-sm">Our developers bring the designs to life with clean, efficient code, ensuring your website is fast, responsive, and secure.</p>
              </div>
              
              <div className="bg-black/20 p-6 rounded-lg border border-gray-800">
                <h4 className="text-blue-400 font-light mb-2">4. Testing & Launch</h4>
                <p className="text-gray-400 text-sm">We rigorously test your website across devices and browsers before launching it to ensure everything works perfectly.</p>
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

export default WebDesignPopup;