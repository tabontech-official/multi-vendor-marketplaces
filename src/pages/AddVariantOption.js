import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import { IoOptionsOutline } from "react-icons/io5";

const AddVariantOption = () => {
  const navigate = useNavigate();
  const [optionName, setOptionName] = useState("");
  const [optionValues, setOptionValues] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanName = optionName.trim();
    const cleanValues = optionValues
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    if (!cleanName) {
      return showToast("error", "Please enter an option name.");
    }
    if (cleanValues.length === 0) {
      return showToast("error", "Please enter at least one option value.");
    }

    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/variantOption/addOptions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            optionName: cleanName,
            optionValues: cleanValues,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        showToast("success", "Variant option added successfully!");
        setOptionName("");
        setOptionValues("");
        setTimeout(() => navigate("/manage-options"), 1500);
      } else {
        showToast("error", data.message || "Failed to add option.");
      }
    } catch (error) {
      console.error("Add option error:", error);
      showToast("error", "Server error while adding option.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center items-start p-6">
      {toast.show && (
        <div
          className={`fixed top-16 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all z-50 ${
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

      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-10 border border-gray-200 relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <IoOptionsOutline className="text-blue-600" size={30} />
            <h1 className="text-2xl font-semibold text-gray-800">
              Add Variant Option
            </h1>
          </div>
          <button
            onClick={() => navigate("/manage-variant-options")}
            className="flex items-center text-gray-600 hover:text-gray-900 text-sm"
          >
            <HiOutlineArrowLeft className="mr-1" /> Back
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-8">
          Add a new variant option for your products.  
          Example: <strong>Name:</strong> Color, <strong>Values:</strong> Red, Blue, Green
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">
              Option Name
            </label>
            <input
              type="text"
              value={optionName}
              onChange={(e) => setOptionName(e.target.value)}
              placeholder="e.g. Color, Size, Material"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">
              Option Values (comma-separated)
            </label>
            <input
              type="text"
              value={optionValues}
              onChange={(e) => setOptionValues(e.target.value)}
              placeholder="e.g. Red, Blue, Green"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/manage-variant-options")}
              className="px-5 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-md text-white font-medium flex items-center ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Save Option"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddVariantOption;
