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
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(
          "https://multi-vendor-marketplace.vercel.app/variantOption/getOptions"
        );
        const data = await response.json();
        if (response.ok) setOptions(data);
        else setError(data.message || "Failed to fetch options.");
      } catch (err) {
        console.error("Error fetching options:", err);
        setError("An error occurred while fetching options.");
      }
    };
    fetchOptions();
  }, []);

  const handleExport = async () => {
    try {
      const response = await fetch(
        "https://multi-vendor-marketplace.vercel.app/variantOption/getCsvForOptions"
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
      } else {
        showToast("error","Failed to export CSV.");
      }
    } catch (error) {
      console.error("Export Error:", error);
    }
  };
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };
  const handleImport = async () => {
    if (!file) {
      showToast("error","Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setIsImporting(true);

    try {
      const response = await fetch(
        "https://multi-vendor-marketplace.vercel.app/variantOption/importOptions",
        { method: "POST", body: formData }
      );

      const result = await response.json();

      if (response.ok) {
        showToast("success",`${result.count} options imported successfully.`);
        setShowModal(false);
        setFile(null);
        const updated = await fetch(
          "https://multi-vendor-marketplace.vercel.app/variantOption/getOptions"
        );
        setOptions(await updated.json());
      } else {
        showToast("error",result.message || "Failed to import CSV.");
      }
    } catch (error) {
      console.error("Import Error:", error);
      showToast("error","Error importing CSV file.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeleteOptions = async () => {
    if (selectedOptionIds.length === 0)
      return showToast("error","Please select at least one option to delete.");

    try {
      await axios.delete(
        "https://multi-vendor-marketplace.vercel.app/variantOption/deleteOptions",
        {
          data: { optionIds: selectedOptionIds },
        }
      );
      showToast("success","Selected options deleted!");
      setOptions((prev) =>
        prev.filter((opt) => !selectedOptionIds.includes(opt._id))
      );
      setSelectedOptionIds([]);
    } catch (error) {
      console.error("Delete Error:", error);
      showToast("error","Error deleting options.");
    }
  };

  return (
    <div className="p-6">
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
      <div className="flex justify-between items-center pb-4 border-b">
        <div className="flex items-center space-x-2">
          <IoOptionsOutline size={26} className="text-gray-700" />
          <h1 className="font-semibold text-2xl text-gray-800">
            Variant Options
          </h1>
        </div>

        <div className="flex space-x-2 mt-4">
          {selectedOptionIds.length > 0 && (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={handleDeleteOptions}
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
        </div>
      </div>

      {error && <div className="text-red-500 mt-3">{error}</div>}

      <table className="w-full mt-4 border bg-white rounded-lg shadow-sm">
        <thead className="bg-gray-100 text-left text-gray-600 text-sm">
          <tr>
            <th className="p-3">Select</th>
            <th className="p-3">ID</th>
            <th className="p-3">Option Names</th>
            <th className="p-3">Option Values</th>
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
                <td className="p-3 text-sm text-gray-700">{option._id}</td>
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
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="text-center text-gray-500 py-6 text-sm"
              >
                No options found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
    </div>
  );
};

export default ManageVariantOptions;
