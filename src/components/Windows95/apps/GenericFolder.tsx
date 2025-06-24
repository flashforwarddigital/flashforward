import React from 'react';
import { AppContentProps } from '../../../data/appData.tsx';
import { FolderItem } from '../../../data/folderItemsData.ts';
import StatsPage from './StatsPage';
import { useWindowsContext } from '../../../contexts/WindowsContext';
import RandomAudioPlayer from './RandomAudioPlayer';

interface GenericFolderProps extends AppContentProps {
  items: FolderItem[];
  onOpenApp: AppContentProps['onOpenApp'];
}

const AI_TOOL_APP_IDS = [
  'basicChatbot',
  'imageGenerator',
  'chatbot',
  'voicebot',
  'gpt90s',
];

const GAME_APP_IDS = [
  'game-mario',
  'game-zelda',
  'game-mk-wiki',
];

const GenericFolder: React.FC<GenericFolderProps> = ({ onOpenApp, items }) => {
  const { onBack } = useWindowsContext();

  const handleItemClick = (item: FolderItem) => {
    if (item.isBuiltIn && item.appId) {
      if (item.appId === 'statsPage') {
        onOpenApp(
          item.appId,
          <StatsPage onContinue={onBack} />,
          item.name
        );
      } else if (AI_TOOL_APP_IDS.includes(item.appId)) {
        // Pass custom position for AI tools
        onOpenApp(item.appId, undefined, undefined, { x: 300, y: 100 });
      } else if (item.appId === 'minesweeper' || item.appId === 'solitaire') {
        // Built-in games
        onOpenApp(item.appId);
      } else {
        onOpenApp(item.appId);
      }
    } else if (!item.isBuiltIn && item.path) {
      // For external items, check if we have a dedicated launcher
      if (item.name === 'Super Mario') {
        onOpenApp('game-mario');
      } else if (item.name === 'Zelda') {
        onOpenApp('game-zelda');
      } else if (item.name === 'Mortal Kombat Wiki') {
        onOpenApp('game-mk-wiki');
      } else {
        // For other external items, open them in a new window with an iframe
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
    } else if (item.audioUrls && item.audioUrls.length > 0) {
      const audioAppId = `audio-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      onOpenApp(
        audioAppId,
        <RandomAudioPlayer audioUrls={item.audioUrls} />,
        item.name
      );
    }
  };

  return (
    <div className="win95-folder-content">
      {items && items.map((item, index) => (
        <div 
          key={index} 
          className="win95-folder-item"
          onDoubleClick={() => { if (!item.openOnSingleClick) handleItemClick(item); }}
          onClick={() => { if (item.openOnSingleClick) handleItemClick(item); }}
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

export default GenericFolder;