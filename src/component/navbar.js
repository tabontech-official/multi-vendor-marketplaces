import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuthContext } from "../Hooks/useAuthContext";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const { user, dispatch } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const isAdmin = () => {
    const token = localStorage.getItem("usertoken");
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.payLoad.isAdmin && decoded.exp * 1000 > Date.now()) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    isAdmin();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const LogOut = async () => {
    try {
      const userid = localStorage.getItem("userid");
      if (userid) {
        await fetch(
          `https://multi-vendor-marketplace.vercel.app/auth/logout/${userid}`,
          {
            method: "POST",
          }
        );
        dispatch({ type: "LOGOUT" });
        localStorage.clear();
        navigate("/");
        setIsDropdownOpen(false);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className=" bg-gradient-to-r from-blue-600  to-[#18262f] flex items-center px-4 h-16 relative shadow-lg">
      <div className="flex-shrink-0">
        <Link to="/dashboard">
          <img
            src="https://www.aydiactive.com/cdn/shop/files/AYDI_ACTIVE_White-01_6d6bf132-6b36-49f6-86cb-d15be7d25245.png?v=1736855456&width=350"
            className="max-sm:h-12 shadow-md h-13"
            alt="Logo"
            style={{
              backgroundColor: 'black',
              padding: '5px',
              borderRadius: '8px', 
            }}
          />
          {/* <h1 className="text-white">AYDI Marketplace</h1> */}
        </Link>
      </div>
      <div className="flex-grow flex items-center justify-end">
        <button
          className="block md:hidden p-2 text-white transition-transform duration-300 transform hover:scale-110"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <div
          className={`fixed inset-0 bg-[#18262f] p-4 md:static md:flex md:flex-row md:space-x-8 md:bg-transparent md:items-center ${
            isOpen ? "block" : "hidden"
          } md:block z-10 transition-transform duration-500 ease-in-out`}
        >
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
                {isAdmin() && (
                  <li>
                    <Link
                      to="/admin"
                      className="text-white border border-transparent hover:border-blue-300 hover:bg-blue-700 transition duration-200 rounded-md px-4 py-2 shadow-md"
                      onClick={toggleMenu}
                    >
                      Admin Panel
                    </Link>
                  </li>
                )}

                <li className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="text-white border-transparent hover:bg-blue-800 transition-transform duration-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center shadow-md"
                  >
                    Settings 
                    <svg
                      className="w-2.5 h-2.5 ms-3 transition-transform duration-300 transform"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div
                      className="absolute mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-32 z-10 transform transition-transform duration-300 origin-top ease-out"
                      style={{
                        animation: isDropdownOpen
                          ? "slide-down 0.3s ease-out"
                          : "",
                      }}
                    >
                      <ul className="py-2 text-sm text-gray-700">
                        <li>
                          <Link
                            to="/edit-account"
                            className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                            onClick={toggleMenu}
                          >
                            My Profile
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={LogOut}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                          >
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
  );
};

export default Navbar;
