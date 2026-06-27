import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

/**
 * TopNavbar refined matching locked mock.
 * Wider Search inputs, initials avatar generator, and settings dropdown.
 */
const TopNavbar = ({
  searchQuery = '',
  onSearchChange,
  onSearchCommit,
  onCreateTaskClick,
  isOffline = false,
  showOfflineToast,
}) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Generate a circular initials avatar fallback
  const initials = useMemo(() => {
    if (!user || !user.name) return 'TU';
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }, [user]);

  // Accessibility: close dropdown on click outside or Escape key
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('#avatar-menu-container')) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('click', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  return (
    <header className="hidden lg:flex sticky top-0 z-40 h-16 bg-white border-b border-[#E5E7EB] items-center justify-between px-8 select-none">
      
      {/* Wide Search Bar (SaaS style with Cmd+K indicator) */}
      <div className="max-w-[500px] w-full relative">
        <label htmlFor="desktop-search-input" className="sr-only">Search tasks</label>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          id="desktop-search-input"
          name="search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // Immediately commit search, bypassing the debounce delay
              onSearchCommit && onSearchCommit(searchQuery);
              e.currentTarget.blur();
            } else if (e.key === 'Escape') {
              onSearchChange && onSearchChange('');
              onSearchCommit && onSearchCommit('');
              e.currentTarget.blur();
            }
          }}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-12 py-2.5 bg-[#F6F8FB] border border-[#E5E7EB] rounded-[12px] text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] placeholder-slate-400 font-medium transition duration-150"
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <span className="text-[10px] bg-white border border-[#E5E7EB] px-1.5 py-0.5 rounded text-slate-400 font-bold font-sans">
            /
          </span>
        </div>
      </div>

      {/* Navbar Actions */}
      <div className="flex items-center space-x-4">
        {/* Create Task Button (Indigo Accented) */}
        <button
          type="button"
          onClick={isOffline ? showOfflineToast : onCreateTaskClick}
          title={isOffline ? "Requires an internet connection" : "Create new task"}
          className={`flex items-center space-x-1.5 px-4 py-2.5 bg-[#6366F1] hover:bg-[#5053de] text-white rounded-[12px] text-sm font-bold shadow-[0_1px_2px_rgba(99,102,241,0.15)] hover:shadow-md transition-all duration-185 ease-out ${
            isOffline ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Task</span>
        </button>

        <div className="h-5 w-px bg-slate-200" />

        {/* User Profile Avatar Dropdown Menu Container */}
        <div className="relative" id="avatar-menu-container">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label="User profile settings menu"
            className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#6366F1] rounded-full p-0.5 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Avatar"
                className="h-8 w-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-[#6366F1] text-white font-bold flex items-center justify-center text-xs font-sans tracking-wide border-2 border-white shadow-sm">
                {initials}
              </div>
            )}
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                role="menu"
                aria-label="User Profile options"
                className="absolute right-0 mt-2 w-52 bg-white border border-[#E5E7EB] rounded-[16px] shadow-[0_12px_32px_rgba(15,23,42,0.12)] z-[999] overflow-hidden font-sans select-none"
              >
                {/* User Info Header (Display-only, non-clickable) */}
                <div className="p-5 flex flex-col items-start space-y-3.5">
                  {/* Avatar Initials */}
                  <div className="h-9 w-9 rounded-full bg-[#6366F1] text-white font-bold flex items-center justify-center text-xs tracking-wide shadow-sm shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0 w-full">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {user?.name || 'Jayakumar'}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-1">
                      {user?.email || 'test@test.com'}
                    </p>
                  </div>
                </div>
                
                <div className="h-px bg-[#E5E7EB]" />
                
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-2.5 px-5 py-4 bg-transparent text-slate-600 hover:text-red-600 hover:bg-[#FEF2F2] text-xs font-bold transition-colors duration-[180ms] cursor-pointer"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
