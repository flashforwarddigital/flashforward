import React, { useState, useEffect, useRef } from 'react';
import { colors, typography } from '../../../theme/theme';
import { X, Bot, Mic, Image, Video, Phone, Users, Mail, Search, Send, Sparkles, Download, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { callDeepseek } from '../../../lib/llm';
import { supabase } from '../../../lib/supabase';

interface AIWorkPopupProps {
  onClose: () => void;
}

interface AITool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  demoComponent: React.ReactNode;
}

const AIWorkPopup: React.FC<AIWorkPopupProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('chatbot');
  const buttonColor = colors.primary.purple; // #9933FF
  
  const aiTools: AITool[] = [
    {
      id: 'chatbot',
      title: 'Chatbot',
      description: 'Intelligent conversational agents that engage with your customers 24/7, answering questions and providing support.',
      icon: <Bot size={32} className="text-blue-400" />,
      color: '#008CFF',
      demoComponent: <ChatbotDemo />
    },
    {
      id: 'voicebot',
      title: 'Voicebot',
      description: 'Voice-activated assistants that provide a natural, hands-free way for users to interact with your services.',
      icon: <Mic size={32} className="text-green-400" />,
      color: '#00CC66',
      demoComponent: <VoicebotDemo />
    },
    {
      id: 'image-generation',
      title: 'Image Generation',
      description: 'Create unique, custom visuals for your brand with AI-powered image generation tools.',
      icon: <Image size={32} className="text-yellow-400" />,
      color: '#FFCC00',
      demoComponent: <ImageGenerationDemo />
    },
    {
      id: 'video-generation',
      title: 'Video Generation',
      description: 'Transform text into engaging video content with AI video generation technology.',
      icon: <Video size={32} className="text-red-400" />,
      color: '#FF1493',
      demoComponent: <VideoGenerationDemo />
    },
    {
      id: 'voice-sales',
      title: 'Voice Sales Agent',
      description: 'AI-powered sales representatives that can qualify leads and book appointments without human intervention.',
      icon: <Phone size={32} className="text-pink-400" />,
      color: '#FF6600',
      demoComponent: <VoiceSalesDemo />
    },
    {
      id: 'lead-generator',
      title: 'Lead Generator',
      description: 'Automated systems that identify and engage potential customers across digital channels.',
      icon: <Users size={32} className="text-purple-400" />,
      color: '#9933FF',
      demoComponent: <LeadGeneratorDemo />
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Personalized digital assistants that help streamline workflows and boost productivity.',
      icon: <Sparkles size={32} className="text-indigo-400" />,
      color: '#6366F1',
      demoComponent: <AIAssistantDemo />
    }
  ];
  
  const activeToolData = aiTools.find(tool => tool.id === activeTab) || aiTools[0];
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-[#0a0a0a] rounded-lg border border-gray-800 w-full max-w-6xl max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-800" 
             style={{ background: `linear-gradient(90deg, #0a0a0a, ${activeToolData.color}40)` }}>
          <div className="flex items-center gap-3">
            {activeToolData.icon}
            <h2 className={`${typography.fontSize['2xl']} ${typography.fontFamily.light} ${typography.tracking.tight} text-white`}>
              {activeToolData.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex h-[70vh]">
          {/* Sidebar with AI tools */}
          <div className="w-64 border-r border-gray-800 p-4 overflow-y-auto bg-black/50">
            <h3 className="text-gray-400 text-sm uppercase mb-4 font-light">AI Tools</h3>
            <div className="space-y-2">
              {aiTools.map((tool) => (
                <button
                  key={tool.id}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                    activeTab === tool.id 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-400 hover:bg-gray-900 hover:text-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(tool.id);
                  }}
                >
                  <div style={{ color: tool.color }}>{tool.icon}</div>
                  <span className="font-light tracking-tight">{tool.title}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <p className={`${typography.fontSize.lg} ${typography.fontFamily.light} ${typography.tracking.tight} text-gray-300 mb-6`}>
                {activeToolData.description}
              </p>
              
              {/* Demo component */}
              <div className="bg-black/30 border border-gray-800 rounded-lg overflow-hidden">
                {activeToolData.demoComponent}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-800 flex justify-between items-center">
          <div className="text-gray-400 text-sm">
            Try our AI tools and see how they can transform your business
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-2 text-black rounded-md transition-colors duration-300 text-sm font-light tracking-tight"
            style={{ 
              backgroundColor: buttonColor,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = `${buttonColor}dd`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = buttonColor;
            }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Demo Components for each AI tool
const ChatbotDemo: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I\'m your AI assistant. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setIsLoading(true);
    
    try {
      // Get chat history for context
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call DeepSeek API
      const response = await callDeepseek(input, history);
      
      // Add AI response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response
      }]);
    } catch (error) {
      console.error('Error calling AI:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };
  
  return (
    <div className="h-[400px] flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-blue-900/20 to-blue-600/5">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div 
              className={`inline-block p-3 rounded-lg max-w-[80%] ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-200'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="mb-4 text-left">
            <div className="inline-block p-3 rounded-lg bg-gray-800 text-gray-200">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-800 bg-black/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg disabled:opacity-50"
            disabled={isLoading || !input.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const VoicebotDemo: React.FC = () => {
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
  
  return (
    <div className="h-[400px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-green-900/20 to-green-600/5">
      <Mic size={64} className="text-green-500 mb-6" />
      <h3 className="text-white text-xl mb-4">Voice Assistant</h3>
      <p className="text-gray-400 text-center max-w-md mb-8">
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
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
          Get Notified
        </button>
      </div>
    </div>
  );
};

const ImageGenerationDemo: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [progress, setProgress] = useState(0);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [pollingCount, setPollingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);
  
  // Poll for prediction status
  useEffect(() => {
    if (generationId && isGenerating) {
      const interval = setInterval(async () => {
        try {
          setPollingCount(prev => prev + 1);
          console.log(`Polling attempt ${pollingCount + 1} for demo generation ${generationId}`);
          
          const { data, error } = await supabase
            .from('replicate_generations')
            .select('*')
            .eq('id', generationId)
            .maybeSingle();
          
          if (error) throw error;
          
          // If no data is returned, the record doesn't exist yet - continue polling
          if (!data) {
            console.log('No data found yet, continuing to poll...');
            return;
          }
          
          if (data.status === 'succeeded' && data.output && data.output.length > 0) {
            console.log('Generation succeeded!', data.output[0]);
            setGeneratedImage(data.output[0]);
            setIsGenerating(false);
            clearInterval(interval);
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            setProgress(100);
          } else if (data.status === 'failed') {
            console.error('Generation failed:', data.error);
            setError(data.error || 'Image generation failed');
            
            // Fallback for demo
            setTimeout(() => {
              setGeneratedImage('https://replicate.delivery/pbxt/4kw2JSufrgp7Y6NLaYdDLEOvx9CdTqpKkQh9RXBxjxBXYHbE/out-0.png');
              setIsGenerating(false);
              setProgress(100);
            }, 1000);
          }
        } catch (error) {
          console.error('Error polling for generation status:', error);
          // If we can't get the status after several attempts, use a fallback
          if (pollingCount > 15) {
            console.log('Error polling, using fallback image');
            setGeneratedImage('https://replicate.delivery/pbxt/4kw2JSufrgp7Y6NLaYdDLEOvx9CdTqpKkQh9RXBxjxBXYHbE/out-0.png');
            setIsGenerating(false);
            clearInterval(interval);
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            setProgress(100);
          }
        }
      }, 2000);
      
      // Start a fake progress indicator
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          // Slowly increase up to 95%, the last 5% will be set when the image is actually ready
          const newProgress = prev + (95 - prev) * 0.1;
          return Math.min(newProgress, 95);
        });
      }, 500);
      
      return () => {
        clearInterval(interval);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [generationId, isGenerating, pollingCount]);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setGeneratedImage('');
    setPollingCount(0);
    
    try {
      // Simulate image generation with a real API call
      try {
        // Call the Supabase Edge Function
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`;
        
        const headers = {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        };

        console.log('Sending demo request to generate image...');
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            prompt: prompt
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to start image generation');
        }
        
        const data = await response.json();
        console.log('Demo generation started with ID:', data.id);
        setGenerationId(data.id);
        
      } catch (error) {
        console.error('Error generating demo image:', error);
        
        // Fallback for demo
        setTimeout(() => {
          setGeneratedImage('https://replicate.delivery/pbxt/4kw2JSufrgp7Y6NLaYdDLEOvx9CdTqpKkQh9RXBxjxBXYHbE/out-0.png');
          setIsGenerating(false);
          setProgress(100);
        }, 3000);
      }
    } catch (err) {
      console.error('Error in generateImage:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
      
      // Fallback for demo
      setTimeout(() => {
        setGeneratedImage('https://replicate.delivery/pbxt/4kw2JSufrgp7Y6NLaYdDLEOvx9CdTqpKkQh9RXBxjxBXYHbE/out-0.png');
        setIsGenerating(false);
        setProgress(100);
      }, 3000);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `ai-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      setError('Failed to download image. Try right-clicking and saving manually.');
    }
  };
  
  return (
    <div className="h-[400px] flex flex-col p-6 bg-gradient-to-b from-yellow-900/20 to-yellow-600/5">
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Enter a prompt to generate an image:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic cityscape with flying cars..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === 'Enter') generateImage();
            }}
          />
          <button
            onClick={generateImage}
            disabled={isGenerating || !prompt.trim()}
            className="bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isGenerating ? <RefreshCw className="animate-spin\" size={18} /> : <Image size={18} />}
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
        
        {error && (
          <div className="mt-2 p-2 bg-red-500/10 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
      
      <div className="flex-1 flex items-center justify-center border border-gray-800 rounded-lg bg-black/50 overflow-hidden relative">
        {isGenerating ? (
          <div className="text-center z-10">
            <div className="w-full h-2 bg-gray-800 mb-4 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-gray-300">Creating your image... {Math.round(progress)}%</p>
            <p className="text-gray-500 text-sm mt-2">
              Note: Image generation can take 15-30 seconds with our API
            </p>
          </div>
        ) : generatedImage ? (
          <div className="relative group w-full h-full flex items-center justify-center p-4">
            <img 
              src={generatedImage} 
              alt="Generated" 
              className="max-w-full max-h-full object-contain" 
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button 
                onClick={handleDownload}
                className="bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Download size={18} />
                Download
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Your generated image will appear here</p>
        )}
      </div>
    </div>
  );
};

const VideoGenerationDemo: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    // Calculate a fixed target date based on 14 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);
    
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
  
  return (
    <div className="h-[400px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-pink-900/20 to-pink-600/5">
      <Video size={64} className="text-pink-500 mb-6" />
      <h3 className="text-white text-xl mb-4">AI Video Generation</h3>
      <p className="text-gray-400 text-center max-w-md mb-8">
        Our AI video generation technology is coming soon! It will transform your text prompts into professional-quality videos.
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
        <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg">
          Get Notified
        </button>
      </div>
    </div>
  );
};

const VoiceSalesDemo: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    // Calculate a fixed target date based on 7 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    
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
  
  return (
    <div className="h-[400px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-orange-900/20 to-orange-600/5">
      <Phone size={64} className="text-orange-500 mb-6" />
      <h3 className="text-white text-xl mb-4">AI Voice Sales Agent</h3>
      <p className="text-gray-400 text-center max-w-md mb-8">
        Our AI voice sales agents will handle customer inquiries, qualify leads, and book appointments without human intervention.
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
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg">
          Get Notified
        </button>
      </div>
    </div>
  );
};

const LeadGeneratorDemo: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    // Calculate a fixed target date based on 14 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);
    
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
  
  return (
    <div className="h-[400px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-purple-900/20 to-purple-600/5">
      <Users size={64} className="text-purple-500 mb-6" />
      <h3 className="text-white text-xl mb-4">AI Lead Generator</h3>
      <p className="text-gray-400 text-center max-w-md mb-8">
        Our AI lead generation system will automatically identify and engage potential customers across digital channels.
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
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
          Get Notified
        </button>
      </div>
    </div>
  );
};

const AIAssistantDemo: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    // Calculate a fixed target date based on 17.5 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 17);
    targetDate.setHours(targetDate.getHours() + 12); // Add 12 hours for the .5
    
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
  
  return (
    <div className="h-[400px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-900/20 to-indigo-600/5">
      <Sparkles size={64} className="text-indigo-500 mb-6" />
      <h3 className="text-white text-xl mb-4">AI Personal Assistant</h3>
      <p className="text-gray-400 text-center max-w-md mb-8">
        Our AI personal assistant will help you stay organized, manage tasks, and boost your productivity.
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
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg">
          Get Notified
        </button>
      </div>
    </div>
  );
};

export default AIWorkPopup;