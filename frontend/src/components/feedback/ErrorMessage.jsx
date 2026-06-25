import React from 'react';

/**
 * Error message placeholder component.
 */
const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-danger-50 border border-danger-500/20 text-danger-600 p-4 rounded-lg text-sm">
      <span className="font-semibold">Error:</span> {message || 'ErrorMessage Component Placeholder'}
    </div>
  );
};

export default ErrorMessage;
