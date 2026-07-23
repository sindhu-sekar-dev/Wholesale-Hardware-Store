import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { MOCK_WEEKLY_SALES } from '../../utils/mockData';
import { formatCurrency } from '../../utils/formatters';

// Custom tooltip for chart
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg p-3">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-medium" style={{ color: p.color }}>
          {p.name === 'revenue' ? formatCurrency(p.value) : `${p.value} orders`}
        </p>
      ))}
    </div>
  );
};

export default function SalesTrendChart() {
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Sales Trend</h3>
          <p className="text-xs text-gray-400 mt-0.5">Last 7 days</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-primary-500 rounded inline-block" /> Revenue
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-emerald-500 rounded inline-block" /> Orders
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={MOCK_WEEKLY_SALES} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={45}
            tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5}
            fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: '#3b82f6' }} />
          <Area type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2}
            fill="url(#ordersGrad)" dot={false} activeDot={{ r: 4, fill: '#10b981' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
