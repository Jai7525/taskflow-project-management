import React from 'react';
import { LayoutDashboard, History, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Premium Sidebar refined to match the locked visual mockup.
 * Background `#111827`, active nav `#6366F1`, profile/logout pinned to bottom.
 */
const Sidebar = () => {
  return (
    <aside className="w-[240px] bg-[#111827] flex flex-col h-screen select-none border-r border-[#1F2937] shrink-0 p-4">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-[#6366F1] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-[0_2px_8px_rgba(99,102,241,0.3)]">
            ⚡
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-white font-sans block">
              TaskFlow
            </span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
              Your Workspace
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 space-y-1">
        {/* Workspace Link */}
        <motion.button
          whileHover={{ scale: 1.01, x: 2 }}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-[#6366F1] text-white rounded-[12px] text-sm font-semibold transition cursor-pointer"
        >
          <LayoutDashboard className="h-4.5 w-4.5" />
          <span>Workspace</span>
        </motion.button>

        {/* Activity Log Link */}
        <motion.button
          whileHover={{ scale: 1.01, x: 2 }}
          className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-[#1F2937] hover:text-white rounded-[12px] text-sm font-semibold transition cursor-pointer"
        >
          <History className="h-4.5 w-4.5" />
          <span>Activity Log</span>
        </motion.button>
      </nav>

      {/* Footer Profile & Logout (Pinned to bottom) */}
      <div className="border-t border-[#1F2937] pt-4 space-y-3">
        {/* User Card */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-[#1F2937] transition cursor-pointer">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="User"
              className="h-9 w-9 rounded-full object-cover border border-[#374151]"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                Jayakumar M
              </p>
              <p className="text-[10px] text-slate-500 truncate font-medium">
                jayakumar@email.com
              </p>
            </div>
          </div>
          <span className="text-slate-500 text-[10px]">▼</span>
        </div>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-[12px] text-xs font-bold transition cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </motion.button>
      </div>
    </aside>
  );
};

export default Sidebar;
