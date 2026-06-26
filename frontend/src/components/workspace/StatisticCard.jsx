import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Statistic Card with Framer Motion hover states.
 * Displays title, icon, value count, and description cleanly without placeholder sparklines.
 */
const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: 'easeOut',
    }
  }
};

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
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-[#D97706]',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-600',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-[#16A34A]',
    },
  };

  const theme = themes[colorTheme] || themes.indigo;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(15,23,42,0.12)' }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="bg-bgSecondary border border-borderTheme rounded-[16px] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:border-accent/30 flex flex-col justify-center h-[132px] select-none transition-all duration-200"
    >
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center space-x-2">
          <div className={`h-7 w-7 rounded-lg ${theme.bg} border ${theme.border} flex items-center justify-center ${theme.text} shrink-0`}>
            <Icon className="h-4.5 w-4.5" />
          </div>
          <span className="text-[13px] font-bold text-textSecondary truncate">{title}</span>
        </div>
        <h2 className="text-[48px] font-bold text-textPrimary leading-none tracking-tight">
          {value}
        </h2>
        <span className="text-[11px] text-textMuted font-medium block truncate">{description}</span>
      </div>
    </motion.div>
  );
};

export default StatisticCard;
