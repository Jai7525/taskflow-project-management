import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Button component complying with locked design system.
 * Features 12px radius, scale hover transition, focus rings, and size scales.
 */
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-soft-sm shadow-brand-500/10',
    secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50',
    danger: 'bg-danger-500 hover:bg-danger-600 text-white shadow-soft-sm shadow-danger-500/10',
    ghost: 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4.5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
