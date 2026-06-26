import React from 'react';

/**
 * Workspace header welcome block.
 * Large bold welcome greeting at 48px to 52px.
 */
const WorkspaceHeader = () => {
  return (
    <div className="space-y-1.5 py-4">
      <h1 className="text-[40px] md:text-[48px] font-extrabold text-[#111827] tracking-tight leading-none font-sans">
        Good morning, Jayakumar! 👋
      </h1>
      <p className="text-[16px] text-slate-500 font-medium leading-relaxed">
        Here's what's happening with your work today.
      </p>
    </div>
  );
};

export default WorkspaceHeader;
