import { TASK_STATUS } from '../constants/status';
import { TASK_PRIORITY } from '../constants/priority';

/**
 * Returns Tailwind CSS badge classes based on task status
 * @param {string} status 
 * @returns {string}
 */
export const statusColor = (status) => {
  switch (status) {
    case TASK_STATUS.COMPLETED:
      return 'bg-success-50 text-success-600 border border-success-500/20';
    case TASK_STATUS.IN_PROGRESS:
      return 'bg-brand-50 text-brand-600 border border-brand-500/20';
    case TASK_STATUS.PENDING:
    default:
      return 'bg-warning-50 text-warning-600 border border-warning-500/20';
  }
};

/**
 * Returns Tailwind CSS text/badge classes based on task priority
 * @param {string} priority 
 * @returns {string}
 */
export const priorityColor = (priority) => {
  switch (priority) {
    case TASK_PRIORITY.HIGH:
      return 'bg-danger-50 text-danger-600 border border-danger-500/20';
    case TASK_PRIORITY.MEDIUM:
      return 'bg-warning-50 text-warning-600 border border-warning-500/20';
    case TASK_PRIORITY.LOW:
    default:
      return 'bg-success-50 text-success-600 border border-success-500/20';
  }
};
