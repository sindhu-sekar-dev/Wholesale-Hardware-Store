import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, TrendingUp, ShoppingBag, 
  Package, Printer, Truck, DollarSign, Calendar 
} from 'lucide-react';
import { 
  MOCK_SALES, MOCK_PURCHASES, MOCK_PRODUCTS, 
  MOCK_TRANSPORTATION, MOCK_EXPENSES, MOCK_CATEGORIES, MOCK_SUPPLIERS, MOCK_CUSTOMERS
} from '../utils/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const TABS = [
  { key: 'sales', label: 'Sales Report', icon: TrendingUp },
  { key: 'purchase', label: 'Purchases Report', icon: ShoppingBag },
  { key: 'transport', label: 'Transportation Report', icon: Truck },
  { key: 'profit-loss', label: 'Profit & Loss Statement', icon: DollarSign }
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('sales');

  const handlePrint = () => {
    window.print();
  };

  // Helper names
  const getSupplierName = (id) => MOCK_SUPPLIERS.find(s => s.id === id)?.name || 'Supplier';
  const getCustomerName = (id) => MOCK_CUSTOMERS.find(c => c.id === id)?.name || 'Customer';
  const getProductName = (id) => MOCK_PRODUCTS.find(p => p.id === id)?.name || 'Product';

  // Export CSV Helper
  const handleExportCSV = () => {
    let headers = [];
    let rows = [];
    let filename = `${activeTab}_report.csv`;

    if (activeTab === 'sales') {
      headers = ['Invoice ID', 'Customer', 'Date', 'Amount', 'Payment Status', 'Operator'];
      rows = MOCK_SALES.map(s => [
        `INV-${s.id}`,
        getCustomerName(s.customer_id),
        s.sale_date,
        s.total_amount,
        s.payment_status,
        s.created_by
      ]);
    } else if (activeTab === 'purchase') {
      headers = ['Purchase ID', 'Supplier', 'Date', 'Total Cost', 'Payment Status', 'Operator'];
      rows = MOCK_PURCHASES.map(p => [
        `PUR-${p.id}`,
        getSupplierName(p.supplier_id),
        p.purchase_date,
        p.total_cost,
        p.payment_status,
        p.created_by
      ]);
    } else if (activeTab === 'transport') {
      headers = ['Log ID', 'Type', 'Ref ID', 'Vehicle', 'Driver', 'Route', 'Cost', 'Status'];
      rows = MOCK_TRANSPORTATION.map(t => [
        `TRN-${t.id}`,
        t.related_type,
        t.related_id,
        t.vehicle_name,
        t.driver_name,
        `${t.source} to ${t.destination}`,
        t.transport_cost,
        t.status
      ]);
    } else {
      headers = ['Category/Source', 'Sales Revenue', 'Product Cost', 'Net Margin'];
      rows = MOCK_CATEGORIES.map(cat => {
        let revenue = 0;
        let cost = 0;
        MOCK_SALES.forEach(s => {
          if (cat.id === 1) revenue += s.total_amount * 0.45;
          else if (cat.id === 2) revenue += s.total_amount * 0.35;
          else revenue += s.total_amount * 0.20;
        });
        MOCK_PURCHASES.forEach(p => {
          if (cat.id === 1) cost += p.total_cost * 0.48;
          else if (cat.id === 2) cost += p.total_cost * 0.32;
          else cost += p.total_cost * 0.20;
        });
        return [cat.name, Math.round(revenue), Math.round(cost), Math.round(revenue - cost)];
      });
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${filename} exported successfully!`);
  };

  // Stats calculation
  const totalSalesRevenue = useMemo(() => MOCK_SALES.reduce((sum, s) => sum + s.total_amount, 0), []);
  const totalPurchaseCost  = useMemo(() => MOCK_PURCHASES.reduce((sum, p) => sum + p.total_cost, 0), []);
  const totalTransportCost = useMemo(() => MOCK_TRANSPORTATION.reduce((sum, t) => sum + t.transport_cost, 0), []);
  const totalExpensesCost  = useMemo(() => MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0), []);
  const netEarnings        = totalSalesRevenue - totalPurchaseCost - totalTransportCost - totalExpensesCost;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="page-title">Accounts & Reports</h1>
          <p className="page-subtitle">Inspect sales ledgers, procurement cycles, and operating profit margins</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn-secondary">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={handlePrint} className="btn-primary">
            <Printer className="w-4 h-4" /> Print Ledger
          </button>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block mb-8 text-center border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">HARDWAREHUB WHOLESALE STORE</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Official Financial Ledger & Operations Audit Report</p>
        <p className="text-xs text-slate-400 font-semibold">Generated on: {new Date().toLocaleDateString('en-IN')}</p>
      </div>

      {/* Tabs switches */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit print:hidden">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === t.key
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Report rendering based on tab */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'sales' && (
          <div className="space-y-4">
            <div className="card grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Sales Value</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">{formatCurrency(totalSalesRevenue)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales count</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">{MOCK_SALES.length} invoices</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Ticket</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">{formatCurrency(totalSalesRevenue / MOCK_SALES.length)}</p>
              </div>
            </div>

            <div className="card p-0 overflow-hidden">
              <div className="table-wrapper">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="table-header">Invoice ID</th>
                      <th className="table-header">Customer Name</th>
                      <th className="table-header">Billing Date</th>
                      <th className="table-header">Gross Amount</th>
                      <th className="table-header">Payment Status</th>
                      <th className="table-header">Operator</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_SALES.map(s => (
                      <tr key={s.id} className="table-row">
                        <td className="table-cell font-mono font-bold text-slate-400">#INV-{s.id}</td>
                        <td className="table-cell font-bold text-slate-700">{getCustomerName(s.customer_id)}</td>
                        <td className="table-cell text-slate-400 font-semibold">{formatDate(s.sale_date)}</td>
                        <td className="table-cell font-bold text-blue-600">{formatCurrency(s.total_amount)}</td>
                        <td className="table-cell">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                            s.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {s.payment_status}
                          </span>
                        </td>
                        <td className="table-cell text-slate-400 font-semibold">{s.created_by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'purchase' && (
          <div className="space-y-4">
            <div className="card grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Procurement cost</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">{formatCurrency(totalPurchaseCost)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Purchases Count</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">{MOCK_PURCHASES.length} orders</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Order Cost</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">{formatCurrency(totalPurchaseCost / MOCK_PURCHASES.length)}</p>
              </div>
            </div>

            <div className="card p-0 overflow-hidden">
              <div className="table-wrapper">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="table-header">Purchase ID</th>
                      <th className="table-header">Supplier</th>
                      <th className="table-header">Procurement Date</th>
                      <th className="table-header">Gross Cost</th>
                      <th className="table-header">Payment Status</th>
                      <th className="table-header">Manager</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_PURCHASES.map(p => (
                      <tr key={p.id} className="table-row">
                        <td className="table-cell font-mono font-bold text-slate-400">#PUR-{p.id}</td>
                        <td className="table-cell font-bold text-slate-700">{getSupplierName(p.supplier_id)}</td>
                        <td className="table-cell text-slate-400 font-semibold">{formatDate(p.purchase_date)}</td>
                        <td className="table-cell font-bold text-red-500">{formatCurrency(p.total_cost)}</td>
                        <td className="table-cell">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                            p.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {p.payment_status}
                          </span>
                        </td>
                        <td className="table-cell text-slate-400 font-semibold">{p.created_by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="space-y-4">
            <div className="card grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Freight Expenses</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">{formatCurrency(totalTransportCost)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logistics Logs Count</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">{MOCK_TRANSPORTATION.length} runs</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Freight Cost</p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">{formatCurrency(totalTransportCost / MOCK_TRANSPORTATION.length)}</p>
              </div>
            </div>

            <div className="card p-0 overflow-hidden">
              <div className="table-wrapper">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="table-header">Log ID</th>
                      <th className="table-header">Reference</th>
                      <th className="table-header">Vehicle Details</th>
                      <th className="table-header">Driver Name</th>
                      <th className="table-header">Route (Source → Dest)</th>
                      <th className="table-header">Freight Cost</th>
                      <th className="table-header text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_TRANSPORTATION.map(t => (
                      <tr key={t.id} className="table-row">
                        <td className="table-cell font-mono font-bold text-slate-400">#TRN-{t.id}</td>
                        <td className="table-cell">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-50 text-[9px] font-bold text-slate-400">
                            {t.related_type} #{t.related_id}
                          </span>
                        </td>
                        <td className="table-cell font-bold text-slate-700">{t.vehicle_name}</td>
                        <td className="table-cell font-semibold">{t.driver_name}</td>
                        <td className="table-cell text-slate-400 font-semibold font-mono text-[10px]">{t.source} → {t.destination}</td>
                        <td className="table-cell font-bold text-slate-800">{formatCurrency(t.transport_cost)}</td>
                        <td className="table-cell text-right">
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase tracking-wider rounded-lg">
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profit-loss' && (
          <div className="space-y-6">
            {/* Financial ledger statement summary */}
            <div className="card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">(+) Total Sales Revenue</p>
                <p className="text-lg font-extrabold text-blue-600 mt-1">{formatCurrency(totalSalesRevenue)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">(-) Total Procurement cost</p>
                <p className="text-lg font-extrabold text-red-500 mt-1">{formatCurrency(totalPurchaseCost)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">(-) Freight Costs</p>
                <p className="text-lg font-extrabold text-amber-600 mt-1">{formatCurrency(totalTransportCost)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">(-) Operating Expenses</p>
                <p className="text-lg font-extrabold text-purple-600 mt-1">{formatCurrency(totalExpensesCost)}</p>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-slate-100 pl-0 sm:pl-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">(=) Net Profit Earnings</p>
                <p className={`text-xl font-black mt-1 ${netEarnings >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(netEarnings)}
                </p>
              </div>
            </div>

            {/* Operating expenses itemization */}
            <div className="card">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-700">Operating Expenses (OPEX) Itemization</h3>
                <p className="text-xs text-slate-400 mt-0.5">Recurring overheads, marketing assets, and lease agreements</p>
              </div>

              <div className="table-wrapper">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="table-header">Expense Type</th>
                      <th className="table-header">Date Logged</th>
                      <th className="table-header">Detailed Notes</th>
                      <th className="table-header text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_EXPENSES.map(exp => (
                      <tr key={exp.id} className="table-row">
                        <td className="table-cell">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                            exp.type === 'Salaries' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {exp.type}
                          </span>
                        </td>
                        <td className="table-cell text-slate-400 font-semibold">{formatDate(exp.date)}</td>
                        <td className="table-cell text-slate-400 font-semibold">{exp.notes}</td>
                        <td className="table-cell font-bold text-red-500 text-right">{formatCurrency(exp.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
