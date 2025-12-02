import { ChannelData, Customer, CurrencyInfo, AppSettings } from './types';

export const INITIAL_CHANNELS: ChannelData[] = [
  {
    id: 'google',
    name: 'Google Ads',
    spend: 15000,
    revenue: 67500,
    impressions: 450000,
    clicks: 12500,
    roas: 4.5,
    cpc: 1.20,
    ctr: 2.78,
    allocation: 30,
    color: '#4285F4'
  },
  {
    id: 'meta',
    name: 'Meta (FB/Insta)',
    spend: 20000,
    revenue: 52000,
    impressions: 1200000,
    clicks: 18000,
    roas: 2.6,
    cpc: 1.11,
    ctr: 1.5,
    allocation: 40,
    color: '#0668E1'
  },
  {
    id: 'tiktok',
    name: 'TikTok Ads',
    spend: 10000,
    revenue: 18000,
    impressions: 2500000,
    clicks: 25000,
    roas: 1.8,
    cpc: 0.40,
    ctr: 1.0,
    allocation: 20,
    color: '#000000'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Ads',
    spend: 5000,
    revenue: 15000,
    impressions: 150000,
    clicks: 800,
    roas: 3.0,
    cpc: 6.25,
    ctr: 0.53,
    allocation: 10,
    color: '#0a66c2'
  }
];

export const TOTAL_BUDGET = 50000;

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'TechCorp Global',
    industry: 'Technology',
    contactPerson: 'Ahmet Yılmaz',
    email: 'ahmet@techcorp.com',
    status: 'active',
    totalBudget: 100000,
    color: '#10B981',
    createdAt: '2025-01-15',
    campaigns: [
      {
        id: 'camp-1-1',
        name: 'Yaz Kampanyası 2025',
        customerId: 'cust-1',
        description: 'Yazlık ürünler için dijital pazarlama kampanyası',
        status: 'active',
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        budget: 50000,
        createdAt: '2025-01-20',
        channels: [
          { ...INITIAL_CHANNELS[0], id: 'ch-1-1-1', spend: 15000, revenue: 67500 },
          { ...INITIAL_CHANNELS[1], id: 'ch-1-1-2', spend: 20000, revenue: 52000 },
          { ...INITIAL_CHANNELS[2], id: 'ch-1-1-3', spend: 10000, revenue: 18000 }
        ]
      },
      {
        id: 'camp-1-2',
        name: 'Marka Bilinirliği',
        customerId: 'cust-1',
        description: 'Marka farkındalığı artırma kampanyası',
        status: 'active',
        startDate: '2025-03-01',
        budget: 30000,
        createdAt: '2025-02-10',
        channels: [
          { ...INITIAL_CHANNELS[1], id: 'ch-1-2-1', spend: 18000, revenue: 46800 },
          { ...INITIAL_CHANNELS[3], id: 'ch-1-2-2', spend: 8000, revenue: 24000 }
        ]
      }
    ]
  },
  {
    id: 'cust-2',
    name: 'RetailMax Türkiye',
    industry: 'E-commerce',
    contactPerson: 'Ayşe Demir',
    email: 'ayse@retailmax.com.tr',
    status: 'active',
    totalBudget: 150000,
    color: '#F59E0B',
    createdAt: '2024-11-10',
    campaigns: [
      {
        id: 'camp-2-1',
        name: 'Kış İndirimleri',
        customerId: 'cust-2',
        description: 'Kış sonu fırsatları kampanyası',
        status: 'active',
        startDate: '2025-01-15',
        endDate: '2025-02-28',
        budget: 80000,
        createdAt: '2025-01-05',
        channels: [
          { ...INITIAL_CHANNELS[0], id: 'ch-2-1-1', spend: 25000, revenue: 112500 },
          { ...INITIAL_CHANNELS[1], id: 'ch-2-1-2', spend: 30000, revenue: 78000 },
          { ...INITIAL_CHANNELS[2], id: 'ch-2-1-3', spend: 15000, revenue: 27000 }
        ]
      }
    ]
  },
  {
    id: 'cust-3',
    name: 'HealthPlus Wellness',
    industry: 'Healthcare',
    contactPerson: 'Mehmet Kaya',
    email: 'mehmet@healthplus.com',
    status: 'active',
    totalBudget: 75000,
    color: '#8B5CF6',
    createdAt: '2025-02-01',
    campaigns: [
      {
        id: 'camp-3-1',
        name: 'Bahar Detox Programı',
        customerId: 'cust-3',
        description: 'Bahar detoks ürünleri tanıtım kampanyası',
        status: 'active',
        startDate: '2025-03-15',
        budget: 40000,
        createdAt: '2025-02-15',
        channels: [
          { ...INITIAL_CHANNELS[0], id: 'ch-3-1-1', spend: 12000, revenue: 54000 },
          { ...INITIAL_CHANNELS[1], id: 'ch-3-1-2', spend: 16000, revenue: 41600 },
          { ...INITIAL_CHANNELS[3], id: 'ch-3-1-3', spend: 7000, revenue: 21000 }
        ]
      }
    ]
  }
];

export const CHANNEL_COLORS = ['#4285F4', '#0668E1', '#000000', '#0a66c2', '#FF6B6B', '#4ECDC4', '#45B7D1'];
export const CUSTOMER_COLORS = ['#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#3B82F6', '#EC4899'];

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' }
];

export const DEFAULT_SETTINGS: AppSettings = {
  currency: 'USD',
  defaultCampaignBudget: 10000,
  defaultChannelBudget: 5000,
  showWelcome: true
};
