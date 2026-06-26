import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, MoreHorizontal } from 'lucide-react';
import WorkspaceHeader from '../../components/dashboard/WorkspaceHeader';
import TodayFocus from '../../components/dashboard/TodayFocus';
import TaskTimeline from '../../components/dashboard/TaskTimeline';
import taskService from '../../services/taskService';

/**
 * Enterprise Workspace Dashboard Page.
 * Coordinates dynamic Task Timeline with static board mockups for Phase 8C.
 */
const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tasks for due-date timeline calculations (max limit 150)
  const fetchTasksData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getTasks({ limit: 150 });
      if (response?.success) {
        setTasks(response.data.tasks || []);
      } else {
        setError('Unable to load timeline');
      }
    } catch (err) {
      setError('Unable to load timeline');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasksData();
  }, [fetchTasksData]);

  return (
    <div className="space-y-8 pb-10 w-full overflow-hidden">
      
      {/* ── Page Header Greeting ── */}
      <WorkspaceHeader />

      {/* ── Today's Focus row metrics ── */}
      <TodayFocus />

      {/* ── Signature Task Timeline (Dynamic horizontal dates rail) ── */}
      <TaskTimeline
        tasks={tasks}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        error={error}
        onRetry={fetchTasksData}
      />

      {/* ── Split Grid: Task Columns (3/4 span) and Activity Log (1/4 span) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 w-full items-start">
        
        {/* Left Side: Tasks Columns (Pending, In Progress, Completed) */}
        <div className="xl:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-[#111827] tracking-tight font-sans">
              My Tasks
            </h2>
            {/* Filters chips */}
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl w-fit">
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-brand-600 shadow-soft-sm">
                All
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700">
                Pending
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700">
                In Progress
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700">
                Completed
              </button>
            </div>
          </div>

          {/* Board 3-Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* Column 1: Pending */}
            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[16px] p-4 flex flex-col space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="font-bold text-sm text-[#111827] font-sans">Pending</span>
                  <span className="text-[11px] font-bold text-slate-400 bg-white border border-[#E5E7EB] px-1.5 py-0.2 rounded-md">
                    6
                  </span>
                </div>
                <div className="flex space-x-1 text-slate-400">
                  <button className="p-0.5 hover:text-slate-700"><Plus className="h-3.5 w-3.5" /></button>
                  <button className="p-0.5 hover:text-slate-700"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                </div>
              </div>

              {/* Task Cards Stack */}
              <div className="space-y-3">
                <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-soft-sm hover:shadow-soft-md transition-shadow relative">
                  <span className="inline-block bg-amber-50 text-[#D97706] text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border border-amber-100">
                    Medium
                  </span>
                  <h4 className="text-[14px] font-bold text-[#111827] mt-2.5">Design login page</h4>
                  <p className="text-[12px] text-slate-455 mt-1 leading-relaxed">
                    Create a modern and clean login page for the application.
                  </p>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>14 Jun</span>
                    </span>
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                      alt="user"
                      className="h-6 w-6 rounded-full object-cover border border-white shadow-sm"
                    />
                  </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-soft-sm hover:shadow-soft-md transition-shadow relative">
                  <span className="inline-block bg-red-50 text-red-700 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border border-red-100">
                    High
                  </span>
                  <h4 className="text-[14px] font-bold text-[#111827] mt-2.5">API Integration</h4>
                  <p className="text-[12px] text-slate-455 mt-1 leading-relaxed">
                    Integrate backend APIs for task management and authentication.
                  </p>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>16 Jun</span>
                    </span>
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                      alt="user"
                      className="h-6 w-6 rounded-full object-cover border border-white shadow-sm"
                    />
                  </div>
                </div>

                <button className="w-full py-2.5 border border-[#E5E7EB] border-dashed hover:border-slate-350 rounded-[12px] flex items-center justify-center text-[12px] font-bold text-slate-450 hover:text-slate-700 bg-white transition cursor-pointer">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[16px] p-4 flex flex-col space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="font-bold text-sm text-[#111827] font-sans">In Progress</span>
                  <span className="text-[11px] font-bold text-slate-400 bg-white border border-[#E5E7EB] px-1.5 py-0.2 rounded-md">
                    8
                  </span>
                </div>
                <div className="flex space-x-1 text-slate-400">
                  <button className="p-0.5 hover:text-slate-700"><Plus className="h-3.5 w-3.5" /></button>
                  <button className="p-0.5 hover:text-slate-700"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                </div>
              </div>

              {/* Task Cards Stack */}
              <div className="space-y-3">
                <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-soft-sm hover:shadow-soft-md transition-shadow relative">
                  <span className="inline-block bg-red-50 text-red-700 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border border-red-100">
                    High
                  </span>
                  <h4 className="text-[14px] font-bold text-[#111827] mt-2.5">Dashboard UI</h4>
                  <p className="text-[12px] text-slate-455 mt-1 leading-relaxed">
                    Build the main dashboard interface with all components.
                  </p>
                  <div className="mt-3.5 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                      <span>Progress</span>
                      <span>60%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#6366F1] h-full w-[60%]" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>13 Jun</span>
                    </span>
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      alt="user"
                      className="h-6 w-6 rounded-full object-cover border border-white shadow-sm"
                    />
                  </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-soft-sm hover:shadow-soft-md transition-shadow relative">
                  <span className="inline-block bg-amber-50 text-[#D97706] text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border border-amber-100">
                    Medium
                  </span>
                  <h4 className="text-[14px] font-bold text-[#111827] mt-2.5">User authentication</h4>
                  <p className="text-[12px] text-slate-455 mt-1 leading-relaxed">
                    Implement JWT authentication system and protected routes.
                  </p>
                  <div className="mt-3.5 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                      <span>Progress</span>
                      <span>40%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#6366F1] h-full w-[40%]" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>15 Jun</span>
                    </span>
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                      alt="user"
                      className="h-6 w-6 rounded-full object-cover border border-white shadow-sm"
                    />
                  </div>
                </div>

                <button className="w-full py-2.5 border border-[#E5E7EB] border-dashed hover:border-slate-350 rounded-[12px] flex items-center justify-center text-[12px] font-bold text-slate-455 hover:text-slate-700 bg-white transition cursor-pointer">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

            {/* Column 3: Completed */}
            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[16px] p-4 flex flex-col space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-bold text-sm text-[#111827] font-sans">Completed</span>
                  <span className="text-[11px] font-bold text-slate-400 bg-white border border-[#E5E7EB] px-1.5 py-0.2 rounded-md">
                    10
                  </span>
                </div>
                <div className="flex space-x-1 text-slate-400">
                  <button className="p-0.5 hover:text-slate-700"><Plus className="h-3.5 w-3.5" /></button>
                  <button className="p-0.5 hover:text-slate-700"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                </div>
              </div>

              {/* Task Cards Stack */}
              <div className="space-y-3">
                <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-soft-sm opacity-80 relative">
                  <span className="inline-block bg-slate-50 text-slate-500 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border border-slate-200/60">
                    Low
                  </span>
                  <h4 className="text-[14px] font-bold text-slate-500 mt-2.5 line-through">Setup project repo</h4>
                  <p className="text-[12px] text-slate-400 mt-1 leading-relaxed line-through">
                    Initialize project repository and setup CI/CD pipeline.
                  </p>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>10 Jun</span>
                    </span>
                    <img
                      src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80"
                      alt="user"
                      className="h-6 w-6 rounded-full object-cover border border-white shadow-sm"
                    />
                  </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-soft-sm opacity-80 relative">
                  <span className="inline-block bg-slate-50 text-slate-500 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border border-slate-200/60">
                    Low
                  </span>
                  <h4 className="text-[14px] font-bold text-slate-500 mt-2.5 line-through">Database optimization</h4>
                  <p className="text-[12px] text-slate-400 mt-1 leading-relaxed line-through">
                    Optimize database queries and improve performance.
                  </p>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>11 Jun</span>
                    </span>
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                      alt="user"
                      className="h-6 w-6 rounded-full object-cover border border-white shadow-sm"
                    />
                  </div>
                </div>

                <button className="w-full py-2.5 border border-[#E5E7EB] border-dashed hover:border-slate-350 rounded-[12px] flex items-center justify-center text-[12px] font-bold text-[#6B7280] bg-white transition cursor-pointer">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

          </div>

          {/* Pagination buttons footer */}
          <div className="flex items-center justify-between text-[13px] text-[#6B7280] font-semibold py-4 border-t border-[#E5E7EB] pt-6">
            <span>Showing 1–12 of 124 tasks</span>
            <div className="flex space-x-2">
              <button disabled className="px-3.5 py-1.5 border border-[#E5E7EB] rounded-[12px] bg-white text-slate-400 cursor-not-allowed">
                Previous
              </button>
              <button className="px-3.5 py-1.5 border border-[#E5E7EB] rounded-[12px] bg-white hover:bg-slate-50 text-slate-700 cursor-pointer">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Activity Log Column (1/4 span) */}
        <div className="xl:col-span-1 bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-[#111827] font-sans">
              Activity Log
            </h3>
            <button className="text-xs text-[#6366F1] font-bold hover:underline cursor-pointer">
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
