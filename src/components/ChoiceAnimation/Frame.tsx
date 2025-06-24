import React from 'react';

interface FrameProps {
  children: React.ReactNode;
  className?: string;
}

export const Frame: React.FC<FrameProps> = ({ children, className = '' }) => {
  return (
    <div className={`frame ${className}`}>
      {children}
    </div>
  );
};