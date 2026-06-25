import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, History, Settings, LogOut, User, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';

/**
 * Sidebar navigation component.
 * Displays brand logo, active navigation links, user details, and logout button.
 * Supports drawer close action for mobile toggle layout.
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

  const navItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: ROUTES.DASHBOARD,
      enabled: true,
    },
    {
      name: 'Tasks',
      icon: CheckSquare,
      path: ROUTES.DASHBOARD, // Redirects to dashboard since no list-tasks page exists yet
      enabled: true,
    },
    {
      name: 'Activity Log',
      icon: History,
      path: '#activity', // Scroll or click anchor
      enabled: true,
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '#settings',
      enabled: false, // Display only
    },
  ];

  return (
    <aside className={`w-64 bg-slate-900 text-white flex flex-col h-screen select-none border-r border-slate-800 shrink-0 ${
      isOpen ? 'relative' : ''
    }`}>
      {/* Brand Logo & Mobile Close */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-500/20">
            ⚡
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-sans">
            TaskFlow
          </span>
        </div>
        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path && !item.path.startsWith('#');
          
          if (!item.enabled) {
            return (
              <div
                key={item.name}
                className="flex items-center space-x-3 px-4 py-3 text-slate-500 rounded-lg text-sm font-medium cursor-not-allowed"
                title={`${item.name} (Display Only)`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{item.name}</span>
              </div>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => { if (onClose) onClose(); }}
              className={({ isActive: linkActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition duration-150 ${
                  isActive || linkActive
                    ? 'bg-brand-500 text-white shadow-soft-sm shadow-brand-500/10'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / User Profile & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-4">
        {/* User Card */}
        <div className="flex items-center space-x-3 px-2">
          <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700 shadow-inner">
            <User className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate font-sans">
              {user?.name || 'TaskFlow User'}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-red-950/40 hover:text-red-400 text-slate-300 hover:border-red-950/20 border border-transparent rounded-lg text-sm font-medium transition duration-150 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
