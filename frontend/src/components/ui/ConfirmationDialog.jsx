import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

/**
 * Reusable modal popup to confirm destructive actions.
 */
const ConfirmationDialog = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false
}) => {
  // Close modal on escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      {/* Backdrop click closer */}
      <div className="absolute inset-0 cursor-default" onClick={onCancel} />

      {/* Modal Dialog Card */}
      <div 
        className="bg-white rounded-xl shadow-soft-xl border border-slate-200 w-full max-w-md p-6 relative z-10 scale-100 transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {isDangerous && (
              <div className="p-2 bg-danger-50 text-danger-600 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
              </div>
            )}
            <h3 id="dialog-title" className="text-lg font-bold text-slate-900 font-sans">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message */}
        <div className="mt-3">
          <p className="text-sm text-slate-600 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-slate-500/20 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 font-medium rounded-lg text-sm transition focus:outline-none focus:ring-2 cursor-pointer text-white ${
              isDangerous 
                ? 'bg-danger-500 hover:bg-danger-600 focus:ring-danger-500/20 shadow-soft-sm shadow-danger-500/10'
                : 'bg-brand-500 hover:bg-brand-600 focus:ring-brand-500/20 shadow-soft-sm shadow-brand-500/10'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
