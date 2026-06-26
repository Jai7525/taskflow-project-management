import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, Trash2, Eye, MoreVertical, Calendar } from 'lucide-react';
import { statusColor, priorityColor } from '../../utils/colorHelpers';
import { formatDate } from '../../utils/formatDate';
import { truncateText } from '../../utils/truncateText';
import { TASK_STATUS } from '../../constants/status';

/**
 * Individual task card component conforming to Locked Workspace UI guidelines.
 * Pure white card, very subtle shadow, 16px border-radius, soft borders.
 * Uses event propagation stops to avoid bubbling to details view trigger.
 */
const TaskCard = ({ task, onComplete, onDelete }) => {
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

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    if (!isCompleted) {
      onComplete(task.id);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(task);
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className={`bg-white border rounded-2xl px-5 py-4 shadow-soft-sm hover:shadow-soft-md transition-all duration-200 group border-slate-200 ${
      isCompleted ? 'opacity-70' : ''
    }`}>
      <div className="flex items-start justify-between gap-4">
        {/* Left: Checkbox + Content */}
        <div className="flex items-start space-x-3.5 min-w-0 flex-1">
          {/* Completion Checkbox */}
          <button
            onClick={handleCheckboxClick}
            disabled={isCompleted}
            className={`mt-0.5 h-5 w-5 rounded-full border flex-shrink-0 flex items-center justify-center transition focus:outline-none ${
              isCompleted
                ? 'border-green-500 bg-green-500 text-white cursor-default'
                : 'border-slate-300 hover:border-indigo-500 cursor-pointer'
            }`}
            title={isCompleted ? 'Task Completed' : 'Mark as Complete'}
          >
            {isCompleted && <CheckCircle className="h-3.5 w-3.5" />}
          </button>

          {/* Task Info */}
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className={`text-[14px] font-bold text-slate-800 leading-snug font-sans ${
              isCompleted ? 'line-through text-slate-400' : ''
            }`}>
              {task.title}
            </h3>
            <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
              {truncateText(task.description, 80)}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2.5">
              {/* Status Badge */}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${statusColor(task.status)}`}>
                {task.status}
              </span>

              {/* Priority Badge */}
              {task.priority && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${priorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <span className="inline-flex items-center space-x-1 text-[11px] text-slate-400 font-semibold">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-1 shrink-0">
          {/* Delete Icon */}
          <button
            onClick={handleDeleteClick}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          {/* Three-Dot Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={handleMenuToggle}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-soft-lg z-20 py-1 overflow-hidden">
                {!isCompleted && (
                  <button
                    onClick={(e) => { handleCheckboxClick(e); setMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center space-x-2 transition cursor-pointer"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-slate-400" />
                    <span>Complete Task</span>
                  </button>
                )}
                <button
                  onClick={(e) => { handleDeleteClick(e); setMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2 transition cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-400" />
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
