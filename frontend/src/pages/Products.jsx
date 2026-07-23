import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Package, AlertCircle, FileSearch, HelpCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_SUPPLIERS } from '../utils/mockData';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
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

export default function Products() {
  const { user } = useAuth();
  const isReadOnly = user?.role === 'staff';

  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Category name helper
  const getCategoryName = (id) => {
    return MOCK_CATEGORIES.find(c => c.id === id)?.name || 'Other';
  };

  // Supplier name helper
  const getSupplierName = (id) => {
    return MOCK_SUPPLIERS.find(s => s.id === id)?.name || 'Unknown Supplier';
  };

  // Filtered list
  const filteredProducts = useMemo(() => {
    let list = products;
    if (catFilter !== 'all') {
      list = list.filter(p => p.category_id === parseInt(catFilter));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, search, catFilter]);

  const pagination = usePagination(filteredProducts);

  const handleOpenAdd = () => {
    if (isReadOnly) return;
    setEditProduct(null);
    reset({
      name: '',
      category_id: 1,
      sku: `SKU-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      unit_price: '',
      buying_price: '',
      stock_quantity: 0,
      reorder_level: 10,
      supplier_id: 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    if (isReadOnly) return;
    setEditProduct(prod);
    reset(prod);
    setModalOpen(true);
  };

  const handleSave = (data) => {
    const formatted = {
      ...data,
      category_id: parseInt(data.category_id),
      supplier_id: parseInt(data.supplier_id),
      unit_price: parseFloat(data.unit_price),
      buying_price: parseFloat(data.buying_price),
      stock_quantity: parseInt(data.stock_quantity),
      reorder_level: parseInt(data.reorder_level)
    };

    if (editProduct) {
      setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...formatted } : p));
      toast.success('Product updated successfully!');
    } else {
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      setProducts(prev => [{ id: newId, ...formatted }, ...prev]);
      toast.success('New product created!');
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600));
    setProducts(prev => prev.filter(p => p.id !== deleteProduct.id));
    toast.success('Product deleted.');
    setDeleteLoading(false);
    setDeleteProduct(null);
  };

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
          <h1 className="page-title">Products Inventory</h1>
          <p className="page-subtitle">Track, filter, and manage items in your catalog</p>
        </div>
        {!isReadOnly && (
          <button onClick={handleOpenAdd} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        )}
      </div>

      {/* Filter panel */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setCatFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              catFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Products
          </button>
          {MOCK_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCatFilter(cat.id.toString())}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                catFilter === cat.id.toString()
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <SearchBar onSearch={setSearch} placeholder="Search by name or SKU..." className="w-full md:w-72" />
      </div>

      {/* Inventory Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">SKU</th>
                <th className="table-header">Product Details</th>
                <th className="table-header">Category</th>
                <th className="table-header">Unit Price (Sell)</th>
                <th className="table-header">Buying Price (Cost)</th>
                <th className="table-header">Available Stock</th>
                <th className="table-header">Supplier</th>
                {!isReadOnly && <th className="table-header text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <FileSearch className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                    <p className="text-xs font-semibold">No items match your search filters.</p>
                  </td>
                </tr>
              ) : (
                pagination.paginatedData.map(product => {
                  const isLowStock = product.stock_quantity <= product.reorder_level;
                  return (
                    <motion.tr 
                      variants={itemVariants}
                      key={product.id} 
                      className="table-row"
                    >
                      <td className="table-cell font-mono font-bold text-slate-400 text-[10px]">
                        {product.sku}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-slate-400" />
                          <span className="font-bold text-slate-700">{product.name}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-50 text-[10px] font-bold text-slate-500 border border-slate-200/50">
                          {getCategoryName(product.category_id)}
                        </span>
                      </td>
                      <td className="table-cell font-bold text-slate-800">
                        {formatCurrency(product.unit_price)}
                      </td>
                      <td className="table-cell text-slate-400 font-semibold">
                        {formatCurrency(product.buying_price)}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold px-2 py-0.5 rounded-lg text-[10px] ${
                            product.stock_quantity === 0
                              ? 'bg-red-50 text-red-600 border border-red-100'
                              : isLowStock
                                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                : 'bg-slate-50 text-slate-600 border border-slate-200/50'
                          }`}>
                            {product.stock_quantity} units
                          </span>
                          {isLowStock && (
                            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wide flex items-center gap-0.5">
                              <AlertCircle className="w-3 h-3" /> Reorder
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="table-cell text-xs text-slate-400 font-semibold truncate max-w-[150px]">
                        {getSupplierName(product.supplier_id)}
                      </td>
                      {!isReadOnly && (
                        <td className="table-cell text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => handleOpenEdit(product)}
                              className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => setDeleteProduct(product)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-50">
          <Pagination {...pagination} onPrev={pagination.prev} onNext={pagination.next} onGoTo={pagination.goTo} />
        </div>
      </div>

      {/* Edit / Add Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editProduct ? 'Edit Catalog Product' : 'Add Catalog Product'}
      >
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <div>
            <label className="form-label">Product Name</label>
            <input 
              type="text" 
              className={`form-input ${errors.name ? 'border-red-400' : ''}`}
              placeholder="e.g. 5V Relay Block"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <span className="text-[10px] text-red-500 font-semibold">{errors.name.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Category</label>
              <select className="form-input" {...register('category_id', { required: true })}>
                {MOCK_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">SKU Code</label>
              <input 
                type="text" 
                className="form-input bg-slate-100 text-slate-400 font-mono text-xs" 
                readOnly 
                {...register('sku')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Cost Price (Buying, ₹)</label>
              <input 
                type="number" 
                step="0.01"
                className={`form-input ${errors.buying_price ? 'border-red-400' : ''}`}
                placeholder="0.00"
                {...register('buying_price', { required: 'Cost price is required', min: 0 })}
              />
              {errors.buying_price && <span className="text-[10px] text-red-500 font-semibold">Invalid</span>}
            </div>
            <div>
              <label className="form-label">Selling Price (Unit, ₹)</label>
              <input 
                type="number" 
                step="0.01"
                className={`form-input ${errors.unit_price ? 'border-red-400' : ''}`}
                placeholder="0.00"
                {...register('unit_price', { required: 'Unit price is required', min: 0 })}
              />
              {errors.unit_price && <span className="text-[10px] text-red-500 font-semibold">Invalid</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Stock Quantity</label>
              <input 
                type="number" 
                className="form-input"
                placeholder="0"
                {...register('stock_quantity', { min: 0 })}
              />
            </div>
            <div>
              <label className="form-label">Reorder Warning Level</label>
              <input 
                type="number" 
                className="form-input"
                placeholder="10"
                {...register('reorder_level', { min: 0 })}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Primary Supplier</label>
            <select className="form-input" {...register('supplier_id')}>
              {MOCK_SUPPLIERS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{editProduct ? 'Update Product' : 'Create Product'}</button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Catalog Product?"
        message={`This will permanently remove "${deleteProduct?.name}" and SKU: "${deleteProduct?.sku}" from system databases.`}
      />
    </motion.div>
  );
}
