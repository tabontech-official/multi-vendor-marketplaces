import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useAuthContext } from "../Hooks/useAuthContext";
import { jwtDecode } from "jwt-decode";
import { FaBell } from "react-icons/fa";
import { useNotification } from "../context api/NotificationContext";
import { BsMegaphoneFill } from "react-icons/bs";

const Navbar = () => {
  const {
    notifications,
    fetchNotifications,
    hasUnseenNotifications,
    markAllAsSeen,
  } = useNotification();
  const { user, dispatch } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const notificationRef = useRef(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) {
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.payLoad && decoded.payLoad.role) {
        setRole(decoded.payLoad.role);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
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
        await fetch(`http://localhost:5000/auth/logout/${userid}`, {
          method: "POST",
        });
        dispatch({ type: "LOGOUT" });
        localStorage.clear();
        navigate("/login");
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

  const isLoggedIn = Boolean(localStorage.getItem("usertoken"));
  const handleToggle = async () => {
    await fetchNotifications();
    setIsNotificationOpen(!isNotificationOpen);
    if (!isNotificationOpen) {
      await markAllAsSeen();
    }
  };

  return (
    <nav className=" bg-gradient-to-r from-blue-600  to-[#18262f] flex items-center px-4 h-[8vh] relative shadow-lg">
      <div className="flex-shrink-0">
        <Link to="/">
          <img
            src="https://www.aydiactive.com/cdn/shop/files/AYDI_ACTIVE_White-01_6d6bf132-6b36-49f6-86cb-d15be7d25245.png?v=1736855456&width=350"
            className="max-sm:h-12 shadow-md h-13"
            alt="Logo"
            style={{
              backgroundColor: "black",
              padding: "5px",
              borderRadius: "8px",
            }}
          />
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
          <ul className="flex flex-col md:flex-row md:space-x-8 space-y-4 items-center md:space-y-0">
            {isLoggedIn && (
              <li className="relative" ref={notificationRef}>
                <button
                  onClick={handleToggle}
                  ref={buttonRef}
                  className="relative text-white hover:bg-blue-800 p-2 rounded-full transition"
                >
                  <FaBell size={20} />
                  {hasUnseenNotifications && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-3 w-96 bg-white rounded-lg shadow-lg border z-30 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 text-gray-800 font-semibold">
                      <div className="flex items-center gap-2">
                        <BsMegaphoneFill className="text-blue-600" />
                        <span>Latest Updates</span>
                      </div>
                      <a
                        href="/notifications"
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Show all
                      </a>
                    </div>

                    <ul className="max-h-96 overflow-y-auto text-sm text-gray-700 divide-y">
                      {notifications
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )
                        .slice(0, 5)
                        .map((note) => {
                          return (
                            <li
                              key={note._id || note.id}
                              className="px-4 py-3 hover:bg-gray-50 transition"
                            >
                              <div className="flex gap-3 items-start">
                                <div className="pt-1">
                                  <FaUserCircle
                                    className="text-blue-500"
                                    size={20}
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500">
                                    {new Date(
                                      note.createdAt
                                    ).toLocaleDateString("en-GB")}{" "}
                                    •{" "}
                                    <span className="capitalize">
                                      {note.firstName || "User"}{" "}
                                      {note.lastName || ""}
                                    </span>
                                  </p>
                                  <p className="text-sm mt-0.5">
                                    {note.message || "No message."}
                                  </p>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                    </ul>

                    <div className="border-t px-4 py-3 text-center bg-gray-50">
                      <a
                        href="/notifications"
                        className="text-blue-600 text-sm font-medium hover:underline"
                      >
                        View full history →
                      </a>
                    </div>
                  </div>
                )}
              </li>
            )}
            {isLoggedIn && role === "Dev Admin" && (
              <li>
                <Link
                  to="/admin"
                  className="text-white border border-transparent hover:border-blue-300 hover:bg-blue-700 transition duration-200 rounded-md px-4 py-2 shadow-md"
                >
                  Dev Configuration
                </Link>
              </li>
            )}

            {isLoggedIn && (
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
                  <div className="absolute mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-32 z-10 transform transition-transform duration-300 origin-top ease-out">
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
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
