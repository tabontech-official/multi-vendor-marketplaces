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

  const handleEditSave = async () => {
    const { option } = editModal;
    if (!option.name || !option.optionValues?.length) {
      return showToast("error", "Please fill all fields correctly.");
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/variantOption/updateOption",
        option
      );

      if (response.status === 200) {
        showToast("success", "Option updated successfully!");
        setOptions((prev) =>
          prev.map((opt) => (opt._id === option._id ? option : opt))
        );
        setEditModal({ show: false, option: null });
      }
    } catch (error) {
      console.error("Update Error:", error);
      showToast("error", "Failed to update option.");
    }
  };

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

      <div className="flex justify-between items-center pb-4 border-b">
        <div className="flex items-center space-x-2">
          <IoOptionsOutline size={26} className="text-gray-700" />
          <h1 className="font-semibold text-2xl text-gray-800">
            Manage Variant Options
          </h1>
        </div>

        <div className="flex space-x-2">
          {selectedOptionIds.length > 0 && (
            <button
              onClick={handleDeleteOptions}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleExport}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Export
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Import CSV
          </button>
          <button
            onClick={() => navigate("/add/option")}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
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
                      onClick={() =>
                        setEditModal({
                          show: true,
                          option: { ...option },
                        })
                      }
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Import Variant Options
              </h2>

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition"
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
                  <p className="text-gray-700">📄 {file.name}</p>
                ) : (
                  <p className="text-gray-500">
                    Drag & drop or click to choose a CSV file
                  </p>
                )}
              </div>

              <div className="mt-4 text-sm text-gray-600 flex items-center justify-between">
                <p>Need help with formatting?</p>
                <a
                  href="/variant_options_sample.csv"
                  download
                  className="text-blue-500 font-medium hover:underline"
                >
                  Download sample CSV
                </a>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={isImporting}
                  className={`px-4 py-2 rounded-md text-white ${
                    isImporting
                      ? "bg-gray-400"
                      : "bg-blue-500 hover:bg-blue-600"
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
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <IoOptionsOutline className="text-blue-500" size={22} />
                Edit Variant Option
              </h2>

              <label className="block mb-4">
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

              <label className="block mb-4">
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
              </label>

              <label className="block mb-4">
                <span className="text-gray-700 font-medium">
                  Option Values (comma separated)
                </span>
                <input
                  type="text"
                  value={
                    Array.isArray(editModal.option.optionValues)
                      ? editModal.option.optionValues.join(", ")
                      : editModal.option.optionValues || ""
                  }
                  onChange={(e) =>
                    setEditModal((prev) => ({
                      ...prev,
                      option: {
                        ...prev.option,
                        optionValues: e.target.value
                          .split(",")
                          .map((v) => v.trim())
                          .filter(Boolean),
                      },
                    }))
                  }
                  placeholder="e.g. Red, Blue, Green"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1 focus:ring focus:ring-blue-100"
                />
              </label>

              <div className="flex justify-end space-x-3 mt-6 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setEditModal({ show: false, option: null })}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
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
