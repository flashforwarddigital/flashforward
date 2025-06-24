console.log('--- TVPlayer.tsx file loaded ---');
import React, { useState, useEffect, useRef } from 'react';

interface Channel {
  name: string;
  icon: string;
  description: string;
  shows: Show[];
}

interface Show {
  title: string;
  duration: string;
  description: string;
  videoUrl?: string;
}

// Initial channel data structure with hardcoded URLs
const initialChannels: Channel[] = [
  {
    name: 'MTV',
    icon: '/MediaAudio_32x32_4.png',
    description: 'Music Television - Your #1 source for music videos and entertainment',
    shows: [
      { title: 'MTV Classic', duration: 'N/A', description: 'Classic MTV content', videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/90stv/MTV.mp4' },
    ],
  },
  {
    name: 'Sitcoms',
    icon: '/TV.png',
    description: 'Classic sitcoms from the 90s',
    shows: [
      { title: 'Perfect Strangers', duration: 'N/A', description: 'Balki and Larry\'s adventures', videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/90stv/PerfectStrangers.mp4' },
    ],
  },
  {
    name: 'Cartoons',
    icon: '/Network2_32x32_4.png',
    description: 'Your favorite animated shows',
    shows: [
      { title: 'Samurai Pizza Cats', duration: 'N/A', description: 'Awesome feline heroes', videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/90stv/SamuraPizzaCats.mp4' },
    ],
  },
  {
    name: 'News',
    icon: '/Mailnews13_32x32_4.png',
    description: '24/7 News Coverage',
    shows: [
      { title: '96 News', duration: 'N/A', description: 'News from 1996', videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/90stv/news96.mp4' },
    ],
  },
  {
    name: 'Game Shows',
    icon: '/Controls3000_32x32_4.png',
    description: 'Test your knowledge with classic game shows',
    shows: [
      { title: 'Wheel', duration: 'N/A', description: 'Spin the wheel!', videoUrl: 'https://file.garden/Zxsc5-9aojhlnJO6/90stv/Wheel.mp4' },
    ],
  },
];

const TVPlayer: React.FC = () => {
  const [channels] = useState<Channel[]>(initialChannels);
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [currentShowIndex, setCurrentShowIndex] = useState(0);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);

  // Effect to set the initial video and update when channel or show changes
  useEffect(() => {
    console.log('[TVPlayer] useEffect: channels or index changed.', { channels, currentChannelIndex, currentShowIndex });
    if (channels.length > 0) {
      const channel = channels[currentChannelIndex];
      if (channel && channel.shows.length > 0) {
        const validShowIndex = Math.min(currentShowIndex, channel.shows.length - 1);
        setCurrentShowIndex(validShowIndex);
        const videoUrl = channel.shows[validShowIndex].videoUrl;
        console.log('[TVPlayer] useEffect: Setting current video URL:', videoUrl); // Log the video URL being set
        setCurrentVideoUrl(videoUrl);

        // Autoplay when a new video URL is set
        if (videoRef.current && videoUrl) {
          videoRef.current.load(); // Load the new video source
          videoRef.current.play().catch(error => console.error('[TVPlayer] Autoplay Error:', error));
        }

      } else {
        console.log('[TVPlayer] useEffect: No shows in current channel.');
        setCurrentVideoUrl(undefined);
      }
    } else {
      console.log('[TVPlayer] useEffect: No channels loaded yet.');
      setCurrentVideoUrl(undefined);
    }
     // Reset aspect ratio when channel or show changes
     setAspectRatio(undefined);
  }, [channels, currentChannelIndex, currentShowIndex]);

  // Handler for when video metadata is loaded
  const handleLoadedMetadata = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const videoAspectRatio = videoElement.videoWidth / videoElement.videoHeight;
      setAspectRatio(videoAspectRatio);
      console.log('[TVPlayer] handleLoadedMetadata: Video aspect ratio:', videoAspectRatio);
    }
  };

  const handleNextChannel = () => {
    console.log('[TVPlayer] handleNextChannel');
    const nextChannelIndex = (currentChannelIndex + 1) % channels.length;
    setCurrentChannelIndex(nextChannelIndex);
    setCurrentShowIndex(0);
    // Autoplay will be handled by the useEffect when currentChannelIndex changes
  };

  const handlePreviousChannel = () => {
    console.log('[TVPlayer] handlePreviousChannel');
    const prevChannelIndex = (currentChannelIndex - 1 + channels.length) % channels.length;
    setCurrentChannelIndex(prevChannelIndex);
    setCurrentShowIndex(0);
    // Autoplay will be handled by the useEffect when currentChannelIndex changes
  };

  const handleNextShow = () => {
    console.log('[TVPlayer] handleNextShow');
    const currentChannel = channels[currentChannelIndex];
    if (currentChannel && currentChannel.shows.length > 0) {
      const nextShowIndex = (currentShowIndex + 1) % currentChannel.shows.length;
      setCurrentShowIndex(nextShowIndex);
      // Autoplay will be handled by the useEffect when currentShowIndex changes
    } else {
       handleNextChannel(); // Move to the next channel if no more shows
    }
  };

  const handleVideoEnded = () => {
    console.log('[TVPlayer] handleVideoEnded: Video ended. Moving to next show/channel.');
    handleNextShow(); // Move to the next show or channel, which will trigger autoplay
  };

  const currentChannel = channels[currentChannelIndex];
  const currentShow = currentChannel?.shows[currentShowIndex];

  return (
    <div className="p-2 h-full flex flex-col bg-[var(--win95-window-bg)]">
      {/* TV Screen */}
      <div 
        className="bg-black border-4 border-[var(--win95-border-inner-dark)] mb-2 relative"
        style={{
          width: '100%',
          paddingTop: aspectRatio ? `${100 / aspectRatio}%` : '56.25%',
          position: 'relative',
        }}
      >
        {/* Video Player */}
        {currentVideoUrl ? (
          <video 
            ref={videoRef}
            src={currentVideoUrl}
            controls={false} // Remove default controls
            autoPlay // Enable native autoplay
            className="absolute top-0 left-0 w-full h-full object-contain"
            onEnded={handleVideoEnded}
            onError={(e) => console.error('[TVPlayer] video: onError', e)}
            onLoadedMetadata={handleLoadedMetadata}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="text-gray-500 text-2xl">
              <div className="mb-4">NO SIGNAL</div>
              {channels.length === 0 ? (
                 <div className="text-xl">Loading Channels...</div>
              ) : currentChannel && currentChannel.shows.length === 0 ? (
                 <div className="text-xl">No videos in this channel.</div>
              ) : (
                 <div className="text-xl">No Video</div> // Updated message
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-[var(--win95-window-bg)] p-2 border-2 border-[var(--win95-border-inner-dark)]">
        {/* Playback Controls removed - Channel Controls remain */}
        <div className="flex gap-2 mb-2 justify-center"> {/* Center the remaining buttons */}
          <button 
            className="win95-button flex-1"
            onClick={handlePreviousChannel}
            disabled={channels.length <= 1} // Disable if only one or no channels
          >
            ⏪ Prev
          </button>
          <button 
            className="win95-button flex-1"
            onClick={handleNextChannel}
            disabled={channels.length <= 1} // Disable if only one or no channels
          >
            ⏩ Next
          </button>
        </div>

        {/* Channel Info */}
        <div className="text-center text-sm">
          <p>Channel: {currentChannel?.name || 'Loading...'}</p>
          <p>Show: {currentShow?.title || 'Loading...'}</p>
        </div>
      </div>
    </div>
  );
};

export default TVPlayer;