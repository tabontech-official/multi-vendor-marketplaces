// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";

// const LogsPage = () => {
//   const [batches, setBatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [role, setRole] = useState("");
//   useEffect(() => {
//     const token = localStorage.getItem("usertoken");

//     if (!token) return;

//     try {
//       const decoded = jwtDecode(token);

//       const userRole = decoded?.payLoad?.role;
//       const id = decoded?.payLoad?.userId;

//       setRole(userRole);

//       if (userRole === "Merchant") {
//         fetchUserBatches(id);
//       } else if (userRole === "Master Admin" || userRole === "Dev Admin") {
//         fetchAllBatches();
//       }
//     } catch (error) {
//       console.error("Token decode error:", error);
//     }
//   }, []);

//   const fetchUserBatches = async (id) => {
//     const userid = localStorage.getItem("userid");
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/product/batches/${userid}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
//           },
//         },
//       );

//       setBatches(res.data.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllBatches = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/product/batches`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
//         },
//       });

//       setBatches(res.data.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const navigate = useNavigate();
//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-semibold mb-4">Status & Logs</h1>

//       {/* Role Badge */}

//       {loading ? (
//         <p>Loading logs...</p>
//       ) : (
//         <div className="bg-white shadow rounded-lg overflow-x-auto">
//           <table className="min-w-full text-sm text-left">
//             <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
//               <tr>
//                 <th className="px-4 py-3">Batch No</th>
//                 <th className="px-4 py-3">File Name</th>
//                 <th className="px-4 py-3">Status</th>
//                 <th className="px-4 py-3">Total</th>
//                 <th className="px-4 py-3">Success</th>
//                 <th className="px-4 py-3">Failed</th>
//                 <th className="px-4 py-3">Created At</th>
//                 <th className="px-4 py-3">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {batches.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="text-center py-4 text-gray-500">
//                     No Batches Found
//                   </td>
//                 </tr>
//               ) : (
//                 batches.map((batch) => (
//                   <tr key={batch._id} className="border-t hover:bg-gray-50">
//                     <td className="px-4 py-3 font-medium">{batch.batchNo}</td>
//                     <td className="px-4 py-3">{batch.fileName}</td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`px-2 py-1 rounded text-xs font-semibold ${
//                           batch.status === "completed"
//                             ? "bg-green-100 text-green-700"
//                             : batch.status === "failed"
//                               ? "bg-red-100 text-red-700"
//                               : "bg-yellow-100 text-yellow-700"
//                         }`}
//                       >
//                         {batch.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">{batch.summary?.total || 0}</td>
//                     <td className="px-4 py-3 text-green-600">
//                       {batch.summary?.success || 0}
//                     </td>
//                     <td className="px-4 py-3 text-red-600">
//                       {batch.summary?.failed || 0}
//                     </td>
//                     <td className="px-4 py-3 text-gray-500">
//                       {new Date(batch.createdAt).toLocaleString()}
//                     </td>
//                     <td className="px-4 py-3">
//                       <button
//                         onClick={() => navigate(`/batch/${batch._id}`)}
//                         className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
//                       >
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LogsPage;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FiPackage, FiShoppingBag } from "react-icons/fi";

const LogsPage = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inventory");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userid");
  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userRole = decoded?.payLoad?.role;
      const id = decoded?.payLoad?.userId;

      if (userRole === "Merchant") {
        fetchUserBatches(id);
      } else {
        fetchAllBatches();
      }
    } catch (error) {
      console.error("Token decode error:", error);
    }
  }, []);

  const fetchUserBatches = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/product/batches/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
          },
        },
      );
      setBatches(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBatches = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/product/batches`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
        },
      });
      setBatches(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Filter Logic
  const inventoryBatches = batches.filter((b) => b.batchNo?.startsWith("INV-"));

  const productBatches = batches.filter((b) => !b.batchNo?.startsWith("INV-"));

  const displayedBatches =
    activeTab === "inventory" ? inventoryBatches : productBatches;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Status & Logs</h1>

    {/* Tabs */}
<div className="flex gap-4 mb-6">
  <button
    onClick={() => setActiveTab("inventory")}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      activeTab === "inventory"
        ? "bg-blue-600 text-white shadow-md"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    <FiPackage size={16} />
    Inventory Batches
  </button>

  <button
    onClick={() => setActiveTab("product")}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      activeTab === "product"
        ? "bg-blue-600 text-white shadow-md"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    <FiShoppingBag size={16} />
    Product Batches
  </button>
</div>

      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Batch No</th>
                <th className="px-4 py-3">File Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Success</th>
                <th className="px-4 py-3">Failed</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {displayedBatches.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No Batches Found
                  </td>
                </tr>
              ) : (
                displayedBatches.map((batch) => (
                  <tr key={batch._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{batch.batchNo}</td>
                    <td className="px-4 py-3">{batch.fileName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          batch.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : batch.status === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {batch.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{batch.summary?.total || 0}</td>
                    <td className="px-4 py-3 text-green-600">
                      {batch.summary?.success || 0}
                    </td>
                    <td className="px-4 py-3 text-red-600">
                      {batch.summary?.failed || 0}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(batch.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/batch/${batch._id}`)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LogsPage;
