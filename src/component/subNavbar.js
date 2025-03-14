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
  const [allowedModules, setAllowedModules] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userid");
    console.log("Fetched User ID from localStorage:", userId); // Debugging
  
    if (!userId) {
      console.error("No userId found in localStorage");
      return;
    }
  
    const fetchUserModules = async () => {
      try {
        console.log("Fetching user modules..."); // Debugging API call
        const response = await fetch(`https://multi-vendor-marketplace.vercel.app/auth/getUserWithModules/${userId}`);
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("User Modules:", data); // Debugging response
  
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
        { name: "Manage Product", path: "/manageProducts" },
        { name: "Add Product", path: "/addproducts" },
        { name: "Inventory", path: "/inventory" },
      ],
    },
    {
      name: "Orders",
      icon: <FaTags className="text-blue-600" />,
      path: "#",
      subModules: [{ name: "ManageOrders", path: "/Order_Details" }],
    },
    {
      name: "Promotions",
      icon: <FaBullhorn className="text-yellow-500" />,
      path: "#",
      subModules: [
        { name: "my Promitions", path: "#" },
        { name: "All Promotions", path: "#" },
      ],
    },
    {
      name: "Reports",
      icon: <BsGraphUp className="text-purple-500" />,
      path: "#",
      subModules: [
        { name: "Catalog Performance", path: "#" },
        { name: "eCommerence Consultion", path: "#" },
        { name: "Seller Rating", path: "#" },
      ],
    },
  ];



  return (
    <div className="flex items-center bg-white border border-gray-300 px-4 py-2 shadow-sm relative">
       <ul className="flex space-x-6 text-sm text-gray-700">
      {modulesList.map((module) => {
        // Agar module user ke allowed list me nahi hai to hide karein
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

            {/* Submodules dropdown */}
            {module.subModules && openDropdown === module.name && (
              <div className="absolute top-full left-0 bg-gray-600 text-white py-2 px-4 w-48 shadow-lg">
                {module.subModules
                  .filter((subModule) => allowedModules.includes(subModule.name)) // Filter allowed submodules
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
