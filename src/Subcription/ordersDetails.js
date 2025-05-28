import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const OrdersDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const { order, productName, sku, index } = location.state || {};
 useEffect(() => {
  const fetchOrderData = async () => {
    const userId = localStorage.getItem("userid");
    if (!userId) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/order/getOrderFromShopify/${order?.orderId}/${userId}`
      );
      setOrderData(response.data?.data); // ✅ Use correct key
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching order:", err);
      setFetchError("Failed to load order");
      setIsLoading(false);
    }
  };

  if (order?.orderId) {
    fetchOrderData();
  }
}, [order?.orderId]);

  const totalPrice = order?.lineItems
    .reduce((acc, item) => {
      const price = parseFloat(item.price);
      const qty = Number(item.quantity);
      return acc + (isNaN(price) || isNaN(qty) ? 0 : price * qty);
    }, 0)
    .toFixed(2);
  const formattedDate = new Date(order?.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <div class="flex space-x-8">
            <div>
              <span class="text-gray-900 font-semibold block">
                Orderno: #{order?.serialNumber}
              </span>
              <span class="text-gray-900 font-semibold block mt-1">
                {formattedDate} from Online store
              </span>
              <span class="text-gray-900 font-semibold block mt-1">
                {orderData?.name}
              </span>
            </div>
          </div>
          {/* {orderData?.line_items?.some(
            (item) =>
              item.fulfillment_status === null ||
              item.fulfillment_status === "partial"
          ) && (
            <div className="bg-white rounded-xl border border-gray-300 shadow p-6 space-y-2">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold rounded px-2 py-1 w-max mb-2 bg-yellow-300 text-yellow-900">
                <span>
                  Unfulfilled (
                  {
                    orderData.line_items.filter(
                      (item) =>
                        item.fulfillment_status === null ||
                        item.fulfillment_status === "partial"
                    ).length
                  }
                  )
                </span>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="text-sm space-y-2">
                  <div>
                    <p className="text-gray-600 font-semibold">Location</p>
                    <p className="text-gray-900">Shop location</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">
                      Delivery method
                    </p>
                    <p className="text-gray-900">
                      {orderData.shipping_lines[0]?.title || "Standard"}
                    </p>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div className="divide-y border rounded mb-4">
                  {orderData.line_items
                    .filter(
                      (item) =>
                        item.fulfillment_status === null ||
                        item.fulfillment_status === "partial"
                    )
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs font-semibold">
                              No Image
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {item.name}
                            </p>
                            {item.variant_title && (
                              <span className="inline-block text-[10px] px-2 py-1 bg-gray-200 text-gray-600 rounded mt-1">
                                {item.variant_title}
                              </span>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              SKU: {item.sku || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-800 font-medium">
                            ${parseFloat(item.price).toFixed(2)} ×{" "}
                            {item.fulfillable_quantity || 0}
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            $
                            {(
                              parseFloat(item.price) *
                              (item.fulfillable_quantity || 0)
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="flex space-x-2 justify-end">
                  <button
                    onClick={() => {
                      console.log("Navigating with orderData:", orderData);

                      navigate(`/order/${orderData?.id}/fulfillment_orders`, {
                        state: {
                          order: orderData,
                          fullOrder: order,
                          productName: orderData?.name,
                          sku: orderData?.line_items?.[0]?.sku || "",
                          index: 1,
                        },
                      });
                    }}
                    className="px-4 py-1 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition"
                  >
                    Fulfill item
                  </button>

                  <button className="px-4 py-1 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition">
                    Create shipping label
                  </button>
                </div>
              </div>
            </div>
          )} */}
       {order?.lineItems.some((i) => i.fulfillment_status === null) && (
            <div className="bg-white rounded-xl border border-gray-300 shadow p-6 space-y-2">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold rounded px-2 py-1 w-max mb-2 bg-yellow-300 text-yellow-900">
                <span>
                  Unfulfilled (
                  {
                    order.lineItems.filter((i) => i.fulfillment_status === null)
                      .length
                  }
                  )
                </span>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="text-sm space-y-2">
                  <div>
                    <p className="text-gray-600 font-semibold">Location</p>
                    <p className="text-gray-900">Shop location</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">
                      Delivery method
                    </p>
                    <p className="text-gray-900">Standard</p>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div className="divide-y border rounded mb-4">
                  {order.lineItems
                    .filter((item) => item.fulfillment_status === null)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            {item.image?.src ? (
                              <img
                                src={item.image.src}
                                alt={item.image.alt || "Product image"}
                                className="w-full h-full object-contain rounded"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs font-semibold">
                                No Image
                              </span>
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {item.name}
                            </p>

                            {item.variant_title && (
                              <span className="inline-block text-[10px] px-2 py-1 bg-gray-200 text-gray-600 rounded mt-1">
                                {item.variant_title}
                              </span>
                            )}

                            <p className="text-xs text-gray-500 mt-1">
                              SKU: {item.sku || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-800 font-medium">
                            ${parseFloat(item.price).toFixed(2)} ×{" "}
                            {item.quantity - (item.fulfilled_quantity || 0)}
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            $
                            {(
                              parseFloat(item.price) *
                              (item.quantity - (item.fulfilled_quantity || 0))
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="flex space-x-2 justify-end">
                  <button
                    onClick={() => {
                      console.log("Navigating with orderData:", orderData);

                      navigate(`/order/${orderData?.id}/fulfillment_orders`, {
                        state: {
                          order: orderData,
                          fullOrder: order,
                          productName: orderData?.name,
                          sku: orderData?.line_items?.[0]?.sku || "",
                          index: 1,
                        },
                      });
                    }}
                    className="px-4 py-1 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition"
                  >
                    Fulfill item
                  </button>

                  <button className="px-4 py-1 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition">
                    Create shipping label
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* fullfill box */}

          {orderData?.fulfillments?.map((fulfillment, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-300 shadow p-6 space-y-2 mb-4"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                <span className="flex items-center gap-2 text-green-700 text-sm font-semibold">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-300 border rounded text-xs">
                    Fulfilled
                  </span>
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {orderData.name}
                </span>
              </div>

              <div className="px-4 py-3 text-sm text-gray-700 space-y-1 border-b">
                <p>
                  <strong>Location:</strong> Shop location
                </p>
                <p>
                  <strong>Fulfilled:</strong>{" "}
                  {new Date(fulfillment?.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <p>
                  <strong>Tracking number:</strong>{" "}
                  {fulfillment.tracking_number || "N/A"}
                </p>
              </div>

              {fulfillment.line_items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-4 py-3 border-t last:border-b"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-800">{item.title}</p>
                      {item.variant_title && (
                        <div className="flex gap-1 flex-wrap mt-1 text-[10px]">
                          {item.variant_title.split(" / ").map((opt, i) => (
                            <span
                              key={i}
                              className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded"
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        SKU: {item.sku || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-sm text-gray-800">
                    <p>
                      ${parseFloat(item.price).toFixed(2)} × {item.quantity}
                    </p>
                    <p className="font-semibold text-gray-900">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Paid box */}
          <div className="bg-white rounded-xl border border-gray-300 shadow p-6 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-gray-200 text-gray-600 text-xs font-semibold rounded px-2 py-1 w-max mb-4">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Paid</span>
            </div>

            {/* Subtotal, shipping, total */}
            <div className="space-y-3 border rounded-xl p-3">
              <div className="flex justify-between text-gray-700 text-sm">
                <span>Subtotal</span>
                <span>{order?.lineItems[0].quantity}item</span>
                <span className="font-semibold">${totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-700 text-sm">
                <span>Shipping</span>
                <span>Standard (123.0 kg: Items 123.0 kg, Package 0.0 kg)</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold text-base">
                <span>Total</span>
                <span></span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-700 text-sm">
                <span>Paid</span>
                <span></span>
                <span className="font-semibold">${totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-4">
          <div className="bg-white p-4 border border-gray-300 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-900">Notes</h3>
              <button
                aria-label="Edit notes"
                className="text-gray-400 hover:text-gray-700"
              >
                <MdEdit />
              </button>
            </div>
            <p className="text-gray-600 text-sm">No notes from customer</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-300 shadow p-6 space-y-2">
            <h3 className="font-semibold text-gray-900">Customer</h3>
            <button
              aria-label="Close"
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
            >
              ×
            </button>
            <a
              href="#"
              className="text-blue-600 hover:underline block font-semibold"
            >
              {order?.customer.first_name} {order?.customer.last_name}
            </a>
            <p className="text-gray-600 text-sm mb-2 ">No orders</p>

            <h3 className="font-semibold text-gray-900 ">
              Contact information
            </h3>
            <a
              href="mailto:medspatrader23@gmail.com"
              className="text-blue-600 hover:underline text-sm"
            >
              {order?.customer.email}
            </a>
            <p className="text-gray-600 text-sm">No phone number</p>

            <h3 className="font-semibold text-gray-900 mt-4 mb-2">
              Shipping address
            </h3>
            {/* <div className="bg-orange-100 p-2 rounded mb-2 cursor-pointer text-orange-700 text-sm font-semibold">
              <span>⚠️ Review address issues</span>
            </div> */}
            <address className="text-gray-900 not-italic text-sm leading-snug space-y-1">
              <p>
                {" "}
                {order?.customer.first_name} {order?.customer.last_name}
              </p>
              <p>{order?.customer.default_address.address1}</p>
              {/* <p>isb VIC 3000</p> */}
              <p>
                {" "}
                <p>{order?.customer.default_address.country}</p>
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View map
              </a>
            </address>

            <h3 className="font-semibold text-gray-900 mt-4 mb-2">
              Billing address
            </h3>
            <p className="text-gray-600 text-sm">Same as shipping address</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersDetails;
