import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';

/**
 * Route protection wrapper that redirects to login if the user is not authenticated.
 * Otherwise, renders its child components.
 */
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    // Redirect to login if user is not authenticated
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
