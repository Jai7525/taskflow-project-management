import { TASK_STATUS } from '../constants/status';
import { TASK_PRIORITY } from '../constants/priority';

/**
 * Returns Tailwind CSS badge classes based on task status conforming to Locked UI spec
 * @param {string} status 
 * @returns {string}
 */
export const statusColor = (status) => {
  switch (status) {
    case TASK_STATUS.COMPLETED:
      return 'bg-green-50 text-green-700 border border-green-100';
    case TASK_STATUS.IN_PROGRESS:
      return 'bg-blue-50 text-blue-700 border border-blue-100';
    case TASK_STATUS.PENDING:
    default:
      return 'bg-amber-50 text-amber-700 border border-amber-100';
  }
};

/**
 * Returns Tailwind CSS text/badge classes based on task priority conforming to Locked UI spec
 * @param {string} priority 
 * @returns {string}
 */
export const priorityColor = (priority) => {
  switch (priority) {
    case TASK_PRIORITY.HIGH:
      return 'bg-red-50 text-red-700 border border-red-100';
    case TASK_PRIORITY.MEDIUM:
      return 'bg-indigo-50 text-indigo-700 border border-indigo-100';
    case TASK_PRIORITY.LOW:
    default:
      return 'bg-slate-50 text-slate-500 border border-slate-200/60';
  }
};
