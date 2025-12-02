import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  prefix?: string;
  suffix?: string;
  neutral?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, prefix, suffix, neutral }) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="text-sm font-medium text-slate-500 mb-1">{title}</div>
      <div className="flex items-baseline gap-1">
        {prefix && <span className="text-xl font-semibold text-slate-700">{prefix}</span>}
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        {suffix && <span className="text-sm font-medium text-slate-500">{suffix}</span>}
      </div>
      
      {change !== undefined && !neutral && (
        <div className={`flex items-center mt-3 text-sm font-medium ${isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-600' : 'text-slate-500'}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : isNegative ? <ArrowDownRight className="w-4 h-4 mr-1" /> : <Minus className="w-4 h-4 mr-1" />}
          {Math.abs(change)}%
          <span className="text-slate-400 font-normal ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
