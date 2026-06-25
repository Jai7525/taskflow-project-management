import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import { ROUTES } from '../../constants/routes';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
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
        // Save to token storage and AuthContext
        login(response.data.token, response.data.user);
        toast.success(response.message || 'Login successful');
        navigate(ROUTES.DASHBOARD);
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

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to your account to manage your projects
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition duration-150 text-sm ${
                errors.password
                  ? 'border-danger-500 focus:ring-danger-500/20'
                  : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
              }`}
              {...register('password', {
                required: 'Password is required',
              })}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-danger-500 mt-1 font-medium">{errors.password.message}</p>
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
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Demo Section */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Demo Credentials
        </h4>
        <div className="space-y-1 text-xs text-slate-600">
          <p>
            Email: <span className="font-semibold text-slate-900">admin@taskflow.com</span>
          </p>
          <p>
            Password: <span className="font-semibold text-slate-900">Password123</span>
          </p>
        </div>
      </div>

      {/* Redirect */}
      <div className="text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="font-semibold text-brand-500 hover:text-brand-600 transition">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
