import axios from "axios";
import React, { useState } from "react";
import {
  FaShopify,
  FaRocket,
  FaMobileAlt,
  FaCogs,
  FaChartLine,
} from "react-icons/fa";

const EcommerceConsultation = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    storeUrl: "",
    type: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    const userId = localStorage.getItem("userid");
    e.preventDefault();

    try {
      const payload = {
        fullName: formData.name,
        email: formData.email,
        storeUrl: formData.storeUrl,
        consultataionType: formData.type,
        goals: formData.message,
        userId: userId,
      };

      const res = await axios.post(
        " http://localhost:5000/consultation",
        payload
      );
      alert("Consultation booked successfully!");
      console.log("Response:", res.data);
    } catch (err) {
      console.error("Error booking consultation:", err);
      alert("Failed to book consultation. Please try again.");
    }
  };

  return (
    <main className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start border-b-2 border-gray-200 pb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">
            1-on-1 E-commerce Consultations
          </h1>
          <p className="text-gray-600">
            {" "}
            Get expert guidance on improving your Shopify store, increasing
            sales, or scaling your brand.
          </p>
          <div className="w-2/4 max-sm:w-full mt-2"></div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12 items-start max-w-6xl mx-auto px-4">
        <section className="bg-white shadow-md rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            What's Included in Your Consultation
          </h2>
          <ul className="space-y-5 text-gray-600 text-sm">
            <li className="flex items-start gap-4">
              <FaShopify className="text-cyan-600 text-xl mt-1" />
              <div>
                <p className="font-medium">Shopify Store Audit</p>
                <p className="text-xs">
                  Full UX + performance review of your Shopify store
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <FaRocket className="text-cyan-600 text-xl mt-1" />
              <div>
                <p className="font-medium">Sales Funnel Strategy</p>
                <p className="text-xs">
                  We help plan your customer journey for conversions
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <FaMobileAlt className="text-cyan-600 text-xl mt-1" />
              <div>
                <p className="font-medium">Speed & Mobile UX</p>
                <p className="text-xs">
                  Speed testing and layout improvements for mobile
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <FaCogs className="text-cyan-600 text-xl mt-1" />
              <div>
                <p className="font-medium">App & Theme Suggestions</p>
                <p className="text-xs">
                  Tools, themes & apps best suited for your store's growth
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <FaChartLine className="text-cyan-600 text-xl mt-1" />
              <div>
                <p className="font-medium">Marketing + CRO Tips</p>
                <p className="text-xs">
                  Custom tips to boost traffic & increase sales
                </p>
              </div>
            </li>
          </ul>
        </section>

        <section className="bg-gray-50 shadow-inner rounded-2xl p-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Book Your Free Consultation
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm block mb-1 font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="text-sm block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="text-sm block mb-1 font-medium">
                Your Store URL
              </label>
              <input
                type="text"
                name="storeUrl"
                placeholder="https://yourstore.myshopify.com"
                value={formData.storeUrl}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="text-sm block mb-1 font-medium">
                Consultation Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select</option>
                <option value="audit">Store Audit</option>
                <option value="marketing">Marketing Strategy</option>
                <option value="growth">Growth Plan</option>
              </select>
            </div>
            <div>
              <label className="text-sm block mb-1 font-medium">
                Tell us your goals
              </label>
              <textarea
                name="message"
                rows="4"
                placeholder="I want to improve speed and get more conversions..."
                value={formData.message}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-600 text-white font-medium py-3 rounded-md hover:bg-cyan-700 transition"
            >
              Submit Request
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default EcommerceConsultation;
