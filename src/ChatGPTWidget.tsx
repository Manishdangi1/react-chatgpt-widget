import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatGPTWidgetProps, Message, Position, Theme } from './types';

const ChatGPTWidget: React.FC<ChatGPTWidgetProps> = ({
  apiKey,
  systemPrompt = "You are a helpful AI assistant.",
  position = 'bottom-right',
  theme = 'light',
  userAvatar = '👤',
  assistantAvatar = '🤖',
  storageKey = 'chatgpt-widget-history',
  quickPrompts = [
    "Hello! How can you help me?",
    "What's the weather like?",
    "Explain React hooks",
    "Write a simple function"
  ],
  enableMicrophone = false,
  enableTypingAnimation = false,
  className,
  chatClassName,
  buttonClassName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(storageKey);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, [storageKey]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingText]);

  // Initialize speech recognition
  useEffect(() => {
    if (enableMicrophone && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, [enableMicrophone]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: content.trim() }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date()
      };

      if (enableTypingAnimation) {
        setIsTyping(true);
        setTypingText('');
        let currentText = '';
        const fullText = assistantMessage.content;
        
        for (let i = 0; i < fullText.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 50));
          currentText += fullText[i];
          setTypingText(currentText);
        }
        
        setIsTyping(false);
        setTypingText('');
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your API key and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, systemPrompt, messages, isLoading, enableTypingAnimation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const toggleMicrophone = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(storageKey);
  };

  const getPositionStyles = (pos: Position): React.CSSProperties => {
    switch (pos) {
      case 'bottom-left':
        return { bottom: '16px', left: '16px' };
      case 'bottom-right':
        return { bottom: '16px', right: '16px' };
      case 'top-left':
        return { top: '16px', left: '16px' };
      case 'top-right':
        return { top: '16px', right: '16px' };
      default:
        return { bottom: '16px', right: '16px' };
    }
  };

  const getThemeStyles = (th: Theme): React.CSSProperties => {
    return th === 'dark' 
      ? { backgroundColor: '#111827', color: 'white', borderColor: '#374151' }
      : { backgroundColor: 'white', color: '#111827', borderColor: '#e5e7eb' };
  };

  const getButtonThemeStyles = (th: Theme): React.CSSProperties => {
    return th === 'dark'
      ? { backgroundColor: '#2563eb', color: 'white' }
      : { backgroundColor: '#3b82f6', color: 'white' };
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 50,
    ...getPositionStyles(position)
  };

  const chatWindowStyle: React.CSSProperties = {
    marginBottom: '16px',
    width: '320px',
    height: '384px',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: '1px solid',
    display: 'flex',
    flexDirection: 'column',
    ...getThemeStyles(theme)
  };

  const headerStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid',
    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const messagesContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    height: '256px'
  };

  const messageStyle = (isUser: boolean): React.CSSProperties => ({
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    marginBottom: '16px'
  });

  const messageBubbleStyle = (isUser: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    maxWidth: '200px',
    flexDirection: isUser ? 'row-reverse' as const : 'row' as const
  });

  const messageContentStyle = (isUser: boolean): React.CSSProperties => ({
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: isUser
      ? (theme === 'dark' ? '#2563eb' : '#3b82f6')
      : (theme === 'dark' ? '#1f2937' : '#f3f4f6'),
    color: isUser ? 'white' : (theme === 'dark' ? 'white' : '#111827'),
    fontSize: '14px',
    lineHeight: '1.4'
  });

  const inputContainerStyle: React.CSSProperties = {
    padding: '16px',
    borderTop: '1px solid',
    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid',
    borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
    backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
    color: theme === 'dark' ? 'white' : '#111827',
    fontSize: '14px'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const sendButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: isLoading || !inputValue.trim() ? '#9ca3af' : '#3b82f6',
    color: 'white'
  };

  const toggleButtonStyle: React.CSSProperties = {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    transition: 'all 0.2s',
    border: 'none',
    cursor: 'pointer',
    ...getButtonThemeStyles(theme)
  };

  return (
    <div style={containerStyle} className={className}>
      {/* Chat Window */}
      {isOpen && (
        <div style={chatWindowStyle} className={chatClassName}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>{assistantAvatar}</span>
              <span style={{ fontWeight: '600' }}>AI Assistant</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={clearHistory}
                style={{ ...buttonStyle, backgroundColor: 'transparent' }}
                title="Clear history"
              >
                🗑️
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{ ...buttonStyle, backgroundColor: 'transparent' }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={messagesContainerStyle}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', fontSize: '14px', opacity: 0.7 }}>
                Start a conversation with the AI assistant!
              </div>
            )}
            
            {messages.map((message) => (
              <div key={message.id} style={messageStyle(message.role === 'user')}>
                <div style={messageBubbleStyle(message.role === 'user')}>
                  <span style={{ fontSize: '18px', marginTop: '4px' }}>
                    {message.role === 'user' ? userAvatar : assistantAvatar}
                  </span>
                  <div style={messageContentStyle(message.role === 'user')}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code: ({ node, inline, className, children, ...props }) => {
                          return !inline ? (
                            <pre style={{
                              backgroundColor: theme === 'dark' ? '#111827' : '#1f2937',
                              color: 'white',
                              padding: '8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              overflowX: 'auto'
                            }}>
                              <code {...props}>{children}</code>
                            </pre>
                          ) : (
                            <code style={{
                              backgroundColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
                              padding: '2px 4px',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }} {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={messageStyle(false)}>
                <div style={messageBubbleStyle(false)}>
                  <span style={{ fontSize: '18px', marginTop: '4px' }}>{assistantAvatar}</span>
                  <div style={messageContentStyle(false)}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {typingText}
                    </ReactMarkdown>
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '16px',
                      marginLeft: '4px',
                      backgroundColor: 'currentColor',
                      animation: 'blink 1s infinite'
                    }}></span>
                  </div>
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && !isTyping && (
              <div style={messageStyle(false)}>
                <div style={messageBubbleStyle(false)}>
                  <span style={{ fontSize: '18px', marginTop: '4px' }}>{assistantAvatar}</span>
                  <div style={messageContentStyle(false)}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'currentColor',
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite'
                      }}></div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'currentColor',
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite',
                        animationDelay: '0.1s'
                      }}></div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'currentColor',
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite',
                        animationDelay: '0.2s'
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length === 0 && quickPrompts.length > 0 && (
            <div style={{
              padding: '16px',
              borderTop: '1px solid',
              borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', opacity: 0.7 }}>
                Quick prompts:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      borderRadius: '16px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
                      color: theme === 'dark' ? 'white' : '#111827'
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={inputContainerStyle}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                style={inputStyle}
              />
              {enableMicrophone && (
                <button
                  type="button"
                  onClick={toggleMicrophone}
                  disabled={isLoading}
                  style={{
                    ...buttonStyle,
                    backgroundColor: isListening
                      ? '#ef4444'
                      : (theme === 'dark' ? '#374151' : '#f3f4f6'),
                    color: 'white'
                  }}
                  title={isListening ? 'Stop listening' : 'Start listening'}
                >
                  🎤
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                style={sendButtonStyle}
              >
                ➤
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={toggleButtonStyle}
        className={buttonClassName}
        title={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default ChatGPTWidget; 