import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

const PayoutDetails = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const payoutDate = query.get("payoutDate");
  const status = query.get("status");

  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    charges: 0,
    refunds: 0,
    fees: 0,
    net: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://multi-vendor-marketplace.vercel.app/order/getPayoutOrders?payoutDate=${encodeURIComponent(
            payoutDate
          )}&status=${status}`
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

        setOrders(fetchedOrders);
        setSummary({ charges, refunds, fees, net });
      } catch (err) {
        console.error("Error fetching payout orders:", err);
      }
    };

    if (payoutDate && status) fetchData();
  }, [payoutDate, status]);

  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState("");

  const openReferencePopup = () => setOpen(true);
  const closeReferencePopup = () => setOpen(false);
  const handleSave = () => {
    console.log("📌 Reference saved:", reference);
    setReference(""); // clear input
    closeReferencePopup();
  };
  return (
    <div className="p-6 bg-[#f6f6f7] min-h-screen">
      <div className="flex justify-end mb-2">
        <button
          className="bg-white px-3 py-2 text-sm border border-gray-300 rounded-xl"
          onClick={openReferencePopup}
        >
          Add reference
        </button>
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
              <strong>Bank reference:</strong> Not available
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
  {orders.length > 0 ? (
    orders
      .filter((item) => item.net !== 0) // Skip net = 0 orders
      .map((item, i) => (
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
</tbody>

        </table>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add Reference</h2>
              <button
                onClick={closeReferencePopup}
                className="text-gray-500 hover:text-red-600 text-xl"
              >
                &times;
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter reference..."
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeReferencePopup}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutDetails;
