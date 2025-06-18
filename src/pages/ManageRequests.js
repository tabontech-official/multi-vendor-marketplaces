import React, { useEffect, useState, useRef } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import { CreateCheckoutUrl } from "../component/Checkout";
import UseFetchUserData from "../component/fetchUser";
import { HiOutlineRefresh } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ManageRequests = () => {
  const { userData, loading, error, variantId } = UseFetchUserData();



  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);


  const [groupedData, setGroupedData] = useState([]);

useEffect(() => {
  fetch("https://multi-vendor-marketplace.vercel.app/order/getCancellationRequests")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setGroupedData(data.data);
      }
      setIsLoading(false);
    })
    .catch((err) => {
      console.error("API error:", err);
      setIsLoading(false);
    });
}, []);
const totalRequests = groupedData.reduce(
  (sum, user) => sum + (user.requestCount || 0),
  0
);
  return (
    <div
      className={`flex flex-col bg-gray-50 px-3 py-6 ${
        isDialogOpen ? "blur-background" : ""
      }`}
    >
      <div className="flex">
        <div className="pt-4 min-w-full px-3 bg-white shadow-lg rounded-lg">
          <h2 className="text-center text-red-500 text-2xl font-bold mb-8">
            Cancellation Requests
          </h2>

          <div className="flex justify-between mb-6">
            <div className="flex flex-row flex-wrap items-center">
              <div className="bg-blue-100 p-2 mr-3 rounded-lg shadow-md max-sm:mb-2">
                <span className="font-bold text-green-600">
                  Total Requests: {totalRequests}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full  max-sm:w-auto  max-sm:flex items-center">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <HiOutlineRefresh className="animate-spin text-xl text-gray-500" />
                loading...
              </div>
            ) : (
              <div className="max-sm:overflow-auto border rounded-lg">
                <table className="w-full border-collapse bg-white">
                  <thead className="bg-gray-100 text-left text-gray-600 text-sm">
                    <tr>
                      <th scope="col" className="p-3">
                        #
                      </th>
                      <th scope="col" className="p-3">
                        Placed On
                      </th>

                      <th scope="col" className="p-3">
                        Merchant Name
                      </th>
                      <th scope="col" className="p-3">
                        Merchnat Email
                      </th>
                      <th scope="col" className="p-3">
                        Request
                      </th>
                      <th scope="col" className="p-3">
                        Products
                      </th>
                      {/* <th scope="col" className="p-3">
                        Address
                      </th>
                      <th scope="col" className="p-3">
                        Country
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {groupedData.map((user, userIndex) =>
                      user.requests.map((req, reqIndex) => (
                        <tr
                          key={`${req._id}-${req.orderId}`}
                          className={`border-b ${
                            userIndex % 2 === 0 ? "bg-white" : "bg-gray-100"
                          }`}
                        >
                          <td
                            className="p-3 cursor-pointer text-blue-600 hover:underline"
                            onClick={() => {
                              console.log("Going to:", req._id);
                              navigate(`/user-requests/${req._id}`, {
                                state: {
                                  userId: user._id,
                                  fullName: `${user.firstName} ${user.lastName}`,
                                  email: user.email,
                                },
                              });
                            }}
                          >
                            {req.orderNo || "N/A"}
                          </td>{" "}
                          <td className="p-3">
                            {req.createdAt
                              ? new Date(req.createdAt).toLocaleDateString(
                                  "en-US"
                                )
                              : "N/A"}
                          </td>
                          <td className="p-3 text-sm">
                            {`${user.firstName || ""} ${user.lastName || ""}`}
                          </td>
                          <td className="p-3 text-sm">{user.email || "N/A"}</td>
                          <td className="p-3 text-sm">{req.request || "—"}</td>
                          <td className="p-3 text-sm">
                            {Array.isArray(req.productNames)
                              ? `${req.productNames.length} item${
                                  req.productNames.length !== 1 ? "s" : ""
                                }`
                              : "0 items"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRequests;
