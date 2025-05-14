// src/App.js

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Layout from "./component/layout";
import ResetPassword from "./pages/resetPassword";
import PrivateRoute from "./context api/protectedRoutes";
import AccountPage from "./pages/account";
import Auth from "./AuthForms";
import CategorySelector from "./pages/AddProduct";
import "./App.css";
import { useAuthContext } from "./Hooks/useAuthContext";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import SubscriptionHistory from "./Subcription/Subpage";
import ProtectedForms from "./context api/FormProtect";
import PrivacyPolicy from "./pages/Policy";
import AdminDashboard from "./admin/adminpanel";
import AuthSignUp from "./AuthSignUp";
import MainDashboard from "./pages/MainDashboard";
import Inventory from "./pages/Inventory";
import ManageUser from "./pages/ManageUser";
import NewPassword from "./pages/NewPassword";
import Promotion from "./pages/Promotion";
import CatalogPerformance from "./pages/CatalogPerformance";
import EcommerceConsultation from "./pages/Consultation";
import Variants from "./pages/Variants";
import OnBoard from "./pages/OnBoardUser";
import ApiCredentials from "./pages/ApiCredentials";
import { NotificationProvider } from "./context api/NotificationContext";
import Notification from "./pages/Notification";

const App = () => {
  const [role, setRole] = useState("");
  const { dispatch } = useAuthContext();
  const [loading, setLoading] = useState(true);

  function isTokenExpired(token) {
    if (!token) return true;
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  }
  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded?.payLoad?.role) {
        setRole(decoded.payLoad.role);
      } else {
        setRole("");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    function checkTokenAndRemove() {
      const token = localStorage.getItem("usertoken");
      if (isTokenExpired(token)) {
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem("usertoken");
        return <Navigate to="/Login" replace />;
      }
    }
    checkTokenAndRemove();
  }, []);
  const isAdmin = () => {
    return role === "Dev Admin";
  };
  const { user } = useAuthContext();
  return (
    <NotificationProvider>

    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PrivateRoute element={<MainDashboard />} />} />
          <Route
            path="/manage-product"
            element={<PrivateRoute element={<Dashboard />} />}
          />
          <Route
            path="/inventory"
            element={<PrivateRoute element={<Inventory />} />}
          />
          <Route
            path="/api-credentials"
            element={<PrivateRoute element={<ApiCredentials />} />}
          />
          <Route
            path="/Login"
            element={!user ? <Auth /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/signup"
            element={!user ? <AuthSignUp /> : <Navigate to="/dashboard" />}
          />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/Reset" element={<ResetPassword />} />
          <Route path="/New" element={<NewPassword />} />

          <Route path="/Policy" element={<PrivacyPolicy />} />
          <Route
            path="/admin"
            element={
              loading ? (
                <p>Loading...</p>
              ) : isAdmin() ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/promotions"
            element={<ProtectedForms element={<Promotion />} />}
          />
           <Route
            path="/notifications"
            element={<ProtectedForms element={<Notification />} />}
          />
          <Route
            path="/on-board-users"
            element={<ProtectedForms element={<OnBoard />} />}
          />
          <Route
            // path="/variants"
            path="/product/:productId/variants/:variantId"
            element={<ProtectedForms element={<Variants />} />}
          />
          <Route
            path="/Order_Details"
            element={<ProtectedForms element={<SubscriptionHistory />} />}
          />
          <Route
            path="/catalog-performance"
            element={<ProtectedForms element={<CatalogPerformance />} />}
          />
          <Route
            path="/consultation"
            element={<ProtectedForms element={<EcommerceConsultation />} />}
          />
          <Route
            path="/add-product"
            element={<PrivateRoute element={<CategorySelector />} />}
          />

          <Route
            path="/edit-account"
            element={<PrivateRoute element={<AccountPage />} />}
          />
          <Route
            path="/manage-user"
            element={<PrivateRoute element={<ManageUser />} />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
    </NotificationProvider>

  );
};

export default App;
