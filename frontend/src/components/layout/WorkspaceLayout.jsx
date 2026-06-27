import React, { useState, useEffect, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, Plus, Search, LogOut, LayoutDashboard, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import CreateTaskDrawer from '../workspace/CreateTaskDrawer';
import TaskDetailsDrawer from '../tasks/TaskDetailsDrawer';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

/**
 * WorkspaceLayout shell wrapping Sidebar, Navbar, and responsive mobile layout structures.
 */
const WorkspaceLayout = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [createDrawerDefaultStatus, setCreateDrawerDefaultStatus] = useState('Pending');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Mobile menu visibility state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Focus search input when pressing '/' on dashboard
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === '/') {
        const active = document.activeElement;
        if (active) {
          const tag = active.tagName.toLowerCase();
          if (tag === 'input' || tag === 'textarea' || tag === 'select' || active.isContentEditable) {
            return;
          }
        }
        if (isCreateDrawerOpen || isDetailsOpen) {
          return;
        }

        e.preventDefault();

        const searchInputs = document.querySelectorAll('input[placeholder="Search tasks..."]');
        let visibleInput = null;
        searchInputs.forEach((input) => {
          if (input.offsetWidth > 0 || input.offsetHeight > 0) {
            visibleInput = input;
          }
        });

        if (visibleInput) {
          visibleInput.focus();
          visibleInput.select();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isCreateDrawerOpen, isDetailsOpen]);

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

  // Generate initials for avatar fallback
  const initials = useMemo(() => {
    if (!user || !user.name) return 'TU';
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }, [user]);

  return (
    <div className="h-screen flex bg-bgPrimary font-sans overflow-hidden w-full relative">
      {/* Desktop Fixed Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full h-full overflow-hidden">
        
        {/* ── MOBILE HEADER (lg:hidden) ── */}
        <header className="lg:hidden h-16 bg-white border-b border-[#E5E7EB] px-4 flex items-center justify-between shrink-0 select-none z-30">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 hover:bg-slate-50 rounded-xl transition text-slate-650 cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            {/* Brand Logo */}
            <div className="flex items-center space-x-2 pl-1">
              <div className="h-7 w-7 bg-[#6366F1] rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-[0_2px_6px_rgba(99,102,241,0.25)]">
                ⚡
              </div>
              <span className="text-sm font-extrabold tracking-tight text-slate-800 font-sans">
                TaskFlow
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* New Task button (+ icon only on very small screens) */}
            <button
              onClick={() => openCreateTaskDrawer('Pending')}
              className="flex items-center space-x-1.5 px-3 py-2 bg-[#6366F1] hover:bg-[#5053de] text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              aria-label="Create task"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Task</span>
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* User Avatar */}
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Avatar"
                className="h-8 w-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-[#6366F1] text-white font-bold flex items-center justify-center text-[10px] font-sans tracking-wide border-2 border-white shadow-sm">
                {initials}
              </div>
            )}
          </div>
        </header>

        {/* ── MOBILE SEARCH (lg:hidden) ── */}
        <div className="lg:hidden bg-white border-b border-[#E5E7EB] p-3 shrink-0">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchQuery('');
                  e.currentTarget.blur();
                }
              }}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-10 py-2 bg-[#F6F8FB] border border-[#E5E7EB] rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]/10 focus:border-[#6366F1] placeholder-slate-400 font-medium transition duration-150"
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <span className="text-[10px] bg-white border border-[#E5E7EB] px-1.5 py-0.5 rounded text-slate-400 font-bold font-sans">
                /
              </span>
            </div>
          </div>
        </div>

        {/* Top Navbar (Desktop Only) */}
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateTaskClick={() => openCreateTaskDrawer('Pending')}
          isOffline={isOffline}
          showOfflineToast={showOfflineToast}
        />

        {/* Workspace content page view */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet context={{ searchQuery, refreshTrigger, setRefreshTrigger, openCreateTaskDrawer, openTaskDetailsDrawer, isOffline, showOfflineToast }} />
          </div>
        </main>
      </div>

      {/* ── MOBILE NAVIGATION DRAWER ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/40 z-[99] backdrop-blur-sm cursor-pointer"
            />

            {/* Menu Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden fixed inset-y-0 left-0 w-[260px] bg-[#111827] z-[100] flex flex-col border-r border-[rgba(255,255,255,0.06)] p-4 select-none"
            >
              {/* Drawer Header */}
              <div className="h-16 flex items-center justify-between px-2 mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="h-8 w-8 bg-[#6366F1] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-[0_2px_8px_rgba(99,102,241,0.3)]">
                    ⚡
                  </div>
                  <div>
                    <span className="text-base font-extrabold tracking-tight text-white font-sans block">
                      TaskFlow
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                      Your Workspace
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition hover:bg-slate-800 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 space-y-2">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-[#6366F1] text-white rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  <LayoutDashboard className="h-4.5 w-4.5" />
                  <span>Workspace</span>
                </button>
              </nav>

              {/* Drawer Footer Profile & Logout */}
              <div className="border-t border-[rgba(255,255,255,0.06)] pt-4 space-y-3">
                {/* User Card */}
                <div className="flex items-center px-2 py-1.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center space-x-3 min-w-0">
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="User"
                        className="h-8.5 w-8.5 rounded-full object-cover border border-[#374151] shrink-0"
                      />
                    ) : (
                      <div className="h-8.5 w-8.5 rounded-full bg-[#6366F1] text-white font-bold flex items-center justify-center text-[10px] font-sans tracking-wide border border-[#374151] shadow-sm shrink-0">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {user?.name || 'TaskFlow User'}
                      </p>
                      <p className="text-[10px] text-[rgba(255,255,255,0.6)] truncate font-medium">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-transparent text-white hover:text-red-500 hover:bg-white rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
