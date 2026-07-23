import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { MOCK_MONTHLY_REVENUE } from '../../utils/mockData';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg p-3">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.fill }} />
          <span className="text-gray-600 dark:text-gray-400 capitalize">{p.name}:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function RevenueChart() {
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Revenue Analytics</h3>
          <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={MOCK_MONTHLY_REVENUE} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barSize={18}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={50}
            tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
          <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="revenue" />
          <Bar dataKey="cost"    fill="#e2e8f0" radius={[4, 4, 0, 0]} name="cost" />
          <Bar dataKey="profit"  fill="#10b981" radius={[4, 4, 0, 0]} name="profit" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
