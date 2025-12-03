import React from 'react';
import { X, Check, BrainCircuit } from 'lucide-react';
import { RecommendationResponse, ChannelData, Currency } from '../types';
import { formatCurrency } from '../utils';

interface OptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (newAllocations: Record<string, number>) => void;
  data: RecommendationResponse | null;
  channels: ChannelData[];
  isLoading: boolean;
  currency: Currency;
}

const OptimizationModal: React.FC<OptimizationModalProps> = ({
  isOpen,
  onClose,
  onApply,
  data,
  channels,
  isLoading,
  currency
}) => {
  if (!isOpen) return null;

  const handleApply = () => {
    if (data) {
      const newMap: Record<string, number> = {};
      data.recommendations.forEach(rec => {
        newMap[rec.channelId] = rec.suggestedSpend;
      });
      onApply(newMap);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">AI Budget Strategist</h2>
              <p className="text-sm text-slate-500">Powered by Gemini 2.5 Flash</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-600 font-medium">Analyzing performance data...</p>
            </div>
          ) : data ? (
            <>
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2">Strategic Overview</h3>
                <p className="text-slate-700 leading-relaxed">{data.globalStrategy}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Channel Recommendations</h3>
                {data.recommendations.map((rec) => {
                  const currentSpend = channels.find(c => c.id === rec.channelId)?.spend || 0;
                  const diff = rec.suggestedSpend - currentSpend;
                  const isPositive = diff > 0;
                  
                  return (
                    <div key={rec.channelId} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-indigo-200 transition-colors">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold text-slate-900">
                            {channels.find(c => c.id === rec.channelId)?.name}
                          </span>
                          <span className={`text-sm font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPositive ? '+' : ''}{formatCurrency(diff, currency)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{rec.reasoning}</p>
                      </div>
                      <div className="sm:text-right min-w-[120px]">
                         <div className="text-xs text-slate-500">New Budget</div>
                         <div className="text-lg font-bold text-slate-900">
                           {formatCurrency(rec.suggestedSpend, currency)}
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
             <div className="text-center py-12 text-slate-500">No recommendations generated.</div>
          )}
        </div>

        {/* Footer */}
        {!isLoading && data && (
          <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleApply}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center shadow-lg shadow-indigo-200"
            >
              <Check className="w-4 h-4 mr-2" />
              Apply Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizationModal;
