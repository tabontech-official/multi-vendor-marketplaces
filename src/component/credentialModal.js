import React, { useEffect, useState } from "react";

const CredentialCheckModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const apiKey = localStorage.getItem("apiKey");
    const apiSecret = localStorage.getItem("apiSecretKey");

    if (!apiKey || !apiSecret) {
      setShowModal(true);
    }
  }, []);

  const handleGenerate = async () => {
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
        localStorage.setItem("apiKey", data.apiKey);
        localStorage.setItem("apiSecretKey", data.apiSecretKey);
        setShowModal(false);
        window.location.reload();
      } else {
        alert("Failed to generate API credentials.");
      }
    } catch (err) {
      console.error("Failed to fetch credentials:", err);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fadeInUp p-8 relative border border-gray-200">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-black transition text-xl"
          onClick={() => setShowModal(false)}
        >
          ×
        </button>
        <div className="text-center">
          <div className="text-4xl mb-3 text-yellow-500">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            API Credentials Required
          </h2>
          <p className="text-gray-600">
            You need to generate your <strong>API Key</strong> and{" "}
            <strong>Secret Key</strong> before using the app.
          </p>

          <a
            href="/docs/credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline block mt-4"
          >
            View Credential Documentation
          </a>

          <button
            onClick={handleGenerate}
            className="mt-6 inline-block px-6 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-full hover:opacity-90 transition"
          >
            Generate Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CredentialCheckModal;
