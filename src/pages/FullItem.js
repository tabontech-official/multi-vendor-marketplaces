import React, { useState, useEffect, useMemo } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";

const FullItem = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { order: rawOrder, orderId, merchantId } = location.state || {};
  console.log("FULL ORDER 👉", rawOrder);

  const customer = rawOrder?.customers || {};

  const shipping = customer?.default_address || {};
  const billing = customer?.default_address || {};

  // const allLineItems = useMemo(() => {
  //   return (rawOrder?.products || []).map((item, index) => ({
  //     id: item.lineItemId || index,
  //     name: item.product?.title || "Product",
  //     sku: item.variant?.sku || "N/A",

  //     quantity: item.quantity,
  //     fulfillable_quantity: item.fulfillable_quantity ?? item.quantity,

  //     image: {
  //       src: item.product?.images?.[0]?.src,
  //       alt: item.product?.title,
  //     },

  //     price: item.variant?.price,
  //     variant_title: item.variant?.title,
  //   }));
  // }, [rawOrder?.products]);
  const allLineItems = useMemo(() => {
    return (rawOrder?.products || []).map((item, index) => {
      const product = item.product || {};
      const variant = item.variant || {};

      let imageSrc = null;

      // 1️⃣ Try normal product images
      if (product.images?.length) {
        imageSrc = product.images[0].src;
      }

      // 2️⃣ Try matching variant image
      if (!imageSrc && product.variantImages?.length) {
        const matchedVariant = product.variantImages.find(
          (v) => String(v.variantId) === String(item.variantId),
        );

        if (matchedVariant?.images?.length) {
          imageSrc = matchedVariant.images[0].src;
        }
      }

      return {
        id: item.lineItemId || index,
        name: product.title || "Product",
        sku: variant.sku || "N/A",

        quantity: item.quantity,
        fulfillable_quantity: item.fulfillable_quantity ?? item.quantity,

        image: {
          src: imageSrc,
          alt: product.title,
        },

        price: variant.price,
        variant_title: variant.title,
      };
    });
  }, [rawOrder?.products]);

  useEffect(() => {
    const initial = {};
    allLineItems.forEach((item) => {
      initial[item.id] = item.fulfillable_quantity;
    });
    setQuantities(initial);
  }, [allLineItems]);

  /* =========================
     STATE
     ========================= */
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

  const handleQuantityChange = (id, qty) => {
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  };

  /* =========================
     FULFILL
     ========================= */
  const handleFulfill = async () => {
    setLoading(true);
    setMessage("");

    const itemsToFulfill = allLineItems
      .map((item) => ({
        lineItemId: item.id,
        quantity: quantities[item.id] || 0,
      }))
      .filter((i) => i.quantity > 0);

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
      const res = await fetch("http://localhost:5000/order/fullFillOrder", {
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

  /* =========================
     RENDER
     ========================= */
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
                Unfulfilled
              </span>
              <span className="text-sm text-gray-600">
                {customer.first_name} {customer.last_name}
              </span>
            </div>

            <div className="p-5 space-y-5">
              {allLineItems.map((item) => (
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

                  <div className="flex-1 flex justify-between">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        SKU: {item.sku}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={item.fulfillable_quantity}
                        value={quantities[item.id] ?? 0}
                        onChange={(e) => {
                          let value = Number(e.target.value);

                          if (value < 0) value = 0;

                          // ❌ zyada quantity block
                          if (value > item.fulfillable_quantity) {
                            value = item.fulfillable_quantity;
                          }

                          handleQuantityChange(item.id, value);
                        }}
                        className="w-16 border rounded px-2 py-1 text-center"
                      />

                      <span className="text-xs">
                        of {item.fulfillable_quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
              disabled={loading}
              className={`w-full py-2 text-white rounded ${
                loading ? "bg-gray-400" : "bg-black hover:bg-gray-900"
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
