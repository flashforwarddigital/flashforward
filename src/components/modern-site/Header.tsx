import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { colors, typography, transitions, effects, spacing } from '../../theme/theme';

interface HeaderProps {
  onBack: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBack }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll detection for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 ${colors.background.overlay.dark} backdrop-blur-md z-50 border-b ${colors.border.dark} transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <nav className={`container mx-auto ${spacing.container.padding}`}>
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className={`flex items-center gap-2 ${colors.text.gray[400]} hover:text-white ${transitions.colors} ${typography.tracking.tight}`}
          >
            <ArrowLeft size={20} />
            <span>back</span>
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['about', 'services', 'work', 'team', 'pricing', 'contact'].map((item) => (
              <a 
                key={item}
                href={`#${item}`} 
                className={`${colors.text.gray[400]} hover:text-white ${transitions.colors} ${typography.tracking.tight}`}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden ${colors.text.gray[400]} hover:text-white p-2`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <motion.div 
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className={`px-4 py-4 space-y-4 ${colors.background.dark} border-t ${colors.border.dark}`}>
          {['about', 'services', 'work', 'team', 'pricing', 'contact'].map((item) => (
            <a 
              key={item}
              href={`#${item}`} 
              className={`block ${colors.text.gray[400]} hover:text-white ${transitions.colors} ${typography.tracking.tight} py-2`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      </motion.div>
    </header>
  );
};