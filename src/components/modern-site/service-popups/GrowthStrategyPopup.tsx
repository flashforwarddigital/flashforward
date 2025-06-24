import React from 'react';
import { colors, typography } from '../../../theme/theme';
import { X, TrendingUp, Target, Users, BarChart3, Megaphone, Search, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface GrowthStrategyPopupProps {
  onClose: () => void;
}

interface GrowthService {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const GrowthStrategyPopup: React.FC<GrowthStrategyPopupProps> = ({ onClose }) => {
  const buttonColor = colors.primary.orange; // #FF6600
  
  const growthServices: GrowthService[] = [
    {
      id: 'growth-strategy',
      title: 'Growth Strategy',
      description: 'Comprehensive growth planning and execution to scale your business effectively and sustainably.',
      icon: <TrendingUp size={32} className="text-orange-400" />
    },
    {
      id: 'conversion-optimization',
      title: 'Conversion Rate Optimization',
      description: 'Data-driven strategies to increase the percentage of visitors who convert into customers or leads.',
      icon: <Target size={32} className="text-blue-400" />
    },
    {
      id: 'user-acquisition',
      title: 'User Acquisition',
      description: 'Strategic campaigns and funnels designed to attract and convert high-quality users and customers.',
      icon: <Users size={32} className="text-green-400" />
    },
    {
      id: 'analytics-tracking',
      title: 'Analytics & Tracking',
      description: 'Advanced analytics setup and monitoring to track key performance indicators and user behavior.',
      icon: <BarChart3 size={32} className="text-purple-400" />
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing',
      description: 'Multi-channel digital marketing campaigns to reach and engage your target audience effectively.',
      icon: <Megaphone size={32} className="text-pink-400" />
    },
    {
      id: 'seo-optimization',
      title: 'SEO Optimization',
      description: 'Comprehensive search engine optimization to improve your website\'s visibility and organic traffic.',
      icon: <Search size={32} className="text-yellow-400" />
    },
    {
      id: 'international-expansion',
      title: 'International Expansion',
      description: 'Strategic guidance and execution for expanding your business into new global markets.',
      icon: <Globe size={32} className="text-cyan-400" />
    },
    {
      id: 'performance-marketing',
      title: 'Performance Marketing',
      description: 'ROI-focused marketing campaigns with measurable results and continuous optimization.',
      icon: <Zap size={32} className="text-red-400" />
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
            Growth Strategy
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
              Scale your business with data-driven strategies that identify and capture new opportunities. Our growth services help you achieve sustainable expansion:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {growthServices.map((service) => (
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
              Our Growth Framework
            </h3>
            
            <div className="bg-black/20 p-6 rounded-lg border border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-orange-400 text-2xl font-bold">1</span>
                  </div>
                  <h4 className="text-orange-400 font-light mb-2">Analyze</h4>
                  <p className="text-gray-400 text-sm">We analyze your current performance, market position, and competitive landscape.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-orange-400 text-2xl font-bold">2</span>
                  </div>
                  <h4 className="text-orange-400 font-light mb-2">Strategize</h4>
                  <p className="text-gray-400 text-sm">We develop a tailored growth strategy based on data-driven insights and business goals.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-orange-400 text-2xl font-bold">3</span>
                  </div>
                  <h4 className="text-orange-400 font-light mb-2">Execute</h4>
                  <p className="text-gray-400 text-sm">We implement the strategy with precision, agility, and attention to detail.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-orange-400 text-2xl font-bold">4</span>
                  </div>
                  <h4 className="text-orange-400 font-light mb-2">Optimize</h4>
                  <p className="text-gray-400 text-sm">We continuously measure results, learn, and refine our approach for maximum impact.</p>
                </div>
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

export default GrowthStrategyPopup;