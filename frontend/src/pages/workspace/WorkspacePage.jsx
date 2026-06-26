import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Calendar, MoreHorizontal, AlertCircle } from 'lucide-react';
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

/**
 * Enterprise Workspace Page.
 * Coordinates dynamic Task Timeline with dynamic task board columns for Phase 8D.
 */
const WorkspacePage = () => {
  const { searchQuery, refreshTrigger, setRefreshTrigger, openCreateTaskDrawer, openTaskDetailsDrawer } = useOutletContext();
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
  const [error, setError] = useState(null);

  // Activity Log States (Phase 8H)
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState(null);

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
    setTimelineLoading(true);
    try {
      const response = await taskService.getTasks({ limit: 150, search: searchVal });
      if (response?.success) {
        setTimelineTasks(response.data.tasks || []);
      }
    } catch (err) {
      console.error('Failed to load timeline tasks', err);
    } finally {
      setTimelineLoading(false);
    }
  }, []);

  // Fetch Board Tasks based on filter parameters
  const fetchBoardTasks = useCallback(async (page, status, search, sort) => {
    setLoading(true);
    setError(null);
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
      } else {
        setError('Unable to load tasks');
      }
    } catch (err) {
      setError('Unable to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Recent Activity Logs (Phase 8H)
  const fetchRecentActivity = useCallback(async () => {
    setActivityLoading(true);
    setActivityError(null);
    try {
      const response = await taskService.getRecentActivity();
      if (response?.success) {
        setActivities(response.data || []);
      } else {
        setActivityError('Unable to load activity');
      }
    } catch (err) {
      setActivityError('Unable to load activity');
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
  const filteredTasks = selectedDate
    ? boardTasks.filter((task) => task.dueDate && task.dueDate.startsWith(selectedDate))
    : boardTasks;

  // Group filtered tasks by status
  const pendingTasks = filteredTasks.filter((t) => t.status === 'Pending');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'In Progress');
  const completedTasks = filteredTasks.filter((t) => t.status === 'Completed');

  // Helper to render skeleton loaders or tasks inside columns
  const renderColumnContent = (columnTasks, emptyText) => {
    if (loading) {
      return (
        <div className="space-y-3">
          <SkeletonLoader variant="card" />
          <SkeletonLoader variant="card" />
        </div>
      );
    }

    if (columnTasks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-[#E5E7EB] rounded-[12px] bg-white/50 text-slate-400 space-y-1 text-center">
          <span className="text-xs font-bold text-slate-500">{emptyText}</span>
          <span className="text-[10px] text-slate-400">No tasks yet</span>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {columnTasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={handleCardClick} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-10 w-full overflow-hidden">
      
      {/* ── Page Header Greeting ── */}
      <WorkspaceHeader />

      {/* ── Today's Focus row metrics ── */}
      <TodayFocus refreshTrigger={refreshTrigger} />

      {/* ── Signature Task Timeline (Dynamic horizontal dates rail) ── */}
      <TaskTimeline
        tasks={timelineTasks}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        error={error && timelineTasks.length === 0 ? 'Unable to load timeline' : null}
        onRetry={() => fetchTimelineTasks(debouncedSearch)}
      />

      {/* ── Task Board and Activity Log Stack ── */}
      <div className="space-y-8 w-full">
        
        {/* Tasks Columns */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-[22px] font-bold text-[#111827] tracking-tight font-sans">
              My Tasks
            </h2>
            
            {/* Filters and Sort Dropdown Controls */}
            <div className="flex items-center space-x-3 self-end sm:self-auto">
              <FilterTabs activeStatus={activeStatus} onStatusChange={handleStatusChange} />
              <Dropdown
                options={sortOptions}
                value={sortOrder}
                onChange={handleSortChange}
              />
            </div>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-[16px] p-6 flex flex-col items-center justify-center space-y-3.5 w-full min-h-[250px] text-center">
              <AlertCircle className="h-9 w-9 text-red-500" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#111827]">Unable to load tasks</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  There was an issue fetching tasks from the backend database. Please try again.
                </p>
              </div>
              <button
                onClick={() => fetchBoardTasks(currentPage, activeStatus, debouncedSearch, sortOrder)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Board 3-Columns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* Column 1: Pending */}
                <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[16px] p-4 flex flex-col space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="font-bold text-sm text-[#111827] font-sans">Pending</span>
                      <span className="text-[11px] font-bold text-slate-400 bg-white border border-[#E5E7EB] px-1.5 py-0.2 rounded-md">
                        {pendingTasks.length}
                      </span>
                    </div>
                    <div className="flex space-x-1 text-slate-400">
                      <button
                        onClick={() => openCreateTaskDrawer('Pending')}
                        title="Add Pending Task"
                        className="p-0.5 hover:text-slate-700 cursor-pointer transition-colors duration-150"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-0.5 hover:text-slate-700 cursor-not-allowed"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>

                  <div className="space-y-3">
                     {renderColumnContent(pendingTasks, 'No pending tasks')}
                  </div>
                </div>

                {/* Column 2: In Progress */}
                <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[16px] p-4 flex flex-col space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="font-bold text-sm text-[#111827] font-sans">In Progress</span>
                      <span className="text-[11px] font-bold text-slate-400 bg-white border border-[#E5E7EB] px-1.5 py-0.2 rounded-md">
                        {inProgressTasks.length}
                      </span>
                    </div>
                    <div className="flex space-x-1 text-slate-400">
                      <button
                        onClick={() => openCreateTaskDrawer('In Progress')}
                        title="Add In Progress Task"
                        className="p-0.5 hover:text-slate-700 cursor-pointer transition-colors duration-150"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-0.5 hover:text-slate-700 cursor-not-allowed"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {renderColumnContent(inProgressTasks, 'No tasks in progress')}
                  </div>
                </div>

                {/* Column 3: Completed */}
                <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[16px] p-4 flex flex-col space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="font-bold text-sm text-[#111827] font-sans">Completed</span>
                      <span className="text-[11px] font-bold text-slate-400 bg-white border border-[#E5E7EB] px-1.5 py-0.2 rounded-md">
                        {completedTasks.length}
                      </span>
                    </div>
                    <div className="flex space-x-1 text-slate-400">
                      <button
                        onClick={() => openCreateTaskDrawer('Completed')}
                        title="Add Completed Task"
                        className="p-0.5 hover:text-slate-700 cursor-pointer transition-colors duration-150"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-0.5 hover:text-slate-700 cursor-not-allowed"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {renderColumnContent(completedTasks, 'No completed tasks')}
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
        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] h-[370px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="text-[16px] font-bold text-[#111827] font-sans">
              Activity Log
            </h3>
          </div>

          <RecentActivity
            activities={activities}
            isLoading={activityLoading}
            error={activityError}
            onRetry={fetchRecentActivity}
            onActivityClick={handleActivityClick}
          />
        </div>

      </div>
    </div>
  );
};

export default WorkspacePage;
