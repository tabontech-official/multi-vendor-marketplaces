import React, { useState, useEffect } from "react";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { MdManageAccounts } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SettingsSidebar from "../component/SettingsSidebar";

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


  return (
    <>
      <div className="flex bg-gray-50 min-h-screen">
       <SettingsSidebar/>

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
