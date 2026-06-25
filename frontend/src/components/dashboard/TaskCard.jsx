import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, Trash2, Eye, MoreVertical, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { statusColor } from '../../utils/colorHelpers';
import { priorityColor } from '../../utils/colorHelpers';
import { formatDate } from '../../utils/formatDate';
import { truncateText } from '../../utils/truncateText';
import { TASK_STATUS } from '../../constants/status';
import { ROUTES } from '../../constants/routes';

/**
 * Individual task card/row component with action buttons and three-dot context menu.
 */
const TaskCard = ({ task, onComplete, onDelete }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isCompleted = task.status === TASK_STATUS.COMPLETED;

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleViewTask = () => {
    navigate(ROUTES.TASK_DETAILS.replace(':id', task.id));
  };

  return (
    <div className={`bg-white border rounded-xl px-5 py-4 shadow-soft-sm transition-all duration-200 hover:shadow-soft-md hover:border-slate-300 group ${
      isCompleted ? 'opacity-75 border-slate-200' : 'border-slate-200'
    }`}>
      <div className="flex items-start justify-between gap-4">
        {/* Left: Checkbox + Content */}
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          {/* Completion Checkbox */}
          <button
            onClick={() => !isCompleted && onComplete(task.id)}
            disabled={isCompleted}
            className={`mt-0.5 h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all focus:outline-none ${
              isCompleted
                ? 'border-success-500 bg-success-500 text-white cursor-default'
                : 'border-slate-300 hover:border-brand-500 cursor-pointer group-hover:border-brand-400'
            }`}
            title={isCompleted ? 'Task Completed' : 'Mark as Complete'}
            aria-label={isCompleted ? 'Task is completed' : 'Mark task as complete'}
          >
            {isCompleted && <CheckCircle className="h-3.5 w-3.5" />}
          </button>

          {/* Task Info */}
          <div className="min-w-0 flex-1">
            <h3 className={`text-sm font-semibold text-slate-900 leading-snug font-sans ${
              isCompleted ? 'line-through text-slate-400' : ''
            }`}>
              {task.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {truncateText(task.description, 90)}
            </p>

            {/* Badges + Date Row */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {/* Status Badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor(task.status)}`}>
                {task.status}
              </span>

              {/* Priority Badge */}
              {task.priority && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${priorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <span className="inline-flex items-center space-x-1 text-xs text-slate-400">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* View Button */}
          <button
            onClick={handleViewTask}
            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition cursor-pointer"
            title="View Task Details"
            aria-label="View task details"
          >
            <Eye className="h-4 w-4" />
          </button>

          {/* Complete Button */}
          {!isCompleted && (
            <button
              onClick={() => onComplete(task.id)}
              className="p-2 text-slate-400 hover:text-success-600 hover:bg-success-50 rounded-lg transition cursor-pointer"
              title="Mark as Complete"
              aria-label="Complete task"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={() => onDelete(task)}
            className="p-2 text-slate-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition cursor-pointer"
            title="Delete Task"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          {/* Three-Dot Context Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              aria-label="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-soft-lg z-20 py-1 overflow-hidden">
                <button
                  onClick={() => { handleViewTask(); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 transition cursor-pointer"
                >
                  <Eye className="h-4 w-4 text-slate-400" />
                  <span>View Details</span>
                </button>
                {!isCompleted && (
                  <button
                    onClick={() => { onComplete(task.id); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 transition cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4 text-slate-400" />
                    <span>Mark Complete</span>
                  </button>
                )}
                <div className="h-px bg-slate-100 mx-1 my-1" />
                <button
                  onClick={() => { onDelete(task); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 flex items-center space-x-2.5 transition cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Task</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
