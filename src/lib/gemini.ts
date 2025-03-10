
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key from environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Get the generative model
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });

// Maintain conversation history
let conversationHistory: { role: string; parts: string[]; }[] = [];

// Function to generate a chat response
export async function generateChatResponse(prompt: string, isNewConversation: boolean = false, maxRetries: number = 3) {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      if (isNewConversation) {
        conversationHistory = [];
      }

      // Add user message to history
      conversationHistory.push({ role: 'user', parts: [prompt] });

      // Create chat context with personality and real estate expertise
      const contextPrompt = `You are a knowledgeable and friendly real estate assistant. Respond naturally and conversationally while maintaining professionalism. Consider the conversation history for context.\n\nCurrent conversation:\n${conversationHistory.map(msg => `${msg.role}: ${msg.parts.join(' ')}`).join('\n')}\n\nResponse:`;

      const result = await geminiModel.generateContent(contextPrompt);
      const response = result.response;
      const responseText = response.text();

      // Add AI response to history
      conversationHistory.push({ role: 'assistant', parts: [responseText] });

      // Keep conversation history manageable
      if (conversationHistory.length > 10) {
        conversationHistory = conversationHistory.slice(-10);
      }

      return responseText;
    } catch (error) {
      console.error(`Error generating chat response (attempt ${retryCount + 1}/${maxRetries}):`, error);
      retryCount++;

      if (retryCount === maxRetries) {
        // Provide more informative error message based on the error type
        if (error instanceof Error) {
          if (error.message.includes('quota') || error.message.includes('rate limit')) {
            return "I'm currently experiencing high demand. Please try again in a moment.";
          } else if (error.message.includes('network') || error.message.includes('timeout')) {
            return "I'm having connection issues. Please check your internet connection and try again.";
          } else if (error.message.includes('invalid')) {
            return "I couldn't understand your request. Could you please rephrase it?";
          }
        }
        return "I apologize, but I'm having trouble processing your request right now. Please try again in a few moments.";
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, retryCount), 8000)));
    }
  }
}

