import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { callDeepseek } from '../../../lib/llm';
import { Send } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const ModernChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi there! I\'m your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
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
        }
      } catch (err) {
        console.error('Error creating session:', err);
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

  const handleSend = async () => {
    if (!input.trim() || isGenerating || !sessionId) return;
    
    // Add user message to state
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);
    
    try {
      // Store user message
      await storeMessage(sessionId, userMessage);
      
      // Get chat history for context (last 10 messages)
      const history = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call DeepSeek API with a professional system prompt
      const systemPrompt = `You are a professional AI assistant for Flash Forward, a digital agency specializing in web design, branding, content creation, and AI services. Your responses should be:
      
      1. Helpful, informative, and courteous
      2. Focused on Flash Forward's services and expertise
      3. Professional in tone while still being conversational
      4. Concise but thorough
      
      If asked about services, mention that Flash Forward offers web design, branding, content creation, AI integration, social media management, and growth strategy services.`;
      
      // Add system message to history
      const contextWithSystem = [
        { role: 'system', content: systemPrompt },
        ...history
      ];
      
      // Call the AI
      const response = await callDeepseek(input, contextWithSystem);
      
      // Add assistant response
      const assistantMessage: ChatMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Store assistant message
      await storeMessage(sessionId, assistantMessage);
    } catch (err) {
      console.error('Error generating response:', err);
      // Add a fallback response
      const fallbackMessage: ChatMessage = { 
        role: 'assistant', 
        content: `I apologize, but I'm experiencing some technical difficulties at the moment. Please try again later or contact our team directly for assistance.` 
      };
      setMessages(prev => [...prev, fallbackMessage]);
      await storeMessage(sessionId, fallbackMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/30 rounded-lg overflow-hidden border border-gray-800">
      <div className="p-4 border-b border-gray-800 bg-black/50">
        <h3 className="text-lg font-light text-white tracking-tight">Chat with Flash Forward AI</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-200'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isGenerating && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-800 text-gray-200">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-800 bg-black/50">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white resize-none"
            rows={1}
            disabled={isGenerating}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg disabled:opacity-50"
            disabled={isGenerating || !input.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernChatbot;