import React from 'react';
import { Plus } from 'lucide-react';
import Button from './Button';

/**
 * EmptyState component conforming to locked workspace aesthetics.
 */
const EmptyState = ({
  title = 'No Tasks Yet',
  subtitle = 'Create your first task to start organizing your work.',
  icon = '📋',
  actionLabel,
  onActionClick,
  className = '',
}) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 w-full ${className}`}>
      <div className="text-4xl select-none" role="img" aria-label="Clipboard">
        {icon}
      </div>
      <div>
        <h3 className="text-[18px] font-bold text-slate-800 font-sans">{title}</h3>
        <p className="text-sm text-slate-400 mt-1 font-medium">{subtitle}</p>
      </div>
      {actionLabel && onActionClick && (
        <Button
          onClick={onActionClick}
          variant="primary"
          className="inline-flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
