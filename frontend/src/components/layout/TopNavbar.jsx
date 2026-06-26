import React from 'react';
import { Search, Bell, Moon, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * TopNavbar conforming to Phase 8A structural constraints.
 * Sticky header housing Search bar, Notifications placeholder, and a "+ New Task" button.
 */
const TopNavbar = () => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8 select-none">
      {/* Search Input Placeholder */}
      <div className="max-w-md w-full relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-[#6B7280]" />
        </div>
        <input
          type="text"
          disabled
          placeholder="Search workspace..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#F6F8FB] border border-[#E5E7EB] rounded-[12px] text-[#111827] placeholder-[#6B7280] focus:outline-none text-sm cursor-not-allowed"
        />
      </div>

      {/* Header actions */}
      <div className="flex items-center space-x-4 shrink-0">
        {/* Dark Mode Toggle Placeholder */}
        <button
          type="button"
          disabled
          className="p-2 text-[#6B7280] hover:text-[#111827] rounded-xl cursor-not-allowed"
        >
          <Moon className="h-5 w-5" />
        </button>

        {/* Notifications Icon */}
        <button
          type="button"
          disabled
          className="p-2 text-[#6B7280] hover:text-[#111827] rounded-xl relative cursor-not-allowed"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-[#EF4444] ring-2 ring-white" />
        </button>

        <div className="h-5 w-px bg-[#E5E7EB]" />

        {/* New Task Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          disabled
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-[#6366F1] text-white rounded-[12px] text-sm font-semibold shadow-[0_1px_2px_0_rgba(99,102,241,0.1)] cursor-not-allowed opacity-80"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </motion.button>
      </div>
    </header>
  );
};

export default TopNavbar;
