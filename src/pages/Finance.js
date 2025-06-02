// import React, { useState, useEffect } from "react";
// import { CiCreditCard1 } from "react-icons/ci";
// import axios from "axios";

// const Finance = () => {
//   const [showPopup, setShowPopup] = useState(false);
//   const [paypalAccount, setPaypalAccount] = useState("");
//   const [loading, setLoading] = useState(false);
//   const merchantId = localStorage.getItem("userid");

//   useEffect(() => {
//     const fetchMerchant = async () => {
//       try {
//         const res = await axios.get(`https://multi-vendor-marketplace.vercel.app/auth/user/${merchantId}`);
//         const user = res.data;

//         if (user.role === "Dev Admin" || user.role === "Master Admin") {
//           setShowPopup(false);
//           return;
//         }

//         if (!user.paypalAccount) {
//           setShowPopup(true);
//         }
//       } catch (error) {
//         console.error("Failed to fetch user data:", error);
//         setShowPopup(true);
//       }
//     };

//     if (merchantId) {
//       fetchMerchant();
//     }
//   }, [merchantId]);

//   const handleClose = () => {
//     setShowPopup(false);
//   };

//   const handleSubmit = async () => {
//     if (!paypalAccount.trim()) {
//       alert("Please enter a valid PayPal account number");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post("https://multi-vendor-marketplace.vercel.app/order/addPaypal", {
//         payPal: paypalAccount,
//         merchantId: merchantId,
//       });

//       if (res.status === 200) {
//         alert("PayPal account saved successfully!");
//         setShowPopup(false);
//       } else {
//         alert("Failed to save PayPal account");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Something went wrong while saving PayPal account");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-3xl font-bold">Finance Page</h1>

//       {showPopup && (
//         <div className="fixed inset-0 bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fadeInUp p-8 relative border border-gray-200">
//             <button
//               className="absolute top-3 right-3 text-gray-400 hover:text-black transition"
//               onClick={handleClose}
//             >
//               ✕
//             </button>

//             <div className="text-center">
//               <div className="text-4xl mb-3 text-blue-600 flex justify-center">
//                 <CiCreditCard1 />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                 Activate Finance
//               </h2>
//               <p className="text-gray-600 mb-4">
//                 To activate finance, please enter your eligible PayPal account number.
//               </p>

//               <input
//                 type="text"
//                 value={paypalAccount}
//                 onChange={(e) => setPaypalAccount(e.target.value)}
//                 placeholder="Enter PayPal Account Number"
//                 className="w-full px-4 py-2 border rounded-lg mb-4"
//               />

