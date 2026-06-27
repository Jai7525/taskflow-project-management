import React, { useState, useRef, useEffect } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

/**
 * Premium Form Edit Mode component for Task Details updates (Phase 8F).
 */
const TaskDetailsEdit = ({ task, onSave, isSaving, apiError, setApiError, onChange }) => {
  const [formData, setFormData] = useState({
    title: task.title || '',
    description: task.description || '',
    status: task.status || 'Pending',
    priority: task.priority || 'Medium',
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
  });

  const [errors, setErrors] = useState({});
  const [dueDateFocused, setDueDateFocused] = useState(false);

  // References for invalid input focus management
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const dateRef = useRef(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Auto-focus Title on edit mode mount
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleInputChange = (field, val) => {
    const updated = { ...formData, [field]: val };
    setFormData(updated);
    if (onChange) {
      onChange(updated);
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    if (apiError) {
      setApiError(null);
    }
  };

  const validate = () => {
    const valErrors = {};

    if (!formData.title.trim()) {
      valErrors.title = 'Task title is required.';
    } else if (formData.title.length < 3) {
      valErrors.title = 'Title must contain at least 3 characters.';
    } else if (formData.title.length > 100) {
      valErrors.title = 'Title cannot exceed 100 characters.';
    }

    if (!formData.description.trim()) {
      valErrors.description = 'Description is required.';
    } else if (formData.description.length < 20) {
      valErrors.description = 'Description must contain at least 20 characters.';
    } else if (formData.description.length > 500) {
      valErrors.description = 'Description cannot exceed 500 characters.';
    }

    if (!formData.dueDate) {
      valErrors.dueDate = 'Please choose a due date.';
    } else {
      const selected = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        valErrors.dueDate = 'Due date cannot be in the past.';
      }
    }

    setErrors(valErrors);

    // Auto focus first invalid input
    if (valErrors.title) {
      titleRef.current?.focus();
    } else if (valErrors.description) {
      descRef.current?.focus();
    } else if (valErrors.dueDate) {
      dateRef.current?.focus();
    }

    return Object.keys(valErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isSaving) return;
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <form
      id="edit-task-form"
      onSubmit={onSubmit}
      className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none select-none bg-white"
    >
      {/* API Level Global Error */}
      {apiError && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-700 font-medium">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Task Title */}
      <div className="space-y-1.5">
        <label htmlFor="edit-task-title" className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          id="edit-task-title"
          name="title"
          type="text"
          ref={titleRef}
          disabled={isSaving}
          placeholder="Enter task title..."
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/30 focus:bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-[#6366F1] transition duration-150 text-sm ${
            errors.title ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/5' : 'border-slate-200'
          }`}
        />
        {errors.title && (
          <p className="text-xs font-medium text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="edit-task-description" className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="edit-task-description"
          name="description"
          rows={5}
          ref={descRef}
          disabled={isSaving}
          placeholder="Add more details about this task..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={`w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/30 focus:bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-[#6366F1] transition duration-150 text-sm resize-none ${
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
          <p className="text-xs font-medium text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Status & Priority select */}
      <div className="grid grid-cols-2 gap-4">
        {/* Status */}
        <div className="space-y-1.5">
          <label htmlFor="edit-task-status" className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="edit-task-status"
            name="status"
            disabled={isSaving}
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition duration-150 text-sm cursor-pointer"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-1.5">
          <label htmlFor="edit-task-priority" className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            id="edit-task-priority"
            name="priority"
            disabled={isSaving}
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition duration-150 text-sm cursor-pointer"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Due Date picker */}
      <div className="space-y-1.5">
        <label htmlFor="edit-task-due-date" className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
          Due Date <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Calendar className="h-4 w-4" />
          </div>
          <input
            id="edit-task-due-date"
            name="dueDate"
            type={dueDateFocused || formData.dueDate ? 'date' : 'text'}
            onFocus={() => setDueDateFocused(true)}
            onBlur={() => setDueDateFocused(false)}
            placeholder="Select due date"
            min={todayStr}
            ref={dateRef}
            disabled={isSaving}
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-[#6366F1] transition duration-150 text-sm cursor-pointer ${
              errors.dueDate ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/5' : 'border-slate-200'
            }`}
          />
        </div>
        {errors.dueDate && (
          <p className="text-xs font-medium text-red-500">{errors.dueDate}</p>
        )}
      </div>
    </form>
  );
};

export default TaskDetailsEdit;
