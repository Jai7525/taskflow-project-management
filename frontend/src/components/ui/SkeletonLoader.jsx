import React from 'react';

/**
 * Premium Outlined Skeleton Loader component featuring smooth shimmers.
 */
const SkeletonLoader = ({
  variant = 'card',
  className = '',
}) => {
  const styles = {
    title: 'h-6 bg-slate-200/60 rounded-lg animate-pulse w-1/3',
    subtitle: 'h-4 bg-slate-100 rounded-lg animate-pulse w-1/2',
    stats: 'bg-white border border-slate-200 rounded-2xl p-5 space-y-3 w-full',
    card: 'bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 w-full',
    timeline: 'bg-white border border-slate-200 p-4 rounded-2xl space-y-2.5 flex-1 min-w-[120px]',
  };

  if (variant === 'stats') {
    return (
      <div className={`${styles.stats} ${className}`}>
        <div className="h-3.5 bg-slate-200/60 rounded-md animate-pulse w-20" />
        <div className="h-8 bg-slate-100 rounded-md animate-pulse w-14" />
      </div>
    );
  }

  if (variant === 'timeline') {
    return (
      <div className={`${styles.timeline} ${className}`}>
        <div className="h-3 bg-slate-200/60 rounded-md animate-pulse w-14" />
        <div className="h-2.5 bg-slate-100 rounded-md animate-pulse w-10" />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`${styles.card} ${className}`}>
        <div className="flex items-center space-x-3.5">
          <div className="h-5 w-5 bg-slate-200/60 rounded-full animate-pulse shrink-0" />
          <div className="h-4 bg-slate-100 rounded-md animate-pulse w-3/4" />
        </div>
        <div className="h-3 bg-slate-100 rounded-md animate-pulse w-5/6" />
        <div className="flex space-x-2 pt-2.5">
          <div className="h-4.5 bg-slate-200/60 rounded-full animate-pulse w-16" />
          <div className="h-4.5 bg-slate-100 rounded-full animate-pulse w-12" />
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className={styles.title} />
      <div className={styles.subtitle} />
    </div>
  );
};

export default SkeletonLoader;
