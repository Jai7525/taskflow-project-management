import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

/**
 * Main dashboard layout wrapper.
 * Composes the Sidebar, Header, and the routed page content via Outlet.
 * Implements a responsive slide-in navigation drawer for tablet and mobile screens.
 */
const DashboardLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans overflow-x-hidden">
      {/* ── Sidebar: Desktop vs Mobile Drawer ── */}
      {/* Dark Overlay (Mobile only) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:transform-none lg:static lg:block transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Sticky Top Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuClick={toggleSidebar}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {/* Pass search query to all child pages via React Router context */}
            <Outlet context={{ searchQuery }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
