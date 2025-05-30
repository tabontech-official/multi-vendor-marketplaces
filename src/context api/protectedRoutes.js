import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../Hooks/useAuthContext";

const ProtectedRoute = ({ element, ...rest }) => {
  const { user } = useAuthContext();
  const location = useLocation();
  const { pathname } = location;

  console.log(pathname);
  useEffect(() => {
    if (!user) {
      localStorage.setItem("path", pathname);
    }
  }, [user, pathname]);

  return user ? element : <Navigate to={"/Login"} replace />;
};

export default ProtectedRoute;
