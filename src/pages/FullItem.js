import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const FullItem = () => {
  const location = useLocation();
  const { order, productName, sku, index } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");



  const handleFulfill = async () => {
    setLoading(true);
    setMessage("");

    const itemsToFulfill = order.lineItems
      .filter((item) => item.fulfillment_status === null) 
      .map((item) => {
        const qty = quantities[item.id];
        if (qty > 0) {
          return {
            lineItemId: item.id,
            quantity: qty,
          };
        }
        return null;
      })
      .filter(Boolean)

    if (itemsToFulfill.length === 0) {
      setMessage(" No valid unfulfilled items selected.");
      setLoading(false);
      return;
    }

    const payload = {
      orderId: order.orderId,
      trackingInfo: {
        number: trackingNumber,
        company: carrier,
        url:
          carrier && trackingNumber
            ? `https://track.${carrier.toLowerCase()}.com/${trackingNumber}`
            : null,
      },
      itemsToFulfill,
    };

    try {
      const response = await fetch(
        "https://multi-vendor-marketplace.vercel.app/order/fullFillOrder",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage(" Items fulfilled and inventory updated!");
      } else {
        setMessage(` Error: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Fulfillment error:", error);
      setMessage(" Server error. Please try again.");
    }

    setLoading(false);
  };

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (order?.lineItems) {
      const initialQuantities = order.lineItems.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }
  }, [order]);

  const handleQuantityChange = (lineItemId, qty) => {
    setQuantities((prev) => ({ ...prev, [lineItemId]: qty }));
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="text-sm text-gray-500 mb-2">
        #{order.serialNumber} &rsaquo;{" "}
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
                  {order?.lineItems
                    ?.filter((item) => item.fulfillment_status === null)
                    .map((item, index) => {
                      const productName = item.name?.split(" - ")[0];
                      const variantOptions =
                        item.variant_title?.split(" / ") || [];

                      return (
                        <div
                          key={index}
                          className="flex items-center gap-4 mt-3"
                        >
                          <img
                            src={item.image?.src}
                            alt={item.image?.alt || "Variant Image"}
                            className="w-16 h-16 rounded object-cover border"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm flex items-center justify-between gap-2">
                              {productName}
                              <input
                                type="number"
                                min="0"
                                max={
                                  item.quantity - (item.fulfilled_quantity || 0)
                                }
                                value={quantities[item.id] || 0}
                                className="ml-2 w-16 text-sm border rounded px-2 py-1"
                                onChange={(e) =>
                                  handleQuantityChange(
                                    item.id,
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                              of {item.fulfillable_quantity}
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
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
              <select
                onChange={(e) => setCarrier(e.target.value)}
                className="border px-3 py-2 rounded w-full text-sm"
              >
                <option>Shipping carrier</option>
                <option>FedEx</option>
                <option>DHL</option>
                <option>Others</option>
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
            <div>
              {order.customer.first_name}
              {order.customer.last_name}
            </div>
            <div>{order.customer?.default_address.address1}</div>
            <div>
              {order.customer?.default_address.city}{" "}
              {order.customer?.default_address.province}{" "}
              {order.customer?.default_address.province_code}
            </div>
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
            <div>
              {order?.lineItems[0].quantity} of {order?.lineItems[0].quantity}
            </div>

            {/* <label className="flex items-center gap-2 text-sm mt-2">
              <input type="checkbox" />
              Send a <span className="text-blue-600">notification</span> to the
              customer
            </label> */}

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
