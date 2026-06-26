import React from 'react';
import { Calendar, Clock, User, Award, CheckCircle } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatDate';

/**
 * Premium Read-Only Details layout view for Tasks details (Phase 8F).
 */
const TaskDetailsView = ({ task }) => {
  const getPriorityVariant = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'medium';
      case 'low':
      default:
        return 'low';
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'in progress':
        return 'progress';
      case 'pending':
      default:
        return 'pending';
    }
  };

  // Safe formatting helpers
  const formatDateTime = (dateVal) => {
    if (!dateVal) return 'Not available';
    const date = new Date(dateVal);
    if (isNaN(date.getTime())) return 'Not available';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5 flex flex-col scrollbar-none select-none">
      
      {/* ── Title ── */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#111827] leading-snug font-sans tracking-tight">
          {task.title}
        </h1>
      </div>

      {/* ── Description ── */}
      <div>
        <p className="text-sm text-[#6B7280] leading-[1.6] line-clamp-3 whitespace-pre-wrap select-text max-w-prose">
          {task.description || 'No description provided for this task.'}
        </p>
      </div>

      {/* ── Parameters Outlined Box ── */}
      <div className="border border-slate-100 bg-[#F8FAFC]/80 rounded-[20px] p-6">
        <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-xs">
          {/* Status */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Status
            </span>
            <span className="font-semibold text-slate-700 flex items-center space-x-1.5 mt-0.5">
              <span className={`h-2 w-2 rounded-full ${
                task.status === 'Completed' ? 'bg-green-500' : task.status === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'
              }`} />
              <span>{task.status}</span>
            </span>
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Priority
            </span>
            <div className="mt-0.5">
              <Badge variant={getPriorityVariant(task.priority)}>
                {task.priority || 'Medium'}
              </Badge>
            </div>
          </div>

          {/* Created Date */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Created
            </span>
            <span className="font-semibold text-slate-700 flex items-center space-x-1.5 mt-0.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{formatDateTime(task.createdAt)}</span>
            </span>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Due Date
            </span>
            <span className="font-semibold text-slate-700 flex items-center space-x-1.5 mt-0.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{task.dueDate ? formatDate(task.dueDate) : 'No due date'}</span>
            </span>
          </div>

          {/* Created By Assignee */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Created By
            </span>
            <div className="flex items-center space-x-2 mt-0.5">
              <div className="h-6 w-6 rounded-full bg-indigo-55 text-[#6366F1] flex items-center justify-center text-[10px] font-bold border border-indigo-100 shadow-sm select-none shrink-0">
                JM
              </div>
              <span className="font-bold text-slate-700 text-xs">Jayakumar M</span>
            </div>
          </div>

          {/* Updated Date */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Updated
            </span>
            <span className="font-semibold text-slate-700 flex items-center space-x-1.5 mt-0.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{formatDateTime(task.updatedAt)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Mock Activity Log ── */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Activity
        </h3>
        
        <div className="relative border-l-2 border-slate-100 ml-3 pl-6 space-y-6">
          {/* Activity 1 */}
          <div className="relative">
            <div className="absolute -left-[38px] top-0">
              <div className="h-6 w-6 rounded-full bg-indigo-55 text-[#6366F1] flex items-center justify-center text-[10px] font-bold ring-4 ring-white select-none shrink-0">
                JM
              </div>
            </div>
            <div className="text-xs">
              <p className="text-slate-650">
                <span className="font-semibold text-slate-900">Jayakumar M</span> updated the task status
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {task.updatedAt ? formatDateTime(task.updatedAt) : 'Just now'}
              </span>
            </div>
          </div>

          {/* Activity 2 */}
          <div className="relative">
            <div className="absolute -left-[38px] top-0">
              <div className="h-6 w-6 rounded-full bg-indigo-55 text-[#6366F1] flex items-center justify-center text-[10px] font-bold ring-4 ring-white select-none shrink-0">
                JM
              </div>
            </div>
            <div className="text-xs">
              <p className="text-slate-650">
                <span className="font-semibold text-slate-900">Jayakumar M</span> created this task
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {task.createdAt ? formatDateTime(task.createdAt) : 'Just now'}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TaskDetailsView;
