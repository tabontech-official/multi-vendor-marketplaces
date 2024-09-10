// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import Layout from './component/layout';
import AddProductForm from './pages/add-product';
import PrivateRoute from './context api/protectedRoutes';
import { useAuthContext } from './Hooks/useAuthContext';
import AccountPage from './pages/account';
import Home from './AuthForms';
import Auth from './AuthForms';


const App = () => {
  const { user } = useAuthContext();

  return (
    <Router>
      <Routes>
        <Route path="/"  element={<Layout />} >
        <Route index  user  element={<Auth />} />
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
