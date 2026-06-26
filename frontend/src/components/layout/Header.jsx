import React from 'react';
import { Search, Bell, Moon, Plus, Menu, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Top Navbar conforming toLocked UI guidelines.
 * Displays: Search, Notifications, Dark Mode (mock), Create Task button, and User Profile.
 */
const Header = ({ searchQuery, onSearchChange, onMenuClick, onCreateTaskClick }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 select-none">
      {/* Left: Mobile hamburger menu */}
      <div className="flex items-center space-x-3 mr-2 lg:hidden">
        <button
          onClick={onMenuClick}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-bold text-slate-800 text-base font-sans">
          TaskFlow
        </span>
      </div>

      {/* Middle: Live search bar (SaaS style, large, clean input) */}
      <div className="max-w-md w-full relative flex-1 mx-2 lg:mx-0">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100/30 focus:bg-white rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-150 text-sm"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3 ml-2 shrink-0">
        {/* Dark Mode Mock Toggle */}
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition cursor-pointer"
          title="Toggle Theme (UI Only)"
        >
          <Moon className="h-5 w-5" />
        </button>

        {/* Notifications Mock */}
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition relative cursor-pointer"
          title="Notifications (UI Only)"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-danger-500 ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="hidden sm:block h-5 w-px bg-slate-200" />

        {/* Create Task Button */}
        <button
          onClick={onCreateTaskClick}
          className="flex items-center space-x-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-soft-sm shadow-brand-500/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create Task</span>
        </button>

        {/* User Avatar */}
        <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs select-none">
          {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4 text-slate-400" />}
        </div>
      </div>
    </header>
  );
};

export default Header;
