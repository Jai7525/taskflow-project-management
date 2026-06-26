import React from 'react';

/**
 * Statistics metrics card component conforming to SaaS LOCKED styling.
 * Pure white card, very subtle shadow, 16px border-radius, light gray border.
 */
const StatsCard = ({ title, value, icon: Icon, colorTheme = 'brand' }) => {
  const themes = {
    brand: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
    },
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
    },
    success: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-100',
    },
    danger: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
    },
  };

  const theme = themes[colorTheme] || themes.brand;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-soft-sm flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          {title}
        </span>
        <span className="text-3xl font-extrabold text-slate-900 leading-none block font-sans">
          {value ?? 0}
        </span>
      </div>
      
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${theme.bg} ${theme.text} ${theme.border}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
};

export default StatsCard;
