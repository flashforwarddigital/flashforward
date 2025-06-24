import React, { useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { typography, spacing, colors } from '../../theme/theme';

interface ExaggeratedStat {
  value: number; // Numeric part for animation
  prefix?: string; // Like $, or empty
  suffix?: string; // Like +, %, or empty
  label: string; // The main title/label
  description: string; // The descriptive text
}

const exaggeratedStats: ExaggeratedStat[] = [
  {
    value: 60,
    suffix: '%+',
    label: 'Your Basic website package',
    description: 'is 60% cheaper than the average agency rate.',
  },
  {
    value: 70,
    suffix: '% ',
    label: 'Your monthly services',
    description: 'cost up to 70% less than typical agency retainers',
  },
  {
    value: 75,
    suffix: '% ',
    label: 'AI tools',
    description: 'that cost others $1,000+ are available from you for under $250/mo. up to 75% cheaper with us',
  },
  {
    value: 10,
    prefix: '$',
    suffix: 'K+',
    label: 'Enterprise clients can save over $10,000 compared to other agencies with Flash Forward',
    description: '',
  },
];

const ExaggeratedStatItem: React.FC<{ stat: ExaggeratedStat; index: number }> = ({ stat, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const [displayedValue, setDisplayedValue] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(0, stat.value, {
        duration: 2.5, // Animation duration
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
        {stat.prefix}{displayedValue}{stat.suffix}
      </h3>
       <p className={`${typography.fontSize.lg} ${typography.fontFamily.light} ${colors.text.white} ${typography.tracking.tight} mb-2`}>
        {stat.label}
      </p>
      <p className={`${typography.fontSize.sm} ${typography.fontFamily.light} ${colors.text.gray[300]} ${typography.tracking.tight}`}>
        {stat.description}
      </p>
    </div>
  );
};

interface ExaggeratedStatsSectionProps {
  className?: string;
}

export const ExaggeratedStatsSection: React.FC<ExaggeratedStatsSectionProps> = ({ className = "" }) => {
  return (
    <div className={`py-12 ${className}`}> {/* Added vertical padding to match others */}
      <div className={`container mx-auto ${spacing.container.padding}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {exaggeratedStats.map((stat, index) => (
            <ExaggeratedStatItem key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}; 