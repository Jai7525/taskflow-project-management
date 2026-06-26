import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';

/**
 * Centered Premium Delete Confirmation Dialog modal (Phase 8F).
 */
const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm, isDeleting }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 z-60 backdrop-blur-sm flex items-center justify-center"
            onClick={() => { if (!isDeleting) onCancel(); }}
          >
            {/* Modal Dialog container */}
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="bg-white border border-[#E5E7EB] rounded-[16px] max-w-sm w-full mx-4 p-6 shadow-2xl space-y-4 select-none"
              onClick={(e) => e.stopPropagation()} // prevent overlay click closing
            >
              <div className="flex items-start space-x-3.5">
                <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <AlertTriangle className="h-5.5 w-5.5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-[#111827] font-sans">
                    Delete Task?
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    This action cannot be undone. All database records and history for this task will be permanently removed.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-[#E5E7EB] hover:bg-slate-50 active:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-40 transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-bold cursor-pointer shadow-[0_1px_2px_rgba(220,38,38,0.15)] flex items-center space-x-1.5 transition-colors duration-150 disabled:opacity-75"
                >
                  {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
