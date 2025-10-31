import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

const AddVariantOption = () => {
  const navigate = useNavigate();

  // --- State variables ---
  const [optionNames, setOptionNames] = useState([""]); // multiple names
  const [optionValues, setOptionValues] = useState([""]); // multiple values
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  // --- Toast helper ---
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  // --- Handlers for dynamic fields ---
  const addNameField = () => setOptionNames([...optionNames, ""]);
  const removeName = (index) =>
    setOptionNames(optionNames.filter((_, i) => i !== index));
  const handleNameChange = (index, value) => {
    const updated = [...optionNames];
    updated[index] = value;
    setOptionNames(updated);
  };

  const addValueField = () => setOptionValues([...optionValues, ""]);
  const removeValue = (index) =>
    setOptionValues(optionValues.filter((_, i) => i !== index));
  const handleValueChange = (index, value) => {
    const updated = [...optionValues];
    updated[index] = value;
    setOptionValues(updated);
  };

  // --- Submit to backend ---
  // --- Submit to backend ---
const handleSubmit = async (e) => {
  e.preventDefault();

  const cleanNames = optionNames
    .map((n) => n.trim())
    .filter(Boolean)
    .join(",") 
    .split(",") 
    .map((v) => v.trim())
    .filter(Boolean);

  const cleanValues = optionValues
    .map((v) => v.trim())
    .filter(Boolean)
    .join(",")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  if (cleanNames.length === 0) {
    showToast("error", "Please add at least one option name.");
    return;
  }
  if (cleanValues.length === 0) {
    showToast("error", "Please add at least one option value.");
    return;
  }

 
  const middleIndex = Math.floor(cleanNames.length / 2);
  const nameGroups = [cleanNames.slice(0, middleIndex), cleanNames.slice(middleIndex)];
  const valueGroups = [cleanValues.slice(0, Math.floor(cleanValues.length / 2)), cleanValues.slice(Math.floor(cleanValues.length / 2))];

  setLoading(true);

  try {
    const responses = await Promise.all(
      nameGroups.map(async (names, index) => {
        const res = await fetch("http://localhost:5000/variantOption/addOptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            optionName: names,
            optionValues: valueGroups[index] || [],
          }),
        });
        return res.json();
      })
    );

    console.log("Saved options:", responses);

    showToast("success", "All options added successfully!");
    setTimeout(() => navigate("/manage-options"), 1500);
  } catch (err) {
    console.error("Add option error:", err);
    showToast("error", "Server error while adding option.");
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-16 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${
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

      {/* Form Card */}
      <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Variant Option
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Option Names */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-sm font-medium">
              Option Names
            </label>
            {optionNames.map((name, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`Enter name ${index + 1} (e.g., Color, Kolour)`}
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                />
                {optionNames.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeName(index)}
                    className="text-red-500 hover:text-red-700 text-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addNameField}
              className="text-blue-600 text-sm mt-1 hover:underline"
            >
              + Add another name
            </button>
          </div>

          {/* Option Values */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-sm font-medium">
              Option Values
            </label>
            {optionValues.map((value, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  placeholder={`Enter value ${index + 1} (e.g., Red, Blue, Green)`}
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                />
                {optionValues.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeValue(index)}
                    className="text-red-500 hover:text-red-700 text-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addValueField}
              className="text-blue-600 text-sm mt-1 hover:underline"
            >
              + Add another value
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate("/manage-variant-options")}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white font-medium ${
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
