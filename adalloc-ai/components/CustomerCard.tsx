import React from 'react';
import { Building2, TrendingUp, DollarSign, BarChart3, ChevronRight } from 'lucide-react';
import { Customer } from '../types';

interface CustomerCardProps {
  customer: Customer;
  onClick: () => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onClick }) => {
  const totalSpend = customer.campaigns.reduce((acc, campaign) =>
    acc + campaign.channels.reduce((sum, ch) => sum + ch.spend, 0), 0
  );

  const totalRevenue = customer.campaigns.reduce((acc, campaign) =>
    acc + campaign.channels.reduce((sum, ch) => sum + ch.revenue, 0), 0
  );

  const activeCampaigns = customer.campaigns.filter(c => c.status === 'active').length;
  const overallRoas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0.00';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-indigo-400 hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: customer.color }}
          >
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
              {customer.name}
            </h3>
            <p className="text-sm text-slate-500">{customer.industry || 'Genel'}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          customer.status === 'active'
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-slate-100 text-slate-600'
        }`}>
          {customer.status === 'active' ? 'Aktif' : 'Pasif'}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">İletişim:</span>
          <span className="font-medium text-slate-900">{customer.contactPerson || '-'}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Aktif Kampanya:</span>
          <span className="font-bold text-indigo-600">{activeCampaigns}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xs text-slate-500">Harcama</div>
          <div className="font-bold text-slate-900 text-sm">
            ${(totalSpend / 1000).toFixed(0)}k
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xs text-slate-500">Gelir</div>
          <div className="font-bold text-emerald-600 text-sm">
            ${(totalRevenue / 1000).toFixed(0)}k
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xs text-slate-500">ROAS</div>
          <div className="font-bold text-indigo-600 text-sm">{overallRoas}x</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-sm text-slate-500">
          Bütçe: ${(customer.totalBudget / 1000).toFixed(0)}k
        </span>
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

export default CustomerCard;
