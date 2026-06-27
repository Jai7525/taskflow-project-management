import React from 'react';

/**
 * WorkspaceHeader
 *
 * Renders the welcome banner and daily workspace greeting.
 */
const WorkspaceHeader = () => {
  return (
    <div className="space-y-1.5 py-4 max-w-[800px]">
      <h1 className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-extrabold text-[#111827] tracking-tight leading-tight md:leading-none font-sans">
        Good morning, Jayakumar!
      </h1>
      <p className="text-sm sm:text-[16px] text-slate-500 font-medium leading-relaxed">
        Here's an overview of today's work.
      </p>
    </div>
  );
};

export default WorkspaceHeader;
