// import { NavLink } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import { FaUser, FaPaypal, FaUniversity } from "react-icons/fa";
// import { IoSettings } from "react-icons/io5";
// import { MdManageAccounts } from "react-icons/md";
// import { jwtDecode } from "jwt-decode";
// import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
// import SettingsSidebar from "../component/SettingsSidebar";

// const FinanceSetting = () => {
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("paypal");
//   const [toast, setToast] = useState({ show: false, type: "", message: "" });

//   const [formData, setFormData] = useState({
//     paypalEmail: "",
//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     accountHolder: "",
//     branchName: "",
//     swiftCode: "",
//     iban: "",
//     country: "",
//   });

//   const showToast = (type, message) => {
//     setToast({ show: true, type, message });
//     setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
//   };

//   useEffect(() => {
//     const fetchFinance = async () => {
//       const userId = localStorage.getItem("userid");
//       if (!userId) return;

//       try {
//         const res = await fetch(
//           `https://multi-vendor-marketplace.vercel.app/auth/getMerchantAccountDetails/${userId}`
//         );
//         const data = await res.json();

//         if (res.ok && data?.data) {
//           const {
//             bankDetails,
//             paypalAccount,
//             paypalAccountNo,
//             paypalReferenceNo,
//           } = data.data;

//           // 🔹 Detect method
//           if (paypalAccount || paypalAccountNo || paypalReferenceNo) {
//             setActiveTab("paypal");
//             setFormData((prev) => ({
//               ...prev,
//               paypalEmail: paypalAccount || "",
//               paypalAccountNo: paypalAccountNo || "",
//               paypalReferenceNo: paypalReferenceNo || "",
//             }));
//           } else if (bankDetails && Object.keys(bankDetails).length > 0) {
//             setActiveTab("bank");
//             setFormData((prev) => ({
//               ...prev,
//               bankName: bankDetails.bankName || "",
//               accountNumber: bankDetails.accountNumber || "",
//               ifscCode: bankDetails.ifscCode || "",
//               accountHolder: bankDetails.accountHolderName || "",
//               branchName: bankDetails.branchName || "",
//               swiftCode: bankDetails.swiftCode || "",
//               iban: bankDetails.iban || "",
//               country: bankDetails.country || "",
//             }));
//           }
//         }
//       } catch (err) {
//         console.error("Finance fetch error:", err);
//       }
//     };

//     fetchFinance();
//   }, []);

  // const handleSaveMerchantAccountDetails = async (method) => {
  //   try {
  //     setLoading(true);

  //     const userId = localStorage.getItem("userid");
  //     const apiKey = localStorage.getItem("apiKey");
  //     const apiSecretKey = localStorage.getItem("apiSecretKey");

  //     if (!userId) {
  //       showToast("error", "User ID not found!");
  //       return;
  //     }

  //     const payload = {
  //       userId,
  //       method,
  //       ...(method === "paypal"
  //         ? {
  //             paypalDetails: {
  //               paypalAccount: formData.paypalEmail,
  //               paypalAccountNo: formData.paypalAccountNo || "",
  //               paypalReferenceNo: formData.paypalReferenceNo || "",
  //             },
  //           }
  //         : {
  //             bankDetails: {
  //               accountHolderName: formData.accountHolder,
  //               accountNumber: formData.accountNumber,
  //               bankName: formData.bankName,
  //               branchName: formData.branchName,
  //               ifscCode: formData.ifscCode,
  //               swiftCode: formData.swiftCode,
  //               iban: formData.iban,
  //               country: formData.country,
  //             },
  //           }),
  //     };

  //     const res = await fetch(
  //       "https://multi-vendor-marketplace.vercel.app/auth/addMerchantAccountDetails",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "x-api-key": apiKey,
  //           "x-api-secret": apiSecretKey,
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     const data = await res.json();

  //     if (res.ok) {
  //       showToast("success", "Payout details saved successfully!");
  //     } else {
  //       showToast("error", data.message || "Failed to save details");
  //     }
  //   } catch (error) {
  //     console.error("Error saving payout:", error);
  //     showToast("error", "Something went wrong!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("usertoken");
//     if (!token) return;
//     try {
//       const decoded = jwtDecode(token);
//       if (decoded?.payLoad?.role) {
//         setUserRole(decoded.payLoad.role);
//       }
//     } catch (error) {
//       console.error("Token decode error:", error);
//     }
//   }, []);

//   return (
//     <div className="flex bg-gray-50 min-h-screen text-gray-800">
//       {toast.show && (
//         <div
//           className={`fixed top-16 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all z-50 ${
//             toast.type === "success" ? "bg-green-500" : "bg-red-500"
//           } text-white`}
//         >
//           {toast.type === "success" ? (
//             <HiOutlineCheckCircle className="w-6 h-6 mr-2" />
//           ) : (
//             <HiOutlineXCircle className="w-6 h-6 mr-2" />
//           )}
//           <span>{toast.message}</span>
//         </div>
//       )}

