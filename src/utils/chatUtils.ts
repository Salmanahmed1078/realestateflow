
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
  skipStepIncrement?: boolean;
}> => {
  let aiResponse = '';
  let filters: PropertyFilters | undefined;
  let recommendedIds: string[] | undefined;
  let skipStepIncrement = false;
  
  switch (chatStep) {
    case 0: // Property type question
      // Process user's property type preference
      if (userMessage.toLowerCase().includes('house')) {
        setPreference('propertyType', 'House');
      } else if (userMessage.toLowerCase().includes('apart') || userMessage.toLowerCase().includes('apt')) {
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
      let budgetSet = false;
      
      // Try to match standard range format (e.g., 300k-500k, $300,000-$500,000)
      const budgetMatch = userMessage.match(/\$?(\d[\d,]*)k?\s*-\s*\$?(\d[\d,]*)k?/i);
      if (budgetMatch) {
        const minStr = budgetMatch[1].replace(/[$,]/g, '');
        const maxStr = budgetMatch[2].replace(/[$,]/g, '');
        let min = parseInt(minStr);
        let max = parseInt(maxStr);
        
        // Check if values are in thousands (k)
        if (userMessage.toLowerCase().includes('k')) {
          if (!userMessage.toLowerCase().split('k')[0].includes(maxStr)) {
            min *= 1000;
          }
          if (!userMessage.toLowerCase().split('k')[0].includes(minStr)) {
            max *= 1000;
          }
        }
        
        setPreference('budget', { min, max });
        budgetSet = true;
      } else {
        // Try to match single number with min/max qualifiers
        const maxBudgetMatch = userMessage.match(/\$?(\d[\d,]*)k?\s*(max|maximum|under|less than|up to)/i) || 
                              userMessage.match(/(max|maximum|under|less than|up to)\s*\$?(\d[\d,]*)k?/i);
        
        if (maxBudgetMatch) {
          const valueIndex = maxBudgetMatch[1].match(/\d/) ? 1 : 2;
          let maxValue = parseInt(maxBudgetMatch[valueIndex].replace(/[$,]/g, ''));
          
          if (maxBudgetMatch[0].toLowerCase().includes('k')) {
            maxValue *= 1000;
          }
          
          setPreference('budget', { min: 0, max: maxValue });
          budgetSet = true;
        }
      }
      
      // Move to next question with context
      let budgetRange = '';
      if (budgetSet && preferences.budget) {
        // Format the budget range nicely
        const minFormatted = preferences.budget.min >= 1000000 ? 
          `$${(preferences.budget.min/1000000).toFixed(1)}M` : 
          `$${(preferences.budget.min/1000).toFixed(0)}K`;
          
        const maxFormatted = preferences.budget.max >= 1000000 ? 
          `$${(preferences.budget.max/1000000).toFixed(1)}M` : 
          `$${(preferences.budget.max/1000).toFixed(0)}K`;
          
        budgetRange = `${minFormatted}-${maxFormatted}`;
      } else {
        // If we couldn't parse the budget, ask again
        aiResponse = `I'm sorry, I couldn't understand your budget range. Could you please specify it again in a format like "$300k-500k" or "up to $700k"?`;
        skipStepIncrement = true;
        break;
      }
      
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
  
  return { aiResponse, filters, recommendedIds, skipStepIncrement };
};
