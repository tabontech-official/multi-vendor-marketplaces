import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaUser, FaPaypal, FaUniversity } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { MdManageAccounts } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

const FinanceSetting = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("paypal");
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const [formData, setFormData] = useState({
    paypalEmail: "",
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

useEffect(() => {
  const fetchFinance = async () => {
    const userId = localStorage.getItem("userid");
    if (!userId) return;

    try {
      const res = await fetch(
        `https://multi-vendor-marketplace.vercel.app/auth/getMerchantAccountDetails/${userId}`
      );
      const data = await res.json();

      if (res.ok && data?.data) {
        const {
          bankDetails,
          paypalAccount,
          paypalAccountNo,
          paypalReferenceNo,
        } = data.data;

        // 🔹 Detect method
        if (paypalAccount || paypalAccountNo || paypalReferenceNo) {
          setActiveTab("paypal");
          setFormData((prev) => ({
            ...prev,
            paypalEmail: paypalAccount || "",
            paypalAccountNo: paypalAccountNo || "",
            paypalReferenceNo: paypalReferenceNo || "",
          }));
        } else if (bankDetails && Object.keys(bankDetails).length > 0) {
          setActiveTab("bank");
          setFormData((prev) => ({
            ...prev,
            bankName: bankDetails.bankName || "",
            accountNumber: bankDetails.accountNumber || "",
            ifscCode: bankDetails.ifscCode || "",
            accountHolder: bankDetails.accountHolderName || "",
            branchName: bankDetails.branchName || "",
            swiftCode: bankDetails.swiftCode || "",
            iban: bankDetails.iban || "",
            country: bankDetails.country || "",
          }));
        }
      }
    } catch (err) {
      console.error("Finance fetch error:", err);
    }
  };

  fetchFinance();
}, []);




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


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      if (decoded?.payLoad?.role) {
        setUserRole(decoded.payLoad.role);
      }
    } catch (error) {
      console.error("Token decode error:", error);
    }
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-800">
      {toast.show && (
        <div
          className={`fixed top-16 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all z-50 ${
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

      <aside className="w-56 mt-3 mb-3 ml-4 rounded-2xl bg-blue-900 p-5 flex flex-col justify-between min-h-screen shadow-lg">
        <div>
          <div className="flex flex-col items-center border-b border-blue-700 pb-4">
            <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center shadow-md">
              <FaUser className="text-yellow-400 w-8 h-8" />
            </div>
            <h2 className="text-lg font-semibold text-white mt-3">
              Business Account
            </h2>
          </div>

          <nav className="mt-6 space-y-3">
            {userRole === "Merchant" && (
              <NavLink
                to="/manage-user"
                className="flex items-center px-3 py-2 rounded-md text-blue-200 hover:bg-blue-800"
              >
                <MdManageAccounts className="mr-2 text-lg" />
                Manage User
              </NavLink>
            )}
            <NavLink
              to="/edit-account"
              className="flex items-center px-3 py-2 rounded-md text-blue-200 hover:bg-blue-800"
            >
              <IoSettings className="mr-2 text-lg" /> Settings
            </NavLink>
            <NavLink
              to="/finance-setting"
              className="flex items-center px-3 py-2 rounded-md bg-yellow-400 text-blue-900"
            >
              <IoSettings className="mr-2 text-lg" /> Finance Settings
            </NavLink>
          </nav>
        </div>
      </aside>

      <div className="flex-1 p-6 bg-white rounded-xl shadow-md m-4">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-2">
          <IoSettings /> Finance Settings
        </h1>

        <div className="flex border-b border-gray-300 text-gray-600 mb-6">
          <button
            className={`pb-2 px-6 flex items-center gap-2 ${
              activeTab === "paypal"
                ? "border-b-2 border-blue-600 text-blue-700 font-semibold"
                : "hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("paypal")}
          >
            <FaPaypal className="text-xl text-blue-500" /> PayPal
          </button>
          <button
            className={`pb-2 px-6 flex items-center gap-2 ${
              activeTab === "bank"
                ? "border-b-2 border-blue-600 text-blue-700 font-semibold"
                : "hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("bank")}
          >
            <FaUniversity className="text-lg text-green-600" /> Bank
          </button>
        </div>

        {activeTab === "paypal" && (
  <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
    <h2 className="text-lg font-semibold text-gray-700 mb-4">
      PayPal Details
    </h2>

    <div className="flex flex-col max-w-md gap-4">
      <div>
        <label className="text-sm font-medium mb-1">PayPal Email</label>
        <input
          type="email"
          name="paypalEmail"
          value={formData.paypalEmail}
          onChange={handleChange}
          placeholder="example@paypal.com"
          className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400 w-full"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1">PayPal Account No</label>
        <input
          type="text"
          name="paypalAccountNo"
          value={formData.paypalAccountNo || ""}
          onChange={handleChange}
          placeholder="Enter PayPal Account No"
          className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400 w-full"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1">PayPal Reference No</label>
        <input
          type="text"
          name="paypalReferenceNo"
          value={formData.paypalReferenceNo || ""}
          onChange={handleChange}
          placeholder="Enter PayPal Reference No"
          className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400 w-full"
        />
      </div>
    </div>

    <div className="flex justify-end mt-6">
      <button
        onClick={() => handleSaveMerchantAccountDetails("paypal")}
        disabled={loading}
        className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
      >
        {loading ? "Saving..." : "Save PayPal Details"}
      </button>
    </div>
  </div>
)}


        {activeTab === "bank" && (
          <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Bank Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Bank Name"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Account Number"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="IFSC / SWIFT Code"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="accountHolder"
                value={formData.accountHolder}
                onChange={handleChange}
                placeholder="Account Holder Name"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="branchName"
                value={formData.branchName}
                onChange={handleChange}
                placeholder="Branch Name"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="swiftCode"
                value={formData.swiftCode}
                onChange={handleChange}
                placeholder="SWIFT Code"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="iban"
                value={formData.iban}
                onChange={handleChange}
                placeholder="IBAN"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                className="p-2 border rounded-md"
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => handleSaveMerchantAccountDetails("bank")}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {loading ? "Saving..." : "Save Bank Details"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceSetting;