// <SettingsSidebar/>

//       <div className="flex-1 p-6 bg-white rounded-xl shadow-md m-4">
//         <h1 className=" text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//           <IoSettings /> Finance Settings
//         </h1>

//         <div className="flex border-b border-gray-300 text-gray-600 mb-6">
//           <button
//             className={`pb-2 px-6 flex items-center gap-2 ${
//               activeTab === "paypal"
//                 ? "border-b-2 border-blue-600 text-blue-700 font-semibold"
//                 : "hover:text-blue-600"
//             }`}
//             onClick={() => setActiveTab("paypal")}
//           >
//             <FaPaypal className="text-xl text-blue-500" /> PayPal
//           </button>
//           <button
//             className={`pb-2 px-6 flex items-center gap-2 ${
//               activeTab === "bank"
//                 ? "border-b-2 border-blue-600 text-blue-700 font-semibold"
//                 : "hover:text-blue-600"
//             }`}
//             onClick={() => setActiveTab("bank")}
//           >
//             <FaUniversity className="text-lg text-green-600" /> Bank
//           </button>
//         </div>

//         {activeTab === "paypal" && (
//           <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
//             <h2 className="text-lg font-semibold text-gray-700 mb-4">
//               PayPal Details
//             </h2>

//             <div className="flex flex-col max-w-md gap-4">
//               <div>
//                 <label className="text-sm font-medium mb-1">PayPal Email</label>
//                 <input
//                   type="email"
//                   name="paypalEmail"
//                   value={formData.paypalEmail}
//                   onChange={handleChange}
//                   placeholder="example@paypal.com"
//                   className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400 w-full"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium mb-1">
//                   PayPal Account No
//                 </label>
//                 <input
//                   type="text"
//                   name="paypalAccountNo"
//                   value={formData.paypalAccountNo || ""}
//                   onChange={handleChange}
//                   placeholder="Enter PayPal Account No"
//                   className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400 w-full"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium mb-1">
//                   PayPal Reference No
//                 </label>
//                 <input
//                   type="text"
//                   name="paypalReferenceNo"
//                   value={formData.paypalReferenceNo || ""}
//                   onChange={handleChange}
//                   placeholder="Enter PayPal Reference No"
//                   className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400 w-full"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end mt-6">
//               <button
//                 onClick={() => handleSaveMerchantAccountDetails("paypal")}
//                 disabled={loading}
//                 className="bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
//               >
//                 {loading ? "Saving..." : "Save PayPal Details"}
//               </button>
//             </div>
//           </div>
//         )}

//         {activeTab === "bank" && (
//           <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">
//               Bank Details
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Bank Name */}
//               <input
//                 type="text"
//                 name="bankName"
//                 value={formData.bankName}
//                 onChange={handleChange}
//                 placeholder="Bank Name"
//                 className="p-2 border rounded-md"
//               />

//               {/* BSB (but still saved as ifscCode in backend) */}
//               <input
//                 type="text"
//                 name="ifscCode" // 👈 backend me same key rahegi
//                 value={formData.ifscCode}
//                 onChange={handleChange}
//                 placeholder="BSB (Bank State Branch)"
//                 className="p-2 border rounded-md"
//               />

//               {/* Account Number */}
//               <input
//                 type="text"
//                 name="accountNumber"
//                 value={formData.accountNumber}
//                 onChange={handleChange}
//                 placeholder="Account Number"
//                 className="p-2 border rounded-md"
//               />

//               {/* Account Holder Name */}
//               <input
//                 type="text"
//                 name="accountHolder"
//                 value={formData.accountHolder}
//                 onChange={handleChange}
//                 placeholder="Account Holder Name"
//                 className="p-2 border rounded-md"
//               />
//             </div>

//             <div className="flex justify-end mt-6">
//               <button
//                 onClick={() => handleSaveMerchantAccountDetails("bank")}
//                 disabled={loading}
//                 className="bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
//               >
//                 {loading ? "Saving..." : "Save Bank Details"}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FinanceSetting;
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { FaPaypal, FaUniversity } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import SettingsSidebar from "../component/SettingsSidebar";

