import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import CreateTaskDrawer from '../workspace/CreateTaskDrawer';
import TaskDetailsDrawer from '../tasks/TaskDetailsDrawer';
import { toast } from 'react-hot-toast';

/**
 * WorkspaceLayout shell wrapping desktop Sidebar, sticky Navbar,
 * and page viewport content using Outlet.
 */
const WorkspaceLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [createDrawerDefaultStatus, setCreateDrawerDefaultStatus] = useState('Pending');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Online/Offline detection state
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Details Drawer States
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Connection restored. Dashboard updated.", {
        id: "offline-status-toast",
        duration: 3000,
      });
    };
    const handleOffline = () => {
      setIsOffline(true);
      toast.error("You're offline. Check your connection.", {
        id: "offline-status-toast",
        duration: 3000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Deduplicated offline action warning toast helper
  const showOfflineToast = () => {
    toast.error("Internet connection required to perform this action.", {
      id: "offline-action-prevented",
      duration: 3000,
    });
  };

  const openCreateTaskDrawer = (status = 'Pending') => {
    if (isOffline) {
      showOfflineToast();
      return;
    }
    setCreateDrawerDefaultStatus(status);
    setIsCreateDrawerOpen(true);
  };

  const openTaskDetailsDrawer = (taskId) => {
    setSelectedTaskId(taskId);
    setIsDetailsOpen(true);
  };

  return (
    <div className="h-screen flex bg-bgPrimary font-sans overflow-hidden">
      {/* Desktop Fixed Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full h-full overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateTaskClick={() => openCreateTaskDrawer('Pending')}
          isOffline={isOffline}
          showOfflineToast={showOfflineToast}
        />

        {/* Workspace content page view */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet context={{ searchQuery, refreshTrigger, setRefreshTrigger, openCreateTaskDrawer, openTaskDetailsDrawer, isOffline, showOfflineToast }} />
          </div>
        </main>
      </div>

      {/* Create Task Drawer Panel */}
      <CreateTaskDrawer
        isOpen={isCreateDrawerOpen}
        defaultStatus={createDrawerDefaultStatus}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />

      {/* Task Details Drawer Overlay */}
      <TaskDetailsDrawer
        isOpen={isDetailsOpen}
        taskId={selectedTaskId}
        isOffline={isOffline}
        showOfflineToast={showOfflineToast}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedTaskId(null);
        }}
        onUpdate={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  );
};

export default WorkspaceLayout;
