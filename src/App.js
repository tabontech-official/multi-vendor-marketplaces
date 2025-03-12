// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import ForgotPassword from "./pages/ForgotPassword"
import Dashboard from './pages/Dashboard';

import Layout from './component/layout';
import ResetPassword from './pages/resetPassword';
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
import ProtectedForms from './context api/FormProtect';
import PrivacyPolicy from './pages/Policy';
import PeopleLooking from './pages/PeopleLooking';
import AdminDashboard from "./admin/adminpanel"
import AuthSignUp from './AuthSignUp';
import MainDashboard from './pages/MainDashboard';
const App = () => {
  const {dispatch} = useAuthContext()

  function isTokenExpired(token) { 
    if (!token) return true; 
    const decoded = jwtDecode(token); 
    return  decoded.exp * 1000 < Date.now();
} 

const isAdmin = ()=>{
  const token = localStorage.getItem('usertoken'); 
  if (!isTokenExpired(token)) { 
     const decode = jwtDecode(token);
    if(decode.payLoad.isAdmin ){
      return true;
    }
    return false;
  }
}

  useEffect(()=>{
    function checkTokenAndRemove() { 
      const token = localStorage.getItem('usertoken'); 
      if (isTokenExpired(token)) { 
        dispatch({type:"LOGOUT"})
        localStorage.removeItem('usertoken'); 
        return <Navigate to="/Login" replace />
      }
  } 
  checkTokenAndRemove()
   
  },[])

  const { user } = useAuthContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <Layout />} >
        <Route index element={<PrivateRoute element={<MainDashboard />} />} />
        <Route path='/dashboard' element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/Login" element={!user ? <Auth /> : <Navigate to="/dashboard" /> } />
        <Route path="/signup" element={!user ? <AuthSignUp /> : <Navigate to="/dashboard" /> } />
        <Route path="/ForgotPassword" element={<ForgotPassword/>} />
        <Route path="/Reset" element={<ResetPassword/>} />
        <Route path="/Rent_Room_listing" element={<ProtectedForms element={<AddRoomForRentForm/>} />} />
          <Route path="/Job_Provider_listing" element={<ProtectedForms element={<AddProviderSearchForm/>} />} />
          <Route path="/Policy" element={ <PrivacyPolicy/>} />
          <Route path="/admin" element={ isAdmin() ? <AdminDashboard/>  : <Navigate to="/" /> } />
          <Route path="/Job_Search_listing" element={<ProtectedForms element={<AddJobSearchForm/>} />} />
          <Route path="/Subcription_Details" element={<PrivateRoute element={<SubscriptionHistory />} />} />
          <Route path="/Business_Equipment_listing" element={<ProtectedForms element={<AddBusinessForm/>} />} />
          <Route path="/New_Equipment_listing" element={<ProtectedForms element={<AddNewEquipmentForm/>} />} />
          <Route path="/Categories" element={<PrivateRoute element={<CategorySelector />} />} />
          <Route path="/Used_Equipment_Listing" element={<ProtectedForms element={<Used_EquipmentForm />} />} />
          <Route path="/I_AM_LOOKING_FOR" element={<ProtectedForms element={<PeopleLooking />} />} />
          <Route path="/edit-account" element={<PrivateRoute element={<AccountPage />} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
};




export default App;
