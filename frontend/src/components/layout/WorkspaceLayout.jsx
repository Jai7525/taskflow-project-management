import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import CreateTaskDrawer from '../workspace/CreateTaskDrawer';
import TaskDetailsDrawer from '../tasks/TaskDetailsDrawer';

/**
 * WorkspaceLayout shell wrapping desktop Sidebar, sticky Navbar,
 * and page viewport content using Outlet.
 */
const WorkspaceLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [createDrawerDefaultStatus, setCreateDrawerDefaultStatus] = useState('Pending');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Details Drawer States
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const openCreateTaskDrawer = (status = 'Pending') => {
    setCreateDrawerDefaultStatus(status);
    setIsCreateDrawerOpen(true);
  };

  const openTaskDetailsDrawer = (taskId) => {
    setSelectedTaskId(taskId);
    setIsDetailsOpen(true);
  };

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
          onCreateTaskClick={() => openCreateTaskDrawer('Pending')}
        />

        {/* Workspace content page view */}
        <main className="flex-1 overflow-x-hidden p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet context={{ searchQuery, refreshTrigger, setRefreshTrigger, openCreateTaskDrawer, openTaskDetailsDrawer }} />
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
