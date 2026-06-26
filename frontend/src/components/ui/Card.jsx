import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Card component with 16px radius, soft shadows, and optional hover animations.
 */
const Card = ({
  children,
  onClick,
  hoverable = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-white border border-slate-200 rounded-2xl p-6 shadow-soft-sm';

  if (hoverable) {
    return (
      <motion.div
        whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
        className={`${baseClasses} transition-colors duration-150 hover:border-slate-350 cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
