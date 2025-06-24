import React from 'react';
import { colors, typography } from '../../../theme/theme';
import { X, Bot, Mic, Image, Video, Phone, Users, Mail, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIAutomationPopupProps {
  onClose: () => void;
}

interface AIService {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const AIAutomationPopup: React.FC<AIAutomationPopupProps> = ({ onClose }) => {
  const buttonColor = colors.primary.green; // #00CC66
  
  const aiServices: AIService[] = [
    {
      id: 'chatbot',
      title: 'Chatbot',
      description: 'Intelligent conversational agents that engage with your customers 24/7, answering questions and providing support.',
      icon: <Bot size={32} className="text-blue-400" />
    },
    {
      id: 'voicebot',
      title: 'Voicebot',
      description: 'Voice-activated assistants that provide a natural, hands-free way for users to interact with your services.',
      icon: <Mic size={32} className="text-green-400" />
    },
    {
      id: 'image-generation',
      title: 'Image Generation',
      description: 'Create unique, custom visuals for your brand with AI-powered image generation tools.',
      icon: <Image size={32} className="text-yellow-400" />
    },
    {
      id: 'video-generation',
      title: 'Video Generation',
      description: 'Transform text into engaging video content with AI video generation technology.',
      icon: <Video size={32} className="text-red-400" />
    },
    {
      id: 'voice-sales',
      title: 'Voice Sales Agent',
      description: 'AI-powered sales representatives that can qualify leads and book appointments without human intervention.',
      icon: <Phone size={32} className="text-pink-400" />
    },
    {
      id: 'lead-generator',
      title: 'Lead Generator',
      description: 'Automated systems that identify and engage potential customers across digital channels.',
      icon: <Users size={32} className="text-purple-400" />
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Personalized digital assistants that help streamline workflows and boost productivity.',
      icon: <Bot size={32} className="text-indigo-400" />
    },
    {
      id: 'email-assistant',
      title: 'Email Inbox Assistant',
      description: 'Smart tools that categorize, prioritize, and help respond to emails efficiently.',
      icon: <Mail size={32} className="text-blue-400" />
    },
    {
      id: 'seo-optimizer',
      title: 'SEO Optimizer',
      description: 'AI-driven analysis and recommendations to improve your content\'s search engine performance.',
      icon: <Search size={32} className="text-green-400" />
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
            AI & Automation
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
              Our AI solutions help businesses automate processes, enhance customer experiences, and gain valuable insights. Here are some of the AI services we offer:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiServices.map((service) => (
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

export default AIAutomationPopup;