export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type Position = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
export type Theme = 'light' | 'dark';

export interface ChatGPTWidgetProps {
  apiKey: string;
  systemPrompt?: string;
  position?: Position;
  theme?: Theme;
  userAvatar?: string;
  assistantAvatar?: string;
  storageKey?: string;
  quickPrompts?: string[];
  enableMicrophone?: boolean;
  enableTypingAnimation?: boolean;
  className?: string;
  buttonClassName?: string;
  chatClassName?: string;
} 