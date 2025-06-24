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
  return (
    <div 
      className="win95-desktop-icon" 
      style={{ left: `${x}px`, top: `${y}px` }}
      onDoubleClick={onOpen}
    >
      <img src={icon} alt={name} className="win95-desktop-icon-img" />
      <div className="win95-desktop-icon-text">{name}</div>
    </div>
  );
};

export default Icon;