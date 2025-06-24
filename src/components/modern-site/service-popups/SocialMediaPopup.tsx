import React from 'react';
import { colors, typography } from '../../../theme/theme';
import { X, Instagram, Facebook, Twitter, Linkedin, Youtube, TrendingUp, BarChart3, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface SocialMediaPopupProps {
  onClose: () => void;
}

interface SocialService {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SocialMediaPopup: React.FC<SocialMediaPopupProps> = ({ onClose }) => {
  const buttonColor = colors.primary.purple; // #9933FF
  
  const socialServices: SocialService[] = [
    {
      id: 'social-strategy',
      title: 'Social Media Strategy',
      description: 'Comprehensive social media strategies tailored to your business goals, target audience, and industry.',
      icon: <TrendingUp size={32} className="text-purple-400" />
    },
    {
      id: 'content-creation',
      title: 'Social Content Creation',
      description: 'Engaging, platform-specific content that resonates with your audience and reflects your brand voice.',
      icon: <Calendar size={32} className="text-blue-400" />
    },
    {
      id: 'community-management',
      title: 'Community Management',
      description: 'Active engagement with your audience to build relationships, answer questions, and foster community.',
      icon: <BarChart3 size={32} className="text-green-400" />
    },
    {
      id: 'instagram',
      title: 'Instagram Marketing',
      description: 'Strategic Instagram campaigns that leverage feed posts, Stories, Reels, and IGTV to grow your presence.',
      icon: <Instagram size={32} className="text-pink-400" />
    },
    {
      id: 'facebook',
      title: 'Facebook Marketing',
      description: 'Comprehensive Facebook strategies including organic content, groups, and targeted advertising.',
      icon: <Facebook size={32} className="text-blue-400" />
    },
    {
      id: 'twitter',
      title: 'Twitter Marketing',
      description: 'Real-time engagement and content strategies to build your brand presence on Twitter.',
      icon: <Twitter size={32} className="text-cyan-400" />
    },
    {
      id: 'linkedin',
      title: 'LinkedIn Marketing',
      description: 'Professional content and networking strategies to establish thought leadership and generate B2B leads.',
      icon: <Linkedin size={32} className="text-blue-600" />
    },
    {
      id: 'youtube',
      title: 'YouTube Marketing',
      description: 'Video content strategies to grow your YouTube channel and engage your audience with compelling content.',
      icon: <Youtube size={32} className="text-red-500" />
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
            Social Media
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
              Build your presence on social media with strategies and content that engage your audience and drive meaningful results. Our social media services include:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialServices.map((service) => (
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
              Our Social Media Approach
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp size={32} className="text-purple-400" />
                </div>
                <h4 className="text-purple-400 font-light mb-2">Strategy First</h4>
                <p className="text-gray-400 text-sm">We develop data-driven strategies based on your audience, goals, and competitive landscape.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <Calendar size={32} className="text-purple-400" />
                </div>
                <h4 className="text-purple-400 font-light mb-2">Consistent Execution</h4>
                <p className="text-gray-400 text-sm">We maintain a consistent posting schedule with high-quality, engaging content.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 size={32} className="text-purple-400" />
                </div>
                <h4 className="text-purple-400 font-light mb-2">Measure & Optimize</h4>
                <p className="text-gray-400 text-sm">We continuously analyze performance and refine our approach to maximize results.</p>
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

export default SocialMediaPopup;