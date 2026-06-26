import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import taskService from '../../services/taskService';
import { toast } from 'react-hot-toast';

const CreateTaskDrawer = ({ isOpen, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
      dueDate: '',
    },
  });

  // Reset form when drawer opens/closes
  useEffect(() => {
    if (!isOpen) {
      reset({
        title: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        dueDate: '',
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      // Clean up empty due date
      const payload = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      };

      const response = await taskService.createTask(payload);
      if (response?.success) {
        toast.success('Task created successfully');
        onSuccess();
        onClose();
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to create task';
      toast.error(errMsg);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-sans">Create Task</h2>
            <p className="text-xs text-slate-500 mt-0.5">Add a new task to your workspace</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g. Design Login Page"
              className={`w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-150 text-sm ${
                errors.title ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'
              }`}
              {...register('title', {
                required: 'Title is required',
                maxLength: { value: 100, message: 'Title cannot exceed 100 characters' },
              })}
            />
            {errors.title && (
              <p className="text-xs font-medium text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="e.g. Create responsive login page using Tailwind CSS, supporting auto-focus and keyboard triggers."
              className={`w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-150 text-sm resize-none ${
                errors.description ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'
              }`}
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 20, message: 'Description must be at least 20 characters long' },
              })}
            />
            {errors.description && (
              <p className="text-xs font-medium text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Status & Priority Selection Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                Status
              </label>
              <select
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-150 text-sm cursor-pointer"
                {...register('status')}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                Priority
              </label>
              <select
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-150 text-sm cursor-pointer"
                {...register('priority')}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Due Date
            </label>
            <input
              type="date"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition duration-150 text-sm cursor-pointer"
              {...register('dueDate')}
            />
          </div>

          {/* Buttons Footer (inside form but absolute/sticky at bottom if needed, or simple block spacing) */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition shadow-soft-sm shadow-brand-500/10 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateTaskDrawer;
