import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTh, FaTags, FaBullhorn } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { CiBank } from "react-icons/ci";
import { SlDocs } from "react-icons/sl";
import {
  FiHome,
  FiBox,
  FiTag,
  FiBarChart2,
  FiUsers,
  FiFileText,
  FiDollarSign,
} from "react-icons/fi";
import { MdCategory } from "react-icons/md";
import { FaRegClipboard } from "react-icons/fa";
const SubNavbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [role, setRole] = useState(null);

  const handleMouseEnter = (menu) => {
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };
  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) {
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.payLoad.role) {
        setRole(decoded.payLoad.role);
      } else {
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);
  const [allowedModules, setAllowedModules] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userid");

    if (!userId) {
      console.error("No userId found in localStorage");
      return;
    }

    const fetchUserModules = async () => {
      try {
        const response = await fetch(
          `https://multi-vendor-marketplace.vercel.app/auth/getUserWithModules/${userId}`,
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        setAllowedModules(data.modules || []);
      } catch (error) {
        console.error("Error fetching user modules:", error);
      }
    };

    fetchUserModules();
  }, []);

  const modulesList = [
    {
      name: "Dashboard",
      icon: <FiHome className="text-indigo-600" />,
      path: "/",
    },
    {
      name: "Products",
      icon: <FiBox className="text-pink-600" />,
      path: "#",
      subModules: [
        { name: "Manage Product", path: "/manage-product" },
        { name: "Add Product", path: "/add-product" },
        { name: "Inventory", path: "/inventory" },
        { name: "Approval", path: "/manage-approvals" },
        { name: "Manage Categories", path: "/manage-categories" },
        { name: "Manage Options", path: "/manage-options" },
        { name: "Manage Size Charts", path: "/manage-size-chart" },
        { name: "Manage Shipping", path: "/manage-shipping" },
      ],
    },
    {
      name: "Orders",
      icon: <FaTags className="text-blue-600" />,
      path: "#",
      subModules: [
        { name: "ManageOrders", path: "/Order_Details" },
        { name: "Manage Requests", path: "/manage-requests" },
      ],
    },
    {
      name: "Promotions",
      icon: <FaRegClipboard className="text-yellow-500" />,
      path: "#",
      subModules: [
        { name: "My Promotions", path: "#" },
        { name: "All Promotions", path: "/promotions" },
      ],
    },
    {
      name: "Reports",
      icon: <FiBarChart2 className="text-purple-500" />,
      path: "#",
      subModules: [
        { name: "Catalog Performance", path: "/catalog-performance" },
        { name: "Consultation", path: "/consultation" },
        { name: "Seller Rating", path: "#" },
      ],
    },
    {
      name: "OnBoardUser",
      icon: <FiUsers className="text-green-600" />,
      path: "/on-board-users",
    },
    {
      name: "Finance",
      icon: <FiDollarSign className="text-purple-600" />,
      path: "/finance",
    },
    {
      name: "Documentation",
      icon: <FiFileText className="text-green-600" />,
      path: "/api-docs",
    },
  ];
  return (
    <div className="flex items-center bg-white border border-gray-300 px-4 py-2 shadow-sm relative ">
      <ul className="flex space-x-6 text-sm text-gray-700">
        {modulesList.map((module) => {
          if (!allowedModules.includes(module.name)) return null;

          return (
            <li
              key={module.name}
              className="relative flex items-center space-x-1 cursor-pointer hover:text-gray-900"
              onMouseEnter={() => handleMouseEnter(module.name)}
              onMouseLeave={handleMouseLeave}
            >
              {module.icon}
              <Link to={module.path}>{module.name}</Link>

              {module.subModules && openDropdown === module.name && (
                <div className="absolute top-full left-0 bg-gray-600 text-white py-2 px-4 w-48 shadow-lg z-50">
                  {module.subModules
                    .filter((subModule) =>
                      allowedModules.includes(subModule.name),
                    )
                    .map((subModule) => (
                      <Link
                        key={subModule.name}
                        to={subModule.path}
                        className="block hover:bg-gray-700 px-2 py-1"
                      >
                        {subModule.name}
                      </Link>
                    ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SubNavbar;
