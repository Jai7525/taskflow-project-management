import React from 'react';

/**
 * Statistics metrics card component
 */
const StatsCard = ({ title, value, icon: Icon, colorTheme = 'brand' }) => {
  const themes = {
    brand: {
      bg: 'bg-brand-50',
      text: 'text-brand-600',
      border: 'border-brand-100',
    },
    warning: {
      bg: 'bg-warning-50',
      text: 'text-warning-600',
      border: 'border-warning-100',
    },
    success: {
      bg: 'bg-success-50',
      text: 'text-success-600',
      border: 'border-success-100',
    },
    danger: {
      bg: 'bg-danger-50',
      text: 'text-danger-600',
      border: 'border-danger-100',
    },
  };

  const theme = themes[colorTheme] || themes.brand;

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-5 shadow-soft-sm flex items-center justify-between`}>
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          {title}
        </span>
        <span className="text-3xl font-extrabold text-slate-900 leading-none block font-sans">
          {value ?? 0}
        </span>
      </div>
      
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${theme.bg} ${theme.text} ${theme.border}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
};

export default StatsCard;
