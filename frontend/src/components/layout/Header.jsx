import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Moon, Plus } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

/**
 * Header component featuring search filters, dark-mode/notifications mock UI, and action buttons.
 */
const Header = ({ searchQuery, onSearchChange }) => {
  const navigate = useNavigate();

  const handleAddTaskClick = () => {
    navigate(ROUTES.ADD_TASK);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30 select-none">
      {/* Search Bar */}
      <div className="max-w-md w-full relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4.5 w-4.5 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks by title..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-150 text-sm"
        />
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Mock Toggle */}
        <button
          type="button"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition"
          title="Toggle Theme (UI Only)"
        >
          <Moon className="h-5 w-5" />
        </button>

        {/* Notifications Mock Icon */}
        <button
          type="button"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition relative"
          title="Notifications (UI Only)"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white" />
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* Add Task Action */}
        <button
          onClick={handleAddTaskClick}
          className="flex items-center space-x-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-soft-sm shadow-brand-500/10 cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
