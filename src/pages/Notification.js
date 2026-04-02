// import React, { useEffect } from "react";
// import { useNotification } from "../context api/NotificationContext";
// const Notification = () => {
//   const { notifications, fetchNotifications } = useNotification();

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   return (
//     <div className="bg-[#eaf5f3] min-h-screen py-12">
//       <div className=" px-10 py-3">
//         <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
//           Changelog
//         </h2>
//         <h1 className="text-3xl font-bold text-gray-900 mb-10">
//           What’s New at App?
//         </h1>
//       </div>

//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="relative border-l border-gray-300 ml-6">
//           {notifications.map((note, index) => (
//             <div key={note._id || index} className="relative mb-10 pl-6">
//               <span className="absolute -left-[13px] top-1.5 w-6 h-6 border-4 border-white bg-gray-300 rounded-full z-10 shadow-sm"></span>

//               <p className="text-xs font-bold text-gray-700 uppercase mb-1">
//                 {new Date(note.createdAt).toLocaleDateString("en-GB", {
//                   day: "numeric",
//                   month: "short",
//                 })}
//               </p>

//               <h3 className="text-base font-semibold text-blue-800 hover:underline cursor-pointer">
//                 {note.title || note.message}
//               </h3>

//               {note.description && (
//                 <p className="text-sm text-gray-700 mt-1">{note.description}</p>
//               )}

//               <div className="inline-flex items-center space-x-2 mt-2">
//                 <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-0.5 rounded-full">
//                   {note.source || "Feature"}
//                 </span>
//                 <span className="text-xs text-gray-500 font-medium">
//                   {note.firstName || note.lastName
//                     ? `${note.firstName} ${note.lastName}`
//                     : "Admin"}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Notification;
import React, { useEffect, useState, useMemo } from "react";
import { useNotification } from "../context api/NotificationContext";
import { jwtDecode } from "jwt-decode";

const Notification = () => {
  const { notifications, fetchNotifications } = useNotification();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState("All");
  const [selectedSource, setSelectedSource] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded?.payLoad?.role) {
        setRole(decoded.payLoad.role);
      } else {
        setRole("");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchNotifications();
  }, []);
  const isAdmin = role === "Master Admin" || role === "Dev Admin";
  const uniqueUsers = useMemo(() => {
    const users = notifications.map((note) =>
      note.firstName || note.lastName
        ? `${note.firstName} ${note.lastName}`.trim()
        : "System Admin",
    );
    return ["All", ...new Set(users)];
  }, [notifications]);

  const filteredNotifications = notifications.filter((note) => {
    const fullName =
      `${note.firstName} ${note.lastName}`.trim() || "System Admin";
    const noteDate = new Date(note.createdAt).toISOString().split("T")[0];
    const message = note.message.toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      message.includes(search) || fullName.toLowerCase().includes(search);
    const matchesUser = selectedUser === "All" || fullName === selectedUser;
    const matchesSource =
      selectedSource === "All" || note.source === selectedSource;
    const matchesDate =
      (!startDate || noteDate >= startDate) &&
      (!endDate || noteDate <= endDate);

    return matchesSearch && matchesUser && matchesSource && matchesDate;
  });

  return (
    // Default Font Family (Sans) is used here for a standard professional look
    <div className="bg-[#fcfcfd] min-h-screen py-10 font-sans antialiased text-slate-900">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Notifications
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor all system activities and logs.
            </p>
          </div>
          <div className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            <span className="text-xs font-medium text-slate-600">
              {filteredNotifications.length} entries found
            </span>
          </div>
        </div>

        {/* Filters Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="By name, message or batch..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-4 py-2 text-sm focus:bg-white focus:ring-1 focus:ring-slate-400 outline-none transition-all placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* User Filter */}
            {/* <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">User</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer focus:bg-white"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                {uniqueUsers.map((user, idx) => <option key={idx} value={user}>{user}</option>)}
              </select>
            </div> */}

            {isAdmin && (
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  User
                </label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer focus:bg-white"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  {uniqueUsers.map((user, idx) => (
                    <option key={idx} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Source Filter */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                Source
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer focus:bg-white"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
              >
                <option value="All">All Sources</option>
                <option value="Manage product">Manage Product</option>
                <option value="csv-import">CSV Import</option>
              </select>
            </div>
          </div>

          {/* Secondary Filters: Date Range */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">From</span>
                <input
                  type="date"
                  className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs outline-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">To</span>
                <input
                  type="date"
                  className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs outline-none"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedUser("All");
                setSelectedSource("All");
                setStartDate("");
                setEndDate("");
              }}
              className="text-xs font-medium text-slate-400 hover:text-slate-900 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Logs Table-like Cards */}
        <div className="space-y-2">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((note) => (
              <div
                key={note._id}
                className="bg-white border border-slate-200 px-5 py-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-slate-300"
              >
                <div className="flex items-start md:items-center gap-4">
                  {/* Visual Dot/Indicator */}
                  <div
                    className={`mt-1 md:mt-0 h-2 w-2 rounded-full shrink-0 ${note.source === "Manage product" ? "bg-purple-500" : "bg-blue-500"}`}
                  ></div>

                  <div>
                    <h3 className="text-[14px] font-medium text-slate-900 leading-tight">
                      {note.message.split("\n")[0]}
                    </h3>
                    <p className="text-[13px] text-slate-500 mt-1 line-clamp-1">
                      {note.message.includes("\n")
                        ? note.message.split("\n").slice(1).join(" ")
                        : "Activity completed successfully."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:gap-1">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">
                      {note.source}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      {note.firstName} {note.lastName}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                    {new Date(note.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-sm text-slate-400">No matching logs found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
