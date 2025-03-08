
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Property } from '../../types/property';
import { formatPrice } from '../../data/properties';
import { 
  generatePropertyDescription, 
  findSimilarProperties, 
  answerPropertyQuestion 
} from '../../lib/gemini';
import { useToast } from '@/hooks/use-toast';

interface PropertyDetailModalProps {
  property: Property;
  allProperties: Property[];
  onClose: () => void;
}

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ 
  property, 
  allProperties,
  onClose 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAnswerLoading, setIsAnswerLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAIContent = async () => {
      setIsLoading(true);
      try {
        // Generate AI description
        const description = await generatePropertyDescription(property);
        setAiDescription(description);
        
        // Find similar properties
        const similarIds = await findSimilarProperties(property, allProperties);
        const similarProps = allProperties.filter(p => similarIds.includes(p.id));
        setSimilarProperties(similarProps);
      } catch (error) {
        console.error("Error fetching AI content:", error);
        setAiDescription(`Beautiful ${property.bedrooms} bedroom, ${property.bathrooms} bathroom property in ${property.city}. Features include ${property.features.slice(0, 3).join(', ')}. Located in a desirable neighborhood with great amenities.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAIContent();
  }, [property, allProperties]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    
    setIsAnswerLoading(true);
    setAiAnswer(null);
    
    try {
      const answer = await answerPropertyQuestion(userQuestion, property);
      setAiAnswer(answer);
    } catch (error) {
      console.error("Error getting answer:", error);
      setAiAnswer("Sorry, I couldn't answer that question at this time.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get an answer. Please try again later.",
      });
    } finally {
      setIsAnswerLoading(false);
      setUserQuestion('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">{property.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Image gallery */}
        <div className="relative aspect-video">
          <img 
            src={property.images[currentImageIndex]} 
            alt={`${property.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Image navigation */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={prevImage}
              className="rounded-full opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={nextImage}
              className="rounded-full opacity-80 hover:opacity-100"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-sm">
            {currentImageIndex + 1} / {property.images.length}
          </div>
        </div>
        
        {/* Property details */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Details column */}
          <div>
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-primary mb-2">{formatPrice(property.price)}</h3>
              <p className="text-gray-600 dark:text-gray-300">{property.address}, {property.city}, {property.state} {property.zipCode}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</p>
                <p className="text-lg font-semibold">{property.bedrooms}</p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Bathrooms</p>
                <p className="text-lg font-semibold">{property.bathrooms}</p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Area</p>
                <p className="text-lg font-semibold">{property.squareFeet} sqft</p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Year Built</p>
                <p className="text-lg font-semibold">{property.yearBuilt}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Features</h4>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, index) => (
                  <span key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Amenities</h4>
              <div className="grid grid-cols-2 gap-2">
                {property.isPetFriendly && (
                  <span className="text-sm">🐾 Pet Friendly</span>
                )}
                {property.hasParking && (
                  <span className="text-sm">🚗 Parking</span>
                )}
                {property.hasPool && (
                  <span className="text-sm">🏊 Pool</span>
                )}
                {property.hasGarden && (
                  <span className="text-sm">🌱 Garden</span>
                )}
                {property.hasAirConditioning && (
                  <span className="text-sm">❄️ Air Conditioning</span>
                )}
                {property.hasHeating && (
                  <span className="text-sm">🔥 Heating</span>
                )}
              </div>
            </div>
          </div>
          
          {/* AI Description column */}
          <div>
            <div className="mb-6">
              <h4 className="font-semibold mb-2 flex items-center">
                <Bot className="h-4 w-4 mr-1 text-primary" />
                AI-Generated Description
              </h4>
              
              {isLoading ? (
                <div className="flex items-center justify-center p-6">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Generating description...</span>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">{aiDescription}</p>
                </div>
              )}
            </div>
            
            {/* Ask a question section */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2 flex items-center">
                <Bot className="h-4 w-4 mr-1 text-primary" />
                Ask About This Property
              </h4>
              <form onSubmit={handleQuestionSubmit} className="space-y-2">
                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="E.g., Is this pet-friendly? School district rating?"
                  className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  disabled={isAnswerLoading}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isAnswerLoading || !userQuestion.trim()}
                >
                  {isAnswerLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Get Answer"
                  )}
                </Button>
              </form>
              
              {aiAnswer && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">{aiAnswer}</p>
                </div>
              )}
            </div>
            
            {/* Similar Properties */}
            {!isLoading && similarProperties.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Similar Properties</h4>
                <div className="space-y-3">
                  {similarProperties.map(prop => (
                    <div 
                      key={prop.id} 
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                      onClick={() => {
                        onClose();
                        // In a real app, we would navigate to or open the clicked property
                        setTimeout(() => {
                          // This is a simple way to show the same modal with the new property
                          const newModal = document.createElement('div');
                          document.body.appendChild(newModal);
                          // You would actually render the new property modal here
                        }, 100);
                      }}
                    >
                      <img 
                        src={prop.images[0]} 
                        alt={prop.title}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div>
                        <h5 className="font-semibold text-sm">{prop.title}</h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatPrice(prop.price)}</p>
                        <p className="text-xs">{prop.bedrooms} bd • {prop.bathrooms} ba • {prop.squareFeet} sqft</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailModal;
