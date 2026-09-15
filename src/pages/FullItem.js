import React, { useState, useEffect, useMemo } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";

const FullItem = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { order: rawOrder, orderId, merchantId } = location.state || {};

  const customer = rawOrder?.customers || {};
  const shipping = customer?.default_address || {};
  const billing = customer?.default_address || {};

  const getRefundedQtyByLineItemId = (lineItemId) => {
    return (rawOrder?.refunds || []).reduce((total, refund) => {
      const matchedRefundItem = refund.refundItems?.find(
        (item) => String(item.lineItemId) === String(lineItemId)
      );

      return total + Number(matchedRefundItem?.quantity || 0);
    }, 0);
  };

  const allLineItems = useMemo(() => {
    return (rawOrder?.products || [])
      .map((item, index) => {
        const product = item.product || {};
        const variant = item.variant || {};

        let imageSrc = null;

        if (product.images?.length) {
          imageSrc = product.images[0].src;
        }

        if (!imageSrc && product.variantImages?.length) {
          const matchedVariant = product.variantImages.find(
            (v) => String(v.variantId) === String(item.variantId)
          );

          if (matchedVariant?.images?.length) {
            imageSrc = matchedVariant.images[0].src;
          }
        }

        const lineItemId = item.lineItemId || index;

        const originalQty = Number(item.quantity || 0);
        const fulfilledQty = Number(item.fulfilled_quantity || 0);
        const refundedQty = getRefundedQtyByLineItemId(lineItemId);

        const baseFulfillableQty =
          item.fulfillable_quantity !== undefined
            ? Number(item.fulfillable_quantity || 0)
            : Math.max(originalQty - fulfilledQty, 0);

        const finalFulfillableQty = Math.max(
          baseFulfillableQty - refundedQty,
          0
        );

        return {
          id: lineItemId,
          name: product.title || "Product",
          sku: variant.sku || "N/A",

          original_quantity: originalQty,
          fulfilled_quantity: fulfilledQty,
          refunded_quantity: refundedQty,

          quantity: finalFulfillableQty,
          fulfillable_quantity: finalFulfillableQty,

          image: {
            src: imageSrc,
            alt: product.title,
          },

          price: variant.price,
          variant_title: variant.title,
        };
      })
      .filter((item) => Number(item.fulfillable_quantity || 0) > 0);
  }, [rawOrder]);

  const [quantities, setQuantities] = useState({});
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [customCarrier, setCustomCarrier] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const initial = {};

    allLineItems.forEach((item) => {
      initial[item.id] = item.fulfillable_quantity;
    });

    setQuantities(initial);
  }, [allLineItems]);

  const handleQuantityChange = (id, qty, maxQty) => {
    let value = Number(qty);

    if (Number.isNaN(value)) value = 0;
    if (value < 0) value = 0;
    if (value > maxQty) value = maxQty;

    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleMinus = (item) => {
    const currentQty = Number(quantities[item.id] || 0);

    handleQuantityChange(
      item.id,
      Math.max(0, currentQty - 1),
      item.fulfillable_quantity
    );
  };

  const handlePlus = (item) => {
    const currentQty = Number(quantities[item.id] || 0);

    handleQuantityChange(
      item.id,
      Math.min(item.fulfillable_quantity, currentQty + 1),
      item.fulfillable_quantity
    );
  };

  const handleFulfill = async () => {
    setLoading(true);
    setMessage("");

    const itemsToFulfill = allLineItems
      .map((item) => ({
        lineItemId: item.id,
        quantity: quantities[item.id] || 0,
      }))
      .filter((i) => Number(i.quantity) > 0);

    if (!itemsToFulfill.length) {
      setMessage("No valid items selected.");
      setLoading(false);
      return;
    }

    const payload = {
      orderId,
      trackingInfo: {
        number: trackingNumber,
        company: carrier === "Others" ? customCarrier : carrier,
      },
      itemsToFulfill,
    };

    try {
      const res = await fetch("https://multi-vendor-marketplace.vercel.app/order/fullFillOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("Items fulfilled successfully!");

        navigate(`/order/${orderId}/${merchantId}`, {
          state: { refresh: true, merchantId },
        });
      } else {
        setMessage(result.error || "Fulfillment failed");
      }
    } catch {
      setMessage("Server error");
    }

    setLoading(false);
  };

  const displaySerialNo = rawOrder?.serialNumber || "N/A";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex mb-5 items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition shadow-sm"
      >
        <HiArrowLeft className="text-lg" />
        Back
      </button>

      <div className="mb-6">
        <div className="text-sm text-gray-500">
          #{displaySerialNo} ›{" "}
          <span className="text-gray-900 font-semibold">Fulfill items</span>
        </div>

        <h1 className="text-xl font-semibold mt-1">Order #{orderId}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded shadow-sm">
            <div className="px-5 py-4 border-b flex justify-between">
              <span className="text-xs bg-yellow-100 px-2 py-1 rounded">
                Unfulfilled ({allLineItems.length})
              </span>

              <span className="text-sm text-gray-600">
                {customer.first_name} {customer.last_name}
              </span>
            </div>

            <div className="p-5 space-y-5">
              {allLineItems.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-8">
                  No fulfillable items available.
                </div>
              ) : (
                allLineItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-5">
                    {item.image?.src ? (
                      <img
                        src={item.image.src}
                        alt={item.image.alt}
                        className="w-16 h-16 border rounded object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 border rounded flex items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}

                    <div className="flex-1 flex justify-between gap-4">
                      <div>
                        <div className="font-medium">{item.name}</div>

                        {item.variant_title && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.variant_title}
                          </div>
                        )}

                        <div className="text-xs text-gray-500">
                          SKU: {item.sku}
                        </div>

                        {item.refunded_quantity > 0 && (
                          <div className="text-xs text-red-500 mt-1">
                            Refunded: {item.refunded_quantity}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => handleMinus(item)}
                            disabled={Number(quantities[item.id] || 0) <= 0}
                            className={`w-9 h-9 flex items-center justify-center text-lg font-semibold ${
                              Number(quantities[item.id] || 0) <= 0
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            -
                          </button>

                          <input
                            type="number"
                            min={0}
                            max={item.fulfillable_quantity}
                            value={quantities[item.id] ?? 0}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                e.target.value,
                                item.fulfillable_quantity
                              )
                            }
                            className="w-14 h-9 border-x border-gray-300 text-center text-sm outline-none"
                          />

                          <button
                            type="button"
                            onClick={() => handlePlus(item)}
                            disabled={
                              Number(quantities[item.id] || 0) >=
                              item.fulfillable_quantity
                            }
                            className={`w-9 h-9 flex items-center justify-center text-lg font-semibold ${
                              Number(quantities[item.id] || 0) >=
                              item.fulfillable_quantity
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          of {item.fulfillable_quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TRACKING */}
          <div className="bg-white border rounded p-5 space-y-4">
            <div className="font-medium">Tracking information</div>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="border rounded px-3 py-2"
              />

              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="">Carrier</option>
                <option value="FedEx">FedEx</option>
                <option value="DHL">DHL</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {carrier === "Others" && (
              <input
                placeholder="Carrier name"
                value={customCarrier}
                onChange={(e) => setCustomCarrier(e.target.value)}
                className="border rounded px-3 py-2"
              />
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* SHIPPING */}
          <div className="bg-white rounded-lg border shadow-sm p-5 text-sm space-y-1">
            <div className="font-medium text-gray-900 mb-2">
              Shipping address
            </div>

            <div className="font-semibold text-gray-800">
              {customer.first_name} {customer.last_name}
            </div>

            {shipping.company && <div>{shipping.company}</div>}

            {shipping.address1 && <div>{shipping.address1}</div>}
            {shipping.address2 && <div>{shipping.address2}</div>}

            <div>
              {shipping.city}
              {shipping.province && `, ${shipping.province}`}
              {shipping.province_code && ` (${shipping.province_code})`}
            </div>

            {shipping.zip && <div>{shipping.zip}</div>}

            <div>{shipping.country_name || shipping.country}</div>

            {customer.phone && <div>📞 {customer.phone}</div>}

            <div className="text-xs text-gray-500 mt-3">
              Shipping method: <strong>Standard</strong>
            </div>
          </div>

          <div className="bg-white border rounded p-5">
            <button
              onClick={handleFulfill}
              disabled={loading || allLineItems.length === 0}
              className={`w-full py-2 text-white rounded ${
                loading || allLineItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-900"
              }`}
            >
              {loading ? "Fulfilling..." : "Fulfill items"}
            </button>

            {message && (
              <div className="text-center text-sm mt-3">{message}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullItem;