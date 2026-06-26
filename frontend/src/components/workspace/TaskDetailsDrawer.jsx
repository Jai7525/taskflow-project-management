import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, MessageSquare, Paperclip, Clock, Edit2, CheckCircle2 } from 'lucide-react';
import taskService from '../../services/taskService';
import { priorityColor, statusColor } from '../../utils/colorHelpers';
import { formatDate } from '../../utils/formatDate';
import { toast } from 'react-hot-toast';

const TaskDetailsDrawer = ({ isOpen, taskId, onClose, onUpdate }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'Alex Rivera', text: 'Started investigating the Tailwind design files.', time: '2 hours ago' },
    { id: 2, author: 'Sarah Connor', text: 'Looks great! Make sure to support the 8pt spacing system.', time: '1 hour ago' }
  ]);

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails();
    }
  }, [isOpen, taskId]);

  const fetchTaskDetails = async () => {
    setLoading(true);
    try {
      const response = await taskService.getTaskById(taskId);
      if (response?.success) {
        setTask(response.data);
      }
    } catch (error) {
      toast.error('Failed to load task details');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!task) return;
    try {
      const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
      const response = await taskService.updateTask(task.id, { status: newStatus });
      if (response?.success) {
        setTask(response.data);
        toast.success(`Task status updated to ${newStatus}`);
        if (onUpdate) onUpdate();
      }
    } catch {
      toast.error('Failed to update task status');
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      author: 'TaskFlow User',
      text: commentText.trim(),
      time: 'Just now'
    };
    setComments((prev) => [...prev, newComment]);
    setCommentText('');
    toast.success('Comment added (UI only)');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Side Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[520px] bg-white border-l border-slate-200 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleStatusToggle}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                task?.status === 'Completed'
                  ? 'bg-success-50 text-success-700 border-success-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{task?.status === 'Completed' ? 'Completed' : 'Mark Completed'}</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Panel */}
        {loading ? (
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <div className="h-6 w-3/4 bg-slate-100 animate-pulse rounded-lg" />
            <div className="h-4 w-1/2 bg-slate-100 animate-pulse rounded-lg" />
            <hr className="border-slate-100" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-slate-100 animate-pulse rounded-lg" />
              <div className="h-4 w-5/6 bg-slate-100 animate-pulse rounded-lg" />
              <div className="h-4 w-4/5 bg-slate-100 animate-pulse rounded-lg" />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
            {/* Title & Metadata */}
            <div className="space-y-4">
              <h1 className="text-xl font-bold text-slate-900 leading-snug">{task?.title}</h1>

              {/* Status and Metadata Badges */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                  <div className="flex items-center space-x-1.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(task?.status)}`}>
                      {task?.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Priority</span>
                  <div className="flex items-center space-x-1.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${priorityColor(task?.priority)}`}>
                      {task?.priority || 'Medium'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Due Date</span>
                  <div className="text-xs font-medium text-slate-700 flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{task?.dueDate ? formatDate(task.dueDate) : 'No due date'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Created</span>
                  <div className="text-xs font-medium text-slate-700 flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{task?.createdAt ? formatDate(task.createdAt) : ''}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-white border border-slate-150 p-4 rounded-xl">
                {task?.description || 'No description provided.'}
              </p>
            </div>

            {/* Attachments (Placeholder) */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Paperclip className="h-3.5 w-3.5" />
                <span>Attachments</span>
              </h3>
              <div className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-4 text-center cursor-pointer transition">
                <span className="text-xs text-slate-500">Drag files here or choose a file</span>
              </div>
            </div>

            {/* Comments (Mock Visual UI) */}
            <div className="space-y-4 pt-4 border-t border-slate-100 flex-1 flex flex-col">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1 shrink-0">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Discussion ({comments.length})</span>
              </h3>

              {/* Comments list */}
              <div className="space-y-3 flex-1 overflow-y-auto min-h-[120px]">
                {comments.map((c) => (
                  <div key={c.id} className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">{c.author}</span>
                      <span className="text-slate-400 text-[10px]">{c.time}</span>
                    </div>
                    <p className="text-slate-600">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2 shrink-0 pt-2">
                <input
                  type="text"
                  placeholder="Ask a question or post an update..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TaskDetailsDrawer;
