import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TopProductsHistory = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState();
  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      if (decoded?.payLoad?.role) {
        setRole(decoded.payLoad.role);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

 const fetchData = async () => {
  try {
    setLoading(true);

    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");

    const url =
      role === "Master Admin" || role === "Dev Admin"
        ? "http://localhost:5000/product/top-products-history-admin"
        : "http://localhost:5000/product/top-products-history";

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "x-api-secret": apiSecretKey,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    setData(result.data || []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  // ✅ LOAD ON PAGE MOUNT
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Top Products (All Time)</h1>

        <button onClick={() => navigate(-1)} className="text-sm text-blue-600">
          ← Back
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left p-3">Product</th>
              <th className="text-center p-3">Units</th>
              <th className="text-center p-3">Revenue</th>
              <th className="text-center p-3">Conversion</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, i) => (
                <tr key={i} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 font-semibold">{item.productName}</td>

                  <td className="text-center font-medium">{item.units || 0}</td>

                  <td className="text-center font-medium">
                    ${item.revenue?.toFixed(2) || 0}
                  </td>

                  <td className="text-center">
                    {item.conversionRate ? `${item.conversionRate}%` : "0%"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-400">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProductsHistory;
