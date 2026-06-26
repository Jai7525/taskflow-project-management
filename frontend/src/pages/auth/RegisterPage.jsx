import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import authService from '../../services/authService';
import { ROUTES } from '../../constants/routes';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { name, email, password } = data;
      const response = await authService.register({ name, email, password });
      
      if (response && response.success) {
        toast.success('Registration successful! Please login.');
        navigate(ROUTES.LOGIN);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      if (status === 400 && serverMessage?.toLowerCase().includes('already in use')) {
        toast.error('Email already exists');
      } else if (status === 409) {
        toast.error('Email already exists');
      } else if (status === 400) {
        toast.error(serverMessage || 'Validation failed');
      } else {
        toast.error('Server error. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Create Account
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Get started by creating your developer account.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#6366F1] transition-colors duration-200" />
            </div>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              disabled={isSubmitting}
              className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 ease-in-out text-sm font-medium hover:border-slate-300 ${
                errors.name
                  ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                  : 'border-slate-200 focus:ring-[#6366F1]/10 focus:border-[#6366F1]'
              }`}
              {...register('name', {
                required: 'Full name is required',
              })}
            />
          </div>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-1 font-semibold"
            >
              {errors.name.message}
            </motion.p>
          )}
        </div>

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
              placeholder="Minimum 8 characters"
              disabled={isSubmitting}
              className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 ease-in-out text-sm font-medium hover:border-slate-300 ${
                errors.password
                  ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                  : 'border-slate-200 focus:ring-[#6366F1]/10 focus:border-[#6366F1]'
              }`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
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

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#6366F1] transition-colors duration-200" />
            </div>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 ease-in-out text-sm font-medium hover:border-slate-300 ${
                errors.confirmPassword
                  ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                  : 'border-slate-200 focus:ring-[#6366F1]/10 focus:border-[#6366F1]'
              }`}
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: (value) =>
                  value === passwordVal || 'Confirm password must match password',
              })}
            />
          </div>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-1 font-semibold"
            >
              {errors.confirmPassword.message}
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
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Redirect */}
      <div className="text-center text-sm text-slate-500 font-medium pt-2">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-bold text-[#6366F1] hover:text-[#4F46E5] transition-colors">
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
