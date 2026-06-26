import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Placeholder Card component conforming to locked structural design.
 * 16px border-radius, pure white background, subtle enterprise shadows.
 */
const PlaceholderCard = ({ title, children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`bg-white border border-[#E5E7EB] rounded-[16px] p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] ${className}`}
    >
      {title && (
        <h3 className="text-[18px] font-bold text-[#111827] tracking-tight mb-4 font-sans border-b border-[#E5E7EB] pb-2">
          {title}
        </h3>
      )}
      <div className="text-[#6B7280] text-[16px] leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
};

export default PlaceholderCard;
