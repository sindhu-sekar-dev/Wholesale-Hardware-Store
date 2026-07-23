import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, ShoppingBag, DollarSign, Calendar, Users, Eye, HelpCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { MOCK_PURCHASES, MOCK_PRODUCTS, MOCK_SUPPLIERS, MOCK_PURCHASE_ITEMS } from '../utils/mockData';
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

export default function Purchases() {
  const [purchases, setPurchases] = useState(MOCK_PURCHASES);
  const [purchaseItems, setPurchaseItems] = useState(MOCK_PURCHASE_ITEMS);
  const [search, setSearch] = useState('');
  
  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(null); // { purchase, items }

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      supplier_id: 1,
      product_id: 1,
      quantity: 10,
      buying_price: '',
      payment_status: 'Paid',
      purchase_date: new Date().toISOString().split('T')[0]
    }
  });

  const getSupplierName = (id) => {
    return MOCK_SUPPLIERS.find(s => s.id === id)?.name || 'Unknown Supplier';
  };

  const getProductName = (id) => {
    return MOCK_PRODUCTS.find(p => p.id === id)?.name || 'Unknown Product';
  };

  // Filtered Purchases
  const filteredPurchases = useMemo(() => {
    let list = [...purchases].sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => 
        getSupplierName(p.supplier_id).toLowerCase().includes(q) ||
        p.id.toString().includes(q)
      );
    }
    return list;
  }, [purchases, search]);

  const pagination = usePagination(filteredPurchases);

  // Stats
  const totalCost = useMemo(() => purchases.reduce((sum, p) => sum + p.total_cost, 0), [purchases]);
  const unpaidCost = useMemo(() => {
    return purchases
      .filter(p => p.payment_status === 'Credit' || p.payment_status === 'Partial')
      .reduce((sum, p) => sum + (p.payment_status === 'Credit' ? p.total_cost : p.total_cost * 0.5), 0);
  }, [purchases]);
  
  const handleOpenAdd = () => {
    reset({
      supplier_id: 1,
      product_id: 1,
      quantity: 10,
      buying_price: MOCK_PRODUCTS[0].buying_price,
      payment_status: 'Paid',
      purchase_date: new Date().toISOString().split('T')[0]
    });
    setModalOpen(true);
  };

  const handleSave = (data) => {
    const product = MOCK_PRODUCTS.find(p => p.id === parseInt(data.product_id));
    if (!product) return;

    const qty = parseInt(data.quantity);
    const price = parseFloat(data.buying_price) || product.buying_price;
    const total = qty * price;

    const newPurchaseId = Math.max(...purchases.map(p => p.id), 0) + 1;
    const newPurchase = {
      id: newPurchaseId,
      supplier_id: parseInt(data.supplier_id),
      purchase_date: data.purchase_date,
      total_cost: total,
      payment_status: data.payment_status,
      created_by: 'Sunita Rao'
    };

    const newItemId = Math.max(...purchaseItems.map(i => i.id), 0) + 1;
    const newPurchaseItem = {
      id: newItemId,
      purchase_id: newPurchaseId,
      product_id: product.id,
      quantity: qty,
      buying_price: price,
      subtotal: total
    };

    setPurchases(prev => [newPurchase, ...prev]);
    setPurchaseItems(prev => [newPurchaseItem, ...prev]);
    
    // Auto-update stock mock action
    product.stock_quantity += qty;

    toast.success(`Purchase logged! Added ${qty} to ${product.name} stock.`);
    setModalOpen(false);
  };

  const handleOpenDetail = (p) => {
    const items = purchaseItems.filter(item => item.purchase_id === p.id);
    setDetailModal({ purchase: p, items });
  };

  const watchedProductId = watch('product_id');
  const selectedProduct = useMemo(() => {
    return MOCK_PRODUCTS.find(p => p.id === parseInt(watchedProductId)) || MOCK_PRODUCTS[0];
  }, [watchedProductId]);

  const calcSubtotal = useMemo(() => {
    const qty = parseInt(watch('quantity')) || 0;
    const price = parseFloat(watch('buying_price')) || selectedProduct?.buying_price || 0;
    return qty * price;
  }, [watch('quantity'), watch('buying_price'), selectedProduct]);

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
          <h1 className="page-title">Purchasing Management</h1>
          <p className="page-subtitle">Log new supplier dispatches and update catalog levels</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Purchase
        </button>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total spendings</p>
            <p className="text-lg font-bold text-slate-800">{formatCurrency(totalCost)}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credit Accounts</p>
            <p className="text-lg font-bold text-slate-800">{formatCurrency(unpaidCost)}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center border border-teal-100">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Suppliers</p>
            <p className="text-lg font-bold text-slate-800">{MOCK_SUPPLIERS.length} entities</p>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="card p-4 flex justify-end">
        <SearchBar onSearch={setSearch} placeholder="Search by supplier..." className="w-full md:w-72" />
      </div>

      {/* Purchases table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Purchase ID</th>
                <th className="table-header">Supplier</th>
                <th className="table-header">Purchase Date</th>
                <th className="table-header">Total Cost</th>
                <th className="table-header">Payment Status</th>
                <th className="table-header">Created By</th>
                <th className="table-header text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedData.map(p => (
                <motion.tr variants={itemVariants} key={p.id} className="table-row">
                  <td className="table-cell font-mono font-bold text-slate-400 text-[10px]">#PUR-{p.id}</td>
                  <td className="table-cell font-bold text-slate-700">{getSupplierName(p.supplier_id)}</td>
                  <td className="table-cell text-slate-400 font-semibold">{formatDate(p.purchase_date)}</td>
                  <td className="table-cell font-bold text-red-500">{formatCurrency(p.total_cost)}</td>
                  <td className="table-cell">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                      p.payment_status === 'Paid' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : p.payment_status === 'Partial'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {p.payment_status}
                    </span>
                  </td>
                  <td className="table-cell text-slate-400 font-semibold">{p.created_by}</td>
                  <td className="table-cell text-right">
                    <button 
                      onClick={() => handleOpenDetail(p)}
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

      {/* Add purchase modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log Supplier Purchase">
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Supplier</label>
              <select className="form-input" {...register('supplier_id', { required: true })}>
                {MOCK_SUPPLIERS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Purchase Date</label>
              <input type="date" className="form-input" {...register('purchase_date', { required: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Product</label>
              <select className="form-input" {...register('product_id', { required: true })}>
                {MOCK_PRODUCTS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Buying Price (₹)</label>
              <input 
                type="number" 
                step="0.01"
                className="form-input"
                placeholder={selectedProduct?.buying_price}
                {...register('buying_price')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Quantity</label>
              <input 
                type="number" 
                className="form-input"
                placeholder="10"
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
            <span className="text-xs font-bold text-slate-500">Calculated Cost Total:</span>
            <span className="text-base font-extrabold text-red-600">{formatCurrency(calcSubtotal)}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Log Purchase</button>
          </div>
        </form>
      </Modal>

      {/* Details View Modal */}
      <Modal 
        open={!!detailModal} 
        onClose={() => setDetailModal(null)} 
        title={`Purchase Details: #PUR-${detailModal?.purchase?.id}`}
      >
        {detailModal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 border-b border-slate-50 pb-3">
              <div>
                <p className="uppercase text-[10px] text-slate-400">Supplier</p>
                <p className="text-slate-800 font-bold mt-0.5">{getSupplierName(detailModal.purchase.supplier_id)}</p>
              </div>
              <div>
                <p className="uppercase text-[10px] text-slate-400">Purchase Date</p>
                <p className="text-slate-800 font-bold mt-0.5">{formatDate(detailModal.purchase.purchase_date)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="uppercase text-[10px] font-bold text-slate-400 tracking-wider">Purchase Items</p>
              {detailModal.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 text-xs">
                  <div>
                    <p className="font-bold text-slate-700">{getProductName(item.product_id)}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Qty: {item.quantity} units x {formatCurrency(item.buying_price)}</p>
                  </div>
                  <span className="font-bold text-slate-800">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-bold mt-4">
              <span className="text-slate-500">Gross Total Cost:</span>
              <span className="text-sm text-slate-800 font-extrabold">{formatCurrency(detailModal.purchase.total_cost)}</span>
            </div>
            
            <button onClick={() => setDetailModal(null)} className="w-full btn-secondary mt-2">Close Details</button>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
