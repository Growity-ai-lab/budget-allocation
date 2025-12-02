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

export type ViewMode = 'overview' | 'customer' | 'campaign' | 'channels' | 'goals' | 'settings';

export interface ViewState {
  mode: ViewMode;
  selectedCustomerId?: string;
  selectedCampaignId?: string;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'TRY';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
}

export interface Goal {
  id: string;
  name: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
  status: 'active' | 'completed' | 'overdue';
  type: 'revenue' | 'roas' | 'spend' | 'customers';
  createdAt: string;
}

export interface AppSettings {
  currency: Currency;
  defaultCampaignBudget: number;
  defaultChannelBudget: number;
  showWelcome: boolean;
}
