// import React, { useEffect, useState } from "react";
// import { FaShoppingBasket } from "react-icons/fa";
// import { HiOutlineRefresh } from "react-icons/hi";
// import { useNavigate } from "react-router-dom";

// const ManageRequests = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [groupedData, setGroupedData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch("http://localhost:5000/order/getCancellationRequests")
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) setGroupedData(data.data);
//         setIsLoading(false);
//       })
//       .catch(() => setIsLoading(false));
//   }, []);

//   useEffect(() => {
//     const regex = new RegExp(searchTerm.trim(), "i");

//     const filtered = groupedData
//       .map(user => {
//         const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

//         const matchedRequests = user.requests.filter(
//           req =>
//             regex.test(req.orderNo) ||
//             regex.test(user.email) ||
//             regex.test(fullName)
//         );

//         return matchedRequests.length
//           ? { ...user, requests: matchedRequests }
//           : null;
//       })
//       .filter(Boolean);

//     setFilteredData(filtered);
//   }, [searchTerm, groupedData]);

//   const totalRequests = groupedData.reduce(
//     (sum, user) => sum + (user.requestCount || 0),
//     0
//   );

//   return (
//     <div className="p-6">
//       {/* Header */}
//      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-gray-200 pb-4 gap-4">

//   {/* Left: Title */}
//   <div className="flex-1 flex items-center gap-2">
//     <FaShoppingBasket className="text-gray-700" size={20} />
//     <div>
//       <h1 className="text-xl font-semibold text-gray-900 mb-0.5">
//         Cancellation Requests
//       </h1>
//       <p className="text-sm text-gray-500">
//         Manage cancellation requests here.
//       </p>
//     </div>
//   </div>

//   {/* Center: Search (same as dashboard) */}
//   <div className="flex-1 w-full max-w-sm mx-auto">
//     <input
//       type="text"
//       placeholder="Search by Order No, Name, or Email"
//       value={searchTerm}
//       onChange={(e) => setSearchTerm(e.target.value)}
//       className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
//     />
//   </div>

//   {/* Right: Total Requests */}
//   <div className="flex-1 flex justify-end">
//     <div className="bg-blue-100 text-blue-700 px-3 h-8 text-sm font-medium rounded-md flex items-center shadow-sm">
//       Total Requests: {totalRequests}
//     </div>
//   </div>

// </div>


//       {/* Search */}
    
//       {/* Table */}
//       {isLoading ? (
//         <div className="flex justify-center items-center py-10 text-gray-500">
//           <HiOutlineRefresh className="animate-spin mr-2 text-xl" />
//           Loading requests...
//         </div>
//       ) : (
//         <div className="overflow-auto border rounded-lg bg-white shadow-sm">
//           <table className="w-full">
//               <thead className="bg-gray-100 text-gray-600 text-sm  sticky top-0 text-left">
//               <tr>
//                 <th className="p-3">Order No</th>
//                 <th className="p-3">Placed On</th>
//                 <th className="p-3">Merchant Name</th>
//                 <th className="p-3">Merchant Email</th>
//                 <th className="p-3">Request</th>
//                 <th className="p-3">Products</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredData.length ? (
//                 filteredData.map((user, i) =>
//                   user.requests.map(req => (
//                     <tr
//                       key={req._id}
//                       className={`border-b ${
//                         i % 2 === 0 ? "bg-white" : "bg-gray-50"
//                       } hover:bg-gray-100`}
//                     >
//                       <td
//                         className="p-3 text-blue-600 cursor-pointer hover:underline"
//                         onClick={() =>
//                           navigate(`/user-requests/${req._id}`, {
//                             state: {
//                               userId: user._id,
//                               fullName: `${user.firstName} ${user.lastName}`,
//                               email: user.email,
//                             },
//                           })
//                         }
//                       >
//                         {req.orderNo}
//                       </td>

//                       <td className="p-3 text-sm">
//                         {new Date(req.createdAt).toLocaleDateString()}
//                       </td>

