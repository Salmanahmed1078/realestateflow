
import React, { useState } from 'react';
import { Send, Bot, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PropertyFilters } from '../../types/property';

interface AIAssistantProps {
  onSearch: (filters: PropertyFilters) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{role: 'user' | 'assistant'; content: string}[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI property assistant. Ask me to find properties like "Find a 3-bedroom house with a pool in Miami under $1M" or "Show me pet-friendly apartments in Austin with 2+ baths".'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message to conversation
    setConversation([...conversation, { role: 'user', content: query }]);
    
    // Simulate AI processing
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate AI response - in production, this would call the OpenAI API
      let response = "I've found some properties that match your criteria. Here they are!";
      
      // Create mock filters based on the query
      const filters: PropertyFilters = {};
      
      if (query.toLowerCase().includes('pet friendly') || query.toLowerCase().includes('pet-friendly')) {
        filters.isPetFriendly = true;
      }
      
      if (query.toLowerCase().includes('pool')) {
        filters.hasPool = true;
      }
      
      if (query.toLowerCase().includes('miami')) {
        filters.location = 'Miami';
      } else if (query.toLowerCase().includes('austin')) {
        filters.location = 'Austin';
      } else if (query.toLowerCase().includes('san francisco')) {
        filters.location = 'San Francisco';
      }
      
      const bedroomMatch = query.match(/(\d+)[\s-]*(bed|bedroom|br|bd)/i);
      if (bedroomMatch) {
        filters.bedrooms = parseInt(bedroomMatch[1], 10);
      }
      
      const bathroomMatch = query.match(/(\d+)[\s-]*(bath|bathroom|ba)/i);
      if (bathroomMatch) {
        filters.bathrooms = parseInt(bathroomMatch[1], 10);
      }
      
      const priceMatch = query.match(/(\$|under |less than |maximum |max )(\d+)([k|m|K|M])?/i);
      if (priceMatch) {
        const value = parseInt(priceMatch[2], 10);
        const unit = priceMatch[3]?.toLowerCase();
        
        if (unit === 'k') {
          filters.maxPrice = value * 1000;
        } else if (unit === 'm') {
          filters.maxPrice = value * 1000000;
        } else {
          filters.maxPrice = value;
        }
      }
      
      // Set property type based on query
      if (query.toLowerCase().includes('house')) {
        filters.propertyType = 'House';
      } else if (query.toLowerCase().includes('apartment')) {
        filters.propertyType = 'Apartment';
      } else if (query.toLowerCase().includes('condo')) {
        filters.propertyType = 'Condo';
      } else if (query.toLowerCase().includes('townhouse')) {
        filters.propertyType = 'Townhouse';
      }
      
      // Apply the filters
      onSearch(filters);
      
      // Add AI response to conversation
      setConversation(prev => [...prev, { role: 'assistant', content: response }]);
      setQuery('');
    }, 1500);
  };

  return (
    <>
      {/* AI Assistant Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-10 rounded-full shadow-lg p-4 flex items-center justify-center"
        variant="secondary"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {/* AI Assistant Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md h-[600px] max-h-[90vh] flex flex-col animate-scale-in shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-lg font-semibold">AI Property Assistant</h3>
              </div>
              <Button
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Conversation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversation.map((message, index) => (
                <div 
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-none'
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
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-end space-x-2">
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about properties..."
                  className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isLoading || !query.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
