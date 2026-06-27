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
  colorTheme = 'indigo',
}) => {
  const themes = {
    indigo: {
      bg: 'bg-indigo-100/70',
      border: 'border-indigo-200/50',
      text: 'text-indigo-600',
    },
    amber: {
      bg: 'bg-amber-100/70',
      border: 'border-amber-200/50',
      text: 'text-amber-600',
    },
    blue: {
      bg: 'bg-blue-100/70',
      border: 'border-blue-200/50',
      text: 'text-blue-600',
    },
    green: {
      bg: 'bg-green-100/70',
      border: 'border-green-200/50',
      text: 'text-green-600',
    },
  };

  const theme = themes[colorTheme] || themes.indigo;

  // LoaderCircle spins only if there are tasks in progress (value > 0)
  const isSpinning = title === 'In Progress' && value > 0;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(15,23,42,0.08)' }}
      className="group bg-bgSecondary border border-[#E2E8F0] rounded-[16px] p-5 flex flex-col justify-center h-[132px] select-none transition-all duration-[250ms] ease-out"
    >
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center space-x-3.5">
          <div
            className={`h-11 w-11 rounded-xl ${theme.bg} border ${theme.border} flex items-center justify-center ${theme.text} shrink-0`}
          >
            <Icon
              strokeWidth={2}
              className={`h-6 w-6 group-hover:scale-105 transition-transform duration-[250ms] ease-out`}
              style={
                isSpinning
                  ? { animation: 'spin 2s linear infinite' }
                  : undefined
              }
            />
          </div>
          <span className="text-[13px] font-semibold text-textSecondary truncate">{title}</span>
        </div>
        <h2 className="text-[48px] font-bold text-textPrimary leading-none tracking-tight">
          {value}
        </h2>
        <span className="text-[11px] text-slate-400/90 font-medium block truncate">{description}</span>
      </div>
    </motion.div>
  );
};

export default StatisticCard;
