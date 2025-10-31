import React from "react";
import {
  FaBookOpen,
  FaKey,
  FaShieldAlt,
  FaTerminal,
  FaCogs,
  FaBoxes,
  FaDollarSign,
  FaFileCsv,
  FaUsers,
  FaArrowLeft,
  FaLink,
} from "react-icons/fa";

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-[#f9fafb] py-12 px-6 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Top Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-4">
            <FaBookOpen className="text-purple-600" />
            Multi-Vendor Marketplace API Docs
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl">
            Use our API to manage vendors, automate listings, handle payouts, upload via CSV, and much more – all securely through your API keys.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mb-10">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-white text-gray-800 border border-gray-300 px-5 py-2 rounded-md hover:bg-gray-100 transition"
          >
            <FaArrowLeft />
            Back to Dashboard
          </a>
          <a
            href="/api-reference"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 transition"
          >
            <FaLink />
            API Reference
          </a>
        </div>

        {/* App Benefits Summary */}
        <section className="bg-white rounded-lg shadow p-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaCogs className="text-indigo-600" />
            What This App Provides
          </h2>
          <ul className="space-y-5 text-gray-700 text-base">
            <li className="flex items-start gap-3">
              <FaBoxes className="text-purple-500 mt-1" />
              <div>
                <strong>Product Management:</strong> Create, edit, assign, and manage products with multi-variant support.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <FaUsers className="text-blue-500 mt-1" />
              <div>
                <strong>Vendor Linking:</strong> Assign products to vendors and identify ownership through variant IDs.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <FaFileCsv className="text-green-600 mt-1" />
              <div>
                <strong>CSV Bulk Upload:</strong> Upload products, inventory, collections, and discounts through CSV feeds.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <FaDollarSign className="text-yellow-600 mt-1" />
              <div>
                <strong>Merchant Payouts:</strong> Schedule payouts, view earnings per merchant, and track fulfillment-based payments.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <FaShieldAlt className="text-red-500 mt-1" />
              <div>
                <strong>Secure API Access:</strong> All API endpoints are protected with `x-api-key` and `x-api-secret` to prevent misuse.
              </div>
            </li>
          </ul>
        </section>

        {/* API Reference Section */}
        <section id="api-reference">
          {/* Section: API Keys */}
          <div className="mb-10 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FaKey className="text-purple-600" />
              1. Get Your API Keys
            </h2>
            <p className="text-gray-700 mb-4">
              You'll need two keys to access the API:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>
                <strong>x-api-key</strong>: Public key to identify your app
              </li>
              <li>
                <strong>x-api-secret</strong>: Private key to validate your request
              </li>
            </ul>
            <p className="text-sm text-gray-600 italic">
              Find them at: <strong>Settings → Profile → API Credentials</strong>
            </p>
          </div>

          {/* Section: Authentication */}
          <div className="mb-10 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FaShieldAlt className="text-blue-600" />
              2. Authenticating Requests
            </h2>
            <p className="text-gray-700 mb-4">
              Add the keys in the headers of every request like this:
            </p>
            <div className="bg-gray-100 p-4 rounded-md font-mono text-sm overflow-x-auto text-gray-800">
              <pre>
{`GET /product/getProduct/:userId

Headers:
  x-api-key: your_public_key_here
  x-api-secret: your_private_secret_here`}
              </pre>
            </div>
          </div>

          {/* Section: Example Usage */}
          <div className="mb-10 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FaTerminal className="text-green-600" />
              3. Example Request (Using Fetch)
            </h2>
            <div className="bg-black text-white p-4 rounded-md font-mono text-sm overflow-x-auto">
              <pre>
{`fetch("https://multi-vendor-marketplace.vercel.app/product/getProduct/USER_ID", {
  method: "GET",
  headers: {
    "x-api-key": "your_public_key_here",
    "x-api-secret": "your_private_secret_here"
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
