import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import CreateTaskDrawer from '../workspace/CreateTaskDrawer';

/**
 * WorkspaceLayout shell wrapping desktop Sidebar, sticky Navbar,
 * and page viewport content using Outlet.
 */
const WorkspaceLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="min-h-screen flex bg-[#F6F8FB] font-sans overflow-x-hidden">
      {/* Desktop Fixed Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Top Navbar */}
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateTaskClick={() => setIsCreateDrawerOpen(true)}
        />

        {/* Workspace content page view */}
        <main className="flex-1 overflow-x-hidden p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet context={{ searchQuery, refreshTrigger }} />
          </div>
        </main>
      </div>

      {/* Create Task Drawer Panel */}
      <CreateTaskDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  );
};

export default WorkspaceLayout;
