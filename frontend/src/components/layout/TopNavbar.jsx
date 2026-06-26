import React from 'react';
import { Search, Bell, Sun, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * TopNavbar refined matching locked mock.
 * Wider Search inputs, notification badges, dark mode toggle, Avatar bubble.
 */
const TopNavbar = ({ searchQuery = '', onSearchChange, onCreateTaskClick }) => {
  return (
    <header className="sticky top-0 z-35 h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8 select-none">
      
      {/* Wide Search Bar (SaaS style with Cmd+K indicator) */}
      <div className="max-w-[480px] w-full relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder="Search tasks, people, projects..."
          className="w-full pl-10 pr-12 py-2.5 bg-[#F6F8FB] border border-[#E5E7EB] rounded-[12px] text-sm text-slate-705 focus:bg-white focus:outline-none placeholder-slate-405 font-medium transition duration-150"
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <span className="text-[10px] bg-white border border-[#E5E7EB] px-1.5 py-0.5 rounded text-slate-450 font-bold">
            ⌘ K
          </span>
        </div>
      </div>

      {/* Navbar Actions */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell with Badge */}
        <button
          type="button"
          disabled
          className="p-2 text-slate-400 hover:text-slate-650 rounded-xl relative cursor-not-allowed"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-[#EF4444] text-[9px] font-bold text-white rounded-full flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        {/* Theme Toggle (Sun Icon) */}
        <button
          type="button"
          disabled
          className="p-2 text-slate-400 hover:text-slate-650 rounded-xl cursor-not-allowed"
        >
          <Sun className="h-5 w-5" />
        </button>

        {/* Create Task Button (Indigo Accented) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCreateTaskClick}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-[#6366F1] text-white rounded-[12px] text-sm font-bold shadow-[0_1px_2px_rgba(99,102,241,0.15)] cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Task</span>
        </motion.button>

        <div className="h-5 w-px bg-slate-200" />

        {/* User Profile Avatar Bubble */}
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
          alt="Avatar"
          className="h-8 w-8 rounded-full object-cover border border-slate-200"
        />
      </div>
    </header>
  );
};

export default TopNavbar;
