import React, { useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { typography, spacing, colors } from '../../theme/theme';

interface Stat {
  value: number;
  description: string;
}

const stats: Stat[] = [
  {
    value: 94,
    description: 'Of first impressions are based on design.',
  },
  {
    value: 47,
    description: 'Of users leave if a site loads in over 2 seconds.',
  },
  {
    value: 85,
    description: 'Of businesses say AI made them more efficient.',
  },
  {
    value: 73,
    description: 'More revenue with consistent branding.',
  },
];

const StatItem: React.FC<{ stat: Stat; index: number }> = ({ stat, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const [displayedValue, setDisplayedValue] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(0, stat.value, {
        duration: 2, // Animation duration
        onUpdate: (value) => {
          setDisplayedValue(Math.round(value));
        },
      });
      return () => controls.stop();
    }
  }, [isInView, stat.value]);

  return (
    <div ref={ref} className="text-center">
      <h3 className={`${typography.fontSize['4xl']} sm:text-5xl lg:text-6xl ${typography.fontFamily.light} ${colors.text.white} ${typography.tracking.tighter} mb-2`}>
        {displayedValue}%
      </h3>
      <p className={`${typography.fontSize.sm} ${typography.fontFamily.light} ${colors.text.gray[300]} ${typography.tracking.tight}`}>
        {stat.description}
      </p>
    </div>
  );
};

interface StatsSectionProps {
  className?: string;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ className = "" }) => {
  return (
    <div className={`py-12 ${className}`}>
      <div className={`container mx-auto ${spacing.container.padding}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}; 