import React, { useState, useEffect } from 'react';
import { Mic, Volume2, Clock } from 'lucide-react';

const ModernVoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    // Calculate a fixed target date based on 5 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 5);
    
    // Initial calculation
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = Math.max(0, Math.floor((targetDate.getTime() - now.getTime()) / 1000));
      
      const days = Math.floor(difference / (24 * 60 * 60));
      const hours = Math.floor((difference % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((difference % (60 * 60)) / 60);
      const seconds = difference % 60;
      
      return { days, hours, minutes, seconds };
    };
    
    // Set initial time
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleListen = () => {
    setIsListening(true);
    
    // Simulate voice recognition
    setTimeout(() => {
      setTranscript('How can AI help improve my business?');
      setIsListening(false);
      
      // Simulate AI response
      setTimeout(() => {
        setResponse('AI can help your business by automating repetitive tasks, providing data-driven insights, enhancing customer experiences through chatbots, optimizing operations, and creating personalized marketing campaigns.');
      }, 1500);
    }, 2000);
  };
  
  const handleOpenElevenLabs = () => {
    window.open('https://elevenlabs.io/app/talk-to?agent_id=agent_01jx7mn98qeptva88351xa9rty', '_blank');
  };
  
  return (
    <div className="flex flex-col h-full bg-black/30 rounded-lg overflow-hidden border border-gray-800">
      <div className="p-4 border-b border-gray-800 bg-black/50">
        <h3 className="text-lg font-light text-white tracking-tight">Voice Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
        <div className="bg-black/30 p-6 rounded-lg border border-gray-800 w-full max-w-md">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Mic size={32} className="text-blue-400" />
            <h4 className="text-white text-xl">Coming Soon</h4>
          </div>
          
          <p className="text-gray-300 text-center mb-6">
            Our AI voice assistant will be available in:
          </p>
          
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-black/50 p-3 rounded-lg">
              <div className="text-white text-2xl font-light">{timeLeft.days}</div>
              <div className="text-gray-500 text-xs">DAYS</div>
            </div>
            <div className="bg-black/50 p-3 rounded-lg">
              <div className="text-white text-2xl font-light">{timeLeft.hours}</div>
              <div className="text-gray-500 text-xs">HOURS</div>
            </div>
            <div className="bg-black/50 p-3 rounded-lg">
              <div className="text-white text-2xl font-light">{timeLeft.minutes}</div>
              <div className="text-gray-500 text-xs">MINUTES</div>
            </div>
            <div className="bg-black/50 p-3 rounded-lg">
              <div className="text-white text-2xl font-light">{timeLeft.seconds}</div>
              <div className="text-gray-500 text-xs">SECONDS</div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={handleOpenElevenLabs}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
            >
              <Volume2 size={18} />
              Try ElevenLabs Demo
            </button>
          </div>
          
          <p className="text-gray-500 text-sm mt-4 text-center">
            In the meantime, you can try our ElevenLabs integration
          </p>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-800 bg-black/50 text-center text-gray-400 text-sm">
        <div className="flex items-center justify-center gap-2">
          <Clock size={14} />
          <span>Coming {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes} minutes, {timeLeft.seconds} seconds</span>
        </div>
      </div>
    </div>
  );
};

export default ModernVoiceAssistant;