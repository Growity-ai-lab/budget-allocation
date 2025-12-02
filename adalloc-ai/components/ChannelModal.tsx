import React, { useState } from 'react';
import { X, Radio } from 'lucide-react';
import { ChannelData } from '../types';
import { CHANNEL_COLORS } from '../constants';

interface ChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (channel: ChannelData) => void;
  channel?: ChannelData;
}

const ChannelModal: React.FC<ChannelModalProps> = ({ isOpen, onClose, onSave, channel }) => {
  const [useManualRoas, setUseManualRoas] = useState(false);
  const [formData, setFormData] = useState<ChannelData>({
    id: channel?.id || `ch-${Date.now()}`,
    name: channel?.name || '',
    spend: channel?.spend || 0,
    revenue: channel?.revenue || 0,
    impressions: channel?.impressions || 0,
    clicks: channel?.clicks || 0,
    roas: channel?.roas || 0,
    cpc: channel?.cpc || 0,
    ctr: channel?.ctr || 0,
    allocation: channel?.allocation || 0,
    color: channel?.color || CHANNEL_COLORS[0]
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate derived metrics
    let finalRoas = formData.roas;
    let finalRevenue = formData.revenue;

    if (useManualRoas) {
      // If manual ROAS, calculate revenue from spend * roas
      finalRevenue = formData.spend * formData.roas;
    } else {
      // If auto ROAS, calculate from spend and revenue
      finalRoas = formData.spend > 0 ? formData.revenue / formData.spend : 0;
    }

    const calculatedCpc = formData.clicks > 0 ? formData.spend / formData.clicks : 0;
    const calculatedCtr = formData.impressions > 0 ? (formData.clicks / formData.impressions) * 100 : 0;

    onSave({
      ...formData,
      revenue: finalRevenue,
      roas: finalRoas,
      cpc: calculatedCpc,
      ctr: calculatedCtr
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Radio className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {channel ? 'Kanalı Düzenle' : 'Yeni Kanal Ekle'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Kanal Adı *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="Örn: Google Ads, Meta, TikTok"
            />
          </div>

          {/* ROAS Calculation Method */}
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-semibold text-slate-900">Manuel ROAS Girişi</div>
                <div className="text-sm text-slate-600">ROAS'ı manuel gir, gelir otomatik hesaplansın</div>
              </div>
              <input
                type="checkbox"
                checked={useManualRoas}
                onChange={(e) => setUseManualRoas(e.target.checked)}
                className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Harcama ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="100"
                value={formData.spend}
                onChange={(e) => setFormData({ ...formData, spend: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {useManualRoas ? (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ROAS (Return on Ad Spend) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={formData.roas}
                  onChange={(e) => setFormData({ ...formData, roas: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Örn: 4.5"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Tahmini Gelir: ${(formData.spend * formData.roas).toFixed(0)}
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Gelir ($) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="100"
                  value={formData.revenue}
                  onChange={(e) => setFormData({ ...formData, revenue: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Tahmini ROAS: {formData.spend > 0 ? (formData.revenue / formData.spend).toFixed(2) : '0.00'}x
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Gösterim Sayısı
              </label>
              <input
                type="number"
                min="0"
                value={formData.impressions}
                onChange={(e) => setFormData({ ...formData, impressions: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tıklama Sayısı
              </label>
              <input
                type="number"
                min="0"
                value={formData.clicks}
                onChange={(e) => setFormData({ ...formData, clicks: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Renk
            </label>
            <div className="flex gap-3 flex-wrap">
              {CHANNEL_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.color === color
                      ? 'ring-4 ring-offset-2 ring-indigo-500 scale-110'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Hesaplanacak Metrikler:</h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500">ROAS:</span>
                <div className="font-bold text-slate-900 mt-1">
                  {formData.spend > 0 ? (formData.revenue / formData.spend).toFixed(2) : '0.00'}x
                </div>
              </div>
              <div>
                <span className="text-slate-500">CPC:</span>
                <div className="font-bold text-slate-900 mt-1">
                  ${formData.clicks > 0 ? (formData.spend / formData.clicks).toFixed(2) : '0.00'}
                </div>
              </div>
              <div>
                <span className="text-slate-500">CTR:</span>
                <div className="font-bold text-slate-900 mt-1">
                  {formData.impressions > 0 ? ((formData.clicks / formData.impressions) * 100).toFixed(2) : '0.00'}%
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-lg shadow-lg transition-all"
            >
              {channel ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChannelModal;
