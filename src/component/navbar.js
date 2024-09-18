import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; 
import { useAuthContext } from '../Hooks/useAuthContext';

const Navbar = ()=>{

    const {user , dispatch} = useAuthContext()
    const [isOpen, setIsOpen] = useState(false);
     const navigate = useNavigate()
    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };
  
    const LogOut = ()=>{
        try {
          const userid = localStorage.getItem('userid');
    
          if (userid) {
            const response =  fetch(`https://medspaa.vercel.app/auth/logout/${userid}`, {
              method: 'POST',
            });

            
        dispatch({ type: "LOGOUT" })
          
              

          }
        } catch (error) {
          console.error('Error during logout:', error.error);
        }
      }
    return user ? (
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
                     My Account
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="text-white hover:text-gray-400" onClick={toggleMenu}>
                      Dashboard
                    </Link>
                  </li>
                  <li onClick={LogOut}>
                    <Link to="/Login" className="text-white hover:text-gray-400" onClick={toggleMenu}>
                      LogOut
                    </Link>
                  </li>
                </>
              ) : null }
            </ul>
          </div>
        </div>
      </nav>
    </>
    ): <nav className="bg-[#18262f] h-[85px] flex items-center px-4 relative">
        <div className="flex-shrink-0">
          <Link to="/">
            <img
              src="https://shopify-digital-delivery.s3.amazonaws.com/shop_logo/59235/vRlqYxKteX848.png"
              className="h-9 logo"
              alt="Logo"
            />
            </Link>
            </div>
          
    </nav>

}

export default Navbar