import React from 'react';

/**
 * Shimmer skeleton placeholder for Today's Focus statistics cards.
 * Prevents layout shift by matching the exact size parameters.
 */
const StatisticSkeleton = () => {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.08)] h-[132px] flex flex-col justify-center animate-pulse">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-lg bg-slate-100 shrink-0" />
          <div className="h-3.5 bg-slate-150 rounded w-20" />
        </div>
        <div className="h-8 bg-slate-100 rounded w-16" />
        <div className="h-3 bg-slate-150 rounded w-24" />
      </div>
    </div>
  );
};

export default StatisticSkeleton;
