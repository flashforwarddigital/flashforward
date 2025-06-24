import React, { useState, useEffect } from 'react';
import { Bot, Image, Mic, X, Video, Phone, Users, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModernChatbot from './ModernChatbot';
import ModernImageGenerator from './ModernImageGenerator';
import ModernVoiceAssistant from './ModernVoiceAssistant';
import ComingSoonTool from './ComingSoonTool';

interface AIToolsProps {
  className?: string;
}

type ToolType = 'chatbot' | 'image-generator' | 'voice-assistant' | 'video-generator' | 'voice-sales' | 'lead-generator' | 'ai-assistant';

const AITools: React.FC<AIToolsProps> = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState<ToolType>('chatbot');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className={`fixed bottom-16 md:bottom-24 right-4 md:right-6 z-40 ${className}`}>
      {/* Floating button */}
      <button
        onClick={toggleOpen}
        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg"
      >
        <Bot size={isMobile ? 20 : 24} />
      </button>
      
      {/* AI Tools Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-[90vw] md:w-[400px] h-[80vh] md:h-[500px] bg-[#0a0a0a] rounded-lg border border-gray-800 shadow-xl overflow-hidden"
            style={{ maxWidth: isMobile ? '90vw' : '400px', maxHeight: isMobile ? '80vh' : '500px' }}
          >
            <div className="flex justify-between items-center p-3 border-b border-gray-800">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab('chatbot')}
                  className={`p-2 rounded-md ${activeTab === 'chatbot' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  <Bot size={isMobile ? 18 : 20} />
                </button>
                <button
                  onClick={() => setActiveTab('image-generator')}
                  className={`p-2 rounded-md ${activeTab === 'image-generator' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  <Image size={isMobile ? 18 : 20} />
                </button>
                <button
                  onClick={() => setActiveTab('voice-assistant')}
                  className={`p-2 rounded-md ${activeTab === 'voice-assistant' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  <Mic size={isMobile ? 18 : 20} />
                </button>
                <button
                  onClick={() => setActiveTab('video-generator')}
                  className={`p-2 rounded-md ${activeTab === 'video-generator' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  <Video size={isMobile ? 18 : 20} />
                </button>
              </div>
              <button
                onClick={toggleOpen}
                className="text-gray-400 hover:text-white p-2 rounded-md hover:bg-gray-800"
              >
                <X size={isMobile ? 18 : 20} />
              </button>
            </div>
            
            <div className="h-[calc(100%-48px)]">
              {activeTab === 'chatbot' && <ModernChatbot />}
              {activeTab === 'image-generator' && <ModernImageGenerator />}
              {activeTab === 'voice-assistant' && <ModernVoiceAssistant />}
              {activeTab === 'video-generator' && (
                <ComingSoonTool 
                  title="Video Generator" 
                  description="Our AI video generation technology will transform your text prompts into professional-quality videos."
                  icon={<Video size={isMobile ? 20 : 24} />}
                  fallbackDays={14}
                  color="#FF1493"
                />
              )}
              {activeTab === 'voice-sales' && (
                <ComingSoonTool 
                  title="Voice Sales Agent" 
                  description="Our AI voice sales agents will handle customer inquiries, qualify leads, and book appointments without human intervention."
                  icon={<Phone size={isMobile ? 20 : 24} />}
                  fallbackDays={7}
                  color="#FF6600"
                />
              )}
              {activeTab === 'lead-generator' && (
                <ComingSoonTool 
                  title="Lead Generator" 
                  description="Our AI lead generation system will automatically identify and engage potential customers across digital channels."
                  icon={<Users size={isMobile ? 20 : 24} />}
                  fallbackDays={14}
                  color="#9933FF"
                />
              )}
              {activeTab === 'ai-assistant' && (
                <ComingSoonTool 
                  title="AI Assistant" 
                  description="Our AI personal assistant will help you stay organized, manage tasks, and boost your productivity."
                  icon={<Sparkles size={isMobile ? 20 : 24} />}
                  fallbackDays={17.5}
                  color="#6366F1"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AITools;