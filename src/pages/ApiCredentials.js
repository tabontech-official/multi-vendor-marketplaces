import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaUser, FaTimes, FaArrowRight } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import { HiPlus } from "react-icons/hi";
import SettingsSidebar from "../component/SettingsSidebar";
const ApiCredentials = () => {
  const [selectedModule, setSelectedModule] = useState("Api credentials");
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const copyText = (text, setCopied) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCredentials = async () => {
    try {
      const userId = localStorage.getItem("userid");

      const res = await fetch(
        "https://multi-vendor-marketplace.vercel.app/generateAcessKeys/generate-keys",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await res.json();

      if (data.apiKey && data.apiSecretKey) {
        setApiKey(data.apiKey);
        setSecretKey(data.apiSecretKey);
        localStorage.setItem("apiKey", data.apiKey);
        localStorage.setItem("apiSecretKey", data.apiSecretKey);
      }
    } catch (err) {
      console.error("Failed to fetch credentials:", err);
    }
  };

  useEffect(() => {
    const fetchApiCredentials = async () => {
      const userId = localStorage.getItem("userid");

      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      try {
        const res = await fetch(
          `https://multi-vendor-marketplace.vercel.app/generateAcessKeys/getApiCredentialByUserId/${userId}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch API credentials");
        }

        const data = await res.json();

        setApiKey(data.apiKey || "");
        setSecretKey(data.apiSecretKey || "");
      } catch (err) {
        console.error("Error fetching API credentials:", err);
      }
    };

    fetchApiCredentials();
  }, []);

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
    <div className="flex">
<SettingsSidebar/>


      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-0.5">
              API Credentials
            </h1>
            <p className="text-sm text-gray-500">
              Use these credentials to authenticate your app securely.
            </p>
            <a
              href="https://multi-vendor-marketplaces.vercel.app/docs"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 hover:underline mt-1 inline-block"
            >
              Learn more about API credential rotation
            </a>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow p-6 space-y-6">
            <div>
              <label className="text-sm text-gray-600 font-medium mb-1 block">
                API Key
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={apiKey}
                  className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 pr-16 text-sm text-gray-700"
                />
                <button
                  onClick={() => copyText(apiKey, setCopiedKey)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-blue-600 hover:underline"
                >
                  {copiedKey ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 font-medium mb-1 block">
                API Secret Key
              </label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  readOnly
                  value={secretKey}
                  className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 pr-32 text-sm text-gray-700"
                />
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute top-1/2 right-20 -translate-y-1/2 text-sm text-blue-600 hover:underline"
                >
                  {showSecret ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => copyText(secretKey, setCopiedSecret)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-blue-600 hover:underline"
                >
                  {copiedSecret ? "Copied!" : "Copy"}
                </button>
              </div>
            <p className="text-sm text-gray-500 mt-1">
                Created about 20 hours ago
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Rotate App Credentials
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Generate a new secret key or refresh token without causing
              downtime for merchants. Always generate new tokens before deleting
              old ones.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={generateCredentials}
                className=" bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
              >
                Generate new secret key
              </button>
              <button
                onClick={generateCredentials}
                className=" bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
              >
                Generate new refresh token
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiCredentials;
