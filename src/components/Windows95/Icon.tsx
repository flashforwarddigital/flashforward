import React, { useEffect, useState } from 'react';

interface IconProps {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  onOpen: () => void;
}

const Icon: React.FC<IconProps> = ({ id, name, icon, x, y, onOpen }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div 
      className="win95-desktop-icon" 
      style={{ left: `${x}px`, top: `${y}px` }}
      onClick={(e) => {
        // On mobile, open with single click
        if (isMobile) {
          e.preventDefault();
          onOpen();
        }
      }}
      onDoubleClick={(e) => {
        // On desktop, keep double-click behavior
        if (!isMobile) {
          e.preventDefault();
          onOpen();
        }
      }}
      onTouchEnd={(e) => {
        // For touch devices, ensure we handle touch events properly
        if (isMobile) {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <img src={icon} alt={name} className="win95-desktop-icon-img" />
      <div className="win95-desktop-icon-text">{name}</div>
    </div>
  );
};

export default Icon;