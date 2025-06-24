import React, { useState } from 'react';
import { AppContentProps } from '../../../data/appData.tsx';
import { flashForwardFolders, FolderItem } from '../../../data/folderItemsData.ts';
import { useWindowsContext } from '../../../contexts/WindowsContext';
import StatsPage from './StatsPage';
import RandomAudioPlayer from './RandomAudioPlayer'; // Keep import for other potential uses or future expansion

const FlashForwardFolder: React.FC<AppContentProps> = ({ onOpenApp }) => {
  const { onBack } = useWindowsContext();
  const [isTestimonialsPressed, setIsTestimonialsPressed] = useState(false); // New state for press effect

  const handleItemClick = (item: FolderItem) => {
    // Handle opening other apps/windows
    if (item.isBuiltIn && item.appId) {
      if (item.appId === 'statsPage') {
        onOpenApp(
          item.appId,
          <StatsPage onContinue={onBack} />,
          item.name
        );
      } else {
        onOpenApp(item.appId);
      }
    } else if (!item.isBuiltIn && item.path) {
      // For external items, open them in a new window with an iframe
      const externalId = `external-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      onOpenApp(
        externalId,
        <div style={{ 
          width: '100%', 
          height: '100%', 
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <iframe 
            src={item.path}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: '#000'
            }}
            title={item.name}
            allow="fullscreen"
          />
        </div>,
        item.name
      );
    }
    // Audio items handled directly in JSX
  };

  const playRandomTestimonial = (audioUrls: string[]) => {
    if (audioUrls && audioUrls.length > 0) {
      const randomIndex = Math.floor(Math.random() * audioUrls.length);
      const audio = new Audio(audioUrls[randomIndex]);
      audio.play();
    }
  };

  return (
    <div className="win95-folder-content">
      {/* Define quick pulsation animation */}
      <style>{`
        @keyframes pulsateQuick {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); } /* 10% larger */
          100% { transform: scale(1); }
        }
      `}</style>
      {flashForwardFolders.map((item, index) => (
        <div 
          key={index} 
          className="win95-folder-item"
          onDoubleClick={() => { if (!item.audioUrls) handleItemClick(item); }}
          onClick={() => {
            if (item.audioUrls) {
              playRandomTestimonial(item.audioUrls);
              setIsTestimonialsPressed(true);
              setTimeout(() => {
                setIsTestimonialsPressed(false); 
              }, 150);
            } else if (item.openOnSingleClick) {
              handleItemClick(item);
            }
          }}
        >
          <img 
            src={item.icon} 
            alt={item.name} 
            className="win95-folder-item-icon"
            style={{ 
              transform: item.audioUrls && isTestimonialsPressed ? 'scaleY(0.8)' : 'scaleY(1)',
              transition: item.audioUrls ? 'transform 0.05s ease-in-out' : 'none',
              animation: item.name === 'Update' ? 'pulsateQuick 0.8s infinite ease-in-out' : 'none' // Apply animation conditionally
            }} 
          />
          <div className="win95-folder-item-text">{item.name}</div>
        </div>
      ))}
    </div>
  );
};

export default FlashForwardFolder;