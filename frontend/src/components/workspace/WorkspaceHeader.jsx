import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * WorkspaceHeader
 *
 * Renders the welcome banner and daily workspace greeting.
 */
const WorkspaceHeader = () => {
  const { user } = useAuth();

  // Determine time-appropriate greeting dynamically
  const greeting = React.useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);
  
  return (
    <div className="space-y-1.5 py-4 max-w-[800px]">
      <h1 className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-extrabold text-[#111827] tracking-tight leading-tight md:leading-none font-sans">
        {greeting}, {user?.name || 'User'}!
      </h1>
      <p className="text-sm sm:text-[16px] text-slate-500 font-medium leading-relaxed">
        Here's an overview of today's work.
      </p>
    </div>
  );
};

export default WorkspaceHeader;
