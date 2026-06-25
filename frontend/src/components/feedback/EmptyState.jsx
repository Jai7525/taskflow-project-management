import React from 'react';

/**
 * Empty state placeholder component.
 */
const EmptyState = ({ message }) => {
  return (
    <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
      <p className="text-slate-500 font-medium">{message || 'EmptyState Component Placeholder'}</p>
    </div>
  );
};

export default EmptyState;
