import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Page Placeholder</h1>
        <Link
          to={ROUTES.ADD_TASK}
          className="bg-brand-500 hover:bg-brand-600 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Add Task Placeholder Link
        </Link>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-soft-sm border border-slate-200">
        <p className="text-slate-600">No dashboard statistics, cards, lists, or business features in Phase 5.</p>
        <div className="mt-4 flex space-x-4">
          <Link to="/tasks/123" className="text-brand-500 hover:underline">
            View Task Details (123)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
