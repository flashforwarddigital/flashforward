import React, { useEffect, useRef } from 'react';
import Webamp from 'webamp';

const WinampPlayer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const webampRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const initWebamp = async () => {
      try {
        const webamp = new Webamp({
          initialTracks: [
            {
              metaData: {
                artist: "DJ Mike Llama",
                title: "Llama Whippin' Intro",
              },
              url: "https://cdn.jsdelivr.net/gh/captbaritone/webamp@43434d82/mp3/llama-2.91.mp3",
              duration: 5.322286,
            },
          ],
        });

        // Store webamp instance
        webampRef.current = webamp;

        // Render Webamp
        await webamp.renderWhenReady(containerRef.current);

        // Cleanup on unmount
        return () => {
          if (webampRef.current) {
            webampRef.current.dispose();
          }
        };
      } catch (error) {
        console.error('Error initializing Webamp:', error);
      }
    };

    initWebamp();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default WinampPlayer;