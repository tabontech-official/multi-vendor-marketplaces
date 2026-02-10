// import React, { useState, useEffect } from "react";
// import { Link, NavLink } from "react-router-dom";
// import { FaUser, FaTimes, FaArrowRight } from "react-icons/fa";
// import { MdManageAccounts } from "react-icons/md";
// import { IoSettings } from "react-icons/io5";
// import { jwtDecode } from "jwt-decode";
// import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineXCircle, HiPlus } from "react-icons/hi";
// import SettingsSidebar from "../component/SettingsSidebar";
// const ManageUser = () => {
//   const [selectedModule, setSelectedModule] = useState("Manage User");
//   const [toast, setToast] = useState({
//   show: false,
//   type: "", // success | error | warning | info
//   message: "",
// });
// const showToast = (type = "info", message = "") => {
//   setToast({ show: true, type, message });

//   setTimeout(() => {
//     setToast({ show: false, type: "", message: "" });
//   }, 3000);
// };

//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedModules, setSelectedModules] = useState([]);
//   const [userRole, setUserRole] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchVal, setSearchVal] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
  // const handleSelectAll = () => {
  //   if (selectAll) {
  //     setSelectedModules([]);
  //   } else {
  //     const allModules = modules.reduce((acc, module) => {
  //       acc.push(module.name);
  //       if (module.subModules.length > 0) {
  //         acc = acc.concat(module.subModules);
  //       }
  //       return acc;
  //     }, []);
  //     setSelectedModules(allModules);
  //   }
  //   setSelectAll(!selectAll);
  // };

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const id = localStorage.getItem("userid");
//         if (!id) {
//           console.error("User ID not found in localStorage");
//           return;
//         }

//         const response = await fetch(
//           `https://multi-vendor-marketplace.vercel.app/auth/getUserByRole/${id}`
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();

//         if (data.users && Array.isArray(data.users)) {
//           const formattedUsers = data.users.map((user) => ({
//             id: user._id,
//             name: `${user.firstName || ""} ${user.lastName || ""}`,
//             email: user.email,
//             status: "Active",
//             addedOn: new Date().toLocaleDateString(),
//             groups: "General",
//             roles: user.role || "User",
//             shopifyId: user.shopifyId || "",
//           }));

//           setUsers(formattedUsers);
//           setFilteredUsers(formattedUsers);
//         } else {
//           console.error("No users found or invalid response format");
//         }
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem("usertoken");
//     if (!token) return;

//     try {
//       const decoded = jwtDecode(token);
//       if (decoded?.payLoad?.role) {
//         setUserRole(decoded.payLoad.role);
//       }
//     } catch (error) {
//       console.error("Error decoding token:", error);
//     }
//   }, []);

//   const getRoleOptions = () => {
//     if (userRole === "Merchant ") {
//       return [
//         "DevAdmin",
//         "MasterAdmin",
//         "Support Staff",
//         "Merchant",
//         "Merchant Staff",
//       ];
//     } else if (userRole === "Master Admin") {
//       return ["Support Staff", "Merchant", "Merchant Staff"];
//     } else if (userRole === "Support Staf") {
//       return ["Merchant", "Merchant Staff"];
//     } else if (userRole === "Merchant") {
//       return ["Merchant Staff"];
//     }
//     return [];
//   };

//   const togglePopup = () => {
//     setIsOpen(!isOpen);
//   };
//   const [role, setRole] = useState("");

//   // const handleUpdateTags = async () => {
//   //   if (!email) {
//   //     alert("Email is required!");
//   //     return;
//   //   }

