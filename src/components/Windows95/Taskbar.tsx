import React, { useState } from 'react';
import StartMenu from './StartMenu';
import useSound from 'use-sound';

interface TaskbarProps {
  openApps: { id: string; name: string; isMinimized: boolean }[];
  onAppClick: (id: string) => void;
  onBack: () => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ openApps, onAppClick, onBack }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [playStartSound] = useSound('/sounds/windows95-startup.mp3');
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const toggleStartMenu = () => {
    if (!isStartMenuOpen) {
      playStartSound();
    }
    setIsStartMenuOpen(!isStartMenuOpen);
  };

  const handleStartButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStartMenu();
  };
  
  return (
    <>
      {isStartMenuOpen && (
        <div 
          className="fixed inset-0 z-50"
          onClick={() => setIsStartMenuOpen(false)}
        />
      )}
      
      <StartMenu 
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onShutdown={onBack}
      />
      
      <div className="win95-taskbar">
        <button 
          className={`win95-start-button ${isStartMenuOpen ? 'active' : ''}`}
          onClick={handleStartButtonClick}
        >
          <img 
            src="https://win98icons.alexmeub.com/icons/png/windows-0.png" 
            alt="Start" 
          />
          Start
        </button>
        
        <div className="win95-taskbar-items">
          {openApps.map(app => (
            <div 
              key={app.id} 
              className={`win95-taskbar-item ${app.isMinimized ? 'active' : ''}`}
              onClick={() => onAppClick(app.id)}
            >
              {app.name}
            </div>
          ))}
        </div>
        
        <div className="win95-taskbar-clock">
          {formattedTime}
        </div>
      </div>
    </>
  );
};

export default Taskbar;