import React from 'react';
import { Activity, CirclePlus, Pencil, RefreshCw, Trash2, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
 * Returns an icon based on activity action text.
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
 * Returns semantic color classes based on activity action.
 */
const getActivityColor = (action) => {
  const lowerAction = action?.toLowerCase() || '';

  if (lowerAction.includes('completed')) return 'bg-green-50 text-green-600 border-green-150/40';
  if (lowerAction.includes('status')) return 'bg-blue-50 text-blue-600 border-blue-150/40';
  if (lowerAction.includes('created')) return 'bg-blue-50 text-blue-600 border-blue-150/40';
  if (lowerAction.includes('deleted')) return 'bg-red-50 text-red-600 border-red-150/40';
  if (lowerAction.includes('updated')) return 'bg-amber-50 text-amber-600 border-amber-150/40';
  return 'bg-slate-50 text-slate-500 border-slate-200';
};

const RecentActivity = ({ activities, isLoading, error, onRetry, onActivityClick }) => {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-[18px]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 p-4 h-[78px] border border-slate-100/80 rounded-xl bg-slate-50/20 animate-pulse w-full"
          >
            <div className="h-10 w-10 rounded-xl bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-2 py-0.5">
              <div className="h-4 bg-slate-100 rounded w-1/4" />
              <div className="h-3 bg-slate-50 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    const isOffline = error.toLowerCase().includes("offline");
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3.5 select-none h-full">
        <div className="h-9 w-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shrink-0">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-800 font-sans">
            {isOffline ? "You're offline." : "Unable to load activity"}
          </p>
          <p className="text-xs text-slate-400 font-medium">
            {isOffline ? "Check your connection." : "Please try again later."}
          </p>
        </div>
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
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 select-none h-full">
        <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-3.5 border border-slate-100/60 shadow-sm shrink-0">
          <Activity className="h-6 w-6 text-slate-400" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">No activity yet</h4>
        <p className="text-xs text-slate-450 mt-1.5 max-w-[260px] leading-relaxed">
          Your task history will appear here.
        </p>
        <span className="text-[11px] font-bold text-[#6366F1] mt-3">
          Create your first task.
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pr-1 space-y-[18px] custom-scrollbar w-full">
      {activities.map((activity) => {
        const Icon = getActivityIcon(activity.action);
        const colorClasses = getActivityColor(activity.action);

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            whileHover={{ y: -2 }}
            tabIndex={0}
            onClick={() => onActivityClick && onActivityClick(activity)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onActivityClick && onActivityClick(activity);
              }
            }}
            className="flex items-center space-x-4 px-[18px] h-[78px] rounded-xl border border-slate-100 bg-white hover:border-slate-200/80 transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:-translate-y-0.5 focus-visible:shadow-[0_4px_12px_rgba(15,23,42,0.06)] focus-visible:border-slate-300 focus-visible:ring-2 focus-visible:ring-[#6366F1]/15 shadow-[0_1px_3px_rgba(15,23,42,0.01)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
          >
            {/* Left Action Icon */}
            <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${colorClasses}`}>
              <Icon className="h-4.5 w-4.5" />
            </div>

            {/* Center Content */}
            <div className="flex-1 min-w-0">
              {activity.task?.title ? (
                <p className="text-[16px] font-semibold text-slate-900 leading-tight truncate">
                  {activity.task.title}
                </p>
              ) : (
                <p className="text-[16px] font-semibold text-slate-900 leading-tight truncate">
                  Deleted Task
                </p>
              )}
              <div className="flex items-baseline space-x-2.5 mt-1 truncate">
                <span className="text-[15px] font-medium text-slate-500">
                  {activity.task ? activity.action : 'Deleted'}
                </span>
                <span className="text-[13px] text-slate-400 font-medium">
                  • {getRelativeTime(activity.createdAt)}
                </span>
              </div>
            </div>
            
            {/* Right: Empty */}
          </motion.div>
        );
      })}
    </div>
  );
};

export default RecentActivity;
