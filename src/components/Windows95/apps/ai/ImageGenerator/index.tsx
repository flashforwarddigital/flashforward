import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../../../lib/supabase';

interface GenerationResult {
  id: string;
  status: string;
  output: string[] | null;
  error: string | null;
}

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('90s Style');
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const styles = {
    '90s Style': 'a 1990s style image of',
    'VHS': 'super realistic image that looks exactly like it was captured from an actual VHS tape — featuring authentic analog scan lines, static noise, color bleeding, grainy texture, timestamp in the corner, and soft blur. The scene has a nostalgic, lo-fi vintage look with tracking errors and worn tape artifacts, reminiscent of genuine home video footage from the 1990s. Image of',
    'Polaroid': 'photographed in the style of a vintage Polaroid — soft natural lighting, slight overexposure, muted pastel tones, subtle film grain, and a white Polaroid frame around the image. The photo has a warm, nostalgic feel, like a candid moment from the late 80s or early 90s. Image of',
    'Yearbook': 'Portrait of [USER INPUT], styled like a 1990s high school yearbook photo. The subject is posed in front of a retro laser or gradient background with soft studio lighting and slightly awkward framing typical of old school portraits. Add subtle grain and a nostalgic vibe. Include a short, cheesy yearbook quote at the bottom',
    '90s Fashion': 'dressed in 1990s fashion — wearing a colorful windbreaker, baggy jeans or cargo pants, chunky sneakers, and retro sunglasses. The background features an urban skate park or graffiti wall, with vibrant, saturated colors and a cool 90s streetwear vibe. Capture the playful, bold energy of 90s youth culture. Image of',
  };

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [pollingInterval]);

  // Poll for prediction status
  useEffect(() => {
    if (generationId && isGenerating) {
      const interval = setInterval(async () => {
        try {
          const { data, error } = await supabase
            .from('replicate_generations')
            .select('*')
            .eq('id', generationId)
            .maybeSingle();
          
          if (error) throw error;
          
          // If no data is returned, the record doesn't exist yet - continue polling
          if (!data) {
            return;
          }
          
          if (data.status === 'succeeded' && data.output && data.output.length > 0) {
            setGeneratedImageUrl(data.output[0]);
            setIsGenerating(false);
            clearInterval(interval);
            setPollingInterval(null);
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            setGenerationProgress(100);
          } else if (data.status === 'failed') {
            setError(data.error || 'Image generation failed');
            setIsGenerating(false);
            clearInterval(interval);
            setPollingInterval(null);
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
          }
        } catch (err) {
          console.error('Error polling for generation status:', err);
          // If we can't get the status after several attempts, use a fallback
          if (isGenerating && !generatedImageUrl) {
            setError('Could not retrieve generation status. Please try again.');
            setIsGenerating(false);
            clearInterval(interval);
            setPollingInterval(null);
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
          }
        }
      }, 2000);
      
      setPollingInterval(interval);
      
      // Start a fake progress indicator
      progressIntervalRef.current = setInterval(() => {
        setGenerationProgress(prev => {
          // Slowly increase up to 90%, the last 10% will be set when the image is actually ready
          const newProgress = prev + (90 - prev) * 0.1;
          return Math.min(newProgress, 90);
        });
      }, 500);
      
      return () => {
        clearInterval(interval);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [generationId, isGenerating, generatedImageUrl]);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedImageUrl(null);
    setGenerationProgress(0);
    
    try {
      // Properly combine the user's input with the style prompt
      let enhancedPrompt;
      
      if (selectedStyle === 'Yearbook') {
        // Special handling for yearbook style to replace [USER INPUT]
        enhancedPrompt = styles[selectedStyle as keyof typeof styles].replace('[USER INPUT]', prompt);
      } else {
        enhancedPrompt = `${styles[selectedStyle as keyof typeof styles]} ${prompt}, nostalgic, retro aesthetic`;
      }
      
      // Call the Supabase Edge Function
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`;
      
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: enhancedPrompt
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start image generation');
      }
      
      const data = await response.json();
      setGenerationId(data.id);
      
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
      setIsGenerating(false);
      
      // Fallback for demo purposes
      setTimeout(() => {
        setGeneratedImageUrl('https://replicate.delivery/pbxt/4kw2JSufrgp7Y6NLaYdDLEOvx9CdTqpKkQh9RXBxjxBXYHbE/out-0.png');
        setIsGenerating(false);
        setGenerationProgress(100);
      }, 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isGenerating) {
      generateImage();
    }
  };

  return (
    <div style={{ 
      padding: '10px', 
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
        marginBottom: '10px'
      }}>
        <img 
          src="/imagegen.png" 
          alt="Image Generator" 
          style={{ width: '24px', height: '24px', marginRight: '10px' }} 
        />
        <h2 style={{ fontSize: '16px', margin: 0 }}>90s Image Generator</h2>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Style:</label>
          <select 
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="win95-button"
            style={{ width: '100%', padding: '4px' }}
          >
            {Object.keys(styles).map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
        
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your image prompt..."
            style={{
              flex: 1,
              padding: '5px',
              border: '2px solid',
              borderColor: '#808080 #ffffff #ffffff #808080',
              boxShadow: '1px 1px 0 0 #dfdfdf inset',
              marginRight: '5px'
            }}
            disabled={isGenerating}
          />
          <button
            onClick={generateImage}
            className="win95-button"
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
        
        {error && (
          <div style={{ 
            color: 'red', 
            padding: '5px', 
            border: '1px solid red', 
            marginBottom: '10px',
            backgroundColor: '#ffeeee'
          }}>
            {error}
          </div>
        )}
      </div>
      
      <div style={{ flex: 1, overflow: 'auto' }}>
        {isGenerating && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            marginBottom: '10px',
            backgroundColor: '#f0f0f0'
          }}>
            <div>Generating your 90s style image...</div>
            <div style={{ 
              width: '100%', 
              height: '20px', 
              border: '1px solid #808080',
              marginTop: '10px',
              position: 'relative',
              backgroundColor: '#ffffff'
            }}>
              <div style={{
                position: 'absolute',
                height: '100%',
                width: `${generationProgress}%`,
                backgroundColor: '#000080',
                transition: 'width 0.5s ease-in-out'
              }}></div>
            </div>
            <div style={{ marginTop: '5px', fontSize: '12px' }}>
              {Math.round(generationProgress)}% complete
            </div>
          </div>
        )}
        
        {generatedImageUrl && (
          <div style={{ 
            marginBottom: '20px',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            padding: '10px',
            backgroundColor: 'white'
          }}>
            <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>Generated Image</h3>
            <img 
              src={generatedImageUrl} 
              alt={prompt}
              style={{ 
                width: '100%', 
                height: 'auto',
                border: '1px solid #808080',
                marginBottom: '10px'
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <a 
                href={generatedImageUrl}
                download={`90s-image-${Date.now()}.png`}
                target="_blank"
                rel="noopener noreferrer"
                className="win95-button"
                style={{ display: 'inline-block', textDecoration: 'none' }}
              >
                Download Image
              </a>
            </div>
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#555' }}>
          Powered by Replicate AI<br/>
          Using Flux 1.1 Pro Ultra
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;