
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI("AIzaSyA5EDwQj-OAHy9GHnqOEd2OyuiyLlzYQTk");

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

  const prompt = `You are a knowledgeable real estate assistant. Based on this property information:
- Type: ${propertyInfo.description}
- Location: ${property.city}
- Price: $${property.price.toLocaleString()}
- Size: ${property.squareFeet} square feet
- Features: ${propertyInfo.amenities}

Please answer this question in a helpful, concise way: "${question}"

If the specific information is not available:
- For school districts: "I recommend checking with local education authorities for current school district information and ratings."
- For pet policies: "Please contact the property manager to confirm current pet policies and any restrictions."
- For other missing details: "I don't have that specific information. I recommend contacting the listing agent for details."

Focus on providing accurate information from the available data while being transparent about what information is not available.`;

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
        // Provide a fallback response using available property data
        return `This ${propertyInfo.description} is located in ${property.city} and offers ${property.squareFeet} square feet of living space. It features ${propertyInfo.amenities}. For more specific information about your question, I recommend contacting the listing agent.`;
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, retryCount), 8000)));
    }
  }
}
