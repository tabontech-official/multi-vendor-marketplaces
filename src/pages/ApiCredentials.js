// import React, { useState, useEffect } from "react";
// import { Link, NavLink } from "react-router-dom";
// import { FaUser, FaTimes, FaArrowRight } from "react-icons/fa";
// import { MdManageAccounts } from "react-icons/md";
// import { IoSettings } from "react-icons/io5";
// import { jwtDecode } from "jwt-decode";
// import { HiPlus } from "react-icons/hi";
// import SettingsSidebar from "../component/SettingsSidebar";
// const ApiCredentials = () => {
//   const [selectedModule, setSelectedModule] = useState("Api credentials");
//   const [apiKey, setApiKey] = useState("");
//   const [secretKey, setSecretKey] = useState("");
//   const [showSecret, setShowSecret] = useState(false);
//   const [copiedKey, setCopiedKey] = useState(false);
//   const [copiedSecret, setCopiedSecret] = useState(false);
//   const [userRole, setUserRole] = useState(null);

//   const copyText = (text, setCopied) => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const generateCredentials = async () => {
//     try {
//       const userId = localStorage.getItem("userid");

//       const res = await fetch(
//         "http://localhost:5000/generateAcessKeys/generate-keys",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ userId }),
//         }
//       );

//       const data = await res.json();

//       if (data.apiKey && data.apiSecretKey) {
//         setApiKey(data.apiKey);
//         setSecretKey(data.apiSecretKey);
//         localStorage.setItem("apiKey", data.apiKey);
//         localStorage.setItem("apiSecretKey", data.apiSecretKey);
//       }
//     } catch (err) {
//       console.error("Failed to fetch credentials:", err);
//     }
//   };

//   useEffect(() => {
//     const fetchApiCredentials = async () => {
//       const userId = localStorage.getItem("userid");

//       if (!userId) {
//         console.error("User ID not found in localStorage");
//         return;
//       }

//       try {
//         const res = await fetch(
//           `http://localhost:5000/generateAcessKeys/getApiCredentialByUserId/${userId}`
//         );

//         if (!res.ok) {
//           throw new Error("Failed to fetch API credentials");
//         }

//         const data = await res.json();

//         setApiKey(data.apiKey || "");
//         setSecretKey(data.apiSecretKey || "");
//       } catch (err) {
//         console.error("Error fetching API credentials:", err);
//       }
//     };

//     fetchApiCredentials();
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem("usertoken");
//     if (!token) return;

//     try {
//       const decoded = jwtDecode(token);
//       if (decoded?.payLoad?.role) {
//         setUserRole(decoded.payLoad.role);
//       }
//     } catch (error) {
//       console.error("Error decoding token:", error);
//     }
//   }, []);

//   return (
//     <div className="flex">
// <SettingsSidebar/>


//       <div className="p-8 bg-gray-50 min-h-screen">
//         <div className="max-w-3xl mx-auto space-y-6">
//           <div>
//           <h1 className="text-xl font-semibold text-gray-900 mb-0.5">
//               API Credentials
//             </h1>
//             <p className="text-sm text-gray-500">
//               Use these credentials to authenticate your app securely.
//             </p>
//             <a
//               href="https://multi-vendor-marketplaces.vercel.app/docs"
//               target="_blank"
//               rel="noreferrer"
//               className="text-sm text-blue-600 hover:underline mt-1 inline-block"
//             >
//               Learn more about API credential rotation
//             </a>
//           </div>

//           <div className="bg-white border border-gray-200 rounded-lg shadow p-6 space-y-6">
//             <div>
//               <label className="text-sm text-gray-600 font-medium mb-1 block">
//                 API Key
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   readOnly
//                   value={apiKey}
//                   className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 pr-16 text-sm text-gray-700"
//                 />
//                 <button
//                   onClick={() => copyText(apiKey, setCopiedKey)}
//                   className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-blue-600 hover:underline"
//                 >
//                   {copiedKey ? "Copied!" : "Copy"}
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className="text-sm text-gray-600 font-medium mb-1 block">
//                 API Secret Key
//               </label>
//               <div className="relative">
//                 <input
//                   type={showSecret ? "text" : "password"}
//                   readOnly
//                   value={secretKey}
//                   className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 pr-32 text-sm text-gray-700"
//                 />
//                 <button
//                   onClick={() => setShowSecret(!showSecret)}
//                   className="absolute top-1/2 right-20 -translate-y-1/2 text-sm text-blue-600 hover:underline"
//                 >
//                   {showSecret ? "Hide" : "Show"}
//                 </button>
//                 <button
//                   onClick={() => copyText(secretKey, setCopiedSecret)}
//                   className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-blue-600 hover:underline"
//                 >
//                   {copiedSecret ? "Copied!" : "Copy"}
//                 </button>
//               </div>
//             <p className="text-sm text-gray-500 mt-1">
//                 Created about 20 hours ago
//               </p>
//             </div>
//           </div>

