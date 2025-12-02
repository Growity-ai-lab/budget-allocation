import React, { useState } from 'react';
import { Target, Plus, TrendingUp, DollarSign, Users, BarChart3, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Goal, Currency } from '../types';
import { formatCurrency } from '../utils';

interface GoalsViewProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onUpdateGoal: (goalId: string, currentValue: number) => void;
  currency: Currency;
  totalRevenue: number;
  totalSpend: number;
  totalCustomers: number;
}

const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  onAddGoal,
  onUpdateGoal,
  currency,
  totalRevenue,
  totalSpend,
  totalCustomers
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetValue: 0,
    currentValue: 0,
    deadline: '',
    type: 'revenue' as 'revenue' | 'roas' | 'spend' | 'customers'
  });

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'revenue': return <DollarSign className="w-5 h-5" />;
      case 'roas': return <TrendingUp className="w-5 h-5" />;
      case 'spend': return <BarChart3 className="w-5 h-5" />;
      case 'customers': return <Users className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getGoalColor = (type: string) => {
    switch (type) {
      case 'revenue': return 'emerald';
      case 'roas': return 'violet';
      case 'spend': return 'amber';
      case 'customers': return 'indigo';
      default: return 'slate';
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusInfo = (goal: Goal) => {
    const isOverdue = new Date(goal.deadline) < new Date() && goal.status !== 'completed';
    const progress = calculateProgress(goal.currentValue, goal.targetValue);

    if (goal.status === 'completed') {
      return { icon: CheckCircle, color: 'text-emerald-600', label: 'Tamamlandı' };
    }
    if (isOverdue) {
      return { icon: AlertCircle, color: 'text-rose-600', label: 'Süresi Doldu' };
    }
    if (progress >= 75) {
      return { icon: TrendingUp, color: 'text-emerald-600', label: 'İyi Gidiyor' };
    }
    return { icon: Target, color: 'text-slate-500', label: 'Devam Ediyor' };
  };

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetValue > 0 && newGoal.deadline) {
      onAddGoal({
        ...newGoal,
        status: 'active'
      });
      setNewGoal({
        name: '',
        targetValue: 0,
        currentValue: 0,
        deadline: '',
        type: 'revenue'
      });
      setIsModalOpen(false);
    }
  };

  // Auto-update goals based on actual data
  React.useEffect(() => {
    goals.forEach(goal => {
      let actualValue = goal.currentValue;

      switch (goal.type) {
        case 'revenue':
          actualValue = totalRevenue;
          break;
        case 'spend':
          actualValue = totalSpend;
          break;
        case 'customers':
          actualValue = totalCustomers;
          break;
        case 'roas':
          actualValue = totalSpend > 0 ? totalRevenue / totalSpend : 0;
          break;
      }

      if (actualValue !== goal.currentValue) {
        onUpdateGoal(goal.id, actualValue);
      }
    });
  }, [totalRevenue, totalSpend, totalCustomers, goals, onUpdateGoal]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Hedefler</h1>
            <p className="text-slate-500">İş hedeflerinizi takip edin</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          Yeni Hedef
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.currentValue, goal.targetValue);
          const statusInfo = getStatusInfo(goal);
          const color = getGoalColor(goal.type);
          const StatusIcon = statusInfo.icon;

          return (
            <div key={goal.id} className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${color}-100 flex items-center justify-center text-${color}-600`}>
                  {getGoalIcon(goal.type)}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                  <span className={`font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                </div>
              </div>

              <h3 className="font-bold text-lg text-slate-900 mb-2">{goal.name}</h3>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Mevcut:</span>
                  <span className="font-bold text-slate-900">
                    {goal.type === 'customers'
                      ? goal.currentValue.toFixed(0)
                      : goal.type === 'roas'
                      ? `${goal.currentValue.toFixed(2)}x`
                      : formatCurrency(goal.currentValue, currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Hedef:</span>
                  <span className="font-bold text-slate-900">
                    {goal.type === 'customers'
                      ? goal.targetValue.toFixed(0)
                      : goal.type === 'roas'
                      ? `${goal.targetValue.toFixed(2)}x`
                      : formatCurrency(goal.targetValue, currency)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-slate-500">İlerleme</span>
                  <span className="font-bold text-slate-900">{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      progress >= 100 ? `bg-${color}-500` :
                      progress >= 75 ? `bg-${color}-400` :
                      `bg-${color}-300`
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>Son: {new Date(goal.deadline).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-4">Henüz hedef eklenmemiş</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              İlk hedefinizi ekleyin
            </button>
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Yeni Hedef Ekle</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Hedef Adı *
                </label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Örn: Yıllık Gelir Hedefi"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Hedef Tipi *
                </label>
                <select
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as any })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="revenue">Gelir</option>
                  <option value="roas">ROAS</option>
                  <option value="spend">Harcama</option>
                  <option value="customers">Müşteri Sayısı</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Hedef Değer *
                </label>
                <input
                  type="number"
                  value={newGoal.targetValue}
                  onChange={(e) => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })}
                  min="0"
                  step={newGoal.type === 'roas' ? '0.1' : '1000'}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Son Tarih *
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleAddGoal}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-lg shadow-lg transition-all"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsView;
