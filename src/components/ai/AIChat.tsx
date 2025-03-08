import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bot } from 'lucide-react';
import { usePreferenceStore } from '../../stores/preferenceStore';
import { PropertyFilters } from '../../types/property';
import { processUserMessage } from '../../utils/chatUtils';
import ChatHeader from './ChatHeader';
import ChatContainer from './ChatContainer';
import ChatInput from './ChatInput';

interface AIChatProps {
  onSearch: (filters: PropertyFilters) => void;
}

const AIChat: React.FC<AIChatProps> = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const {
    preferences,
    chatStep,
    conversationHistory,
    setPreference,
    nextStep,
    addMessage,
    resetConversation,
  } = usePreferenceStore();

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      // We don't directly load the history to keep the welcome message logic simpler,
      // but in a real app you would parse and set the conversation here
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (conversationHistory.length > 1) {
      localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
    }
  }, [conversationHistory]);

  const handleQuestionFlow = async (userMessage: string) => {
    setIsLoading(true);
    addMessage('user', userMessage);

    try {
      // Process the message based on conversation step
      const { aiResponse, filters } = await processUserMessage(
        userMessage,
        chatStep,
        setPreference,
        preferences
      );
      
      // Apply filters if available
      if (filters && Object.keys(filters).length > 0) {
        onSearch(filters);
      }
      
      // Add AI response to conversation
      addMessage('assistant', aiResponse);
      
      // Move to next step if not at the open conversation step yet
      if (chatStep <= 3) {
        nextStep();
      }
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "I'm having trouble processing your request. Please try again.",
      });
      addMessage('assistant', "I'm having trouble processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetChat = () => {
    resetConversation();
    localStorage.removeItem('chatHistory');
    toast({
      title: "Chat Reset",
      description: "Your conversation history has been cleared.",
    });
  };

  return (
    <>
      {/* Floating chat button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-10 rounded-full shadow-lg p-4 flex items-center justify-center"
        variant="secondary"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {/* Chat dialog - positioned on the right side */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 flex items-stretch justify-end">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md h-full flex flex-col animate-slide-in-from-right shadow-xl">
            {/* Header */}
            <ChatHeader 
              onClose={() => setIsOpen(false)} 
              onReset={resetChat}
            />
            
            {/* Conversation */}
            <ChatContainer 
              messages={conversationHistory}
              isLoading={isLoading}
            />
            
            {/* Input */}
            <ChatInput 
              onSendMessage={handleQuestionFlow}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
