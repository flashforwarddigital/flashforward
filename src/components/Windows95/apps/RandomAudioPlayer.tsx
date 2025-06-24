import React, { useEffect, useRef } from 'react';

interface RandomAudioPlayerProps {
  audioUrls: string[];
}

const RandomAudioPlayer: React.FC<RandomAudioPlayerProps> = ({ audioUrls }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioUrls && audioUrls.length > 0 && audioRef.current) {
      const randomIndex = Math.floor(Math.random() * audioUrls.length);
      audioRef.current.src = audioUrls[randomIndex];
      audioRef.current.play();
    }
  }, [audioUrls]);

  // Basic controls for testing - you can style this later
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Playing Random Testimonial...</h3>
      <audio ref={audioRef} controls autoPlay>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default RandomAudioPlayer; 