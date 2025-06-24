import React, { useState, useRef, useEffect } from 'react';
import { callDeepseek } from '../../../../../lib/llm';
import { supabase } from '../../../../../lib/supabase';
import '../../../../../styles/90sGPT.css';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const GPT90s: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create a chat session on mount
  useEffect(() => {
    const createSession = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_sessions')
          .insert({})
          .select('id')
          .single();
          
        if (data?.id) {
          setSessionId(data.id);
          // Add welcome message
          const welcomeMessage: ChatMessage = {
            role: 'assistant',
            content: "Welcome to 90sGPT! I'm running on a Pentium processor with 16MB of RAM. What can I help you with today? :-)"
          };
          setMessages([welcomeMessage]);
          await storeMessage(data.id, welcomeMessage);
        } else {
          setError('Failed to create chat session');
        }
      } catch (err) {
        console.error('Error creating session:', err);
        setError('Failed to initialize chat');
      }
    };
    
    createSession();
  }, []);

  // Store a message in Supabase
  const storeMessage = async (sessionId: string, msg: ChatMessage) => {
    try {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role: msg.role,
        content: msg.content,
      });
    } catch (err) {
      console.error('Error storing message:', err);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = async () => {
    if (!prompt.trim() || !sessionId) return;
    
    setIsGenerating(true);
    setError(null);
    
    // Add user message to state
    const userMessage: ChatMessage = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    
    try {
      // Store user message
      await storeMessage(sessionId, userMessage);
      
      // Show typing indicator
      setIsTyping(true);
      
      // Get chat history for context (last 10 messages)
      const history = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call DeepSeek API with delay to simulate 90s internet
      setTimeout(async () => {
        try {
          const response = await callDeepseek(prompt, history);
          
          // Add assistant response
          const assistantMessage: ChatMessage = { role: 'assistant', content: response };
          setMessages(prev => [...prev, assistantMessage]);
          
          // Store assistant message
          await storeMessage(sessionId, assistantMessage);
        } catch (err) {
          console.error('Error generating response:', err);
          setError(err instanceof Error ? err.message : 'Failed to generate response');
        } finally {
          setIsTyping(false);
          setIsGenerating(false);
        }
      }, 1500); // Simulate 90s internet delay
      
    } catch (err) {
      console.error('Error in generate response flow:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsTyping(false);
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateResponse();
    }
  };

  return (
    <div className="gpt90s-container">
      <div className="gpt90s-header">
        <img 
          src="/90sgpt.png" 
          alt="90sGPT" 
          className="gpt90s-header-icon" 
        />
        <h2 className="gpt90s-header-title">90sGPT</h2>
      </div>
      
      <div className="gpt90s-content">
        <div className="gpt90s-messages">
          {messages.length === 0 ? (
            <div className="gpt90s-welcome">
              <img 
                src="/90sgpt.png" 
                alt="90sGPT" 
                className="gpt90s-welcome-icon" 
              />
              <p style={{ fontStyle: 'italic' }}>
                Loading 90sGPT...<br/>
                Please wait while I connect to the information superhighway.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`gpt90s-message ${message.role === 'user' ? 'gpt90s-message-user' : 'gpt90s-message-assistant'}`}>
                <strong>{message.role === 'user' ? 'You:' : '90sGPT:'}</strong> {message.content}
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="gpt90s-message gpt90s-message-assistant">
              <strong>90sGPT:</strong>&nbsp;
              <div className="gpt90s-typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="gpt90s-input-area">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask 90sGPT something..."
            className="gpt90s-textarea"
            disabled={isGenerating}
          />
          
          {error && (
            <div className="gpt90s-error">
              {error}
            </div>
          )}
          
          <div className="gpt90s-controls">
            <div className="gpt90s-status">
              {isGenerating ? 'Connecting to CompuServe...' : 'Ready'}
            </div>
            
            <button
              onClick={generateResponse}
              className="win95-button"
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? 'Processing...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPT90s;