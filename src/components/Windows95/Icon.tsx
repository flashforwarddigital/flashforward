import React from 'react';

interface IconProps {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  onOpen: () => void;
}

const Icon: React.FC<IconProps> = ({ id, name, icon, x, y, onOpen }) => {
  // Detect if we're on mobile
  const isMobile = window.innerWidth < 768;
  
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
    >
      <img src={icon} alt={name} className="win95-desktop-icon-img" />
      <div className="win95-desktop-icon-text">{name}</div>
    </div>
  );
};

export default Icon;