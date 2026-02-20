import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { FaArrowLeft } from "react-icons/fa";

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
          `http://localhost:5000/size-chart/update/${editData._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        showToast("success", "Size chart updated!");
      } else {
        // CREATE
        await axios.post(
          "http://localhost:5000/size-chart/create",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

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
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
  <button
    onClick={() => navigate(-1)}
    className="p-2 rounded-md hover:bg-gray-100 transition"
  >
    <FaArrowLeft className="text-gray-700" />
  </button>

  <div>
    <h1 className="text-lg font-semibold text-gray-900">
      {editData ? "Edit Size Chart" : "Create Size Chart"}
    </h1>
    <p className="text-xs text-gray-500">
      {editData
        ? "Update existing size chart"
        : "Create a new size chart for products"}
    </p>
  </div>
</div>

        {/* <h1 className="text-xl font-semibold text-gray-900 mb-4">
          {editData ? "Edit Size Chart" : "Create Size Chart"}
        </h1> */}

        {/* Title */}
        <div className="mb-6">
          <label className="text-sm text-gray-600 font-medium mb-2 block ">
            Title
          </label>
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
          <label className="text-sm text-gray-600 font-medium mb-2 block ">
            Media
          </label>

          <div className="border border-dashed p-6 rounded-md flex flex-col items-center justify-center text-center">
            {!preview ? (
              <>
                <label  className="bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
>
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

                <label className="cursor-pointer  bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50">
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
          className="w-full bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
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
