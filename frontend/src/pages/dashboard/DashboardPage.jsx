import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ClipboardList, Clock, Loader, CheckCircle2, ArrowUpDown, RefreshCw, Plus } from 'lucide-react';

import taskService from '../../services/taskService';
import { ROUTES } from '../../constants/routes';
import { TASK_STATUS } from '../../constants/status';

import StatsCard from '../../components/ui/StatsCard';
import Skeleton from '../../components/ui/Skeleton';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import FilterTabs from '../../components/dashboard/FilterTabs';
import Pagination from '../../components/dashboard/Pagination';
import RecentActivity from '../../components/dashboard/RecentActivity';
import TaskCard from '../../components/dashboard/TaskCard';

const LIMIT = 8;

const SORT_OPTIONS = [
  { label: 'Latest', value: 'latest' },
  { label: 'Oldest', value: 'oldest' },
];

/**
 * Dashboard page orchestrating statistics, task list with filters,
 * debounced search, sorting, pagination, completion, and deletion.
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext() || {};

  // ─── Filter & Pagination State ───────────────────────────────────────────────
  const [activeStatus, setActiveStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // ─── Data State ──────────────────────────────────────────────────────────────
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [activities, setActivities] = useState([]);

  // ─── Loading & Error State ───────────────────────────────────────────────────
  const [tasksLoading, setTasksLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [tasksError, setTasksError] = useState(null);

  // ─── Confirmation Dialog State ────────────────────────────────────────────────
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // ─── Debounce Search ─────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery || '');
      setCurrentPage(1); // Reset to first page on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filter or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus, sortOrder]);

  // ─── Fetch Tasks ─────────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setTasksLoading(true);
    setTasksError(null);
    try {
      const params = {
        page: currentPage,
        limit: LIMIT,
        sort: sortOrder,
        ...(activeStatus && { status: activeStatus }),
        ...(debouncedSearch && { search: debouncedSearch }),
      };
      const response = await taskService.getTasks(params);
      if (response?.success) {
        setTasks(response.data.tasks || []);
        setPagination(response.data.pagination || null);
      }
    } catch (error) {
      setTasksError('Failed to load tasks. Please try again.');
    } finally {
      setTasksLoading(false);
    }
  }, [currentPage, activeStatus, sortOrder, debouncedSearch]);

  // ─── Fetch Statistics ─────────────────────────────────────────────────────────
  const fetchStatistics = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await taskService.getStatistics();
      if (response?.success) {
        setStatistics(response.data);
      }
    } catch {
      // Silently fail
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ─── Fetch Activity ───────────────────────────────────────────────────────────
  const fetchActivity = useCallback(async () => {
    setActivityLoading(true);
    try {
      const response = await taskService.getRecentActivity();
      if (response?.success) {
        setActivities(response.data || []);
      }
    } catch {
      // Silently fail
    } finally {
      setActivityLoading(false);
    }
  }, []);

  // ─── Initial Load ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchStatistics();
    fetchActivity();
  }, [fetchStatistics, fetchActivity]);

  // ─── Refresh All Dashboard Data ────────────────────────────────────────────────
  const refreshDashboard = useCallback(async () => {
    await Promise.all([fetchTasks(), fetchStatistics(), fetchActivity()]);
  }, [fetchTasks, fetchStatistics, fetchActivity]);

  // ─── Complete Task ─────────────────────────────────────────────────────────────
  const handleCompleteTask = async (taskId) => {
    try {
      const response = await taskService.completeTask(taskId);
      if (response?.success) {
        toast.success('Task completed successfully');
        await refreshDashboard();
      }
    } catch {
      toast.error('Failed to complete task. Please try again.');
    }
  };

  // ─── Delete Task Flow ──────────────────────────────────────────────────────────
  const handleDeleteRequest = (task) => {
    setTaskToDelete(task);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    try {
      const response = await taskService.deleteTask(taskToDelete.id);
      if (response?.success) {
        toast.success('Task deleted successfully');
        setDeleteConfirmOpen(false);
        setTaskToDelete(null);
        await refreshDashboard();
      }
    } catch {
      toast.error('Failed to delete task. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setTaskToDelete(null);
  };

  // ─── Status Filter Change ──────────────────────────────────────────────────────
  const handleStatusChange = (status) => {
    setActiveStatus(status);
  };

  // ─── Stats Cards Data (memoized) ───────────────────────────────────────────────
  const statsCards = useMemo(() => [
    { title: 'Total Tasks', value: statistics?.total, icon: ClipboardList, colorTheme: 'brand' },
    { title: 'Pending', value: statistics?.pending, icon: Clock, colorTheme: 'warning' },
    { title: 'In Progress', value: statistics?.inProgress, icon: Loader, colorTheme: 'danger' },
    { title: 'Completed', value: statistics?.completed, icon: CheckCircle2, colorTheme: 'success' },
  ], [statistics]);

  return (
    <>
      {/* ── Confirmation Dialog ─────────────────────────────────────────────── */}
      <ConfirmationDialog
        isOpen={deleteConfirmOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <div className="space-y-6 sm:space-y-8 pb-10 w-full overflow-hidden">
        {/* ── Page Title ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage and track all your tasks in one place
            </p>
          </div>
          <button
            onClick={refreshDashboard}
            className="flex items-center justify-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium transition cursor-pointer self-start sm:self-auto"
            title="Refresh Dashboard"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* ── Statistics Cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))
            : statsCards.map((card) => (
                <StatsCard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  colorTheme={card.colorTheme}
                />
              ))}
        </div>

        {/* ── Main Content Grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 w-full">
          {/* ── Task List Panel (2/3 width) ── */}
          <div className="xl:col-span-2 space-y-5 w-full min-w-0">
            {/* Filters & Sorting Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full">
              {/* Horizontal Scrollable Tabs container on mobile */}
              <div className="overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto -mx-4 sm:-mx-0 px-4 sm:px-0">
                <FilterTabs
                  activeStatus={activeStatus}
                  onStatusChange={handleStatusChange}
                />
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                <ArrowUpDown className="h-4 w-4 text-slate-400" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Task List */}
            {tasksLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-3 w-3/4" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : tasksError ? (
              /* Error State */
              <div className="bg-white border border-danger-100 rounded-xl p-8 text-center space-y-3 w-full">
                <div className="h-10 w-10 bg-danger-50 rounded-full flex items-center justify-center mx-auto">
                  <ClipboardList className="h-5 w-5 text-danger-500" />
                </div>
                <p className="text-sm font-semibold text-slate-700">{tasksError}</p>
                <button
                  onClick={fetchTasks}
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : tasks.length === 0 ? (
              /* Empty State */
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-8 sm:p-12 text-center space-y-4 w-full">
                <div className="text-4xl">📋</div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">No Tasks Yet</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {debouncedSearch || activeStatus
                      ? 'No tasks match your current filters.'
                      : 'Create your first task to get started.'}
                  </p>
                </div>
                {!debouncedSearch && !activeStatus && (
                  <button
                    onClick={() => navigate(ROUTES.ADD_TASK)}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium text-sm transition shadow-soft-sm shadow-brand-500/10 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Task</span>
                  </button>
                )}
              </div>
            ) : (
              /* Task Cards */
              <div className="space-y-3 w-full">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteRequest}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!tasksLoading && tasks.length > 0 && (
              <Pagination
                pagination={pagination}
                onPageChange={setCurrentPage}
              />
            )}
          </div>

          {/* ── Recent Activity Panel (1/3 width) ── */}
          <div className="xl:col-span-1 w-full min-w-0" id="activity">
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-soft-sm xl:sticky xl:top-24 w-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-slate-900 font-sans">
                  Recent Activity
                </h2>
                <span className="text-xs text-slate-400 font-medium">Last 10</span>
              </div>
              <RecentActivity
                activities={activities}
                isLoading={activityLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
