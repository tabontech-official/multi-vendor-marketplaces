
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../Hooks/useAuthContext'; // Adjust the import path as needed

const ProtectedRoute = ({ element, ...rest }) => {
  const { user } = useAuthContext();

  return user ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;