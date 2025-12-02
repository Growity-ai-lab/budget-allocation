import React, { useState, useMemo } from 'react';
import { Radio, Search, TrendingUp, DollarSign, Eye, MousePointer } from 'lucide-react';
import { Customer, Currency } from '../types';
import { formatCurrency } from '../utils';

interface ChannelsViewProps {
  customers: Customer[];
  currency: Currency;
}

const ChannelsView: React.FC<ChannelsViewProps> = ({ customers, currency }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'spend' | 'revenue' | 'roas'>('spend');

  // Flatten all channels from all campaigns
  const allChannels = useMemo(() => {
    const channels: Array<{
      channelId: string;
      channelName: string;
      customerName: string;
      campaignName: string;
      spend: number;
      revenue: number;
      roas: number;
      impressions: number;
      clicks: number;
      ctr: number;
      color: string;
    }> = [];

    customers.forEach(customer => {
      customer.campaigns.forEach(campaign => {
        campaign.channels.forEach(channel => {
          channels.push({
            channelId: channel.id,
            channelName: channel.name,
            customerName: customer.name,
            campaignName: campaign.name,
            spend: channel.spend,
            revenue: channel.revenue,
            roas: channel.roas,
            impressions: channel.impressions,
            clicks: channel.clicks,
            ctr: channel.ctr,
            color: channel.color
          });
        });
      });
    });

    return channels;
  }, [customers]);

  // Filter and sort channels
  const filteredChannels = useMemo(() => {
    let filtered = allChannels.filter(channel =>
      channel.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'spend': return b.spend - a.spend;
        case 'revenue': return b.revenue - a.revenue;
        case 'roas': return b.roas - a.roas;
        default: return 0;
      }
    });

    return filtered;
  }, [allChannels, searchQuery, sortBy]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredChannels.reduce(
      (acc, channel) => ({
        spend: acc.spend + channel.spend,
        revenue: acc.revenue + channel.revenue,
        impressions: acc.impressions + channel.impressions,
        clicks: acc.clicks + channel.clicks
      }),
      { spend: 0, revenue: 0, impressions: 0, clicks: 0 }
    );
  }, [filteredChannels]);

  const overallRoas = totals.spend > 0 ? (totals.revenue / totals.spend).toFixed(2) : '0.00';
  const overallCtr = totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <Radio className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tüm Kanallar</h1>
          <p className="text-slate-500">Tüm müşteriler ve kampanyalar genelinde kanal performansı</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-500">Toplam Harcama</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(totals.spend, currency)}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-slate-500">Toplam Gelir</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totals.revenue, currency)}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <span className="text-sm text-slate-500">Ortalama ROAS</span>
          </div>
          <div className="text-2xl font-bold text-indigo-600">{overallRoas}x</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <MousePointer className="w-5 h-5 text-violet-500" />
            <span className="text-sm text-slate-500">Toplam Kanal</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{filteredChannels.length}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kanal, müşteri veya kampanya ara..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
          <button
            onClick={() => setSortBy('spend')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              sortBy === 'spend'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Harcama
          </button>
          <button
            onClick={() => setSortBy('revenue')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              sortBy === 'revenue'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Gelir
          </button>
          <button
            onClick={() => setSortBy('roas')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              sortBy === 'roas'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            ROAS
          </button>
        </div>
      </div>

      {/* Channels Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Kanal</th>
                <th className="px-6 py-4 font-semibold">Müşteri</th>
                <th className="px-6 py-4 font-semibold">Kampanya</th>
                <th className="px-6 py-4 font-semibold text-right">Harcama</th>
                <th className="px-6 py-4 font-semibold text-right">Gelir</th>
                <th className="px-6 py-4 font-semibold text-right">ROAS</th>
                <th className="px-6 py-4 font-semibold text-right">Gösterim</th>
                <th className="px-6 py-4 font-semibold text-right">Tıklama</th>
                <th className="px-6 py-4 font-semibold text-right">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChannels.map((channel) => (
                <tr key={channel.channelId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channel.color }}></div>
                      <span className="font-medium text-slate-900">{channel.channelName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{channel.customerName}</td>
                  <td className="px-6 py-4 text-slate-600">{channel.campaignName}</td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900">
                    {formatCurrency(channel.spend, currency)}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-emerald-600">
                    {formatCurrency(channel.revenue, currency)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold px-2 py-1 rounded ${
                      channel.roas > 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {channel.roas.toFixed(2)}x
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    {channel.impressions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    {channel.clicks.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-medium text-indigo-600">
                      {channel.ctr.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 border-t-2 border-slate-200">
              <tr>
                <td colSpan={3} className="px-6 py-4 font-bold text-slate-900">Toplam</td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">
                  {formatCurrency(totals.spend, currency)}
                </td>
                <td className="px-6 py-4 text-right font-bold text-emerald-600">
                  {formatCurrency(totals.revenue, currency)}
                </td>
                <td className="px-6 py-4 text-right font-bold text-indigo-600">
                  {overallRoas}x
                </td>
                <td className="px-6 py-4 text-right font-semibold text-slate-600">
                  {totals.impressions.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-slate-600">
                  {totals.clicks.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right font-medium text-indigo-600">
                  {overallCtr}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {filteredChannels.length === 0 && (
          <div className="text-center py-16">
            <Radio className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">
              {searchQuery ? 'Kanal bulunamadı' : 'Henüz kanal eklenmemiş'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelsView;
