// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import Layout from './component/layout';
import Used_EquipmentForm from './pages/Use_Equipment_listing';
import PrivateRoute from './context api/protectedRoutes';
import AccountPage from './pages/account';
import Auth from './AuthForms';
import CategorySelector from './pages/Categories';
import "./App.css";
import AddNewEquipmentForm from './pages/New_Equipment_listing';
import AddBusinessForm from './pages/SPA_Listing';
import AddJobSearchForm from './pages/Job_Search';
import AddProviderSearchForm from './pages/Job_provider';
import AddRoomForRentForm from './pages/Rent_Room';

const App = () => {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Auth />} />
          <Route path="/Rent_Room_listing" element={<PrivateRoute element={<AddRoomForRentForm/>} />} />
          <Route path="/Job_Provider_listing" element={<PrivateRoute element={<AddProviderSearchForm/>} />} />
          <Route path="/Job_Search_listing" element={<PrivateRoute element={<AddJobSearchForm/>} />} />
          <Route path="/Business_Equipment_listing" element={<PrivateRoute element={<AddBusinessForm/>} />} />
          <Route path="/New_Equipment_listing" element={<PrivateRoute element={<AddNewEquipmentForm/>} />} />
          <Route path="/Categories" element={<PrivateRoute element={<CategorySelector />} />} />
          <Route path="/Used_Equipment_Listing" element={<PrivateRoute element={<Used_EquipmentForm />} />} />
          <Route path="/edit-account" element={<PrivateRoute element={<AccountPage />} />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/edit-profile" element={<PrivateRoute element={<EditProfile />} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
};




export default App;
