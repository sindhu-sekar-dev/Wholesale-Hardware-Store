import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg p-3">
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">{label}</p>
      <p className={`text-sm font-bold ${val >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
        {val >= 0 ? 'Profit: ' : 'Loss: '}{formatCurrency(Math.abs(val))}
      </p>
    </div>
  );
};

/**
 * @param {Array} data — [{ name, netPL }]
 */
export default function ProfitLossChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 60 }} barSize={22}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false} tickLine={false}
          angle={-35} textAnchor="end" interval={0}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={55}
          tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
        />
        <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100,100,100,0.05)' }} />
        <Bar dataKey="netPL" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.netPL >= 0 ? '#10b981' : '#ef4444'}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
