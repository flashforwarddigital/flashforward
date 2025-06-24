import React from 'react';
import { typography, spacing } from '../../theme/theme';

interface BreakSectionProps {
  className?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
  reducedPadding?: boolean;
}

export const BreakSection: React.FC<BreakSectionProps> = ({ className = "", backgroundImage, children, reducedPadding }) => {
  const sectionPaddingClass = reducedPadding && children ? 'py-[28px]' : spacing.section.break;

  return (
    <section 
      className={`${sectionPaddingClass} text-gray-300 ${typography.tracking.tight} relative overflow-hidden ${className}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: !backgroundImage ? '#1a1a1a' : undefined, // fallback dark gray if no image
      }}
    >
      {/* Overlay to ensure content is readable against the background image */}
      {backgroundImage && <div className="absolute inset-0 bg-black opacity-50" />} 

      {/* Content will be rendered here */}
      <div className={`container mx-auto ${spacing.container.padding} relative z-10`}>
        {/* Original dash content */}
        {!children && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[1, 2, 3, 4].map((index) => (
              <div key={index}>
                <div className={`${typography.fontSize['4xl']} ${typography.fontFamily.light} mb-2 ${typography.tracking.tighter}`}>--</div>
                <div className={`text-gray-400 ${typography.fontFamily.light} ${typography.tracking.tight}`}>--</div>
              </div>
            ))}
          </div>
        )}
        
        {children} {/* Render children here if present */}

      </div>
    </section>
  );
}; 