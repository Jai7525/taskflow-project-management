import React from 'react';
import { Activity, CirclePlus, Pencil, RefreshCw, Trash2, Clock } from 'lucide-react';

/**
 * Translates timestamp to relative time string (e.g. Just now, 5 minutes ago, Yesterday).
 */
const getRelativeTime = (dateVal) => {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '';
  
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  
  if (diffSec < 60) {
    return 'Just now';
  } else if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHr < 24) {
    return `${diffHr} ${diffHr === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Day-boundary checks
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((today - itemDate) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

/**
 * Returns an icon based on activity action text conforming to Phase 8H specs.
 */
const getActivityIcon = (action) => {
  const lowerAction = action?.toLowerCase() || '';

  if (lowerAction.includes('completed')) return RefreshCw;
  if (lowerAction.includes('status')) return RefreshCw;
  if (lowerAction.includes('created')) return CirclePlus;
  if (lowerAction.includes('deleted')) return Trash2;
  if (lowerAction.includes('updated')) return Pencil;
  return Clock;
};

/**
 * Returns color classes based on activity action.
 */
const getActivityColor = (action) => {
  const lowerAction = action?.toLowerCase() || '';

  if (lowerAction.includes('completed')) return 'bg-green-50 text-green-600 border-green-100';
  if (lowerAction.includes('status')) return 'bg-blue-50 text-blue-600 border-blue-100';
  if (lowerAction.includes('created')) return 'bg-blue-50 text-blue-600 border-blue-100';
  if (lowerAction.includes('deleted')) return 'bg-red-50 text-red-600 border-red-100';
  if (lowerAction.includes('updated')) return 'bg-amber-50 text-amber-600 border-amber-100';
  return 'bg-slate-100 text-slate-500 border-slate-200';
};

/**
 * Dynamic Activity Log component supporting hover indicators,
 * relative timestamps, skeleton loading states, empty panels, and inline error retries.
 */
const RecentActivity = ({ activities, isLoading, error, onRetry, onActivityClick }) => {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-4 p-4">
            <div className="h-9 w-9 rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2 py-0.5">
              <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-slate-50 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3 select-none">
        <span className="text-red-500 text-lg font-bold">⚠️</span>
        <p className="text-xs text-red-500 font-semibold">{error}</p>
        <button
          onClick={onRetry}
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 select-none">
        <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-3.5 border border-slate-100/60 shadow-sm">
          <Activity className="h-6 w-6 text-slate-400" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">No recent activity</h4>
        <p className="text-xs text-slate-400 mt-1.5 max-w-[260px] leading-relaxed">
          Recent updates will appear here once you start creating or editing tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
      {activities.map((activity) => {
        const Icon = getActivityIcon(activity.action);
        const colorClasses = getActivityColor(activity.action);

        return (
          <div
            key={activity.id}
            onClick={() => onActivityClick && onActivityClick(activity)}
            className="flex items-start space-x-4 p-4 rounded-xl hover:bg-[#F8FAFC] transition-colors duration-180 cursor-pointer select-none"
          >
            {/* Icon Badge */}
            <div className={`h-9 w-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorClasses} mt-0.5`}>
              <Icon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {activity.task?.title ? (
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {activity.task.title}
                </p>
              ) : (
                <p className="text-sm font-semibold text-slate-900 truncate">
                  Deleted Task
                </p>
              )}
              <p className="text-xs font-medium text-slate-500 truncate mt-1">
                {activity.task ? activity.action : 'Deleted'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                {getRelativeTime(activity.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentActivity;
