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
        await fetch(
          `http://localhost:5000/auth/logout/${userid}`,
          {
            method: "POST",
          },
        );
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
    const willOpen = !isNotificationOpen;

    setIsNotificationOpen(willOpen);

    if (willOpen) {
      await fetchNotifications();
      await markAllAsSeen();
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, []);
  const canViewProfile = role !== "Dev Admin" && role !== "Master Admin";
  return (
    // Reduced height to 6vh and added a "blackish" gradient
    <nav className="bg-gradient-to-r from-[#09090b] via-[#27272a] to-[#27272a] flex items-center px-6 h-[6vh] relative shadow-xl border-b border-gray-800">
      {/* LOGO SECTION */}
      <div className="flex-shrink-0">
        <Link to="/">
          <img
            src="https://www.aydiactive.com/cdn/shop/files/AYDI_ACTIVE_White-01_6d6bf132-6b36-49f6-86cb-d15be7d25245.png?v=1736855456&width=350"
            // Adjusted logo height for the smaller navbar
            className="h-8 max-sm:h-7 transition-transform hover:scale-105"
            alt="Logo"
            style={{
              backgroundColor: "black",
              padding: "4px",
              borderRadius: "6px",
            }}
          />
        </Link>
      </div>

      <div className="flex-grow flex items-center justify-end">
        {/* Mobile Menu Button */}
        <button
          className="block md:hidden p-2 text-gray-300 hover:text-white transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Navigation Links / Mobile Menu */}
        <div
          className={`fixed inset-0 bg-[#09090b] md:static md:flex md:flex-row md:space-x-6 md:bg-transparent md:items-center ${
            isOpen ? "block" : "hidden"
          } md:block z-50`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-6 space-y-4 items-center md:space-y-0 mt-20 md:mt-0">
            {/* NOTIFICATIONS */}
            {isLoggedIn && (
              <li className="relative" ref={notificationRef}>
                <button
                  onClick={handleToggle}
                  ref={buttonRef}
                  className="relative text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition"
                >
                  <FaBell size={18} />
                  {hasUnseenNotifications && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black"></span>
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
                      {[...notifications] // clone first (IMPORTANT)
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt),
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
                                      note.createdAt,
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

            {/* ADMIN LINK */}
            {isLoggedIn && role === "Dev Admin" && (
              <li>
                <Link
                  to="/admin"
                  className="text-xs font-semibold text-gray-200 border border-gray-700 hover:bg-white hover:text-black transition-all duration-300 rounded-md px-3 py-1.5"
                >
                  Dev Admin
                </Link>
              </li>
            )}

            {/* SETTINGS DROPDOWN */}
            {isLoggedIn && (
              <li className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="text-gray-200 bg-white/5 hover:bg-white/10 border border-gray-700 transition-all font-medium rounded-md text-xs px-4 py-1.5 inline-flex items-center"
                >
                  Settings
                  <svg className="w-2 h-2 ms-2" fill="none" viewBox="0 0 10 6">
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
                  <div className="absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-md shadow-xl w-24 z-[60] border border-gray-200">
                    <ul className="py-1 text-xs text-gray-700">
                      <li>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 hover:bg-[#F3F4F6]"
                          onClick={() => setIsOpen(false)}
                        >
                          Settings
                        </Link>
                      </li>
                      {canViewProfile && (
                        <li>
                          <Link
                            to="/edit-account"
                            className="block px-4 py-2 hover:bg-[#F3F4F6]"
                          >
                            My Profile
                          </Link>
                        </li>
                      )}

                      <li>
                        <button
                          onClick={LogOut}
                          className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-medium"
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
