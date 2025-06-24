import React, { useState } from 'react';

const Voicebot: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startListening = () => {
    setIsListening(true);
    setError(null);
    
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setTranscript('This is a simulated voice transcript.');
      
      // Simulate response
      setTimeout(() => {
        setResponse('This is a simulated 90s-style voice response. Totally rad!');
      }, 1000);
    }, 2000);
  };

  const handleOpenElevenLabs = () => {
    window.open('https://elevenlabs.io/app/talk-to?agent_id=agent_01jx7mn98qeptva88351xa9rty', '_blank');
  };

  return (
    <div style={{ 
      padding: '20px', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#c0c0c0',
      overflow: 'auto'
    }}>
      <div style={{ 
        backgroundColor: '#000080',
        padding: '5px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <img 
          src="/callagent.png" 
          alt="Voice Agent" 
          style={{ width: '24px', height: '24px', marginRight: '10px' }} 
        />
        <h2 style={{ fontSize: '16px', margin: 0 }}>90s Voice Assistant</h2>
      </div>
      
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: isListening ? '#ff0000' : '#808080',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '3px solid',
          borderColor: '#ffffff #808080 #808080 #ffffff',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease'
        }}>
          <img 
            src="/callagent.png" 
            alt="Microphone" 
            style={{ 
              width: '60px', 
              height: '60px',
              filter: isListening ? 'brightness(1.2)' : 'brightness(0.8)'
            }} 
          />
        </div>
        
        <button 
          className="win95-button"
          style={{ padding: '10px 20px', fontSize: '14px' }}
          onClick={startListening}
          disabled={isListening}
        >
          {isListening ? 'Listening...' : 'Start Speaking'}
        </button>
        
        <div style={{
          width: '100%',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <p style={{ fontSize: '14px', marginBottom: '15px' }}>
            Want to use the full ElevenLabs voice assistant?
          </p>
          <button 
            className="win95-button"
            style={{ padding: '10px 20px', fontSize: '14px' }}
            onClick={handleOpenElevenLabs}
          >
            Open ElevenLabs Voice Agent
          </button>
        </div>
        
        {transcript && (
          <div style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'white',
            border: '2px solid',
            borderColor: '#808080 #ffffff #ffffff #808080',
            marginTop: '20px'
          }}>
            <h3 style={{ fontSize: '14px', marginBottom: '5px' }}>You said:</h3>
            <p style={{ margin: 0, fontFamily: 'monospace' }}>{transcript}</p>
          </div>
        )}
        
        {response && (
          <div style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#e0f0ff',
            border: '2px solid',
            borderColor: '#808080 #ffffff #ffffff #808080',
            marginTop: '10px'
          }}>
            <h3 style={{ fontSize: '14px', marginBottom: '5px' }}>Response:</h3>
            <p style={{ margin: 0, fontFamily: 'monospace' }}>{response}</p>
          </div>
        )}
        
        {error && (
          <div style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#ffeeee',
            border: '1px solid red',
            marginTop: '10px',
            color: 'red'
          }}>
            {error}
          </div>
        )}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#555' }}>
        <p>Due to security restrictions, the ElevenLabs voice agent cannot be embedded directly.</p>
        <p>Click the button above to open it in a new window.</p>
      </div>
    </div>
  );
};

export default Voicebot;