// Function to generate property recommendations based on preferences
export async function generatePropertyRecommendations(preferences: any, properties: any[]) {
  const prompt = `Based on these preferences: ${JSON.stringify(preferences)}, suggest properties from this JSON data: ${JSON.stringify(properties)}. Return only the ids of the recommended properties in a JSON array format like this: ["prop-1", "prop-3"].`;
  
  try {
    const response = await generateChatResponse(prompt);
    // Parse the response to extract property IDs
    try {
      const recommendedIds = JSON.parse(response);
      return recommendedIds;
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e);
      // Try to extract IDs using regex as fallback
      const matches = response.match(/"prop-\d+"/g);
      return matches ? matches.map(id => id.replace(/"/g, '')) : [];
    }
  } catch (error) {
    console.error("Error generating property recommendations:", error);
    return [];
  }
}

// Function to generate a concise property description (3 sentences max)
export async function generatePropertyDescription(property: any) {
  const templates = [
    `Create an engaging description for this ${property.propertyType.toLowerCase()} in ${property.city}. Focus on its ${property.features[0]} and prime location. Include details about the ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, and ${property.squareFeet} square feet. Highlight key features like ${property.features.join(', ')}.`,
    `Describe this stunning ${property.propertyType.toLowerCase()} that showcases ${property.features[0]}. Emphasize its ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, and spacious ${property.squareFeet} square foot layout. Mention its location in ${property.city} and amenities like ${property.features.slice(1).join(', ')}.`,
    `Paint a picture of this exceptional ${property.city} ${property.propertyType.toLowerCase()} with its ${property.features[0]}. Detail its ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, and generous ${property.squareFeet} square feet of living space. Highlight standout features including ${property.features.join(', ')}.`
  ];

  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  try {
    const description = await generateChatResponse(randomTemplate);
    if (!description || description.includes("trouble processing")) {
      throw new Error("Invalid description generated");
    }
    return description;
  } catch (error) {
    console.error("Error generating property description:", error);
    // Enhanced fallback with more dynamic template
    const features = property.features.slice(0, 3);
    const amenityText = features.length > 1 
      ? `${features.slice(0, -1).join(', ')} and ${features[features.length - 1]}`
      : features[0];
    
    return `Welcome to this exceptional ${property.propertyType.toLowerCase()} in the heart of ${property.city}. This well-appointed home offers ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms across ${property.squareFeet} square feet of thoughtfully designed living space. You'll love the outstanding features including ${amenityText}, all in a prime location with easy access to local amenities.`;
  }
}

// Function to find similar properties
export async function findSimilarProperties(currentProperty: any, allProperties: any[]) {
  const prompt = `Find 3 properties similar to ${JSON.stringify(currentProperty)} from this list: ${JSON.stringify(allProperties)}. Return only the ids of the similar properties in a JSON array format like this: ["prop-1", "prop-3"].`;
  
  try {
    const response = await generateChatResponse(prompt);
    // Parse the response to extract property IDs
    try {
      const similarIds = JSON.parse(response);
      return similarIds;
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e);
      // Try to extract IDs using regex as fallback
      const matches = response.match(/"prop-\d+"/g);
      return matches ? matches.map(id => id.replace(/"/g, '')) : [];
    }
  } catch (error) {
    console.error("Error finding similar properties:", error);
    return [];
  }
}

// Function to answer property questions
export async function answerPropertyQuestion(question: string, property: any, maxRetries: number = 3) {
  let retryCount = 0;
  const propertyInfo = {
    ...property,
    description: `${property.propertyType} with ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms`,
    amenities: property.features?.join(', ') || ''
  };
  
  // Analyze the question to determine its category
  const questionLower = question.toLowerCase();
  let questionCategory = 'general';
  
  // Categorize the question to provide more targeted responses
  if (questionLower.includes('price') || questionLower.includes('cost') || questionLower.includes('worth') || questionLower.includes('value') || questionLower.includes('afford')) {
    questionCategory = 'pricing';
  } else if (questionLower.includes('school') || questionLower.includes('district') || questionLower.includes('education')) {
    questionCategory = 'schools';
  } else if (questionLower.includes('pet') || questionLower.includes('dog') || questionLower.includes('cat') || questionLower.includes('animal')) {
    questionCategory = 'pets';
  } else if (questionLower.includes('neighborhood') || questionLower.includes('area') || questionLower.includes('community') || questionLower.includes('location') || questionLower.includes('nearby')) {
    questionCategory = 'location';
  } else if (questionLower.includes('feature') || questionLower.includes('amenity') || questionLower.includes('include') || questionLower.includes('come with')) {
    questionCategory = 'features';
  } else if (questionLower.includes('size') || questionLower.includes('square') || questionLower.includes('sqft') || questionLower.includes('space') || questionLower.includes('room')) {
    questionCategory = 'size';
  } else if (questionLower.includes('year') || questionLower.includes('built') || questionLower.includes('old') || questionLower.includes('age')) {
    questionCategory = 'age';
  }
  
  // Create a more targeted prompt based on the question category
  let categorySpecificPrompt = '';
  switch (questionCategory) {
    case 'pricing':
      categorySpecificPrompt = `
This question is about pricing. Focus on the property's price of $${property.price.toLocaleString()}, whether it's negotiable, any recent price changes, and how it compares to similar properties in the area.`;
      break;
    case 'schools':
      categorySpecificPrompt = `
This question is about schools or education. If you don't have specific school district information, recommend checking with local education authorities for current school district information and ratings.`;
      break;
    case 'pets':
      categorySpecificPrompt = `
This question is about pet policies. If the property is ${property.isPetFriendly ? 'pet-friendly' : 'not explicitly marked as pet-friendly'}, mention that but also suggest contacting the property manager to confirm current pet policies and any restrictions.`;
      break;
    case 'location':
      categorySpecificPrompt = `
This question is about the neighborhood or location. Focus on the property's location in ${property.city}, ${property.state}, and any nearby amenities or features of the area that you know about.`;
      break;
    case 'features':
      categorySpecificPrompt = `
This question is about property features or amenities. Focus on the property's features including ${propertyInfo.amenities}.`;
      break;
    case 'size':
      categorySpecificPrompt = `
This question is about property size. Focus on the property's ${property.squareFeet} square feet of living space, the ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, and how the space is distributed.`;
      break;
    case 'age':
      categorySpecificPrompt = `
This question is about the property's age. Focus on the fact that it was built in ${property.yearBuilt} and any relevant information about its condition or historical context.`;
      break;
    default:
      categorySpecificPrompt = '';
  }
  
  const prompt = `You are a knowledgeable real estate assistant. Based on this property information:
- Type: ${propertyInfo.description}
- Location: ${property.city}, ${property.state}
- Price: $${property.price.toLocaleString()}
- Size: ${property.squareFeet} square feet
- Bedrooms: ${property.bedrooms}
- Bathrooms: ${property.bathrooms}
- Year Built: ${property.yearBuilt}
- Features: ${propertyInfo.amenities}
- Pet Friendly: ${property.isPetFriendly ? 'Yes' : 'Not specified'}
- Parking: ${property.hasParking ? 'Available' : 'Not specified'}
- Pool: ${property.hasPool ? 'Yes' : 'No'}
- Garden: ${property.hasGarden ? 'Yes' : 'No'}

Please answer this specific question about the property in a helpful, concise way: "${question}"${categorySpecificPrompt}

If the specific information is not available:
- For school districts: "I recommend checking with local education authorities for current school district information and ratings."
- For pet policies: "Please contact the property manager to confirm current pet policies and any restrictions."
- For other missing details: "I don't have that specific information. I recommend contacting the listing agent for details."

Focus on providing accurate information from the available data while being transparent about what information is not available. Answer directly and specifically to the question asked without providing unnecessary general property descriptions.`;
  while (retryCount < maxRetries) {
    try {
      const answer = await generateChatResponse(prompt, true); // Start fresh conversation
      if (answer && !answer.includes("trouble processing")) {
        return answer;
      }
      throw new Error("Invalid response generated");
    } catch (error) {
      console.error(`Error answering property question (attempt ${retryCount + 1}/${maxRetries}):`, error);
      retryCount++;
  
      if (retryCount === maxRetries) {
        // Provide a more specific fallback response based on question category
        let fallbackResponse = '';
        
        switch (questionCategory) {
          case 'pricing':
            fallbackResponse = `This ${propertyInfo.description} is priced at $${property.price.toLocaleString()}. For more specific pricing information or negotiation details, I recommend contacting the listing agent.`;
            break;
          case 'schools':
            fallbackResponse = `For information about school districts serving this ${property.propertyType.toLowerCase()} in ${property.city}, I recommend checking with local education authorities for the most current information and ratings.`;
            break;
          case 'pets':
            fallbackResponse = `This property is ${property.isPetFriendly ? 'marked as pet-friendly' : 'not explicitly marked as pet-friendly'}. I recommend contacting the property manager to confirm current pet policies and any restrictions.`;
            break;
          case 'location':
            fallbackResponse = `This property is located in ${property.city}, ${property.state}. For more specific information about the neighborhood and nearby amenities, I recommend contacting the listing agent.`;
            break;
          case 'features':
            fallbackResponse = `This ${propertyInfo.description} features ${propertyInfo.amenities}. For more specific details about the amenities, I recommend contacting the listing agent.`;
            break;
          case 'size':
            fallbackResponse = `This ${propertyInfo.description} offers ${property.squareFeet} square feet of living space. For more specific information about the layout, I recommend contacting the listing agent.`;
            break;
          case 'age':
            fallbackResponse = `This property was built in ${property.yearBuilt}. For more specific information about its condition or any renovations, I recommend contacting the listing agent.`;
            break;
          default:
            fallbackResponse = `This ${propertyInfo.description} is located in ${property.city} and offers ${property.squareFeet} square feet of living space. It features ${propertyInfo.amenities}. For more specific information about your question, I recommend contacting the listing agent.`;
        }
        
        return fallbackResponse;
      }
  
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, retryCount), 8000)));
    }
  }
}
