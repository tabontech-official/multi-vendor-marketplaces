import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const FullItem = () => {
  const location = useLocation();
  const { order, productName, sku,index } = location.state || {};
    const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFulfill = async () => {
  setLoading(true);
  setMessage("");

  try {
    const response = await fetch("http://localhost:5000/order/fullFillOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ orderId: order.orderId })
    });

    const result = await response.json();

    if (response.ok) {
      setMessage("✅ Item fulfilled and inventory updated!");
    } else {
      setMessage(`❌ Error: ${result.error || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Fulfillment error:", error);
    setMessage("❌ Server error. Please try again.");
  }

  setLoading(false);
};

  return (
    <div className="p-6 min-h-screen">
      <div className="text-sm text-gray-500 mb-2">
        #{index} &rsaquo;{" "}
        <span className="text-gray-900 font-semibold">Fulfill item</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white shadow border rounded-lg border-gray-200 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-semibold rounded">
                Unfulfilled
              </span>
              <span className="text-sm font-medium">#{index}</span>
            </div>
            <div className="border rounded-lg p-2">
              <div className="text-sm font-semibold border-b-1">
                {order.customer.first_name} {order.customer.last_name}
              </div>

              <div className="flex items-center gap-4 mt-3">
                
                <div>
                  {order?.lineItems?.map((item, index) => {
                    const productName = item.name?.split(" - ")[0]; 
                    const variantOptions =
                      item.variant_title?.split(" / ") || [];

                    return (
                      <div key={index} className="flex items-center gap-4 mt-3">
                        <img
                          src={item.image?.src}
                          alt={item.image?.alt || "Variant Image"}
                          className="w-16 h-16 rounded object-cover border"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {productName}
                          </div>

                          <div className="text-xs text-gray-500 space-x-1 mt-1 flex flex-wrap gap-1">
                            {variantOptions.map((option, i) => (
                              <span
                                key={i}
                                className="bg-gray-200 px-2 py-0.5 rounded"
                              >
                                {option}
                              </span>
                            ))}
                          </div>

                          <div className="text-xs text-gray-500 mt-1">
                            SKU: {item.sku}
                          </div>
                        </div>

                       
                      </div>
                    );
                  })}
                </div>
                <div className="ml-auto text-sm text-gray-500 text-right">
                  <div>{order.lineItems[0].grams / 1000} kg</div>
                  <div>
                    {order.lineItems[0].quantity} of{" "}
                    {order.lineItems[0].quantity}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow p-4 space-y-4">
            <div className="text-sm font-medium">Tracking information</div>
            <div className="bg-blue-50 p-3 text-xs text-blue-800 rounded border border-blue-200">
              <strong>Add tracking</strong> to improve customer satisfaction.
              Orders with tracking let customers receive delivery updates and
              reduce support requests.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Tracking number"
                className="border px-3 py-2 rounded w-full text-sm"
              />
              <select className="border px-3 py-2 rounded w-full text-sm">
                <option>Shipping carrier</option>
                <option>FedEx</option>
                <option>DHL</option>
                <option>UPS</option>
              </select>
            </div>
            {/* <button className="text-blue-600 text-sm mt-2 hover:underline">
              + Add another tracking number
            </button> */}
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 shadow rounded-lg p-4 space-y-2 text-sm">
            <div className="font-medium">Shipping address</div>
            <div>{order.customer.first_name}{order.customer.last_name}</div>
            <div>{order.customer?.default_address.address1}</div>
            <div>{order.customer?.default_address.city} {order.customer?.default_address.province} {order.customer?.default_address.province_code}</div>
            <div>{order.customer?.default_address.country_name}</div>
            {/* <a href="#" className="text-blue-600 text-xs hover:underline">
              View map
            </a> */}
            <div className="text-xs text-gray-500">
              The customer selected <strong>Standard</strong> at checkout
            </div>
          </div>

          <div className="border border-gray-200 shadow rounded-lg p-4 space-y-2 text-sm">
            <div className="font-medium">Summary</div>
            <div>Fulfilling from Shop location</div>
            <div>{order?.lineItems[0].quantity} of  {order?.lineItems[0].quantity}</div>

            <label className="flex items-center gap-2 text-sm mt-2">
              <input type="checkbox" />
              Send a <span className="text-blue-600">notification</span> to the
              customer
            </label>

           <button
  onClick={handleFulfill}
  disabled={loading}
  className={`w-full mt-4 py-2 rounded transition ${
    loading ? "bg-gray-400" : "bg-black hover:bg-gray-900"
  } text-white`}
>
  {loading ? "Fulfilling..." : "Fulfill item"}
</button>

{message && (
  <div className="text-sm mt-2 text-center text-gray-700">
    {message}
  </div>
)}

          </div>
        </div>
      </div>
    </div>
  );
};

export default FullItem;
 