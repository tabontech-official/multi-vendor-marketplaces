import React, { useState, useEffect, useRef } from "react";
import { MdEdit } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { BsThreeDots } from "react-icons/bs";
import {
  HiArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiSend } from "react-icons/fi";
const OrdersDetails = () => {
  const navigate = useNavigate();
  const { orderId, merchantId } = useParams();
  const [orderData, setOrderData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [lineItems, setLineItems] = useState([]);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showRequestPopup, setShowRequestPopup] = useState(false);
  const [showSubmitted, setShowSubmitted] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const [requestMessage, setRequestMessage] = useState("");
  const customer = orderData?.customers || {};

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };
  console.log("PARAMS 👉", orderId, merchantId);

  // const lineItems =
  //   orderData?.lineItems || orderData?.lineItemsByMerchant?.[merchantId] || [];
  const [role, setRole] = useState(null);
  const [showCancelButton, setShowCancelButton] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("usertoken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userRole = decoded?.payLoad?.role;
        setRole(userRole);
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
  }, []);
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setIsLoading(true);

        const apiKey = localStorage.getItem("apiKey");
        const apiSecretKey = localStorage.getItem("apiSecretKey");

        const res = await axios.get(
          `https://multi-vendor-marketplace.vercel.app/order/getOrderFromShopify/${orderId}/${merchantId}`,
          {
            headers: {
              "x-api-key": apiKey,
              "x-api-secret": apiSecretKey,
            },
          },
        );

        setOrderData(res.data?.data || null);
      } catch (error) {
        console.error("❌ Failed to fetch orderData:", error);
        setFetchError("Failed to load orderData");
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId && merchantId) {
      fetchOrderData();
    }
  }, [orderId, merchantId]);
  useEffect(() => {
    if (!orderData?.products) {
      setLineItems([]);
      return;
    }

    // const mappedItems = orderData.products.map((p) => {
    //   const variant = p.variant || {};
    //   const product = p.product || {};

    //   return {
    //     id: p.lineItemId,
    //     product_id: p.productId,
    //     variant_id: p.variantId,

    //     name: product.title || "N/A",
    //     variant_title: variant.title || null,
    //     sku: variant.sku || "N/A",

    //     price: variant.price || "0",

    //     quantity: p.quantity,
    //     fulfilled_quantity: p.fulfilled_quantity || 0,
    //     fulfillable_quantity: p.fulfillable_quantity || 0,
    //     fulfillment_status: p.fulfillment_status,

    //     image: {
    //       src:
    //         product.images?.[0]?.src || product.variantImages?.[0]?.src || null,
    //       alt: product.title || "Product image",
    //     },
    //   };
    // });
    const mappedItems = orderData.products.map((p) => {
      const variant = p.variant || {};
      const product = p.product || {};

      // 🔥 FIXED IMAGE LOGIC
      let imageSrc = null;

      // 1️⃣ Try product.images (if exists)
      if (product.images?.length) {
        imageSrc = product.images[0].src;
      }

      // 2️⃣ Try matching variant image
      if (!imageSrc && product.variantImages?.length) {
        const matchedVariantImage = product.variantImages.find(
          (v) => String(v.variantId) === String(p.variantId),
        );

        if (matchedVariantImage?.images?.length) {
          imageSrc = matchedVariantImage.images[0].src;
        }
      }

      return {
        id: p.lineItemId,
        product_id: p.productId,
        variant_id: p.variantId,

        name: product.title || "N/A",
        variant_title: variant.title || null,
        sku: variant.sku || "N/A",
        price: variant.price || "0",

        quantity: p.quantity,
        fulfilled_quantity: p.fulfilled_quantity || 0,
        fulfillable_quantity: p.fulfillable_quantity || 0,
        fulfillment_status: p.fulfillment_status,

        image: {
          src: imageSrc,
          alt: product.title || "Product image",
        },
      };
    });

    setLineItems(mappedItems);
  }, [orderData]);

  const totalPrice = Array.isArray(lineItems)
    ? lineItems
        .reduce((acc, item) => {
          const price = parseFloat(item.price);
          const qty = Number(item.quantity);
          return acc + (isNaN(price) || isNaN(qty) ? 0 : price * qty);
        }, 0)
        .toFixed(2)
    : "0.00";
  let orderCreatedAt = null;

  // 1️⃣ Shopify order created date (BEST)
  if (orderData?.created_at) {
    orderCreatedAt = orderData.created_at;
  }
  // 2️⃣ DB fallback
  else if (orderData?.dbCreatedAt) {
    orderCreatedAt = orderData.dbCreatedAt;
  }
  // 3️⃣ Very old fallback (admin grouped structure)
  else if (
    orderData?.lineItemsByMerchant &&
    merchantId &&
    Array.isArray(orderData.lineItemsByMerchant[merchantId]) &&
    orderData.lineItemsByMerchant[merchantId][0]?.customer?.[0]?.created_at
  ) {
    orderCreatedAt =
      orderData.lineItemsByMerchant[merchantId][0].customer[0].created_at;
  }

  const formattedDate = orderCreatedAt
    ? new Date(orderCreatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const [openMenu, setOpenMenu] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedFulfillment, setSelectedFulfillment] = useState(null);
  const menuRefs = useRef([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRefs.current.every((ref) => ref && !ref.contains(event.target))) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingCarrier, setShippingCarrier] = useState("");

  useEffect(() => {
    if (selectedFulfillment) {
      setTrackingNumber(selectedFulfillment.tracking_number || "");
      setShippingCarrier(selectedFulfillment.tracking_company || "");
    }
  }, [selectedFulfillment]);

  const handleSaveTracking = async () => {
    try {
      await fetch(`/api/shopify/update-fulfillment-tracking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fulfillmentId: selectedFulfillment.id,
          tracking_number: trackingNumber,
          tracking_company: shippingCarrier,
        }),
      });

      await fetch(
        `https://multi-vendor-marketplace.vercel.app/order/updatetrackingShopify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fulfillmentId: selectedFulfillment.id,
            tracking_number: trackingNumber,
            tracking_company: shippingCarrier,
          }),
        },
      );

      setShowTrackingModal(false);
    } catch (err) {
      alert("Failed to update tracking.");
    }
  };

  const handleCancelOrder = async () => {
    const token = localStorage.getItem("usertoken");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    if (!token || typeof token !== "string") {
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      return;
    }
    const role = decoded?.payLoad?.role;

    try {
      let lineItemIds = [];

      if (role === "Merchant") {
        const lineItems = orderData?.lineItems || [];
        lineItemIds = lineItems.map((item) => item.id);
      } else {
        const lineItems = orderData?.lineItemsByMerchant?.[merchantId] || [];
        lineItemIds = lineItems.map((item) => item.id);
      }

      if (!orderId || lineItemIds.length === 0) {
        alert("Missing orderData details or line items to cancel.");
        return;
      }

      const response = await fetch(
        "https://multi-vendor-marketplace.vercel.app/orderData/cancelOrder",
        {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            reason: "customer",
            lineItemIds,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error(" Cancel Failed:", result);
        showToast("error", "Failed to cancel the orderData.");

        return;
      }

      showToast("success", "orderData cancelled successfully.");
      // window.location.reload();
    } catch (error) {
      console.error(" Cancel Error:", error);
      showToast("error", "An error occurred while canceling the orderData.");
    }
  };
  const getFulfilledItemImage = (fulfillmentItem) => {
    if (!orderData) return null;

    const allItems =
      orderData.lineItems ||
      orderData.line_items ||
      orderData.lineItemsByMerchant?.[merchantId] ||
      [];

    // ✅ YOUR DATA USES id DIRECTLY
    const orderLineItemId = fulfillmentItem.id;

    const matchedItem = allItems.find(
      (li) => String(li.id) === String(orderLineItemId),
    );

    return matchedItem?.image?.src || null;
  };

  const [lineItemCount, setLineItemCount] = useState(0);
  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setRole(decoded?.payLoad?.role);
    } catch (err) {
      console.error("JWT decode failed:", err);
    }

    const fetchLineItemCount = async () => {
      try {
        const res = await fetch(
          `https://multi-vendor-marketplace.vercel.app/orderData/lineItemCount/${orderId}`,
        );
        const data = await res.json();

        setLineItemCount(data.lineItemCount);

        if (data.lineItemCount === lineItems.length) {
          setShowCancelButton(true);
        } else {
          setShowCancelButton(false);
        }
      } catch (error) {
        console.error("Error fetching line item count:", error);
      }
    };

    if (orderId && lineItems.length) fetchLineItemCount();
  }, [orderId, lineItems]);
  const hasUnfulfilledItems = lineItems.some((i) => i.fulfillable_quantity > 0);

  const shipping = orderData?.shipping_address?.address1
    ? orderData.shipping_address
    : customer?.default_address || {};

  const billing = orderData?.billing_address?.address1
    ? orderData.billing_address
    : customer?.default_address || {};
  const merchantLineItemIds =
    orderData?.products?.map((p) => String(p.lineItemId)) || [];
  const getProductSnapshot = (fulfillmentItem) => {
  return orderData?.products?.find(
    (p) =>
      String(p.lineItemId) === String(fulfillmentItem.id)
  );
};
 const getValidFulfillmentItems = (fulfillment) => {
  return (
    fulfillment.line_items?.filter((item) => {
      const snapshot = getProductSnapshot(item);
      return snapshot; // only check existence
    }) || []
  );
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition shadow-sm"
          >
            <HiArrowLeft className="text-lg" />
            Back
          </button>

          <div class="flex space-x-8">
            <div>
              <span class="text-gray-900 font-semibold block">
                Orderno: #{orderData?.serialNumber || orderData?.serialNo}
              </span>
              <span class="text-gray-900 font-semibold block mt-1">
                {formattedDate} from Online store
              </span>
              <span class="text-gray-900 font-semibold block mt-1">
                {orderData?.name}
              </span>
            </div>
          </div>
          {toast.show && (
            <div
              className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${
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

          {hasUnfulfilledItems && (
            <div className="bg-white rounded-xl border border-gray-300 shadow p-6 space-y-2">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold rounded px-2 py-1 w-max mb-2 bg-yellow-300 text-yellow-900">
                <span>
                  Unfulfilled (
                  {
                    lineItems.filter((i) => i.fulfillment_status === null)
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
                  {lineItems
                    .filter(
                      (item) =>
                        item.fulfillment_status === null ||
                        item.fulfillment_status === "cancelled",
                    )
                    .map((item, index) => {
                      const pendingQty =
                        item.quantity - (item.fulfilled_quantity || 0);

                      const displayQty =
                        item.fulfilled_quantity > 0
                          ? item.fulfilled_quantity
                          : pendingQty;

                      return (
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
                              {displayQty}
                            </p>

                            <p className="text-sm font-semibold text-gray-900">
                              $
                              {(parseFloat(item.price) * displayQty).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {!lineItems.some(
                  (i) => i.fulfillment_status === "cancelled",
                ) && (
                  <div className="flex space-x-2 justify-end">
                    <button
                      onClick={() => {
                        console.log("✅ Fulfill button clicked");

                        navigate(`/order/${orderId}/fulfillment_orders`, {
                          state: {
                            orderId,
                            merchantId,
                            order: orderData,
                            index: 1,
                          },
                        });
                      }}
                      className="px-4 py-1 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition"
                    >
                      Fulfill item
                    </button>

                    <button
                      onClick={() => {
                        navigate("/packaging-slip", {
                          state: { order: orderData },
                        });
                      }}
                      className="px-4 py-1 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition"
                    >
                      Print packing slip
                    </button>
                    <button
                      onClick={() => {
                        console.log(orderData);
                        navigate("/invoice-preview", {
                          state: { order: orderData },
                        });
                      }}
                      className="px-4 py-1 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition"
                    >
                      Print invoice
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {orderData?.fulfillments?.map((fulfillment, index) => {
            const validItems = getValidFulfillmentItems(fulfillment);

            if (validItems.length === 0) return null;

            return (
              <div
                key={fulfillment.id}
                className="bg-white rounded-xl border border-gray-300 shadow p-6 space-y-2 mb-4"
              >
                {/* ===== Header ===== */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                  <span className="inline-flex px-2 py-1 bg-green-300 border rounded text-xs font-semibold text-green-700">
                    Fulfilled
                  </span>

                  <div
                    className="relative"
                    ref={(el) => (menuRefs.current[index] = el)}
                  >
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === index ? null : index)
                      }
                      className="text-lg text-gray-500"
                    >
                      <BsThreeDots />
                    </button>

                    {openMenu === index && (
                      <div className="absolute right-0 mt-1 w-40 bg-white border rounded shadow z-10">
                        <button
                          onClick={() => {
                            setSelectedFulfillment(fulfillment);
                            setShowTrackingModal(true);
                            setOpenMenu(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          Edit Tracking
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ===== Meta ===== */}
                <div className="px-4 py-3 text-sm text-gray-700 border-b space-y-1">
                  <p>
                    <strong>Location:</strong> Shop location
                  </p>
                  <p>
                    <strong>Fulfilled:</strong>{" "}
                    {new Date(fulfillment.created_at).toLocaleDateString(
                      "en-US",
                    )}
                  </p>
                  <p>
                    <strong>Tracking number:</strong>{" "}
                    {fulfillment.tracking_number || "N/A"}
                  </p>
                </div>

                {/* ===== Valid Line Items Only ===== */}
                {validItems.map((item, idx) => {
                  const snapshot = getProductSnapshot(item);

                  return (
                    <div
                      key={`${fulfillment.id}-${idx}`}
                      className="flex items-center justify-between px-4 py-3 border-t"
                    >
                      <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
  {snapshot?.product?.images?.[0]?.src || snapshot?.variant?.src ? (
    <img
      src={
        snapshot?.product?.images?.[0]?.src ||
        snapshot?.variant?.src
      }
      alt={snapshot?.product?.title || "Product"}
      className="w-full h-full object-contain"
    />
  ) : (
    <span className="text-gray-400 text-xs font-semibold">
      No Image
    </span>
  )}
</div>

                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {snapshot.product.title}
                          </p>

                          {snapshot.variant?.title && (
                            <span className="inline-block text-[10px] px-2 py-1 bg-gray-200 rounded mt-1">
                              {snapshot.variant.title}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right text-sm">
                        <p>
                          ${Number(item.price).toFixed(2)} × {item.quantity}
                        </p>
                        <p className="font-semibold">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

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
                <span>
                  {Array.isArray(lineItems) ? lineItems.length : 0} item
                  {lineItems?.length !== 1 ? "s" : ""}
                </span>
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
          {Array.isArray(lineItems) &&
            lineItems.some((i) => i.fulfillment_status === null) && (
              <>
                {showCancelButton ? (
                  <button
                    className="bg-white px-3 py-2 text-sm border border-gray-300 rounded-xl"
                    onClick={() => setShowCancelPopup(true)}
                  >
                    Cancel orderData
                  </button>
                ) : role === "Merchant" ? (
                  <div className="text-sm text-gray-300-600 font-medium">
                    <button
                      className="bg-white px-3 py-2 text-sm border border-gray-300 rounded-xl"
                      onClick={() => setShowRequestPopup(true)}
                    >
                      Cancel order
                    </button>
                  </div>
                ) : null}
              </>
            )}

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

          <div className="bg-white rounded-xl border border-gray-300 shadow p-6 space-y-2 relative">
            <h3 className="font-semibold text-gray-900">Customer</h3>

            <a
              href="#"
              className="text-blue-600 hover:underline block font-semibold"
            >
              {customer?.first_name || "N/A"} {customer?.last_name || ""}
            </a>

            <h3 className="font-semibold text-gray-900 mt-3">
              Contact information
            </h3>

            <a
              href={`mailto:${customer?.email || ""}`}
              className="text-blue-600 hover:underline text-sm block"
            >
              {customer?.email || "N/A"}
            </a>

            <p className="text-gray-600 text-sm">
              {customer?.phone || "No phone number"}
            </p>

            {/* ================= SHIPPING ================= */}
            <h3 className="font-semibold text-gray-900 mt-4 mb-2">
              Shipping address
            </h3>

            <address className="text-gray-900 not-italic text-sm leading-snug space-y-1">
              <p>
                {customer?.first_name} {customer?.last_name}
              </p>
              <p>{shipping.address1}</p>
              {shipping.address2 && <p>{shipping.address2}</p>}
              <p>
                {shipping.city} {shipping.province} {shipping.zip}
              </p>
              <p>{shipping.country}</p>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  `${shipping.address1} ${shipping.city} ${shipping.country}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View map
              </a>
            </address>

            {/* ================= BILLING ================= */}
            <h3 className="font-semibold text-gray-900 mt-4 mb-2">
              Billing address
            </h3>

            <address className="text-gray-900 not-italic text-sm leading-snug space-y-1">
              <p>
                {customer?.first_name} {customer?.last_name}
              </p>
              <p>{billing.address1}</p>
              {billing.address2 && <p>{billing.address2}</p>}
              <p>
                {billing.city} {billing.province} {billing.zip}
              </p>
              <p>{billing.country}</p>
            </address>
          </div>
        </div>
      </div>
      {showTrackingModal && (
        <div className="fixed inset-0 z-50 flex items-center shadow justify-center bg-black bg-opacity-40">
          <div className="bg-white w-[500px] max-w-full rounded-lg shadow-lg p-6 relative">
            <h2 className="text-md font-semibold text-gray-600 mb-4 border-b">
              Edit tracking
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Tracking number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Shipping carrier
                </label>

                <select
                  value={shippingCarrier}
                  onChange={(e) => setShippingCarrier(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">Select carrier</option>
                  <option value="UPS">UPS</option>
                  <option value="FedEx">FedEx</option>
                  <option value="DHL">DHL</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3 border-t">
              <button
                onClick={() => setShowTrackingModal(false)}
                className="px-4 py-1.5 text-sm text-gray-700 border rounded hover:bg-gray-100 mt-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTracking}
                className="px-4 py-1.5 text-sm text-white bg-gray-800 rounded hover:bg-gray-700 mt-2"
              >
                Save
              </button>
            </div>

            <button
              onClick={() => setShowTrackingModal(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {showCancelPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
              onClick={() => setShowCancelPopup(false)}
            >
              ✕
            </button>
            <div className="text-center">
              <div className="text-4xl mb-2 text-red-500">⚠️</div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Confirm Cancellation
              </h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this orderData?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 text-gray-800"
                  onClick={() => setShowCancelPopup(false)}
                >
                  No, Go Back
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                  onClick={async () => {
                    setCancelLoading(true);
                    await handleCancelOrder();
                    setCancelLoading(false);
                    setShowCancelPopup(false);
                  }}
                  disabled={cancelLoading}
                >
                  {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {showRequestPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-black transition"
              onClick={() => setShowRequestPopup(false)}
            >
              ✕
            </button>

            <div className="text-center">
              <div className="text-4xl mb-2 text-blue-500">📩</div>
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                Submit Request
              </h2>
              <p className="text-gray-600 mb-4">
                Write your reason for requesting cancellation:
              </p>

              <textarea
                rows={4}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your request message..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
              ></textarea>

              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={async () => {
                    if (!requestMessage.trim()) {
                      alert("Please enter a request message.");
                      return;
                    }

                    const userId = localStorage.getItem("userid");
                    const email = localStorage.getItem("email");

                    try {
                      const response = await fetch(
                        `https://multi-vendor-marketplace.vercel.app/auth/addRequestForOrderCancellation/${userId}`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            request: requestMessage,
                            orderNo: orderData?.name,
                            orderId: String(orderData?.id),
                            email,
                            lineItemIds: lineItems.map((i) => i.id),
                          }),
                        },
                      );

                      const result = await response.json();

                      if (response.ok) {
                        setShowSubmitted(true);
                        setShowRequestPopup(false);

                        setTimeout(() => {
                          setShowSubmitted(false);
                        }, 1000);
                      }
                    } catch (err) {
                      console.error("Error submitting request:", err);
                      alert("Something went wrong. Try again.");
                    }
                  }}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowRequestPopup(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
      {showRequestPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all scale-100">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
              <button
                className="absolute top-3 right-4 text-white/80 hover:text-white transition text-lg"
                onClick={() => setShowRequestPopup(false)}
              >
                ✕
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl mb-3 shadow-inner">
                  <FiSend className="text-white text-2xl" />
                </div>

                <h2 className="text-xl font-semibold tracking-wide">
                  Submit Cancellation Request
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  Please provide a reason for your request.
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Message
              </label>

              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                placeholder="Enter your request message..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowRequestPopup(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    if (!requestMessage.trim()) {
                      alert("Please enter a request message.");
                      return;
                    }

                    const userId = localStorage.getItem("userid");
                    const email = localStorage.getItem("email");

                    try {
                      const response = await fetch(
                        `https://multi-vendor-marketplace.vercel.app/auth/addRequestForOrderCancellation/${userId}`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            request: requestMessage,
                            orderNo: orderData?.name,
                            orderId: String(orderData?.id),
                            email,
                            lineItemIds: lineItems.map((i) => i.id),
                          }),
                        },
                      );

                      const result = await response.json();

                      if (response.ok) {
                        setShowSubmitted(true);
                        setShowRequestPopup(false);

                        setTimeout(() => {
                          setShowSubmitted(false);
                        }, 1000);
                      }
                    } catch (err) {
                      console.error("Error submitting request:", err);
                      alert("Something went wrong. Try again.");
                    }
                  }}
                  className="px-5 py-2 text-sm font-medium rounded-lg bg-black text-white hover:bg-gray-800 transition shadow-md"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSubmitted && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6 text-center relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-black transition"
              onClick={() => setShowSubmitted(false)}
            >
              ✕
            </button>

            <div className="text-4xl text-green-500 mb-2">✅</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Request Submitted
            </h2>
            <p className="text-gray-600">
              Your cancellation request has been sent to the Master Admin.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersDetails;
