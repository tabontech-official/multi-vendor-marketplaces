import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTh, FaTags, FaBullhorn } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { CiBank } from "react-icons/ci";
import { SlDocs } from "react-icons/sl";

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
          `https://multi-vendor-marketplace.vercel.app/auth/getUserWithModules/${userId}`
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
      icon: <MdDashboard className="text-green-600" />,
      path: "/",
    },
    {
      name: "Products",
      icon: <FaTh className="text-green-600" />,
      path: "#",
      subModules: [
        { name: "Manage Product", path: "/manage-product" },
        { name: "Add Product", path: "/add-product" },
        { name: "Inventory", path: "/inventory" },
        { name: "Manage Categories", path: "/manage-categories" },
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
      icon: <FaBullhorn className="text-yellow-500" />,
      path: "#",
      subModules: [
        { name: "my Promitions", path: "#" },
        { name: "All Promotions", path: "/promotions" },
      ],
    },
    {
      name: "Reports",
      icon: <BsGraphUp className="text-purple-500" />,
      path: "#",
      subModules: [
        { name: "Catalog Performance", path: "/catalog-performance" },
        { name: "eCommerence Consultion", path: "/consultation" },
        { name: "Seller Rating", path: "#" },
      ],
    },
    {
      name: "OnBoardUser",
      icon: <MdDashboard className="text-green-600" />,
      path: "/on-board-users",
    },
    {
      name: "Finance",
      icon: <CiBank className="text-purple-600" />,
      path: "/finance",
    },
    {
      name: "Approval",
      icon: <CiBank className="text-purple-600" />,
      path: "/approval",
    },
     {
      name: "Documentation",
      icon: <SlDocs className="text-green-600" />,
      path: "/api-docs",
    },
  ];

  return (
    <div className="flex items-center bg-white border border-gray-300 px-4 py-2 shadow-sm relative">
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
                <div className="absolute top-full left-0 bg-gray-600 text-white py-2 px-4 w-48 shadow-lg">
                  {module.subModules
                    .filter((subModule) =>
                      allowedModules.includes(subModule.name)
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
