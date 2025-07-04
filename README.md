 React ChatGPT Widget

**Add a smart AI chatbot to your website in just 2 minutes!**

This package gives you a floating chat button that opens into a full AI assistant powered by ChatGPT. Perfect for customer support, FAQ answers, or just helping your visitors.

 What is this?

Imagine having a helpful AI assistant that sits in the corner of your website, ready to answer questions 24/7. That's exactly what this widget does!

- **Floating chat button** that doesn't interfere with your website
- **Smart AI responses** using OpenAI's ChatGPT
- **Easy setup** - just add one line of code
- **Customizable** - change colors, position, and behavior
- **No server needed** - works entirely in the browser

##  Quick Start (2 minutes)

### Step 1: Install the package
```bash
npm install react-chatgpt-widget
```

### Step 2: Get an OpenAI API key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### Step 3: Add to your React app
```jsx
import { ChatGPTWidget } from 'react-chatgpt-widget';

function App() {
  return (
    <div>
      <h1>My Website</h1>
      <p>Welcome to my site!</p>
      
      {/* Add the AI chatbot */}
      <ChatGPTWidget 
        apiKey="sk-your-openai-api-key-here"
      />
    </div>
  );
}
```

That's it! Your website now has an AI chatbot!

 What it looks like

When someone visits your website, they'll see:
1. A chat button in the bottom-right corner
2. When clicked, it opens a chat window
3. Users can ask questions and get AI responses
4. The chat remembers the conversation

##  Customization Options

### Change the position
```jsx
<ChatGPTWidget 
  apiKey="your-key"
  position="bottom-left"  // Options: bottom-right, bottom-left, top-right, top-left
/>
```

### Change the theme
```jsx
<ChatGPTWidget 
  apiKey="your-key"
  theme="dark"  // Options: light, dark
/>
```

### Add voice input
```jsx
<ChatGPTWidget 
  apiKey="your-key"
  enableMicrophone={true}  // Users can speak instead of type
/>
```

### Add typing animation
```jsx
<ChatGPTWidget 
  apiKey="your-key"
  enableTypingAnimation={true}  // AI responses appear word by word
/>
```

### Customize the AI's personality
```jsx
<ChatGPTWidget 
  apiKey="your-key"
  systemPrompt="You are a friendly customer service representative. Always be helpful and polite."
/>
```

## 🔧 Complete Example

```jsx
import { ChatGPTWidget } from 'react-chatgpt-widget';

function App() {
  return (
    <div>
      <h1>My Online Store</h1>
      <p>Welcome! Need help? Chat with our AI assistant.</p>
      
      <ChatGPTWidget 
        apiKey="sk-your-openai-api-key-here"
        systemPrompt="You are a helpful customer service agent for an online store. Help customers with product questions, orders, and general support."
        position="bottom-right"
        theme="light"
        enableMicrophone={true}
        enableTypingAnimation={true}
        quickPrompts={[
          "What are your shipping options?",
          "How do I return an item?",
          "What's your return policy?",
          "Do you ship internationally?"
        ]}
      />
    </div>
  );
}
```

##  Use Cases

- **Customer Support**: Answer common questions automatically
- **FAQ Bot**: Help users find information quickly
- **Lead Generation**: Collect contact info through conversation
- **Product Recommendations**: Suggest products based on user needs
- **Booking Assistant**: Help with appointments or reservations
- **Educational Tool**: Explain concepts or provide tutorials

##  Security & Privacy

- **API key**: Store it in environment variables for production
- **Data**: Chat history is stored locally in the user's browser
- **No server**: All processing happens through OpenAI's secure API

### Environment Variables (Recommended)
```bash
# Create a .env file
REACT_APP_OPENAI_API_KEY=sk-your-actual-api-key
```

```jsx
<ChatGPTWidget 
  apiKey={process.env.REACT_APP_OPENAI_API_KEY}
/>
```

##  Troubleshooting

### "Widget doesn't appear"
- Make sure you have a valid OpenAI API key
- Check that the component is imported correctly
- Verify your React app is running

### "API key error"
- Ensure your OpenAI account has credits
- Check that the API key is correct
- Make sure you're using the right key format (starts with `sk-`)

### "Voice doesn't work"
- Voice input requires HTTPS in production
- Make sure the user grants microphone permission
- Check browser compatibility

##  Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Voice input needs HTTPS in production

##  Cost

- **Widget**: Free to use
- **OpenAI API**: Pay per use (very cheap)




