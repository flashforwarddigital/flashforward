import React, { useState, useEffect } from 'react';
import { AppContentProps } from '../../../data/appData.tsx';

interface GameLauncherProps extends AppContentProps {
  gameUrl: string;
  gameName: string;
}

const GameLauncher: React.FC<GameLauncherProps> = ({ gameUrl, gameName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleIframeError = () => {
    setError(`Failed to load ${gameName}. Please try again later.`);
    setIsLoading(false);
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative'
    }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#000080',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          zIndex: 10
        }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '5px solid #c0c0c0',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }} />
          <div>Loading {gameName}...</div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {error ? (
        <div style={{
          padding: '20px',
          backgroundColor: '#c0c0c0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}>
          <div style={{
            backgroundColor: 'white',
            border: '2px solid',
            borderColor: '#808080 #ffffff #ffffff #808080',
            padding: '20px',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '20px', color: 'red' }}>
              {error}
            </div>
            <button 
              className="win95-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <iframe
          src={gameUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: '#000'
          }}
          title={gameName}
          onError={handleIframeError}
          allow="fullscreen"
        />
      )}
    </div>
  );
};

export default GameLauncher;