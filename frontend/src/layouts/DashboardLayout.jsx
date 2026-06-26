import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Enterprise Layout Shell.
 * Integrates Top Navigation, collapsable mobile sidebars, and Outlet main view sections.
 */
const DashboardLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex bg-workspace-bg font-sans overflow-x-hidden relative">
      
      {/* ── Mobile Sidebar Drawer ── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 bg-slate-950/60 z-45 lg:hidden backdrop-blur-sm"
            />

            {/* Sidebar drawer container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden shadow-xl"
            >
              <Sidebar
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
                onNavigate={() => {}}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar (Sticky left) ── */}
      <div className="hidden lg:block sticky top-0 h-screen">
        <Sidebar activeItem="workspace" onNavigate={() => {}} />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Topbar navigation */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuClick={toggleSidebar}
          onCreateTaskClick={() => {}}
        />

        {/* Content Outlet */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet context={{ searchQuery }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
