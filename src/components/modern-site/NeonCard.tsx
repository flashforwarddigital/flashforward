import React from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../theme/theme';

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  hasPadding?: boolean;
}

export const NeonCard: React.FC<NeonCardProps> = ({ children, className = "", index = 0, onMouseEnter, onMouseLeave, hasPadding = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index }}
      className={`relative group ${colors.background.card} rounded-lg ${hasPadding ? 'p-8' : 'p-0'} ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="absolute inset-0 rounded-lg border border-white/30 group-hover:border-transparent transition-colors duration-200" />
      <div className="absolute inset-0 rounded-lg bg-blue-500/5 group-hover:bg-gray-700/30 transition-colors duration-200" />

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
      <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 inset-y-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-white to-transparent group-hover:via-white" />
      <span className="absolute group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-white to-transparent group-hover:via-white" />
    </motion.div>
  );
}; 