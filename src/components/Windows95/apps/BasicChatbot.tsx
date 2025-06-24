import React, { useState, useEffect, useRef } from 'react';
import { AppContentProps } from '../../../data/appData.tsx'; // Import AppContentProps

// Add AppContentProps to component signature
interface BasicChatbotProps extends AppContentProps {
  // No additional props needed for this basic version beyond AppContentProps
}

const BasicChatbot: React.FC<BasicChatbotProps> = () => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (inputText.trim()) {
      const newUserMessage = { text: inputText, sender: 'user' as 'user' }; // Explicitly cast to 'user'
      setMessages(prevMessages => [...prevMessages, newUserMessage]);
      setInputText('');

      // Simulate bot response after a short delay
      setTimeout(() => {
        const botResponse = { text: 'Coming Soon!', sender: 'bot' as 'bot' }; // Explicitly cast to 'bot'
        setMessages(prevMessages => [...prevMessages, botResponse]);
      }, 500);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the messages div
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '10px',
      boxSizing: 'border-box',
      backgroundColor: '#f0f0f0',
      border: '2px solid #c0c0c0',
    }}>
      <div 
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          marginBottom: '10px',
          padding: '5px',
          border: '1px solid #a0a0a0',
          backgroundColor: '#fff',
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '5px', color: msg.sender === 'user' ? 'blue' : 'green' }}>
            <strong>{msg.sender === 'user' ? 'You:' : 'Bot:'}</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            flexGrow: 1,
            padding: '5px',
            marginRight: '5px',
            border: '1px solid #a0a0a0',
          }}
          placeholder="Type a message..."
        />
        <button 
          onClick={handleSend}
          style={{
            padding: '5px 10px',
            border: '1px solid #a0a0a0',
            backgroundColor: '#e0e0e0',
            cursor: 'pointer',
          }}
        >Send</button>
      </div>
    </div>
  );
};

export default BasicChatbot; 