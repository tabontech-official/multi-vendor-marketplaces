import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { HiOutlineRefresh } from "react-icons/hi";
import { jwtDecode } from "jwt-decode";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import axios from "axios";
const PayoutDetails = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const payoutDate = query.get("payoutDate");
  const status = query.get("status");
  const merchantId = query.get("merchantId");
  const [summary, setSummary] = useState({
    charges: 0,
    refunds: 0,
    fees: 0,
    net: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isEditingRef, setIsEditingRef] = useState(false);
  const [bankAccount, setBankAccount] = useState(summary.paypalAccount || "");
  const [referenceNo, setReferenceNo] = useState(summary.referenceNo || "");
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [paypalPopup, setPaypalPopup] = useState(false);
  const [tempBankAccount, setTempBankAccount] = useState(bankAccount);
  const [tempReferenceNo, setTempReferenceNo] = useState(referenceNo);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [subscriptions, setSubscriptions] = useState([]);
  const navigate = useNavigate();

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };
  const fetchSubscriptions = async () => {
    const userId = merchantId;
    const token = localStorage.getItem("usertoken");
    setIsLoading(true);

    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    try {
      const url = `https://multi-vendor-marketplace.vercel.app/order/order/${userId}`;

      const res = await fetch(url, {
        method: "GET",
      });

      if (res.ok) {
        const json = await res.json();

        // Check if it's an array, otherwise, just use the object directly
        const subscription =
          json.data && json.data[0] ? json.data[0] : json.data; // Use the first object or the object itself

        setSubscriptions(subscription); // Set as the subscription object instead of array
      } else {
        console.error("Failed to fetch subscriptions:", res.status);
      }
    } catch (error) {
      console.error("Error decoding token or fetching subscriptions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const saveBankAccount = async () => {
    setIsLoading(true);
    setPaypalLoading(true);

    const account = tempBankAccount.trim();

    if (!account) {
      setIsLoading(false);
      setPaypalLoading(false);
      return alert("Please enter your PayPal account.");
    }

    try {
      // Collect unique user IDs from orders
      const userIdsSet = new Set();

      orders.forEach((order) => {
        order.products?.forEach((product) => {
          if (product.userId) {
            userIdsSet.add(product.userId);
          }
        });
      });

      const merchantIds = Array.from(userIdsSet);

      if (merchantIds.length === 0) {
        setIsLoading(false);
        setPaypalLoading(false);
      }

      // Send PayPal update request
      const res = await axios.post(
        "https://multi-vendor-marketplace.vercel.app/order/addPaypal",
        {
          merchantIds,
          payPal: account,
        }
      );

      if (res.status === 200) {
        setBankAccount(account);
        setIsEditingBank(false);
        setPaypalPopup(false);
        showToast("success", "PayPal account saved for all merchants!");
      } else {
        showToast("error", "Failed to save PayPal account.");
      }
    } catch (error) {
      console.error("Error saving PayPal:", error);
      showToast("error", "Something went wrong while saving PayPal account.");
    } finally {
      setIsLoading(false);
      setPaypalLoading(false);
    }
  };

  const saveReferenceNo = async () => {
    setIsLoading(true);

    try {
      // Collect all unique userIds from orders
      const userIdsSet = new Set();

      orders.forEach((order) => {
        order.products?.forEach((product) => {
          if (product.userId) {
            userIdsSet.add(product.userId);
          }
        });
      });

      const UserIds = Array.from(userIdsSet);

      if (UserIds.length === 0) {
        showToast("error", "No user IDs found to update.");
        setIsLoading(false);
        return;
      }

      // Send reference number update to backend
      const res = await fetch(
        "https://multi-vendor-marketplace.vercel.app/order/addReferenceNumber",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserIds,
            referenceNo: tempReferenceNo,
          }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        setReferenceNo(tempReferenceNo);
        setIsEditingRef(false);
        showToast("success", "Reference number added successfully!");
        closeReferencePopup();
      } else {
        alert(result.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Failed to update reference numbers:", err);
      showToast("error", "Error occurred while updating reference numbers.");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBankEdit = () => {
    setTempBankAccount(bankAccount);
    setIsEditingBank(false);
  };

  const cancelRefEdit = () => {
    setTempReferenceNo(referenceNo);
    setIsEditingRef(false);
  };
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userRole) return;

      setLoading(true);

      try {
        let res;

        if (userRole === "Merchant") {
          res = await fetch(
            `https://multi-vendor-marketplace.vercel.app/order/getPayoutOrders?payoutDate=${encodeURIComponent(
              payoutDate
            )}&status=${status}&userId=${merchantId}`
          );
        } else if (userRole === "Master Admin" || userRole === "Dev Admin") {
          // res = await fetch(
          //   `https://multi-vendor-marketplace.vercel.app/order/getPayoutForAllOrders?payoutDate=${encodeURIComponent(
          //     payoutDate
          //   )}&status=${status}`
          res = await fetch(
            `https://multi-vendor-marketplace.vercel.app/order/getPayoutOrders?payoutDate=${encodeURIComponent(
              payoutDate
            )}&status=${status}&userId=${merchantId}`
          );
        } else {
          console.warn("Unauthorized user role:", userRole);
          setLoading(false);
          return;
        }

        const json = await res.json();

        const fetchedOrders =
          (json.payouts && json.payouts[0] && json.payouts[0].orders) || [];

        fetchedOrders.forEach((o) => {
          o.fee = Number((o.amount * 0.1).toFixed(2));
          o.net = Number((o.amount - o.fee).toFixed(2));
        });

        const charges = fetchedOrders.reduce(
          (sum, o) => sum + (o.amount || 0),
          0
        );
        const fees = fetchedOrders.reduce((sum, o) => sum + (o.fee || 0), 0);
        const refunds = fetchedOrders.reduce(
          (sum, o) => sum + (o.refund || 0),
          0
        );
        const net = charges - fees;
        const referenceNo = fetchedOrders[0]?.referenceNo || "";
        const paypalAccount = fetchedOrders[0]?.paypalAccount || "";

        setOrders(fetchedOrders);
        setSummary({ charges, refunds, fees, net, referenceNo, paypalAccount });
        setReferenceNo(referenceNo);
        setTempReferenceNo(referenceNo);
        setTempBankAccount(paypalAccount);
      } catch (err) {
        console.error("Error fetching payout orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (payoutDate && status && userRole) fetchData();
  }, [payoutDate, status, userRole, merchantId]);

  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState("");

  const openReferencePopup = () => setOpen(true);
  const closeReferencePopup = () => setOpen(false);
  const handleSave = async () => {
    try {
      const userIdsSet = new Set();

      orders.forEach((order) => {
        order.products?.forEach((product) => {
          if (product.userId) {
            userIdsSet.add(product.userId);
          }
        });
      });

      const UserIds = Array.from(userIdsSet);

      if (UserIds.length === 0) {
        showToast("error", "No user IDs found to update.");
        return;
      }

      const res = await fetch(
        "https://multi-vendor-marketplace.vercel.app/order/addReferenceNumber",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserIds,
            referenceNo: reference,
          }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        showToast("success", "Reference number added successfully!");
        closeReferencePopup();
      } else {
        showToast("error", "Something went wrong.");
      }
    } catch (err) {
      console.error("Failed to update reference numbers:", err);
      alert("Error occurred while updating reference numbers.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (token) {
      const decoded = jwtDecode(token);
      const role = decoded?.payLoad?.role || "";
      setUserRole(role);
    }
  }, []);
  return (
    <div className="p-6 bg-[#f6f6f7] min-h-screen">
      <div className="flex justify-end mb-2">
        {(userRole === "Master Admin" || userRole === "Dev Admin") && (
          <button
            className="bg-white px-3 py-2 text-sm border border-gray-300 rounded-xl"
            onClick={openReferencePopup}
          >
            Add reference
          </button>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-5 mb-6 flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">
            ${summary.net.toFixed(2)} AUD
          </h1>
          {userRole === "Merchant" && (
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Bank account:</strong> {summary.paypalAccount}
              </p>
              <p>
                <strong>Bank reference:</strong> {summary.referenceNo}
              </p>
            </div>
          )}
          {/* <p className="text-gray-500 mb-4">Shopify Payments</p> */}
          {/* <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Bank account:</strong> PayPal
            </p>
            <p>
              <strong>Bank reference:</strong> {summary.referenceNo}
            </p>
          </div> */}
          {(userRole === "Dev Admin" || userRole === "Master Admin") && (
            <div className="text-sm text-gray-600 space-y-4">
              <div className="flex items-center">
                <strong className="w-40">Bank account:</strong>
                <div className="relative w-64 flex items-center">
                  <input
                    type="text"
                    value={tempBankAccount}
                    readOnly={!isEditingBank || isLoading}
                    onChange={(e) => setTempBankAccount(e.target.value)}
                    className={`w-full text-sm px-2 py-1 border border-gray-300 rounded-md ${
                      isEditingBank && !isLoading ? "bg-white" : "bg-gray-100"
                    } text-black pr-12`}
                  />

                  <div className="absolute right-2 flex gap-1 items-center">
                    {!isEditingBank ? (
                      <FaEdit
                        className="text-gray-400 cursor-pointer"
                        onClick={() => !isLoading && setIsEditingBank(true)}
                      />
                    ) : (
                      <>
                        <button
                          className="text-green-600 text-sm flex items-center justify-center"
                          disabled={isLoading}
                          onClick={saveBankAccount}
                        >
                          {isLoading ? (
                            <svg
                              className="animate-spin h-4 w-4 text-green-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              />
                            </svg>
                          ) : (
                            "✔"
                          )}
                        </button>
                        <button
                          className="text-red-600 text-sm"
                          disabled={isLoading}
                          onClick={() => {
                            setTempBankAccount(bankAccount);
                            setIsEditingBank(false);
                          }}
                        >
                          ✖
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <strong className="w-40">Bank reference:</strong>
                <div className="relative w-64 flex items-center">
                  <input
                    type="text"
                    value={isEditingRef ? tempReferenceNo : referenceNo}
                    readOnly={!isEditingRef || isLoading}
                    onChange={(e) => setTempReferenceNo(e.target.value)}
                    className={`w-full text-sm px-2 py-1 border border-gray-300 rounded-md ${
                      isEditingRef && !isLoading ? "bg-white" : "bg-gray-100"
                    } text-black pr-12`}
                  />

                  <div className="absolute right-2 flex gap-1 items-center">
                    {!isEditingRef ? (
                      <FaEdit
                        className="text-gray-400 cursor-pointer"
                        onClick={() => !isLoading && setIsEditingRef(true)}
                      />
                    ) : (
                      <>
                        <button
                          className="text-green-600 text-sm flex items-center justify-center"
                          disabled={isLoading}
                          onClick={saveReferenceNo}
                        >
                          {isLoading ? (
                            <svg
                              className="animate-spin h-4 w-4 text-green-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              />
                            </svg>
                          ) : (
                            "✔"
                          )}
                        </button>
                        <button
                          className="text-red-600 text-sm"
                          disabled={isLoading}
                          onClick={() => {
                            setTempReferenceNo(referenceNo);
                            setIsEditingRef(false);
                          }}
                        >
                          ✖
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-full md:w-[240px] border-l md:pl-6 mt-6 md:mt-0">
          <h2 className="text-sm font-semibold mb-2">Summary</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <p>Charges: ${summary.charges.toFixed(2)}</p>
            <p>Refunds: ${summary.refunds.toFixed(2)}</p>
            <p>Fees: ${summary.fees.toFixed(2)}</p>
            {/* <p>
              Net charges: $
              {summary.charges.toFixed(2) - summary.fees.toFixed(2)}
            </p> */}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Order No</th>
              <th className="p-3">Status</th>

              <th className="p-3">Fee</th>
              <th className="p-3">Net</th>
            </tr>
          </thead>
          {/* <tbody>
            {orders.length > 0 ? (
              orders.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {dayjs(item.createdAt).format("MMM D, YYYY")}
                  </td>
                  <td className="p-3 text-blue-600 underline cursor-pointer">
                    #{item.shopifyOrderNo}
                  </td>
                  <td className="p-3">${item.amount.toFixed(2)}</td>
                  <td className="p-3">${item.fee.toFixed(2)}</td>
                  <td className="p-3">${item.net.toFixed(2)} AUD</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No orders found for this payout.
                </td>
              </tr>
            )}
          </tbody> */}

          {/* <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500">
                  <div className="inline-flex items-center gap-2 justify-center">
                    <HiOutlineRefresh className="animate-spin text-xl" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : orders.length > 0 ? (
              Object.values(
                orders.reduce((acc, order) => {
                  if (!acc[order.shopifyOrderNo]) {
                    acc[order.shopifyOrderNo] = { ...order, total: 0 };
                  }
                  order.products.forEach((product) => {
                    acc[order.shopifyOrderNo].total += product.total;
                  });
                  return acc;
                }, {})
              ).map((order, i) => (
                <tr
                  key={i}
                  className={`border-b hover:bg-gray-50 ${
                    order.products.some((product) => product.cancelled)
                      ? "line-through text-gray-400"
                      : ""
                  }`}
                >
                  <td className="p-3">
                    {dayjs(order.createdAt).format("MMM D, YYYY")}
                  </td>

                  <td
                    className="p-3 text-blue-600 hover:underline cursor-pointer"
                    onClick={() => {
                      console.log("Navigating with state:", {
                        merchantId,
                        shopifyOrderId: order.orderId,
                        serialNo: order.orderId,
                        order: subscriptions,
                      });

                      navigate(`/order/${order.orderId}`, {
                        state: {
                          merchantId,
                          shopifyOrderId: order.orderId,
                          serialNo: order.orderId,
                          order: subscriptions,
                        },
                      });
                    }}
                  >
                    #{order.shopifyOrderNo}
                  </td>
                  <td className="p-3">
                    {order?.products?.map((product, index) => {
                      let fulfillmentStatus = product.fulfillment_status;

                      if (fulfillmentStatus === "cancelled") {
                        fulfillmentStatus = "Refunded";
                      }

                      const uniqueStatuses = new Set();

                      if (!uniqueStatuses.has(fulfillmentStatus)) {
                        uniqueStatuses.add(fulfillmentStatus);
                      }

                      let bgColorClass = "";

                      if (fulfillmentStatus === "Unfullfilled") {
                        bgColorClass = "bg-yellow-100 text-yellow-700";
                      } else if (fulfillmentStatus === "Refunded") {
                        bgColorClass = "bg-red-100 text-red-700";
                      } else if (fulfillmentStatus === "Deposited") {
                        bgColorClass = "bg-green-100 text-green-700";
                      } else {
                        bgColorClass = "bg-gray-100 text-gray-600";
                      }

                      return (
                        <div
                          key={index}
                          className={`inline-block px-2 py-1 text-xs font-medium rounded ${bgColorClass}`}
                        >
                          {fulfillmentStatus}
                        </div>
                      );
                    })}
                  </td>
                  <td className="p-3">${(order.total * 0.1).toFixed(2)}</td>
                  <td className="p-3">${(order.total * 0.9).toFixed(2)} AUD</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No orders found for this payout.
                </td>
              </tr>
            )}
          
        </tbody> */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500">
                  <div className="inline-flex items-center gap-2 justify-center">
                    <HiOutlineRefresh className="animate-spin text-xl" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : orders.length > 0 ? (
              Object.values(
                orders.reduce((acc, order) => {
                  if (!acc[order.shopifyOrderNo]) {
                    acc[order.shopifyOrderNo] = { ...order, total: 0 };
                  }
                  order.products.forEach((product) => {
                    acc[order.shopifyOrderNo].total += product.total;
                  });
                  return acc;
                }, {})
              ).map((order, i) => (
                <tr
                  key={i}
                  className={`border-b hover:bg-gray-50 ${
                    order.products.some((product) => product.cancelled)
                      ? "line-through text-gray-400"
                      : ""
                  }`}
                >
                  <td className="p-3">
                    {dayjs(order.createdAt).format("MMM D, YYYY")}
                  </td>

                  <td
                    className="p-3 text-blue-600 hover:underline cursor-pointer"
                    onClick={() => {
                      console.log("Navigating with state:", {
                        merchantId,
                        shopifyOrderId: order.orderId,
                        serialNo: order.orderId,
                        order: subscriptions,
                      });

                      navigate(`/order/${order.orderId}`, {
                        state: {
                          merchantId,
                          shopifyOrderId: order.orderId,
                          serialNo: order.orderId,
                          order: subscriptions,
                        },
                      });
                    }}
                  >
                    #{order.shopifyOrderNo}
                  </td>

                  <td className="p-3">
                    {(() => {
                      const uniqueStatuses = new Set();
                      order.products.forEach((product) => {
                        let fulfillmentStatus = product.fulfillment_status;

                        if (fulfillmentStatus === "cancelled") {
                          fulfillmentStatus = "Refunded";
                        }

                        uniqueStatuses.add(fulfillmentStatus);
                      });

                      return [...uniqueStatuses].map((status, idx) => {
                        let bgColorClass = "";
                        if (status === "Unfullfilled") {
                          bgColorClass = "bg-yellow-100 text-yellow-700";
                        } else if (status === "Refunded") {
                          bgColorClass = "bg-red-100 text-red-700";
                        } else if (status === "Deposited") {
                          bgColorClass = "bg-green-100 text-green-700";
                        } else {
                          bgColorClass = "bg-gray-100 text-gray-600";
                        }

                        return (
                          <div
                            key={idx}
                            className={`inline-block px-2 py-1 text-xs font-medium rounded ${bgColorClass}`}
                          >
                            {status}
                          </div>
                        );
                      });
                    })()}
                  </td>

                  <td className="p-3">${(order.total * 0.1).toFixed(2)}</td>
                  <td className="p-3">${(order.total * 0.9).toFixed(2)} AUD</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No orders found for this payout.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {toast.show && (
        <div
          className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {toast.type === "success" ? (
            <HiOutlineCheckCircle className="w-6 h-6 mr-2" />
          ) : (
            <HiOutlineXCircle className="w-6 h-6 mr-2" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
      {open && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeReferencePopup}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fadeInUp p-8 relative border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeReferencePopup}
              className="absolute top-3 right-3 text-gray-400 hover:text-black transition"
            >
              ✕
            </button>

            <div className="text-center">
              <div className="text-3xl mb-3 text-blue-600">🏷️</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Add Reference
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Enter the bank reference number for this payout group.
              </p>

              <input
                type="text"
                placeholder="e.g. 12345678"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition mb-6"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />

              <div className="flex justify-center gap-4">
                <button
                  onClick={closeReferencePopup}
                  className="px-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutDetails;
