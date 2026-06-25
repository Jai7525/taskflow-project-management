import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Layout wrapper for authentication pages (Login, Register).
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-soft-lg border border-slate-100">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
