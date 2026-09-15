import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiPackage, FiShoppingBag } from "react-icons/fi";

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

  const isInventoryBatch = batch?.batchNo?.startsWith("INV-");

  const formatErrorMessage = (message) => {
    if (!message) return "-";

    const lower = message.toLowerCase();

    // 1️⃣ SKU trim error
    if (lower.includes("trim is not a function")) {
      return "Invalid SKU format in uploaded file.";
    }
    if (lower.includes("exceeded 2 calls per second")) {
      return "Request limit exceeded. Please retry this product or upload it again after a short wait.";
    }
    // 2️⃣ Socket hang up / timeout
    if (lower.includes("socket hang up")) {
      return "Connection to Shopify timed out. Please try again.";
    }

    if (lower.includes("failed, reason")) {
      return "Shopify request failed. Please retry the batch.";
    }

    // 3️⃣ Remove full Shopify URLs
    if (lower.includes("https://")) {
      return "Shopify API request failed.";
    }

    return message;
  };

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

  return (
    <div className="p-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm transition"
      >
        ← Back
      </button>

      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        {isInventoryBatch ? (
          <FiPackage size={20} className="text-blue-600" />
        ) : (
          <FiShoppingBag size={20} className="text-blue-600" />
        )}

        <h1 className="text-xl font-semibold">
          Batch Details - {batch.batchNo}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">
                {isInventoryBatch ? "SKU" : "Handle"}
              </th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Started</th>
              <th className="px-4 py-3">Completed</th>
            </tr>
          </thead>

          {/* <tbody>
            {batch.results?.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No results found
                </td>
              </tr>
            ) : (
              batch.results.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    {isInventoryBatch ? item.sku : item.handle}
                  </td>

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
                    {formatErrorMessage(item.message)}
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
          </tbody> */}
          <tbody>
            {batch.results?.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No results found
                </td>
              </tr>
            ) : (
              batch.results.map((item) => {
                const duration =
                  item.startedAt && item.completedAt
                    ? Math.floor(
                        (new Date(item.completedAt) -
                          new Date(item.startedAt)) /
                          1000,
                      )
                    : null;

                return (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    {/* SKU / Handle */}
                    <td className="px-4 py-3 font-medium">
                      {isInventoryBatch ? item.sku : item.handle}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status === "success" ? "Success" : "Failed"}
                      </span>
                    </td>

                    {/* Message Column */}
                    {/* <td className="px-4 py-3 max-w-md">
                      {item.status === "error" ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-md">
                          {formatErrorMessage(item.message)}
                        </div>
                      ) : (
                        <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-2 rounded-md">
                          Successfully processed
                          {duration !== null && (
                            <div className="text-green-600 mt-1">
                              Duration:{" "}
                              {duration > 60
                                ? `${Math.floor(duration / 60)}m ${duration % 60}s`
                                : `${duration}s`}
                            </div>
                          )}
                        </div>
                      )}
                    </td> */}

                    <td className="px-4 py-3 max-w-md">
                      {item.status === "error" ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-md">
                          {formatErrorMessage(item.message)}
                        </div>
                      ) : (
                        <div
                          className={`border text-xs px-3 py-3 rounded-md ${
                            item.warnings?.length > 0
                              ? "bg-yellow-50 border-yellow-300 text-yellow-800"
                              : "bg-green-50 border-green-200 text-green-700"
                          }`}
                        >
                          <div className="font-semibold">
                            {item.warnings?.length > 0
                              ? "Completed with Warning"
                              : "Successfully Completed"}
                          </div>

                          {duration !== null && (
                            <div className="mt-1 text-xs opacity-80">
                              Completed in{" "}
                              {duration > 60
                                ? `${Math.floor(duration / 60)}m ${duration % 60}s`
                                : `${duration}s`}
                            </div>
                          )}

                          {item.warnings?.length > 0 && (
                            <ul className="mt-2 list-disc list-inside space-y-1">
                              {item.warnings.map((warn, index) => (
                                <li key={index}>
                                  Invalid category:{" "}
                                  <span className="font-medium">{warn}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </td>
                    {/* Started */}
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {item.startedAt
                        ? new Date(item.startedAt).toLocaleString()
                        : "-"}
                    </td>

                    {/* Completed */}
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {item.completedAt
                        ? new Date(item.completedAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      {/* <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <p className="text-gray-500 text-xs uppercase">Total</p>
          <p className="text-lg font-semibold">
            {batch.summary?.total || 0}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-green-600 text-xs uppercase">Success</p>
          <p className="text-lg font-semibold text-green-700">
            {batch.summary?.success || 0}
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-red-600 text-xs uppercase">Failed</p>
          <p className="text-lg font-semibold text-red-700">
            {batch.summary?.failed || 0}
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default BatchDetails;
