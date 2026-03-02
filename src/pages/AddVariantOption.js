import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowLeft,
  HiOutlinePlusCircle,
  HiOutlineRefresh,
} from "react-icons/hi";
import { IoOptionsOutline } from "react-icons/io5";
import { FiAlertTriangle } from "react-icons/fi";

const AddVariantOption = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [aliases, setAliases] = useState("");
  const [optionValues, setOptionValues] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const [existingOptions, setExistingOptions] = useState([]);
  const [existingMatch, setExistingMatch] = useState(null); // matched existing option

  // 🔹 Fetch all options once on load
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/variantOption/getOptions",
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setExistingOptions(data);
        }
      } catch (err) {
        console.error("Error fetching options:", err);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (!name.trim()) {
      setExistingMatch(null);
      return;
    }

    const match = existingOptions.find(
      (opt) => opt.name?.toLowerCase() === name.trim().toLowerCase(),
    );

    setExistingMatch(match || null);
  }, [name, existingOptions]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const handleSubmit = async (replaceExisting = false) => {
    const cleanName = name.trim();
    const cleanAliases = aliases
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
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
      let finalAliases = cleanAliases;

      if (existingMatch && !replaceExisting) {
        const existingAliases = Array.isArray(existingMatch.optionName)
          ? existingMatch.optionName
          : [];
        finalAliases = [...new Set([...existingAliases, ...cleanAliases])];
      }

      const res = await fetch(
        "http://localhost:5000/variantOption/addOptions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: cleanName,
            aliases: finalAliases,
            optionValues: cleanValues,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        showToast("success", "Variant option saved successfully!");
        setName("");
        setAliases("");
        setOptionValues("");
        setExistingMatch(null);
        setTimeout(() => navigate("/manage-options"), 1500);
      } else {
        showToast("error", data.message || "Failed to save option.");
      }
    } catch (error) {
      console.error("Add option error:", error);
      showToast("error", "Server error while saving option.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToExisting = () => {
    if (!existingMatch) return;
    const existingAliases = Array.isArray(existingMatch.optionName)
      ? existingMatch.optionName.join(", ")
      : "";
    setAliases(existingAliases);
    showToast("info", "Existing aliases loaded. Add more if needed.");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center items-start p-6">
      {toast.show && (
        <div
          className={`fixed top-16 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all z-50 ${
            toast.type === "success"
              ? "bg-green-500"
              : toast.type === "info"
                ? "bg-blue-500"
                : "bg-red-500"
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
            <IoOptionsOutline className="text-gray-900" size={30} />
            <h1 className="text-xl font-semibold text-gray-900 mb-0.5">
              Add Variant Option
            </h1>
          </div>
          <button
            onClick={() => navigate("/manage-variant-options")}
            className="flex items-center font-medium text-gray-600 hover:text-gray-900 text-sm"
          >
            <HiOutlineArrowLeft className="mr-1" /> Back
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-8">
          Add a new variant option for your products.
          <br />
          Example: <strong>Name:</strong> Color, <strong>Aliases:</strong>{" "}
          Kolour, Hue,
          <strong>Values:</strong> Red, Blue, Green
        </p>

        {/* FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(false);
          }}
          className="space-y-6"
        >
          {/* Option Name */}
          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block">
              Option Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Color, Size, Material"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
            />

            {existingMatch && (
              <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-4 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <FiAlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-amber-800 font-medium">
                      Option "<strong>{existingMatch.name}</strong>" already
                      exists.
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      You can either <strong>add new aliases</strong> to it or{" "}
                      <strong>replace it completely</strong>.
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        type="button"
                        onClick={handleAddToExisting}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        <HiOutlinePlusCircle className="w-4 h-4" />
                        Add to Existing
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubmit(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        <HiOutlineRefresh className="w-4 h-4" />
                        Replace Existing
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block">
              Aliases (comma-separated)
            </label>
            <input
              type="text"
              value={aliases}
              onChange={(e) => setAliases(e.target.value)}
              placeholder="e.g. Kolour, Hue, Tone"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Option Values */}
          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block">
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

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/manage-options")}
              className="px-3 py-1.5 text-gray-800 font-medium border bg-gray-400 border-gray-300 hover:bg-gray-500 rounded-md flex items-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-3 py-1.5 rounded-md text-white font-medium flex items-center ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#18181b] text-white  rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
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
