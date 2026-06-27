import React from 'react';

/**
 * Workspace header welcome block with mobile responsive text wrapping.
 */
const WorkspaceHeader = () => {
  return (
    <div className="space-y-1.5 py-4">
      <h1 className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-extrabold text-[#111827] tracking-tight leading-tight md:leading-none font-sans">
        Good morning, Jayakumar! 👋
      </h1>
      <p className="text-sm sm:text-[16px] text-slate-500 font-medium leading-relaxed max-w-xl">
        Here's what's happening with your work today.
      </p>
    </div>
  );
};

export default WorkspaceHeader;
