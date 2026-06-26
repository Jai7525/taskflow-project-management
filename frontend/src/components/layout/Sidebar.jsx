import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';

/**
 * Sidebar navigation component complying with the Locked Workspace layout.
 * Shows Brand logo, "Workspace" navigation, "Activity Log" navigation, and Profile details.
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
    if (onClose) onClose();
  };

  const handleNavClick = (path) => {
    if (path.startsWith('#')) {
      const element = document.getElementById(path.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen select-none border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-850 justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="h-7 w-7 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-brand-500/10">
            ⚡
          </div>
          <span className="text-base font-extrabold tracking-tight text-white font-sans">
            TaskFlow
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <button
          onClick={() => handleNavClick(ROUTES.DASHBOARD)}
          className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-left cursor-pointer ${
            location.pathname === ROUTES.DASHBOARD
              ? 'bg-brand-600 text-white shadow-soft-sm'
              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="h-4.5 w-4.5" />
          <span>Workspace</span>
        </button>

        <button
          onClick={() => handleNavClick('#activity')}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-all duration-150 text-left cursor-pointer"
        >
          <History className="h-4.5 w-4.5" />
          <span>Activity Log</span>
        </button>
      </nav>

      {/* User profile & Logout */}
      <div className="p-4 border-t border-slate-850 space-y-4">
        {/* User Card */}
        <div className="flex items-center space-x-3 px-2">
          <div className="h-9 w-9 rounded-full bg-slate-805 border border-slate-800 flex items-center justify-center text-slate-300">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate">
              {user?.name || 'TaskFlow User'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-red-950/40 hover:text-red-400 text-slate-400 border border-transparent hover:border-red-950/10 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