const FinanceSetting = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("paypal");
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const [formData, setFormData] = useState({
    paypalEmail: "",
    paypalAccountNo: "",
    paypalReferenceNo: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolder: "",
    branchName: "",
    swiftCode: "",
    iban: "",
    country: "",
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const handleSaveMerchantAccountDetails = async (method) => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userid");
      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");

      if (!userId) {
        showToast("error", "User ID not found!");
        return;
      }

      const payload = {
        userId,
        method,
        ...(method === "paypal"
          ? {
              paypalDetails: {
                paypalAccount: formData.paypalEmail,
                paypalAccountNo: formData.paypalAccountNo || "",
                paypalReferenceNo: formData.paypalReferenceNo || "",
              },
            }
          : {
              bankDetails: {
                accountHolderName: formData.accountHolder,
                accountNumber: formData.accountNumber,
                bankName: formData.bankName,
                branchName: formData.branchName,
                ifscCode: formData.ifscCode,
                swiftCode: formData.swiftCode,
                iban: formData.iban,
                country: formData.country,
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
        }
      );

      const data = await res.json();

      if (res.ok) {
        showToast("success", "Payout details saved successfully!");
      } else {
        showToast("error", data.message || "Failed to save details");
      }
    } catch (error) {
      console.error("Error saving payout:", error);
      showToast("error", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchFinance = async () => {
      const userId = localStorage.getItem("userid");
      if (!userId) return;
      try {
        const res = await fetch(`https://multi-vendor-marketplace.vercel.app/auth/getMerchantAccountDetails/${userId}`);
        const data = await res.json();
        if (res.ok && data?.data) {
          const { bankDetails, paypalAccount, paypalAccountNo, paypalReferenceNo } = data.data;
          if (paypalAccount || paypalAccountNo || paypalReferenceNo) {
            setActiveTab("paypal");
            setFormData(prev => ({ ...prev, paypalEmail: paypalAccount || "", paypalAccountNo: paypalAccountNo || "", paypalReferenceNo: paypalReferenceNo || "" }));
          } else if (bankDetails) {
            setActiveTab("bank");
            setFormData(prev => ({
              ...prev,
              bankName: bankDetails.bankName || "",
              accountNumber: bankDetails.accountNumber || "",
              ifscCode: bankDetails.ifscCode || "",
              accountHolder: bankDetails.accountHolderName || "",
            }));
          }
        }
      } catch (err) { console.error(err); }
    };
    fetchFinance();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen bg-[#f1f1f1] font-sans text-[#303030]">
      <SettingsSidebar />

      <div className="flex-1 pb-20">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
              <IoSettingsOutline size={20} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Finance Settings</h1>
              <p className="text-xs text-gray-500">Manage how you receive your payouts</p>
            </div>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto mt-8 px-8 space-y-10">
          
          {/* Tab Selection */}
          <div className="flex border-b border-gray-300">
            <button
              onClick={() => setActiveTab("paypal")}
              className={`py-3 px-6 text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "paypal"
                  ? "border-b-2 border-[#008060] text-[#008060]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaPaypal /> PayPal Details
            </button>
            <button
              onClick={() => setActiveTab("bank")}
              className={`py-3 px-6 text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "bank"
                  ? "border-b-2 border-[#008060] text-[#008060]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaUniversity /> Bank Account
            </button>
          </div>

          {/* PayPal Content */}
          {activeTab === "paypal" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-500">
              <div className="md:col-span-1">
                <h2 className="text-base font-semibold text-gray-900">Payout Method</h2>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Your PayPal account will be used to transfer earnings automatically. Ensure your email is verified.
                </p>
              </div>

              <div className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">PayPal Email Address</label>
                    <input
                      type="email"
                      name="paypalEmail"
                      value={formData.paypalEmail}
                      onChange={handleChange}
                      placeholder="e.g. finance@yourstore.com"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Account No (Optional)</label>
                      <input
                        type="text"
                        name="paypalAccountNo"
                        value={formData.paypalAccountNo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:border-[#008060] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Reference No</label>
                      <input
                        type="text"
                        name="paypalReferenceNo"
                        value={formData.paypalReferenceNo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:border-[#008060] outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleSaveMerchantAccountDetails("paypal")}
                      disabled={loading}
                      className="bg-[#18181b] hover:bg-gray-900 text-white px-5 py-2 rounded-md font-semibold text-sm transition shadow-sm disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save details"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bank Content */}
          {activeTab === "bank" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-500">
              <div className="md:col-span-1">
                <h2 className="text-base font-semibold text-gray-900">Bank Transfer</h2>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Enter your local bank details for direct deposits. Transfers usually take 3-5 business days.
                </p>
              </div>

              <div className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Account Holder Name</label>
                      <input
                        type="text"
                        name="accountHolder"
                        value={formData.accountHolder}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:border-[#008060] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Bank Name</label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:border-[#008060] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">BSB / IFSC Code</label>
                      <input
                        type="text"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:border-[#008060] outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Account Number</label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:border-[#008060] outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleSaveMerchantAccountDetails("bank")}
                      disabled={loading}
                      className="bg-[#18181b] hover:bg-gray-900 text-white px-5 py-2 rounded-md font-semibold text-sm transition shadow-sm disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save bank details"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60]">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl text-white font-medium ${toast.type === "success" ? "bg-[#303030]" : "bg-red-600"}`}>
            {toast.type === "success" ? <HiOutlineCheckCircle className="text-green-400" /> : <HiOutlineXCircle />}
            <span className="text-sm">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceSetting;