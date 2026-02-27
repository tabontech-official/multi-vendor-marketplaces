import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatch();
  }, []);

  const fetchBatch = async () => {
    try {
      const res = await axios.get(
        `https://multi-vendor-marketplace.vercel.app/product/batch/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
          },
        },
      );

      setBatch(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Professional Loader
  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading batch details...
          </p>
        </div>
      </div>
    );

  if (!batch)
    return (
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
        >
          ← Back
        </button>
        <p className="text-red-500 font-medium">Batch not found</p>
      </div>
    );
  const formatErrorMessage = (message) => {
    if (!message) return "-";

    try {
      const cleaned = message.replace("Request failed: ", "");
      const parsed = JSON.parse(cleaned);

      if (parsed?.errors?.image?.length) {
        let errorText = parsed.errors.image[0];

        const arrayMatch = errorText.match(/\[(.*)\]/);

        if (arrayMatch && arrayMatch[1]) {
          errorText = arrayMatch[1]
            .replace(/\\\"/g, "")
            .replace(/^\"|\"$/g, "");
        }

        return errorText;
      }

      return message;
    } catch (err) {
      return message;
    }
  };
  return (
    <div className="p-6">
      {/* ✅ Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm transition"
      >
        ← Back
      </button>

      <h1 className="text-xl font-semibold mb-6">
        Batch Details - {batch.batchNo}
      </h1>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Handle</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Started</th>
              <th className="px-4 py-3">Completed</th>
            </tr>
          </thead>

          <tbody>
            {batch.results?.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No product results found
                </td>
              </tr>
            ) : (
              batch.results?.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.handle}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.status === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-red-600 max-w-md break-words">
                    {formatErrorMessage(item.message)}{" "}
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {item.startedAt
                      ? new Date(item.startedAt).toLocaleString()
                      : "-"}
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {item.completedAt
                      ? new Date(item.completedAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BatchDetails;
