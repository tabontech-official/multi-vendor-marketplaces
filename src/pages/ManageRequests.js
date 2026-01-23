// import React, { useEffect, useState, useRef } from "react";
// import { FaShoppingBasket } from "react-icons/fa";
// import { Dialog } from "@headlessui/react";
// import { FaTimes } from "react-icons/fa";
// import { CreateCheckoutUrl } from "../component/Checkout";
// import UseFetchUserData from "../component/fetchUser";
// import { HiOutlineRefresh } from "react-icons/hi";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// const ManageRequests = () => {
//   const { userData, loading, error, variantId } = UseFetchUserData();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [groupedData, setGroupedData] = useState([]);

//   useEffect(() => {
//     const regex = new RegExp(searchTerm.trim(), "i");

//     const filtered = groupedData
//       .map((user) => {
//         const fullName = `${user.firstName || ""} ${
//           user.lastName || ""
//         }`.trim();
//         const matchedRequests = user.requests.filter(
//           (req) =>
//             regex.test(req.orderNo) ||
//             regex.test(user.email) ||
//             regex.test(fullName)
//         );

//         return matchedRequests.length > 0
//           ? { ...user, requests: matchedRequests }
//           : null;
//       })
//       .filter(Boolean);

//     setFilteredData(filtered);
//   }, [searchTerm, groupedData]);

//   const navigate = useNavigate();
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const dialogRef = useRef(null);

//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetch(
//       "https://multi-vendor-marketplace.vercel.app/order/getCancellationRequests"
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           setGroupedData(data.data);
//         }
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         console.error("API error:", err);
//         setIsLoading(false);
//       });
//   }, []);
//   const totalRequests = groupedData.reduce(
//     (sum, user) => sum + (user.requestCount || 0),
//     0
//   );
//   return (
//     <div
//       className={`flex flex-col bg-gray-50 px-3 py-6 ${
//         isDialogOpen ? "blur-background" : ""
//       }`}
//     >
//       <div className="flex">
//         <div className="pt-4 min-w-full px-3 bg-white shadow-lg rounded-lg">
//           <h2 className="text-center text-red-500 text-2xl font-bold mb-8">
//             Cancellation Requests
//           </h2>

//           <div className="flex justify-between mb-6">
//             <div className="flex flex-row flex-wrap items-center">
//               <div className="bg-blue-100 p-2 mr-3 rounded-lg shadow-md max-sm:mb-2">
//                 <span className="font-bold text-green-600">
//                   Total Requests: {totalRequests}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div className="mb-4">
//             <input
//               type="text"
//               // placeholder="Search by Order No, Name, or Email"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full md:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             />
//           </div>

//           <div className="w-full  max-sm:w-auto  max-sm:flex items-center">
//             {isLoading ? (
//               <div className="flex justify-center items-center py-10">
//                 <HiOutlineRefresh className="animate-spin text-xl text-gray-500" />
//                 loading...
//               </div>
//             ) : (
//               <div className="max-sm:overflow-auto border rounded-lg">
//                 <table className="w-full border-collapse bg-white">
//                   <thead className="bg-gray-100 text-left text-gray-600 text-sm">
//                     <tr>
//                       <th scope="col" className="p-3">
//                         #
//                       </th>
//                       <th scope="col" className="p-3">
//                         Placed On
//                       </th>

