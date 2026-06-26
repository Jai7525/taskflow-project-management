import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

/**
 * WorkspaceLayout shell wrapping desktop Sidebar, sticky Navbar,
 * and page viewport content using Outlet.
 */
const WorkspaceLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen flex bg-[#F6F8FB] font-sans overflow-x-hidden">
      {/* Desktop Fixed Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Top Navbar */}
        <TopNavbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {/* Workspace content page view */}
        <main className="flex-1 overflow-x-hidden p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet context={{ searchQuery }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
