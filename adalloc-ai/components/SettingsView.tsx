import React from 'react';
import { Settings as SettingsIcon, DollarSign, TrendingUp, Globe } from 'lucide-react';
import { AppSettings, Currency } from '../types';
import { CURRENCIES } from '../constants';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdateSettings }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ayarlar</h1>
          <p className="text-slate-500">Uygulama tercihlerinizi yönetin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currency Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Para Birimi</h3>
              <p className="text-sm text-slate-500">Tüm finansal değerler için</p>
            </div>
          </div>

          <div className="space-y-3">
            {CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => onUpdateSettings({ ...settings, currency: currency.code })}
                className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  settings.currency === currency.code
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{currency.symbol}</div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900">{currency.code}</div>
                    <div className="text-sm text-slate-500">{currency.name}</div>
                  </div>
                </div>
                {settings.currency === currency.code && (
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Default Values */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Varsayılan Değerler</h3>
              <p className="text-sm text-slate-500">Yeni eklenen öğeler için</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Varsayılan Kampanya Bütçesi
              </label>
              <input
                type="number"
                value={settings.defaultCampaignBudget}
                onChange={(e) => onUpdateSettings({ ...settings, defaultCampaignBudget: Number(e.target.value) })}
                min="0"
                step="1000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Varsayılan Kanal Bütçesi
              </label>
              <input
                type="number"
                value={settings.defaultChannelBudget}
                onChange={(e) => onUpdateSettings({ ...settings, defaultChannelBudget: Number(e.target.value) })}
                min="0"
                step="500"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Görünüm Ayarları</h3>
              <p className="text-sm text-slate-500">Arayüz tercihleri</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all">
              <div>
                <div className="font-medium text-slate-900">Karşılama Ekranı</div>
                <div className="text-sm text-slate-500">İlk açılışta göster</div>
              </div>
              <input
                type="checkbox"
                checked={settings.showWelcome}
                onChange={(e) => onUpdateSettings({ ...settings, showWelcome: e.target.checked })}
                className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-6">
          <h3 className="font-bold text-slate-900 mb-3">💡 İpucu</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Para birimi değişikliği tüm görünümlere anında yansır</li>
            <li>• Varsayılan bütçeler yeni eklenen öğeler için kullanılır</li>
            <li>• Ayarlarınız otomatik olarak kaydedilir</li>
            <li>• Verileriniz tarayıcıda güvenle saklanır</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
