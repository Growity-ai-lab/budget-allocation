export interface ChannelData {
  id: string;
  name: string;
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  roas: number; // Return on Ad Spend
  cpc: number; // Cost per Click
  ctr: number; // Click Through Rate
  allocation: number; // Percentage of total budget
  color: string;
}

export interface OptimizationResult {
  channelId: string;
  suggestedSpend: number;
  reasoning: string;
}

export interface RecommendationResponse {
  recommendations: OptimizationResult[];
  globalStrategy: string;
}
