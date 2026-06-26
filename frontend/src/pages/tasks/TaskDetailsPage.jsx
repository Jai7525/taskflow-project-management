import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const TaskDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to={ROUTES.WORKSPACE} className="text-slate-600 hover:text-slate-900">
          &larr; Back to Workspace
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">Task Details Page Placeholder</h1>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-soft-sm border border-slate-200">
        <p className="text-slate-600 mb-2">No task details, activity tracking, edit buttons, or delete actions in Phase 5.</p>
        <div className="bg-slate-50 p-3 rounded border border-slate-100 font-mono text-sm">
          Task ID Parameter: <span className="text-brand-600 font-bold">{id}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
