
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
  onReset: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, onReset }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <Bot className="h-5 w-5 mr-2 text-primary" />
        <h3 className="text-lg font-semibold">Property Assistant</h3>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onReset}
        >
          Reset
        </Button>
        <Button
          variant="ghost" 
          size="icon"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
