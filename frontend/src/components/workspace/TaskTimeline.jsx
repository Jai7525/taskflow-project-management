import React, { useState, useMemo, useEffect, useRef } from 'react';
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

/* ─── Shared nav button style ─────────────────────────────────────────────── */
const NAV_BTN =
  'h-11 w-11 rounded-full border border-[#E2E8F0] bg-white text-slate-500 ' +
  'flex items-center justify-center shrink-0 cursor-pointer ' +
  'hover:bg-[#F8FAFC] hover:border-[#CBD5E1] hover:shadow-sm ' +
  'active:bg-slate-100 transition-all duration-150 focus:outline-none ' +
  'focus:ring-2 focus:ring-[#6366F1]/20 disabled:opacity-40 disabled:cursor-default';

/**
 * TaskTimeline
 *
 * Renders the horizontal 7-day calendar navigation rail
 * and tracks the selected query date.
 */
const TaskTimeline = ({
  tasks = [],
  selectedDate,
  onSelectDate,
  error = null,
  onRetry,
  isLoading = false,
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

  // Track slide direction for animated week transitions
  const [slideDir, setSlideDir] = useState('next'); // 'next' | 'prev'

  // Stable key for AnimatePresence — changes only when anchorDate changes
  const anchorKey = formatDateStr(anchorDate);

  // Synchronize anchorDate viewport when selectedDate changes (e.g. via calendar pick or external reset)
  useEffect(() => {
    if (selectedDate) {
      const parsed = new Date(selectedDate + 'T00:00:00');
      if (!isNaN(parsed.getTime())) {
        const d = new Date(parsed);
        d.setDate(parsed.getDate() - 3); // center around the date
        setAnchorDate(d);
      }
    }
  }, [selectedDate]);

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

  // Aggregate total tasks count currently visible in this 7-day timeline view
  const totalTasksInTimeline = useMemo(() => {
    return timelineDays.reduce((acc, day) => {
      const dayTasksCount = tasks.filter((t) => t.dueDate && t.dueDate.startsWith(day.dateStr)).length;
      return acc + dayTasksCount;
    }, 0);
  }, [timelineDays, tasks]);

  // Viewport navigation — set direction before updating anchor so AnimatePresence reads correct dir
  const handlePrevWeek = () => {
    setSlideDir('prev');
    setAnchorDate((prev) => {
      const newD = new Date(prev);
      newD.setDate(prev.getDate() - 7);
      return newD;
    });
  };

  const handleNextWeek = () => {
    setSlideDir('next');
    setAnchorDate((prev) => {
      const newD = new Date(prev);
      newD.setDate(prev.getDate() + 7);
      return newD;
    });
  };

  const handleResetToToday = () => {
    setSlideDir('next');
    const d = new Date(today);
    d.setDate(today.getDate() - 3);
    setAnchorDate(d);
    onSelectDate(todayStr);
  };

  /* ─── Week slide animation variants ──────────────────────────────────────── */
  const slideVariants = {
    enter: (dir) => ({
      opacity: 0,
      x: dir === 'next' ? 36 : -36,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir === 'next' ? -36 : 36,
    }),
  };

  /* ─── Error state ─────────────────────────────────────────────────────────── */
  if (error) {
    const isOffline = error.toLowerCase().includes('offline');
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 w-full h-[132px] select-none">
        <div className="flex items-center space-x-3.5">
          <div className="h-9 w-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 font-sans">
              {isOffline ? "You're offline." : 'Unable to load timeline'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {isOffline ? 'Check your connection.' : 'Please try again later.'}
            </p>
          </div>
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

  /* ─── Main render ─────────────────────────────────────────────────────────── */
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[16px] px-6 pt-7 pb-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5 select-none">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-slate-800 tracking-tight font-sans">
          Task Timeline
        </h2>

        {/* Calendar date-picker button — matches nav button group */}
        <div className="relative">
          <button
            className={NAV_BTN}
            aria-label="Pick a date"
            tabIndex={0}
          >
            <Calendar className="h-5 w-5" />
          </button>
          <input
            type="date"
            value={selectedDate || ''}
            onChange={(e) => {
              if (e.target.value) {
                onSelectDate(e.target.value);
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            aria-label="Choose timeline start date"
          />
        </div>
      </div>

      {/* ── Date Rail ── */}
      <div className="flex items-center gap-3">

        {/* Prev arrow */}
        <button
          onClick={handlePrevWeek}
          className={`${NAV_BTN} hidden md:flex`}
          aria-label="Previous 7 Days"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* ── Cards viewport ── */}
        {/* overflow-visible on desktop, overflow-x-auto on mobile so the TODAY badge is never clipped but swipe works */}
        <div className="flex-1 overflow-x-auto md:overflow-visible relative scrollbar-none pb-2 pt-2" style={{ minHeight: '124px' }}>
          {isLoading ? (
            /* Skeleton loader */
            <div className="flex items-stretch gap-4 md:gap-6">
              {Array.from({ length: 7 }).map((_, idx) => {
                const hidden = idx >= 5 ? 'hidden md:flex' : 'flex';
                return (
                  <div
                    key={idx}
                    className={`${hidden} flex-shrink-0 w-[130px] md:w-auto md:flex-1 flex flex-col items-center justify-center p-3.5 rounded-[14px] border border-slate-100 bg-white text-center animate-pulse h-[110px]`}
                  >
                    <div className="h-3 bg-slate-100 rounded w-8 mb-2" />
                    <div className="h-5 bg-slate-200/60 rounded w-14 mb-3" />
                    <div className="h-1.5 bg-slate-100 rounded w-6 mb-2" />
                    <div className="h-2.5 bg-slate-100 rounded w-10" />
                  </div>
                );
              })}
            </div>
          ) : totalTasksInTimeline === 0 ? (
            /* Empty state */
            <AnimatePresence mode="wait" custom={slideDir}>
              <motion.div
                key={anchorKey + '-empty'}
                custom={slideDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="flex items-center justify-center border border-dashed border-[#E5E7EB] rounded-[14px] bg-slate-50/50 h-[110px] w-full"
              >
                <div className="flex flex-col items-center">
                  <Calendar className="h-5 w-5 text-slate-400 mb-1.5" />
                  <span className="text-xs font-semibold text-slate-400">No upcoming tasks</span>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            /* ── Animated week rail ── */
            <AnimatePresence mode="wait" custom={slideDir}>
              <motion.div
                key={anchorKey}
                custom={slideDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="flex items-stretch gap-4 md:gap-6 w-max md:w-full"
              >
                {timelineDays.map((day, idx) => {
                  const isSelected = selectedDate === day.dateStr;

                  // Task data for this day
                  const dayTasks = tasks.filter((t) => t.dueDate && t.dueDate.startsWith(day.dateStr));
                  const count = dayTasks.length;
                  const hasPending  = dayTasks.some((t) => t.status === 'Pending');
                  const hasProgress = dayTasks.some((t) => t.status === 'In Progress');
                  const hasCompleted = dayTasks.some((t) => t.status === 'Completed');

                  // Responsive visibility: hide last 2 only on narrow viewports *if* chevrons active, but since horizontal swipe works, let's keep all 7 scrollable on mobile!
                  const hidden = 'flex';

                  /* ── Card visual state tokens ── */
                  let cardBase = '';
                  let dayNameColor = '';
                  let dayNumColor = '';
                  let countColor = '';

                  if (isSelected) {
                    // Restored: gradient fill, 24px radius, premium shadow
                    cardBase =
                      'bg-gradient-to-b from-[#6366F1] to-[#4F46E5] rounded-[24px] ' +
                      'border-transparent ' +
                      'shadow-[0_10px_24px_rgba(99,102,241,.16)] z-10';
                    dayNameColor = 'text-indigo-200';
                    dayNumColor  = 'text-white';
                    countColor   = 'text-indigo-200';
                  } else if (day.isToday) {
                    // Today unselected — white bg, primary border
                    cardBase =
                      'bg-white border-[#6366F1] shadow-[0_0_0_3px_rgba(99,102,241,0.08)]';
                    dayNameColor = 'text-slate-500';
                    dayNumColor  = 'text-slate-800';
                    countColor   = 'text-slate-400';
                  } else {
                    // Default unselected
                    cardBase = 'bg-white border-[#E5E7EB]';
                    dayNameColor = 'text-slate-500';
                    dayNumColor  = 'text-slate-800';
                    countColor   = 'text-slate-400';
                  }

                  return (
                    <motion.button
                      key={day.dateStr}
                      onClick={() => onSelectDate(isSelected ? null : day.dateStr)}
                      whileHover={!isSelected ? { y: -2 } : {}}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className={
                        `${hidden} flex-shrink-0 w-[130px] md:w-auto md:flex-1 flex-col items-center justify-center ` +
                        `p-3.5 border h-[110px] ` +
                        /* radius: selected gets 24px (set in cardBase), others 14px */
                        (!isSelected ? 'rounded-[14px] ' : '') +
                        `text-center cursor-pointer relative ` +
                        `transition-[border-color,box-shadow,background-color,border-radius] duration-[180ms] ease-out ` +
                        `focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 ` +
                        (!isSelected && !day.isToday
                          ? 'hover:border-[#CBD5E1] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] '
                          : '') +
                        cardBase
                      }
                      aria-pressed={isSelected}
                      aria-label={`${day.dayName} ${day.dayNum} ${day.monthName}${day.isToday ? ', today' : ''}, ${count} ${count === 1 ? 'task' : 'tasks'}`}
                    >
                      {/* TODAY badge — #4338CA, positioned to sit naturally on the card */}
                      {day.isToday && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#4338CA',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.03em',
                            borderRadius: '999px',
                            padding: '2px 10px',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 4px 12px rgba(67,56,202,.18)',
                          }}
                        >
                          TODAY
                        </span>
                      )}

                      {/* Day name */}
                      <span className={`text-[11px] font-semibold tracking-wide ${dayNameColor}`}>
                        {day.dayName}
                      </span>

                      {/* Day number + Month */}
                      <span className={`text-[17px] font-extrabold mt-0.5 leading-none ${dayNumColor}`}>
                        {day.dayNum}{' '}
                        <span className="text-[13px] font-bold">{day.monthName}</span>
                      </span>

                      {/* Status dot indicators — 6px, 8px gap, always canonical status colors */}
                      <div className="flex gap-2 mt-2.5 items-center justify-center" style={{ height: '6px' }}>
                        {hasPending   && <span className="h-[6px] w-[6px] rounded-full bg-amber-400" />}
                        {hasProgress  && <span className="h-[6px] w-[6px] rounded-full bg-blue-400" />}
                        {hasCompleted && <span className="h-[6px] w-[6px] rounded-full bg-emerald-400" />}
                        {count === 0  && <span className="h-[4px] w-[4px] rounded-full bg-slate-300" />}
                      </div>

                      {/* Task count — sentence case */}
                      <span className={`text-[10px] font-semibold mt-2 ${countColor}`}>
                        {count === 0 ? '0 tasks' : `${count} ${count === 1 ? 'task' : 'tasks'}`}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Next arrow */}
        <button
          onClick={handleNextWeek}
          className={`${NAV_BTN} hidden md:flex`}
          aria-label="Next 7 Days"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskTimeline;
