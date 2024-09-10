// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../Hooks/useAuthContext';

const ProtectedRoute = ({ element, ...rest }) => {
  const { user } = useAuthContext();
  const location = useLocation();
  const { pathname } = location;

  return user ? (
    element
  ) : (
    <Navigate to={`/login?redirect=${pathname}`} replace />
  );
};

export default ProtectedRoute;