//                       <td className="p-3 text-sm">
//                         {user.firstName} {user.lastName}
//                       </td>

//                       <td className="p-3 text-sm">{user.email}</td>

//                       <td className="p-3 text-sm">
//                         {req.request || "—"}
//                       </td>

//                       <td className="p-3 text-sm">
//                         {req.productNames?.length || 0} items
//                       </td>
//                     </tr>
//                   ))
//                 )
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="text-center py-6 text-gray-500 text-sm"
//                   >
//                     No cancellation requests found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageRequests;
import React, { useEffect, useState } from "react";
import { 
  RiShoppingBasketLine, 
  RiSearchLine, 
  RiLoader4Line, 
  RiArrowRightUpLine, 
  RiStackLine,
  RiCalendarLine,
  RiMailLine,
  RiUserLine
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const ManageRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [groupedData, setGroupedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/order/getCancellationRequests")
      .then(res => res.json())
      .then(data => {
        if (data.success) setGroupedData(data.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const regex = new RegExp(searchTerm.trim(), "i");
    const filtered = groupedData
      .map(user => {
        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
        const matchedRequests = user.requests.filter(
          req =>
            regex.test(req.orderNo) ||
            regex.test(user.email) ||
            regex.test(fullName)
        );
        return matchedRequests.length ? { ...user, requests: matchedRequests } : null;
      })
      .filter(Boolean);
    setFilteredData(filtered);
  }, [searchTerm, groupedData]);

  const totalRequests = groupedData.reduce((sum, user) => sum + (user.requestCount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
      {/* --- Header Section --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <RiShoppingBasketLine size={24} />
            <span className="text-xs font-bold uppercase tracking-widest">Order Management</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Cancellation Requests</h1>
          <p className="text-sm text-gray-500 font-medium">Review and process merchant cancellation demands.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80 group">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search order, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Stats Badge */}
          <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <RiStackLine size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Total Active</p>
              <p className="text-sm font-bold text-gray-900 leading-none">{totalRequests} Requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Table Container --- */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-24 text-gray-400 gap-3">
            <RiLoader4Line className="animate-spin text-blue-500" size={40} />
            <p className="text-sm font-medium">Syncing database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Order Detail</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Requested On</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Merchant</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Reason/Request</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Items</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredData.length ? (
                  filteredData.map((user) =>
                    user.requests.map((req) => (
                      <tr key={req._id} className="group hover:bg-blue-50/30 transition-colors">
                        {/* Order Number */}
                        <td className="px-6 py-5">
                          <button
                            onClick={() => navigate(`/user-requests/${req._id}`, {
                              state: { userId: user._id, fullName: `${user.firstName} ${user.lastName}`, email: user.email }
                            })}
                            className="flex items-center gap-2 group/btn"
                          >
                            <span className="text-sm font-bold text-blue-600 group-hover/btn:underline decoration-2 underline-offset-4">
                              #{req.orderNo}
                            </span>
                            <RiArrowRightUpLine className="text-blue-400 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                          </button>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                            <RiCalendarLine className="text-gray-400" size={14} />
                            {new Date(req.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </td>

                        {/* Merchant */}
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                              <RiUserLine className="text-gray-400" size={14} /> {user.firstName} {user.lastName}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <RiMailLine className="text-gray-400" size={12} /> {user.email}
                            </span>
                          </div>
                        </td>

                        {/* Request Reason */}
                        <td className="px-6 py-5">
                          <p className="text-sm text-gray-600 max-w-xs truncate font-medium">
                            {req.request || <span className="text-gray-300 italic">No reason provided</span>}
                          </p>
                        </td>

                        {/* Product Count */}
                        <td className="px-6 py-5 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                            {req.productNames?.length || 0} Items
                          </span>
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <RiStackLine size={48} className="text-gray-300" />
                        <p className="text-sm font-semibold text-gray-500">No matching requests found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- Footer Info --- */}
        {!isLoading && filteredData.length > 0 && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Showing {filteredData.length} records • NexaSoft Admin System
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRequests;