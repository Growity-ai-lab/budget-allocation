import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { ViewState, Customer, Campaign } from '../types';

interface BreadcrumbsProps {
  viewState: ViewState;
  customers: Customer[];
  onNavigate: (mode: 'overview' | 'customer' | 'campaign', customerId?: string, campaignId?: string) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ viewState, customers, onNavigate }) => {
  const selectedCustomer = customers.find(c => c.id === viewState.selectedCustomerId);
  const selectedCampaign = selectedCustomer?.campaigns.find(
    c => c.id === viewState.selectedCampaignId
  );

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={() => onNavigate('overview')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
          viewState.mode === 'overview'
            ? 'bg-indigo-100 text-indigo-700 font-semibold'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Tüm Müşteriler</span>
      </button>

      {selectedCustomer && (
        <>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <button
            onClick={() => onNavigate('customer', selectedCustomer.id)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewState.mode === 'customer'
                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {selectedCustomer.name}
          </button>
        </>
      )}

      {selectedCampaign && (
        <>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <button
            onClick={() => onNavigate('campaign', selectedCustomer?.id, selectedCampaign.id)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewState.mode === 'campaign'
                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {selectedCampaign.name}
          </button>
        </>
      )}
    </div>
  );
};

export default Breadcrumbs;
