import React, { useEffect, useState } from "react";
import { IoOptionsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

const ManageVariantOptions = () => {
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [error, setError] = useState("");
  const [selectedOptionIds, setSelectedOptionIds] = useState([]);
  const [file, setFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState({ show: false, option: null });
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/variantOption/getOptions"
        );
        const data = await response.json();
        if (response.ok) setOptions(data);
        else setError(data.message || "Failed to fetch options.");
      } catch (err) {
        console.error("Error fetching options:", err);
        setError("An error occurred while fetching options.");
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const handleExport = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/variantOption/getCsvForOptions"
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "variant_options_export.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else showToast("error", "Failed to export CSV.");
    } catch (error) {
      console.error("Export Error:", error);
    }
  };

  const handleImport = async () => {
    if (!file) return showToast("error", "Please select a CSV file first.");

    const formData = new FormData();
    formData.append("file", file);
    setIsImporting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/variantOption/importOptions",
        { method: "POST", body: formData }
      );

      const result = await response.json();
      if (response.ok) {
        showToast("success", `options imported successfully.`);
        setShowModal(false);
        setFile(null);

        const updated = await fetch(
          "http://localhost:5000/variantOption/getOptions"
        );
        setOptions(await updated.json());
      } else {
        showToast("error", result.message || "Failed to import CSV.");
      }
    } catch (error) {
      console.error("Import Error:", error);
      showToast("error", "Error importing CSV file.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeleteOptions = async () => {
    if (selectedOptionIds.length === 0)
      return showToast("error", "Please select at least one option to delete.");

    try {
      await axios.delete(
        "http://localhost:5000/variantOption/deleteOptions",
        {
          data: { optionIds: selectedOptionIds },
        }
      );
      showToast("success", "Selected options deleted!");
      setOptions((prev) =>
        prev.filter((opt) => !selectedOptionIds.includes(opt._id))
      );
      setSelectedOptionIds([]);
    } catch (error) {
      console.error("Delete Error:", error);
      showToast("error", "Error deleting options.");
    }
  };

//  const handleEditSave = async () => {
//   const { option } = editModal;

//   // Convert text → array (comma separated)
//   const finalOptionValues = editOptionValuesText
//     .split(",")
//     .map((v) => v.trim())
//     .filter(Boolean);

//   const finalOptionNames = editOptionNameText
//     .split(",")
//     .map((v) => v.trim())
//     .filter(Boolean);

//   // Validation
//   if (!option.name || finalOptionValues.length === 0) {
//     return showToast("error", "Please fill all fields correctly.");
//   }

//   // Prepare updated option
//   const updatedOption = {
//     ...option,
//     optionValues: finalOptionValues,
//     optionName: finalOptionNames,
//   };

//   try {
//     const response = await axios.put(
//       "http://localhost:5000/variantOption/updateOption",
//       updatedOption
//     );

//     if (response.status === 200) {
//       showToast("success", "Option updated successfully!");

//       // Update UI
//       setOptions((prev) =>
//         prev.map((opt) =>
//           opt._id === updatedOption._id ? updatedOption : opt
//         )
//       );

//       setEditModal({ show: false, option: null });
//     }
//   } catch (error) {
//     console.error("Update Error:", error);
//     showToast("error", "Failed to update option.");
//   }
// };

const handleEditSave = async () => {
  const { option } = editModal;

  const finalOptionValues = editOptionValuesText
    .split(",")
    .map(v => v.trim())
    .filter(Boolean);

  const finalOptionNames = editOptionNameText
    .split(",")
    .map(v => v.trim())
    .filter(Boolean);

  if (!option.name || finalOptionValues.length === 0) {
    return showToast("error", "Please fill all fields correctly.");
  }

  const updatedOption = {
    _id: option._id,
    name: option.name.trim(),
    optionName: finalOptionNames,     // ✅ array always
    optionValues: finalOptionValues,  // ✅ array always
  };

  try {
    const response = await axios.put(
      "http://localhost:5000/variantOption/updateOption",
      updatedOption
    );

    if (response.status === 200) {
      showToast("success", "Option updated successfully!");

      setOptions(prev =>
        prev.map(opt =>
          opt._id === option._id ? response.data.data : opt
        )
      );

      setEditModal({ show: false, option: null });
    }
  } catch (error) {
    console.error("Update Error:", error);
    showToast("error", "Failed to update option.");
  }
};

const [editOptionNameText, setEditOptionNameText] = useState("");
const [editOptionValuesText, setEditOptionValuesText] = useState("");
  return (
    <div className="p-6">
      {toast.show && (
        <div
          className={`fixed top-16 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white z-50`}
        >
          {toast.type === "success" ? (
            <HiOutlineCheckCircle className="w-6 h-6 mr-2" />
          ) : (
            <HiOutlineXCircle className="w-6 h-6 mr-2" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

     <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-gray-200 pb-4 gap-4">
  {/* LEFT: Title */}
  <div className="flex items-center gap-2">
    <IoOptionsOutline size={22} className="text-gray-600" />
    <div>
      <h1 className="font-semibold text-xl text-gray-900">
        Manage Variant Options
      </h1>
      <p className="text-sm text-gray-500">
        Create and manage product variant options
      </p>
    </div>
  </div>

  {/* RIGHT: Actions */}
  <div className="flex flex-wrap items-center justify-end gap-2">
    {selectedOptionIds.length > 0 && (
      <button
        onClick={handleDeleteOptions}
        className="h-8 px-3 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md shadow-sm"
      >
        Delete
      </button>
    )}

    <button
      onClick={handleExport}
      className="h-8 px-3 bg-gray-400 border border-gray-300 hover:bg-gray-500
        text-gray-800 text-sm font-medium rounded-md shadow-sm"
    >
      Export
    </button>

    <button
      onClick={() => setShowModal(true)}
      className="h-8 px-3 bg-gray-400 border border-gray-300 hover:bg-gray-500
        text-gray-800 text-sm font-medium rounded-md shadow-sm"
    >
      Import CSV
    </button>

    <button
      onClick={() => navigate("/add/option")}
      className="h-8 px-3 bg-gray-800 hover:bg-gray-900
        text-white text-sm font-medium rounded-md shadow-sm"
    >
      Add Option
    </button>
  </div>
</div>


      {error && <div className="text-red-500 mt-3">{error}</div>}

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading options...
        </div>
      ) : (
        <table className="w-full mt-4 border bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-100 text-left text-gray-600 text-sm">
            <tr>
              <th className="p-3">Select</th>
              <th className="p-3">Option Name</th>
              <th className="p-3">Allias</th>
              <th className="p-3">Option Values</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {options.length ? (
              options.map((option, i) => (
                <tr
                  key={option._id}
                  className={`border-b ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedOptionIds.includes(option._id)}
                      onChange={(e) =>
                        setSelectedOptionIds((prev) =>
                          e.target.checked
                            ? [...prev, option._id]
                            : prev.filter((id) => id !== option._id)
                        )
                      }
                    />
                  </td>
                  <td className="p-3 text-sm text-gray-800">{option.name}</td>

                  <td className="p-3 text-sm text-gray-800">
                    {Array.isArray(option.optionName)
                      ? option.optionName.join(", ")
                      : option.optionName}
                  </td>

                  <td className="p-3 text-sm text-gray-800">
                    {Array.isArray(option.optionValues)
                      ? option.optionValues.join(", ")
                      : option.optionValues}
                  </td>

                  <td className="p-3 text-right">
                   <button
  onClick={() => {
    setEditModal({
      show: true,
      option: { ...option },
    });

    // Prefill temporary states
    setEditOptionValuesText(
      Array.isArray(option.optionValues)
        ? option.optionValues.join(", ")
        : option.optionValues || ""
    );
    setEditOptionNameText(
      Array.isArray(option.optionName)
        ? option.optionName.join(", ")
        : option.optionName || ""
    );
  }}
  className="text-blue-500 hover:underline text-sm font-medium"
>
  Edit
</button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-gray-500 py-6 text-sm"
                >
                  No options found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

     <AnimatePresence>
  {showModal && (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative border border-gray-200"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Import Variant Options
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>

        {/* UPLOAD BOX */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6
            text-center cursor-pointer hover:border-gray-500
            transition bg-gray-50"
          onClick={() => document.getElementById("csvInput").click()}
        >
          <input
            id="csvInput"
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />

          {file ? (
            <p className="text-sm text-gray-800 font-medium">
              📄 {file.name}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Drag & drop or click to upload CSV
            </p>
          )}
        </div>

        {/* HELP */}
        <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
          <span>Need help with formatting?</span>
          <a
            href="/variant_options_sample.csv"
            download
            className="text-gray-800 font-medium hover:underline"
          >
            Download sample CSV
          </a>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setShowModal(false)}
            className="h-8 px-3 text-sm text-gray-600
              border border-gray-300 rounded-md
              hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleImport}
            disabled={isImporting}
            className={`h-8 px-4 rounded-md text-sm font-medium text-white shadow-sm transition
              ${
                isImporting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-900"
              }`}
          >
            {isImporting ? "Importing..." : "Upload"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


      <AnimatePresence>
        {editModal.show && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg w-full max-w-md p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <IoOptionsOutline className="text-gray-500" size={22} />
                Edit Variant Option
              </h2>

            <label className="text-sm text-gray-600 font-medium mb-4 block ">
                <span className="text-gray-700 font-medium">Option Name</span>
                <input
                  type="text"
                  value={editModal.option.name || ""}
                  onChange={(e) =>
                    setEditModal((prev) => ({
                      ...prev,
                      option: { ...prev.option, name: e.target.value },
                    }))
                  }
                  placeholder="e.g. Color, Size, Material"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1 focus:ring focus:ring-blue-100"
                />
              </label>

              {/* <label className="block mb-4">
                <span className="text-gray-700 font-medium">
                  Aliases (comma separated)
                </span>
                <input
                  type="text"
                  value={
                    Array.isArray(editModal.option.optionName)
                      ? editModal.option.optionName.join(", ")
                      : editModal.option.optionName || ""
                  }
                  onChange={(e) =>
                    setEditModal((prev) => ({
                      ...prev,
                      option: {
                        ...prev.option,
                        optionName: e.target.value
                          .split(",")
                          .map((v) => v.trim())
                          .filter(Boolean),
                      },
                    }))
                  }
                  placeholder="e.g. Kolour, Hue, Tone"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1 focus:ring focus:ring-blue-100"
                />
              </label> */}

            <label className="text-sm text-gray-600 font-medium mb-4 block">
  <span className="text-gray-700 font-medium">
    Aliases (comma separated)
  </span>

  <input
    type="text"
    value={editOptionNameText}
    onChange={(e) => setEditOptionNameText(e.target.value)}
    placeholder="e.g. Kolour, Hue, Tone"
    className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1 focus:ring focus:ring-blue-100"
  />
</label>
            <label className="text-sm text-gray-600 font-medium mb-4 block">
                <span className="text-gray-700 font-medium">
                  Option Values (comma separated)
                </span>
               <input
  type="text"
  value={editOptionValuesText}
  onChange={(e) => setEditOptionValuesText(e.target.value)}
  placeholder="e.g. Red, Blue, Green"
  className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1 focus:ring focus:ring-blue-100"
/>

              </label>

              <div className="flex justify-end space-x-3 mt-6 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setEditModal({ show: false, option: null })}
              className="px-3 py-1.5 text-gray-800 font-medium border bg-gray-400 border-gray-300 hover:bg-gray-500 rounded-md flex items-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageVariantOptions;
