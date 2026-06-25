import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Protection
import ProtectedRoute from './ProtectedRoute';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import AddTaskPage from '../pages/tasks/AddTaskPage';
import TaskDetailsPage from '../pages/tasks/TaskDetailsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      {/* Protected Dashboard/Task Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.ADD_TASK} element={<AddTaskPage />} />
        <Route path={ROUTES.TASK_DETAILS} element={<TaskDetailsPage />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
};

export default AppRoutes;
