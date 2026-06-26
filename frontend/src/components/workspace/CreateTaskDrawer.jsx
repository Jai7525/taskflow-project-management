import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import taskService from '../../services/taskService';
import { toast } from 'react-hot-toast';

/**
 * Premium Create Task Slide-Out Drawer (Phase 8E).
 * Implements Framer Motion slide-in from right, inputs disabled during submit,
 * Escape key binding, accessibility focus management, and automatic form resetting.
 */
const CreateTaskDrawer = ({ isOpen, onClose, onSuccess, defaultStatus = 'Pending' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: defaultStatus,
    priority: 'Medium',
    dueDate: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [dueDateFocused, setDueDateFocused] = useState(false);

  // References for invalid field focus redirection
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const dueDateInputRef = useRef(null);

  // Format today's date to YYYY-MM-DD to restrict past due dates
  const todayStr = new Date().toISOString().split('T')[0];

  // Auto-focus Title input on drawer mount & reset form fields
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'Medium',
        dueDate: '',
      });
      setErrors({});
      setApiError(null);
      
      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
      }, 250); // wait for slide-in animation to complete
      return () => clearTimeout(timer);
    }
  }, [isOpen, defaultStatus]);

  // Bind Escape key to close drawer (when not submitting)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isSubmitting]);

  // Form field input change handler
  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    // Clear validation error on type
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Perform form validation and return status
  const validateForm = () => {
    const validationErrors = {};

    if (!formData.title.trim()) {
      validationErrors.title = 'Task title is required.';
    } else if (formData.title.length < 3) {
      validationErrors.title = 'Title must contain at least 3 characters.';
    } else if (formData.title.length > 100) {
      validationErrors.title = 'Title cannot exceed 100 characters.';
    }

    if (!formData.description.trim()) {
      validationErrors.description = 'Description is required.';
    } else if (formData.description.length < 20) {
      validationErrors.description = 'Description must contain at least 20 characters.';
    } else if (formData.description.length > 500) {
      validationErrors.description = 'Description cannot exceed 500 characters.';
    }

    if (!formData.dueDate) {
      validationErrors.dueDate = 'Please choose a due date.';
    } else {
      const selected = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        validationErrors.dueDate = 'Due date cannot be in the past.';
      }
    }

    setErrors(validationErrors);

    // Auto-focus the first invalid field
    if (validationErrors.title) {
      titleInputRef.current?.focus();
    } else if (validationErrors.description) {
      descriptionInputRef.current?.focus();
    } else if (validationErrors.dueDate) {
      dueDateInputRef.current?.focus();
    }

    return Object.keys(validationErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setApiError(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      };

      const response = await taskService.createTask(payload);
      if (response?.success) {
        toast.success('Task created successfully', { position: 'top-right', duration: 3000 });
        onSuccess();
        onClose();
      } else {
        setApiError('Unable to create task. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setApiError('Unable to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay (Fade-in transition) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={() => {
              if (!isSubmitting) onClose();
            }}
            className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer container panel (Slide from right transition) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[85%] md:w-[460px] bg-white border-l border-slate-200 shadow-2xl flex flex-col select-none"
          >
            {/* Header section */}
            <div className="py-5 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
              <div>
                <h2 id="drawer-title" className="text-lg font-bold text-slate-900 font-sans">
                  Create New Task
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add a new task to stay organized and on track.
                </p>
              </div>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="p-1.5 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form area */}
            <form
              onSubmit={handleFormSubmit}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none"
            >
              {/* API Level Global Error Notice */}
              {apiError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-700 font-medium">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
                  <span>{apiError}</span>
                </div>
              )}

              {/* Task Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  ref={titleInputRef}
                  disabled={isSubmitting}
                  placeholder="Enter task title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/30 focus:bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-150 text-sm ${
                    errors.title ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/5' : 'border-slate-200'
                  }`}
                />
                {errors.title && (
                  <p className="text-xs font-medium text-red-500 flex items-center space-x-1">
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  ref={descriptionInputRef}
                  disabled={isSubmitting}
                  placeholder="Add more details about this task..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/30 focus:bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-150 text-sm resize-none ${
                    errors.description ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/5' : 'border-slate-200'
                  }`}
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                  <span>Minimum 20 characters</span>
                  <span className={formData.description.length > 500 ? 'text-red-500' : ''}>
                    {formData.description.length} / 500 characters
                  </span>
                </div>
                {errors.description && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Grid: Status & Priority */}
              <div className="grid grid-cols-2 gap-4">
                {/* Status Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    disabled={isSubmitting}
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100/30 focus:bg-white rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-150 text-sm cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Priority Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    disabled={isSubmitting}
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100/30 focus:bg-white rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-150 text-sm cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* Due Date picker */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input
                    type={dueDateFocused || formData.dueDate ? "date" : "text"}
                    onFocus={() => setDueDateFocused(true)}
                    onBlur={() => setDueDateFocused(false)}
                    placeholder="Select due date"
                    min={todayStr}
                    ref={dueDateInputRef}
                    disabled={isSubmitting}
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-150 text-sm cursor-pointer ${
                      errors.dueDate ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/5' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.dueDate && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.dueDate}
                  </p>
                )}
              </div>

              {/* Action Buttons panel */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#6366F1] hover:bg-[#5053de] text-white rounded-xl text-sm font-semibold transition shadow-[0_1px_2px_rgba(99,102,241,0.15)] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed flex items-center space-x-1.5"
                >
                  {isSubmitting && <Loader2 className="h-4.5 w-4.5 animate-spin" />}
                  <span>{isSubmitting ? 'Creating Task...' : 'Create Task'}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateTaskDrawer;
