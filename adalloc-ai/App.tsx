import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  BarChart3, 
  PieChart, 
  RefreshCcw, 
  BrainCircuit,
  Sliders,
  DollarSign,
  TrendingUp,
  Target
} from 'lucide-react';

import { ChannelData, RecommendationResponse } from './types';
import { INITIAL_CHANNELS, TOTAL_BUDGET } from './constants';
import { getBudgetOptimization } from './services/geminiService';
import MetricCard from './components/MetricCard';
import { SpendDistributionChart, PerformanceBarChart } from './components/Charts';
import OptimizationModal from './components/OptimizationModal';

const App: React.FC = () => {
  const [channels, setChannels] = useState<ChannelData[]>(INITIAL_CHANNELS);
  const [totalBudget, setTotalBudget] = useState(TOTAL_BUDGET);
  
  // AI Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<RecommendationResponse | null>(null);

  // Derived Metrics
  const totalSpend = useMemo(() => channels.reduce((acc, c) => acc + c.spend, 0), [channels]);
  const totalRevenue = useMemo(() => channels.reduce((acc, c) => acc + c.revenue, 0), [channels]);
  const blendedRoas = useMemo(() => totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0.00', [totalSpend, totalRevenue]);
  const remainingBudget = totalBudget - totalSpend;

  // Handlers
  const handleBudgetChange = (id: string, newSpend: number) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id === id) {
        // Simplified prediction: Assume ROAS stays roughly constant for small changes (linear model)
        // In real app, this would be a diminishing returns curve
        const estimatedRevenue = newSpend * ch.roas; 
        return { ...ch, spend: newSpend, revenue: estimatedRevenue };
      }
      return ch;
    }));
  };

  const handleOptimizeClick = async () => {
    setIsAiModalOpen(true);
    setAiLoading(true);
    setAiRecommendation(null);
    
    try {
      const result = await getBudgetOptimization(channels, totalBudget);
      setAiRecommendation(result);
    } catch (e) {
      console.error("Optimization failed", e);
    } finally {
      setAiLoading(false);
    }
  };

  const applyOptimization = (newAllocations: Record<string, number>) => {
    setChannels(prev => prev.map(ch => {
      if (newAllocations[ch.id] !== undefined) {
        const newSpend = newAllocations[ch.id];
        return { 
          ...ch, 
          spend: newSpend, 
          revenue: newSpend * ch.roas // Recalculate revenue based on constant ROAS assumption
        };
      }
      return ch;
    }));
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
          <button className="w-full flex items-center p-3 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 transition-all">
            <LayoutDashboard className="w-5 h-5 min-w-[20px]" />
            <span className="ml-3 hidden lg:block font-medium">Dashboard</span>
          </button>
          <button className="w-full flex items-center p-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <PieChart className="w-5 h-5 min-w-[20px]" />
            <span className="ml-3 hidden lg:block font-medium">Channels</span>
          </button>
          <button className="w-full flex items-center p-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <Target className="w-5 h-5 min-w-[20px]" />
            <span className="ml-3 hidden lg:block font-medium">Goals</span>
          </button>
           <button className="w-full flex items-center p-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <Settings className="w-5 h-5 min-w-[20px]" />
            <span className="ml-3 hidden lg:block font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 border-2 border-slate-700"></div>
             <div className="hidden lg:block">
               <div className="text-sm font-medium text-white">Marketing Lead</div>
               <div className="text-xs text-slate-500">Pro Plan</div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div>
             <h1 className="text-xl font-bold text-slate-900">October Allocation</h1>
             <p className="text-xs text-slate-500">Last updated: Just now</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center px-4 py-2 bg-slate-100 rounded-lg border border-slate-200">
               <span className="text-sm text-slate-500 mr-2">Total Budget:</span>
               <input 
                  type="number" 
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="bg-transparent font-bold text-slate-900 w-24 outline-none text-right"
               />
             </div>
             <button 
                onClick={handleOptimizeClick}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md shadow-indigo-200 transition-all transform active:scale-95"
             >
               <BrainCircuit className="w-5 h-5" />
               <span>Ask AI Strategist</span>
             </button>
          </div>
        </header>

        {/* Scrollable Dashboard Area */}
        <div className="flex-1 overflow-y-auto p-8">
          
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                title="Total Spend" 
                value={totalSpend.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                prefix=""
                change={12.5}
              />
              <MetricCard 
                title="Total Revenue" 
                value={totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                prefix=""
                change={8.2}
              />
              <MetricCard 
                title="Blended ROAS" 
                value={`${blendedRoas}x`} 
                change={-2.4}
              />
              <MetricCard 
                title="Budget Utilization" 
                value={`${((totalSpend/totalBudget)*100).toFixed(1)}%`}
                suffix={`of $${(totalBudget/1000).toFixed(0)}k`}
                neutral
              />
            </div>

            {/* Main interactive section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Charts */}
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800">Spend Distribution</h3>
                    <PieChart className="w-5 h-5 text-slate-400" />
                  </div>
                  <SpendDistributionChart data={channels} />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800">ROAS by Channel</h3>
                    <TrendingUp className="w-5 h-5 text-slate-400" />
                  </div>
                  <PerformanceBarChart data={channels} />
                </div>
              </div>

              {/* Right Column: Allocation Table */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                   <div>
                     <h3 className="font-bold text-lg text-slate-900">Budget Allocation</h3>
                     <p className="text-sm text-slate-500">Adjust spend to forecast revenue</p>
                   </div>
                   <div className={`px-3 py-1 rounded-full text-xs font-bold ${remainingBudget >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {remainingBudget >= 0 ? 'Remaining: ' : 'Overbudget: '}
                      {Math.abs(remainingBudget).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                   </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-semibold">Channel</th>
                        <th className="px-6 py-4 font-semibold text-right">ROAS</th>
                        <th className="px-6 py-4 font-semibold text-right">Current Spend</th>
                        <th className="px-6 py-4 font-semibold text-center">Adjustment</th>
                        <th className="px-6 py-4 font-semibold text-right">Forecast Rev</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {channels.map((channel) => (
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
                             <div className="relative">
                               <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                               <input 
                                  type="number" 
                                  value={channel.spend} 
                                  onChange={(e) => handleBudgetChange(channel.id, Number(e.target.value))}
                                  className="w-24 text-right bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                               />
                             </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4 w-32 mx-auto">
                               <button 
                                  onClick={() => handleBudgetChange(channel.id, Math.max(0, channel.spend - 1000))}
                                  className="w-6 h-6 rounded flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200"
                               >
                                 -
                               </button>
                               <input 
                                 type="range" 
                                 min="0" 
                                 max={totalBudget} 
                                 step="500"
                                 value={channel.spend}
                                 onChange={(e) => handleBudgetChange(channel.id, Number(e.target.value))}
                                 className="flex-1 accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                               />
                               <button 
                                  onClick={() => handleBudgetChange(channel.id, channel.spend + 1000)}
                                  className="w-6 h-6 rounded flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200"
                               >
                                 +
                               </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-slate-700">
                             {channel.revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t border-slate-200">
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-900">Total</td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">
                           {totalSpend.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-600">
                           {totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* AI Modal */}
      <OptimizationModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)}
        onApply={applyOptimization}
        data={aiRecommendation}
        channels={channels}
        isLoading={aiLoading}
      />

    </div>
  );
};

export default App;
