import React from 'react';

/**
 * Premium Outlined Pulse Skeleton Loader layout matching task details mock (Phase 8F).
 */
const TaskDetailsSkeleton = () => {
  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto select-none">
      {/* Title pulse */}
      <div className="space-y-2">
        <div className="h-4 bg-slate-200/60 rounded-md animate-pulse w-24" />
        <div className="h-7 bg-slate-100 rounded-lg animate-pulse w-3/4" />
      </div>

      {/* Attributes table mock layout */}
      <div className="border border-[#E5E7EB] rounded-2xl p-5 space-y-4 bg-slate-50/40">
        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="space-y-1">
              <div className="h-3 bg-slate-200/60 rounded-md animate-pulse w-14" />
              <div className="h-4.5 bg-slate-100 rounded-md animate-pulse w-28" />
            </div>
          ))}
        </div>
      </div>

      {/* Description block */}
      <div className="space-y-2.5">
        <div className="h-3 bg-slate-200/60 rounded-md animate-pulse w-20" />
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-3">
          <div className="h-3.5 bg-slate-100 rounded-md animate-pulse w-full" />
          <div className="h-3.5 bg-slate-100 rounded-md animate-pulse w-11/12" />
          <div className="h-3.5 bg-slate-100 rounded-md animate-pulse w-4/5" />
        </div>
      </div>

      {/* Activity log indicator */}
      <div className="space-y-3">
        <div className="h-3.5 bg-slate-200/60 rounded-md animate-pulse w-16" />
        <div className="flex items-center space-x-3.5">
          <div className="h-6 w-6 bg-slate-200/60 rounded-full animate-pulse shrink-0" />
          <div className="h-3.5 bg-slate-100 rounded-md animate-pulse w-1/2" />
        </div>
        <div className="flex items-center space-x-3.5">
          <div className="h-6 w-6 bg-slate-200/60 rounded-full animate-pulse shrink-0" />
          <div className="h-3.5 bg-slate-100 rounded-md animate-pulse w-2/3" />
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsSkeleton;
