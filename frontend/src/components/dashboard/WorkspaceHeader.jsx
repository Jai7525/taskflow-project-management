import React from 'react';

/**
 * WorkspaceHeader component showing locked welcome messages.
 * Uses strict typography scale (H1: 32px, Subtitle: 16px/13px spacing rules).
 */
const WorkspaceHeader = () => {
  return (
    <div className="space-y-2">
      <h1 className="text-[32px] font-extrabold text-[#111827] tracking-tight leading-tight font-sans">
        Good morning, Jayakumar 👋
      </h1>
      <p className="text-[16px] font-medium text-[#6B7280]">
        Here's what's happening with your work today.
      </p>
    </div>
  );
};

export default WorkspaceHeader;
