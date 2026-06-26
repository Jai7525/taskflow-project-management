import React from 'react';

/**
 * Reusable Input field conforming to Locked Design System.
 * 12px rounded-xl border, slate-50 default backgrounds, accessibility focus properties.
 */
const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-150 text-sm ${
          error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
