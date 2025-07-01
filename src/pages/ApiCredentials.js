import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaTimes, FaArrowRight } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import { HiPlus } from "react-icons/hi";
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
        "http://localhost:5000/generateAcessKeys/generate-keys",
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
          `http://localhost:5000/generateAcessKeys/getApiCredentialByUserId/${userId}`
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
      <aside className="w-52 mt-2 mb-2 ml-4 rounded-r-2xl bg-blue-900 p-6 flex flex-col justify-between min-h-screen">
        <div>
          <div className="flex flex-col items-center border-b-2">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
              <FaUser className="text-yellow-400 w-10 h-10" />
            </div>
            <h2 className="text-lg font-semibold text-white mt-2">
              Business Account
            </h2>

            <div className="flex items-center space-x-1 mt-1">
              <span className="text-yellow-400 text-sm font-semibold">6.0</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, index) => (
                  <span key={index} className="text-yellow-400 text-sm">
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-green-400 text-sm mt-1 mb-2">
              Profile is 75% complete
            </p>
            <div className=""></div>
          </div>

          <nav className="mt-6 space-y-4">
            {userRole === "Merchant" && (
              <button
                onClick={() => {
                  setSelectedModule("Manage User");
                }}
                className={`w-full text-left flex items-center space-x-3 ${
                  selectedModule === "Manage User"
                    ? "text-yellow-400"
                    : "text-blue-300"
                } hover:text-yellow-400`}
              >
                <span className="w-6 h-6 bg-blue-700 flex items-center justify-center rounded-md">
                  <MdManageAccounts />
                </span>

                <Link to="/manage-user">
                  <span className="text-sm">Manage User</span>
                </Link>
              </button>
            )}
            <button
              onClick={() => setSelectedModule("Settings")}
              className={`w-full text-left flex items-center space-x-3 ${
                selectedModule === "Settings"
                  ? "text-yellow-400"
                  : "text-blue-300"
              } hover:text-yellow-400`}
            >
              <span className="w-6 h-6 bg-blue-700 flex items-center justify-center rounded-md">
                <IoSettings />
              </span>
              <Link to="/edit-account">
                <span className="text-sm">Settings</span>
              </Link>
            </button>
            <button
              onClick={() => setSelectedModule("Api credentials")}
              className={`w-full text-left flex items-center space-x-3 ${
                selectedModule === "Api credentials"
                  ? "text-yellow-400"
                  : "text-blue-300"
              } hover:text-yellow-400`}
            >
              <span className="w-6 h-6 bg-blue-700 flex items-center justify-center rounded-md">
                <IoSettings />
              </span>
              <Link to="/api-credentials">
                <span className="text-sm">Api credentials</span>
              </Link>
            </button>
          </nav>
        </div>

        <button className="w-full py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600">
          Promote
        </button>
      </aside>

      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              API Credentials
            </h1>
            <p className="text-gray-600 text-sm">
              Use these credentials to authenticate your app securely.
            </p>
            <a
              href="https://shopify.dev/docs/api/usage/authentication/rotate"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 hover:underline mt-1 inline-block"
            >
              Learn more about API credential rotation
            </a>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow p-6 space-y-6">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
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
              <label className="text-sm text-gray-600 mb-1 block">
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
              <p className="text-xs text-gray-500 mt-1">
                Created about 20 hours ago
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
            <h3 className="text-base font-medium text-gray-800 mb-2">
              Rotate App Credentials
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Generate a new secret key or refresh token without causing
              downtime for merchants. Always generate new tokens before deleting
              old ones.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={generateCredentials}
                className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
              >
                Generate new secret key
              </button>
              <button
                onClick={generateCredentials}
                className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
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
