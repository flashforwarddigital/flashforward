import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface ComingSoonToolProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  fallbackDays: number; // Fallback days for countdown
  color?: string;
}

const ComingSoonTool: React.FC<ComingSoonToolProps> = ({ 
  title, 
  description, 
  icon, 
  fallbackDays,
  color = '#008CFF'
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    // Calculate a fixed target date based on the component mount time plus fallback days
    // This ensures the timer doesn't reset on each render
    const calculateTargetDate = () => {
      // Create a new target date based on fallback days
      const targetDate = new Date();
      const wholeDays = Math.floor(fallbackDays);
      const fractionalDays = fallbackDays - wholeDays;
      
      // Add whole days
      targetDate.setDate(targetDate.getDate() + wholeDays);
      
      // Add fractional day as hours
      if (fractionalDays > 0) {
        targetDate.setHours(targetDate.getHours() + Math.round(fractionalDays * 24));
      }
      
      return targetDate;
    };
    
    const targetDate = calculateTargetDate();
    
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
  }, [fallbackDays]);
  
  return (
    <div className="flex flex-col h-full bg-black/30 rounded-lg overflow-hidden border border-gray-800">
      <div className="p-4 border-b border-gray-800 bg-black/50">
        <h3 className="text-lg font-light text-white tracking-tight flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
        <div className="bg-black/30 p-6 rounded-lg border border-gray-800 w-full max-w-md">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
              {React.cloneElement(icon as React.ReactElement, { size: 32, style: { color } })}
            </div>
          </div>
          
          <p className="text-gray-300 text-center mb-6">
            {description}
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
              className="px-6 py-2 rounded-lg text-white"
              style={{ backgroundColor: color }}
            >
              Get Notified
            </button>
          </div>
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

export default ComingSoonTool;