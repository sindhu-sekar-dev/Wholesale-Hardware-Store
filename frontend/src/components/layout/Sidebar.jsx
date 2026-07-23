import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, TrendingUp,
  ShoppingBag, Truck, BarChart2, Shield, LogOut, ChevronRight, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS } from '../../utils/constants';
import toast from 'react-hot-toast';

const ICONS = {
  LayoutDashboard, Package, ShoppingCart, TrendingUp,
  ShoppingBag, Truck, BarChart2
};

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Filter navigation by role
  const userRole = user?.role || 'staff';
  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40
        bg-white border-r border-slate-100
        flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Brand header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-100">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 leading-tight">HardwareHub</h1>
              <p className="text-[10px] font-semibold text-slate-400 leading-tight uppercase tracking-wider">Wholesale</p>
            </div>
          </div>
          {/* Mobile close */}
          <button onClick={onClose} className="p-1.5 hover:bg-slate-50 rounded-lg lg:hidden text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 mt-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-bold border border-blue-100">
              {user?.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.full_name}</p>
              <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5 ${
                userRole === 'admin' 
                  ? 'bg-blue-100 text-blue-700' 
                  : userRole === 'manager' 
                    ? 'bg-teal-100 text-teal-700' 
                    : 'bg-emerald-100 text-emerald-700'
              }`}>
                {userRole}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <p className="px-3 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu
          </p>

          {visibleItems.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) => `
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold
                  transition-all duration-200 cursor-pointer select-none
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }
                `}
              >
                {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                <span className="flex-1">{item.label}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            );
          })}
        </nav>

        {/* Footer logout */}
        <div className="p-4 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
