import React from 'react';
import { AppContentProps } from '../../../data/appData.tsx';
import GenericFolder from './GenericFolder';
import { games } from '../../../data/folderItemsData.ts';

const GamesFolder: React.FC<AppContentProps> = ({ onOpenApp }) => {
  return (
    <GenericFolder items={games} onOpenApp={onOpenApp} />
  );
};

export default GamesFolder;