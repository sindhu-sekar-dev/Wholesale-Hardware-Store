import { useState, useMemo } from 'react';
import { Plus, ShoppingCart, Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Badge, { statusColor } from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';
import { usePagination } from '../hooks/usePagination';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ORDER_STATUSES } from '../utils/constants';
import { MOCK_ORDERS, MOCK_PRODUCTS } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [statusModal, setStatusModal] = useState(null); // { order }

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const { register: regStatus, handleSubmit: handleStatusSubmit } = useForm();

  // Filter
  const filtered = useMemo(() => {
    let list = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.product_name.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, search, statusFilter]);

  const pagination = usePagination(filtered);

  // Place new order
  const openPlaceOrder = () => {
    reset({ product_id: MOCK_PRODUCTS[0].id, quantity: 1 });
    setModalOpen(true);
  };

  const onPlaceOrder = (data) => {
    const product = MOCK_PRODUCTS.find(p => p.id === data.product_id);
    if (!product) return;
    const qty = +data.quantity;
    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      product_id: product.id,
      product_name: product.name,
      user_id: 'U002',
      customer_name: 'Priya Patel',
      quantity: qty,
      status: 'Pending',
      total_amount: product.price * qty,
      created_at: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    toast.success('Order placed successfully!');
    setModalOpen(false);
  };

  // Update order status (admin only)
  const onUpdateStatus = (data) => {
    setOrders(prev =>
      prev.map(o => o.id === statusModal.id ? { ...o, status: data.status } : o)
    );
    toast.success('Order status updated');
    setStatusModal(null);
  };

  const selectedProductId = watch('product_id');
  const selectedProduct = MOCK_PRODUCTS.find(p => p.id === selectedProductId);

  // Summary counts
  const counts = ORDER_STATUSES.reduce((acc, s) => {
    acc[s.value] = orders.filter(o => o.status === s.value).length;
    return acc;
  }, {});

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">{orders.length} total orders</p>
        </div>
        <button onClick={openPlaceOrder} className="btn-primary">
          <Plus className="w-4 h-4" /> Place Order
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {ORDER_STATUSES.map(s => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(statusFilter === s.value ? 'all' : s.value)}
            className={`card p-3 text-left transition-all hover:-translate-y-0.5 ${
              statusFilter === s.value ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            <p className="text-xl font-bold text-gray-900 dark:text-white">{counts[s.value] || 0}</p>
            <Badge color={s.color} className="mt-1">{s.value}</Badge>
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              statusFilter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
            }`}
          >All</button>
          {ORDER_STATUSES.map(s => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                statusFilter === s.value ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
              }`}
            >{s.value}</button>
          ))}
        </div>
        <SearchBar onSearch={setSearch} placeholder="Search orders…" className="w-full sm:w-64" />
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Order ID</th>
                <th className="table-header">Product</th>
                <th className="table-header">Customer</th>
                <th className="table-header">Qty</th>
                <th className="table-header">Total</th>
                <th className="table-header">Status</th>
                <th className="table-header">Date</th>
                {isAdmin && <th className="table-header text-right">Action</th>}
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">No orders found</p>
                  </td>
                </tr>
              ) : (
                pagination.paginatedData.map(order => (
                  <tr key={order.id} className="table-row">
                    <td className="table-cell font-mono text-xs text-primary-600 dark:text-primary-400 font-semibold">{order.id}</td>
                    <td className="table-cell font-medium text-gray-900 dark:text-white max-w-[180px]">
                      <p className="truncate">{order.product_name}</p>
                    </td>
                    <td className="table-cell text-gray-500 dark:text-gray-400">{order.customer_name}</td>
                    <td className="table-cell text-gray-700 dark:text-gray-300">{order.quantity}</td>
                    <td className="table-cell font-semibold text-gray-900 dark:text-white">{formatCurrency(order.total_amount)}</td>
                    <td className="table-cell"><Badge color={statusColor(order.status)}>{order.status}</Badge></td>
                    <td className="table-cell text-gray-400 text-xs">{formatDate(order.created_at)}</td>
                    {isAdmin && (
                      <td className="table-cell text-right">
                        <button
                          onClick={() => setStatusModal(order)}
                          className="btn-ghost p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 pb-4">
          <Pagination {...pagination} onPrev={pagination.prev} onNext={pagination.next} onGoTo={pagination.goTo} />
        </div>
      </div>

      {/* Place Order Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Place New Order">
        <form onSubmit={handleSubmit(onPlaceOrder)} className="space-y-4">
          <div>
            <label className="form-label">Select Product *</label>
            <select className="form-input" {...register('product_id', { required: true })}>
              {MOCK_PRODUCTS.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock_qty})</option>
              ))}
            </select>
          </div>
          {selectedProduct && (
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-sm">
              <p className="text-primary-700 dark:text-primary-300 font-medium">{selectedProduct.name}</p>
              <p className="text-primary-500 text-xs mt-0.5">Price: {formatCurrency(selectedProduct.price)} · Stock: {selectedProduct.stock_qty}</p>
            </div>
          )}
          <div>
            <label className="form-label">Quantity *</label>
            <input type="number" min="1" className={`form-input ${errors.quantity ? 'border-red-400' : ''}`}
              {...register('quantity', { required: true, min: 1 })} />
          </div>
          {selectedProduct && watch('quantity') > 0 && (
            <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl text-sm flex justify-between">
              <span className="text-gray-500">Estimated Total</span>
              <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(selectedProduct.price * +watch('quantity'))}</span>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Place Order</button>
          </div>
        </form>
      </Modal>

      {/* Update Status Modal (Admin) */}
      <Modal open={!!statusModal} onClose={() => setStatusModal(null)} title="Update Order Status" size="sm">
        {statusModal && (
          <form onSubmit={handleStatusSubmit(onUpdateStatus)} className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl text-sm">
              <p className="font-medium text-gray-900 dark:text-white">{statusModal.product_name}</p>
              <p className="text-gray-400 text-xs">{statusModal.id}</p>
            </div>
            <div>
              <label className="form-label">New Status</label>
              <select className="form-input" defaultValue={statusModal.status}
                {...regStatus('status', { required: true })}>
                {ORDER_STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.value}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStatusModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1">Update Status</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
