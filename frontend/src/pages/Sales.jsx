import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, DollarSign, Calendar, Users, Eye, Printer, X, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { MOCK_SALES, MOCK_PRODUCTS, MOCK_CUSTOMERS, MOCK_SALE_ITEMS } from '../utils/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import { usePagination } from '../hooks/usePagination';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

export default function Sales() {
  const [sales, setSales] = useState(MOCK_SALES);
  const [saleItems, setSaleItems] = useState(MOCK_SALE_ITEMS);
  const [search, setSearch] = useState('');
  
  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(null); // { sale, items }

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      customer_id: 1,
      product_id: 1,
      quantity: 5,
      selling_price: '',
      payment_status: 'Paid',
      sale_date: new Date().toISOString().split('T')[0]
    }
  });

  const getCustomerName = (id) => {
    return MOCK_CUSTOMERS.find(c => c.id === id)?.name || 'Walk-in Customer';
  };

  const getCustomerContact = (id) => {
    return MOCK_CUSTOMERS.find(c => c.id === id)?.contact || '';
  };

  const getCustomerAddress = (id) => {
    return MOCK_CUSTOMERS.find(c => c.id === id)?.address || '';
  };

  const getProductName = (id) => {
    return MOCK_PRODUCTS.find(p => p.id === id)?.name || 'Unknown Item';
  };

  const getProductSku = (id) => {
    return MOCK_PRODUCTS.find(p => p.id === id)?.sku || '';
  };

  // Filtered Sales
  const filteredSales = useMemo(() => {
    let list = [...sales].sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => 
        getCustomerName(s.customer_id).toLowerCase().includes(q) ||
        s.id.toString().includes(q)
      );
    }
    return list;
  }, [sales, search]);

  const pagination = usePagination(filteredSales);

  // Summary Metrics
  const totalRevenue = useMemo(() => sales.reduce((sum, s) => sum + s.total_amount, 0), [sales]);
  const grossProfit = useMemo(() => {
    return saleItems.reduce((sum, item) => {
      const product = MOCK_PRODUCTS.find(p => p.id === item.product_id);
      const cost = product ? product.buying_price : 0;
      return sum + ((item.selling_price - cost) * item.quantity);
    }, 0);
  }, [saleItems]);

  const handleOpenAdd = () => {
    reset({
      customer_id: 1,
      product_id: 1,
      quantity: 5,
      selling_price: MOCK_PRODUCTS[0].unit_price,
      payment_status: 'Paid',
      sale_date: new Date().toISOString().split('T')[0]
    });
    setModalOpen(true);
  };

  const handleSave = (data) => {
    const product = MOCK_PRODUCTS.find(p => p.id === parseInt(data.product_id));
    if (!product) return;

    const qty = parseInt(data.quantity);
    if (product.stock_quantity < qty) {
      toast.error(`Out of stock! Only ${product.stock_quantity} units available.`);
      return;
    }

    const price = parseFloat(data.selling_price) || product.unit_price;
    const total = qty * price;

    const newSaleId = Math.max(...sales.map(s => s.id), 0) + 1;
    const newSale = {
      id: newSaleId,
      customer_id: parseInt(data.customer_id),
      sale_date: data.sale_date,
      total_amount: total,
      payment_status: data.payment_status,
      created_by: 'Vikram Patel'
    };

    const newItemId = Math.max(...saleItems.map(i => i.id), 0) + 1;
    const newSaleItem = {
      id: newItemId,
      sale_id: newSaleId,
      product_id: product.id,
      quantity: qty,
      selling_price: price,
      subtotal: total
    };

    setSales(prev => [newSale, ...prev]);
    setSaleItems(prev => [newSaleItem, ...prev]);
    
    // Auto-update stock mock action
    product.stock_quantity -= qty;

    toast.success(`Billing completed! Recorded sale for ${product.name}.`);
    setModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenInvoice = (s) => {
    const items = saleItems.filter(item => item.sale_id === s.id);
    setInvoiceModal({ sale: s, items });
  };

  const watchedProductId = watch('product_id');
  const selectedProduct = useMemo(() => {
    return MOCK_PRODUCTS.find(p => p.id === parseInt(watchedProductId)) || MOCK_PRODUCTS[0];
  }, [watchedProductId]);

  const calcSubtotal = useMemo(() => {
    const qty = parseInt(watch('quantity')) || 0;
    const price = parseFloat(watch('selling_price')) || selectedProduct?.unit_price || 0;
    return qty * price;
  }, [watch('quantity'), watch('selling_price'), selectedProduct]);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Sales Registry</h1>
          <p className="page-subtitle">Billing operations, invoice dispatch, and payment tracking</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> Record Sale
        </button>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Billing Sales</p>
            <p className="text-lg font-bold text-slate-800">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accumulated Margins</p>
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(grossProfit)}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Customers</p>
            <p className="text-lg font-bold text-slate-800">{MOCK_CUSTOMERS.length} buyers</p>
          </div>
        </div>
      </div>

      {/* Search Bar Filter */}
      <div className="card p-4 flex justify-end">
        <SearchBar onSearch={setSearch} placeholder="Search by customer name..." className="w-full md:w-72" />
      </div>

      {/* Sales Grid Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Invoice ID</th>
                <th className="table-header">Customer Name</th>
                <th className="table-header">Billing Date</th>
                <th className="table-header">Total Amount</th>
                <th className="table-header">Payment Status</th>
                <th className="table-header">Issued By</th>
                <th className="table-header text-right">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedData.map(s => (
                <motion.tr variants={itemVariants} key={s.id} className="table-row">
                  <td className="table-cell font-mono font-bold text-slate-400 text-[10px]">#INV-{s.id}</td>
                  <td className="table-cell font-bold text-slate-700">{getCustomerName(s.customer_id)}</td>
                  <td className="table-cell text-slate-400 font-semibold">{formatDate(s.sale_date)}</td>
                  <td className="table-cell font-bold text-blue-600">{formatCurrency(s.total_amount)}</td>
                  <td className="table-cell">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                      s.payment_status === 'Paid' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : s.payment_status === 'Partial'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {s.payment_status}
                    </span>
                  </td>
                  <td className="table-cell text-slate-400 font-semibold">{s.created_by}</td>
                  <td className="table-cell text-right">
                    <button 
                      onClick={() => handleOpenInvoice(s)}
                      className="p-1 hover:bg-slate-50 rounded-lg text-blue-500 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-50">
          <Pagination {...pagination} onPrev={pagination.prev} onNext={pagination.next} onGoTo={pagination.goTo} />
        </div>
      </div>

      {/* Record Sale Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Record Sales Billing">
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Customer</label>
              <select className="form-input" {...register('customer_id', { required: true })}>
                {MOCK_CUSTOMERS.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Sale Date</label>
              <input type="date" className="form-input" {...register('sale_date', { required: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Product</label>
              <select className="form-input" {...register('product_id', { required: true })}>
                {MOCK_PRODUCTS.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock_quantity})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Selling Price (₹)</label>
              <input 
                type="number" 
                step="0.01"
                className="form-input"
                placeholder={selectedProduct?.unit_price}
                {...register('selling_price')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Quantity</label>
              <input 
                type="number" 
                className="form-input"
                placeholder="5"
                {...register('quantity', { required: true, min: 1 })}
              />
            </div>
            <div>
              <label className="form-label">Payment Status</label>
              <select className="form-input" {...register('payment_status', { required: true })}>
                <option value="Paid">Paid</option>
                <option value="Credit">Credit</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Subtotal Amount:</span>
            <span className="text-base font-extrabold text-blue-600">{formatCurrency(calcSubtotal)}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Complete Billing</button>
          </div>
        </form>
      </Modal>

      {/* Invoice Details Modal */}
      <Modal open={!!invoiceModal} onClose={() => setInvoiceModal(null)} title="Invoice Details" size="lg">
        {invoiceModal && (
          <div className="space-y-6 print:p-6" id="printable-invoice">
            {/* Header branding */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">HARDWAREHUB WHOLESALE</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">VAT Reg No: IN893748293</p>
                <p className="text-[10px] text-slate-400 font-semibold">Warehouse Block A, Industrial Plaza</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 uppercase tracking-wider">
                  Invoice
                </span>
                <p className="text-xs font-mono font-bold text-slate-500 mt-2">#INV-{invoiceModal.sale.id}</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Date: {formatDate(invoiceModal.sale.sale_date)}</p>
              </div>
            </div>

            {/* Bill to */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="uppercase text-[9px] font-bold text-slate-400 tracking-wide">Client Details</p>
                <p className="font-extrabold text-slate-800 mt-1">{getCustomerName(invoiceModal.sale.customer_id)}</p>
                <p className="text-slate-500 font-semibold mt-0.5">Contact: {getCustomerContact(invoiceModal.sale.customer_id)}</p>
                <p className="text-slate-500 font-semibold mt-0.5">{getCustomerAddress(invoiceModal.sale.customer_id)}</p>
              </div>
              <div className="text-right">
                <p className="uppercase text-[9px] font-bold text-slate-400 tracking-wide">Summary</p>
                <p className="text-slate-500 mt-1 font-semibold">Payment Status: <span className="font-bold text-slate-700">{invoiceModal.sale.payment_status}</span></p>
                <p className="text-slate-500 font-semibold mt-0.5">Operator: <span className="font-bold text-slate-700">{invoiceModal.sale.created_by}</span></p>
              </div>
            </div>

            {/* Items details table */}
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2.5 text-left text-[9px] font-bold text-slate-400 uppercase">Item Description</th>
                    <th className="px-4 py-2.5 text-left text-[9px] font-bold text-slate-400 uppercase">SKU</th>
                    <th className="px-4 py-2.5 text-right text-[9px] font-bold text-slate-400 uppercase">Qty</th>
                    <th className="px-4 py-2.5 text-right text-[9px] font-bold text-slate-400 uppercase">Unit Price</th>
                    <th className="px-4 py-2.5 text-right text-[9px] font-bold text-slate-400 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceModal.items.map((item, idx) => (
                    <tr key={idx} className="border-t border-slate-50 text-xs">
                      <td className="px-4 py-3 font-bold text-slate-700">{getProductName(item.product_id)}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-slate-400">{getProductSku(item.product_id)}</td>
                      <td className="px-4 py-3 text-right text-slate-600 font-semibold">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-slate-500">{formatCurrency(item.selling_price)}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total summary */}
            <div className="flex justify-end pt-2">
              <div className="w-full sm:w-64 bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-center text-xs font-bold">
                <span className="text-slate-500">Gross Total Amount:</span>
                <span className="text-sm font-extrabold text-blue-600">{formatCurrency(invoiceModal.sale.total_amount)}</span>
              </div>
            </div>

            {/* Print action buttons */}
            <div className="flex gap-3 print:hidden pt-4 border-t border-slate-50">
              <button 
                type="button" 
                onClick={handlePrint}
                className="btn-success flex-1"
              >
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
              <button 
                type="button" 
                onClick={() => setInvoiceModal(null)}
                className="btn-secondary flex-1"
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