//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full hover:opacity-90 transition"
//               >
//                 {loading ? "Saving..." : "Submit"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Finance;
import React, { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { CiCreditCard1 } from "react-icons/ci";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import UseFetchUserData from "../component/fetchUser";
import { useAuthContext } from "../Hooks/useAuthContext";
import { useNotification } from "../context api/NotificationContext";

const Finance = () => {
  const { addNotification } = useNotification();
  const { userData, loading } = UseFetchUserData();
  const [userRole, setUserRole] = useState("");

  const { user } = useAuthContext();

  const [searchVal, setSearchVal] = useState("");
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [paypalPopup, setPaypalPopup] = useState(false);
  const [paypalAccountInput, setPaypalAccountInput] = useState("");
  const [paypalLoading, setPaypalLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("price");

const [firstPayoutDate, setFirstPayoutDate] = useState("");
const [secondPayoutDate, setSecondPayoutDate] = useState("");

const handleSavePayoutDates = async () => {
  if (!firstPayoutDate || !secondPayoutDate) {
    alert("Please select both payout dates.");
    return;
  }

  try {
    const response = await fetch("https://multi-vendor-marketplace.vercel.app/order/addPayOutDates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstDate: firstPayoutDate,
        secondDate: secondPayoutDate,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Payout dates saved successfully.");
    } else {
      alert(`❌ Failed to save: ${data.message}`);
    }
  } catch (error) {
    console.error("Error saving payout dates:", error);
    alert("❌ Error while saving payout dates.");
  }
};

useEffect(() => {
  const fetchPayoutDates = async () => {
    try {
      const res = await fetch('https://multi-vendor-marketplace.vercel.app/order/getPayoutsDates');
      const data = await res.json();

      if (data.firstDate) setFirstPayoutDate(data.firstDate.slice(0, 10)); // convert ISO to yyyy-mm-dd
      if (data.secondDate) setSecondPayoutDate(data.secondDate.slice(0, 10));
    } catch (err) {
      console.error('Error fetching payout dates:', err);
    }
  };

  fetchPayoutDates();
}, []);

  // Detect Admin Role
  const isAdmin = () => {
    const token = localStorage.getItem("usertoken");
    if (token) {
      const decoded = jwtDecode(token);
      if (
        (decoded?.payLoad?.isAdmin || decoded?.payLoad?.role === "Dev Admin") &&
        decoded.exp * 1000 > Date.now()
      ) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (token) {
      const decoded = jwtDecode(token);
      const role = decoded?.payLoad?.role || "";
      setUserRole(role);
    }
  }, []);
  // Toast Function
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  // Check PayPal status
  useEffect(() => {
    const checkPaypalAccount = async () => {
      const userId = localStorage.getItem("userid");
      if (!userId || isAdmin()) return;

      try {
        const res = await axios.get(
          `https://multi-vendor-marketplace.vercel.app/auth/user/${userId}`
        );
        const user = res.data;
        const role = user?.role;

        if (role === "Dev Admin" || role === "Master Admin") return;

        if (!user?.paypalAccount) {
          setPaypalPopup(true);
        }
      } catch (error) {
        console.error("PayPal check failed:", error);
        setPaypalPopup(true); // fallback
      }
    };

    checkPaypalAccount();
  }, []);

  // Submit PayPal account
  const submitPaypalAccount = async () => {
    const userId = localStorage.getItem("userid");
    if (!paypalAccountInput.trim()) {
      return alert("Please enter your PayPal account.");
    }

    setPaypalLoading(true);
    try {
      const res = await axios.post("https://multi-vendor-marketplace.vercel.app/order/addPaypal", {
        merchantId: userId,
        payPal: paypalAccountInput,
      });

      if (res.status === 200) {
        setPaypalPopup(false);
        showToast("success", "PayPal account saved successfully!");
      } else {
        showToast("error", "Failed to save PayPal account.");
      }
    } catch (error) {
      console.error("Error saving PayPal:", error);
      showToast("error", "Something went wrong while saving PayPal account.");
    } finally {
      setPaypalLoading(false);
    }
  };

  return user ? (
    <main className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start border-gray-200 pb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">Finance</h1>
          <p className="text-gray-600">
            Here are your total Collection in Inventory.
          </p>
          <div className="w-2/4 max-sm:w-full mt-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="md:w-2/4 p-2 max-sm:w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
   <div className="flex space-x-4 mt-6 border-b pb-2">
        {(userRole === "Dev Admin" || userRole === "Master Admin") && (
          <>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === "payouts"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("payouts")}
            >
              Payouts
            </button>

            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === "Timelines"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("Timelines")}
            >
              Timelines
            </button>
          </>
        )}

        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "To be paid"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("To be paid")}
        >
          To be Paid
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "payouts" && (
          <div className="p-4">
            <table className="w-full border-collapse bg-white">
              <thead className="bg-gray-100 text-left text-gray-600 text-sm">
                <tr>
                  <th className="p-3">Payout Date</th>
                  <th className="p-3">Transaction Dates</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    payoutDate: "Jun 3, 2025",
                    transactionDates: "May 29 – Jun 2, 2025",
                    status: "Scheduled",
                    amount: "$7,418.70 CAD",
                  },
                  {
                    payoutDate: "Jun 2, 2025",
                    transactionDates: "May 28 – May 30, 2025",
                    status: "Deposited",
                    amount: "$8,674.72 CAD",
                  },
                ].map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.payoutDate}</td>
                    <td className="p-3">{item.transactionDates}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          item.status === "Scheduled"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium">
                      {item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "To be paid" && (
          <div className="p-4">
            <table className="w-full border-collapse bg-white">
              <thead className="bg-gray-100 text-left text-gray-600 text-sm">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Payout Date</th>
                  <th className="p-3">Payout Status</th>
                  <th className="p-3">Order</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-right">Fee</th>
                  <th className="p-3 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    date: "Jun 2, 2025",
                    payoutDate: "Jun 5, 2025",
                    status: "Pending",
                    order: "#4916",
                    type: "Charge",
                    method: "visa",
                    amount: "$399.01",
                    fee: "-$10.67",
                    net: "$388.34 CAD",
                  },
                  {
                    date: "Jun 2, 2025",
                    payoutDate: "Jun 5, 2025",
                    status: "Pending",
                    order: "#4915",
                    type: "Charge",
                    method: "mastercard",
                    amount: "$409.50",
                    fee: "-$10.95",
                    net: "$398.55 CAD",
                  },
                ].map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.date}</td>
                    <td className="p-3">{item.payoutDate}</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-blue-600 hover:underline cursor-pointer">
                      {item.order}
                    </td>
                    <td className="p-3">{item.type}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded font-medium ${
                          item.method === "visa"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {item.method === "visa" ? "Visa" : "Mastercard"}
                      </span>
                    </td>
                    <td className="p-3 text-right">{item.amount}</td>
                    <td className="p-3 text-right">{item.fee}</td>
                    <td className="p-3 text-right font-medium">{item.net}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

{activeTab === "Timelines" && (
  <div className="p-4">
    <h2 className="text-lg font-semibold mb-4 text-gray-700">Finance Timelines</h2>

    <div className="flex flex-col sm:flex-row gap-6 mb-6">
      <div>
        <label className="block text-sm text-gray-600 font-medium mb-1">Payout Date 1</label>
        <input
          type="date"
          className="border px-3 py-2 rounded-md text-sm"
          value={firstPayoutDate}
          onChange={(e) => setFirstPayoutDate(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 font-medium mb-1">Payout Date 2</label>
        <input
          type="date"
          className="border px-3 py-2 rounded-md text-sm"
          value={secondPayoutDate}
          onChange={(e) => setSecondPayoutDate(e.target.value)}
        />
      </div>
    </div>

    <div className="flex justify-end">
      <button
        onClick={handleSavePayoutDates}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
      >
        Save Payout Dates
      </button>
    </div>
  </div>
)}



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

      {paypalPopup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative border shadow-xl">
            <button
              onClick={() => setPaypalPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              ✕
            </button>
            <div className="text-center">
              <div className="text-4xl mb-3 text-blue-600 flex justify-center">
                <CiCreditCard1 />
              </div>
              <h2 className="text-xl font-bold mb-2">Activate Finance</h2>
              <p className="text-sm text-gray-600 mb-4">
                Please enter your eligible PayPal account to activate finance
                payouts.
              </p>
              <input
                type="text"
                value={paypalAccountInput}
                onChange={(e) => setPaypalAccountInput(e.target.value)}
                placeholder="PayPal Account"
                className="w-full px-4 py-2 border rounded-md mb-4"
              />
              <button
                onClick={submitPaypalAccount}
                disabled={paypalLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {paypalLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  ) : null;
};

export default Finance;
