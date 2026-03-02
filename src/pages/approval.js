import React, { useState, useEffect } from "react";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SettingsSidebar from "../component/SettingsSidebar";

const ApprovalSetting = () => {
  const navigate = useNavigate();
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
        const res = await fetch("http://localhost:5000/approval/getApproval", {
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

  const updateApprovalSetting = async (mode) => {
    try {
      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");
      const res = await fetch("http://localhost:5000/approval/add-approval", {
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
    <div className="flex min-h-screen bg-[#f1f1f1] font-sans text-[#303030]">
      <SettingsSidebar />

      <div className="flex-1 pb-20">
        {/* Shopify Sticky Header */}
        <div className="sticky top-0 z-10 bg-[#f1f1f1] px-8 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-200 rounded transition">
              <MdArrowBack className="text-xl text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Product Approval</h1>
          </div>
          <div className="flex gap-3">
             <span className="text-xs text-gray-400 self-center hidden md:block">
               Auto-saves on selection
             </span>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto mt-8 px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Description */}
            <div className="md:col-span-1">
              <h2 className="text-base font-semibold text-gray-900">Publishing Policy</h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Choose whether products submitted by vendors are published immediately or held for review by an administrator.
              </p>
            </div>

            {/* Right Column: Settings Card */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                
                {/* Option 1: Automatic */}
                <div 
                  onClick={() => updateApprovalSetting("Auto")}
                  className={`p-5 flex items-start gap-4 cursor-pointer transition-colors border-b border-gray-100 last:border-0 hover:bg-gray-50
                    ${approvalMode === "Auto" ? "bg-green-50/30" : ""}`}
                >
                  <div className="mt-1">
                    <input
                      type="radio"
                      name="approval"
                      checked={approvalMode === "Auto"}
                      onChange={() => {}}
                      className="w-4 h-4 text-[#008060] border-gray-300 focus:ring-[#008060]"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Automatic Approval</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Products are published to the store immediately after a vendor submits them.
                    </p>
                  </div>
                </div>

                {/* Option 2: Manual */}
                <div 
                  onClick={() => updateApprovalSetting("Manual")}
                  className={`p-5 flex items-start gap-4 cursor-pointer transition-colors border-b border-gray-100 last:border-0 hover:bg-gray-50
                    ${approvalMode === "Manual" ? "bg-green-50/30" : ""}`}
                >
                  <div className="mt-1">
                    <input
                      type="radio"
                      name="approval"
                      checked={approvalMode === "Manual"}
                      onChange={() => {}}
                      className="w-4 h-4 text-[#008060] border-gray-300 focus:ring-[#008060]"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Manual Approval</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      New products are saved as <span className="font-medium text-gray-700 underline decoration-dotted">Drafts</span>. An admin must review and publish them manually.
                    </p>
                  </div>
                </div>

              </div>

              {/* Information Note */}
              <div className="bg-[#e7f3f0] p-4 rounded-lg border border-[#c3e3d9] flex gap-3">
                <HiOutlineCheckCircle className="text-[#008060] text-xl shrink-0" />
                <p className="text-xs text-[#004d3d] leading-relaxed">
                  <strong>Recommendation:</strong> Manual approval is recommended if you have multiple vendors to ensure product quality and content standards are met.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Shopify Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce-short">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl text-white font-medium
            ${toast.type === "success" ? "bg-[#303030]" : "bg-red-600"}`}>
            {toast.type === "success" ? (
              <HiOutlineCheckCircle className="text-green-400 text-lg" />
            ) : (
              <HiOutlineXCircle className="text-white text-lg" />
            )}
            <span className="text-sm">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalSetting;