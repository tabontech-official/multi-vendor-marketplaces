import React from "react";
import { MdEdit } from "react-icons/md";
import { useLocation } from "react-router-dom";

const OrdersDetails = () => {
  const location = useLocation();
  const { order, productName, sku } = location.state || {};
  const totalPrice = order?.lineItems
    .reduce((acc, item) => {
      const price = parseFloat(item.price);
      const qty = Number(item.quantity);
      return acc + (isNaN(price) || isNaN(qty) ? 0 : price * qty);
    }, 0)
    .toFixed(2);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-12 gap-6">
        {/* Left main section */}
        <div className="col-span-8 space-y-6">
          <div class="flex space-x-8">
            <div>
              <span class="text-gray-900 font-semibold block">
                Orderno: #101
              </span>
              <span class="text-gray-900 font-semibold block mt-1">
                May 16, 2025 at 8:07 pm from Online store
              </span>
            </div>
          </div>
          {/* Unfulfilled box */}
          <div className="bg-white rounded-xl border border-gray-300 shadow p-6 space-y-2">
            <div className="inline-flex items-center space-x-2 bg-yellow-300 text-yellow-900 text-xs font-semibold rounded px-2 py-1 w-max mb-2">
              {/* <svg
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
                  d="M9 12h6m-3 3v-6m8 6v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2"
                />
              </svg> */}
              <span>Unfulfilled (1)</span>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              {/* Location and Delivery */}
              <div className="text-sm space-y-2">
                <div>
                  <p className="text-gray-600 font-semibold">Location</p>
                  <p className="text-gray-900">Shop location</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Delivery method</p>
                  <p className="text-gray-900">Standard</p>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Product item */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs font-semibold">
                  Image
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {productName}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    2 <span className="text-gray-400">/ 7</span>
                  </p>
                  <p className="text-xs text-gray-500">SKU: {sku}</p>
                </div>

                <div className="text-right min-w-[90px] font-semibold text-gray-900">
                  ${order?.lineItems[0].price} × {order?.lineItems[0].quantity}
                </div>

                {/* <div className="text-gray-600 font-semibold">× 1</div> */}

                <div className="text-right min-w-[90px] font-semibold text-gray-900">
                  ${totalPrice}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-2 justify-end">
                <button className="px-4 py-1 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition">
                  Fulfill item
                </button>
                <button className="px-4 py-1 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition">
                  Create shipping label
                </button>
              </div>
            </div>
          </div>

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

        {/* Right sidebar */}
        <div className="col-span-4 space-y-4">
          {/* Notes box */}
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

          {/* Customer info box */}
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
