import React from 'react';
import { ChatGPTWidget } from 'react-chatgpt-widget';

function App() {
  return (
    <div>
      <h1>My React App</h1>
      <p>This is a simple example of using the React ChatGPT Widget.</p>
      
      <ChatGPTWidget 
        apiKey="your-openai-api-key-here"
        systemPrompt="You are a helpful AI assistant."
        position="bottom-right"
        theme="light"
        userAvatar="👤"
        assistantAvatar="🤖"
        quickPrompts={[
          "Hello! How can you help me?",
          "Explain React hooks",
          "Write a simple function",
          "What's the weather like?"
        ]}
        enableMicrophone={false}
        enableTypingAnimation={true}
        storageKey="my-app-chat-history"
      />
    </div>
  );
}

export default App; 