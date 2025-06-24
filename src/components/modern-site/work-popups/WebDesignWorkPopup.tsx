import React, { useState, useEffect } from 'react';
import { colors, typography } from '../../../theme/theme';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WebDesignWorkPopupProps {
  onClose: () => void;
}

interface WebsiteProject {
  id: string;
  title: string;
  url: string;
  description: string;
  technologies: string[];
  features: string[];
  imageUrl: string;
  color: string;
}

const WebDesignWorkPopup: React.FC<WebDesignWorkPopupProps> = ({ onClose }) => {
  const buttonColor = colors.primary.blue; // #008CFF
  
  const [currentProject, setCurrentProject] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [showIframe, setShowIframe] = useState(false);
  
  const websiteProjects: WebsiteProject[] = [
    {
      id: 'mg-accounting',
      title: 'MG Accounting',
      url: 'https://www.mgaccounting.com.au/',
      description: `A professional website for an accounting firm that balances corporate trustworthiness with approachable design. The site features clear service descriptions, team profiles, and contact information to convert visitors into clients.`,
      technologies: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
      features: ['Responsive Design', 'Service Showcases', 'Team Profiles', 'Contact Form Integration'],
      imageUrl: '/mgaccounting.png',
      color: '#008CFF'
    },
    {
      id: 'followfuse',
      title: 'FollowFuse',
      url: 'https://www.followfuse.com/',
      description: `A dynamic platform for social media management and analytics. The website presents a modern, tech-forward aesthetic with interactive elements that demonstrate the product's capabilities.`,
      technologies: ['React', 'TypeScript', 'Styled Components', 'Chart.js'],
      features: ['Interactive Dashboard Demo', 'Feature Showcase', 'Pricing Tables', 'User Testimonials'],
      imageUrl: '/followfuse.png',
      color: '#FF1493'
    },
    {
      id: 'boostr',
      title: 'Boostr',
      url: 'https://boostr-seven.vercel.app/',
      description: `A performance-focused website for a fitness coaching platform. The design emphasizes motivation and results with strong visuals and clear calls to action.`,
      technologies: ['Next.js', 'Tailwind CSS', 'Supabase', 'Vercel'],
      features: ['Program Showcases', 'Coach Profiles', 'Testimonial Carousel', 'Membership Portal'],
      imageUrl: '/brands/boostr.png',
      color: '#FFCC00'
    },
    {
      id: '1-step-ahead',
      title: '1 Step Ahead',
      url: 'https://1stepahead.vercel.app/',
      description: `An educational platform website with a clean, intuitive design that prioritizes content accessibility and user engagement. The site features course listings, instructor profiles, and learning resources.`,
      technologies: ['React', 'Next.js', 'Material UI', 'MongoDB'],
      features: ['Course Catalog', 'Learning Dashboard', 'Progress Tracking', 'Resource Library'],
      imageUrl: '/1stepahead.png',
      color: '#00CC66'
    },
    {
      id: 'followfuseapp',
      title: 'FollowFuseApp',
      url: 'https://followfuseapp.com/',
      description: `A mobile app landing page that showcases the FollowFuse application's features and benefits. The design uses app screenshots and interactive elements to demonstrate functionality.`,
      technologies: ['React', 'Gatsby', 'Tailwind CSS', 'Netlify'],
      features: ['App Feature Showcase', 'Interactive Demo', 'Download Links', 'User Reviews'],
      imageUrl: '/followfuseapp.png',
      color: '#9933FF'
    },
    {
      id: 'timelox',
      title: 'Timelox',
      url: 'https://timelox-website.vercel.app/',
      description: `A sleek, modern website for a time management application. The design emphasizes productivity and efficiency with a clean interface and subtle animations.`,
      technologies: ['Vue.js', 'Nuxt.js', 'SCSS', 'Firebase'],
      features: ['Feature Tours', 'Pricing Plans', 'User Testimonials', 'Blog Section'],
      imageUrl: '/timelox.png',
      color: '#FF6600'
    }
  ];
  
  const nextProject = () => {
    setIsImageLoading(true);
    setIframeLoading(true);
    setShowIframe(false);
    setCurrentProject((prev) => (prev + 1) % websiteProjects.length);
  };
  
  const prevProject = () => {
    setIsImageLoading(true);
    setIframeLoading(true);
    setShowIframe(false);
    setCurrentProject((prev) => (prev - 1 + websiteProjects.length) % websiteProjects.length);
  };
  
  const project = websiteProjects[currentProject];

  // Reset iframe loading state when project changes
  useEffect(() => {
    setIframeLoading(true);
    setShowIframe(false);
  }, [currentProject]);
  
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
        <div className="flex justify-between items-center p-6 border-b border-gray-800" 
             style={{ background: `linear-gradient(90deg, #1a1a1a, ${project.color}40)` }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${project.color}40` }}>
              <ExternalLink size={18} style={{ color: project.color }} />
            </div>
            <h2 className={`${typography.fontSize['2xl']} ${typography.fontFamily.light} ${typography.tracking.tight} text-white`}>
              Website Projects
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* Project Navigation Sidebar */}
          <div className="lg:col-span-1 bg-black/30 p-4 lg:max-h-[70vh] overflow-y-auto border-r border-gray-800">
            <h3 className="text-gray-400 text-sm uppercase mb-4 font-light">Our Websites</h3>
            <div className="space-y-2">
              {websiteProjects.map((proj, index) => (
                <button
                  key={proj.id}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                    currentProject === index 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-400 hover:bg-gray-900 hover:text-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsImageLoading(true);
                    setIframeLoading(true);
                    setShowIframe(false);
                    setCurrentProject(index);
                  }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: proj.color }}></div>
                  <span className="font-light tracking-tight">{proj.title}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Project Details */}
          <div className="lg:col-span-4 p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Project Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className={`${typography.fontSize['3xl']} ${typography.fontFamily.light} ${typography.tracking.tight}`} style={{ color: project.color }}>
                      {project.title}
                    </h3>
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white flex items-center gap-2 mt-1"
                    >
                      <span>{project.url}</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg text-black transition-colors duration-300 text-sm font-light tracking-tight flex items-center gap-2"
                      style={{ 
                        backgroundColor: project.color,
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = `${project.color}dd`;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = project.color;
                      }}
                    >
                      <span>Visit Website</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
                
                {/* Project Image or Iframe */}
                <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden border border-gray-800">
                  {/* Loading indicator */}
                  {isImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-10 h-10 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  {/* Static image preview */}
                  {!showIframe && (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onLoad={() => setIsImageLoading(false)}
                      style={{ opacity: isImageLoading ? 0 : 1 }}
                    />
                  )}
                  
                  {/* Live website iframe */}
                  {showIframe && (
                    <div className="w-full h-full\" style={{ opacity: iframeLoading ? 0 : 1 }}>
                      <iframe
                        src={project.url}
                        title={project.title}
                        className="w-full h-full border-0"
                        onLoad={() => setIframeLoading(false)}
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  )}
                  
                  {/* Navigation Arrows */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      prevProject();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      nextProject();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                
                {/* Project Description */}
                <div>
                  <h4 className="text-white text-lg font-light mb-2">About the Project</h4>
                  <p className="text-gray-300">{project.description}</p>
                </div>
                
                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white text-lg font-light mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 rounded-full text-sm"
                          style={{ 
                            backgroundColor: `${project.color}20`,
                            color: project.color
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white text-lg font-light mb-3">Key Features</h4>
                    <ul className="space-y-1">
                      {project.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: project.color }}></div>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Project Navigation */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevProject();
                    }}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronLeft size={16} />
                    <span>Previous Project</span>
                  </button>
                  <div className="flex gap-1">
                    {websiteProjects.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsImageLoading(true);
                          setIframeLoading(true);
                          setShowIframe(false);
                          setCurrentProject(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          currentProject === index 
                            ? 'bg-white' 
                            : 'bg-gray-600 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextProject();
                    }}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <span>Next Project</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
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

export default WebDesignWorkPopup;