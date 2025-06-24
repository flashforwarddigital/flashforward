import React from 'react';
import '../../styles/windows95.css';

interface TutorialPopupProps {
  message: string;
  onClose: () => void;
  position?: { x: number; y: number };
}

const TutorialPopup: React.FC<TutorialPopupProps> = ({ message, onClose, position = { x: 200, y: 200 } }) => {
  return (
    <div 
      className="win95-window"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: '300px',
        zIndex: 1000,
      }}
    >
      <div className="win95-window-title">
        <span>Welcome</span>
        <button 
          className="win95-window-close"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div className="win95-window-content" style={{ padding: '20px' }}>
        <p style={{ margin: 0 }}>{message}</p>
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <button className="win95-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialPopup; 