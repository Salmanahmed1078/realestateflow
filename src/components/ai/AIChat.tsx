import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Bot, X, Loader2, Mic, MicOff } from 'lucide-react';
import { generateChatResponse, generatePropertyRecommendations } from '../../lib/gemini';
import { usePreferenceStore } from '../../stores/preferenceStore';
import { PropertyFilters } from '../../types/property';
import { properties } from '../../data/properties';

interface AIChatProps {
  onSearch: (filters: PropertyFilters) => void;
}

const AIChat: React.FC<AIChatProps> = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
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

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversationHistory]);

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
      let aiResponse = '';
      
      switch (chatStep) {
        case 0: // Property type question
          // Process user's property type preference
          if (userMessage.toLowerCase().includes('house')) {
            setPreference('propertyType', 'House');
          } else if (userMessage.toLowerCase().includes('apartment')) {
            setPreference('propertyType', 'Apartment');
          } else if (userMessage.toLowerCase().includes('condo')) {
            setPreference('propertyType', 'Condo');
          } else if (userMessage.toLowerCase().includes('townhouse')) {
            setPreference('propertyType', 'Townhouse');
          }
          
          // Move to next question
          aiResponse = "Great! What's your budget range? (e.g., $300k-500k)";
          nextStep();
          break;
          
        case 1: // Budget question
          // Process budget information
          const budgetMatch = userMessage.match(/(\$?[\d,]+)k?-(\$?[\d,]+)k?/i);
          if (budgetMatch) {
            const minStr = budgetMatch[1].replace(/[$,]/g, '');
            const maxStr = budgetMatch[2].replace(/[$,]/g, '');
            let min = parseInt(minStr);
            let max = parseInt(maxStr);
            
            // Check if values are in thousands (k)
            if (userMessage.includes('k') || userMessage.includes('K')) {
              min *= 1000;
              max *= 1000;
            }
            
            setPreference('budget', { min, max });
          }
          
          // Move to next question
          aiResponse = "Which locations are you interested in?";
          nextStep();
          break;
          
        case 2: // Location question
          // Process location information
          const locations = userMessage
            .split(/,|\sand\s/)
            .map(loc => loc.trim())
            .filter(loc => loc.length > 0);
          
          setPreference('locations', locations);
          
          // Move to next question
          aiResponse = "What amenities are must-haves for you? (e.g., pool, garden, parking)";
          nextStep();
          break;
          
        case 3: // Amenities question
          // Process amenities
          const amenities = userMessage
            .split(/,|\sand\s/)
            .map(amenity => amenity.trim().toLowerCase())
            .filter(amenity => amenity.length > 0);
          
          setPreference('amenities', amenities);
          
          if (userMessage.toLowerCase().includes('pet')) {
            setPreference('isPetFriendly', true);
          }
          if (userMessage.toLowerCase().includes('pool')) {
            setPreference('hasPool', true);
          }
          if (userMessage.toLowerCase().includes('garden') || userMessage.toLowerCase().includes('yard')) {
            setPreference('hasGarden', true);
          }
          if (userMessage.toLowerCase().includes('parking') || userMessage.toLowerCase().includes('garage')) {
            setPreference('hasParking', true);
          }
          
          // Now process all preferences to find matching properties
          aiResponse = "Thanks for sharing your preferences! Let me find some properties that match your criteria...";
          addMessage('assistant', aiResponse);
          
          // This looks like a loading message, so set loading to simulate AI thinking
          setIsLoading(true);
          
          // Find property recommendations using Gemini
          const recommendedIds = await generatePropertyRecommendations(preferences, properties);
          
          // Create filters based on collected preferences
          const filters: PropertyFilters = {
            propertyType: preferences.propertyType === 'All' ? undefined : preferences.propertyType,
            minPrice: preferences.budget.min,
            maxPrice: preferences.budget.max,
            isPetFriendly: preferences.isPetFriendly,
            hasPool: preferences.hasPool,
            hasGarden: preferences.hasGarden,
            hasParking: preferences.hasParking,
          };
          
          // If we have locations, add the first one as a filter
          if (preferences.locations.length > 0) {
            filters.location = preferences.locations[0];
          }
          
          // Apply filters to the search
          onSearch(filters);
          
          // Generate final response
          let matchCount = recommendedIds.length;
          if (matchCount > 0) {
            aiResponse = `I've found ${matchCount} properties that match your criteria! I've updated the listings to show you the best matches. Feel free to ask me about specific properties or refine your search.`;
          } else {
            aiResponse = `I couldn't find exact matches for all your criteria. I've updated the filters with your preferences, but you might want to adjust them to see more options.`;
          }
          
          nextStep();
          break;
          
        default: // Open conversation after preferences are collected
          // Process natural language query to refine filters
          const filters: PropertyFilters = {};
          
          // Check for mentions of pet-friendly
          if (userMessage.toLowerCase().includes('pet friendly') || userMessage.toLowerCase().includes('pet-friendly')) {
            filters.isPetFriendly = true;
          }
          
          // Check for mentions of pools
          if (userMessage.toLowerCase().includes('pool')) {
            filters.hasPool = true;
          }
          
          // Check for location mentions
          if (userMessage.toLowerCase().includes('miami')) {
            filters.location = 'Miami';
          } else if (userMessage.toLowerCase().includes('san francisco')) {
            filters.location = 'San Francisco';
          } else if (userMessage.toLowerCase().includes('austin')) {
            filters.location = 'Austin';
          }
          
          // Check for bedroom mentions
          const bedroomMatch = userMessage.match(/(\d+)[\s-]*(bed|bedroom|br|bd)/i);
          if (bedroomMatch) {
            filters.bedrooms = parseInt(bedroomMatch[1], 10);
          }
          
          // Check for bathroom mentions
          const bathroomMatch = userMessage.match(/(\d+)[\s-]*(bath|bathroom|ba)/i);
          if (bathroomMatch) {
            filters.bathrooms = parseInt(bathroomMatch[1], 10);
          }
          
          // If we have any filters, apply them
          if (Object.keys(filters).length > 0) {
            onSearch(filters);
            aiResponse = `I've updated the listings based on your request. Let me know if you want to refine your search further.`;
          } else {
            // If no specific filters detected, generate a response using Gemini
            aiResponse = await generateChatResponse(userMessage);
          }
          break;
      }
      
      addMessage('assistant', aiResponse);
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
      setInput('');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    await handleQuestionFlow(input);
  };
  
  const toggleVoiceRecording = () => {
    if (!isRecording) {
      // Check if browser supports SpeechRecognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        setIsRecording(true);
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsRecording(false);
        };
        
        recognition.onerror = () => {
          toast({
            title: "Voice Recognition Error",
            description: "Could not recognize your voice. Please try again or type your message.",
          });
          setIsRecording(false);
        };
        
        recognition.start();
      } else {
        toast({
          variant: "destructive",
          title: "Not Supported",
          description: "Voice recognition is not supported in your browser.",
        });
      }
    } else {
      setIsRecording(false);
      // Would need to stop the recognition if it was active
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

      {/* Chat dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md h-[600px] max-h-[90vh] flex flex-col animate-scale-in shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-lg font-semibold">Gemini Property Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={resetChat}
                >
                  Reset
                </Button>
                <Button
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Conversation */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {conversationHistory.map((message, index) => (
                <div 
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-gray-700 rounded-tl-none flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>
            
            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-end space-x-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                  disabled={isLoading || isRecording}
                />
                <div className="flex flex-col gap-2">
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline"
                    disabled={isLoading}
                    onClick={toggleVoiceRecording}
                    className={isRecording ? "bg-red-100 dark:bg-red-900" : ""}
                  >
                    {isRecording ? (
                      <MicOff className="h-5 w-5 text-red-500" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </Button>
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
