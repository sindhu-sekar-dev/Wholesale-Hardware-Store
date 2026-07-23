import { useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS } from '../../utils/constants';

function getPageTitle(pathname) {
  const found = NAV_ITEMS.find(
    item => item.path === '/'
      ? pathname === '/'
      : pathname.startsWith(item.path)
  );
  return found?.label ?? 'HardwareHub';
}

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <header className="
      sticky top-0 z-20
      bg-white/80 backdrop-blur-md
      border-b border-slate-100
      px-6 py-4
      flex items-center justify-between gap-4
    ">
      {/* Left: Menu trigger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-slate-50 rounded-xl lg:hidden text-slate-500 focus:outline-none"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-bold text-slate-800 tracking-tight">{title}</h2>
          <p className="text-[10px] font-medium text-slate-400 hidden sm:block">Wholesale Operations Portal</p>
        </div>
      </div>

      {/* Right: Notification & User Profile Info */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="p-2 hover:bg-slate-50 rounded-xl relative text-slate-400 hover:text-slate-600 focus:outline-none">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
        </button>

        {/* User Card info */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-bold border border-blue-100 shadow-sm">
            {user?.full_name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-700 leading-tight">{user?.full_name}</p>
            <p className="text-[9px] font-semibold text-slate-400 capitalize mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
