import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatDate';
import { useAuth } from '../../contexts/AuthContext';

/**
 * TaskCard
 *
 * Displays task details (title, priority, due date)
 * inside the task board column list.
 */
const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: 'easeOut',
    }
  }
};

const TaskCard = ({ task, onClick }) => {
  const { user } = useAuth();
  const isCompleted = task.status === 'Completed';
  
  const userName = user?.name || 'Jayakumar M';
  const initials = React.useMemo(() => {
    if (!userName) return 'TU';
    const parts = userName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }, [userName]);

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
      variants={cardVariants}
      whileHover={{ y: -2, scale: 1.01, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      tabIndex={0}
      role="button"
      aria-label={`View task details for ${task.title}`}
      onClick={() => onClick && onClick(task.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick(task.id);
        }
      }}
      className={`bg-white border border-slate-200 hover:border-slate-350 rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 relative select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:outline-none ${
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
      <h4 className={`text-[14px] font-bold mt-2 text-textPrimary leading-snug font-sans ${
        isCompleted ? 'line-through text-textDisabled' : ''
      }`}>
        {task.title}
      </h4>

      {/* Description truncated after 2 lines */}
      <p className="text-[12px] text-textSecondary mt-1 leading-relaxed line-clamp-2">
        {task.description}
      </p>

      {/* Card Footer Info */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-50">
        <span className="text-[10px] text-textMuted font-semibold flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>{task.dueDate ? formatDate(task.dueDate) : 'No date'}</span>
        </span>
        
        <div className="flex items-center space-x-2">
          {/* Status Badge */}
          <Badge variant={getStatusVariant(task.status)} className="scale-90 origin-right">
            {task.status}
          </Badge>
          
          <div className="h-6 w-6 rounded-full bg-[#6366F1] text-white font-bold flex items-center justify-center text-[9px] font-sans tracking-wide border border-white shadow-sm shrink-0">
            {initials}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
