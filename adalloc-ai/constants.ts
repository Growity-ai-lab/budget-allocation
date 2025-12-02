import { ChannelData } from './types';

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
