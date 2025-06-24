import React from 'react';
import GenericFolder from './GenericFolder';
import { mediaItems } from '../../../data/folderItemsData.ts';
import { AppContentProps } from '../../../data/appData.tsx';

const MediaFolder: React.FC<AppContentProps> = ({ onOpenApp }) => {
  return (
    <GenericFolder items={mediaItems} onOpenApp={onOpenApp} />
  );
};

export default MediaFolder;