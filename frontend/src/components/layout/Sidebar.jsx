import React from 'react';
import { LayoutDashboard, History, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Premium Sidebar for the Enterprise Workspace layout.
 * Features: Muted dark palette (#111827), selected indicator animations, profile view.
 */
const Sidebar = ({ isOpen, activeItem = 'workspace', onNavigate, onClose }) => {
  const navItems = [
    { id: 'workspace', name: 'Workspace', icon: LayoutDashboard },
    { id: 'activity', name: 'Activity Log', icon: History },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-400 flex flex-col h-screen select-none border-r border-slate-900 shrink-0">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-900">
        <div className="flex items-center space-x-2.5">
          <div className="h-7 w-7 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
            ⚡
          </div>
          <span className="text-base font-extrabold tracking-tight text-white font-sans">
            TaskFlow
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (onNavigate) onNavigate(item.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-left relative cursor-pointer group focus:outline-none ${
                isActive ? 'text-white' : 'hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavHighlight"
                  className="absolute inset-0 bg-brand-500 rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  style={{ zIndex: 0 }}
                />
              )}
              
              <span className="relative z-10 flex items-center space-x-3">
                <Icon className="h-4.5 w-4.5" />
                <span>{item.name}</span>
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className="p-4 border-t border-slate-900 space-y-4">
        <div className="flex items-center space-x-3 px-2">
          <div className="h-9 w-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-350">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate">
              TaskFlow User
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              user@example.com
            </p>
          </div>
        </div>

        <button
          onClick={() => {}}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-red-950/40 hover:text-red-400 text-slate-400 border border-transparent hover:border-red-950/10 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
