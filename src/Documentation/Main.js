import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCogs,
  FaLock,
  FaUpload,
  FaArrowRight,
  FaPlug,
  FaClipboardList,
} from "react-icons/fa";
import { FiBox } from "react-icons/fi";

export default function ApiMainPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <header className="mb-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Multi-Vendor Marketplace API
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Build powerful vendor-integrated applications. Access products, collections, inventory, payouts, and more — all secured with API keys and ready for scale.
            </p>
            <button
              onClick={() => navigate("/api-docs")}
              className="mt-6 inline-flex items-center px-6 py-3 bg-purple-700 text-white rounded-md text-sm font-medium hover:bg-purple-800 transition"
            >
              View API Docs
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </header>

        {/* Feature Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <FeatureCard
            icon={<FaLock className="text-purple-600 text-xl" />}
            title="Secure Authentication"
            desc="Use access-token and secret-key headers to securely interact with our APIs."
          />
          <FeatureCard
            icon={<FiBox className="text-green-600 text-xl" />}
            title="Product Control"
            desc="Create, update, and manage product listings, prices, and variants effortlessly."
          />
          <FeatureCard
            icon={<FaClipboardList className="text-blue-600 text-xl" />}
            title="Vendor Payouts"
            desc="Track and automate merchant-wise earnings and payouts with full transparency."
          />
          <FeatureCard
            icon={<FaUpload className="text-yellow-600 text-xl" />}
            title="Bulk Uploads"
            desc="Easily upload Products, Inventory, Collections, or Discounts using CSV APIs."
          />
          <FeatureCard
            icon={<FaPlug className="text-red-600 text-xl" />}
            title="API Integrations"
            desc="Integrate with your dashboard or marketplace tools using clean REST APIs."
          />
          <FeatureCard
            icon={<FaCogs className="text-indigo-600 text-xl" />}
            title="Developer Ready"
            desc="Built for developers with clear docs, examples, and environment flexibility."
          />
        </section>

        {/* Get Started */}
        <section className="bg-gray-50 p-10 rounded-xl text-center shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Start Building Today
          </h2>
          <p className="text-gray-600 mb-6">
            Access all API endpoints with proper authentication and structured
            data formats.
          </p>
          <button
            onClick={() => navigate("/api-docs")}
            className="inline-flex items-center px-6 py-3 bg-purple-700 text-white rounded-md text-sm font-medium hover:bg-purple-800 transition"
          >
            Explore API Reference
            <FaArrowRight className="ml-2" />
          </button>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition duration-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="text-2xl">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
