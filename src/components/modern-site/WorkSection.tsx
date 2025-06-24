import React, { useState } from 'react';
import { colors, typography, spacing, transitions } from '../../theme/theme';
import { NeonCard } from './NeonCard';
import { AnimatePresence } from 'framer-motion';
import WebDesignWorkPopup from './work-popups/WebDesignWorkPopup';
import VideosWorkPopup from './work-popups/VideosWorkPopup';
import BrandingWorkPopup from './work-popups/BrandingWorkPopup';
import DesignWorkPopup from './work-popups/DesignWorkPopup';
import AIWorkPopup from './work-popups/AIWorkPopup';
import GrowthWorkPopup from './work-popups/GrowthWorkPopup';

interface WorkSectionProps {
  className?: string;
}

interface Work {
  id: string;
  title: string;
  color: string;
  imageUrl: string;
}

const workItems: Work[] = [
  { id: 'websites', title: 'Websites', color: colors.text.white, imageUrl: '/WEBSITES.png' },
  { id: 'videos', title: 'Videos', color: colors.text.white, imageUrl: '/VIDEOS.png' },
  { id: 'branding', title: 'Branding', color: colors.text.white, imageUrl: '/BRANDING.png' },
  { id: 'design', title: 'Design', color: colors.text.white, imageUrl: '/DESIGN.png' },
  { id: 'ai', title: 'AI', color: colors.text.white, imageUrl: '/AI.png' },
  { id: 'growth', title: 'Growth', color: colors.text.white, imageUrl: '/GROWTH.png' }
];

export const WorkSection: React.FC<WorkSectionProps> = ({ className = "" }) => {
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);

  const openWorkDetails = (workId: string) => {
    setSelectedWorkId(workId);
  };

  const closeWorkDetails = () => {
    setSelectedWorkId(null);
  };

  // Render the appropriate popup based on the selected work
  const renderWorkPopup = () => {
    switch (selectedWorkId) {
      case 'websites':
        return <WebDesignWorkPopup onClose={closeWorkDetails} />;
      case 'videos':
        return <VideosWorkPopup onClose={closeWorkDetails} />;
      case 'branding':
        return <BrandingWorkPopup onClose={closeWorkDetails} />;
      case 'design':
        return <DesignWorkPopup onClose={closeWorkDetails} />;
      case 'ai':
        return <AIWorkPopup onClose={closeWorkDetails} />;
      case 'growth':
        return <GrowthWorkPopup onClose={closeWorkDetails} />;
      default:
        return null;
    }
  };

  return (
    <section id="work" className={`${spacing.section.padding} ${typography.tracking.tight} bg-black/50 ${className}`}>
      <div className={`container mx-auto ${spacing.container.padding}`}>
        <h2 className={`${typography.fontSize['4xl']} sm:text-5xl lg:text-[64px] ${colors.text.white} text-center mb-12 ${typography.tracking.tighter} font-bold`}>
          our work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workItems.map((work, index) => (
            <WorkCard 
              key={work.id} 
              work={work} 
              index={index} 
              onClick={() => openWorkDetails(work.id)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedWorkId && renderWorkPopup()}
      </AnimatePresence>
    </section>
  );
};

// Separate WorkCard component with proper onClick handling
const WorkCard: React.FC<{ work: Work; index: number; onClick: () => void }> = ({ work, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div onClick={onClick}>
      <NeonCard
        index={index}
        className="aspect-video flex items-center justify-center cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        hasPadding={!isHovered || !work.imageUrl}
      >
        {isHovered && work.imageUrl ? (
          <img 
            src={work.imageUrl}
            alt={work.title}
            className="w-full h-full object-cover z-10"
          />
        ) : (
          <h3 
            className={`${typography.fontSize['4xl']} ${typography.fontFamily.light} ${typography.tracking.tighter} z-10`} 
            style={{ color: colors.text.white }}
          >
            {work.title}
          </h3>
        )}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent ${transitions.opacity} ${isHovered ? 'opacity-100' : 'opacity-50'}`}
        />
      </NeonCard>
    </div>
  );
};