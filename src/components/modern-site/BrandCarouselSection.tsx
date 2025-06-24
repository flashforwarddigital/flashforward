import React from 'react';
import { motion } from 'framer-motion';
import { spacing, typography } from '../../theme/theme';

const brandLogos = [
  '/brands/1.png',
  '/brands/2.png',
  '/brands/3.png',
  '/brands/4.png',
  '/brands/5.png',
  '/brands/6.png',
  '/brands/7.png',
  '/brands/8.png',
  '/brands/9.png',
  '/brands/11.png',
  '/brands/12.png',
  '/brands/13.png',
  '/brands/14.png',
  '/brands/15.png',
  '/brands/16.png',
  '/brands/17.png',
  '/brands/18.png',
  '/brands/19.png',
  '/brands/20.png',
  '/brands/21.png',
  '/brands/22.png',
  '/brands/23.png',
  '/brands/24.png',
];

interface BrandCarouselSectionProps {
  className?: string;
}

export const BrandCarouselSection: React.FC<BrandCarouselSectionProps> = ({ className = "" }) => {
  return (
    <section className={`py-12 overflow-hidden ${className}`}>
      <div className={`container mx-auto ${spacing.container.padding} text-center mb-6`}>
        <h2 className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} text-gray-300`}>
          trusted by
        </h2>
      </div>
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{
          x: ['0%', '-100%'],
          transition: {
            ease: 'linear',
            duration: 25, // Slightly faster duration for more noticeable movement
            repeat: Infinity,
          },
        }}
      >
        {brandLogos.map((logo, index) => (
          <img 
            key={index} 
            src={logo} 
            alt="Brand Logo" 
            className="h-16 mx-10 inline-block filter grayscale-0 opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        ))}
         {/* Duplicate logos for seamless loop */}
         {brandLogos.map((logo, index) => (
          <img 
            key={index + brandLogos.length} 
            src={logo} 
            alt="Brand Logo" 
            className="h-16 mx-10 inline-block filter grayscale-0 opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        ))}
      </motion.div>
    </section>
  );
}; 