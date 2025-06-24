import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { colors, typography, transitions, effects, spacing } from '../../theme/theme';

interface HeaderProps {
  onBack: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBack }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`fixed top-0 left-0 right-0 ${colors.background.overlay.dark} backdrop-blur-md z-50 border-b ${colors.border.dark}`}>
      <nav className={`container mx-auto ${spacing.container.padding} py-4`}>
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
            className={`md:hidden ${colors.text.gray[400]} hover:text-white`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
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
        <div className={`px-4 py-3 space-y-3 ${colors.background.dark} border-t ${colors.border.dark}`}>
          {['about', 'services', 'work', 'team', 'pricing', 'contact'].map((item) => (
            <a 
              key={item}
              href={`#${item}`} 
              className={`block ${colors.text.gray[400]} hover:text-white ${transitions.colors} ${typography.tracking.tight}`}
            >
              {item}
            </a>
          ))}
        </div>
      </motion.div>
    </header>
  );
}; 