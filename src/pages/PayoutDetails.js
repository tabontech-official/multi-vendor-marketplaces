import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { HiOutlineRefresh } from "react-icons/hi";
import { jwtDecode } from "jwt-decode";

const PayoutDetails = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const payoutDate = query.get("payoutDate");
  const status = query.get("status");
  const merchantId = query.get("merchantId");

  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    charges: 0,
    refunds: 0,
    fees: 0,
    net: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `https://multi-vendor-marketplace.vercel.app/order/getPayoutOrders?payoutDate=${encodeURIComponent(
            payoutDate
          )}&status=${status}&userId=${merchantId}`
        );
        const json = await res.json();

        const fetchedOrders =
          (json.payouts && json.payouts[0] && json.payouts[0].orders) || [];

        fetchedOrders.forEach((o) => {
          o.fee = Number((o.amount * 0.1).toFixed(2));
          o.net = Number((o.amount - o.fee).toFixed(2));
        });

        const charges = fetchedOrders.reduce(
          (sum, o) => sum + (o.amount || 0),
          0
        );
        const fees = fetchedOrders.reduce((sum, o) => sum + (o.fee || 0), 0);
        const refunds = fetchedOrders.reduce(
          (sum, o) => sum + (o.refund || 0),
          0
        );
        const net = charges - fees;
        const referenceNo = fetchedOrders[0]?.referenceNo || "";

        setOrders(fetchedOrders);
        setSummary({ charges, refunds, fees, net, referenceNo });
      } catch (err) {
        console.error("Error fetching payout orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (payoutDate && status) fetchData();
  }, [payoutDate, status]);

  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState("");

  const openReferencePopup = () => setOpen(true);
  const closeReferencePopup = () => setOpen(false);
  const handleSave = async () => {
    const UserId = merchantId;
    try {
      const res = await fetch(
        "https://multi-vendor-marketplace.vercel.app/order/addReferenceNumber",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserId,
            referenceNo: reference,
          }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        alert("Reference number added successfully!");
        closeReferencePopup();
      } else {
        alert(result.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Failed to update reference numbers:", err);
      alert("Error occurred while updating reference numbers.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (token) {
      const decoded = jwtDecode(token);
      const role = decoded?.payLoad?.role || "";
      setUserRole(role);
    }
  }, []);
  return (
    <div className="p-6 bg-[#f6f6f7] min-h-screen">
      <div className="flex justify-end mb-2">
        {(userRole === "Master Admin" || userRole === "Dev Admin") && (
          <button
            className="bg-white px-3 py-2 text-sm border border-gray-300 rounded-xl"
            onClick={openReferencePopup}
          >
            Add reference
          </button>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-5 mb-6 flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">
            ${summary.net.toFixed(2)} AUD
          </h1>
          {/* <p className="text-gray-500 mb-4">Shopify Payments</p> */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Bank account:</strong> PayPal
            </p>
            <p>
              <strong>Bank reference:</strong> {summary.referenceNo}
            </p>
          </div>
        </div>
        <div className="w-full md:w-[240px] border-l md:pl-6 mt-6 md:mt-0">
          <h2 className="text-sm font-semibold mb-2">Summary</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <p>Charges: ${summary.charges.toFixed(2)}</p>
            <p>Refunds: ${summary.refunds.toFixed(2)}</p>
            <p>Fees: ${summary.fees.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Order No</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Fee</th>
              <th className="p-3">Net</th>
            </tr>
          </thead>
          {/* <tbody>
            {orders.length > 0 ? (
              orders.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {dayjs(item.createdAt).format("MMM D, YYYY")}
                  </td>
                  <td className="p-3 text-blue-600 underline cursor-pointer">
                    #{item.shopifyOrderNo}
                  </td>
                  <td className="p-3">${item.amount.toFixed(2)}</td>
                  <td className="p-3">${item.fee.toFixed(2)}</td>
                  <td className="p-3">${item.net.toFixed(2)} AUD</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No orders found for this payout.
                </td>
              </tr>
            )}
          </tbody> */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500">
                  <div className="inline-flex items-center gap-2 justify-center">
                    <HiOutlineRefresh className="animate-spin text-xl" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.flatMap((order, i) =>
                (order.products || []).map((product, j) => (
                  <tr
                    key={`${i}-${j}`}
                    className={`border-b hover:bg-gray-50 ${
                      product.cancelled ? "line-through text-gray-400" : ""
                    }`}
                  >
                    <td className="p-3">
                      {dayjs(order.createdAt).format("MMM D, YYYY")}
                    </td>
                    <td className="p-3 text-blue-600 underline cursor-pointer">
                      #{order.shopifyOrderNo}
                    </td>
                    <td className="p-3">${product.total.toFixed(2)}</td>
                    <td className="p-3">${(product.total * 0.1).toFixed(2)}</td>
                    <td className="p-3">
                      ${(product.total * 0.9).toFixed(2)} AUD
                    </td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No orders found for this payout.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {open && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeReferencePopup}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fadeInUp p-8 relative border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeReferencePopup}
              className="absolute top-3 right-3 text-gray-400 hover:text-black transition"
            >
              ✕
            </button>

            <div className="text-center">
              <div className="text-3xl mb-3 text-blue-600">🏷️</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Add Reference
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Enter the bank reference number for this payout group.
              </p>

              <input
                type="text"
                placeholder="e.g. 12345678"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition mb-6"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />

              <div className="flex justify-center gap-4">
                <button
                  onClick={closeReferencePopup}
                  className="px-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutDetails;
