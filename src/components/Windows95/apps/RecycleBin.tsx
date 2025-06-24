import React from 'react';

const RecycleBin: React.FC = () => {
  return (
    <div className="win95-folder-content">
      <div className="win95-folder-item">
        <img 
          src="/BatExec_32x32_4.png" 
          alt="Search History" 
          className="win95-folder-item-icon" 
        />
        <div className="win95-folder-item-text">Search History</div>
      </div>
      <div className="win95-folder-item">
        <img 
          src="/error.png" 
          alt="Tommy Pamela Tape" 
          className="win95-folder-item-icon" 
        />
        <div className="win95-folder-item-text">Tommy Pamela Tape.mov</div>
      </div>
      <div className="win95-folder-item">
        <img 
          src="/napster.png" 
          alt="Napster" 
          className="win95-folder-item-icon" 
        />
        <div className="win95-folder-item-text">Napster.exe</div>
      </div>
      <div className="win95-folder-item">
        <img 
          src="/homework.png" 
          alt="Homework" 
          className="win95-folder-item-icon" 
        />
        <div className="win95-folder-item-text">Homework.doc</div>
      </div>
    </div>
  );
};

export default RecycleBin;