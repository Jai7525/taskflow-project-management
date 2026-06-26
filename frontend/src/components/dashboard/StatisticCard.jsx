import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Statistic Card with Framer Motion hover states.
 * Formats metric counts to singular/plural "Task(s)" dynamically.
 */
const StatisticCard = ({
  title,
  value = 0,
  description,
  icon: Icon,
  trend,
  colorTheme = 'indigo',
}) => {
  const themes = {
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      text: 'text-[#6366F1]',
      chartColor: 'text-[#6366F1]',
      chartPath: 'M0,35 Q15,20 30,25 T60,10 T90,5 L100,5',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-[#D97706]',
      chartColor: 'text-[#F59E0B]',
      chartPath: 'M0,30 Q20,35 40,20 T80,25 T100,15',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-600',
      chartColor: 'text-blue-500',
      chartPath: 'M0,25 Q15,30 30,15 T70,35 T100,5',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-[#16A34A]',
      chartColor: 'text-[#10B981]',
      chartPath: 'M0,35 Q20,30 40,15 T80,10 T100,2',
    },
  };

  const theme = themes[colorTheme] || themes.indigo;

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between h-[132px] select-none"
    >
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className={`h-7 w-7 rounded-lg ${theme.bg} border ${theme.border} flex items-center justify-center ${theme.text}`}>
            <Icon className="h-4.5 w-4.5" />
          </div>
          <span className="text-[13px] font-bold text-[#6B7280]">{title}</span>
        </div>
        <h2 className="text-3xl font-extrabold text-[#111827] leading-none">
          {value === 0 ? '0 Tasks' : `${value} ${value === 1 ? 'Task' : 'Tasks'}`}
        </h2>
        <span className="text-[11px] text-[#6B7280] font-medium block">{description}</span>
      </div>

      <div className="flex flex-col items-end space-y-3 shrink-0">
        {trend && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
            colorTheme === 'amber' ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#E8F8F0] text-[#10B981]'
          }`}>
            {trend}
          </span>
        )}
        <svg className={`w-16 h-8 ${theme.chartColor}`} viewBox="0 0 100 40">
          <path
            d={theme.chartPath}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </motion.div>
  );
};

export default StatisticCard;