//                       <th scope="col" className="p-3">
//                         Merchant Name
//                       </th>
//                       <th scope="col" className="p-3">
//                         Merchnat Email
//                       </th>
//                       <th scope="col" className="p-3">
//                         Request
//                       </th>
//                       <th scope="col" className="p-3">
//                         Products
//                       </th>
//                       {/* <th scope="col" className="p-3">
//                         Address
//                       </th>
//                       <th scope="col" className="p-3">
//                         Country
//                       </th> */}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredData.map((user, userIndex) =>
//                       user.requests.map((req, reqIndex) => (
//                         <tr
//                           key={`${req._id}-${req.orderId}`}
//                           className={`border-b ${
//                             userIndex % 2 === 0 ? "bg-white" : "bg-gray-100"
//                           }`}
//                         >
//                           <td
//                             className="p-3 cursor-pointer text-blue-600 hover:underline"
//                             onClick={() => {
//                               console.log("Going to:", req._id);
//                               navigate(`/user-requests/${req._id}`, {
//                                 state: {
//                                   userId: user._id,
//                                   fullName: `${user.firstName} ${user.lastName}`,
//                                   email: user.email,
//                                 },
//                               });
//                             }}
//                           >
//                             {req.orderNo || "N/A"}
//                           </td>{" "}
//                           <td className="p-3">
//                             {req.createdAt
//                               ? new Date(req.createdAt).toLocaleDateString(
//                                   "en-US"
//                                 )
//                               : "N/A"}
//                           </td>
//                           <td className="p-3 text-sm">
//                             {`${user.firstName || ""} ${user.lastName || ""}`}
//                           </td>
//                           <td className="p-3 text-sm">{user.email || "N/A"}</td>
//                           <td className="p-3 text-sm">{req.request || "—"}</td>
//                           <td className="p-3 text-sm">
//                             {Array.isArray(req.productNames)
//                               ? `${req.productNames.length} item${
//                                   req.productNames.length !== 1 ? "s" : ""
//                                 }`
//                               : "0 items"}
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageRequests;
import React, { useEffect, useState } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { HiOutlineRefresh } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const ManageRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [groupedData, setGroupedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://multi-vendor-marketplace.vercel.app/order/getCancellationRequests")
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

        return matchedRequests.length
          ? { ...user, requests: matchedRequests }
          : null;
      })
      .filter(Boolean);

    setFilteredData(filtered);
  }, [searchTerm, groupedData]);

  const totalRequests = groupedData.reduce(
    (sum, user) => sum + (user.requestCount || 0),
    0
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b">
        <div className="flex items-center gap-2">
          <FaShoppingBasket className="text-gray-700" size={24} />
          <h1 className="text-2xl font-semibold text-gray-800">
            Cancellation Requests
          </h1>
        </div>

        <div className="h-10 min-w-[180px] bg-blue-100 text-blue-700 px-4 flex items-center justify-center rounded-md font-medium">
          Total Requests: {totalRequests}
        </div>
      </div>

      {/* Search */}
      <div className="mt-4 mb-4">
        <input
          type="text"
          placeholder="Search by Order No, Name, or Email"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 px-4 py-2 rounded-md focus:ring focus:ring-blue-100"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10 text-gray-500">
          <HiOutlineRefresh className="animate-spin mr-2 text-xl" />
          Loading requests...
        </div>
      ) : (
        <div className="overflow-auto border rounded-lg bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-100 text-left text-gray-600 text-sm">
              <tr>
                <th className="p-3">Order No</th>
                <th className="p-3">Placed On</th>
                <th className="p-3">Merchant Name</th>
                <th className="p-3">Merchant Email</th>
                <th className="p-3">Request</th>
                <th className="p-3">Products</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length ? (
                filteredData.map((user, i) =>
                  user.requests.map(req => (
                    <tr
                      key={req._id}
                      className={`border-b ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100`}
                    >
                      <td
                        className="p-3 text-blue-600 cursor-pointer hover:underline"
                        onClick={() =>
                          navigate(`/user-requests/${req._id}`, {
                            state: {
                              userId: user._id,
                              fullName: `${user.firstName} ${user.lastName}`,
                              email: user.email,
                            },
                          })
                        }
                      >
                        {req.orderNo}
                      </td>

                      <td className="p-3 text-sm">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-3 text-sm">
                        {user.firstName} {user.lastName}
                      </td>

                      <td className="p-3 text-sm">{user.email}</td>

                      <td className="p-3 text-sm">
                        {req.request || "—"}
                      </td>

                      <td className="p-3 text-sm">
                        {req.productNames?.length || 0} items
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No cancellation requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageRequests;
