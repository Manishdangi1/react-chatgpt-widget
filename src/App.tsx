import React, { useState, useEffect } from 'react';
import ChatGPTWidget from './ChatGPTWidget';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [enableMicrophone, setEnableMicrophone] = useState(false);
  const [enableTypingAnimation, setEnableTypingAnimation] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  // Check if already configured
  useEffect(() => {
    const savedApiKey = localStorage.getItem('chatgpt-widget-api-key');
    const savedPosition = localStorage.getItem('chatgpt-widget-position') as any;
    const savedTheme = localStorage.getItem('chatgpt-widget-theme') as any;
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setPosition(savedPosition || 'bottom-right');
      setTheme(savedTheme || 'light');
      setIsConfigured(true);
      setShowConfig(false);
    }
  }, []);

  const handleSaveConfig = () => {
    if (apiKey.trim()) {
      localStorage.setItem('chatgpt-widget-api-key', apiKey);
      localStorage.setItem('chatgpt-widget-position', position);
      localStorage.setItem('chatgpt-widget-theme', theme);
      setIsConfigured(true);
      setShowConfig(false);
    }
  };

  const handleResetConfig = () => {
    localStorage.removeItem('chatgpt-widget-api-key');
    localStorage.removeItem('chatgpt-widget-position');
    localStorage.removeItem('chatgpt-widget-theme');
    setApiKey('');
    setPosition('bottom-right');
    setTheme('light');
    setIsConfigured(false);
    setShowConfig(true);
  };

  // Auto-hide config after 30 seconds if not configured
  useEffect(() => {
    if (showConfig && !isConfigured) {
      const timer = setTimeout(() => {
        setShowConfig(false);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [showConfig, isConfigured]);

  if (showConfig) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <h2 style={{ margin: '0 0 24px 0', color: '#1f2937', fontSize: '24px' }}>
            🤖 ChatGPT Widget Setup
          </h2>
          
          <p style={{ margin: '0 0 24px 0', color: '#6b7280', fontSize: '14px' }}>
            Configure your AI chatbot widget. This dialog will disappear once configured.
          </p>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              OpenAI API Key *
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
              Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>OpenAI Platform</a>
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Widget Position
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as any)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
              aria-label="Select widget position"
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
              aria-label="Select theme"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={enableMicrophone}
                onChange={(e) => setEnableMicrophone(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              <span style={{ fontSize: '14px', color: '#374151' }}>Enable Microphone Input</span>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={enableTypingAnimation}
                onChange={(e) => setEnableTypingAnimation(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              <span style={{ fontSize: '14px', color: '#374151' }}>Enable Typing Animation</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={handleResetConfig}
              style={{
                padding: '10px 16px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#374151',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
            <button
              onClick={handleSaveConfig}
              disabled={!apiKey.trim()}
              style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: apiKey.trim() ? '#3b82f6' : '#9ca3af',
                color: 'white',
                fontSize: '14px',
                cursor: apiKey.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Save & Start
            </button>
          </div>

          <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>Features:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#6b7280' }}>
              <li>AI-powered conversations with GPT-3.5-turbo</li>
              <li>Persistent chat history</li>
              <li>Markdown support with code highlighting</li>
              <li>Customizable themes and positions</li>
              <li>Quick prompts for easy interaction</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Show only the chatbot widget
  return (
    <ChatGPTWidget
      apiKey={apiKey}
      position={position}
      theme={theme}
      enableMicrophone={enableMicrophone}
      enableTypingAnimation={enableTypingAnimation}
      quickPrompts={[
        "Hello! How can you help me?",
        "Explain React hooks",
        "Write a simple function",
        "What's the weather like?"
      ]}
    />
  );
}

export default App; 