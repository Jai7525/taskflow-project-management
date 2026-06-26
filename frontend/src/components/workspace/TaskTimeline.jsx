import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, AlertCircle } from 'lucide-react';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Returns formatted date string (YYYY-MM-DD) for comparisons.
 */
const formatDateStr = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Dynamic Task Timeline Date Rail (Phase 8C).
 * Automatically calculates today, aggregates counts from backend tasks,
 * and navigates in steps of exactly 7 days.
 */
const TaskTimeline = ({
  tasks = [],
  selectedDate,
  onSelectDate,
  error = null,
  onRetry,
}) => {
  // Calendar viewport starts centered around today
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => formatDateStr(today), [today]);

  const [anchorDate, setAnchorDate] = useState(() => {
    const d = new Date(today);
    // Position today near the middle of the first 7-day frame
    d.setDate(today.getDate() - 3);
    return d;
  });

  // Generate 7 consecutive days starting from anchorDate
  const timelineDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(anchorDate);
      d.setDate(anchorDate.getDate() + i);
      const dateStr = formatDateStr(d);
      
      days.push({
        dateStr,
        dayName: DAYS_OF_WEEK[d.getDay()],
        dayNum: d.getDate(),
        monthName: MONTHS[d.getMonth()],
        isToday: dateStr === todayStr,
        dateObj: d,
      });
    }
    return days;
  }, [anchorDate, todayStr]);

  // Viewport navigation
  const handlePrevWeek = () => {
    setAnchorDate((prev) => {
      const newD = new Date(prev);
      newD.setDate(prev.getDate() - 7);
      return newD;
    });
  };

  const handleNextWeek = () => {
    setAnchorDate((prev) => {
      const newD = new Date(prev);
      newD.setDate(prev.getDate() + 7);
      return newD;
    });
  };

  const handleResetToToday = () => {
    const d = new Date(today);
    d.setDate(today.getDate() - 3);
    setAnchorDate(d);
    onSelectDate(todayStr);
  };

  if (error) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 w-full h-[132px] select-none">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-sm font-bold text-slate-800">Unable to load timeline</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[#111827] tracking-tight font-sans">
          Task Timeline
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetToToday}
            className="px-3.5 py-1.5 border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#111827] bg-[#F6F8FB] hover:bg-slate-50 cursor-pointer transition"
          >
            Today
          </button>
          <button className="p-1.5 border border-[#E5E7EB] rounded-xl text-slate-400 cursor-not-allowed bg-white">
            <Calendar className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Date Rail with Left/Right Navigations */}
      <div className="relative flex items-center justify-between gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevWeek}
          className="p-2 border border-[#E5E7EB] rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-800 shrink-0 cursor-pointer transition shadow-soft-sm"
          aria-label="Previous 7 Days"
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>

        {/* Responsive viewport layout: Desktop shows 7, Tablet shows 5 (via tailwind hidden/block), Mobile swiping */}
        <div className="flex-1 flex justify-between items-stretch px-2 pt-2.5 pb-1 overflow-x-auto scrollbar-none space-x-2 md:space-x-3 lg:space-x-4">
          {timelineDays.map((day, idx) => {
            const isSelected = selectedDate === day.dateStr;
            
            // Calculate total tasks due this day from backend tasks
            const dayTasks = tasks.filter((t) => t.dueDate && t.dueDate.startsWith(day.dateStr));
            const count = dayTasks.length;

            const hasPending = dayTasks.some((t) => t.status === 'Pending');
            const hasProgress = dayTasks.some((t) => t.status === 'In Progress');
            const hasCompleted = dayTasks.some((t) => t.status === 'Completed');

            // Hide last 2 items on tablet (idx >= 5) to show exactly 5 days
            const responsivenessClass = idx >= 5 ? 'hidden lg:flex' : 'flex';

            // Styles based on state:
            // 1. Today + Selected: isToday && isSelected
            // 2. Today (Not Selected): isToday && !isSelected
            // 3. Selected (Not Today): !isToday && isSelected
            // 4. Normal: !isToday && !isSelected
            let cardBgClass = '';
            let dayNameColorClass = 'text-slate-450';
            let dayNumColorClass = 'text-slate-800';
            let countColorClass = 'text-slate-450';

            if (isSelected) {
              cardBgClass = 'bg-[#111827] text-white border-[#111827] shadow-md z-10';
              dayNameColorClass = 'text-slate-400';
              dayNumColorClass = 'text-white';
              countColorClass = 'text-slate-350';
            } else if (day.isToday) {
              cardBgClass = 'bg-white border-[#6366F1] ring-2 ring-[#6366F1]/10 z-10';
              dayNameColorClass = 'text-slate-450';
              dayNumColorClass = 'text-slate-800';
              countColorClass = 'text-slate-450';
            } else {
              cardBgClass = 'bg-white border-[#E5E7EB] hover:border-slate-350';
              dayNameColorClass = 'text-slate-450';
              dayNumColorClass = 'text-slate-800';
              countColorClass = 'text-slate-450';
            }

            return (
              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                key={day.dateStr}
                onClick={() => onSelectDate(isSelected ? null : day.dateStr)}
                className={`${responsivenessClass} flex-1 min-w-[95px] sm:min-w-[110px] md:min-w-[125px] flex-col items-center justify-center p-3.5 rounded-[16px] border text-center transition-all cursor-pointer relative ${cardBgClass}`}
              >
                {/* TODAY badge */}
                {day.isToday && (
                  <span className="absolute -top-1.5 bg-[#6366F1] text-white text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}

                {/* Day Name */}
                <span className={`text-[12px] font-semibold ${dayNameColorClass}`}>
                  {day.dayName}
                </span>

                {/* Day Number + Month */}
                <span className={`text-[16px] sm:text-[18px] font-extrabold mt-0.5 leading-none ${dayNumColorClass}`}>
                  {day.dayNum} {day.monthName}
                </span>

                {/* Status Dot Indicators */}
                <div className="flex space-x-1 mt-2.5 h-1.5 items-center justify-center">
                  {hasPending && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                  {hasProgress && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                  {hasCompleted && <span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
                  {count === 0 && <span className="h-1 w-1 rounded-full bg-slate-200" />}
                </div>

                {/* Task Count descriptor */}
                <span className={`text-[10px] font-bold mt-2 ${countColorClass}`}>
                  {count === 0 ? '0 Tasks' : `${count} ${count === 1 ? 'Task' : 'Tasks'}`}
                </span>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextWeek}
          className="p-2 border border-[#E5E7EB] rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-800 shrink-0 cursor-pointer transition shadow-soft-sm"
          aria-label="Next 7 Days"
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default TaskTimeline;
