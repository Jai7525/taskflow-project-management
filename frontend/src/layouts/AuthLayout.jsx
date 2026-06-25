import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Split-screen layout wrapper for authentication pages (Login, Register).
 * Left column features a premium dashboard graphic with a brand theme.
 * Right column hosts the actual authentication cards.
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Column: Visual Illustration Area (hidden on mobile/tablet) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-tr from-brand-950 via-slate-900 to-slate-950 items-center justify-center p-12 overflow-hidden border-r border-slate-800">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />

        <div className="max-w-lg w-full relative z-10 space-y-8">
          {/* Badge */}
          <div>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-soft-sm">
              ⚡ PROJECT MANAGEMENT PORTAL
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight font-sans sm:text-5xl">
              Welcome back to <span className="text-brand-500">TaskFlow</span>
            </h1>
            <p className="text-lg text-slate-400 font-normal">
              Manage tasks, track progress, and collaborate in real-time inside one unified workspace.
            </p>
          </div>

          {/* Interactive UI Mock Visual */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 shadow-soft-xl p-6 space-y-4">
            {/* Mock Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-danger-500/80" />
                <span className="w-3 h-3 rounded-full bg-warning-500/80" />
                <span className="w-3 h-3 rounded-full bg-success-500/80" />
              </div>
              <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
            </div>

            {/* Mock Task Columns */}
            <div className="grid grid-cols-3 gap-3 text-left">
              {/* Col 1 */}
              <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 space-y-2">
                <div className="h-3 w-16 bg-warning-500/20 text-warning-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-warning-500/10 inline-block">
                  Pending
                </div>
                <div className="h-10 bg-slate-800/50 rounded-md border border-slate-800 p-2 space-y-1.5">
                  <div className="h-2 w-full bg-slate-700 rounded" />
                  <div className="h-1.5 w-1/2 bg-slate-800 rounded" />
                </div>
              </div>
              
              {/* Col 2 */}
              <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 space-y-2">
                <div className="h-3 w-20 bg-brand-500/20 text-brand-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-brand-500/10 inline-block">
                  In Progress
                </div>
                <div className="h-10 bg-slate-800/50 rounded-md border border-slate-800 p-2 space-y-1.5">
                  <div className="h-2 w-full bg-slate-700 rounded animate-pulse" />
                  <div className="h-1.5 w-3/4 bg-slate-800 rounded" />
                </div>
              </div>

              {/* Col 3 */}
              <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 space-y-2">
                <div className="h-3 w-20 bg-success-500/20 text-success-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-success-500/10 inline-block">
                  Completed
                </div>
                <div className="h-10 bg-slate-800/50 rounded-md border border-slate-800 p-2 space-y-1.5">
                  <div className="h-2 w-full bg-slate-700 rounded line-through opacity-50" />
                  <div className="h-1.5 w-1/3 bg-slate-800 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form Outlet Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 md:px-20 bg-white">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8">
            <div className="h-9 w-9 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-soft-md shadow-brand-500/20">
              ⚡
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
              TaskFlow
            </span>
          </div>

          {/* Form Outlet */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
