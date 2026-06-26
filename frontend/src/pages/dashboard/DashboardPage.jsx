import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, Loader, CheckCircle2, ChevronLeft, ChevronRight, Plus, Calendar, MoreHorizontal } from 'lucide-react';
import WorkspaceHeader from '../../components/dashboard/WorkspaceHeader';

/**
 * Enterprise Workspace Dashboard Page.
 * High-fidelity static mockup of the approved design for Phase 8A Visual Refinement.
 */
const DashboardPage = () => {
  return (
    <div className="space-y-8 pb-10 w-full overflow-hidden">
      
      {/* ── Page Header Greeting ── */}
      <WorkspaceHeader />

      {/* ── Today's Focus (4 Metrics Cards with Mock Mini SVG Charts) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {/* Card 1: Total Tasks */}
        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650">
                <ClipboardList className="h-4.5 w-4.5" />
              </div>
              <span className="text-[13px] font-bold text-[#6B7280]">Total Tasks</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#111827] leading-none">124</h2>
            <span className="text-[11px] text-[#6B7280] font-medium block">vs last 7 days</span>
          </div>
          <div className="flex flex-col items-end space-y-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F0] text-[#10B981]">
              ▲ 12%
            </span>
            {/* Sparkline chart path */}
            <svg className="w-16 h-8 text-[#10B981]" viewBox="0 0 100 40">
              <path
                d="M0,35 Q15,20 30,25 T60,10 T90,5 L100,5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Pending */}
        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706]">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <span className="text-[13px] font-bold text-[#6B7280]">Pending</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#111827] leading-none">42</h2>
            <span className="text-[11px] text-[#6B7280] font-medium block">vs last 7 days</span>
          </div>
          <div className="flex flex-col items-end space-y-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#D97706]">
              ▲ 8%
            </span>
            <svg className="w-16 h-8 text-[#F59E0B]" viewBox="0 0 100 40">
              <path
                d="M0,30 Q20,35 40,20 T80,25 T100,15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-650">
                <Loader className="h-4.5 w-4.5" />
              </div>
              <span className="text-[13px] font-bold text-[#6B7280]">In Progress</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#111827] leading-none">34</h2>
            <span className="text-[11px] text-[#6B7280] font-medium block">vs last 7 days</span>
          </div>
          <div className="flex flex-col items-end space-y-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-650">
              ▲ 5%
            </span>
            <svg className="w-16 h-8 text-blue-500" viewBox="0 0 100 40">
              <path
                d="M0,25 Q15,30 30,15 T70,35 T100,5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Completed */}
        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-[#16A34A]">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
              <span className="text-[13px] font-bold text-[#6B7280]">Completed</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#111827] leading-none">48</h2>
            <span className="text-[11px] text-[#6B7280] font-medium block">vs last 7 days</span>
          </div>
          <div className="flex flex-col items-end space-y-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F0] text-[#10B981]">
              ▲ 16%
            </span>
            <svg className="w-16 h-8 text-[#10B981]" viewBox="0 0 100 40">
              <path
                d="M0,35 Q20,30 40,15 T80,10 T100,2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Signature Task Timeline (Horizontal Date Rail Placeholder) ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#111827] tracking-tight font-sans">
            Task Timeline
          </h2>
          <div className="flex items-center space-x-2">
            <button className="px-3.5 py-1.5 border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#111827] bg-[#F6F8FB] hover:bg-slate-50 cursor-pointer">
              Today
            </button>
            <button className="p-1.5 border border-[#E5E7EB] rounded-xl text-[#6B7280] hover:text-[#111827] bg-white cursor-pointer">
              <Calendar className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Horizontal scroll dates line */}
        <div className="relative flex items-center justify-between">
          <button className="p-2 border border-[#E5E7EB] rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-800 shrink-0 cursor-pointer">
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex-1 flex justify-around items-center px-4 overflow-x-auto scrollbar-none space-x-2">
            {/* Thu 11 Jun */}
            <div className="flex flex-col items-center py-2 text-center select-none shrink-0">
              <span className="text-[13px] text-slate-400 font-semibold">Thu</span>
              <span className="text-[14px] text-slate-700 font-bold mt-1">11 Jun</span>
              <span className="text-[10px] text-slate-400 font-bold mt-3">2 tasks</span>
            </div>

            {/* Fri 12 Jun */}
            <div className="flex flex-col items-center py-2 text-center select-none shrink-0">
              <span className="text-[13px] text-slate-400 font-semibold">Fri</span>
              <span className="text-[14px] text-slate-700 font-bold mt-1">12 Jun</span>
              <span className="text-[10px] text-slate-400 font-bold mt-3">4 tasks</span>
            </div>

            {/* Sat 13 Jun (Today selected highlighted) */}
            <div className="bg-[#111827] text-white px-5 py-4.5 rounded-[16px] flex flex-col items-center justify-center text-center shadow-lg relative shrink-0 min-w-[110px]">
              <span className="absolute -top-1.5 bg-[#6366F1] text-white text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full select-none">
                Today
              </span>
              <span className="text-[12px] text-slate-400 font-semibold">Sat</span>
              <span className="text-[18px] text-white font-extrabold mt-0.5 leading-none">13 Jun</span>
              {/* Dot indicators */}
              <div className="flex space-x-1 mt-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              </div>
              <span className="text-[10px] text-slate-350 font-bold mt-2">6 tasks</span>
            </div>

            {/* Sun 14 Jun */}
            <div className="flex flex-col items-center py-2 text-center select-none shrink-0">
              <span className="text-[13px] text-slate-400 font-semibold">Sun</span>
              <span className="text-[14px] text-slate-700 font-bold mt-1">14 Jun</span>
              <span className="inline-block bg-blue-50 text-blue-600 text-[8px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full mt-2.5">
                Design Review
              </span>
            </div>

            {/* Mon 15 Jun */}
            <div className="flex flex-col items-center py-2 text-center select-none shrink-0">
              <span className="text-[13px] text-slate-400 font-semibold">Mon</span>
              <span className="text-[14px] text-slate-700 font-bold mt-1">15 Jun</span>
              <span className="inline-block bg-green-50 text-green-600 text-[8px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full mt-2.5">
                API Review
              </span>
            </div>

            {/* Tue 16 Jun */}
            <div className="flex flex-col items-center py-2 text-center select-none shrink-0">
              <span className="text-[13px] text-slate-400 font-semibold">Tue</span>
              <span className="text-[14px] text-slate-700 font-bold mt-1">16 Jun</span>
              <span className="text-[10px] text-slate-400 font-bold mt-3">1 task</span>
            </div>

            {/* Wed 17 Jun */}
            <div className="flex flex-col items-center py-2 text-center select-none shrink-0">
              <span className="text-[13px] text-slate-400 font-semibold">Wed</span>
              <span className="text-[14px] text-slate-700 font-bold mt-1">17 Jun</span>
              <span className="text-[10px] text-slate-400 font-bold mt-3">2 tasks</span>
            </div>
          </div>

          <button className="p-2 border border-[#E5E7EB] rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-800 shrink-0 cursor-pointer">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

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
                {/* Card 1 */}
                <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-soft-sm hover:shadow-soft-md transition-shadow relative">
                  <span className="inline-block bg-amber-50 text-[#D97706] text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border border-amber-100">
                    Medium
                  </span>
                  <h4 className="text-[14px] font-bold text-[#111827] mt-2.5">Design login page</h4>
                  <p className="text-[12px] text-slate-450 mt-1 leading-relaxed">
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

                {/* Card 2 */}
                <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-soft-sm hover:shadow-soft-md transition-shadow relative">
                  <span className="inline-block bg-red-50 text-red-700 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border border-red-100">
                    High
                  </span>
                  <h4 className="text-[14px] font-bold text-[#111827] mt-2.5">API Integration</h4>
                  <p className="text-[12px] text-slate-450 mt-1 leading-relaxed">
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

                {/* Add Task Trigger layout row */}
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
                {/* Card 1 */}
                <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-soft-sm hover:shadow-soft-md transition-shadow relative">
                  <span className="inline-block bg-red-50 text-red-700 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border border-red-100">
                    High
                  </span>
                  <h4 className="text-[14px] font-bold text-[#111827] mt-2.5">Dashboard UI</h4>
                  <p className="text-[12px] text-slate-455 mt-1 leading-relaxed">
                    Build the main dashboard interface with all components.
                  </p>
                  {/* Progress indicator */}
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

                {/* Card 2 */}
                <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-soft-sm hover:shadow-soft-md transition-shadow relative">
                  <span className="inline-block bg-amber-50 text-[#D97706] text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border border-amber-100">
                    Medium
                  </span>
                  <h4 className="text-[14px] font-bold text-[#111827] mt-2.5">User authentication</h4>
                  <p className="text-[12px] text-slate-455 mt-1 leading-relaxed">
                    Implement JWT authentication system and protected routes.
                  </p>
                  {/* Progress indicator */}
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
                {/* Card 1 */}
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

                {/* Card 2 */}
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
            {/* Entry 1 */}
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

            {/* Entry 2 */}
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

            {/* Entry 3 */}
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

            {/* Entry 4 */}
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
