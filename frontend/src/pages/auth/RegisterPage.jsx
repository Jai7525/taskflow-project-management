import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
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
      // Remove confirmPassword before sending request
      const { name, email, password } = data;
      const response = await authService.register({ name, email, password });
      
      if (response && response.success) {
        toast.success('Registration successful');
        navigate(ROUTES.LOGIN);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      // Handle duplicate email check (often 400 or 409)
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
        <h2 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
          Create Account
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Get started by creating your developer account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User className="h-4.5 w-4.5 text-slate-400" />
            </div>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              disabled={isSubmitting}
              className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition duration-150 text-sm ${
                errors.name
                  ? 'border-danger-500 focus:ring-danger-500/20'
                  : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
              }`}
              {...register('name', {
                required: 'Full name is required',
              })}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-danger-500 mt-1 font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-4.5 w-4.5 text-slate-400" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              disabled={isSubmitting}
              className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition duration-150 text-sm ${
                errors.email
                  ? 'border-danger-500 focus:ring-danger-500/20'
                  : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
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
            <p className="text-xs text-danger-500 mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4.5 w-4.5 text-slate-400" />
            </div>
            <input
              id="password"
              type="password"
              placeholder="Minimum 8 characters"
              disabled={isSubmitting}
              className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition duration-150 text-sm ${
                errors.password
                  ? 'border-danger-500 focus:ring-danger-500/20'
                  : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
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
            <p className="text-xs text-danger-500 mt-1 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4.5 w-4.5 text-slate-400" />
            </div>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition duration-150 text-sm ${
                errors.confirmPassword
                  ? 'border-danger-500 focus:ring-danger-500/20'
                  : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
              }`}
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: (value) =>
                  value === passwordVal || 'Confirm password must match password',
              })}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-danger-500 mt-1 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft-md shadow-brand-500/10 cursor-pointer"
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
      <div className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold text-brand-500 hover:text-brand-600 transition">
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