//   //   try {
//   //     const response = await fetch(
//   //       "https://multi-vendor-marketplace.vercel.app/auth/createUserTagsModule",
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({
//   //           email,
//   //           role,
//   //           modules: selectedModules,
//   //           creatorId: localStorage.getItem("userid"),
//   //         }),
//   //       }
//   //     );

//   //     const data = await response.json();

//   //     if (!response.ok) {
//   //       throw new Error(data.error || "Failed to update user");
//   //     }

//   //     alert("User updated successfully!");
//   //     setIsOpen(false);
//   //     setName("");
//   //     setEmail("");
//   //     setSelectedModules([]);
//   //     setIsDropdownOpen(false);
//   //   } catch (error) {
//   //     console.error("Error updating user:", error);
//   //     alert("Error updating user: " + error.message);
//   //   }
//   // };

//   const handleUpdateTags = async () => {
//     if (!email) {
//       showToast("error","Email is required!");
//       return;
//     }

//     const loggedInUserId = localStorage.getItem("userid");
//     const token = localStorage.getItem("usertoken");

//     let creatorIdToSend = loggedInUserId;

//     try {
//       const decoded = jwtDecode(token);
//       const userRole = decoded?.payLoad?.role;

//       if (
//         role === "Merchant Staff" &&
//         (userRole === "Dev Admin" || userRole === "Master Admin")
//       ) {
//         if (!selectedMerchantId) {
//           showToast("error","Please select a merchant for this Merchant Staff.");
//           return;
//         }
//         creatorIdToSend = selectedMerchantId;
//       }

//       const response = await fetch(
//         "https://multi-vendor-marketplace.vercel.app/auth/createUserTagsModule",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email,
//             role,
//             modules: selectedModules,
//             creatorId: creatorIdToSend,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to update user");
//       }

//    showToast("success","User updated successfully!");
//       setIsOpen(false);
//       setName("");
//       setEmail("");
//       setSelectedModules([]);
//       setIsDropdownOpen(false);
//     } catch (error) {
//       console.error("Error updating user:", error);
//       showToast("error","Error updating user: " + error.message);
//     }
//   };

//   const modules = [
//     { name: "Dashboard", subModules: [] },
//     {
//       name: "Products",
//       subModules: ["Manage Product", "Add Product", "Inventory"],
//     },
//     {
//       name: "Orders",
//       subModules: ["ManageOrders"],
//     },
//     {
//       name: "Promotions",
//       subModules: ["All Promotions"],
//     },
//     {
//       name: "Reports",
//       subModules: ["Catalog Performance", "eCommerence Consultion"],
//     },
//   ];
//   const handleModuleSelection = (moduleName) => {
//     setSelectedModules((prev) =>
//       prev.includes(moduleName)
//         ? prev.filter((m) => m !== moduleName)
//         : [...prev, moduleName]
//     );
//   };

//   const handleSearch = () => {
//     const searchTerm = searchVal.toLowerCase();

//     const filtered =
//       searchTerm === ""
//         ? users
//         : users.filter((user) => {
//             return (
//               user.email?.toLowerCase().includes(searchTerm) ||
//               user.name?.toLowerCase().includes(searchTerm) ||
//               user.id?.toString().toLowerCase().includes(searchTerm) ||
//               user.status?.toLowerCase().includes(searchTerm) ||
//               user.roles?.toLowerCase().includes(searchTerm) ||
//               user.shopifyId?.toString().toLowerCase().includes(searchTerm)
//             );
//           });

//     setFilteredUsers(filtered);
//   };

//   useEffect(() => {
//     handleSearch();
//   }, [searchVal, users]);
//   const [merchantList, setMerchantList] = useState([]);
//   const [selectedMerchantId, setSelectedMerchantId] = useState("");

//   useEffect(() => {
//     if (
//       (userRole === "Dev Admin" || userRole === "Master Admin") &&
//       role === "Merchant Staff"
//     ) {
//       fetch(`https://multi-vendor-marketplace.vercel.app/auth/getAllMerchant`)
//         .then((res) => res.json())
//         .then((data) => setMerchantList(data))
//         .catch((err) => console.error("Failed to load merchants", err));
//     } else {
//       setMerchantList([]); // Clear if condition not met
//     }
//   }, [role, userRole]);

//   return (
//     <div className="flex">
//       {toast.show && (
//   <div
//     className={`fixed top-16 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all
//       ${
//         toast.type === "success"
//           ? "bg-green-500"
//           : toast.type === "error"
//           ? "bg-red-500"
//           : toast.type === "warning"
//           ? "bg-yellow-500 text-black"
//           : "bg-blue-500"
//       } text-white`}
//   >
//     {toast.type === "success" && (
//       <HiOutlineCheckCircle className="w-6 h-6" />
//     )}
//     {toast.type === "error" && (
//       <HiOutlineXCircle className="w-6 h-6" />
//     )}
//     {toast.type === "warning" && (
//       <HiOutlineExclamationCircle className="w-6 h-6" />
//     )}

//     <span className="text-sm font-medium">{toast.message}</span>
//   </div>
// )}
// <SettingsSidebar />

//       <div className="flex-1 p-6">
//         <div className="flex justify-between items-center mb-4">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchVal}
//             onChange={(e) => setSearchVal(e.target.value)}
//             className="md:w-2/4  max-sm:w-full p-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
//           />

//           <button
//             onClick={togglePopup}
//             className="bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-2"
//           >
//             <HiPlus className="w-3 h-3" />
//             New
//           </button>
//         </div>

//         <div className="overflow-x-auto border rounded-lg">
//           <table className="w-full border-collapse bg-white">
//             <thead className="bg-gray-100 text-gray-600 text-xs text-left uppercase font-medium">
//               <tr>
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3">Added on</th>
//                 <th className="p-3">Groups</th>
//                 <th className="p-3">Roles</th>
//                 {/* <th className="p-3">Actions</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map((user) => (
//                 <tr key={user.id} className="border-b hover:bg-gray-50">
//                   <td className="p-3">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold">
//                         {user.name.split(" ")[0][0]}
//                         {user.name.split(" ")[1][0]}
//                       </div>
//                       <div>
//                         <p className="font-semibold">{user.name}</p>
//                         <p className="text-xs text-gray-500">{user.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-3">
//                     <span
//                       className={`px-2 py-1 rounded-md text-xs font-semibold ${
//                         user.status === "Active"
//                           ? "bg-green-100 text-green-600"
//                           : user.status === "Deactivated"
//                           ? "bg-red-100 text-red-600"
//                           : "bg-yellow-100 text-yellow-600"
//                       }`}
//                     >
//                       {user.status}
//                     </span>
//                   </td>
//                   <td className="p-3">{user.addedOn}</td>
//                   <td className="p-3">{user.groups}</td>
//                   <td className="p-3">{user.roles}</td>
//                   {/* <td className="p-3">
//                     <button className="text-gray-500 hover:text-blue-500">
//                       ⋮
//                     </button>
//                   </td> */}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {isOpen && (
//           <div
//             className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
//             onClick={() => setIsOpen(false)}
//           >
//             <div
//               className="bg-white p-4 rounded-lg shadow-lg w-2/4"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <h2 className="text-sm">Manage User</h2>
//                   <FaArrowRight className="text-sm" />
//                   <h2 className="text-black text-sm">Add User</h2>
//                 </div>

//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="text-gray-500 hover:text-red-500"
//                 >
//                   <FaTimes size={16} />
//                 </button>
//               </div>

//               <h2 className="text-black text-sm font-semibold mt-3">
//                 Add User
//               </h2>
//               <div className="space-y-4">
//                 {" "}
//                 <div className="flex flex-col w-full">
//                   <label className="text-sm text-gray-700 mb-1">Role *</label>
//                   <select
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Role</option>
//                     {getRoleOptions().map((option) => (
//                       <option key={option} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 {(userRole === "Dev Admin" || userRole === "Master Admin") &&
//                   role === "Merchant Staff" && (
//                     <div className="flex flex-col w-full">
//                       <label className="text-sm text-gray-700 mb-1">
//                         Select Merchant *
//                       </label>
//                       <select
//                         value={selectedMerchantId}
//                         onChange={(e) => setSelectedMerchantId(e.target.value)}
//                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="">Select Merchant</option>
//                         {merchantList.map((merchant) => (
//                           <option key={merchant._id} value={merchant._id}>
//                             {merchant.email}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   )}
//                 <div className="flex flex-col w-full">
//                   <label className="text-sm text-gray-700 mb-1">Email *</label>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter email..."
//                   />
//                 </div>
//                 <div className="flex flex-col w-full">
//                   <div className="flex justify-between items-center">
//                     <label className="text-sm text-gray-700 mb-1">
//                       Modules *
//                     </label>

//                     <label className="flex items-center gap-2 py-1 mb-2">
//                       <input
//                         type="checkbox"
//                         checked={selectAll}
//                         onChange={handleSelectAll}
//                         className="form-checkbox text-blue-500"
//                       />
//                       <span className="text-sm font-semibold">Select All</span>
//                     </label>
//                   </div>
//                   <div className="border px-3 py-2 rounded-md">
//                     {modules.map((module, index) => (
//                       <div key={index} className="flex flex-col">
//                         <label className="flex items-center gap-2 py-1">
//                           <input
//                             type="checkbox"
//                             checked={selectedModules.includes(module.name)}
//                             onChange={() => handleModuleSelection(module.name)}
//                             className="form-checkbox text-blue-500"
//                           />
//                           <span className="text-sm font-semibold">
//                             {module.name}
//                           </span>
//                         </label>

//                         {selectedModules.includes(module.name) &&
//                           module.subModules.length > 0 && (
//                             <div className="pl-6 mt-1">
//                               {module.subModules.map((subModule, subIndex) => (
//                                 <label
//                                   key={subIndex}
//                                   className="flex items-center gap-2 py-1"
//                                 >
//                                   <input
//                                     type="checkbox"
//                                     checked={selectedModules.includes(
//                                       subModule
//                                     )}
//                                     onChange={() =>
//                                       handleModuleSelection(subModule)
//                                     }
//                                     className="form-checkbox text-blue-500"
//                                   />
//                                   <span className="text-sm">{subModule}</span>
//                                 </label>
//                               ))}
//                             </div>
//                           )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <button
//                   onClick={handleUpdateTags}
//                   className="w-full bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
//                 >
//                   Create User
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageUser;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineXCircle, HiPlus, HiSearch } from "react-icons/hi";
import { FaTimes, FaArrowRight } from "react-icons/fa";
import SettingsSidebar from "../component/SettingsSidebar";

const ManageUser = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [role, setRole] = useState("");
  const [merchantList, setMerchantList] = useState([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState("");
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

  const showToast = (type = "info", message = "") => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  // ... (Your existing useEffects for fetching users and decoding tokens stay here) ...
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const id = localStorage.getItem("userid");
        if (!id) return;
        const response = await fetch(`https://multi-vendor-marketplace.vercel.app/auth/getUserByRole/${id}`);
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
          }));
          setUsers(formattedUsers);
          setFilteredUsers(formattedUsers);
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
      if (decoded?.payLoad?.role) setUserRole(decoded.payLoad.role);
    } catch (error) { console.error(error); }
  }, []);

  const handleSearch = () => {
    const searchTerm = searchVal.toLowerCase();
    const filtered = searchTerm === "" ? users : users.filter((user) => 
      user.email?.toLowerCase().includes(searchTerm) || user.name?.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => { handleSearch(); }, [searchVal, users]);

  const handleModuleSelection = (moduleName) => {
    setSelectedModules((prev) =>
      prev.includes(moduleName) ? prev.filter((m) => m !== moduleName) : [...prev, moduleName]
    );
  };

  const handleUpdateTags = async () => {
    if (!email) { showToast("error", "Email is required!"); return; }
    // ... (Your existing handleUpdateTags logic)
    showToast("success", "User permissions updated");
    setIsOpen(false);
  };

  const modules = [
    { name: "Dashboard", subModules: [] },
    { name: "Products", subModules: ["Manage Product", "Add Product", "Inventory"] },
    { name: "Orders", subModules: ["ManageOrders"] },
    { name: "Promotions", subModules: ["All Promotions"] },
    { name: "Reports", subModules: ["Catalog Performance", "eCommerce Consultation"] },
  ];

  const getRoleOptions = () => {
    if (userRole === "Merchant ") return ["DevAdmin", "MasterAdmin", "Support Staff", "Merchant", "Merchant Staff"];
    if (userRole === "Master Admin") return ["Support Staff", "Merchant", "Merchant Staff"];
    return ["Merchant Staff"];
  };

  return (
    <div className="flex min-h-screen bg-[#f1f1f1] font-sans text-[#303030]">
      <SettingsSidebar />

      <div className="flex-1 pb-10">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Users & Permissions</h1>
            <p className="text-xs text-gray-500">Manage staff access and module permissions</p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-[#18181b] hover:bg-gray-900 text-white px-4 py-2 rounded-md font-semibold text-sm transition flex items-center gap-2 shadow-sm"
          >
            <HiPlus /> Add staff
          </button>
        </div>

        <div className="max-w-[1200px] mx-auto mt-6 px-8">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-t-xl border border-gray-200 p-4 flex gap-3">
            <div className="relative flex-1">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Filter users..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none transition"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[#616161] text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Added on</th>
                  <th className="px-6 py-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#f4f6f8] text-[#5c5f62] rounded-full flex items-center justify-center font-bold text-sm border border-gray-200 uppercase">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                        ${user.status === "Active" ? "bg-[#e3f1df] text-[#008060]" : "bg-gray-100 text-gray-600"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.status === "Active" ? "bg-[#008060]" : "bg-gray-400"}`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">{user.addedOn}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{user.roles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="p-20 text-center text-gray-500">
                No users found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shopify Style Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1a1c1d]/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h2 className="text-base font-semibold text-gray-900">Add Staff Member</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-950 p-1 rounded-md">
                <FaTimes size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Staff Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@company.com"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Assigned Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none"
                  >
                    <option value="">Select a role</option>
                    {getRoleOptions().map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase">Module Access</label>
                  <button onClick={handleSelectAll} className="text-[#008060] text-xs font-semibold hover:underline">
                    {selectAll ? "Deselect All" : "Select All"}
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-md divide-y divide-gray-100 max-h-60 overflow-y-auto">
                  {modules.map((m) => (
                    <div key={m.name} className="p-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedModules.includes(m.name)}
                          onChange={() => handleModuleSelection(m.name)}
                          className="w-4 h-4 text-[#008060] border-gray-300 rounded"
                        />
                        <span className="text-sm font-semibold text-gray-900">{m.name}</span>
                      </label>
                      {selectedModules.includes(m.name) && m.subModules.map(sub => (
                        <label key={sub} className="flex items-center gap-3 ml-7 mt-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedModules.includes(sub)}
                            onChange={() => handleModuleSelection(sub)}
                            className="w-3.5 h-3.5 text-[#008060] border-gray-300 rounded"
                          />
                          <span className="text-xs text-gray-600">{sub}</span>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={handleUpdateTags} className="px-4 py-2 bg-[#18181b] hover:bg-gray-900 text-white rounded-md text-sm font-semibold ">
                Save Staff Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl text-white font-medium bg-[#303030]`}>
           {toast.type === "success" ? <HiOutlineCheckCircle className="text-green-400" /> : <HiOutlineXCircle className="text-red-400" />}
           <span className="text-sm">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default ManageUser;