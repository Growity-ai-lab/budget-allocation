import React, { useState } from 'react';
import { X, Target, Calendar, DollarSign, FileText, Play, Pause, CheckCircle } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Omit<Campaign, 'id' | 'channels' | 'createdAt'>) => void;
  customerId: string;
  campaign?: Campaign;
}

const CampaignModal: React.FC<CampaignModalProps> = ({ isOpen, onClose, onSave, customerId, campaign }) => {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    customerId: campaign?.customerId || customerId,
    description: campaign?.description || '',
    status: campaign?.status || 'active' as 'active' | 'paused' | 'completed',
    startDate: campaign?.startDate || new Date().toISOString().split('T')[0],
    endDate: campaign?.endDate || '',
    budget: campaign?.budget || 10000
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {campaign ? 'Kampanyayı Düzenle' : 'Yeni Kampanya Ekle'}
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
              <Target className="w-4 h-4 inline mr-2" />
              Kampanya Adı *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="Örn: Yaz Kampanyası 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Kampanya hakkında kısa açıklama..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Başlangıç Tarihi *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Bitiş Tarihi
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Kampanya Bütçesi *
            </label>
            <input
              type="number"
              required
              min="0"
              step="1000"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">
              Formatlanmış: ${formData.budget.toLocaleString('tr-TR')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Kampanya Durumu
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'active' })}
                className={`py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  formData.status === 'active'
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Play className="w-4 h-4" />
                Aktif
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'paused' })}
                className={`py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  formData.status === 'paused'
                    ? 'bg-amber-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Pause className="w-4 h-4" />
                Duraklat
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'completed' })}
                className={`py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  formData.status === 'completed'
                    ? 'bg-slate-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Tamamlandı
              </button>
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
              {campaign ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignModal;
