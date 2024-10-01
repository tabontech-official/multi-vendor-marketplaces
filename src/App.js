// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import Layout from './component/layout';
import Used_EquipmentForm from './pages/Used_Equipment_Listing';
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
import { useAuthContext } from './Hooks/useAuthContext';
import { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import SubscriptionHistory from './Subcription/Subpage';
import PrivacyPolicy from './pages/Policy';
const App = () => {

  const {dispatch} = useAuthContext()

  function isTokenExpired(token) { 
    if (!token) return true; 
    const decoded = jwtDecode(token); 
    console.log(decoded.exp* 1000 < Date.now() )
    return  decoded.exp * 1000 < Date.now();
} 

  useEffect(()=>{
    function checkTokenAndRemove() { 
      const token = localStorage.getItem('usertoken'); 
      if (isTokenExpired(token)) { 
        dispatch({type:"LOGOUT"})

      }
  } 
  checkTokenAndRemove()
   
  },[])

  const { user } = useAuthContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <Layout />} >
        <Route index element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/Login" element={!user ? <Auth /> : <Dashboard />} />
        <Route path="/Rent_Room_listing" element={<PrivateRoute element={<AddRoomForRentForm/>} />} />
          <Route path="/Job_Provider_listing" element={<PrivateRoute element={<AddProviderSearchForm/>} />} />
          <Route path="/Policy" element={<PrivateRoute element={<PrivacyPolicy/>} />} />
          <Route path="/Job_Search_listing" element={<PrivateRoute element={<AddJobSearchForm/>} />} />
          <Route path="/Subcription_Details" element={<PrivateRoute element={<SubscriptionHistory />} />} />
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
