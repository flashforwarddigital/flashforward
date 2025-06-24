import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { posthog } from '../../lib/posthog';

interface FrameProps {
  onYearSelect: (year: '1996' | '2025') => void;
}

export const Frame: React.FC<FrameProps> = ({ onYearSelect }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedYear, setSelectedYear] = useState<'1996' | '2025' | null>(null);

  useEffect(() => {
    // Track page view with PostHog
    posthog.capture('page_view', { page: 'landing' });
  }, []);

  const handleYearSelect = (year: '1996' | '2025') => {
    setSelectedYear(year);
    setIsAnimating(true);
    
    // Track year selection with PostHog
    posthog.capture('year_selected', { year });
    
    // Delay the actual navigation to allow for animation
    setTimeout(() => {
      onYearSelect(year);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-white text-center mb-12 z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Choose Your Era</h1>
        <p className="text-lg md:text-xl text-gray-400">Experience the web across time</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-16 z-10">
        <AnimatePresence>
          {!isAnimating || selectedYear === '1996' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: -100 }}
              transition={{ duration: 0.5 }}
              className="relative"
              onClick={() => handleYearSelect('1996')}
            >
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg border-2 border-gray-800 transition-all duration-300 group-hover:border-blue-500">
                  <img 
                    src="/1996.png" 
                    alt="1996 Web Experience" 
                    className="w-64 h-64 md:w-80 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">1996</h2>
                      <p className="text-gray-300 text-sm">Windows 95 & Early Web</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {!isAnimating || selectedYear === '2025' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: 100 }}
              transition={{ duration: 0.5 }}
              className="relative"
              onClick={() => handleYearSelect('2025')}
            >
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg border-2 border-gray-800 transition-all duration-300 group-hover:border-pink-500">
                  <img 
                    src="/2025.png" 
                    alt="2025 Web Experience" 
                    className="w-64 h-64 md:w-80 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">2025</h2>
                      <p className="text-gray-300 text-sm">Modern Digital Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[url('/bg.png')] bg-repeat opacity-10 animate-[spin_240s_linear_infinite]"></div>
      </div>
    </div>
  );
};