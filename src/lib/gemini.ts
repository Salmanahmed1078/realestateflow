
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

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

// Function to generate an engaging property description
export async function generatePropertyDescription(property: any) {
  const prompt = `Create an engaging and detailed description for this property: ${JSON.stringify(property)}. Include information about its features, neighborhood, and potential lifestyle. Keep it under 200 words.`;
  
  try {
    return await generateChatResponse(prompt);
  } catch (error) {
    console.error("Error generating property description:", error);
    return "Description not available at the moment.";
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
