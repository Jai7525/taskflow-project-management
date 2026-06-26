import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ClipboardList, Clock, Loader, CheckCircle2, ArrowUpDown, RefreshCw, Plus, Calendar, AlertCircle } from 'lucide-react';

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
import TaskTimeline from '../../components/dashboard/TaskTimeline';

import CreateTaskDrawer from '../../components/dashboard/CreateTaskDrawer';
import TaskDetailsDrawer from '../../components/dashboard/TaskDetailsDrawer';

const LIMIT = 30; // Fetch enough tasks to perform workspace filtering & grouping

const SORT_OPTIONS = [
  { label: 'Newest', value: 'latest' },
  { label: 'Oldest', value: 'oldest' },
];

/**
 * Enterprise workspace page featuring statistics, hero task timeline,
 * three-column task board, activity logs, search, filter chips, and drawer panels.
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  
  // Access search query and create task drawer states from layout context
  const { searchQuery, isCreateDrawerOpen, setIsCreateDrawerOpen } = useOutletContext() || {};

  // ─── Filter & Timeline States ───────────────────────────────────────────────
  const [activeStatus, setActiveStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTimelineDate, setSelectedTimelineDate] = useState(null);

  // ─── Drawer & Selected Task States ──────────────────────────────────────────
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

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
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus, sortOrder, selectedTimelineDate]);

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

  // ─── Refresh All Workspace Data ───────────────────────────────────────────────
  const refreshDashboard = useCallback(async () => {
    await Promise.all([fetchTasks(), fetchStatistics(), fetchActivity()]);
  }, [fetchTasks, fetchStatistics, fetchActivity]);

  // ─── Complete Task ─────────────────────────────────────────────────────────────
  const handleCompleteTask = async (taskId) => {
    try {
      const response = await taskService.completeTask(taskId);
      if (response?.success) {
        toast.success('Task marked as completed');
        await refreshDashboard();
      }
    } catch {
      toast.error('Failed to complete task');
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
      toast.error('Failed to delete task');
    }
  };

  // ─── Details View Flow ─────────────────────────────────────────────────────────
  const handleViewTask = (task) => {
    setSelectedTaskId(task.id);
    setIsDetailsDrawerOpen(true);
  };

  // ─── Dynamic Board Tasks Filtering (Selected Day + Current Options) ─────────────
  const boardTasks = useMemo(() => {
    let filtered = [...tasks];
    if (selectedTimelineDate) {
      filtered = filtered.filter((t) => t.dueDate && t.dueDate.startsWith(selectedTimelineDate));
    }
    return filtered;
  }, [tasks, selectedTimelineDate]);

  // Group columns
  const pendingTasks = useMemo(() => boardTasks.filter((t) => t.status === 'Pending'), [boardTasks]);
  const inProgressTasks = useMemo(() => boardTasks.filter((t) => t.status === 'In Progress'), [boardTasks]);
  const completedTasks = useMemo(() => boardTasks.filter((t) => t.status === 'Completed'), [boardTasks]);

  // ─── Stats Cards Data (memoized) ───────────────────────────────────────────────
  const statsCards = useMemo(() => [
    { title: 'Total Tasks', value: statistics?.total, icon: ClipboardList, colorTheme: 'brand' },
    { title: 'Pending', value: statistics?.pending, icon: Clock, colorTheme: 'warning' },
    { title: 'In Progress', value: statistics?.inProgress, icon: Loader, colorTheme: 'danger' },
    { title: 'Completed', value: statistics?.completed, icon: CheckCircle2, colorTheme: 'success' },
  ], [statistics]);

  return (
    <>
      {/* ── Drawers and Confirmation Dialogs ── */}
      <CreateTaskDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSuccess={refreshDashboard}
      />

      <TaskDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        taskId={selectedTaskId}
        onClose={() => {
          setIsDetailsDrawerOpen(false);
          setSelectedTaskId(null);
        }}
        onUpdate={refreshDashboard}
      />

      <ConfirmationDialog
        isOpen={deleteConfirmOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setTaskToDelete(null);
        }}
      />

      <div className="space-y-6 sm:space-y-8 pb-10 w-full overflow-hidden">
        {/* ── Page Title ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Helping you stay focused on today's work.
            </p>
          </div>
          <button
            onClick={refreshDashboard}
            className="flex items-center justify-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold transition cursor-pointer self-start sm:self-auto"
            title="Refresh Workspace"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* ── Statistics Cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
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

        {/* ── Hero Task Timeline ──────────────────────────────────────────────── */}
        {statsLoading ? (
          <div className="flex space-x-3 w-full overflow-x-auto pb-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-1 min-w-[120px] bg-white border border-slate-200 p-4 rounded-2xl space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-2.5 w-12" />
              </div>
            ))}
          </div>
        ) : (
          <TaskTimeline
            tasks={tasks}
            selectedDate={selectedTimelineDate}
            onSelectDate={setSelectedTimelineDate}
          />
        )}

        {/* ── Main Workspace Area ──────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Header Controls (Filters and Sorting) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full">
            <div className="overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto -mx-4 sm:-mx-0 px-4 sm:px-0">
              <FilterTabs
                activeStatus={activeStatus}
                onStatusChange={setActiveStatus}
              />
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
              <ArrowUpDown className="h-4 w-4 text-slate-400" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 rounded-xl px-3.5 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3-Column Board Columns */}
          {tasksLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/50 space-y-4">
                  <div className="h-5 w-24 bg-slate-200 animate-pulse rounded-lg" />
                  <div className="space-y-3">
                    <Skeleton className="h-28 w-full rounded-xl" />
                    <Skeleton className="h-28 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : boardTasks.length === 0 ? (
            /* Global Board Empty State */
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-4 w-full">
              <div className="text-4xl">📋</div>
              <div>
                <h3 className="text-base font-bold text-slate-800 font-sans">No Tasks Yet</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {debouncedSearch || activeStatus || selectedTimelineDate
                    ? 'No tasks match your current filters.'
                    : 'Create your first task to start organizing your work.'}
                </p>
              </div>
              {!debouncedSearch && !activeStatus && !selectedTimelineDate && (
                <button
                  onClick={() => setIsCreateDrawerOpen(true)}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-sm transition shadow-soft-sm shadow-brand-500/10 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Task</span>
                </button>
              )}
            </div>
          ) : (
            /* Active Columns */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Column 1: Pending */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-150 flex flex-col space-y-4 min-w-0">
                <div className="flex items-center justify-between px-1 shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="font-bold text-sm text-slate-700 font-sans">Pending</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-white border px-2 py-0.5 rounded-lg">
                    {pendingTasks.length}
                  </span>
                </div>
                <div className="space-y-3 overflow-y-auto max-h-[600px] pr-0.5">
                  {pendingTasks.map((task) => (
                    <div key={task.id} onClick={() => handleViewTask(task)} className="cursor-pointer">
                      <TaskCard
                        task={task}
                        onComplete={handleCompleteTask}
                        onDelete={handleDeleteRequest}
                      />
                    </div>
                  ))}
                  {pendingTasks.length === 0 && (
                    <div className="text-center py-8 text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                      No pending tasks
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: In Progress */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-150 flex flex-col space-y-4 min-w-0">
                <div className="flex items-center justify-between px-1 shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="font-bold text-sm text-slate-700 font-sans">In Progress</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-white border px-2 py-0.5 rounded-lg">
                    {inProgressTasks.length}
                  </span>
                </div>
                <div className="space-y-3 overflow-y-auto max-h-[600px] pr-0.5">
                  {inProgressTasks.map((task) => (
                    <div key={task.id} onClick={() => handleViewTask(task)} className="cursor-pointer">
                      <TaskCard
                        task={task}
                        onComplete={handleCompleteTask}
                        onDelete={handleDeleteRequest}
                      />
                    </div>
                  ))}
                  {inProgressTasks.length === 0 && (
                    <div className="text-center py-8 text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                      No tasks in progress
                    </div>
                  )}
                </div>
              </div>

              {/* Column 3: Completed */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-150 flex flex-col space-y-4 min-w-0">
                <div className="flex items-center justify-between px-1 shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="font-bold text-sm text-slate-700 font-sans">Completed</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-white border px-2 py-0.5 rounded-lg">
                    {completedTasks.length}
                  </span>
                </div>
                <div className="space-y-3 overflow-y-auto max-h-[600px] pr-0.5">
                  {completedTasks.map((task) => (
                    <div key={task.id} onClick={() => handleViewTask(task)} className="cursor-pointer">
                      <TaskCard
                        task={task}
                        onComplete={handleCompleteTask}
                        onDelete={handleDeleteRequest}
                      />
                    </div>
                  ))}
                  {completedTasks.length === 0 && (
                    <div className="text-center py-8 text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                      No completed tasks
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Minimal Pagination */}
          {!tasksLoading && boardTasks.length > 0 && (
            <Pagination
              pagination={pagination}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        {/* ── Recent Activity ─────────────────────────────────────────────────── */}
        <div id="activity" className="pt-4 border-t border-slate-200">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-soft-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-slate-900 font-sans">
                Activity Log
              </h2>
              <span className="text-xs text-slate-400 font-semibold">Newest First</span>
            </div>
            <RecentActivity
              activities={activities}
              isLoading={activityLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
