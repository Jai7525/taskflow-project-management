import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable Dropdown select/menu component with custom fade-in and scale animations.
 */
const Dropdown = ({
  options = [],
  value,
  onChange,
  label,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label || `Sort: ${selectedOption?.label}`}
        className={`bg-white border border-slate-200 hover:border-slate-350 text-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold transition cursor-pointer flex items-center justify-between space-x-2 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] ${className}`}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-soft-lg z-20 py-1 overflow-hidden"
          >
            <div role="listbox" aria-label={label || 'Sort options'}>
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={opt.value === value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition hover:bg-slate-50 cursor-pointer ${
                    opt.value === value
                      ? 'text-brand-500 font-bold bg-brand-50/20'
                      : 'text-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
