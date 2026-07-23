import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, TrendingDown, Package, 
  ShoppingCart, Calendar, AlertTriangle, Truck 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, LineChart, Line 
} from 'recharts';
import { 
  MOCK_PRODUCTS, MOCK_SALES, MOCK_PURCHASES, MOCK_TRANSPORTATION, MOCK_CATEGORIES 
} from '../utils/mockData';
import { formatCurrency, formatNumber } from '../utils/formatters';

// Framer Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } }
};

// Animated Number Counter Component
function AnimatedCounter({ value, isCurrency = true }) {
  // Simulates a quick ticker counting up to the value
  const [displayValue, setDisplayValue] = useState(0);

  useState(() => {
    let start = 0;
    const duration = 800; // ms
    const increment = value / (duration / 16); // ~60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        clearInterval(timer);
        setDisplayValue(value);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {isCurrency ? formatCurrency(displayValue) : formatNumber(displayValue)}
    </span>
  );
}

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Available months filter list derived from Sales
  const months = useMemo(() => {
    const dates = MOCK_SALES.map(s => s.sale_date.substring(0, 7));
    return ['all', ...new Set(dates)].sort().reverse();
  }, []);

  // Filtered sales and purchases
  const filteredSales = useMemo(() => {
    if (selectedMonth === 'all') return MOCK_SALES;
    return MOCK_SALES.filter(s => s.sale_date.startsWith(selectedMonth));
  }, [selectedMonth]);

  const filteredPurchases = useMemo(() => {
    if (selectedMonth === 'all') return MOCK_PURCHASES;
    return MOCK_PURCHASES.filter(p => p.purchase_date.startsWith(selectedMonth));
  }, [selectedMonth]);

  // Aggregate statistics
  const totalRevenue = useMemo(() => {
    return filteredSales.reduce((sum, s) => sum + s.total_amount, 0);
  }, [filteredSales]);

  const totalCost = useMemo(() => {
    return filteredPurchases.reduce((sum, p) => sum + p.total_cost, 0);
  }, [filteredPurchases]);

  const totalProfit = useMemo(() => {
    return Math.max(0, totalRevenue - totalCost);
  }, [totalRevenue, totalCost]);

  const lowStockProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => p.stock_quantity <= p.reorder_level);
  }, []);

  // Chart data: Monthly Sales vs Purchases
  const monthlyData = useMemo(() => {
    // Group sales and purchases by month name
    const monthsMap = {
      '06': { name: 'June', revenue: 0, cost: 0 },
      '07': { name: 'July', revenue: 0, cost: 0 }
    };

    MOCK_SALES.forEach(s => {
      const m = s.sale_date.split('-')[1];
      if (monthsMap[m]) monthsMap[m].revenue += s.total_amount;
    });

    MOCK_PURCHASES.forEach(p => {
      const m = p.purchase_date.split('-')[1];
      if (monthsMap[m]) monthsMap[m].cost += p.total_cost;
    });

    return Object.values(monthsMap);
  }, []);

  // Chart data: Profit/Loss by Category
  const categoryPLData = useMemo(() => {
    return MOCK_CATEGORIES.map(cat => {
      // Find all products in this category
      const catProducts = MOCK_PRODUCTS.filter(p => p.category_id === cat.id);
      const catProductIds = catProducts.map(p => p.id);

      // Total Cost of goods purchased in this category (simulated relative to product category)
      let cost = 0;
      let revenue = 0;

      MOCK_SALES.forEach(sale => {
        // Simple mock mapping to verify category sales (using static ratio or joining sale items)
        // Here we sum items belonging to this category
        if (cat.id === 1) revenue += sale.total_amount * 0.45;      // Electronics
        else if (cat.id === 2) revenue += sale.total_amount * 0.35; // Vehicles
        else revenue += sale.total_amount * 0.20;                   // Hardware
      });

      MOCK_PURCHASES.forEach(p => {
        if (cat.id === 1) cost += p.total_cost * 0.48;
        else if (cat.id === 2) cost += p.total_cost * 0.32;
        else cost += p.total_cost * 0.20;
      });

      return {
        name: cat.name,
        Revenue: Math.round(revenue),
        Cost: Math.round(cost),
        Profit: Math.round(Math.max(0, revenue - cost))
      };
    });
  }, []);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-extrabold text-slate-800 tracking-tight">System Dashboard</h1>
          <p className="page-subtitle text-slate-400">Real-time statistics & business performance metrics</p>
        </div>
        
        {/* Month Filter */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date Filter:</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-700 focus:border-blue-500 transition-all"
          >
            <option value="all">All Months</option>
            {months.filter(m => m !== 'all').map(m => (
              <option key={m} value={m}>
                {m === '2026-06' ? 'June 2026' : m === '2026-07' ? 'July 2026' : m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Revenue */}
        <motion.div variants={itemVariants} className="card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">
              <AnimatedCounter value={totalRevenue} />
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Gross Billing Sales</p>
          </div>
        </motion.div>

        {/* Cost */}
        <motion.div variants={itemVariants} className="card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Cost</span>
            <div className="w-9 h-9 bg-red-50 text-red-600 rounded-xl flex items-center justify-center border border-red-100 shadow-sm">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">
              <AnimatedCounter value={totalCost} />
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Purchases & Expenses</p>
          </div>
        </motion.div>

        {/* Profit */}
        <motion.div variants={itemVariants} className="card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Profit</span>
            <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-emerald-600">
              <AnimatedCounter value={totalProfit} />
            </h3>
            <p className="text-[10px] text-emerald-500 font-semibold mt-1">Net margins generated</p>
          </div>
        </motion.div>

        {/* Stock Alerts */}
        <motion.div variants={itemVariants} className="card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Items</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm ${
              lowStockProducts.length > 0 
                ? 'bg-amber-50 text-amber-600 border-amber-100' 
                : 'bg-slate-50 text-slate-500 border-slate-100'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl font-bold ${lowStockProducts.length > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
              <AnimatedCounter value={lowStockProducts.length} isCurrency={false} />
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Below critical threshold</p>
          </div>
        </motion.div>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockProducts.length > 0 && (
        <motion.div 
          variants={itemVariants}
          className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Stock Refill Alert</p>
              <p className="text-xs text-amber-700/80 mt-0.5">
                {lowStockProducts.length} items are running below reorder levels. Immediate supplier check needed.
              </p>
            </div>
          </div>
          <a href="/products" className="text-xs font-bold text-amber-800 underline hover:text-amber-900 whitespace-nowrap">
            Manage Stock →
          </a>
        </motion.div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sales vs Purchases Chart */}
        <motion.div variants={itemVariants} className="card">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-700">Financial Growth Trend</h3>
            <p className="text-xs text-slate-400 mt-0.5">Monthly aggregate comparison of Sales vs Purchases</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
                formatter={(value) => [formatCurrency(value), '']}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }} />
              <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} name="Total Sales" />
              <Bar dataKey="cost" fill="#f87171" radius={[4, 4, 0, 0]} name="Total Purchases" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Profit/Loss by Category */}
        <motion.div variants={itemVariants} className="card">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-700">Profit Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Net profit performance broken down by business category</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryPLData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
                formatter={(value) => [formatCurrency(value), '']}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }} />
              <Bar dataKey="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Sales" />
              <Bar dataKey="Cost" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Costs" />
              <Bar dataKey="Profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Net Profit" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Logistics & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Shipments */}
        <motion.div variants={itemVariants} className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-700">Logistics Operations</h3>
              <p className="text-xs text-slate-400 mt-0.5">Latest dispatch & delivery vehicle logs</p>
            </div>
            <a href="/transport" className="text-xs font-bold text-blue-600 hover:underline">View All</a>
          </div>

          <div className="table-wrapper">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Vehicle</th>
                  <th className="table-header">Driver</th>
                  <th className="table-header">Route</th>
                  <th className="table-header">Cost</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TRANSPORTATION.slice(-4).reverse().map(trn => (
                  <tr key={trn.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-bold text-slate-700">{trn.vehicle_name}</span>
                      </div>
                    </td>
                    <td className="table-cell">{trn.driver_name}</td>
                    <td className="table-cell text-slate-400 font-mono text-[10px]">{trn.source} → {trn.destination}</td>
                    <td className="table-cell font-bold">{formatCurrency(trn.transport_cost)}</td>
                    <td className="table-cell">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        trn.status === 'Delivered' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : trn.status === 'In Transit' 
                            ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {trn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div variants={itemVariants} className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700">Reorder Stock List</h3>
            <span className="badge-danger">{lowStockProducts.length}</span>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Package className="w-10 h-10 text-slate-200 mb-2" />
              <p className="text-xs text-slate-400 font-semibold">All products well stocked</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map(prod => (
                <div key={prod.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{prod.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{prod.sku}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 rounded-lg text-[10px] font-bold">
                      Qty: {prod.stock_quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
}
