import React, { useState, useEffect, useCallback } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { motion as motionDiv, AnimatePresence as AnimatePresenceWrapper } from 'framer-motion';
import taskService from '../../services/taskService';
import { toast } from 'react-hot-toast';

import TaskDetailsSkeleton from './TaskDetailsSkeleton';
import TaskDetailsView from './TaskDetailsView';
import TaskDetailsEdit from './TaskDetailsEdit';
import Badge from '../ui/Badge';

const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'completed';
    case 'in progress':
      return 'progress';
    case 'pending':
    default:
      return 'pending';
  }
};

/**
 * Master Controller Details Drawer component (Phase 8F).
 * Orchestrates details fetching, read-only vs edit toggles, loading spin states,
 * backdrop outside-clicks, escape key bindings, dirty checks, and delete confirmations.
 */
const TaskDetailsDrawer = ({ isOpen, taskId, onClose, onUpdate, isOffline = false, showOfflineToast }) => {
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  // Loading States
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Errors
  const [fetchError, setFetchError] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Fetch Task Details on status/updated changes or selection change
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch Task Details on mount or selection change
  const fetchTask = useCallback(async () => {
    if (!taskId) return;
    setLoading(true);
    setFetchError(null);
    setIsEditing(false);
    setEditData(null);
    setShowDeleteConfirm(false);
    try {
      const response = await taskService.getTaskById(taskId);
      if (response?.success) {
        setTask(response.data);
      } else {
        setFetchError('Unable to load task.');
      }
    } catch (err) {
      setFetchError('Unable to load task.');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTask();
    }
  }, [isOpen, taskId, fetchTask]);

  // Dirty State Checker for unsaved changes closing block
  const isDirty = useCallback(() => {
    if (!isEditing || !task || !editData) return false;
    const originalDueDate = task.dueDate ? task.dueDate.split('T')[0] : '';
    return (
      editData.title !== task.title ||
      editData.description !== task.description ||
      editData.status !== task.status ||
      editData.priority !== task.priority ||
      editData.dueDate !== originalDueDate
    );
  }, [isEditing, task, editData]);

  // Handle drawer close attempt (checks dirty changes)
  const handleCloseAttempt = useCallback(() => {
    if (isDirty()) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to discard them and close?'
      );
      if (!confirmClose) return;
    }
    onClose();
  }, [isDirty, onClose]);

  // Bind Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSaving && !isDeleting && !showDeleteConfirm) {
        handleCloseAttempt();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSaving, isDeleting, showDeleteConfirm, handleCloseAttempt]);

  // Update edit data tracking from form child
  const handleEditDataChange = (data) => {
    setEditData(data);
  };

  // Perform API Save updates
  const handleSave = async (formData) => {
    setIsSaving(true);
    setApiError(null);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      };

      const response = await taskService.updateTask(task.id, payload);
      if (response?.success) {
        toast.success('Task updated successfully', { position: 'top-right', duration: 3000 });
        setTask(response.data);
        setIsEditing(false);
        setEditData(null);
        if (onUpdate) onUpdate();
      } else {
        setApiError('Unable to update task. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setApiError('Unable to update task. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Perform API Delete action
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await taskService.deleteTask(task.id);
      if (response?.success) {
        toast.success('Task deleted successfully', { position: 'top-right', duration: 3000 });
        setShowDeleteConfirm(false);
        onClose();
        if (onUpdate) onUpdate();
      } else {
        toast.error('Failed to delete task. Please try again.', { position: 'top-right' });
      }
    } catch (err) {
      toast.error('Failed to delete task. Please try again.', { position: 'top-right' });
    } finally {
      setIsDeleting(false);
    }
  };

  const renderFooter = () => {
    if (loading || fetchError) {
      return (
        <div className="p-6 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      );
    }

    if (showDeleteConfirm) {
      return (
        <motionDiv
          key="delete-confirm"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="border-t border-slate-200 bg-red-50/10 py-3 px-5 space-y-3 shrink-0 overflow-hidden"
        >
          <div className="flex items-start space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-red-50 border border-red-100/60 flex items-center justify-center text-red-650 shrink-0">
              <AlertCircle className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 font-sans">
                Delete this task?
              </h4>
              <p className="text-[10px] text-slate-500 font-medium">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-1">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setShowDeleteConfirm(false)}
              className="px-5 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition cursor-pointer disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-sm font-semibold transition shadow-[0_1px_2px_rgba(220,38,38,0.15)] cursor-pointer disabled:opacity-75 flex items-center space-x-1.5"
            >
              {isDeleting && <Loader2 className="h-4.5 w-4.5 animate-spin" />}
              <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
            </button>
          </div>
        </motionDiv>
      );
    }

    if (isEditing) {
      return (
        <motionDiv
          key="edit-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="p-6 border-t border-slate-100 flex items-center justify-end space-x-3 shrink-0"
        >
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditData(null);
              setApiError(null);
            }}
            disabled={isSaving}
            className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition cursor-pointer disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type={isOffline ? "button" : "submit"}
            form={isOffline ? undefined : "edit-task-form"}
            onClick={isOffline ? showOfflineToast : undefined}
            disabled={isSaving || (!isOffline && !isDirty())}
            title={isOffline ? "Requires an internet connection" : "Save Changes"}
            className={`px-5 py-2.5 bg-[#6366F1] text-white rounded-xl text-sm font-semibold transition shadow-[0_1px_2px_rgba(99,102,241,0.15)] flex items-center space-x-1.5 ${
              isOffline ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#5053de] active:bg-[#4043ce] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </motionDiv>
      );
    }

    return (
      <motionDiv
        key="normal-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="p-6 border-t border-slate-100 flex items-center justify-between shrink-0"
      >
        <button
          type="button"
          onClick={isOffline ? showOfflineToast : () => setShowDeleteConfirm(true)}
          title={isOffline ? "Requires an internet connection" : "Delete task"}
          className={`px-5 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-semibold transition ${
            isOffline ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100/70 active:bg-red-200/50 cursor-pointer'
          }`}
        >
          Delete Task
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={isOffline ? showOfflineToast : () => {
              setIsEditing(true);
              setEditData({
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority || 'Medium',
                dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
              });
            }}
            title={isOffline ? "Requires an internet connection" : "Edit task"}
            className={`px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition ${
              isOffline ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 active:bg-slate-100 cursor-pointer'
            }`}
          >
            Edit Task
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#6366F1] hover:bg-[#5053de] active:bg-[#4043ce] text-white rounded-xl text-sm font-semibold transition shadow-[0_1px_2px_rgba(99,102,241,0.15)] cursor-pointer"
          >
            Close
          </button>
        </div>
      </motionDiv>
    );
  };

  return (
    <AnimatePresenceWrapper>
      {isOpen && (
        <>
          {/* Backdrop overlay (Fade transition) */}
          <motionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={() => {
              if (!isSaving && !isDeleting) handleCloseAttempt();
            }}
            className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Panel Container (Slide from right transition) */}
          <motionDiv
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] md:w-[480px] bg-white border-l border-slate-200 shadow-2xl flex flex-col select-none"
          >
            {/* Header section */}
            <div className="py-5 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-bold text-slate-900 font-sans">
                    Task Details
                  </h2>
                  {!loading && !fetchError && task && (
                    <Badge variant={getStatusVariant(task.status)}>
                      {task.status}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-505 mt-0.5">
                  {isEditing ? 'Editing task properties' : 'View task configurations'}
                </p>
              </div>
              <button
                onClick={handleCloseAttempt}
                disabled={isSaving || isDeleting}
                className="p-1.5 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-xl transition cursor-pointer disabled:opacity-40"
                aria-label="Close details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main content body conditional render */}
            {loading ? (
              <TaskDetailsSkeleton />
            ) : fetchError ? (
              <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-3.5 text-center">
                <AlertCircle className="h-9 w-9 text-red-555" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#111827]">Unable to load task</h3>
                  <p className="text-xs text-slate-505 max-w-xs mx-auto">
                    There was an issue fetching details from the database. Please try again.
                  </p>
                </div>
                <button
                  onClick={fetchTask}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : isEditing ? (
              <TaskDetailsEdit
                task={task}
                onSave={handleSave}
                isSaving={isSaving}
                apiError={apiError}
                setApiError={setApiError}
                onChange={handleEditDataChange} // tracks dirty state
              />
            ) : (
              <TaskDetailsView task={task} />
            )}

            {/* Footer Panel Actions */}
            <AnimatePresenceWrapper mode="wait">
              {renderFooter()}
            </AnimatePresenceWrapper>
          </motionDiv>
        </>
      )}
    </AnimatePresenceWrapper>
  );
};

export default TaskDetailsDrawer;
