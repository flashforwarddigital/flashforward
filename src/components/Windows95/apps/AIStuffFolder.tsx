import React from 'react';
import { AppContentProps } from '../../../data/appData.tsx';
import { aiItems } from '../../../data/folderItemsData.ts';

const AIStuffFolder: React.FC<AppContentProps> = ({ onOpenApp }) => {
  const handleItemClick = (item: any) => {
    if (item.appId) {
      console.log(`Opening AI tool: ${item.appId}`);
      // Position AI tools more centrally on the screen
      onOpenApp(item.appId);
    }
  };

  return (
    <div className="win95-folder-content">
      {aiItems.map((item, index) => (
        <div 
          key={index} 
          className="win95-folder-item"
          onDoubleClick={() => handleItemClick(item)}
        >
          <img 
            src={item.icon} 
            alt={item.name} 
            className="win95-folder-item-icon" 
          />
          <div className="win95-folder-item-text">{item.name}</div>
        </div>
      ))}
    </div>
  );
};

export default AIStuffFolder;