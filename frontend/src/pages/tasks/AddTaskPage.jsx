import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const AddTaskPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to={ROUTES.WORKSPACE} className="text-slate-600 hover:text-slate-900">
          &larr; Back to Workspace
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">Add Task Page Placeholder</h1>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-soft-sm border border-slate-200">
        <p className="text-slate-600">No task forms, inputs, or validation in Phase 5.</p>
      </div>
    </div>
  );
};

export default AddTaskPage;
