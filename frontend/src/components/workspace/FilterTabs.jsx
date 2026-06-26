import React from 'react';
import { TASK_STATUS } from '../../constants/status';

const TABS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: TASK_STATUS.PENDING },
  { label: 'In Progress', value: TASK_STATUS.IN_PROGRESS },
  { label: 'Completed', value: TASK_STATUS.COMPLETED },
];

/**
 * Horizontal status filter tabs for task list.
 */
const FilterTabs = ({ activeStatus, onStatusChange }) => {
  return (
    <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
      {TABS.map((tab) => {
        const isActive = activeStatus === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onStatusChange(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer focus:outline-none ${
              isActive
                ? 'bg-white text-brand-600 shadow-soft-sm font-semibold'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