//           <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">
//               Rotate App Credentials
//             </h3>
//             <p className="text-sm text-gray-500 mb-4">
//               Generate a new secret key or refresh token without causing
//               downtime for merchants. Always generate new tokens before deleting
//               old ones.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <button
//                 onClick={generateCredentials}
//                 className=" bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
//               >
//                 Generate new secret key
//               </button>
//               <button
//                 onClick={generateCredentials}
//                 className=" bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
//               >
//                 Generate new refresh token
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApiCredentials;
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { HiOutlineKey, HiOutlineClipboardCheck, HiOutlineExternalLink, HiOutlineRefresh } from "react-icons/hi";
import SettingsSidebar from "../component/SettingsSidebar";

const ApiCredentials = () => {
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
      const res = await fetch("http://localhost:5000/generateAcessKeys/generate-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
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
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:5000/generateAcessKeys/getApiCredentialByUserId/${userId}`);
        const data = await res.json();
        setApiKey(data.apiKey || "");
        setSecretKey(data.apiSecretKey || "");
      } catch (err) { console.error(err); }
    };
    fetchApiCredentials();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f1f1f1] font-sans text-[#303030]">
      <SettingsSidebar />

      <div className="flex-1 pb-20">
        {/* Shopify Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
              <HiOutlineKey size={20} />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">API Credentials</h1>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto mt-8 px-8 space-y-10">
          
          {/* Section 1: Keys */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-base font-semibold text-gray-900">Authentication</h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Use these keys to authenticate with the Marketplace API. 
                <span className="text-red-600 font-medium"> Never share your Secret Key.</span>
              </p>
              <a
                href="https://multi-vendor-marketplaces.vercel.app/docs"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#008060] font-medium hover:underline mt-4 flex items-center gap-1"
              >
                API Documentation <HiOutlineExternalLink />
              </a>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                {/* API Key */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 block">
                    API Key
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={apiKey}
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono text-gray-600 outline-none"
                    />
                    <button
                      onClick={() => copyText(apiKey, setCopiedKey)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition min-w-[80px]"
                    >
                      {copiedKey ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Secret Key */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 block">
                    API Secret Key
                  </label>
                  <div className="flex gap-2">
                    <input
                      type={showSecret ? "text" : "password"}
                      readOnly
                      value={secretKey}
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono text-gray-600 outline-none"
                    />
                    <button
                      onClick={() => setShowSecret(!showSecret)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                    >
                      {showSecret ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => copyText(secretKey, setCopiedSecret)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition min-w-[80px]"
                    >
                      {copiedSecret ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 flex items-center gap-1 italic">
                    <HiOutlineRefresh /> Last rotated: 20 hours ago
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Section 2: Rotation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-base font-semibold text-gray-900">Security & Rotation</h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Regularly rotating your keys helps prevent unauthorized access if a key is compromised.
              </p>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Rotate App Credentials</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Generating a new secret key will invalidate the current one. Ensure your application is updated immediately to prevent service interruptions.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={generateCredentials}
                    className="bg-[#303030] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1a1c1d] transition-colors shadow-sm"
                  >
                    Generate new secret key
                  </button>
                  <button
                    onClick={generateCredentials}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Generate refresh token
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Success Toast */}
      {(copiedKey || copiedSecret) && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl bg-[#303030] text-white font-medium animate-in fade-in slide-in-from-bottom-4 duration-300">
            <HiOutlineClipboardCheck className="text-green-400 text-lg" />
            <span className="text-sm">Copied to clipboard</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiCredentials;