import React from 'react';

const MyComputer: React.FC = () => {
  return (
    <div className="win95-folder-content">
      <div className="win95-folder-item">
        <img 
          src="/local_disk.png" 
          alt="C Drive" 
          className="win95-folder-item-icon" 
        />
        <div className="win95-folder-item-text">Local Disk (C:)</div>
      </div>
      <div className="win95-folder-item">
        <img 
          src="/cd_rom.png" 
          alt="CD Drive" 
          className="win95-folder-item-icon" 
        />
        <div className="win95-folder-item-text">CD-ROM (D:)</div>
      </div>
      <div className="win95-folder-item">
        <img 
          src="/network.png" 
          alt="Network" 
          className="win95-folder-item-icon" 
        />
        <div className="win95-folder-item-text">Network</div>
      </div>
      <div className="win95-folder-item">
        <img 
          src="/control_panel.png" 
          alt="Control Panel" 
          className="win95-folder-item-icon" 
        />
        <div className="win95-folder-item-text">Control Panel</div>
      </div>
      <div className="win95-folder-item">
        <img 
          src="/BatExec2_32x32_4.png" 
          alt="Printers" 
          className="win95-folder-item-icon" 
        />
        <div className="win95-folder-item-text">Printers</div>
      </div>
    </div>
  );
};

export default MyComputer;