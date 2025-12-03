import { GoogleGenAI, Type } from "@google/genai";
import { ChannelData, RecommendationResponse } from '../types';

// Initialize AI only if API key is available
let ai: GoogleGenAI | null = null;
try {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (e) {
  console.warn('Gemini API not configured. AI features will be disabled.');
}

export const getBudgetOptimization = async (
  currentChannels: ChannelData[],
  totalBudget: number
): Promise<RecommendationResponse> => {
  
  const systemInstruction = `
    You are a world-class performance marketing strategist. 
    Your goal is to analyze channel performance data (Spend, ROAS, CPC, CTR) and suggest an optimal budget allocation to maximize total Revenue.
    
    Rules:
    1. Identify high ROAS channels and suggest increasing spend there.
    2. Identify low ROAS channels with high CPA/CPC and suggest cutting spend, unless they are vital for awareness (high impressions).
    3. Ensure the total suggested spend across all channels equals the provided totalBudget exactly.
    4. Provide a brief, punchy reasoning for each channel change.
    5. Provide a global strategy summary.
  `;

  const prompt = `
    Total Budget Available: $${totalBudget}
    
    Current Performance Data:
    ${JSON.stringify(currentChannels.map(c => ({
      id: c.id,
      name: c.name,
      spend: c.spend,
      roas: c.roas,
      revenue: c.revenue,
      cpc: c.cpc
    })), null, 2)}
    
    Please provide an optimized budget allocation.
  `;

  try {
    // Check if AI is initialized
    if (!ai) {
      return {
        recommendations: [],
        globalStrategy: "AI Strategist is not configured. To use AI features, please set VITE_GEMINI_API_KEY environment variable."
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  channelId: { type: Type.STRING },
                  suggestedSpend: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING }
                },
                required: ["channelId", "suggestedSpend", "reasoning"]
              }
            },
            globalStrategy: { type: Type.STRING }
          },
          required: ["recommendations", "globalStrategy"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as RecommendationResponse;
    }
    
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Error fetching optimization:", error);
    // Fallback in case of error
    return {
      recommendations: [],
      globalStrategy: "Failed to generate recommendations. Please check API Key or try again."
    };
  }
};
