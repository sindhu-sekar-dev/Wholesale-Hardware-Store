import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Truck, MapPin, DollarSign, Calendar, Clock, Navigation } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { MOCK_TRANSPORTATION } from '../utils/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';
import { DELIVERY_PARTNERS, TRANSPORT_STATUSES } from '../utils/constants';
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

export default function Transport() {
  const [shipments, setShipments] = useState(MOCK_TRANSPORTATION);
  const [search, setSearch] = useState('');
  
  // Modals
  const [modalOpen, setModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      related_type: 'Sale',
      related_id: 1,
      vehicle_name: 'Tata Ace',
      driver_name: '',
      source: 'Warehouse A',
      destination: '',
      dispatch_date: new Date().toISOString().split('T')[0],
      delivery_date: '',
      transport_cost: '',
      status: 'Dispatched'
    }
  });

  // Filtered shipments
  const filteredShipments = useMemo(() => {
    let list = [...shipments].sort((a, b) => new Date(b.dispatch_date) - new Date(a.dispatch_date));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => 
        s.driver_name.toLowerCase().includes(q) ||
        s.vehicle_name.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q)
      );
    }
    return list;
  }, [shipments, search]);

  const pagination = usePagination(filteredShipments);

  // Summary Metrics
  const totalCost = useMemo(() => shipments.reduce((sum, s) => sum + s.transport_cost, 0), [shipments]);
  const activeDispatches = useMemo(() => {
    return shipments.filter(s => s.status !== 'Delivered' && s.status !== 'Returned').length;
  }, [shipments]);

  const handleOpenAdd = () => {
    reset({
      related_type: 'Sale',
      related_id: 1,
      vehicle_name: 'Tata Ace',
      driver_name: '',
      source: 'Warehouse A',
      destination: '',
      dispatch_date: new Date().toISOString().split('T')[0],
      delivery_date: '',
      transport_cost: '',
      status: 'Dispatched'
    });
    setModalOpen(true);
  };

  const handleSave = (data) => {
    const newId = Math.max(...shipments.map(s => s.id), 0) + 1;
    const newShipment = {
      id: newId,
      related_type: data.related_type,
      related_id: parseInt(data.related_id),
      vehicle_name: data.vehicle_name,
      driver_name: data.driver_name,
      source: data.source,
      destination: data.destination,
      dispatch_date: data.dispatch_date,
      delivery_date: data.delivery_date || null,
      transport_cost: parseFloat(data.transport_cost) || 0,
      status: data.status
    };

    setShipments(prev => [newShipment, ...prev]);
    toast.success(`Transportation shipment logged for driver ${data.driver_name}!`);
    setModalOpen(false);
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
          <h1 className="page-title">Transportation & Logistics</h1>
          <p className="page-subtitle">Assign delivery partners, drivers, and record freight expenses</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Shipment
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accumulated Freight Costs</p>
            <p className="text-lg font-bold text-slate-800">{formatCurrency(totalCost)}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Shipments</p>
            <p className="text-lg font-bold text-slate-800">{activeDispatches} transits</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivered Orders</p>
            <p className="text-lg font-bold text-slate-800">{shipments.filter(s => s.status === 'Delivered').length} deliveries</p>
          </div>
        </div>
      </div>

      {/* Filter search */}
      <div className="card p-4 flex justify-end">
        <SearchBar onSearch={setSearch} placeholder="Search by driver, vehicle or destination..." className="w-full md:w-72" />
      </div>

      {/* Shipment log table */}
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
                <th className="table-header">Dispatch Date</th>
                <th className="table-header">Freight Cost</th>
                <th className="table-header text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedData.map(s => (
                <motion.tr variants={itemVariants} key={s.id} className="table-row">
                  <td className="table-cell font-mono font-bold text-slate-400 text-[10px]">#TRN-{s.id}</td>
                  <td className="table-cell">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-50 text-[9px] font-bold text-slate-500 border border-slate-200/50">
                      {s.related_type} #{s.related_id}
                    </span>
                  </td>
                  <td className="table-cell font-bold text-slate-700">{s.vehicle_name}</td>
                  <td className="table-cell font-semibold">{s.driver_name}</td>
                  <td className="table-cell text-slate-400 font-semibold font-mono text-[10px] max-w-[180px] truncate">
                    {s.source} → {s.destination}
                  </td>
                  <td className="table-cell text-slate-400 font-semibold">{formatDate(s.dispatch_date)}</td>
                  <td className="table-cell font-bold text-slate-800">{formatCurrency(s.transport_cost)}</td>
                  <td className="table-cell text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      s.status === 'Delivered' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : s.status === 'In Transit'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : s.status === 'Returned'
                            ? 'bg-red-50 text-red-700 border border-red-100'
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {s.status}
                    </span>
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

      {/* Add shipment modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log Transport Dispatch">
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Reference Type</label>
              <select className="form-input" {...register('related_type')}>
                <option value="Sale">Sale Order</option>
                <option value="Purchase">Purchase Order</option>
              </select>
            </div>
            <div>
              <label className="form-label">Reference ID</label>
              <input 
                type="number" 
                className="form-input"
                placeholder="e.g. 1"
                {...register('related_id', { required: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Vehicle Description</label>
              <input 
                type="text" 
                className={`form-input ${errors.vehicle_name ? 'border-red-400' : ''}`}
                placeholder="e.g. Mahindra Pickup"
                {...register('vehicle_name', { required: true })}
              />
            </div>
            <div>
              <label className="form-label">Driver Full Name</label>
              <input 
                type="text" 
                className={`form-input ${errors.driver_name ? 'border-red-400' : ''}`}
                placeholder="e.g. Satnam Singh"
                {...register('driver_name', { required: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Source Location</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="Warehouse A"
                {...register('source', { required: true })}
              />
            </div>
            <div>
              <label className="form-label">Destination Location</label>
              <input 
                type="text" 
                className={`form-input ${errors.destination ? 'border-red-400' : ''}`}
                placeholder="e.g. Electra Mall Mumbai"
                {...register('destination', { required: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Dispatch Date</label>
              <input type="date" className="form-input" {...register('dispatch_date', { required: true })} />
            </div>
            <div>
              <label className="form-label">Delivery Date (Optional)</label>
              <input type="date" className="form-input" {...register('delivery_date')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Freight Cost (₹)</label>
              <input 
                type="number" 
                step="0.01"
                className={`form-input ${errors.transport_cost ? 'border-red-400' : ''}`}
                placeholder="0.00"
                {...register('transport_cost', { required: true, min: 0 })}
              />
            </div>
            <div>
              <label className="form-label">Shipment Status</label>
              <select className="form-input" {...register('status')}>
                {TRANSPORT_STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.value}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Log Shipment</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
