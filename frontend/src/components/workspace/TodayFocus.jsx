import React, { useState, useEffect, useCallback } from 'react';
import { ClipboardList, Clock3, LoaderCircle, CircleCheckBig, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import taskService from '../../services/taskService';
import StatisticCard from './StatisticCard';
import StatisticSkeleton from './StatisticSkeleton';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
    }
  }
};

/**
 * TodayFocus
 *
 * Displays task count statistics cards and
 * computes search-based metrics client-side.
 */
const TodayFocus = ({ refreshTrigger, searchActive = false, searchTasks = [] }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getStatistics();
      if (response?.success) {
        setStatistics(response.data);
      } else {
        setError(navigator.onLine ? "Unable to load statistics" : "You're offline. Check your connection.");
      }
    } catch (err) {
      setError(!navigator.onLine ? "You're offline. Check your connection." : "Unable to load statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, refreshTrigger]);

  // When search is active, we bypass loading skeleton to show instant client-side metrics
  if (loading && !searchActive) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <StatisticSkeleton />
        <StatisticSkeleton />
        <StatisticSkeleton />
        <StatisticSkeleton />
      </div>
    );
  }

  if (error && !searchActive) {
    const isOffline = error.includes("offline");
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-4 w-full h-auto sm:h-[132px] select-none">
        <div className="flex items-center space-x-3.5">
          <div className="h-9 w-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-650 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 font-sans">
              {isOffline ? "You're offline." : "Unable to load statistics"}
            </p>
            <p className="text-xs text-slate-450 mt-0.5 font-medium">
              {isOffline ? "Check your connection." : "Please try again later."}
            </p>
          </div>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  // Statistics always represent the user's complete workspace.
  const data = statistics || { total: 0, pending: 0, inProgress: 0, completed: 0 };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
    >
      <StatisticCard
        title="Total Tasks"
        value={data.total}
        description="All assigned tasks"
        icon={ClipboardList}
        colorTheme="indigo"
      />
      <StatisticCard
        title="Pending"
        value={data.pending}
        description="Waiting to start"
        icon={Clock3}
        colorTheme="amber"
      />
      <StatisticCard
        title="In Progress"
        value={data.inProgress}
        description="Currently active"
        icon={LoaderCircle}
        colorTheme="blue"
      />
      <StatisticCard
        title="Completed"
        value={data.completed}
        description="Finished tasks"
        icon={CircleCheckBig}
        colorTheme="green"
      />
    </motion.div>
  );
};

export default TodayFocus;
