import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Circle, Clock, LayoutDashboard,
  Calendar, BarChart2, Zap,
} from 'lucide-react';

/**
 * Premium AuthLayout — two-panel split screen.
 * Left: product showcase with miniature dashboard mockup.
 * Right: authentication card with <Outlet />.
 * Mobile: right panel only (left hidden), with hero text shown above card.
 */

/* ── Mini task card component used in the mockup ── */
const MockCard = ({ title, tag, tagColor, progress, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    className="bg-white rounded-[12px] border border-[#E5E7EB] p-3 shadow-[0_2px_8px_rgba(15,23,42,.06)] space-y-2"
  >
    <div className="flex items-start justify-between gap-2">
      <p className="text-[11px] font-semibold text-slate-700 leading-tight">{title}</p>
      <span
        className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
        style={{ background: tagColor + '18', color: tagColor }}
      >
        {tag}
      </span>
    </div>
    {progress !== undefined && (
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${progress}%`, background: tagColor }}
        />
      </div>
    )}
  </motion.div>
);

/* ── Mini stat widget ── */
const MockStat = ({ label, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay, ease: 'easeOut' }}
    className="bg-white rounded-[12px] border border-[#E5E7EB] p-3 flex items-center gap-2.5 shadow-[0_2px_8px_rgba(15,23,42,.05)]"
  >
    <div className="h-8 w-8 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: color + '14' }}>
      <Icon size={14} style={{ color }} />
    </div>
    <div>
      <p className="text-[15px] font-extrabold text-slate-800 leading-none">{value}</p>
      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{label}</p>
    </div>
  </motion.div>
);

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex font-sans" style={{ background: '#F6F8FB' }}>

      {/* ── LEFT PANEL — Product Showcase (Desktop/Tablet) ── */}
      <div
        className="hidden lg:flex lg:w-[50%] xl:w-[54%] relative flex-col justify-center p-12 xl:p-16 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
        }}
      >
        {/* Soft elegant radial glows */}
        <div className="absolute top-0 left-0 w-[60%] h-[60%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.15) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 right-0 w-[60%] h-[60%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle at 80% 80%, rgba(139,92,246,0.1) 0%, transparent 65%)' }} />

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 max-w-xl w-full mx-auto space-y-10"
        >
          {/* Brand mark */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-[#6366F1] rounded-[10px] flex items-center justify-center shadow-[0_4px_12px_rgba(99,102,241,.4)]">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">TaskFlow</span>
          </div>

          {/* Hero copy */}
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight xl:leading-tight tracking-tight">
              Manage projects.<br />
              Track every task.<br />
              <span style={{ color: '#a5b4fc' }}>Stay in sync.</span>
            </h1>
            <p className="text-[#c7d2fe] text-base font-normal leading-[1.6] max-w-[480px]">
              Everything your team needs in one workspace.
            </p>
          </div>

          {/* ── Dashboard mockup with outer fade and inner float ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <motion.div
              animate={{ y: [-4, 0, -4] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="rounded-[22px] overflow-hidden border shadow-[0_20px_50px_rgba(0,0,0,.18)]"
              style={{ background: '#F6F8FB', borderColor: 'rgba(255,255,255,.08)' }}
            >
              {/* Mock top bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ background: 'white', borderColor: '#E5E7EB' }}>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-[#6366F1] flex items-center justify-center">
                    <LayoutDashboard size={12} className="text-white" />
                  </div>
                  <div className="h-2.5 w-20 bg-slate-200 rounded-full" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-16 bg-slate-100 rounded-full" />
                  <div className="h-6 w-6 rounded-full bg-[#6366F1]/10" />
                </div>
              </div>

              {/* Mock stats row */}
              <div className="px-4 pt-4 pb-3 grid grid-cols-3 gap-2.5">
                <MockStat label="Total Tasks" value="24" icon={BarChart2} color="#6366F1" delay={0.12} />
                <MockStat label="In Progress" value="8"  icon={Clock}    color="#3B82F6" delay={0.16} />
                <MockStat label="Completed"   value="14" icon={CheckCircle2} color="#10B981" delay={0.20} />
              </div>

              {/* Mock timeline strip */}
              <div className="px-4 pb-3">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.22 }}
                  className="bg-white rounded-[12px] border border-[#E5E7EB] p-3 shadow-[0_2px_6px_rgba(15,23,42,.04)]"
                >
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Calendar size={11} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Timeline</span>
                  </div>
                  <div className="flex gap-1.5">
                    {['Mon','Tue','Wed','Thu','Fri'].map((d, i) => (
                      <div
                        key={d}
                        className="flex-1 rounded-[8px] py-2 flex flex-col items-center text-[9px] font-semibold border"
                        style={{
                          background: i === 2 ? '#6366F1' : 'white',
                          color: i === 2 ? 'white' : '#64748B',
                          borderColor: i === 2 ? '#6366F1' : '#E5E7EB',
                        }}
                      >
                        <span>{d}</span>
                        <span className="mt-0.5 font-extrabold" style={{ fontSize: 11, color: i === 2 ? 'white' : '#1e293b' }}>
                          {22 + i}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Mock Kanban columns */}
              <div className="px-4 pb-4 grid grid-cols-3 gap-2.5">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Circle size={8} className="text-amber-400" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Pending</span>
                  </div>
                  <MockCard title="Design system tokens" tag="UI"      tagColor="#F59E0B" progress={30} delay={0.24} />
                  <MockCard title="API rate limiting"    tag="Backend" tagColor="#F59E0B" progress={15} delay={0.28} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock size={8} className="text-blue-400" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">In Progress</span>
                  </div>
                  <MockCard title="Auth flow polish"     tag="UX"      tagColor="#3B82F6" progress={72} delay={0.30} />
                  <MockCard title="Dashboard metrics"   tag="Data"    tagColor="#3B82F6" progress={55} delay={0.34} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle2 size={8} className="text-emerald-400" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Done</span>
                  </div>
                  <MockCard title="Setup CI/CD pipeline" tag="DevOps" tagColor="#10B981" progress={100} delay={0.36} />
                  <MockCard title="User onboarding flow" tag="UX"     tagColor="#10B981" progress={100} delay={0.40} />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Metrics row */}
          <div className="flex items-center gap-12 pt-2">
            {[
              { value: '10k+', label: 'Teams' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9★', label: 'Rating' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-start">
                <span className="text-white font-bold text-lg leading-none tracking-tight">{value}</span>
                <span className="text-slate-400 text-xs font-medium mt-1.5 uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL — Auth Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12 sm:px-8 min-h-screen" style={{ background: '#F6F8FB' }}>
        <div className="w-full" style={{ maxWidth: 500 }}>

          {/* Logo, Heading, Subtitle — mobile/tablet only */}
          <div className="flex lg:hidden flex-col items-center text-center mb-8 px-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-9 w-9 bg-[#6366F1] rounded-[10px] flex items-center justify-center shadow-[0_4px_12px_rgba(99,102,241,.3)]">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-slate-800 text-xl font-bold tracking-tight">TaskFlow</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Manage projects. Track every task.
            </h1>
            <p className="mt-2 text-slate-500 text-sm font-medium max-w-sm">
              Everything your team needs in one workspace.
            </p>
          </div>

          {/* Auth card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="-translate-y-5 lg:-translate-y-7 xl:-translate-y-7"
            style={{
              background: 'white',
              borderRadius: 24,
              border: '1px solid #E5E7EB',
              boxShadow: '0 18px 50px rgba(15,23,42,.08)',
              padding: '40px',
            }}
          >
            {/* Logo inside card — desktop only */}
            <div className="hidden lg:flex items-center gap-2 mb-8">
              <div className="h-9 w-9 bg-[#6366F1] rounded-[10px] flex items-center justify-center shadow-[0_4px_12px_rgba(99,102,241,.3)]">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-slate-800 text-xl font-bold tracking-tight">TaskFlow</span>
            </div>

            {/* Form content via Outlet */}
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
