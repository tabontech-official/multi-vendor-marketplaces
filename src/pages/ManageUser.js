import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaTimes, FaArrowRight } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import { HiPlus } from "react-icons/hi";
const ManageUser = () => {
  const [selectedModule, setSelectedModule] = useState("Manage User");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const id = localStorage.getItem("userid");
        if (!id) {
          console.error("User ID not found in localStorage");
          return;
        }

        const response = await fetch(
          `https://multi-vendor-marketplace.vercel.app//auth/getUserByRole/${id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.users && Array.isArray(data.users)) {
          const formattedUsers = data.users.map((user) => {
            const formattedEmail = user.email
              ? user.email.split("@")[0]
              : "Unknown";

            return {
              id: user._id,
              name: `${user.firstName || ""} ${user.lastName || ""}`,
              email: user.email,
              status: "Active",
              addedOn: new Date().toLocaleDateString(),
              groups: "General",
              roles: user.role || "User",
            };
          });

          setUsers(formattedUsers);
        } else {
          console.error("No users found or invalid response format");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      if (decoded?.payLoad?.role) {
        setUserRole(decoded.payLoad.role);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const getRoleOptions = () => {
    if (userRole === "Dev Admin") {
      return ["DevAdmin", "MasterAdmin", "Client", "Staff"];
    } else if (userRole === "Master Admin") {
      return ["Client", "Staff"];
    } else if (userRole === "Client") {
      return ["Staff"];
    }
    return [];
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  const [role, setRole] = useState("");

  const handleUpdateTags = async () => {
    if (!email) {
      alert("Email is required!");
      return;
    }

    try {
      const response = await fetch(
        "https://multi-vendor-marketplace.vercel.app//auth/createUserTagsModule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            role,
            modules: selectedModules,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      alert("User updated successfully!");
      setIsOpen(false);
      setName("");
      setEmail("");
      setSelectedModules([]);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user: " + error.message);
    }
  };
  const modules = [
    { name: "Dashboard", subModules: [] },
    {
      name: "Products",
      subModules: ["Manage Product", "Add Product", "Inventory"],
    },
    {
      name: "Orders",
      subModules: ["ManageOrders"],
    },
    {
      name: "Promotions",
      subModules: ["All Promotions"],
    },
    {
      name: "Reports",
      subModules: ["Catalog Performance", "eCommerence Consultion"],
    },
  ];
  const handleModuleSelection = (moduleName) => {
    setSelectedModules((prev) =>
      prev.includes(moduleName)
        ? prev.filter((m) => m !== moduleName)
        : [...prev, moduleName]
    );
  };
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-52 mt-2 mb-2 ml-4 rounded-r-2xl bg-blue-900 p-6 flex flex-col justify-between min-h-screen">
        <div>
          {/* User Info */}
          <div className="flex flex-col items-center border-b-2">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
              <FaUser className="text-yellow-400 w-10 h-10" />
            </div>
            <h2 className="text-lg font-semibold text-white mt-2">
              Business Account
            </h2>

            <div className="flex items-center space-x-1 mt-1">
              <span className="text-yellow-400 text-sm font-semibold">6.0</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, index) => (
                  <span key={index} className="text-yellow-400 text-sm">
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-green-400 text-sm mt-1 mb-2">
              Profile is 75% complete
            </p>
            <div className=""></div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="mt-6 space-y-4">
            <button
              onClick={() => {
                setSelectedModule("Manage User");
              }}
              className={`w-full text-left flex items-center space-x-3 ${
                selectedModule === "Manage User"
                  ? "text-yellow-400"
                  : "text-blue-300"
              } hover:text-yellow-400`}
            >
              <span className="w-6 h-6 bg-blue-700 flex items-center justify-center rounded-md">
                <MdManageAccounts />
              </span>

              <Link to="/manage-user">
                <span className="text-sm">Manage User</span>
              </Link>
            </button>
            <button
              onClick={() => setSelectedModule("Settings")}
              className={`w-full text-left flex items-center space-x-3 ${
                selectedModule === "Settings"
                  ? "text-yellow-400"
                  : "text-blue-300"
              } hover:text-yellow-400`}
            >
              <span className="w-6 h-6 bg-blue-700 flex items-center justify-center rounded-md">
                <IoSettings />
              </span>
              <Link to="/edit-account">
                <span className="text-sm">Settings</span>
              </Link>
            </button>
          </nav>
        </div>

        {/* Promote Button */}
        <button className="w-full py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600">
          Promote
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search users"
            className="border rounded-md px-3 py-2 text-sm w-1/3"
          />

          <button
            onClick={togglePopup}
            className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
          >
            <HiPlus className="w-5 h-5" />
            New
          </button>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-100 text-left text-gray-600 text-sm">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Added on</th>
                <th className="p-3">Groups</th>
                <th className="p-3">Roles</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                        {user.name.split(" ")[0][0]}
                        {user.name.split(" ")[1][0]}
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : user.status === "Deactivated"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3">{user.addedOn}</td>
                  <td className="p-3">{user.groups}</td>
                  <td className="p-3">{user.roles}</td>
                  <td className="p-3">
                    <button className="text-gray-500 hover:text-blue-500">
                      ⋮
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white p-4 rounded-lg shadow-lg w-2/4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm">Manage User</h2>
                  <FaArrowRight className="text-sm" />
                  <h2 className="text-black text-sm">Add User</h2>
                </div>

                {/* Close (X) Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              {/* Form Content */}
              <h2 className="text-black text-sm font-semibold mt-3">
                Add User
              </h2>
              <div className="space-y-4">
                {" "}
                {/* Added spacing between inputs */}
                {/* Role Dropdown */}
                <div className="flex flex-col w-full">
                  <label className="text-sm text-gray-700 mb-1">Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Role</option>
                    {getRoleOptions().map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-sm text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email..."
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-sm text-gray-700 mb-1">
                    Modules *
                  </label>
                  <div className="border px-3 py-2 rounded-md">
                    {modules.map((module, index) => (
                      <div key={index} className="flex flex-col">
                        {/* Main Checkbox */}
                        <label className="flex items-center gap-2 py-1">
                          <input
                            type="checkbox"
                            checked={selectedModules.includes(module.name)}
                            onChange={() => handleModuleSelection(module.name)}
                            className="form-checkbox text-blue-500"
                          />
                          <span className="text-sm font-semibold">
                            {module.name}
                          </span>
                        </label>

                        {/* Sub-Modules (Only show if parent is checked) */}
                        {selectedModules.includes(module.name) &&
                          module.subModules.length > 0 && (
                            <div className="pl-6 mt-1">
                              {module.subModules.map((subModule, subIndex) => (
                                <label
                                  key={subIndex}
                                  className="flex items-center gap-2 py-1"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedModules.includes(
                                      subModule
                                    )}
                                    onChange={() =>
                                      handleModuleSelection(subModule)
                                    }
                                    className="form-checkbox text-blue-500"
                                  />
                                  <span className="text-sm">{subModule}</span>
                                </label>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Save Button */}
                <button
                  onClick={handleUpdateTags}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUser;
