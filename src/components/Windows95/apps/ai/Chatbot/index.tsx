import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { callDeepseek } from '../../../../../lib/llm';

interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Create a new chat session on mount
  useEffect(() => {
    const createSession = async () => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({})
        .select('id')
        .single();
      if (data?.id) {
        setSessionId(data.id);
        // Load any existing messages (should be empty for new session)
        loadMessages(data.id);
        
        // Add welcome message
        const welcomeMessage: ChatMessage = {
          role: 'assistant',
          content: "Hello! I'm your AI assistant. How can I help you today?"
        };
        setMessages([welcomeMessage]);
        await storeMessage(data.id, welcomeMessage);
      } else {
        setError('Failed to create chat session.');
      }
    };
    createSession();
    // eslint-disable-next-line
  }, []);

  // Load messages for a session
  const loadMessages = async (sessionId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    if (data) setMessages(data);
  };

  // Store a message in Supabase
  const storeMessage = async (sessionId: string, msg: ChatMessage) => {
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      role: msg.role,
      content: msg.content,
    });
  };

  const handleSend = async () => {
    if (!input.trim() || loading || !sessionId) return;
    setError(null);
    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setIsTyping(true);
    
    try {
      await storeMessage(sessionId, userMsg);
      
      // Get chat history for context (last 10 messages)
      const history = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call DeepSeek API
      try {
        const response = await callDeepseek(input, history);
        
        // Add assistant response
        const assistantMessage: ChatMessage = { role: 'assistant', content: response };
        setMessages((prev) => [...prev, assistantMessage]);
        
        // Store assistant message
        await storeMessage(sessionId, assistantMessage);
      } catch (err) {
        console.error('Error generating response:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate response');
      }
      
    } catch (e: any) {
      setError(e.message || 'Something went wrong!');
    } finally {
      setIsTyping(false);
      setLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#bdbdbd' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '10px',
        backgroundColor: '#000080',
        padding: '5px',
        color: 'white'
      }}>
        <img 
          src="/90schatbot.png" 
          alt="Chatbot" 
          style={{ width: '24px', height: '24px', marginRight: '10px' }} 
        />
        <h2 style={{ fontSize: '16px', margin: 0 }}>AI Chatbot</h2>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#e5e5e5', borderBottom: '1px solid #888' }}>
        {messages.length === 0 && (
          <div style={{ color: '#555', fontStyle: 'italic', marginTop: 32, textAlign: 'center' }}>
            Loading chat...
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={msg.id || i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                background: msg.role === 'user' ? '#c0e0ff' : '#fff',
                color: '#222',
                border: '1px solid #888',
                borderRadius: 6,
                padding: '8px 12px',
                maxWidth: '70%',
                fontFamily: 'monospace',
                boxShadow: msg.role === 'user' ? '2px 2px 0 #a0a0a0' : '2px 2px 0 #e0e0e0',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                background: '#fff',
                color: '#222',
                border: '1px solid #888',
                borderRadius: 6,
                padding: '8px 12px',
                maxWidth: '70%',
                fontFamily: 'monospace',
                boxShadow: '2px 2px 0 #e0e0e0',
              }}
            >
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <style jsx>{`
                .typing-indicator {
                  display: flex;
                  align-items: center;
                  gap: 4px;
                }
                .typing-indicator span {
                  width: 6px;
                  height: 6px;
                  background-color: #888;
                  border-radius: 50%;
                  animation: typing 1s infinite ease-in-out;
                }
                .typing-indicator span:nth-child(1) {
                  animation-delay: 0s;
                }
                .typing-indicator span:nth-child(2) {
                  animation-delay: 0.2s;
                }
                .typing-indicator span:nth-child(3) {
                  animation-delay: 0.4s;
                }
                @keyframes typing {
                  0%, 100% {
                    transform: translateY(0);
                  }
                  50% {
                    transform: translateY(-4px);
                  }
                }
              `}</style>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {error && <div style={{ color: 'red', padding: 8, background: '#fffbe5', borderTop: '1px solid #888' }}>{error}</div>}
      <div style={{ display: 'flex', padding: 12, background: '#d0d0d0', borderTop: '1px solid #888' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Type your message..."
          style={{ flex: 1, marginRight: 8, padding: 8, border: '1px solid #888', borderRadius: 4, fontFamily: 'monospace' }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{ padding: '8px 16px', background: '#0CF2A0', color: '#222', border: '1px solid #888', borderRadius: 4, fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;