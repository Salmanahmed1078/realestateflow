
import { PropertyFilters } from '../types/property';
import { generateChatResponse, generatePropertyRecommendations } from '../lib/gemini';
import { usePreferenceStore } from '../stores/preferenceStore';
import { properties } from '../data/properties';

// Process user message based on conversation step
export const processUserMessage = async (
  userMessage: string,
  chatStep: number,
  setPreference: (key: string, value: any) => void,
  preferences: any
): Promise<{
  aiResponse: string;
  filters?: PropertyFilters;
  recommendedIds?: string[];
}> => {
  let aiResponse = '';
  let filters: PropertyFilters | undefined;
  let recommendedIds: string[] | undefined;
  
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
      
      // Move to next question with a more natural response
      const propertyType = preferences.propertyType || 'property';
      aiResponse = `Excellent choice! A ${propertyType.toLowerCase()} would be a great investment. Now, what's your budget range? Feel free to give me a range like $300k-500k, and I'll find options that fit your budget.`;
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
      
      // Move to next question with context
      const budgetRange = preferences.budget ? `${preferences.budget.min/1000}k-${preferences.budget.max/1000}k` : '';
      aiResponse = `Got it, I'll look for properties in the ${budgetRange} range. Which areas or neighborhoods are you interested in? You can mention multiple locations if you'd like.`;
      break;
      
    case 2: // Location question
      // Process location information
      const locations = userMessage
        .split(/,|\sand\s/)
        .map(loc => loc.trim())
        .filter(loc => loc.length > 0);
      
      setPreference('locations', locations);
      
      // Move to next question with personalization
      const location = preferences.locations.length > 0 ? preferences.locations[0] : 'those areas';
      aiResponse = `${location} is a great choice! To help me find your perfect home, what amenities are must-haves for you? Think about things like a pool, garden, parking, or anything else that's important to your lifestyle.`;
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
      
      // Find property recommendations using Gemini
      recommendedIds = await generatePropertyRecommendations(preferences, properties);
      
      // Create searchFilters based on collected preferences
      filters = {
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
      
      // Generate final response
      let matchCount = recommendedIds.length;
      if (matchCount > 0) {
        aiResponse = `I've found ${matchCount} properties that match your criteria! I've updated the listings to show you the best matches. Feel free to ask me about specific properties or refine your search.`;
      } else {
        aiResponse = `I couldn't find exact matches for all your criteria. I've updated the filters with your preferences, but you might want to adjust them to see more options.`;
      }
      break;
      
    default: // Open conversation after preferences are collected
      // Process natural language query to refine filters
      const naturalLanguageFilters: PropertyFilters = {};
      
      // Check for mentions of pet-friendly
      if (userMessage.toLowerCase().includes('pet friendly') || userMessage.toLowerCase().includes('pet-friendly')) {
        naturalLanguageFilters.isPetFriendly = true;
      }
      
      // Check for mentions of pools
      if (userMessage.toLowerCase().includes('pool')) {
        naturalLanguageFilters.hasPool = true;
      }
      
      // Check for location mentions
      if (userMessage.toLowerCase().includes('miami')) {
        naturalLanguageFilters.location = 'Miami';
      } else if (userMessage.toLowerCase().includes('san francisco')) {
        naturalLanguageFilters.location = 'San Francisco';
      } else if (userMessage.toLowerCase().includes('austin')) {
        naturalLanguageFilters.location = 'Austin';
      }
      
      // Check for bedroom mentions
      const bedroomMatch = userMessage.match(/(\d+)[\s-]*(bed|bedroom|br|bd)/i);
      if (bedroomMatch) {
        naturalLanguageFilters.bedrooms = parseInt(bedroomMatch[1], 10);
      }
      
      // Check for bathroom mentions
      const bathroomMatch = userMessage.match(/(\d+)[\s-]*(bath|bathroom|ba)/i);
      if (bathroomMatch) {
        naturalLanguageFilters.bathrooms = parseInt(bathroomMatch[1], 10);
      }
      
      // If we have any filters, apply them
      if (Object.keys(naturalLanguageFilters).length > 0) {
        filters = naturalLanguageFilters;
        aiResponse = `I've updated the listings based on your request. Let me know if you want to refine your search further.`;
      } else {
        // If no specific filters detected, generate a response using Gemini
        aiResponse = await generateChatResponse(userMessage);
      }
      break;
  }
  
  return { aiResponse, filters, recommendedIds };
};
