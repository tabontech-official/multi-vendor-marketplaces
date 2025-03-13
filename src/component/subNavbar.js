import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTh, FaTags, FaBullhorn } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
const SubNavbar = () => {
  // State for tracking dropdown visibility
  const [openDropdown, setOpenDropdown] = useState(null);
  const [role, setRole] = useState(null);

  // Function to handle dropdown hover
  const handleMouseEnter = (menu) => {
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };
  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) {
      console.log("No token found in localStorage");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);

      if (decoded.payLoad.role) {
        console.log("Setting role state:", decoded.payLoad.role);
        setRole(decoded.payLoad.role);
      } else {
        console.log("Role is missing in decoded token!");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);
  return (
    <div className="flex items-center bg-white border border-gray-300 px-4 py-2 shadow-sm relative">
      <ul className="flex space-x-6 text-sm text-gray-700">
        {/* Dashboard */}
        <li
          className="relative flex items-center space-x-1 cursor-pointer hover:text-gray-900"
          onMouseEnter={() => handleMouseEnter("Dashboard")}
          onMouseLeave={handleMouseLeave}
        >
          <MdDashboard className="text-green-600" />
          <Link to="/">Dasboard </Link>
        </li>

        {/* Products */}
        <li
          className="relative flex items-center space-x-1 cursor-pointer hover:text-gray-900"
          onMouseEnter={() => handleMouseEnter("products")}
          onMouseLeave={handleMouseLeave}
        >
          <FaTh className="text-green-600" />
          <Link to="#">Products </Link>
          {openDropdown === "products" && (
            <div className="absolute top-full left-0 bg-green-600 text-white py-2 px-4 w-48 shadow-lg">
              <Link
                to="/manageProducts"
                className="block hover:bg-green-700 px-2 py-1"
              >
                Manage Products
              </Link>
              <Link
                to="/addproducts"
                className="block hover:bg-green-700 px-2 py-1"
              >
                Add a Product
              </Link>
              {role && ["Master Admin", "Dev Admin"].includes(role) && (
                <li>
                  <Link
                    to="/inventory"
                    className="block hover:bg-green-700 px-2 py-1"
                  >
                    Inventory
                  </Link>
                </li>
              )}
            </div>
          )}
        </li>

        {role && ["Master Admin", "Dev Admin"].includes(role) && (
          <li
            className="relative flex items-center space-x-1 cursor-pointer hover:text-gray-900"
            onMouseEnter={() => handleMouseEnter("orders")}
            onMouseLeave={handleMouseLeave}
          >
            <FaTags className="text-blue-600" />
            <Link to="#">Orders</Link>
            {openDropdown === "orders" && (
              <div className="absolute top-full left-0 bg-blue-600 text-white py-2 px-4 w-48 shadow-lg">
                <li>
                  <Link
                    to="/Order_Details"
                    className="block hover:bg-blue-700 px-2 py-1"
                  >
                    Manage Orders
                  </Link>
                </li>
              </div>
            )}
          </li>
        )}

        <li
          className="relative flex items-center space-x-1 cursor-pointer hover:text-gray-900"
          onMouseEnter={() => handleMouseEnter("promotions")}
          onMouseLeave={handleMouseLeave}
        >
          <FaBullhorn className="text-yellow-500" />
          <Link to="#">Promotions </Link>
          {openDropdown === "promotions" && (
            <div className="absolute top-full left-0 bg-orange-500 text-white py-2 px-4 w-48 shadow-lg">
              <Link to="#" className="block hover:bg-orange-600 px-2 py-1">
                My Promotions
              </Link>
              <Link to="#" className="block hover:bg-orange-600 px-2 py-1">
                All Promotions
              </Link>
            </div>
          )}
        </li>

        {/* Reports */}
        <li
          className="relative flex items-center space-x-1 cursor-pointer hover:text-gray-900"
          onMouseEnter={() => handleMouseEnter("reports")}
          onMouseLeave={handleMouseLeave}
        >
          <BsGraphUp className="text-purple-500" />
          <Link to="#">Reports </Link>
          {openDropdown === "reports" && (
            <div className="absolute top-full left-0 bg-purple-500 text-white py-2 px-4 w-56 shadow-lg">
              <Link to="#" className="block hover:bg-purple-600 px-2 py-1">
                Catalog Performance
              </Link>
              <Link to="#" className="block hover:bg-purple-600 px-2 py-1">
                eCommerce Consultation
              </Link>
              <Link to="#" className="block hover:bg-purple-600 px-2 py-1">
                Seller Rating
              </Link>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default SubNavbar;
