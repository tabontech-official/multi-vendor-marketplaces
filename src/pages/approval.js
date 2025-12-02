import React, { useState, useEffect } from "react";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { MdManageAccounts } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ApprovalSetting = () => {
  const [approvalMode, setApprovalMode] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [userRole, setUserRole] = useState(null);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  useEffect(() => {
    const fetchApprovalSetting = async () => {
      try {
        const apiKey = localStorage.getItem("apiKey");
        const apiSecretKey = localStorage.getItem("apiSecretKey");
        const res = await fetch("https://multi-vendor-marketplace.vercel.app/approval/getApproval", {
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.success && data.data) {
          setApprovalMode(data.data.approvalMode);
        } else {
          setApprovalMode("Manual");
        }
      } catch (err) {
        console.error("Error fetching approval mode:", err);
        setApprovalMode("Manual");
      } finally {
        setLoading(false);
      }
    };
    fetchApprovalSetting();
  }, []);

  // update approval mode
  const updateApprovalSetting = async (mode) => {
    try {
      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");
      const res = await fetch("https://multi-vendor-marketplace.vercel.app/approval/add-approval", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "x-api-secret": apiSecretKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approvalMode: mode }),
      });

      const data = await res.json();
      if (data.success) {
        setApprovalMode(mode);
        showToast("success", "Approval mode updated successfully.");
      } else {
        showToast("error", "Failed to update approval mode.");
      }
    } catch (err) {
      console.error("Error updating approval mode:", err);
      showToast("error", "Something went wrong.");
    }
  };

  // decode token for role
  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      if (decoded?.payLoad?.role) {
        setUserRole(decoded.payLoad.role);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <div className="flex bg-gray-50 min-h-screen">
        <aside className="w-56 mt-3 mb-3 ml-4 rounded-2xl bg-blue-900 p-5 flex flex-col justify-between min-h-screen shadow-lg">
          {/* Top: Profile */}
          <div>
            <div className="flex flex-col items-center border-b border-blue-700 pb-4">
              <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center shadow-md">
                <FaUser className="text-yellow-400 w-8 h-8" />
              </div>

              <h2 className="text-lg font-semibold text-white mt-3">
                Business Account
              </h2>

              <div className="flex items-center mt-1 space-x-1">
                <span className="text-yellow-400 font-semibold text-sm">
                  6.0
                </span>
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className="text-yellow-400 text-sm">
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-green-400 text-xs mt-1">
                Profile is 75% complete
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="mt-6 space-y-3">
              {userRole === "Merchant" && (
                <NavLink
                  to="/manage-user"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md transition-all duration-150 ${
                      isActive
                        ? "bg-yellow-400 text-blue-900"
                        : "text-blue-200 hover:bg-blue-800"
                    }`
                  }
                >
                  <MdManageAccounts className="mr-2 text-lg" />
                  <span className="text-sm font-medium">Manage User</span>
                </NavLink>
              )}
              <NavLink
                to="/edit-account"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition-all duration-150 ${
                    isActive
                      ? "bg-yellow-400 text-blue-900"
                      : "text-blue-200 hover:bg-blue-800"
                  }`
                }
              >
                <IoSettings className="mr-2 text-lg" />
                <span className="text-sm font-medium">Settings</span>
              </NavLink>

              <NavLink
                to="/api-credentials"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition-all duration-150 ${
                    isActive
                      ? "bg-yellow-400 text-blue-900"
                      : "text-blue-200 hover:bg-blue-800"
                  }`
                }
              >
                <IoSettings className="mr-2 text-lg" />
                <span className="text-sm font-medium">API Credentials</span>
              </NavLink>
              {(userRole === "Master Admin" || userRole === "Dev Admin") && (
                <NavLink
                  to="/approval-setting"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md transition-all duration-150 ${
                      isActive
                        ? "bg-yellow-400 text-blue-900"
                        : "text-blue-200 hover:bg-blue-800"
                    }`
                  }
                >
                  <MdManageAccounts className="mr-2 text-lg" />
                  <span className="text-sm font-medium">Approval Settings</span>
                </NavLink>
              )}
            </nav>
          </div>

          {/* Bottom: Promote Button */}
          <button className="w-full mt-6 py-2 bg-yellow-400 text-blue-900 font-semibold rounded-md hover:bg-yellow-500 transition-all duration-150">
            🚀 Promote
          </button>
        </aside>

        <main className="flex-1 flex justify-center items-start p-10">
          <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Product Approval Settings
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Control how new products are published. Choose{" "}
              <span className="font-medium text-green-600">Automatic</span> for
              instant publishing, or{" "}
              <span className="font-medium text-yellow-600">Manual</span> to
              require admin approval.
            </p>

            <div className="space-y-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="Auto"
                  checked={approvalMode === "Auto"}
                  onChange={() => updateApprovalSetting("Auto")}
                  className="mr-2"
                />
                <span>
                  <span className="font-medium">Automatic Approval</span> —
                  Products are instantly published.
                </span>
              </label>

              {/* <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="Manual"
                  checked={approvalMode === "Manual"}
                  onChange={() => updateApprovalSetting("Manual")}
                  className="mr-2"
                />
                <span>
                  <span className="font-medium">Manual Approval</span> —
                  Products remain <span className="font-semibold">Draft</span>{" "}
                  until reviewed by Admin.
                </span>
              </label> */}
            </div>
          </div>
        </main>
      </div>
      {toast.show && (
        <div
          className={`fixed top-16 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${
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
    </>
  );
};

export default ApprovalSetting;
