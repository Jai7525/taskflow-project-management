import React from 'react';
import { LayoutDashboard, History, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Sidebar component complying with Phase 8A guidelines.
 * Fixed desktop navigation wrapper, background color #111827, active highlight #6366F1.
 */
const Sidebar = () => {
  const navItems = [
    { id: 'workspace', name: 'Workspace', icon: LayoutDashboard, active: true },
    { id: 'activity', name: 'Activity Log', icon: History, active: false },
  ];

  return (
    <aside className="w-[240px] bg-[#111827] text-[#6B7280] flex flex-col h-screen select-none border-r border-[#1F2937] shrink-0">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#1F2937]">
        <div className="flex items-center space-x-2.5">
          <div className="h-7 w-7 bg-[#6366F1] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-[0_2px_4px_rgba(99,102,241,0.2)]">
            ⚡
          </div>
          <span className="text-base font-extrabold tracking-tight text-white font-sans">
            TaskFlow
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              whileHover={{ scale: 1.01, x: 2 }}
              key={item.id}
              disabled
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-[12px] text-sm font-semibold transition-all text-left cursor-not-allowed ${
                item.active
                  ? 'bg-[#6366F1] text-white shadow-[0_1px_2px_rgba(99,102,241,0.15)]'
                  : 'text-[#9CA3AF] hover:bg-[#1F2937] hover:text-white'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{item.name}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Profile and Logout info footer */}
      <div className="p-4 border-t border-[#1F2937] space-y-4">
        <div className="flex items-center space-x-3 px-2">
          <div className="h-9 w-9 rounded-full bg-[#1F2937] border border-[#374151] flex items-center justify-center text-[#D1D5DB]">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#F3F4F6] truncate">
              TaskFlow User
            </p>
            <p className="text-[10px] text-[#4B5563] truncate">
              user@example.com
            </p>
          </div>
        </div>

        <button
          disabled
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#1F2937] hover:bg-red-950/40 hover:text-red-400 text-[#9CA3AF] rounded-[12px] text-xs font-semibold transition cursor-not-allowed"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
