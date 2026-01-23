import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { jwtDecode } from "jwt-decode";

const ManageSizeChart = () => {
  const navigate = useNavigate();
  const [charts, setCharts] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [role, setRole] = useState("");

  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 2500);
  };

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) {
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded?.payLoad?.role) {
        setRole(decoded.payLoad.role);
      } else {
        setRole("");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    } finally {
    }
  }, []);

  useEffect(() => {
    if (role) fetchCharts();
  }, [role]);

  const fetchCharts = async () => {
    try {
      const userId = localStorage.getItem("userid");

      let url = "";

      if (role === "Dev Admin" || role === "Master Admin") {
        url =
          "https://multi-vendor-marketplace.vercel.app/size-chart/admin/all";
      } else {
        url = `https://multi-vendor-marketplace.vercel.app/size-chart/all/${userId}`;
      }

      const res = await axios.get(url);
      setCharts(res.data.data);
    } catch (err) {
      console.error("Error fetching charts", err);
      showToast("error", "Failed to load size charts");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const deleteChart = async () => {
    try {
      setLoadingDelete(true);

      await axios.delete(
        `https://multi-vendor-marketplace.vercel.app/size-chart/delete/${deleteId}`,
      );

      showToast("success", "Size chart deleted successfully");
      setShowModal(false);
      fetchCharts();
    } catch (err) {
      console.log("Delete error:", err);
      showToast("error", "Failed to delete");
    } finally {
      setLoadingDelete(false);
    }
  };

  const editChart = (chart) => {
    navigate("/create-size-chart", { state: chart });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Size Chart Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all your product size charts in one place.
          </p>
        </div>

        <button
          onClick={() => navigate("/create-size-chart")}
          className="bg-blue-500 text-white px-5 py-2.5 rounded-md shadow hover:bg-blue-600 transition"
        >
          + Create Size Chart
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Total Size Charts: {charts.length}
          </h2>

          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-2 rounded-md text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>

                {(role === "Dev Admin" || role === "Master Admin") && (
                  <th className="p-3 text-left">Publisher</th>
                )}

                <th className="p-3 text-left">Published</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {charts.map((chart, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">
                    <img
                      src={chart.image}
                      alt="size chart"
                      className="w-16 h-16 object-cover border rounded-lg shadow-sm"
                    />
                  </td>

                  <td className="p-3 font-medium text-gray-800">
                    {chart.name}
                  </td>

                  {(role === "Dev Admin" || role === "Master Admin") && (
                    <td className="p-3 text-gray-700">
                      {chart.userName || "Unknown"}
                    </td>
                  )}

                  <td className="p-3 text-gray-600">
                    {new Date(chart.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editChart(chart)}
                        className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md shadow hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => confirmDelete(chart._id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-md shadow hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {charts.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-5 text-center text-gray-500">
                    No size charts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Delete Size Chart?
            </h3>
            <p className="text-gray-600 mb-5">
              This action cannot be undone. Are you sure you want to delete?
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={deleteChart}
                className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center"
                disabled={loadingDelete}
              >
                {loadingDelete ? (
                  <span className="loader border-white"></span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
        .loader {
          border: 3px solid rgba(255,255,255,0.3);
          border-top: 3px solid #fff;
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
  );
};

export default ManageSizeChart;
