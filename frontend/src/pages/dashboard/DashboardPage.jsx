import React from 'react';
import WorkspaceHeader from '../../components/dashboard/WorkspaceHeader';
import PlaceholderCard from '../../components/dashboard/PlaceholderCard';

/**
 * Workspace page representing Phase 8A static visual shell layout.
 * Conforming to spacing parameters and styling regulations.
 */
const DashboardPage = () => {
  return (
    <div className="space-y-[32px] w-full">
      {/* Workspace Header Title Block */}
      <WorkspaceHeader />

      {/* Today's Focus Section */}
      <div className="space-y-[16px]">
        <h2 className="text-[22px] font-bold text-[#111827] tracking-tight font-sans">
          Today's Focus
        </h2>
        <PlaceholderCard>
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-[#E5E7EB] rounded-[16px] bg-[#F6F8FB]/50">
            <span className="text-3xl mb-3 select-none">🎯</span>
            <p className="text-[16px] font-semibold text-[#111827]">Today's Focus Placeholder</p>
            <p className="text-[13px] text-[#6B7280] mt-1">Focus details will appear here once tasks are active.</p>
          </div>
        </PlaceholderCard>
      </div>

      {/* Task Timeline Section */}
      <div className="space-y-[16px]">
        <h2 className="text-[22px] font-bold text-[#111827] tracking-tight font-sans">
          Task Timeline
        </h2>
        <PlaceholderCard>
          <div className="flex items-center space-x-3 overflow-x-auto pb-1 scrollbar-none">
            {['Today', 'Tomorrow', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'].map((day, idx) => (
              <div
                key={day}
                className={`flex-1 min-w-[100px] border p-4 rounded-[16px] text-left select-none ${
                  idx === 0
                    ? 'border-[#6366F1] bg-[#eef2ff]/30'
                    : 'border-[#E5E7EB]'
                }`}
              >
                <p className={`text-xs font-bold ${idx === 0 ? 'text-[#6366F1]' : 'text-[#6B7280]'}`}>
                  {day}
                </p>
                <div className="h-2.5 w-10 bg-[#E5E7EB] rounded-md animate-pulse mt-3" />
              </div>
            ))}
          </div>
        </PlaceholderCard>
      </div>

      {/* Task Board Section */}
      <div className="space-y-[16px]">
        <h2 className="text-[22px] font-bold text-[#111827] tracking-tight font-sans">
          My Tasks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          {/* Pending placeholder column */}
          <PlaceholderCard title="Pending">
            <div className="space-y-4">
              <div className="h-16 border border-[#E5E7EB] border-dashed rounded-[12px] flex items-center justify-center text-xs text-[#6B7280] bg-[#F6F8FB]/30">
                No pending tasks
              </div>
            </div>
          </PlaceholderCard>

          {/* In Progress placeholder column */}
          <PlaceholderCard title="In Progress">
            <div className="space-y-4">
              <div className="h-16 border border-[#E5E7EB] border-dashed rounded-[12px] flex items-center justify-center text-xs text-[#6B7280] bg-[#F6F8FB]/30">
                No tasks in progress
              </div>
            </div>
          </PlaceholderCard>

          {/* Completed placeholder column */}
          <PlaceholderCard title="Completed">
            <div className="space-y-4">
              <div className="h-16 border border-[#E5E7EB] border-dashed rounded-[12px] flex items-center justify-center text-xs text-[#6B7280] bg-[#F6F8FB]/30">
                No completed tasks
              </div>
            </div>
          </PlaceholderCard>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <PlaceholderCard className="py-4">
          <div className="flex items-center justify-between text-[13px] text-[#6B7280] font-semibold">
            <span>Showing 0–0 of 0 tasks</span>
            <div className="flex space-x-2">
              <button disabled className="px-3.5 py-1.5 border border-[#E5E7EB] rounded-[12px] bg-[#F6F8FB] text-slate-400 cursor-not-allowed">
                Previous
              </button>
              <button disabled className="px-3.5 py-1.5 border border-[#E5E7EB] rounded-[12px] bg-[#F6F8FB] text-slate-400 cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </PlaceholderCard>
      </div>
    </div>
  );
};

export default DashboardPage;
