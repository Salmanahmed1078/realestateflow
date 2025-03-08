
import React from 'react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] p-3 rounded-lg ${
          role === 'user' 
            ? 'bg-primary text-primary-foreground rounded-tr-none'
            : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default ChatMessage;
