import React from 'react';

/**
 * Reusable Badge component for workspace tags and status pills.
 * Implements muted color palette from the locked color spec.
 */
const Badge = ({
  children,
  variant = 'pending',
  className = '',
  ...props
}) => {
  const styles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    progress: 'bg-blue-50 text-blue-700 border-blue-100',
    completed: 'bg-green-50 text-green-700 border-green-100',
    danger: 'bg-red-50 text-red-700 border-red-100',
    medium: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    low: 'bg-slate-50 text-slate-500 border-slate-200/60',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${styles[variant] || styles.pending} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
