import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ClipboardList, Clock, Loader, CheckCircle2, ArrowUpDown, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

import StatsCard from '../../components/ui/StatsCard';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Dropdown from '../../components/ui/Dropdown';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';

/**
 * Enterprise Workspace Dashboard Page (Visual/Placeholder framework for Phase 7B).
 * Renders stats widgets, timeline rails, board columns, and recent activities.
 */
const DashboardPage = () => {
  const { searchQuery } = useOutletContext() || {};

  // Mock Days of the Week for Synchro Timeline date rail placeholder
  const timelineDates = [
    { label: 'Today', date: 'Jun 26', count: 3, hasPending: true, hasProgress: true },
    { label: 'Tomorrow', date: 'Jun 27', count: 1, hasPending: true },
    { label: 'Saturday', date: 'Jun 28', count: 0 },
    { label: 'Sunday', date: 'Jun 29', count: 0 },
    { label: 'Monday', date: 'Jun 30', count: 2, hasCompleted: true },
  ];

  return (
    <div className="space-y-8 pb-10 w-full overflow-hidden">
      
      {/* ── Page Header / Title ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight leading-none font-sans">
            Workspace
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Helping you stay focused on today's work.
          </p>
        </div>
      </div>

      {/* ── Dashboard Statistics (Placeholder) ── */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Dashboard Statistics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatsCard title="Total Tasks" value={0} icon={ClipboardList} colorTheme="brand" />
          <StatsCard title="Pending" value={0} icon={Clock} colorTheme="warning" />
          <StatsCard title="In Progress" value={0} icon={Loader} colorTheme="danger" />
          <StatsCard title="Completed" value={0} icon={CheckCircle2} colorTheme="success" />
        </div>
      </div>

      {/* ── Task Timeline Hero Date Rail (Placeholder) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Task Timeline
          </h3>
          <span className="text-xs font-semibold text-slate-400 select-none">
            Timeline (Signature Feature)
          </span>
        </div>

        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none -mx-4 sm:-mx-0 px-4 sm:px-0">
          {timelineDates.map((day, idx) => (
            <motion.button
              whileHover={{ y: -2 }}
              key={idx}
              className={`flex-1 min-w-[100px] sm:min-w-[125px] bg-white border p-4 rounded-2xl text-left select-none cursor-pointer focus:outline-none transition-shadow ${
                idx === 0
                  ? 'border-brand-500 ring-2 ring-brand-500/10 shadow-soft-md'
                  : 'border-slate-200 hover:border-slate-350'
              }`}
            >
              <p className={`text-xs font-bold ${idx === 0 ? 'text-brand-500' : 'text-slate-500'}`}>
                {day.label}
              </p>
              <p className="text-[11px] text-slate-450 mt-0.5 font-medium">
                {day.date}
              </p>
              <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-50">
                <div className="flex space-x-1">
                  {day.hasPending && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                  {day.hasProgress && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                  {day.hasCompleted && <span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
                  {day.count === 0 && <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />}
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  idx === 0 ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {day.count}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Task Board (Placeholder Columns) ── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
            <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-white text-brand-600 shadow-soft-sm">
              All
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700">
              Pending
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700">
              In Progress
            </button>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
            <Dropdown
              options={[
                { label: 'Newest', value: 'newest' },
                { label: 'Oldest', value: 'oldest' },
              ]}
              value="newest"
              onChange={() => {}}
            />
          </div>
        </div>

        {/* Empty State placeholder layout */}
        <EmptyState
          title="No Tasks Yet"
          subtitle="Click the 'Create Task' button on top to add new items to your Workspace."
          actionLabel="Add First Task"
          onActionClick={() => {}}
        />

        {/* Visual Board skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Pending Column */}
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-150 flex flex-col space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="font-bold text-sm text-slate-750 font-sans">Pending</span>
              </div>
              <Badge variant="pending">0</Badge>
            </div>
            <div className="space-y-3">
              <SkeletonLoader variant="card" />
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-150 flex flex-col space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="font-bold text-sm text-slate-750 font-sans">In Progress</span>
              </div>
              <Badge variant="progress">0</Badge>
            </div>
            <div className="space-y-3">
              <SkeletonLoader variant="card" />
            </div>
          </div>

          {/* Completed Column */}
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-150 flex flex-col space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="font-bold text-sm text-slate-750 font-sans">Completed</span>
              </div>
              <Badge variant="completed">0</Badge>
            </div>
            <div className="space-y-3">
              <SkeletonLoader variant="card" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Activity (Placeholder) ── */}
      <div id="activity" className="pt-4 border-t border-slate-200">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-900 font-sans">
              Activity Log
            </h2>
            <span className="text-xs text-slate-400 font-semibold">Newest First</span>
          </div>
          <div className="py-8 text-center text-xs text-slate-400 font-semibold border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
            No activity logged in this workspace view.
          </div>
        </Card>
      </div>

    </div>
  );
};

export default DashboardPage;
