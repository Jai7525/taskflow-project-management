import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

/**
 * Main dashboard layout wrapper.
 * Composes the Sidebar, Header, and the routed page content via Outlet.
 * Search state is managed here and passed down to Header for the input,
 * then accessed by DashboardPage via the search context prop pattern.
 */
const DashboardLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Pass search query to all child pages via React Router context workaround */}
            <Outlet context={{ searchQuery }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
