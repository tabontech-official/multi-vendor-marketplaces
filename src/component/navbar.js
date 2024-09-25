import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; 
import { useAuthContext } from '../Hooks/useAuthContext';

const Navbar = () => {
  const { user, dispatch } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);  // Reference for the dropdown container

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const LogOut = async () => {
    try {
      const userid = localStorage.getItem('userid');
      if (userid) {
        await fetch(`https://medspaa.vercel.app/auth/logout/${userid}`, {
          method: 'POST',
        });
        dispatch({ type: "LOGOUT" });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    // Function to close dropdown when clicking outside of it
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener to detect clicks outside the dropdown
    window.addEventListener('click', handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

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
          <button
            className="block md:hidden p-2 text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <div className={`fixed inset-0 bg-[#18262f] p-4 md:static md:flex md:flex-row md:space-x-8 md:bg-transparent md:items-center ${isOpen ? 'block' : 'hidden'} md:block z-10`}>
            <button
              className="absolute top-4 right-4 text-white md:hidden"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <FaTimes size={24} />
            </button>
            <ul className="flex flex-col md:flex-row md:space-x-8 space-y-4 items-center md:space-y-0">
              {user ? (
                <>
                  <li>
                    <Link to="/dashboard" className="text-white hover:text-gray-400" onClick={toggleMenu}>
                      My Listings
                    </Link>
                  </li>
                  <li>
                    <Link to="/Subcription_Details" className="text-white hover:text-gray-400" onClick={toggleMenu}>
                      My Subscriptions
                    </Link>
                  </li>
                  <li className="relative" ref={dropdownRef}>
                    <button
                      onClick={toggleDropdown}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                    >
                      My Account
                      <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                      </svg>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-40 z-10">
                        <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownHoverButton">
                          <li>
                            <Link to="/edit-account" className="block px-4 py-2 hover:bg-gray-100" onClick={toggleMenu}>
                              My Profile
                            </Link>
                          </li>
                          <li>
                            <button onClick={LogOut} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                              Logout
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                </>
              ) : null}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
