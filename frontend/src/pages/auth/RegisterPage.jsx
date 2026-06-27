import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Loader2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import authService from '../../services/authService';
import { ROUTES } from '../../constants/routes';

/**
 * RegisterPage
 *
 * Production-quality registration form with:
 * - onBlur-first validation (no premature error flashes)
 * - Differentiated error messages per rule
 * - Inline server-error banner (preserves all form values)
 * - Auto-focus first invalid field on submit attempt
 * - Full ARIA compliance (aria-invalid, aria-describedby, role="alert")
 * - Duplicate email handling
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Inline banner for backend errors (e.g. duplicate email)
  const [apiError, setApiError] = useState('');

  // Field refs for programmatic focus (auto-focus first invalid field)
  const nameRef      = useRef(null);
  const emailRef     = useRef(null);
  const passwordRef  = useRef(null);
  const confirmRef   = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    formState: { errors },
  } = useForm({
    // onBlur: validate when the user leaves a field (not while typing)
    // onChange after first submit: clear error as soon as value becomes valid
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordVal = watch('password');

  const onError = (errors) => {
    const firstError = ['name', 'email', 'password', 'confirmPassword'].find(
      (f) => errors[f]
    );
    if (firstError) {
      setFocus(firstError);
    }
  };

  // ── react-hook-form split-ref helpers (for programmatic .focus()) ────────
  const {
    ref: rhfNameRef,
    ...nameProps
  } = register('name', {
    required: 'Full name is required.',
  });

  const {
    ref: rhfEmailRef,
    ...emailProps
  } = register('email', {
    required: 'Email address is required.',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Please enter a valid email address.',
    },
  });

  const {
    ref: rhfPasswordRef,
    ...passwordProps
  } = register('password', {
    required: 'Password is required.',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters.',
    },
    validate: (value) => {
      if (!/[A-Z]/.test(value))
        return 'Password must contain at least one uppercase letter.';
      if (!/[a-z]/.test(value))
        return 'Password must contain at least one lowercase letter.';
      if (!/[0-9]/.test(value))
        return 'Password must contain at least one number.';
      if (!/[^A-Za-z0-9]/.test(value))
        return 'Password must contain at least one special character.';
      return true;
    },
  });

  const {
    ref: rhfConfirmRef,
    ...confirmProps
  } = register('confirmPassword', {
    validate: (value) => {
      // Intentionally no `required` rule — differentiate empty vs. mismatch
      if (!value) return 'Confirm password is required.';
      if (value !== passwordVal) return 'Passwords do not match.';
      return true;
    },
  });

  // ── Submit handler ───────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setApiError('');
    setIsSubmitting(true);

    try {
      const { name, email, password } = data;
      const response = await authService.register({ name, email, password });

      if (response && response.success) {
        toast.success('Account created! Please sign in.', { duration: 4000 });
        navigate(ROUTES.LOGIN);
      } else {
        setApiError('Registration failed. Please try again.');
      }
    } catch (error) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message || '';

      if (
        status === 409 ||
        (status === 400 && serverMessage.toLowerCase().includes('already'))
      ) {
        // Duplicate email — inline banner so form values are preserved
        setApiError('An account with this email already exists. Try logging in.');
      } else if (status === 400) {
        setApiError(serverMessage || 'Validation failed. Please check your inputs.');
      } else {
        toast.error('Something went wrong. Please try again.', { duration: 4000 });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Shared input style builder ───────────────────────────────────────────
  const inputClass = (fieldName) =>
    `block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border rounded-xl text-slate-900 ` +
    `placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 ` +
    `transition-all duration-200 ease-in-out text-sm font-medium hover:border-slate-300 ` +
    (errors[fieldName]
      ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
      : 'border-slate-200 focus:ring-[#6366F1]/10 focus:border-[#6366F1]');

  // ── Error message renderer ───────────────────────────────────────────────
  const ErrorMsg = ({ id, message }) =>
    message ? (
      <motion.p
        id={id}
        role="alert"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.15 }}
        className="text-xs text-red-500 mt-1 font-semibold"
      >
        {message}
      </motion.p>
    ) : null;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Create Account
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Get started by creating your TaskFlow workspace.
        </p>
      </div>

      {/* ── Inline server-error banner ── */}
      <AnimatePresence>
        {apiError && (
          <motion.div
            key="api-error"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="alert"
            className="flex items-center justify-between gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-sm font-semibold text-red-700">{apiError}</p>
            </div>
            <button
              type="button"
              onClick={() => setApiError('')}
              aria-label="Dismiss error"
              className="p-0.5 text-red-400 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4" noValidate>

        {/* ── Full Name ── */}
        <div className="space-y-1.5">
          <label
            htmlFor="reg-name"
            className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider"
          >
            Full Name
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#6366F1] transition-colors duration-200" />
            </div>
            <input
              id="reg-name"
              type="text"
              placeholder="John Doe"
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'reg-name-error' : undefined}
              className={inputClass('name')}
              ref={(el) => { rhfNameRef(el); nameRef.current = el; }}
              {...nameProps}
            />
          </div>
          <AnimatePresence mode="wait">
            {errors.name && (
              <ErrorMsg id="reg-name-error" message={errors.name.message} />
            )}
          </AnimatePresence>
        </div>

        {/* ── Email Address ── */}
        <div className="space-y-1.5">
          <label
            htmlFor="reg-email"
            className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider"
          >
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#6366F1] transition-colors duration-200" />
            </div>
            <input
              id="reg-email"
              type="email"
              placeholder="name@company.com"
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'reg-email-error' : undefined}
              className={inputClass('email')}
              ref={(el) => { rhfEmailRef(el); emailRef.current = el; }}
              {...emailProps}
            />
          </div>
          <AnimatePresence mode="wait">
            {errors.email && (
              <ErrorMsg id="reg-email-error" message={errors.email.message} />
            )}
          </AnimatePresence>
        </div>

        {/* ── Password ── */}
        <div className="space-y-1.5">
          <label
            htmlFor="reg-password"
            className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider"
          >
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#6366F1] transition-colors duration-200" />
            </div>
            <input
              id="reg-password"
              type="password"
              placeholder="Min. 8 chars, uppercase, number, symbol"
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'reg-password-error' : undefined}
              className={inputClass('password')}
              ref={(el) => { rhfPasswordRef(el); passwordRef.current = el; }}
              {...passwordProps}
            />
          </div>
          <AnimatePresence mode="wait">
            {errors.password && (
              <ErrorMsg id="reg-password-error" message={errors.password.message} />
            )}
          </AnimatePresence>
        </div>

        {/* ── Confirm Password ── */}
        <div className="space-y-1.5">
          <label
            htmlFor="reg-confirm"
            className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider"
          >
            Confirm Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#6366F1] transition-colors duration-200" />
            </div>
            <input
              id="reg-confirm"
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'reg-confirm-error' : undefined}
              className={inputClass('confirmPassword')}
              ref={(el) => { rhfConfirmRef(el); confirmRef.current = el; }}
              {...confirmProps}
            />
          </div>
          <AnimatePresence mode="wait">
            {errors.confirmPassword && (
              <ErrorMsg id="reg-confirm-error" message={errors.confirmPassword.message} />
            )}
          </AnimatePresence>
        </div>

        {/* ── Submit Button ── */}
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

      {/* Redirect to login */}
      <div className="text-center text-sm text-slate-500 font-medium pt-2">
        Already have an account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-bold text-[#6366F1] hover:text-[#4F46E5] transition-colors"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
