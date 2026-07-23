import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Dashboard stat card with icon, value, trend
 * @param {string} title
 * @param {string|number} value
 * @param {string} icon — Lucide icon component
 * @param {string} color — 'blue' | 'green' | 'red' | 'amber' | 'purple'
 * @param {number} change — percent change (positive/negative)
 * @param {string} subtitle
 */
export default function StatCard({ title, value, Icon, color = 'blue', change, subtitle }) {
  const colors = {
    blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',   icon: 'text-blue-600 dark:text-blue-400',   iconBg: 'bg-blue-100 dark:bg-blue-900/40' },
    green:  { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/40' },
    red:    { bg: 'bg-red-50 dark:bg-red-900/20',     icon: 'text-red-600 dark:text-red-400',     iconBg: 'bg-red-100 dark:bg-red-900/40' },
    amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-900/40' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400', iconBg: 'bg-purple-100 dark:bg-purple-900/40' },
  };

  const c = colors[color] || colors.blue;
  const isPositive = change > 0;
  const isNeutral  = change === 0 || change == null;

  return (
    <div className="card-hover animate-fade-in">
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.iconBg}`}>
          {Icon && <Icon className={`w-6 h-6 ${c.icon}`} />}
        </div>

        {/* Trend badge */}
        {!isNeutral && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
            isPositive
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
              : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {isPositive
              ? <TrendingUp className="w-3 h-3" />
              : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
