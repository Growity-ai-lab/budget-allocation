import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { ChannelData, Currency } from '../types';
import { formatCurrency } from '../utils';

interface ChartProps {
  data: ChannelData[];
  currency: Currency;
}

export const SpendDistributionChart: React.FC<ChartProps> = ({ data, currency }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="spend"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const PerformanceBarChart: React.FC<ChartProps> = ({ data, currency }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={100} 
          tick={{ fontSize: 12, fill: '#64748b' }} 
          axisLine={false}
          tickLine={false}
        />
        <Tooltip 
          cursor={{ fill: '#f1f5f9' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0].payload;
              return (
                <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-lg">
                  <p className="font-semibold text-slate-800 mb-2">{d.name}</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-slate-600 flex justify-between gap-4"><span>ROAS:</span> <span className="font-bold text-slate-900">{d.roas}x</span></p>
                    <p className="text-slate-600 flex justify-between gap-4"><span>Revenue:</span> <span className="font-bold text-emerald-600">{formatCurrency(d.revenue, currency)}</span></p>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="roas" radius={[0, 4, 4, 0]} barSize={32}>
          {data.map((entry, index) => (
             <Cell key={`cell-${index}`} fill={entry.roas > 3 ? '#10b981' : entry.roas > 2 ? '#3b82f6' : '#f43f5e'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
