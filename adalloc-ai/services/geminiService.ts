import { GoogleGenAI, Type } from "@google/genai";
import { ChannelData, RecommendationResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
