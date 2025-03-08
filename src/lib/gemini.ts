
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI("AIzaSyA5EDwQj-OAHy9GHnqOEd2OyuiyLlzYQTk");

// Get the generative model
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });

// Function to generate a chat response
export async function generateChatResponse(prompt: string) {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "I'm having trouble processing that request. Please try again later.";
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
  const prompt = `Create a brief, engaging description for this property in exactly 3 sentences. First sentence should highlight its location and primary feature. Second sentence should mention the bedrooms, bathrooms, and square footage. Third sentence should highlight unique amenities or features like ${property.features.join(', ')}. Be specific and descriptive.`;
  
  try {
    const description = await generateChatResponse(prompt);
    return description;
  } catch (error) {
    console.error("Error generating property description:", error);
    // Fallback to static text if Gemini fails
    return `Beautiful ${property.bedrooms} bedroom, ${property.bathrooms} bathroom property in ${property.city}. Features include ${property.features.slice(0, 3).join(', ')}. Located in a desirable neighborhood with great amenities.`;
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
export async function answerPropertyQuestion(question: string, property: any) {
  const prompt = `Based on this property data: ${JSON.stringify(property)}, answer this question in a helpful, concise way: "${question}". If the answer cannot be determined from the data, say "I don't have enough information to answer that question."`;
  
  try {
    const answer = await generateChatResponse(prompt);
    return answer;
  } catch (error) {
    console.error("Error answering property question:", error);
    return "I'm having trouble processing your question. Please try again later.";
  }
}
