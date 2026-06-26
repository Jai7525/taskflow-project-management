import React from 'react';

/**
 * Shimmer skeleton placeholder for Today's Focus statistics cards.
 * Prevents layout shift by matching the exact size parameters.
 */
const StatisticSkeleton = () => {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] h-[132px] flex items-center justify-between animate-pulse">
      <div className="space-y-3.5 flex-1">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-lg bg-slate-100 shrink-0" />
          <div className="h-3.5 bg-slate-150 rounded w-20" />
        </div>
        <div className="h-7 bg-slate-100 rounded w-16" />
        <div className="h-3 bg-slate-150 rounded w-24" />
      </div>
      <div className="flex flex-col items-end space-y-4">
        <div className="h-4 bg-slate-150 rounded-full w-10" />
        <div className="h-6 bg-slate-100 rounded w-16" />
      </div>
    </div>
  );
};

export default StatisticSkeleton;
