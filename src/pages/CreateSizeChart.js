import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

const CreateSizeChart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state;

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userid");

  // Toast function
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 2500);
  };

  // If editing, pre-fill values
  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setPreview(editData.image);
    }
  }, [editData]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!name) return showToast("error", "Name is required");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("userId", userId);

    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);

      if (editData) {
        // UPDATE
        await axios.put(
          `https://multi-vendor-marketplace.vercel.app/size-chart/update/${editData._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        showToast("success", "Size chart updated!");
      } else {
        // CREATE
        await axios.post("https://multi-vendor-marketplace.vercel.app/size-chart/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        showToast("success", "Size chart created!");
      }

      setTimeout(() => navigate("/manage-size-chart"), 1500);
    } catch (err) {
      console.error(err);
      showToast("error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-16 z-30 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${
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

      <div className="p-6 mt-10 w-[600px] mx-auto border rounded-lg shadow-sm bg-white">
        <h1 className="text-xl font-semibold mb-4">
          {editData ? "Edit Size Chart" : "Create Size Chart"}
        </h1>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            placeholder="Enter chart title"
            className="border p-2 w-full rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Media */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Media</label>

          <div className="border border-dashed p-6 rounded-md flex flex-col items-center justify-center text-center">
            {!preview ? (
              <>
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Upload new
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImage}
                  />
                </label>
                <p className="text-xs mt-2 text-gray-500">
                  Accepts images only
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <img
                  src={preview}
                  alt="preview"
                  className="w-40 h-40 object-cover border rounded mb-3"
                />

                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Replace Image
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImage}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 w-full text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
        >
          {loading ? (
            <span className="loader-white"></span>
          ) : editData ? (
            "Update Size Chart"
          ) : (
            "Save Size Chart"
          )}
        </button>

        {/* Loader CSS */}
        <style>
          {`
          .loader-white {
            border: 3px solid rgba(255,255,255,0.3);
            border-top: 3px solid white;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          `}
        </style>
      </div>
    </div>
  );
};

export default CreateSizeChart;
