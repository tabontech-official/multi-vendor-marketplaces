import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../Hooks/useAuthContext';

const ProtectedRoute = ({ element, ...rest }) => {
  const { user } = useAuthContext();
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    // Set the path in local storage only if the user is not logged in
    if (!user) {
      localStorage.setItem('path', pathname);
    }
  }, [user, pathname]);

  return user ? (
    element
  ) : (
    <Navigate to={'/dashboard'} replace />
  );
};

export default ProtectedRoute;
