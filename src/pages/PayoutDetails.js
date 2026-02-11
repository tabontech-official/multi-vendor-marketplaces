import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { HiOutlineRefresh } from "react-icons/hi";
import { jwtDecode } from "jwt-decode";
import { FaEdit, FaCheck, FaTimes, FaCog } from "react-icons/fa";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { FaPaypal, FaUniversity } from "react-icons/fa";
import { BsHash, BsPersonCircle, BsBank } from "react-icons/bs";
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
  const [paymentDate, setPaymentDate] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [merchantAccount, setMerchantAccount] = useState(null);

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    accountHolderName: "",
    bankName: "",
    ifscCode: "",
    branchName: "",
    swiftCode: "",
    iban: "",
    country: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (token) {
      const decoded = jwtDecode(token);
      const role = decoded?.payLoad?.role || "";
      setUserRole(role);

      if (role === "Merchant") {
        const userId = localStorage.getItem("userid");
        if (!userId) return;

        fetch(
          `https://multi-vendor-marketplace.vercel.app/auth/getMerchantAccountDetails/${userId}`,
        )
          .then((res) => res.json())
          .then((data) => {
            if (data?.data) {
              setMerchantAccount(data.data);
            }
          })
          .catch((err) =>
            console.error("Error fetching merchant account details:", err),
          );
      }
    }
  }, []);
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };
  const fetchSubscriptions = async () => {
    const userId = merchantId;
    const token = localStorage.getItem("usertoken");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    setIsLoading(true);

    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    try {
      const url = `https://multi-vendor-marketplace.vercel.app/order/order/${userId}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          "x-api-secret": apiSecretKey,
          "Content-Type": "application/json",
        },
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
        },
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
      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");
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
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserIds,
            referenceNo: tempReferenceNo,
          }),
        },
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!userRole) return;

  //     setLoading(true);

  //     try {
  //       let res;

  //       if (userRole === "Merchant") {
  //         res = await fetch(
  //           `https://multi-vendor-marketplace.vercel.app/order/getPayoutOrders?payoutDate=${encodeURIComponent(
  //             payoutDate
  //           )}&status=${status}&userId=${merchantId}`
  //         );
  //       } else if (userRole === "Master Admin" || userRole === "Dev Admin") {
  //         // res = await fetch(
  //         //   `https://multi-vendor-marketplace.vercel.app/order/getPayoutForAllOrders?payoutDate=${encodeURIComponent(
  //         //     payoutDate
  //         //   )}&status=${status}`
  //         res = await fetch(
  //           `https://multi-vendor-marketplace.vercel.app/order/getPayoutOrders?payoutDate=${encodeURIComponent(
  //             payoutDate
  //           )}&status=${status}&userId=${merchantId}`
  //         );
  //       } else {
  //         console.warn("Unauthorized user role:", userRole);
  //         setLoading(false);
  //         return;
  //       }

  //       const json = await res.json();

  //       const fetchedOrders =
  //         (json.payouts && json.payouts[0] && json.payouts[0].orders) || [];

  //       fetchedOrders.forEach((o) => {
  //         o.fee = Number((o.amount * 0.1).toFixed(2));
  //         o.net = Number((o.amount - o.fee).toFixed(2));
  //       });

  //       const charges = fetchedOrders.reduce(
  //         (sum, o) => sum + (o.amount || 0),
  //         0
  //       );
  //       const fees = fetchedOrders.reduce((sum, o) => sum + (o.fee || 0), 0);
  //       const refunds = fetchedOrders.reduce(
  //         (sum, o) => sum + (o.refund || 0),
  //         0
  //       );
  //       const net = charges - fees;
  //       const referenceNo = fetchedOrders[0]?.referenceNo || "";
  //       const paypalAccount = fetchedOrders[0]?.paypalAccount || "";

  //       setOrders(fetchedOrders);
  //       setSummary({ charges, refunds, fees, net, referenceNo, paypalAccount });
  //       setReferenceNo(referenceNo);
  //       setTempReferenceNo(referenceNo);
  //       setTempBankAccount(paypalAccount);
  //     } catch (err) {
  //       console.error("Error fetching payout orders:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (payoutDate && status && userRole) fetchData();
  // }, [payoutDate, status, userRole, merchantId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userRole || !payoutDate || !status) return;

      setLoading(true);

      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");

      if (!apiKey || !apiSecretKey) {
        console.error("Missing API credentials");
        setLoading(false);
        return;
      }

      try {
        let url = "";
        if (userRole === "Merchant") {
          url = `https://multi-vendor-marketplace.vercel.app/order/getPayoutByQuery?payoutDate=${encodeURIComponent(
            payoutDate,
          )}&status=${status}&userId=${merchantId}`;
        } else if (userRole === "Master Admin" || userRole === "Dev Admin") {
          url = `https://multi-vendor-marketplace.vercel.app/order/getAllPayouts?payoutDate=${encodeURIComponent(
            payoutDate,
          )}&status=${status}`;
        } else {
          console.warn("Unauthorized user role:", userRole);
          setLoading(false);
          return;
        }

        const res = await fetch(url, {
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.error(`Failed to fetch payout orders: ${res.status}`);
          setLoading(false);
          return;
        }

        const json = await res.json();
        const fetchedOrders = json?.payouts?.[0]?.orders || [];

        const updatedOrders = fetchedOrders.map((o) => {
  let gross = 0;
  let fee = 0;
  let net = 0;

  if (userRole === "Merchant") {
    // 🔹 MERCHANT VIEW (simple structure)
    gross = o.products?.reduce(
      (sum, p) => sum + Number(p.total || 0),
      0
    );

    fee = Number(o.commissionAmount || 0);

    net = Number(o.amount || 0);
  } else {
    // 🔹 ADMIN VIEW (full commission breakdown)
    gross = o.products?.reduce(
      (sum, p) => sum + Number(p.total || 0),
      0
    );

    fee = o.products?.reduce(
      (sum, p) => sum + Number(p.commissionAmount || 0),
      0
    );

    net = o.products?.reduce(
      (sum, p) => sum + Number(p.netAmount || 0),
      0
    );
  }

  return {
    ...o,
    gross,
    fee,
    net,
  };
});

        const payoutData = json?.payouts?.[0];

        setReferenceNo(payoutData?.referenceNo || "");
        setPaymentMethod(payoutData?.paymentMethod || "");
        setPaymentDate(
          payoutData?.depositedDate
            ? dayjs(payoutData.depositedDate).format("MMM D, YYYY")
            : "",
        );

        const charges = updatedOrders.reduce((s, o) => s + o.gross, 0);
        const fees = updatedOrders.reduce((s, o) => s + o.fee, 0);
        const refunds = updatedOrders.reduce((s, o) => s + (o.refund || 0), 0);
        const net = updatedOrders.reduce((s, o) => s + o.net, 0);

        setOrders(updatedOrders);
        setSummary({ charges, refunds, fees, net, referenceNo });
      } catch (err) {
        console.error("Error fetching payout orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [payoutDate, status, userRole, merchantId]);

  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState("");

  const openReferencePopup = () => setOpen(true);
  const closeReferencePopup = () => setOpen(false);
  const handleSave = async () => {
    try {
      if (!reference || !paymentMethod) {
        showToast("error", "Please enter reference and payment method");
        return;
      }

      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");

      // ✅ Collect unique merchantIds from orders
      const merchantIds = [
        ...new Set(
          orders.flatMap((order) =>
            order.products?.map((product) => product.userId),
          ),
        ),
      ].filter(Boolean);

      if (merchantIds.length === 0) {
        showToast("error", "No merchants found for this payout.");
        return;
      }

      const res = await fetch(
        "https://multi-vendor-marketplace.vercel.app/order/addReferenceNumber",
        {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payoutDate,
            status,
            referenceNo: reference,
            paymentMethod,
            merchantIds, // 🔥 important
          }),
        },
      );

      const result = await res.json();

      if (res.ok) {
        showToast("success", "Payout marked as Deposited!");
        closeReferencePopup();

        // 🔥 Better than window reload:
        setTimeout(() => {
          navigate(0); // refresh route cleanly
        }, 1000);
      } else {
        showToast("error", result.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Server error.");
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

  const handleSaveMerchantAccountDetails = async () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userid");
      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");

      if (!userId) {
        alert("User ID not found!");
        return;
      }

      const payload = {
        userId,
        method: paymentMethod,
        ...(paymentMethod === "paypal"
          ? {
              paypalDetails: {
                paypalAccount: paypalEmail,
                paypalAccountNo: "",
                paypalReferenceNo: "",
              },
            }
          : {
              bankDetails: {
                accountHolderName: bankDetails.accountHolderName,
                accountNumber: bankDetails.accountNumber,
                bankName: bankDetails.bankName,
                branchName: bankDetails.branchName,
                ifscCode: bankDetails.ifscCode,
                swiftCode: bankDetails.swiftCode,
                iban: bankDetails.iban,
                country: bankDetails.country,
              },
            }),
      };

      const res = await fetch(
        "https://multi-vendor-marketplace.vercel.app/auth/addMerchantAccountDetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (res.ok) {
        alert("Payout details saved successfully!");
        setIsDrawerOpen(false);
      } else {
        alert(data.message || "Failed to save details");
      }
    } catch (error) {
      console.error("Error saving payout:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#f6f6f7] min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 h-8 text-sm font-medium rounded-md shadow-sm"
        >
          ← Back
        </button>

        {(userRole === "Master Admin" || userRole === "Dev Admin") &&
          status !== "Deposited" && (
            <button
              className="bg-gray-400 border border-gray-300 hover:bg-gray-500 text-gray-800 px-3 h-8 text-sm font-medium rounded-md flex items-center gap-1.5 shadow-sm"
              onClick={openReferencePopup}
            >
              Process Payout
            </button>
          )}
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 
        ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Payment Settings</h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Body */}

        {/* Footer Save Button */}
        <div className="border-t px-4 py-3">
          <button
            onClick={handleSaveMerchantAccountDetails}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-5 mb-6 flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">
            ${summary.net.toFixed(2)} AUD
          </h1>
          {userRole === "Merchant" && merchantAccount && (
            <div className="text-sm text-gray-700 space-y-2">
              {merchantAccount.paypalAccount && (
                <p>
                  <strong>PayPal Account:</strong>{" "}
                  {merchantAccount.paypalAccount}
                </p>
              )}

              {merchantAccount.paypalAccountNo && (
                <p>
                  <strong>PayPal Account No:</strong>{" "}
                  {merchantAccount.paypalAccountNo}
                </p>
              )}

              {merchantAccount.paypalReferenceNo && (
                <p>
                  <strong>PayPal Reference No:</strong>{" "}
                  {merchantAccount.paypalReferenceNo}
                </p>
              )}

              {merchantAccount.bankDetails &&
                Object.keys(merchantAccount.bankDetails).length > 0 && (
                  <div className="mt-2 space-y-2">
                    {merchantAccount.bankDetails.bankName && (
                      <p>
                        <strong>Bank Name:</strong>{" "}
                        {merchantAccount.bankDetails.bankName}
                      </p>
                    )}
                    {merchantAccount.bankDetails.accountNumber && (
                      <p>
                        <strong>Account Number:</strong>{" "}
                        {merchantAccount.bankDetails.accountNumber}
                      </p>
                    )}
                    {merchantAccount.bankDetails.accountHolderName && (
                      <p>
                        <strong>Account Holder:</strong>{" "}
                        {merchantAccount.bankDetails.accountHolderName}
                      </p>
                    )}
                    {merchantAccount.bankDetails.ifscCode && (
                      <p>
                        <strong>IFSC:</strong>{" "}
                        {merchantAccount.bankDetails.ifscCode}
                      </p>
                    )}
                  </div>
                )}
            </div>
          )}

          {/* {(userRole === "Dev Admin" || userRole === "Master Admin") && ( */}
          {(referenceNo || paymentMethod || paymentDate) && (
            <div className="text-sm text-gray-700 space-y-3">
              {referenceNo && (
                <div className="flex items-center">
                  <strong className="w-40">Reference No:</strong>
                  <span className="bg-gray-100 px-3 py-1 rounded-md text-gray-800">
                    {referenceNo}
                  </span>
                </div>
              )}

              {paymentMethod && (
                <div className="flex items-center">
                  <strong className="w-40">Payment Method:</strong>
                  <span className="bg-gray-100 px-3 py-1 rounded-md text-gray-800">
                    {paymentMethod}
                  </span>
                </div>
              )}

              {paymentDate && (
                <div className="flex items-center">
                  <strong className="w-40">Deposited On:</strong>
                  <span className="bg-gray-100 px-3 py-1 rounded-md text-gray-800">
                    {paymentDate}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* )} */}
        </div>
        <div className="w-full md:w-[240px] border-l md:pl-6 mt-6 md:mt-0">
          <h2 className="text-sm font-semibold mb-2">Summary</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <p>Gross: ${summary.charges.toFixed(2)}</p>
            <p>Refunds: ${summary.refunds.toFixed(2)}</p>
            <p>Commission: ${summary.fees.toFixed(2)}</p>
            <p className="font-semibold">
              Net Payout: ${summary.net.toFixed(2)} AUD
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Order No</th>
              <th className="p-3">Status</th>
              <th className="p-3">Amount</th>

              <th className="p-3">Fee</th>
              <th className="p-3">Net</th>
            </tr>
          </thead>

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
                }, {}),
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

                      const firstMerchantId = order.products?.[0]?.userId;

                      navigate(`/order/${order.orderId}/${firstMerchantId}`, {
                        state: {
                          merchantId: firstMerchantId,
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
                      const products = order.products || [];

                      const hasUnfulfilled = products.some(
                        (p) =>
                          (p.fulfillment_status?.toLowerCase() ===
                            "unfulfilled" ||
                            p.fulfillment_status?.toLowerCase() ===
                              "unfullfilled") &&
                          !p.cancelled,
                      );

                      const allFulfilled = products.every(
                        (p) =>
                          p.fulfillment_status?.toLowerCase() === "fulfilled" &&
                          !p.cancelled,
                      );

                      const hasRefunded = products.some(
                        (p) => p.fulfillment_status === "cancelled",
                      );

                      let displayStatus = "Unknown";
                      let bgColorClass = "bg-gray-100 text-gray-600";

                      if (hasUnfulfilled) {
                        displayStatus = "Unfulfilled";
                        bgColorClass = "bg-yellow-100 text-yellow-700";
                      } else if (allFulfilled) {
                        displayStatus = "Fulfilled";
                        bgColorClass = "bg-green-100 text-green-700";
                      } else if (hasRefunded) {
                        displayStatus = "Refunded";
                        bgColorClass = "bg-red-100 text-red-700";
                      }

                      return (
                        <div
                          className={`inline-block px-2 py-1 text-xs font-medium rounded ${bgColorClass}`}
                        >
                          {displayStatus}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="p-3">${order.gross.toFixed(2)}</td>

                  <td className="p-3 text-red-600">${order.fee.toFixed(2)}</td>

                  <td className="p-3 text-green-700 font-semibold">
                    ${order.net.toFixed(2)} AUD
                  </td>
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
              <div className="text-3xl mb-3 text-blue-600">💳</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Complete Payout Details
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Enter payout reference and payment method details.
              </p>
            </div>

            {/* Reference Number */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">
                Reference Number
              </label>
              <input
                type="text"
                placeholder="e.g. TXN123456"
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Method</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="PayPal">PayPal</option>
                <option value="Stripe">Stripe</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={closeReferencePopup}
                className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
              >
                Confirm & Mark Deposited
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutDetails;
