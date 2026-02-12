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

        fetch(`https://multi-vendor-marketplace.vercel.app/auth/getMerchantAccountDetails/${userId}`)
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
      const res = await axios.post("https://multi-vendor-marketplace.vercel.app/order/addPaypal", {
        merchantIds,
        payPal: account,
      });

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
        if (
          userRole === "Merchant" ||
          userRole === "Dev Admin" ||
          userRole === "Master Admin"
        ) {
          url = `https://multi-vendor-marketplace.vercel.app/order/getPayoutByQuery?payoutDate=${encodeURIComponent(
            payoutDate,
          )}&status=${status}&userId=${merchantId}`;
        } else if (userRole === "Masters") {
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
        // ✅ IMPORTANT FIX
        if (json?.merchantAccount) {
          setMerchantAccount(json.merchantAccount);
        }

        const fetchedOrders = json?.payouts?.[0]?.orders || [];

        const updatedOrders = fetchedOrders.map((o) => {
          let gross = 0;
          let fee = 0;
          let net = 0;

          if (
            userRole === "Merchant" ||
            userRole === "Dev Admin" ||
            userRole === "Master Admin"
          ) {
            // 🔹 MERCHANT VIEW (simple structure)
            gross = o.products?.reduce(
              (sum, p) => sum + Number(p.total || 0),
              0,
            );

            fee = Number(o.commissionAmount || 0);

            net = Number(o.amount || 0);
          } else {
            // 🔹 ADMIN VIEW (full commission breakdown)
            gross = o.products?.reduce(
              (sum, p) => sum + Number(p.total || 0),
              0,
            );

            fee = o.products?.reduce(
              (sum, p) => sum + Number(p.commissionAmount || 0),
              0,
            );

            net = o.products?.reduce(
              (sum, p) => sum + Number(p.netAmount || 0),
              0,
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
      // const merchantIds = [
      //   ...new Set(
      //     orders.flatMap((order) =>
      //       order.products?.map((product) => product.userId),
      //     ),
      //   ),
      // ].filter(Boolean);

      // if (merchantIds.length === 0) {
      //   showToast("error", "No merchants found for this payout.");
      //   return;
      // }

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
            merchantIds: merchantId,
          }),
        },
      );

      const result = await res.json();

      if (res.ok) {
        showToast("success", "Payout marked as Deposited!");
        closeReferencePopup();
        navigate("/finance");
        setTimeout(() => {
          navigate(0);
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
  const [message, setMessage] = useState("");
  const handleNotifyMerchant = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://multi-vendor-marketplace.vercel.app/auth/send-finance-reminder/${merchantId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to notify merchant");
      }

      showToast("success", "Merchant notified successfully.");
    } catch (error) {
      showToast("error", error.message || "Failed to notify merchant.");
    } finally {
      setLoading(false); // ✅ always stop loading
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
          {(userRole === "Merchant" ||
            userRole === "Dev Admin" ||
            userRole === "Master Admin") && (
            <div className="text-sm text-gray-700 space-y-2">
              {(() => {
                const hasPayPal =
                  merchantAccount?.paypalAccount?.trim() ||
                  merchantAccount?.paypalAccountNo?.trim() ||
                  merchantAccount?.paypalReferenceNo?.trim();

                const hasBankDetails =
                  merchantAccount?.bankDetails &&
                  Object.values(merchantAccount.bankDetails).some(
                    (value) => value && value.toString().trim() !== "",
                  );

                const hasPayoutDetails = hasPayPal || hasBankDetails;

                // ================= IF DETAILS EXIST =================
                if (hasPayoutDetails) {
  return (
    <div className="space-y-3 text-sm">

      {merchantAccount.paypalAccount && (
        <div className="flex items-center gap-4">
          <label className="text-gray-600 font-medium w-40">
            PayPal Account
          </label>
          <input
            type="text"
            value={merchantAccount.paypalAccount}
            disabled
            className="w-64 bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 rounded-md text-sm"
          />
        </div>
      )}

      {merchantAccount.paypalAccountNo && (
        <div className="flex items-center gap-4">
          <label className="text-gray-600 font-medium w-40">
            PayPal Account No
          </label>
          <input
            type="text"
            value={merchantAccount.paypalAccountNo}
            disabled
            className="w-64 bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 rounded-md text-sm"
          />
        </div>
      )}

      {merchantAccount.paypalReferenceNo && (
        <div className="flex items-center gap-4">
          <label className="text-gray-600 font-medium w-40">
            PayPal Reference
          </label>
          <input
            type="text"
            value={merchantAccount.paypalReferenceNo}
            disabled
            className="w-64 bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 rounded-md text-sm"
          />
        </div>
      )}

      {hasBankDetails && (
        <>
          {merchantAccount.bankDetails.bankName && (
            <div className="flex items-center gap-4">
              <label className="text-gray-600 font-medium w-40">
                Bank Name
              </label>
              <input
                type="text"
                value={merchantAccount.bankDetails.bankName}
                disabled
                className="w-64 bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 rounded-md text-sm"
              />
            </div>
          )}

          {merchantAccount.bankDetails.accountNumber && (
            <div className="flex items-center gap-4">
              <label className="text-gray-600 font-medium w-40">
                Account No
              </label>
              <input
                type="text"
                value={merchantAccount.bankDetails.accountNumber}
                disabled
                className="w-64 bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 rounded-md text-sm"
              />
            </div>
          )}

          {merchantAccount.bankDetails.accountHolderName && (
            <div className="flex items-center gap-4">
              <label className="text-gray-600 font-medium w-40">
                Account Holder
              </label>
              <input
                type="text"
                value={merchantAccount.bankDetails.accountHolderName}
                disabled
                className="w-64 bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 rounded-md text-sm"
              />
            </div>
          )}

          {merchantAccount.bankDetails.ifscCode && (
            <div className="flex items-center gap-4">
              <label className="text-gray-600 font-medium w-40">
                IFSC
              </label>
              <input
                type="text"
                value={merchantAccount.bankDetails.ifscCode}
                disabled
                className="w-64 bg-gray-100 border border-gray-300 text-gray-700 px-2 py-1 rounded-md text-sm"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}


                if (userRole === "Merchant") {
                  return (
                    <p className="text-sm text-gray-600 mt-2">
                      You have not added your payout details yet. <br />
                      Please add your PayPal or Bank details in{" "}
                      <span
                        onClick={() => navigate("/finance-setting")}
                        className="text-blue-600 underline cursor-pointer hover:text-blue-700 font-medium"
                      >
                        Finance Settings
                      </span>{" "}
                      to receive your payouts.
                    </p>
                  );
                }

                return (
                  <p className="text-sm text-gray-600 mt-2">
                    This merchant has not added payment details yet. <br />
                    <span
                      onClick={() => handleNotifyMerchant()}
                      className="text-blue-600 underline cursor-pointer hover:text-blue-700 font-medium"
                    >
                      Remind Merchant to Add Details
                    </span>
                    .
                  </p>
                );
              })()}
            </div>
          )}
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
                    fething data...
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

                      navigate(`/order/${order.orderId}/${merchantId}`, {
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={closeReferencePopup}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Area */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Payout Review
                </h2>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Internal Processing
                </p>
              </div>
              <button
                onClick={closeReferencePopup}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <span className="text-xl font-light">✕</span>
              </button>
            </div>

            <div className="p-6">
              {/* TOP ROW: STATUS & REFERENCE */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 ml-1">
                    Current Status
                  </label>
                  <div className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-600 text-sm font-medium">
                    {status}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 ml-1">
                    Reference No.
                  </label>
                  <input
                    type="text"
                    placeholder="Enter ID..."
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

              {/* FINANCIAL SUMMARY CARD */}
              <div className="bg-gray-300 rounded-xl p-5 mb-6 text-white shadow-lg shadow-blue-900/10">
                <div className="flex justify-between text-xs text-slate-900 mb-1">
                  <span>Gross Revenue</span>
                  <span>${summary.charges.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-rose-500 mb-4 pb-4 border-b border-slate-700/50">
                  <span>Platform Commission</span>
                  <span>-${summary.fees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-slate-900">
                    Total Net Payout
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-slate-700 tracking-tight">
                      ${summary.net.toFixed(2)}
                    </span>
                    <span className="text-[10px] ml-1 text-slate-900 font-bold uppercase">
                      AUD
                    </span>
                  </div>
                </div>
              </div>

              {/* MERCHANT ACCOUNT DETAILS */}
              {merchantAccount && (
                <div className="mb-6">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 ml-1">
                    Destination Account
                  </label>
                  <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 shadow-sm">
                    {merchantAccount.paypalAccount && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center text-xs font-bold">
                          PP
                        </div>
                        <div className="text-sm">
                          <p className="text-slate-400 text-[10px] leading-none uppercase font-bold">
                            PayPal Email
                          </p>
                          <p className="font-medium text-slate-700">
                            {merchantAccount.paypalAccount}
                          </p>
                        </div>
                      </div>
                    )}

                    {merchantAccount.bankDetails?.bankName && (
                      <div className="flex items-center gap-3 pt-1">
                        <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded flex items-center justify-center text-xs font-bold">
                          BK
                        </div>
                        <div className="text-sm">
                          <p className="font-bold text-slate-700 leading-tight">
                            {merchantAccount.bankDetails.bankName}
                          </p>
                          <p className="text-slate-500 text-xs">
                            {merchantAccount.bankDetails.accountHolderName}<br/>  
                            {merchantAccount.bankDetails.accountNumber
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PAYMENT METHOD SELECTION */}
              <div className="mb-8">
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 ml-1">
                  Payout Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none bg-white cursor-pointer"
                >
                  <option value="">Select Method</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Stripe">Stripe</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                <button
                  onClick={closeReferencePopup}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="flex-[2] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-200 transition-all active:scale-[0.98]"
                >
                  Confirm & Mark Deposited
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
