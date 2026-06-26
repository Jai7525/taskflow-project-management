import React, { useMemo } from 'react';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Premium Sidebar refined to match the locked visual mockup.
 * Background `#111827` / `#020617`, active nav `#6366F1`, profile/logout pinned to bottom.
 */
const Sidebar = () => {
  const { user, logout } = useAuth();

  // Generate initials for avatar fallback
  const initials = useMemo(() => {
    if (!user || !user.name) return 'TU';
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }, [user]);

  return (
    <aside className="w-[240px] bg-[#111827] flex flex-col h-screen select-none border-r border-[rgba(255,255,255,0.06)] shrink-0 p-4 transition-colors duration-200">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-[#6366F1] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-[0_2px_8px_rgba(99,102,241,0.3)]">
            ⚡
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-white font-sans block">
              TaskFlow
            </span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
              Your Workspace
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 space-y-3">
        {/* Workspace Workspace button */}
        <button
          className="w-full flex items-center space-x-3 px-4 py-3 bg-[#6366F1] text-white rounded-[12px] text-sm font-semibold transition cursor-pointer"
        >
          <LayoutDashboard className="h-4.5 w-4.5" />
          <span>Workspace</span>
        </button>

      </nav>

      {/* Footer Profile & Logout (Pinned to bottom) */}
      <div className="border-t border-[rgba(255,255,255,0.06)] pt-4 space-y-3">
        {/* User Card */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-[rgba(255,255,255,0.08)] transition cursor-pointer">
          <div className="flex items-center space-x-3 min-w-0">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="User"
                className="h-9 w-9 rounded-full object-cover border border-[#374151] shrink-0"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-[#6366F1] text-white font-bold flex items-center justify-center text-[11px] font-sans tracking-wide border border-[#374151] shadow-sm shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {user?.name || 'TaskFlow User'}
              </p>
              <p className="text-[10px] text-[rgba(255,255,255,0.7)] truncate font-medium">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-transparent text-white hover:text-red-600 hover:bg-white rounded-[12px] text-xs font-bold transition-all duration-150 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
