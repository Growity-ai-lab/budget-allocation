import React from 'react';
import { Target, Calendar, DollarSign, TrendingUp, ChevronRight, Pause, Play, CheckCircle } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignCardProps {
  campaign: Campaign;
  onClick: () => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onClick }) => {
  const totalSpend = campaign.channels.reduce((acc, ch) => acc + ch.spend, 0);
  const totalRevenue = campaign.channels.reduce((acc, ch) => acc + ch.revenue, 0);
  const campaignRoas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0.00';
  const budgetUtilization = ((totalSpend / campaign.budget) * 100).toFixed(0);

  const getStatusIcon = () => {
    switch (campaign.status) {
      case 'active':
        return <Play className="w-3 h-3" />;
      case 'paused':
        return <Pause className="w-3 h-3" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
    }
  };

  const getStatusColor = () => {
    switch (campaign.status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700';
      case 'paused':
        return 'bg-amber-100 text-amber-700';
      case 'completed':
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusText = () => {
    switch (campaign.status) {
      case 'active':
        return 'Aktif';
      case 'paused':
        return 'Duraklatıldı';
      case 'completed':
        return 'Tamamlandı';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border-2 border-slate-200 p-5 hover:border-indigo-400 hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
              {campaign.name}
            </h3>
            {campaign.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{campaign.description}</p>
            )}
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${getStatusColor()}`}>
          {getStatusIcon()}
          {getStatusText()}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5" />
            <span>Başlangıç:</span>
          </div>
          <span className="font-medium text-slate-900">
            {new Date(campaign.startDate).toLocaleDateString('tr-TR')}
          </span>
        </div>
        {campaign.endDate && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-3.5 h-3.5" />
              <span>Bitiş:</span>
            </div>
            <span className="font-medium text-slate-900">
              {new Date(campaign.endDate).toLocaleDateString('tr-TR')}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Kanal Sayısı:</span>
          <span className="font-bold text-indigo-600">{campaign.channels.length}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">Bütçe Kullanımı</span>
          <span className="text-xs font-bold text-slate-900">{budgetUtilization}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
          <div
            className={`h-2 rounded-full transition-all ${
              Number(budgetUtilization) > 90
                ? 'bg-rose-500'
                : Number(budgetUtilization) > 70
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(Number(budgetUtilization), 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="flex items-center justify-center mb-0.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-xs text-slate-500">Harcama</div>
            <div className="font-bold text-slate-900 text-xs">
              ${(totalSpend / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-xs text-slate-500">Gelir</div>
            <div className="font-bold text-emerald-600 text-xs">
              ${(totalRevenue / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-0.5">
              <Target className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="text-xs text-slate-500">ROAS</div>
            <div className="font-bold text-indigo-600 text-xs">{campaignRoas}x</div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end">
        <span className="text-xs text-slate-500 mr-auto">
          Bütçe: ${(campaign.budget / 1000).toFixed(0)}k
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

export default CampaignCard;
