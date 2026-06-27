import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Calendar, AlertCircle, ClipboardList } from 'lucide-react';
import WorkspaceHeader from '../../components/workspace/WorkspaceHeader';
import TodayFocus from '../../components/workspace/TodayFocus';
import TaskTimeline from '../../components/workspace/TaskTimeline';
import FilterTabs from '../../components/workspace/FilterTabs';
import Pagination from '../../components/workspace/Pagination';
import TaskCard from '../../components/workspace/TaskCard';
import Dropdown from '../../components/ui/Dropdown';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import taskService from '../../services/taskService';
import RecentActivity from '../../components/workspace/RecentActivity';
import { toast } from 'react-hot-toast';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
    }
  }
};

/**
 * Enterprise Workspace Page.
 * Coordinates dynamic Task Timeline with dynamic task board columns for Phase 8D.
 */
const WorkspacePage = () => {
  const { searchQuery, refreshTrigger, setRefreshTrigger, openCreateTaskDrawer, openTaskDetailsDrawer, isOffline, showOfflineToast } = useOutletContext();
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Timeline tasks for calendar indicators (max limit 150)
  const [timelineTasks, setTimelineTasks] = useState([]);
  
  // Board tasks (paginated and status filtered)
  const [boardTasks, setBoardTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  
  // Filter & Sort States
  const [activeStatus, setActiveStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState(null);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [boardError, setBoardError] = useState(null);
  const [timelineError, setTimelineError] = useState(null);

  // Activity Log States (Phase 8H)
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState(null);

  // Refs to track successful initial data loads (avoids dependency array recursion loops)
  const hasLoadedTimeline = useRef(false);
  const hasLoadedBoard = useRef(false);
  const hasLoadedActivity = useRef(false);

  const sortOptions = [
    { label: 'Newest First', value: 'latest' },
    { label: 'Oldest First', value: 'oldest' },
  ];

  // Debounce search query (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery || '');
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page when search, status, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeStatus, sortOrder]);

  // Fetch all tasks for due-date timeline calculations
  const fetchTimelineTasks = useCallback(async (searchVal) => {
    if (!navigator.onLine && hasLoadedTimeline.current) {
      setTimelineLoading(false);
      return;
    }
    setTimelineLoading(true);
    setTimelineError(null);
    try {
      const response = await taskService.getTasks({ limit: 150, search: searchVal });
      if (response?.success) {
        setTimelineTasks(response.data.tasks || []);
        hasLoadedTimeline.current = true;
      } else {
        setTimelineError("Unable to load timeline");
      }
    } catch (err) {
      if (!navigator.onLine && hasLoadedTimeline.current) {
        // Do not override loaded data
      } else {
        setTimelineError(!navigator.onLine ? "You're offline. Check your connection." : "Unable to load timeline");
      }
    } finally {
      setTimelineLoading(false);
    }
  }, []);

  // Fetch Board Tasks based on filter parameters
  const fetchBoardTasks = useCallback(async (page, status, search, sort) => {
    if (!navigator.onLine && hasLoadedBoard.current) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setBoardError(null);
    try {
      const params = {
        page,
        limit: 10,
        sort,
      };
      if (status) params.status = status;
      if (search) params.search = search;
      
      const response = await taskService.getTasks(params);
      if (response?.success) {
        setBoardTasks(response.data.tasks || []);
        setPaginationData(response.data.pagination || null);
        hasLoadedBoard.current = true;
      } else {
        setBoardError('Unable to load tasks');
      }
    } catch (err) {
      if (!navigator.onLine && hasLoadedBoard.current) {
        // Do not override loaded data
      } else {
        setBoardError(!navigator.onLine ? "You're offline. Check your connection." : 'Unable to load tasks');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Recent Activity Logs (Phase 8H)
  const fetchRecentActivity = useCallback(async () => {
    if (!navigator.onLine && hasLoadedActivity.current) {
      setActivityLoading(false);
      return;
    }
    setActivityLoading(true);
    setActivityError(null);
    try {
      const response = await taskService.getRecentActivity();
      if (response?.success) {
        setActivities(response.data || []);
        hasLoadedActivity.current = true;
      } else {
        setActivityError('Unable to load activity');
      }
    } catch (err) {
      if (!navigator.onLine && hasLoadedActivity.current) {
        // Do not override loaded data
      } else {
        setActivityError(!navigator.onLine ? "You're offline. Check your connection." : 'Unable to load activity');
      }
    } finally {
      setActivityLoading(false);
    }
  }, []);

  // Trigger timeline refresh when search filters update
  useEffect(() => {
    fetchTimelineTasks(debouncedSearch);
  }, [debouncedSearch, refreshTrigger, fetchTimelineTasks]);

  // Trigger board refresh when pagination or layout changes
  useEffect(() => {
    fetchBoardTasks(currentPage, activeStatus, debouncedSearch, sortOrder);
  }, [currentPage, activeStatus, debouncedSearch, sortOrder, refreshTrigger, fetchBoardTasks]);

  // Trigger activity logs refresh on actions (Phase 8H)
  useEffect(() => {
    fetchRecentActivity();
  }, [refreshTrigger, fetchRecentActivity]);

  const handleStatusChange = (status) => {
    setActiveStatus(status);
  };

  const handleSortChange = (sort) => {
    setSortOrder(sort);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCardClick = (taskId) => {
    openTaskDetailsDrawer(taskId);
  };

  const handleActivityClick = (activity) => {
    if (activity.task && activity.taskId) {
      openTaskDetailsDrawer(activity.taskId);
    } else {
      toast.error('This task is no longer available.', {
        id: 'task-not-available',
        position: 'top-right',
        duration: 3000
      });
    }
  };

  // Filter tasks client-side based on timeline's selectedDate
  // Mode 2 — Global Search Mode: Temporarily disable the timeline filter when search query is active
  const filteredTasks = useMemo(() => {
    if (debouncedSearch) {
      return boardTasks;
    }
    return selectedDate
      ? boardTasks.filter((task) => task.dueDate && task.dueDate.startsWith(selectedDate))
      : boardTasks;
  }, [boardTasks, selectedDate, debouncedSearch]);

  // Group filtered tasks by status
  const pendingTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'Pending'), [filteredTasks]);
  const inProgressTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'In Progress'), [filteredTasks]);
  const completedTasks = useMemo(() => filteredTasks.filter((t) => t.status === 'Completed'), [filteredTasks]);

  // Filter activities to show only those relating to matching tasks under search mode
  const searchFilteredActivities = useMemo(() => {
    if (!debouncedSearch) return activities;
    const cleanSearch = debouncedSearch.toLowerCase().trim();
    return activities.filter((activity) => {
      // If task is still available in timelineTasks, it's matching
      const matchesTimeline = activity.taskId && timelineTasks.some((t) => t.id === activity.taskId);
      if (matchesTimeline) return true;
      
      // If task is deleted, fallback to matching by action name
      const matchesAction = activity.action && activity.action.toLowerCase().includes(cleanSearch);
      return !!matchesAction;
    });
  }, [activities, debouncedSearch, timelineTasks]);

  // Helper to render skeleton loaders or tasks inside columns
  const renderColumnContent = (columnTasks, emptyText, status) => {
    if (loading) {
      return (
        <div className="space-y-3">
          <SkeletonLoader variant="card" />
          <SkeletonLoader variant="card" />
        </div>
      );
    }

    if (columnTasks.length === 0) {
      if (debouncedSearch) {
        return (
          <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-[#E5E7EB] rounded-[16px] bg-white/50 text-slate-400 space-y-2.5 text-center min-h-[160px] select-none">
            <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100/60 shadow-sm mx-auto">
              <ClipboardList className="h-5 w-5 text-slate-450" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800 font-sans">No matching tasks</p>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[200px]">
                Try another keyword.
              </p>
            </div>
          </div>
        );
      }

      if (status === 'Pending') {
        return (
          <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-[#E5E7EB] rounded-[16px] bg-white/50 text-slate-400 space-y-2.5 text-center min-h-[160px] select-none">
            <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100/60 shadow-sm mx-auto">
              <ClipboardList className="h-5 w-5 text-slate-455" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800 font-sans">No pending tasks</p>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[200px]">
                Create your first task to get started.
              </p>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-[#E5E7EB] rounded-[16px] bg-white/50 text-slate-400 space-y-1 text-center min-h-[160px] select-none">
          <span className="text-xs font-bold text-slate-500">{emptyText}</span>
          <span className="text-[10px] text-slate-400 font-medium">No tasks yet</span>
        </div>
      );
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {columnTasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={handleCardClick} />
        ))}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-8 pb-10 w-full overflow-hidden"
    >
      {/* ── Persistent Offline Warning Banner ── */}
      {isOffline && (
        <div className="bg-amber-50 border border-amber-250 rounded-[16px] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-4 w-full select-none transition-all">
          <div className="flex items-center space-x-3.5">
            <div className="h-9 w-9 rounded-xl bg-amber-100/60 border border-amber-200/50 flex items-center justify-center text-amber-700 shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 font-sans">You're offline</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Some information may be outdated.</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (navigator.onLine) {
                window.dispatchEvent(new Event('online'));
              } else {
                toast.error("Still offline. Please check your connection.", {
                  id: "offline-action-prevented",
                  duration: 2000,
                });
              }
            }}
            className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* ── Page Header Greeting ── */}
      <WorkspaceHeader />

      {/* ── Today's Focus row metrics ── */}
      <TodayFocus
        refreshTrigger={refreshTrigger}
        searchActive={!!debouncedSearch}
        searchTasks={timelineTasks}
      />

      {/* ── Signature Task Timeline (Dynamic horizontal dates rail) ── */}
      <TaskTimeline
        tasks={timelineTasks}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        error={timelineError}
        isLoading={timelineLoading}
        onRetry={() => fetchTimelineTasks(debouncedSearch)}
      />

      {/* ── Task Board and Activity Log Stack ── */}
      <div className="space-y-8 w-full">
        
        {/* Tasks Columns */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-baseline space-x-3">
              <h2 className="text-[22px] font-bold text-[#111827] tracking-tight font-sans">
                My Tasks
              </h2>
              {debouncedSearch && (
                <span className="text-xs text-slate-400 font-medium font-sans">
                  Showing {timelineTasks.length} {timelineTasks.length === 1 ? 'result' : 'results'} for "{debouncedSearch}"
                </span>
              )}
            </div>
            
            {/* Filters and Sort Dropdown Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-auto">
                <FilterTabs activeStatus={activeStatus} onStatusChange={handleStatusChange} />
              </div>
              <div className="self-end sm:self-auto">
                <Dropdown
                  options={sortOptions}
                  value={sortOrder}
                  onChange={handleSortChange}
                />
              </div>
            </div>
          </div>

          {boardError ? (
            <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 w-full h-auto sm:h-[132px] select-none shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="flex items-center space-x-3.5">
                <div className="h-9 w-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-650 shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 font-sans">
                    {boardError.toLowerCase().includes("offline") ? "You're offline." : "Unable to load tasks"}
                  </p>
                  <p className="text-xs text-slate-450 mt-0.5 font-medium">
                    {boardError.toLowerCase().includes("offline") ? "Check your connection." : "Please try again later."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => fetchBoardTasks(currentPage, activeStatus, debouncedSearch, sortOrder)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : !loading && boardTasks.length === 0 && debouncedSearch ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-[#E5E7EB] rounded-[24px] bg-[#F8FAFC] text-center w-full min-h-[250px] select-none">
              <span className="text-3xl mb-3">🔍</span>
              <h3 className="text-sm font-bold text-[#111827] font-sans">No matching tasks found</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Try another keyword.</p>
            </div>
          ) : (
            <>
              {/* Board 3-Columns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                
                {/* Column 1: Pending */}
                <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[20px] p-4 flex flex-col space-y-4 transition-colors duration-[150ms] hover:border-slate-350">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="font-bold text-sm text-textPrimary font-sans">Pending</span>
                      <span className="text-[11px] font-bold text-textSecondary bg-white border border-slate-200 px-1.5 py-0.2 rounded-md">
                        {loading ? 0 : pendingTasks.length}
                      </span>
                    </div>
                    <div className="flex space-x-1 text-textMuted">
                      <button
                        onClick={isOffline ? showOfflineToast : () => openCreateTaskDrawer('Pending')}
                        title={isOffline ? "Requires an internet connection" : "Add Pending Task"}
                        className={`p-0.5 transition-all ${
                          isOffline ? 'opacity-50 cursor-not-allowed' : 'hover:text-textPrimary cursor-pointer transition-colors duration-150'
                        }`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>

                    </div>
                  </div>

                  <div className="space-y-3">
                     {renderColumnContent(pendingTasks, 'No pending tasks', 'Pending')}
                  </div>
                </div>

                {/* Column 2: In Progress */}
                <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[20px] p-4 flex flex-col space-y-4 transition-colors duration-[150ms] hover:border-slate-350">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="font-bold text-sm text-textPrimary font-sans">In Progress</span>
                      <span className="text-[11px] font-bold text-textSecondary bg-white border border-slate-200 px-1.5 py-0.2 rounded-md">
                        {loading ? 0 : inProgressTasks.length}
                      </span>
                    </div>
                    <div className="flex space-x-1 text-textMuted">
                      <button
                        onClick={isOffline ? showOfflineToast : () => openCreateTaskDrawer('In Progress')}
                        title={isOffline ? "Requires an internet connection" : "Add In Progress Task"}
                        className={`p-0.5 transition-all ${
                          isOffline ? 'opacity-50 cursor-not-allowed' : 'hover:text-textPrimary cursor-pointer transition-colors duration-150'
                        }`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>

                    </div>
                  </div>

                  <div className="space-y-3">
                    {renderColumnContent(inProgressTasks, 'No tasks in progress', 'In Progress')}
                  </div>
                </div>

                {/* Column 3: Completed */}
                <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[20px] p-4 flex flex-col space-y-4 transition-colors duration-[150ms] hover:border-slate-350">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="font-bold text-sm text-textPrimary font-sans">Completed</span>
                      <span className="text-[11px] font-bold text-textSecondary bg-white border border-slate-200 px-1.5 py-0.2 rounded-md">
                        {loading ? 0 : completedTasks.length}
                      </span>
                    </div>
                    <div className="flex space-x-1 text-textMuted">
                      <button
                        onClick={isOffline ? showOfflineToast : () => openCreateTaskDrawer('Completed')}
                        title={isOffline ? "Requires an internet connection" : "Add Completed Task"}
                        className={`p-0.5 transition-all ${
                          isOffline ? 'opacity-50 cursor-not-allowed' : 'hover:text-textPrimary cursor-pointer transition-colors duration-150'
                        }`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>

                    </div>
                  </div>

                  <div className="space-y-3">
                    {renderColumnContent(completedTasks, 'No completed tasks', 'Completed')}
                  </div>
                </div>

              </div>

              {/* Pagination controls footer */}
              {paginationData && (
                <Pagination
                  pagination={paginationData}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>

        {/* Activity Log (moved below task board) */}
        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] h-[320px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="text-[16px] font-bold text-[#111827] font-sans">
              Activity Log
            </h3>
          </div>

          <RecentActivity
            activities={searchFilteredActivities}
            isLoading={activityLoading}
            error={activityError}
            onRetry={fetchRecentActivity}
            onActivityClick={handleActivityClick}
          />
        </div>

      </div>
    </motion.div>
  );
};

export default WorkspacePage;
