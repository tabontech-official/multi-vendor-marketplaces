import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaUser, FaTimes, FaArrowRight } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineXCircle, HiPlus } from "react-icons/hi";
const ManageUser = () => {
  const [selectedModule, setSelectedModule] = useState("Manage User");
  const [toast, setToast] = useState({
  show: false,
  type: "", // success | error | warning | info
  message: "",
});
const showToast = (type = "info", message = "") => {
  setToast({ show: true, type, message });

  setTimeout(() => {
    setToast({ show: false, type: "", message: "" });
  }, 3000);
};

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedModules([]);
    } else {
      const allModules = modules.reduce((acc, module) => {
        acc.push(module.name);
        if (module.subModules.length > 0) {
          acc = acc.concat(module.subModules);
        }
        return acc;
      }, []);
      setSelectedModules(allModules);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const id = localStorage.getItem("userid");
        if (!id) {
          console.error("User ID not found in localStorage");
          return;
        }

        const response = await fetch(
          `https://multi-vendor-marketplace.vercel.app/auth/getUserByRole/${id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.users && Array.isArray(data.users)) {
          const formattedUsers = data.users.map((user) => ({
            id: user._id,
            name: `${user.firstName || ""} ${user.lastName || ""}`,
            email: user.email,
            status: "Active",
            addedOn: new Date().toLocaleDateString(),
            groups: "General",
            roles: user.role || "User",
            shopifyId: user.shopifyId || "",
          }));

          setUsers(formattedUsers);
          setFilteredUsers(formattedUsers);
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
    if (userRole === "Merchant ") {
      return [
        "DevAdmin",
        "MasterAdmin",
        "Support Staff",
        "Merchant",
        "Merchant Staff",
      ];
    } else if (userRole === "Master Admin") {
      return ["Support Staff", "Merchant", "Merchant Staff"];
    } else if (userRole === "Support Staf") {
      return ["Merchant", "Merchant Staff"];
    } else if (userRole === "Merchant") {
      return ["Merchant Staff"];
    }
    return [];
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  const [role, setRole] = useState("");

  // const handleUpdateTags = async () => {
  //   if (!email) {
  //     alert("Email is required!");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       "https://multi-vendor-marketplace.vercel.app/auth/createUserTagsModule",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           email,
  //           role,
  //           modules: selectedModules,
  //           creatorId: localStorage.getItem("userid"),
  //         }),
  //       }
  //     );

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.error || "Failed to update user");
  //     }

  //     alert("User updated successfully!");
  //     setIsOpen(false);
  //     setName("");
  //     setEmail("");
  //     setSelectedModules([]);
  //     setIsDropdownOpen(false);
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //     alert("Error updating user: " + error.message);
  //   }
  // };

  const handleUpdateTags = async () => {
    if (!email) {
      showToast("error","Email is required!");
      return;
    }

    const loggedInUserId = localStorage.getItem("userid");
    const token = localStorage.getItem("usertoken");

    let creatorIdToSend = loggedInUserId;

    try {
      const decoded = jwtDecode(token);
      const userRole = decoded?.payLoad?.role;

      if (
        role === "Merchant Staff" &&
        (userRole === "Dev Admin" || userRole === "Master Admin")
      ) {
        if (!selectedMerchantId) {
          showToast("error","Please select a merchant for this Merchant Staff.");
          return;
        }
        creatorIdToSend = selectedMerchantId;
      }

      const response = await fetch(
        "https://multi-vendor-marketplace.vercel.app/auth/createUserTagsModule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            role,
            modules: selectedModules,
            creatorId: creatorIdToSend,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

   showToast("success","User updated successfully!");
      setIsOpen(false);
      setName("");
      setEmail("");
      setSelectedModules([]);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      showToast("error","Error updating user: " + error.message);
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

  const handleSearch = () => {
    const searchTerm = searchVal.toLowerCase();

    const filtered =
      searchTerm === ""
        ? users
        : users.filter((user) => {
            return (
              user.email?.toLowerCase().includes(searchTerm) ||
              user.name?.toLowerCase().includes(searchTerm) ||
              user.id?.toString().toLowerCase().includes(searchTerm) ||
              user.status?.toLowerCase().includes(searchTerm) ||
              user.roles?.toLowerCase().includes(searchTerm) ||
              user.shopifyId?.toString().toLowerCase().includes(searchTerm)
            );
          });

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchVal, users]);
  const [merchantList, setMerchantList] = useState([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState("");

  useEffect(() => {
    if (
      (userRole === "Dev Admin" || userRole === "Master Admin") &&
      role === "Merchant Staff"
    ) {
      fetch(`https://multi-vendor-marketplace.vercel.app/auth/getAllMerchant`)
        .then((res) => res.json())
        .then((data) => setMerchantList(data))
        .catch((err) => console.error("Failed to load merchants", err));
    } else {
      setMerchantList([]); // Clear if condition not met
    }
  }, [role, userRole]);

  return (
    <div className="flex">
      {toast.show && (
  <div
    className={`fixed top-16 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all
      ${
        toast.type === "success"
          ? "bg-green-500"
          : toast.type === "error"
          ? "bg-red-500"
          : toast.type === "warning"
          ? "bg-yellow-500 text-black"
          : "bg-blue-500"
      } text-white`}
  >
    {toast.type === "success" && (
      <HiOutlineCheckCircle className="w-6 h-6" />
    )}
    {toast.type === "error" && (
      <HiOutlineXCircle className="w-6 h-6" />
    )}
    {toast.type === "warning" && (
      <HiOutlineExclamationCircle className="w-6 h-6" />
    )}

    <span className="text-sm font-medium">{toast.message}</span>
  </div>
)}
      <aside className="w-56 mt-3 mb-3 ml-4 rounded-2xl bg-blue-900 p-5 flex flex-col justify-between min-h-screen shadow-lg">
        {/* Top: Profile */}
        <div>
          <div className="flex flex-col items-center border-b border-blue-700 pb-4">
            <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center shadow-md">
              <FaUser className="text-yellow-400 w-8 h-8" />
            </div>

            <h2 className="text-lg font-semibold text-white mt-3">
              Business Account
            </h2>

            <div className="flex items-center mt-1 space-x-1">
              <span className="text-yellow-400 font-semibold text-sm">6.0</span>
              <div className="flex space-x-0.5">
                {[...Array(5)].map((_, index) => (
                  <span key={index} className="text-yellow-400 text-sm">
                    ★
                  </span>
                ))}
              </div>
            </div>

            <p className="text-green-400 text-xs mt-1">
              Profile is 75% complete
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-3">
            {userRole === "Merchant" && (
              <NavLink
                to="/manage-user"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition-all duration-150 ${
                    isActive
                      ? "bg-yellow-400 text-blue-900"
                      : "text-blue-200 hover:bg-blue-800"
                  }`
                }
              >
                <MdManageAccounts className="mr-2 text-lg" />
                <span className="text-sm font-medium">Manage User</span>
              </NavLink>
            )}
            <NavLink
              to="/edit-account"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md transition-all duration-150 ${
                  isActive
                    ? "bg-yellow-400 text-blue-900"
                    : "text-blue-200 hover:bg-blue-800"
                }`
              }
            >
              <IoSettings className="mr-2 text-lg" />
              <span className="text-sm font-medium">Settings</span>
            </NavLink>

            <NavLink
              to="/api-credentials"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md transition-all duration-150 ${
                  isActive
                    ? "bg-yellow-400 text-blue-900"
                    : "text-blue-200 hover:bg-blue-800"
                }`
              }
            >
              <IoSettings className="mr-2 text-lg" />
              <span className="text-sm font-medium">API Credentials</span>
            </NavLink>
            <NavLink
              to="/finance-setting"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md transition-all duration-150 ${
                  isActive
                    ? "bg-yellow-400 text-blue-900"
                    : "text-blue-200 hover:bg-blue-800"
                }`
              }
            >
              <IoSettings className="mr-2 text-lg" />
              <span className="text-sm font-medium">Finance Settings</span>
            </NavLink>
            {(userRole === "Master Admin" || userRole === "Dev Admin") && (
              <NavLink
                to="/approval-setting"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition-all duration-150 ${
                    isActive
                      ? "bg-yellow-400 text-blue-900"
                      : "text-blue-200 hover:bg-blue-800"
                  }`
                }
              >
                <MdManageAccounts className="mr-2 text-lg" />
                <span className="text-sm font-medium">Approval Settings</span>
              </NavLink>
            )}
          </nav>
        </div>

        {/* Bottom: Promote Button */}
        <button className="w-full mt-6 py-2 bg-yellow-400 text-blue-900 font-semibold rounded-md hover:bg-yellow-500 transition-all duration-150">
          🚀 Promote
        </button>
      </aside>

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="md:w-2/4 p-2 max-sm:w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                {/* <th className="p-3">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
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
                  {/* <td className="p-3">
                    <button className="text-gray-500 hover:text-blue-500">
                      ⋮
                    </button>
                  </td> */}
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

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <h2 className="text-black text-sm font-semibold mt-3">
                Add User
              </h2>
              <div className="space-y-4">
                {" "}
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
                {(userRole === "Dev Admin" || userRole === "Master Admin") &&
                  role === "Merchant Staff" && (
                    <div className="flex flex-col w-full">
                      <label className="text-sm text-gray-700 mb-1">
                        Select Merchant *
                      </label>
                      <select
                        value={selectedMerchantId}
                        onChange={(e) => setSelectedMerchantId(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Merchant</option>
                        {merchantList.map((merchant) => (
                          <option key={merchant._id} value={merchant._id}>
                            {merchant.email}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
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
                  <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-700 mb-1">
                      Modules *
                    </label>

                    <label className="flex items-center gap-2 py-1 mb-2">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="form-checkbox text-blue-500"
                      />
                      <span className="text-sm font-semibold">Select All</span>
                    </label>
                  </div>
                  <div className="border px-3 py-2 rounded-md">
                    {modules.map((module, index) => (
                      <div key={index} className="flex flex-col">
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
