import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaTimes, FaArrowRight } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

import { HiPlus } from "react-icons/hi";
const OnBoard = () => {
  const [selectedModule, setSelectedModule] = useState("Manage User");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  const [selectedModules, setSelectedModules] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopifyId, setShopifyId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [searchVal, setSearchVal] = useState("");
  const [merchantList, setMerchantList] = useState([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState("");
  const [filteredUsers, setFilteredUsers] = useState({
    type: "",
    supportStaff: [],
    merchantGroups: [],
  });
  const [expandedMerchants, setExpandedMerchants] = useState([]);
  const [role, setRole] = useState("");

  // const [filteredUsers, setFilteredUsers] = useState([]);

  const handleShowDetails = async (id) => {
    try {
      setIsOpen(true);
      setSelectedUserId(id);

      const response = await fetch(
        `https://multi-vendor-marketplace.vercel.app/auth/getSingleUser/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const id = localStorage.getItem("userid");
        if (!id) return;

        const response = await fetch(
          `https://multi-vendor-marketplace.vercel.app/auth/getAllOnboardUsers/${id}`
        );
        const data = await response.json();

        const formatUser = (user) => ({
          id: user.id,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email || "N/A",
          status: "Active",
          addedOn: new Date(user.createdAt || Date.now()).toLocaleDateString(),
          shopifyId: user.shopifyId || "N/A",
          role: user.role,
        });

        if (data.type === "dev" && data.users) {
          const merchantMap = {};

          data.users.forEach((user) => {
            const formattedUser = formatUser(user);

            if (["Merchant", "Master Admin"].includes(user.role)) {
              merchantMap[user.id] = {
                merchant: formattedUser,
                staff: [],
              };
            } else if (user.role === "Merchant Staff" && user.createdBy) {
              if (!merchantMap[user.createdBy]) {
                merchantMap[user.createdBy] = {
                  merchant: null,
                  staff: [],
                };
              }
              merchantMap[user.createdBy].staff.push(formattedUser);
            } else if (user.role === "Support Staff" && user.createdBy) {
              if (!merchantMap[user.createdBy]) {
                merchantMap[user.createdBy] = {
                  merchant: null,
                  staff: [],
                };
              }
              merchantMap[user.createdBy].staff.push(formattedUser);
            } else {
              merchantMap[user.id] = {
                merchant: formattedUser,
                staff: [],
              };
            }
          });

          const merchantGroups = Object.values(merchantMap).filter(
            (group) => group.merchant !== null
          );

          setFilteredUsers({
            type: "dev",
            merchantGroups,
          });

          return;
        }

        if (data.type === "master") {
          const supportStaff = data.supportStaff.map(formatUser);

          const merchantGroups = data.merchantGroups.map((group) => ({
            merchant: formatUser(group.merchant),
            staff: group.staff.map(formatUser),
          }));

          setFilteredUsers({
            type: "master",
            supportStaff,
            merchantGroups,
          });
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const toggleMerchant = (merchantId) => {
    setExpandedMerchants((prev) =>
      prev.includes(merchantId)
        ? prev.filter((id) => id !== merchantId)
        : [...prev, merchantId]
    );
  };

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

  const togglePopupForAddinOrganizations = () => {
    setIsOpenPopup(!isOpenPopup);
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleUpdateTags = async () => {
    if (!email) {
      alert("Email is required!");
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
          alert("Please select a merchant for this Merchant Staff.");
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
    {
      name: "OnBoardUser",
      subModules: [],
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
    let filtered =
      searchVal === ""
        ? users
        : users.filter((user) => {
            const emailMatch = user.email
              ?.toLowerCase()
              .includes(searchVal.toLowerCase());
            const nameMatch = user.name
              ?.toLowerCase()
              .includes(searchVal.toLowerCase());
            const idMatch = user.id
              ?.toLowerCase()
              .includes(searchVal.toLowerCase());

            return emailMatch || nameMatch || idMatch;
          });

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchVal]);

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
      setMerchantList([]);
    }
  }, [role, userRole]);

  return (
    <div className="flex">
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
            onClick={togglePopupForAddinOrganizations}
            className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
          >
            <HiPlus className="w-5 h-5" />
            New
          </button>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full table-fixed border-collapse bg-white">
            <thead className="bg-gray-100 text-left text-gray-600 text-sm">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Added on</th>
                <th className="p-3">Customer_Id</th>
                <th className="p-3">Roles</th>
                <th className="p-3">Details</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.merchantGroups?.map((group) => {
                const merchant = group.merchant;
                const staff = group.staff || [];
                const isExpanded = expandedMerchants.includes(merchant?.id);

                return (
                  <React.Fragment key={merchant?.id}>
                    <tr className="border-b hover:bg-gray-50 bg-gray-100">
                      <td className="p-3 font-bold">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-yellow-800 font-semibold">
                            {(merchant?.name?.[0] || "") +
                              (merchant?.name?.split(" ")[1]?.[0] || "")}
                          </div>
                          <div>
                            <p className="font-semibold">{merchant?.name}</p>
                            <p className="text-xs text-gray-500">
                              {merchant?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">{merchant?.status}</td>
                      <td className="p-3">{merchant?.addedOn}</td>
                      <td className="p-3">#{merchant?.shopifyId}</td>
                      <td className="p-3">{merchant?.role}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleShowDetails(merchant?.id)}
                          className="text-blue-600 hover:underline"
                        >
                          Show Details
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        {merchant?.role === "Merchant" && (
                          <button onClick={() => toggleMerchant(merchant?.id)}>
                            {isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
                          </button>
                        )}
                      </td>
                    </tr>

                    {isExpanded &&
                      staff.map((user) => (
                        <tr
                          key={user?.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                                {(user.name?.[0] || "") +
                                  (user.name?.split(" ")[1]?.[0] || "")}
                              </div>
                              <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-xs text-gray-500">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">{user.status}</td>
                          <td className="p-3">{user.addedOn}</td>
                          <td className="p-3">#{user.shopifyId}</td>
                          <td className="p-3">{user.role}</td>
                          <td className="p-3">
                            <button
                              onClick={() => handleShowDetails(user.id)}
                              className="text-blue-600 hover:underline"
                            >
                              Show Details
                            </button>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}

              {filteredUsers.type === "master" &&
                filteredUsers.supportStaff?.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                          {(user.name?.[0] || "") +
                            (user.name?.split(" ")[1]?.[0] || "")}
                        </div>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{user.status}</td>
                    <td className="p-3">{user.addedOn}</td>
                    <td className="p-3">#{user.shopifyId}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleShowDetails(user.id)}
                        className="text-blue-600 hover:underline"
                      >
                        Show Details
                      </button>
                    </td>
                    <td className="p-3 text-right">—</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {isOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>

              <h2 className="text-2xl font-semibold text-center mb-6 border-b-2 border-gray-400">
                User Information
              </h2>
              <div className="space-y-4 bg-gray-50 p-6 rounded-lg shadow border border-gray-200">
                {[
                  ["First Name", userDetails?.firstName],
                  ["Last Name", userDetails?.lastName],
                  ["Email", userDetails?.email],
                  ["Address", userDetails?.address],
                  ["Role", userDetails?.role],
                  ["ZIP Code", userDetails?.zip],
                  ["Country", userDetails?.country],
                  ["State", userDetails?.state],
                  ["City", userDetails?.city],
                  ["Dispatch Address", userDetails?.address],
                ].map(([label, value], index) => (
                  <div
                    key={index}
                    className="flex justify-between  items-center border-b pb-2"
                  >
                    <span className="text-sm font-semibold  text-gray-600">
                      {label}
                    </span>
                    <span className="text-base  text-gray-900">
                      {value || "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {isOpenPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsOpenPopup(false)}
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
                onClick={() => setIsOpenPopup(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <h2 className="text-black text-sm font-semibold mt-3">Add User</h2>
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
                <label className="text-sm text-gray-700 mb-1">Modules *</label>
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
                                  checked={selectedModules.includes(subModule)}
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
  );
};

export default OnBoard;
