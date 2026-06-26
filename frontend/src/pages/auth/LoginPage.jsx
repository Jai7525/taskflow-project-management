import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Loader2, KeyRound, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import { ROUTES } from '../../constants/routes';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await authService.login(data);
      if (response && response.success) {
        login(response.data.token, response.data.user);
        toast.success(response.message || 'Welcome back!');
        navigate(ROUTES.WORKSPACE);
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      if (status === 401) {
        toast.error('Invalid credentials');
      } else if (status === 400) {
        toast.error(serverMessage || 'Validation failed');
      } else {
        toast.error('Server error. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedPass(true);
        setTimeout(() => setCopiedPass(false), 2000);
      }
      toast.success('Copied to clipboard');
      // Auto fill the field
      setValue(type, text, { shouldValidate: true });
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Sign in to your workspace to manage your projects.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#6366F1] transition-colors duration-200" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              disabled={isSubmitting}
              className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 ease-in-out text-sm font-medium hover:border-slate-300 ${
                errors.email
                  ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                  : 'border-slate-200 focus:ring-[#6366F1]/10 focus:border-[#6366F1]'
              }`}
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address format',
                },
              })}
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-1 font-semibold"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#6366F1] transition-colors duration-200" />
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 ease-in-out text-sm font-medium hover:border-slate-300 ${
                errors.password
                  ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                  : 'border-slate-200 focus:ring-[#6366F1]/10 focus:border-[#6366F1]'
              }`}
              {...register('password', {
                required: 'Password is required',
              })}
            />
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-1 font-semibold"
            >
              {errors.password.message}
            </motion.p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-2.5 px-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl font-bold text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-[#6366F1]/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(99,102,241,.12)] hover:shadow-[0_6px_16px_rgba(99,102,241,.2)] hover:-translate-y-[1px] active:translate-y-0 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Demo Section */}
      <div className="bg-[#F8FAFC]/60 border border-slate-100 rounded-2xl p-4 text-left flex items-center justify-between shadow-[0_1px_4px_rgba(15,23,42,.01)]">
        <div className="flex items-center gap-3.5">
          <div className="h-8 w-8 rounded-lg bg-[#6366F1]/10 flex items-center justify-center shrink-0">
            <KeyRound size={14} className="text-[#6366F1]" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
              Demo Credentials
            </h4>
            <div className="space-y-0.5 text-xs text-slate-500 font-medium">
              <p>
                Email: <span className="font-bold text-slate-800">admin@taskflow.com</span>
              </p>
              <p>
                Password: <span className="font-bold text-slate-800">Password123</span>
              </p>
            </div>
          </div>
        </div>

        {/* Copy buttons */}
        <div className="flex flex-col gap-1.5 pl-3 border-l border-slate-100">
          <button
            type="button"
            onClick={() => copyToClipboard('admin@taskflow.com', 'email')}
            className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-white hover:bg-slate-50 text-slate-600 rounded-md border border-slate-100 transition-colors shadow-sm cursor-pointer"
          >
            {copiedEmail ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
            <span>Email</span>
          </button>
          <button
            type="button"
            onClick={() => copyToClipboard('Password123', 'password')}
            className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-white hover:bg-slate-50 text-slate-600 rounded-md border border-slate-100 transition-colors shadow-sm cursor-pointer"
          >
            {copiedPass ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
            <span>Pass</span>
          </button>
        </div>
      </div>

      {/* Redirect */}
      <div className="text-center text-sm text-slate-500 font-medium pt-2">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="font-bold text-[#6366F1] hover:text-[#4F46E5] transition-colors">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
