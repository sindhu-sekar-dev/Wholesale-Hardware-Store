import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react';
import ProfitLossChart from '../components/charts/ProfitLossChart';
import { formatCurrency } from '../utils/formatters';
import { MOCK_PRODUCTS, MOCK_SALES } from '../utils/mockData';

export default function ProfitLoss() {
  // Calculate P&L per product from sales data
  const plData = useMemo(() => {
    return MOCK_PRODUCTS.map(product => {
      // All sales for this product
      const productSales = MOCK_SALES.filter(s => s.product_id === product.id);
      const totalRevenue = productSales.reduce((sum, s) => sum + s.total_revenue, 0);
      const totalCost    = productSales.reduce((sum, s) => sum + (s.cost_price * s.quantity_sold), 0);
      const totalSold    = productSales.reduce((sum, s) => sum + s.quantity_sold, 0);
      const netPL        = totalRevenue - totalCost;
      const margin       = totalRevenue > 0 ? ((netPL / totalRevenue) * 100).toFixed(1) : 0;

      return {
        id:          product.id,
        name:        product.name,
        category:    product.category,
        sellPrice:   product.price,
        costPrice:   product.cost_price,
        unitProfit:  product.price - product.cost_price,
        totalSold,
        totalRevenue,
        totalCost,
        netPL,
        margin: +margin,
      };
    }).sort((a, b) => b.netPL - a.netPL);
  }, []);

  const totRevenue = plData.reduce((sum, p) => sum + p.totalRevenue, 0);
  const totCost    = plData.reduce((sum, p) => sum + p.totalCost, 0);
  const totProfit  = plData.filter(p => p.netPL > 0).reduce((sum, p) => sum + p.netPL, 0);
  const totLoss    = Math.abs(plData.filter(p => p.netPL < 0).reduce((sum, p) => sum + p.netPL, 0));
  const netPL      = totRevenue - totCost;

  // Chart data (top 10 products by revenue)
  const chartData = plData.slice(0, 10).map(p => ({ name: p.name.slice(0, 18), netPL: p.netPL }));

  return (
    <div className="animate-fade-in space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profit & Loss</h1>
          <p className="page-subtitle">Auto-calculated from sales records</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totRevenue)}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Profit</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totProfit)}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Loss</span>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totLoss)}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              netPL >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              {netPL >= 0
                ? <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                : <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              }
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Net P&L</span>
          </div>
          <p className={`text-2xl font-bold ${netPL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(Math.abs(netPL))}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{netPL >= 0 ? '▲ Net Profit' : '▼ Net Loss'}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
          Profit / Loss by Product (Top 10)
        </h3>
        <p className="text-xs text-gray-400 mb-4">Green = profit · Red = loss</p>
        <ProfitLossChart data={chartData} />
      </div>

      {/* Detailed table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Product P&L Report</h3>
          <p className="text-xs text-gray-400 mt-0.5">Profit = Selling Price − Cost Price</p>
        </div>
        <div className="table-wrapper">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Product</th>
                <th className="table-header">Sell Price</th>
                <th className="table-header">Cost Price</th>
                <th className="table-header">Unit Profit</th>
                <th className="table-header">Units Sold</th>
                <th className="table-header">Revenue</th>
                <th className="table-header">Net P&L</th>
                <th className="table-header">Margin</th>
              </tr>
            </thead>
            <tbody>
              {plData.map(p => (
                <tr key={p.id} className="table-row">
                  <td className="table-cell">
                    <p className="font-medium text-gray-900 dark:text-white text-sm max-w-[180px] truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </td>
                  <td className="table-cell text-gray-700 dark:text-gray-300">{formatCurrency(p.sellPrice)}</td>
                  <td className="table-cell text-gray-500">{formatCurrency(p.costPrice)}</td>
                  <td className="table-cell">
                    <span className={`font-semibold ${p.unitProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                      {formatCurrency(p.unitProfit)}
                    </span>
                  </td>
                  <td className="table-cell text-gray-600 dark:text-gray-400">{p.totalSold}</td>
                  <td className="table-cell font-semibold text-gray-900 dark:text-white">{formatCurrency(p.totalRevenue)}</td>
                  <td className="table-cell">
                    <span className={`font-bold ${p.netPL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                      {p.netPL >= 0 ? '+' : ''}{formatCurrency(p.netPL)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden w-16">
                        <div
                          className={`h-full rounded-full ${p.margin >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(Math.abs(p.margin), 100)}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${p.margin >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                        {p.margin}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
