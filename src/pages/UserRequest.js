// import React, { useEffect, useState } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import { HiOutlineRefresh } from "react-icons/hi";

// const RequestDetails = () => {
//   const { id } = useParams();
//   const { state } = useLocation();
//   const [request, setRequest] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetch(`http://localhost:5000/order/getCancellationRequestsByUserId/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           setRequest(data.data);
//         }
//         setIsLoading(false);
//       });
//   }, [id]);

//   return (
//     <div className="w-full max-sm:w-auto max-sm:flex items-center">
//         <div className="p-4">
//              <h2 className="text-center text-red-500 text-2xl font-bold mb-8">
//                     Cancellation Requests
//                   </h2>
//         </div>
        
                
//       {isLoading ? (
//         <div className="flex justify-center items-center py-10">
//           <HiOutlineRefresh className="animate-spin text-xl text-gray-500" />
//           loading...
//         </div>
//       ) : (
//         <div className="border rounded-lg w-full">
//           {/* <h2 className="text-lg font-semibold p-4">
//             Request by {state?.fullName || "User"} ({state?.email || ""})
//           </h2> */}

//           <table className="w-full border-collapse bg-white">
//             <thead className="bg-gray-100 text-left text-gray-600 text-sm">
//               <tr>
//                 <th className="p-3">Order No</th>
//                 <th className="p-3">Product Name</th>
//                 <th className="p-3">Request</th>
//                 <th className="p-3">Created</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Array.isArray(request?.productNames) &&
//                 request.productNames.map((product, i) => (
//                   <tr
//                     key={i}
//                     className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
//                   >
//                     <td className="p-3 text-blue-600 underline">{request.orderNo || request.orderId}</td>
//                     <td className="p-3">{product}</td>
//                     <td className="p-3">{request.request}</td>
//                     <td className="p-3">
//                       {new Date(request.createdAt).toLocaleDateString("en-US")}
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RequestDetails;

import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { HiOutlineRefresh } from "react-icons/hi";

const RequestDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/order/getCancellationRequestsByUserId/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRequest(data.data);
        }
        setIsLoading(false);
      });
  }, [id]);

 return (
  <div className="w-full px-4 max-w-6xl mx-auto mt-8">
    <div className="mb-6 text-center">
      <h2 className="text-3xl font-bold text-red-600 tracking-wide">
        Cancellation Requests
      </h2>
      <p className="text-gray-500 mt-1 text-sm">
        Below are the recent cancellation details.
      </p>
    </div>

    {isLoading ? (
      <div className="flex justify-center items-center py-10">
        <HiOutlineRefresh className="animate-spin text-2xl text-gray-400 mr-2" />
        <span className="text-gray-500">Loading...</span>
      </div>
    ) : (
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4 text-left">Order No</th>
              <th className="p-4 text-left">Product Name</th>
              <th className="p-4 text-left">Request</th>
              <th className="p-4 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(request?.productNames) &&
              request.productNames.map((product, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition border-b last:border-0"
                >
                  <td className="p-4 text-blue-600 underline font-medium">
                    {request.orderNo || request.orderId}
                  </td>
                  <td className="p-4">{product}</td>
                  <td className="p-4">{request.request}</td>
                  <td className="p-4 text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString("en-US")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

};

export default RequestDetails;
