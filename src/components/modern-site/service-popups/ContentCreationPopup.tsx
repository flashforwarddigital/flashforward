import React from 'react';
import { colors, typography } from '../../../theme/theme';
import { X, FileText, Video, Camera, Mic, PenTool, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContentCreationPopupProps {
  onClose: () => void;
}

interface ContentService {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ContentCreationPopup: React.FC<ContentCreationPopupProps> = ({ onClose }) => {
  const buttonColor = colors.primary.pink; // #FF1493
  
  const contentServices: ContentService[] = [
    {
      id: 'copywriting',
      title: 'Copywriting',
      description: 'Compelling, persuasive copy that engages your audience and drives action across websites, emails, and marketing materials.',
      icon: <FileText size={32} className="text-pink-400" />
    },
    {
      id: 'video-production',
      title: 'Video Production',
      description: 'High-quality video content from concept to final edit, including promotional videos, explainers, testimonials, and more.',
      icon: <Video size={32} className="text-blue-400" />
    },
    {
      id: 'photography',
      title: 'Photography',
      description: 'Professional photography services to capture your products, team, and brand essence with stunning visual quality.',
      icon: <Camera size={32} className="text-green-400" />
    },
    {
      id: 'podcast-production',
      title: 'Podcast Production',
      description: 'End-to-end podcast production including concept development, recording, editing, and distribution strategy.',
      icon: <Mic size={32} className="text-purple-400" />
    },
    {
      id: 'graphic-design',
      title: 'Graphic Design',
      description: 'Eye-catching graphics for social media, marketing materials, presentations, and other visual content needs.',
      icon: <PenTool size={32} className="text-yellow-400" />
    },
    {
      id: 'content-strategy',
      title: 'Content Strategy',
      description: 'Comprehensive content planning that aligns with your business goals and resonates with your target audience.',
      icon: <Share2 size={32} className="text-red-400" />
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
            Content Creation
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
              Engaging content is the cornerstone of effective digital marketing. We create compelling content that tells your story, showcases your expertise, and connects with your audience:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentServices.map((service) => (
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
              Our Content Creation Process
            </h3>
            
            <div className="bg-black/20 p-6 rounded-lg border border-gray-800">
              <ol className="space-y-6">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">1</div>
                  <div>
                    <h4 className="text-pink-400 font-light mb-1">Strategy & Planning</h4>
                    <p className="text-gray-400 text-sm">We begin by understanding your audience, goals, and brand voice to develop a content strategy that aligns with your business objectives.</p>
                  </div>
                </li>
                
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">2</div>
                  <div>
                    <h4 className="text-pink-400 font-light mb-1">Creation & Production</h4>
                    <p className="text-gray-400 text-sm">Our team of specialists creates high-quality content tailored to your specific needs and target platforms.</p>
                  </div>
                </li>
                
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">3</div>
                  <div>
                    <h4 className="text-pink-400 font-light mb-1">Review & Refinement</h4>
                    <p className="text-gray-400 text-sm">We collaborate with you to review and refine the content until it perfectly captures your vision and meets your standards.</p>
                  </div>
                </li>
                
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">4</div>
                  <div>
                    <h4 className="text-pink-400 font-light mb-1">Distribution & Optimization</h4>
                    <p className="text-gray-400 text-sm">We help you distribute your content effectively and continuously analyze performance to optimize future content.</p>
                  </div>
                </li>
              </ol>
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

export default ContentCreationPopup;