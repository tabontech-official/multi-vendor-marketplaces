// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import Layout from './component/layout';
import LoginForm from './pages/Login';
import SignupForm from './pages/SignUp';
import AddProductForm from './pages/add-product';
import PrivateRoute from './context api/protectedRoutes';
import { useAuthContext } from './Hooks/useAuthContext';
import AccountPage from './pages/account';

const App = () => {
  const { user } = useAuthContext();

  return (
    <Router>
      <Routes>
        <Route path="/"   element={<Layout />} >
        <Route path="/login"  element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/add-listing" element={<PrivateRoute element={<AddProductForm />} />} />
        <Route path="/edit-account" element={<PrivateRoute element={<AccountPage />} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/edit-profile" element={<PrivateRoute element={<EditProfile />} />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
