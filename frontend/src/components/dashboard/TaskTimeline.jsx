import React from 'react';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Generates an array of 7 days starting from today.
 */
export const getTimelineDays = () => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    
    let label = '';
    if (i === 0) label = 'Today';
    else if (i === 1) label = 'Tomorrow';
    else label = DAYS_OF_WEEK[d.getDay()];

    days.push({
      dateStr: d.toISOString().split('T')[0], // YYYY-MM-DD format
      label,
      dateObj: d,
    });
  }
  return days;
};

/**
 * Task Timeline hero selector.
 * Displays horizontal day items.
 */
const TaskTimeline = ({ tasks = [], selectedDate, onSelectDate }) => {
  const days = getTimelineDays();

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Task Timeline
        </h3>
        {selectedDate && (
          <button
            onClick={() => onSelectDate(null)}
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold cursor-pointer"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none w-full -mx-4 sm:-mx-0 px-4 sm:px-0">
        {days.map((day) => {
          const isSelected = selectedDate === day.dateStr;
          
          // Find tasks matching this day's due date
          const dayTasks = tasks.filter((t) => {
            if (!t.dueDate) return false;
            return t.dueDate.startsWith(day.dateStr);
          });

          // Determine mini status summary dots
          const hasPending = dayTasks.some((t) => t.status === 'Pending');
          const hasInProgress = dayTasks.some((t) => t.status === 'In Progress');
          const hasCompleted = dayTasks.some((t) => t.status === 'Completed');

          return (
            <button
              key={day.dateStr}
              onClick={() => onSelectDate(isSelected ? null : day.dateStr)}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] bg-white border p-3.5 rounded-2xl text-left transition-all duration-200 select-none cursor-pointer focus:outline-none ${
                isSelected
                  ? 'border-brand-500 ring-2 ring-brand-500/10 shadow-soft-md'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-soft-sm'
              }`}
            >
              {/* Day Label */}
              <p className={`text-xs font-bold ${isSelected ? 'text-brand-600' : 'text-slate-500'}`}>
                {day.label}
              </p>
              
              {/* Date String e.g. Jun 26 */}
              <p className="text-[11px] text-slate-400 mt-0.5">
                {day.dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>

              {/* Status Indicators & Count Badge */}
              <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-slate-50">
                <div className="flex space-x-1">
                  {hasPending && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                  {hasInProgress && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                  {hasCompleted && <span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
                  {dayTasks.length === 0 && <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />}
                </div>

                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {dayTasks.length}
                </span>
              </div>
              
              {/* Tiny Preview */}
              {dayTasks.length > 0 && (
                <div className="text-[10px] text-slate-400 truncate mt-1">
                  {dayTasks[0].title}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TaskTimeline;
