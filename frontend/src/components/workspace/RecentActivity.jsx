import React from 'react';
import { Activity, CheckCircle, Plus, Trash2, Edit3, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import Skeleton from '../ui/Skeleton';

/**
 * Returns an icon based on activity action text
 */
const getActivityIcon = (action) => {
  const lowerAction = action?.toLowerCase() || '';

  if (lowerAction.includes('completed')) return CheckCircle;
  if (lowerAction.includes('created')) return Plus;
  if (lowerAction.includes('deleted')) return Trash2;
  if (lowerAction.includes('updated')) return Edit3;
  return Clock;
};

/**
 * Returns color classes based on activity action
 */
const getActivityColor = (action) => {
  const lowerAction = action?.toLowerCase() || '';

  if (lowerAction.includes('completed')) return 'bg-success-50 text-success-600 border-success-100';
  if (lowerAction.includes('created')) return 'bg-brand-50 text-brand-600 border-brand-100';
  if (lowerAction.includes('deleted')) return 'bg-danger-50 text-danger-600 border-danger-100';
  if (lowerAction.includes('updated')) return 'bg-warning-50 text-warning-600 border-warning-100';
  return 'bg-slate-100 text-slate-500 border-slate-200';
};

/**
 * Recent activity timeline listing panel
 */
const RecentActivity = ({ activities, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center mb-3">
          <Activity className="h-5 w-5 text-slate-400" />
        </div>
        <p className="text-sm text-slate-500 font-medium">No recent activity</p>
        <p className="text-xs text-slate-400 mt-0.5">Start using TaskFlow to see activity here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const Icon = getActivityIcon(activity.action);
        const colorClasses = getActivityColor(activity.action);

        return (
          <div key={activity.id} className="flex items-start space-x-3">
            {/* Icon Badge */}
            <div className={`h-8 w-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${colorClasses}`}>
              <Icon className="h-3.5 w-3.5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {activity.action}
              </p>
              {activity.task?.title && (
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {activity.task.title}
                </p>
              )}
              <p className="text-xs text-slate-400 mt-0.5">
                {formatDate(activity.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentActivity;
