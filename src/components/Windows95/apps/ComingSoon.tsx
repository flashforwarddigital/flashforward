import React from 'react';
import { AppContentProps } from '../../../data/appData.tsx'; // Import AppContentProps

// Add AppContentProps to component signature
const ComingSoon: React.FC<AppContentProps> = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', fontSize: '24px', color: '#fff', backgroundColor: '#000' }}>
      Coming Soon!
    </div>
  );
};

export default ComingSoon; 