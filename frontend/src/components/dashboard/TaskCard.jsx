import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatDate';

/**
 * Premium Task Card component conforming to Phase 8D visual guidelines.
 * Displays: Title, truncated description, due date, status/priority badges,
 * progress bars (for In Progress tasks only), assignee profile pictures,
 * and Framer Motion hover/entry transitions.
 */
const TaskCard = ({ task }) => {
  const isCompleted = task.status === 'Completed';

  // Helper to determine priority badge variants matching color spec
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-shadow relative select-none ${
        isCompleted ? 'opacity-85' : ''
      }`}
    >
      {/* Priority badge */}
      {task.priority && (
        <Badge variant={getPriorityVariant(task.priority)}>
          {task.priority}
        </Badge>
      )}

      {/* Task Title */}
      <h4 className={`text-[14px] font-bold mt-2.5 text-[#111827] leading-snug font-sans ${
        isCompleted ? 'line-through text-slate-400' : ''
      }`}>
        {task.title}
      </h4>

      {/* Description truncated after 2 lines */}
      <p className="text-[12px] text-slate-450 mt-1 leading-relaxed line-clamp-2">
        {task.description}
      </p>

      {/* Progress slider placeholder - only for "In Progress" status */}
      {task.status === 'In Progress' && (
        <div className="mt-3.5 space-y-1">
          <div className="flex justify-between text-[10px] text-slate-500 font-bold">
            <span>Progress</span>
            <span>60%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#6366F1] h-full w-[60%]" />
          </div>
        </div>
      )}

      {/* Card Footer Info */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50">
        <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>{task.dueDate ? formatDate(task.dueDate) : 'No date'}</span>
        </span>
        
        <div className="flex items-center space-x-2">
          {/* Status Badge */}
          <Badge variant={getStatusVariant(task.status)} className="scale-90 origin-right">
            {task.status}
          </Badge>
          
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="assignee"
            className="h-6 w-6 rounded-full object-cover border border-white shadow-sm shrink-0"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
