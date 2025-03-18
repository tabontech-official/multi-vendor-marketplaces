import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { TiUserAdd } from "react-icons/ti";
import { IoSettings } from "react-icons/io5";
import AccountsNavbar from "../component/AccountsNavbar";

const ManageUser = () => {
  const [selectedModule, setSelectedModule] = useState("Manage User");

  const [users] = useState([
    {
      id: 1,
      name: "Timothy Janson",
      email: "timothy.janson@acme.com",
      status: "Not signed up",
      addedOn: "Dec 1, 2023",
      groups: "Enterprise Account",
      roles: "Manager +2 more",
    },
    {
      id: 2,
      name: "Gavin Truman",
      email: "gavin.truman@acme.com",
      status: "Active",
      addedOn: "Dec 8, 2023",
      groups: "Outbound, +2 more",
      roles: "Learner",
    },
    {
      id: 3,
      name: "Ella Torton",
      email: "ella.torton@acme.com",
      status: "Deactivated",
      addedOn: "Dec 1, 2023",
      groups: "Healthcare, +2 more",
      roles: "Admin +2 more",
    },
    {
      id: 4,
      name: "Lance Pereira",
      email: "lance.pereira@acme.com",
      status: "Not signed up",
      addedOn: "Dec 8, 2023",
      groups: "High-Value +2 more",
      roles: "Learner",
    },
    {
      id: 5,
      name: "Laurene Millman",
      email: "laurene.millman@acme.com",
      status: "Active",
      addedOn: "Dec 8, 2023",
      groups: "New Custo... +2 more",
      roles: "Admin +2 more",
    },
    {
      id: 6,
      name: "Takumi Ishida",
      email: "takumi.ishida@acme.com",
      status: "Active",
      addedOn: "Jan 2, 2024",
      groups: "Online Leads +2 more",
      roles: "Site owner",
    },
    {
      id: 7,
      name: "Ben Prothro",
      email: "ben.prothro@acme.com",
      status: "Active",
      addedOn: "Jan 2, 2024",
      groups: "Northern Re... +2 more",
      roles: "Site owner",
    },
  ]);

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
     
                 {/* Rating & Profile Completion */}
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
                 <div className="">
                   {/* Add Info Button */}
                   {/* <button className="mt-2 mb-2 text-yellow-500 px-4 py-1 text-sm font-sans border-2 border-yellow-500 rounded-2xl ">
                     Add Info
                   </button> */}
                 </div>
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
              
                            <Link to="/MANAGE_USER">
                              <span className="text-sm">Manage User</span>
                            </Link>
                          </button>
              {/* 
                          <button
                            onClick={() => {
                              setSelectedModule("Add User");
                              togglePopup();
                            }}
                            className={`w-full text-left flex items-center space-x-3 ${
                              selectedModule === "Add User"
                                ? "text-yellow-400"
                                : "text-blue-300"
                            } hover:text-yellow-400`}
                          >
                            <span className="w-6 h-6 bg-blue-700 flex items-center justify-center rounded-md">
                              <TiUserAdd />
                            </span>
                            <span className="text-sm">Add User</span>
                          </button> */}
              
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
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            + New
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
      </div>
    </div>
  );
};

export default ManageUser;
