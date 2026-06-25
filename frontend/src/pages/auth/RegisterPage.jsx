import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const RegisterPage = () => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Register Page Placeholder</h2>
      <p className="text-slate-500 mb-6 text-sm">No UI, forms, or API integration in Phase 5.</p>
      <Link
        to={ROUTES.LOGIN}
        className="text-brand-500 hover:text-brand-600 font-medium text-sm transition"
      >
        Go to Login
      </Link>
    </div>
  );
};

export default RegisterPage;
