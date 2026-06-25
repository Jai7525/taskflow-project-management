import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';

/**
 * Main dashboard layout wrapper.
 * Contains placeholders for Sidebar, Header, and Content Area.
 */
const DashboardLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 space-y-6">
        <div className="font-bold text-xl tracking-wider">TaskFlow</div>
        <nav className="flex-1 space-y-2">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Navigation Placeholder</div>
          <div className="text-slate-300 hover:text-white cursor-pointer py-2 px-3 rounded hover:bg-slate-800 transition">Sidebar Item 1</div>
          <div className="text-slate-300 hover:text-white cursor-pointer py-2 px-3 rounded hover:bg-slate-800 transition">Sidebar Item 2</div>
        </nav>
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm transition mt-auto"
        >
          Logout Placeholder
        </button>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Placeholder */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="font-medium text-slate-800">Header Placeholder</div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">User: {user?.name || 'TaskFlow User'}</span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
