import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleMockLogin = () => {
    // Save dummy token in localstorage and context
    login('dummy_jwt_token_value', { id: 1, email: 'user@example.com', name: 'TaskFlow User' });
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Login Page Placeholder</h2>
      <p className="text-slate-500 mb-6 text-sm">No UI, forms, or API integration in Phase 5.</p>
      <button
        onClick={handleMockLogin}
        className="w-full py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition duration-200"
      >
        Mock Login (Sets Dummy JWT Token)
      </button>
    </div>
  );
};

export default LoginPage;
