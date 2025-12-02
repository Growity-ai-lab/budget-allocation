import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Settings as SettingsIcon,
  BarChart3,
  PieChart,
  Target,
  Users,
  Plus,
  Search,
  Download,
  Filter,
  Radio,
  BrainCircuit
} from 'lucide-react';

import { Customer, Campaign, ChannelData, ViewState, AppSettings, Goal, RecommendationResponse } from './types';
import { INITIAL_CUSTOMERS, DEFAULT_SETTINGS } from './constants';
import { formatCurrency } from './utils';
import MetricCard from './components/MetricCard';
import { SpendDistributionChart, PerformanceBarChart } from './components/Charts';
import CustomerCard from './components/CustomerCard';
import CustomerModal from './components/CustomerModal';
import CampaignCard from './components/CampaignCard';
import CampaignModal from './components/CampaignModal';
import ChannelModal from './components/ChannelModal';
import Breadcrumbs from './components/Breadcrumbs';
import SettingsView from './components/SettingsView';
import GoalsView from './components/GoalsView';
import ChannelsView from './components/ChannelsView';
import OptimizationModal from './components/OptimizationModal';
import { getBudgetOptimization } from './services/geminiService';

const App: React.FC = () => {
  // State Management
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [viewState, setViewState] = useState<ViewState>({ mode: 'overview' });
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Modal States
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);

  // AI Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<RecommendationResponse | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('adalloc-customers');
    const savedSettings = localStorage.getItem('adalloc-settings');
    const savedGoals = localStorage.getItem('adalloc-goals');

    if (savedData) {
      setCustomers(JSON.parse(savedData));
    } else {
      setCustomers(INITIAL_CUSTOMERS);
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save data to localStorage whenever they change
  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem('adalloc-customers', JSON.stringify(customers));
    }
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('adalloc-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('adalloc-goals', JSON.stringify(goals));
  }, [goals]);

  // Navigation
  const handleNavigate = (mode: ViewState['mode'], customerId?: string, campaignId?: string) => {
    setViewState({ mode, selectedCustomerId: customerId, selectedCampaignId: campaignId });
  };

  // Goals Management
  const handleAddGoal = (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setGoals([...goals, newGoal]);
  };

  const handleUpdateGoal = (goalId: string, currentValue: number) => {
    setGoals(goals.map(goal =>
      goal.id === goalId
        ? {
            ...goal,
            currentValue,
            status: currentValue >= goal.targetValue ? 'completed' : goal.status
          }
        : goal
    ));
  };

  // AI Strategist
  const handleOptimizeClick = async () => {
    if (!selectedCampaign) return;

    setIsAiModalOpen(true);
    setAiLoading(true);
    setAiRecommendation(null);

    try {
      const result = await getBudgetOptimization(selectedCampaign.channels, selectedCampaign.budget);
      setAiRecommendation(result);
    } catch (e) {
      console.error("Optimization failed", e);
    } finally {
      setAiLoading(false);
    }
  };

  const applyOptimization = (newAllocations: Record<string, number>) => {
    setCustomers(customers.map(customer => {
      if (customer.id === viewState.selectedCustomerId) {
        return {
          ...customer,
          campaigns: customer.campaigns.map(campaign => {
            if (campaign.id === viewState.selectedCampaignId) {
              return {
                ...campaign,
                channels: campaign.channels.map(ch => {
                  if (newAllocations[ch.id] !== undefined) {
                    const newSpend = newAllocations[ch.id];
                    return {
                      ...ch,
                      spend: newSpend,
                      revenue: newSpend * ch.roas
                    };
                  }
                  return ch;
                })
              };
            }
            return campaign;
          })
        };
      }
      return customer;
    }));
  };

  // Customer Operations
  const handleAddCustomer = (customerData: Omit<Customer, 'id' | 'campaigns' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      campaigns: [],
      createdAt: new Date().toISOString()
    };
    setCustomers([...customers, newCustomer]);
  };

  // Campaign Operations
  const handleAddCampaign = (campaignData: Omit<Campaign, 'id' | 'channels' | 'createdAt'>) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      channels: [],
      createdAt: new Date().toISOString()
    };

    setCustomers(customers.map(customer => {
      if (customer.id === campaignData.customerId) {
        return {
          ...customer,
          campaigns: [...customer.campaigns, newCampaign]
        };
      }
      return customer;
    }));
  };

  // Channel Operations
  const handleAddChannel = (channelData: ChannelData) => {
    setCustomers(customers.map(customer => {
      if (customer.id === viewState.selectedCustomerId) {
        return {
          ...customer,
          campaigns: customer.campaigns.map(campaign => {
            if (campaign.id === viewState.selectedCampaignId) {
              return {
                ...campaign,
                channels: [...campaign.channels, channelData]
              };
            }
            return campaign;
          })
        };
      }
      return customer;
    }));
  };

  const handleBudgetChange = (channelId: string, newSpend: number) => {
    setCustomers(customers.map(customer => {
      if (customer.id === viewState.selectedCustomerId) {
        return {
          ...customer,
          campaigns: customer.campaigns.map(campaign => {
            if (campaign.id === viewState.selectedCampaignId) {
              return {
                ...campaign,
                channels: campaign.channels.map(ch => {
                  if (ch.id === channelId) {
                    const estimatedRevenue = newSpend * ch.roas;
                    return { ...ch, spend: newSpend, revenue: estimatedRevenue };
                  }
                  return ch;
                })
              };
            }
            return campaign;
          })
        };
      }
      return customer;
    }));
  };

  // Calculate Global Metrics
  const globalMetrics = useMemo(() => {
    let totalSpend = 0;
    let totalRevenue = 0;
    let totalCustomers = customers.length;
    let totalCampaigns = 0;

    customers.forEach(customer => {
      totalCampaigns += customer.campaigns.length;
      customer.campaigns.forEach(campaign => {
        campaign.channels.forEach(channel => {
          totalSpend += channel.spend;
          totalRevenue += channel.revenue;
        });
      });
    });

    const blendedRoas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0.00';

    return { totalSpend, totalRevenue, blendedRoas, totalCustomers, totalCampaigns };
  }, [customers]);

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current view data
  const selectedCustomer = customers.find(c => c.id === viewState.selectedCustomerId);
  const selectedCampaign = selectedCustomer?.campaigns.find(c => c.id === viewState.selectedCampaignId);

  // Export data function
  const handleExportData = () => {
    const dataStr = JSON.stringify(customers, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `adalloc-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Render different views
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Toplam Harcama"
          value={globalMetrics.totalSpend.toLocaleString('tr-TR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
          change={12.5}
        />
        <MetricCard
          title="Toplam Gelir"
          value={globalMetrics.totalRevenue.toLocaleString('tr-TR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
          change={8.2}
        />
        <MetricCard
          title="Ortalama ROAS"
          value={`${globalMetrics.blendedRoas}x`}
          change={-2.4}
        />
        <MetricCard
          title="Aktif Müşteri"
          value={`${globalMetrics.totalCustomers}`}
          suffix={`${globalMetrics.totalCampaigns} kampanya`}
          neutral
        />
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Müşteri veya sektör ara..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-all"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Dışa Aktar</span>
          </button>
          <button
            onClick={() => setIsCustomerModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            Yeni Müşteri
          </button>
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onClick={() => handleNavigate('customer', customer.id)}
          />
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">
            {searchQuery ? 'Müşteri bulunamadı' : 'Henüz müşteri eklenmemiş'}
          </p>
        </div>
      )}
    </div>
  );

  const renderCustomerView = () => {
    if (!selectedCustomer) return null;

    const customerMetrics = useMemo(() => {
      let totalSpend = 0;
      let totalRevenue = 0;

      selectedCustomer.campaigns.forEach(campaign => {
        campaign.channels.forEach(channel => {
          totalSpend += channel.spend;
          totalRevenue += channel.revenue;
        });
      });

      const customerRoas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0.00';
      const activeCampaigns = selectedCustomer.campaigns.filter(c => c.status === 'active').length;

      return { totalSpend, totalRevenue, customerRoas, activeCampaigns };
    }, [selectedCustomer]);

    return (
      <div className="space-y-8">
        {/* Customer Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
                style={{ backgroundColor: selectedCustomer.color }}
              >
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedCustomer.name}</h2>
                <p className="text-slate-500">{selectedCustomer.industry || 'Genel'}</p>
                {selectedCustomer.contactPerson && (
                  <p className="text-sm text-slate-600 mt-1">
                    İletişim: {selectedCustomer.contactPerson} {selectedCustomer.email && `(${selectedCustomer.email})`}
                  </p>
                )}
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              selectedCustomer.status === 'active'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {selectedCustomer.status === 'active' ? 'Aktif' : 'Pasif'}
            </div>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Toplam Harcama"
            value={customerMetrics.totalSpend.toLocaleString('tr-TR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
            change={5.3}
          />
          <MetricCard
            title="Toplam Gelir"
            value={customerMetrics.totalRevenue.toLocaleString('tr-TR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
            change={12.1}
          />
          <MetricCard
            title="Müşteri ROAS"
            value={`${customerMetrics.customerRoas}x`}
            change={-1.2}
          />
          <MetricCard
            title="Kampanyalar"
            value={`${selectedCustomer.campaigns.length}`}
            suffix={`${customerMetrics.activeCampaigns} aktif`}
            neutral
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsCampaignModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            Yeni Kampanya
          </button>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedCustomer.campaigns.map(campaign => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onClick={() => handleNavigate('campaign', selectedCustomer.id, campaign.id)}
            />
          ))}
        </div>

        {selectedCustomer.campaigns.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Henüz kampanya eklenmemiş</p>
            <button
              onClick={() => setIsCampaignModalOpen(true)}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              İlk kampanyanızı ekleyin
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderCampaignView = () => {
    if (!selectedCampaign || !selectedCustomer) return null;

    const totalSpend = selectedCampaign.channels.reduce((acc, ch) => acc + ch.spend, 0);
    const totalRevenue = selectedCampaign.channels.reduce((acc, ch) => acc + ch.revenue, 0);
    const campaignRoas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0.00';
    const remainingBudget = selectedCampaign.budget - totalSpend;

    return (
      <div className="space-y-8">
        {/* Campaign Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900">{selectedCampaign.name}</h2>
              <p className="text-slate-500 mt-1">{selectedCampaign.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleOptimizeClick}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all"
              >
                <BrainCircuit className="w-4 h-4" />
                <span className="hidden sm:inline">AI Strategist</span>
              </button>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                selectedCampaign.status === 'active'
                  ? 'bg-emerald-100 text-emerald-700'
                  : selectedCampaign.status === 'paused'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {selectedCampaign.status === 'active' ? 'Aktif' :
                 selectedCampaign.status === 'paused' ? 'Duraklatıldı' : 'Tamamlandı'}
              </div>
            </div>
          </div>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-slate-500">Başlangıç:</span>
              <span className="ml-2 font-medium text-slate-900">
                {new Date(selectedCampaign.startDate).toLocaleDateString('tr-TR')}
              </span>
            </div>
            {selectedCampaign.endDate && (
              <div>
                <span className="text-slate-500">Bitiş:</span>
                <span className="ml-2 font-medium text-slate-900">
                  {new Date(selectedCampaign.endDate).toLocaleDateString('tr-TR')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Campaign Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Toplam Harcama"
            value={totalSpend.toLocaleString('tr-TR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
            change={8.5}
          />
          <MetricCard
            title="Toplam Gelir"
            value={totalRevenue.toLocaleString('tr-TR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
            change={15.2}
          />
          <MetricCard
            title="Kampanya ROAS"
            value={`${campaignRoas}x`}
            change={3.1}
          />
          <MetricCard
            title="Bütçe Kullanımı"
            value={`${((totalSpend/selectedCampaign.budget)*100).toFixed(1)}%`}
            suffix={remainingBudget >= 0 ? `${Math.abs(remainingBudget).toFixed(0)} kaldı` : 'Aşıldı'}
            neutral
          />
        </div>

        {/* Charts and Channel Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">Harcama Dağılımı</h3>
                <PieChart className="w-5 h-5 text-slate-400" />
              </div>
              <SpendDistributionChart data={selectedCampaign.channels} />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">Kanal Performansı</h3>
                <BarChart3 className="w-5 h-5 text-slate-400" />
              </div>
              <PerformanceBarChart data={selectedCampaign.channels} />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Kanal Bütçe Tahsisi</h3>
                <p className="text-sm text-slate-500">Harcamaları ayarlayın ve gelir tahminini görün</p>
              </div>
              <button
                onClick={() => setIsChannelModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                <Plus className="w-4 h-4" />
                Kanal Ekle
              </button>
            </div>

            <div className="flex-1 overflow-x-auto">
              {selectedCampaign.channels.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Kanal</th>
                      <th className="px-6 py-4 font-semibold text-right">ROAS</th>
                      <th className="px-6 py-4 font-semibold text-right">Harcama</th>
                      <th className="px-6 py-4 font-semibold text-center">Ayar</th>
                      <th className="px-6 py-4 font-semibold text-right">Tahmini Gelir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedCampaign.channels.map((channel) => (
                      <tr key={channel.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channel.color }}></div>
                            <div className="font-medium text-slate-900">{channel.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-bold px-2 py-1 rounded ${channel.roas > 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                            {channel.roas.toFixed(2)}x
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="relative inline-block">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                            <input
                              type="number"
                              value={channel.spend}
                              onChange={(e) => handleBudgetChange(channel.id, Number(e.target.value))}
                              className="w-28 text-right bg-slate-50 border border-slate-200 rounded px-2 py-1 pl-6 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 w-32 mx-auto">
                            <button
                              onClick={() => handleBudgetChange(channel.id, Math.max(0, channel.spend - 500))}
                              className="w-6 h-6 rounded flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold"
                            >
                              -
                            </button>
                            <input
                              type="range"
                              min="0"
                              max={selectedCampaign.budget}
                              step="100"
                              value={channel.spend}
                              onChange={(e) => handleBudgetChange(channel.id, Number(e.target.value))}
                              className="flex-1 accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <button
                              onClick={() => handleBudgetChange(channel.id, channel.spend + 500)}
                              className="w-6 h-6 rounded flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-slate-700">
                          {channel.revenue.toLocaleString('tr-TR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Toplam</td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        {totalSpend.toLocaleString('tr-TR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">
                        {totalRevenue.toLocaleString('tr-TR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <div className="text-center py-16">
                  <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">Henüz kanal eklenmemiş</p>
                  <button
                    onClick={() => setIsChannelModalOpen(true)}
                    className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    İlk kanalınızı ekleyin
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span className="ml-3 font-bold text-lg hidden lg:block">AdAlloc AI</span>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3">
          <button
            onClick={() => handleNavigate('overview')}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${
              viewState.mode === 'overview'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 min-w-[20px]" />
            <span className="ml-3 hidden lg:block font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => handleNavigate('channels')}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${
              viewState.mode === 'channels'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="w-5 h-5 min-w-[20px]" />
            <span className="ml-3 hidden lg:block font-medium">Channels</span>
          </button>
          <button
            onClick={() => handleNavigate('goals')}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${
              viewState.mode === 'goals'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Target className="w-5 h-5 min-w-[20px]" />
            <span className="ml-3 hidden lg:block font-medium">Goals</span>
          </button>
          <button
            onClick={() => handleNavigate('settings')}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${
              viewState.mode === 'settings'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <SettingsIcon className="w-5 h-5 min-w-[20px]" />
            <span className="ml-3 hidden lg:block font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 border-2 border-slate-700"></div>
            <div className="hidden lg:block">
              <div className="text-sm font-medium text-white">Marketing Team</div>
              <div className="text-xs text-slate-500">Pro Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex-1">
            <Breadcrumbs
              viewState={viewState}
              customers={customers}
              onNavigate={handleNavigate}
            />
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {viewState.mode === 'overview' && renderOverview()}
            {viewState.mode === 'customer' && renderCustomerView()}
            {viewState.mode === 'campaign' && renderCampaignView()}
            {viewState.mode === 'channels' && <ChannelsView customers={customers} currency={settings.currency} />}
            {viewState.mode === 'goals' && (
              <GoalsView
                goals={goals}
                onAddGoal={handleAddGoal}
                onUpdateGoal={handleUpdateGoal}
                currency={settings.currency}
                totalRevenue={globalMetrics.totalRevenue}
                totalSpend={globalMetrics.totalSpend}
                totalCustomers={globalMetrics.totalCustomers}
              />
            )}
            {viewState.mode === 'settings' && (
              <SettingsView settings={settings} onUpdateSettings={setSettings} />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleAddCustomer}
      />

      <CampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        onSave={handleAddCampaign}
        customerId={viewState.selectedCustomerId || ''}
      />

      <ChannelModal
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        onSave={handleAddChannel}
      />

      {/* AI Optimization Modal */}
      <OptimizationModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApply={applyOptimization}
        data={aiRecommendation}
        channels={selectedCampaign?.channels || []}
        isLoading={aiLoading}
      />
    </div>
  );
};

export default App;
