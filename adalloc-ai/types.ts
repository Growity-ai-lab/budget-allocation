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

export interface Campaign {
  id: string;
  name: string;
  customerId: string;
  description?: string;
  status: 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  budget: number;
  channels: ChannelData[];
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  industry?: string;
  contactPerson?: string;
  email?: string;
  status: 'active' | 'inactive';
  totalBudget: number;
  campaigns: Campaign[];
  createdAt: string;
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

export type ViewMode = 'overview' | 'customer' | 'campaign';

export interface ViewState {
  mode: ViewMode;
  selectedCustomerId?: string;
  selectedCampaignId?: string;
}
