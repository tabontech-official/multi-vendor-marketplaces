// src/components/Layout.js

import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import hamburger and close icons
import { useAuthContext } from '../Hooks/useAuthContext';

const Layout = () => {
  const { user , dispatch} = useAuthContext(); // Get user from context
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  const LogOut =async()=>{
    try {
      const userid = localStorage.getItem('userid');

      if (userid) {
        const response = await fetch(`https://medspaa.vercel.app/auth/logout/${userid}`, {
          method: 'POST', // Assuming you need POST for logout
        });
        const json = await response.json();
        if (response.ok) {
          localStorage.removeItem('usertoken');
          localStorage.removeItem('userid');
          dispatch({ type: "LOGOUT" });
        } else {
          console.error('Logout failed:', json);
        }
      }
    } catch (error) {
      console.error('Error during logout:', error.error);
    }
  }

  return (
    <>
      <nav className="bg-[#18262f] h-[85px] flex items-center px-4 relative">
        <div className="flex-shrink-0">
          <Link to="/">
            <img
              src="https://shopify-digital-delivery.s3.amazonaws.com/shop_logo/59235/vRlqYxKteX848.png"
              className="h-9 logo"
              alt="Logo"
            />
          </Link>
        </div>
        <div className="flex-grow flex items-center justify-end">
          {/* Hamburger Menu Icon */}
          <button
            className="block md:hidden p-2 text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          {/* Navigation Links */}
          <div
            className={`fixed inset-0 bg-[#18262f] p-4 md:static md:flex md:flex-row md:space-x-8 md:bg-transparent md:items-center ${isOpen ? 'block' : 'hidden'} md:block z-10`}
          >
            <button
              className="absolute top-4 right-4 text-white md:hidden"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <FaTimes size={24} />
            </button>
            <ul className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
              {user ? (
                // Links for authenticated users
                <>
                  <li>
                    <Link to="/edit-account" className="text-white hover:text-gray-400" onClick={toggleMenu}>
                      Account
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="text-white hover:text-gray-400" onClick={toggleMenu}>
                      Dashboard
                    </Link>
                  </li>
                  <li onClick={LogOut}>
                    <Link to="/" className="text-white hover:text-gray-400" onClick={toggleMenu}>
                      LogOut
                    </Link>
                  </li>
                </>
              ) : null }
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto flex flex-col items-center justify-center">
          <p className="text-center text-sm">
            © Copyright 2020-2024 <span className="font-semibold">med-spa-trader</span>, All rights reserved.
          </p>
          <div className="mt-2 text-center text-xs">
            <a href="#privacy-policy" className="text-gray-400 hover:text-gray-300 transition duration-300">Privacy Policy</a> | 
            <a href="#terms-of-service" className="text-gray-400 hover:text-gray-300 transition duration-300"> Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
