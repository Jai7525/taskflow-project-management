import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Calendar, MoreHorizontal, AlertCircle } from 'lucide-react';
import WorkspaceHeader from '../../components/dashboard/WorkspaceHeader';
import TodayFocus from '../../components/dashboard/TodayFocus';
import TaskTimeline from '../../components/dashboard/TaskTimeline';
import FilterTabs from '../../components/dashboard/FilterTabs';
import Pagination from '../../components/dashboard/Pagination';
import TaskCard from '../../components/dashboard/TaskCard';
import Dropdown from '../../components/ui/Dropdown';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import taskService from '../../services/taskService';

/**
 * Enterprise Workspace Dashboard Page.
 * Coordinates dynamic Task Timeline with dynamic task board columns for Phase 8D.
 */
const DashboardPage = () => {
  const { searchQuery } = useOutletContext();
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Timeline tasks for calendar indicators (max limit 150)
  const [timelineTasks, setTimelineTasks] = useState([]);
  
  // Board tasks (paginated and status filtered)
  const [boardTasks, setBoardTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Filter & Sort States
  const [activeStatus, setActiveStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState(null);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Trigger timeline refresh when search filters update
  useEffect(() => {
    fetchTimelineTasks(debouncedSearch);
  }, [debouncedSearch, fetchTimelineTasks]);

  // Trigger board refresh when pagination or layout changes
  useEffect(() => {
    fetchBoardTasks(currentPage, activeStatus, debouncedSearch, sortOrder);
  }, [currentPage, activeStatus, debouncedSearch, sortOrder, fetchBoardTasks]);

  const handleStatusChange = (status) => {
    setActiveStatus(status);
  };

  const handleSortChange = (sort) => {
    setSortOrder(sort);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-10 w-full overflow-hidden">
      
      {/* ── Page Header Greeting ── */}
      <WorkspaceHeader />

      {/* ── Today's Focus row metrics ── */}
      <TodayFocus />

      {/* ── Signature Task Timeline (Dynamic horizontal dates rail) ── */}
      <TaskTimeline
        tasks={timelineTasks}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        error={error && timelineTasks.length === 0 ? 'Unable to load timeline' : null}
        onRetry={() => fetchTimelineTasks(debouncedSearch)}
      />

      {/* ── Split Grid: Task Columns (3/4 span) and Activity Log (1/4 span) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 w-full items-start">
        
        {/* Left Side: Tasks Columns (Pending, In Progress, Completed) */}
        <div className="xl:col-span-3 space-y-6">
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
                      <button className="p-0.5 hover:text-slate-700 cursor-not-allowed"><Plus className="h-3.5 w-3.5" /></button>
                      <button className="p-0.5 hover:text-slate-700 cursor-not-allowed"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {renderColumnContent(pendingTasks, 'No pending tasks')}
                    
                    {!loading && (
                      <button className="w-full py-2.5 border border-[#E5E7EB] border-dashed hover:border-slate-350 rounded-[12px] flex items-center justify-center text-[12px] font-bold text-slate-450 hover:text-slate-700 bg-white transition cursor-not-allowed">
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        <span>Add Task</span>
                      </button>
                    )}
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
                      <button className="p-0.5 hover:text-slate-700 cursor-not-allowed"><Plus className="h-3.5 w-3.5" /></button>
                      <button className="p-0.5 hover:text-slate-700 cursor-not-allowed"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {renderColumnContent(inProgressTasks, 'No tasks in progress')}
                    
                    {!loading && (
                      <button className="w-full py-2.5 border border-[#E5E7EB] border-dashed hover:border-slate-350 rounded-[12px] flex items-center justify-center text-[12px] font-bold text-slate-450 hover:text-slate-700 bg-white transition cursor-not-allowed">
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        <span>Add Task</span>
                      </button>
                    )}
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
                      <button className="p-0.5 hover:text-slate-700 cursor-not-allowed"><Plus className="h-3.5 w-3.5" /></button>
                      <button className="p-0.5 hover:text-slate-700 cursor-not-allowed"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {renderColumnContent(completedTasks, 'No completed tasks')}
                    
                    {!loading && (
                      <button className="w-full py-2.5 border border-[#E5E7EB] border-dashed hover:border-slate-350 rounded-[12px] flex items-center justify-center text-[12px] font-bold text-slate-450 hover:text-slate-700 bg-white transition cursor-not-allowed">
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        <span>Add Task</span>
                      </button>
                    )}
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

        {/* Right Side: Activity Log Column (1/4 span) */}
        <div className="xl:col-span-1 bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-[#111827] font-sans">
              Activity Log
            </h3>
            <button className="text-xs text-[#6366F1] font-bold hover:underline cursor-not-allowed">
              View all
            </button>
          </div>

          {/* Vertical log elements */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3 text-xs leading-relaxed">
              <div className="h-6 w-6 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                +
              </div>
              <div>
                <p className="text-slate-700">
                  <span className="font-bold text-[#111827]">You</span> created "API Integration"
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">5m ago</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs leading-relaxed">
              <div className="h-6 w-6 rounded-full bg-amber-50 text-[#D97706] border border-amber-100 flex items-center justify-center shrink-0">
                ✎
              </div>
              <div>
                <p className="text-slate-700">
                  <span className="font-bold text-[#111827]">Kiara</span> updated "Dashboard UI"
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">15m ago</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs leading-relaxed">
              <div className="h-6 w-6 rounded-full bg-green-50 text-green-600 border border-green-100 flex items-center justify-center shrink-0">
                ✓
              </div>
              <div>
                <p className="text-slate-700">
                  <span className="font-bold text-[#111827]">Joe</span> completed "Setup project repo"
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">1h ago</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs leading-relaxed">
              <div className="h-6 w-6 rounded-full bg-red-50 text-red-650 border border-red-100 flex items-center justify-center shrink-0">
                ×
              </div>
              <div>
                <p className="text-slate-700">
                  <span className="font-bold text-[#111827]">Tania</span> deleted "Old landing page"
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">2h ago</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
