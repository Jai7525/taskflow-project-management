import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';

/**
 * Route protection wrapper that redirects to login if the user is not authenticated.
 * Renders either children (when passed) or <Outlet /> for nested route layouts.
 */
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If children are provided (e.g. wrapping a layout), render them directly.
  // The layout itself will render <Outlet /> for nested child routes.
  return children ?? <Outlet />;
};

export default ProtectedRoute;
