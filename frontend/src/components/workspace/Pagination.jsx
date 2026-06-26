import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination controls for task list navigation.
 */
const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-1 py-3">
      {/* Summary */}
      <p className="text-sm text-slate-500">
        Showing{' '}
        <span className="font-semibold text-slate-700">{from}–{to}</span>
        {' '}of{' '}
        <span className="font-semibold text-slate-700">{total}</span>
        {' '}tasks
      </p>

      {/* Page Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition cursor-pointer focus:outline-none"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((pageNum) => {
              // Show max 5 page numbers around the current page
              return Math.abs(pageNum - page) <= 2;
            })
            .map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`h-9 w-9 rounded-lg text-sm font-medium transition cursor-pointer focus:outline-none ${
                  pageNum === page
                    ? 'bg-brand-500 text-white shadow-soft-sm shadow-brand-500/10'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            ))}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition cursor-pointer focus:outline-none"
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
