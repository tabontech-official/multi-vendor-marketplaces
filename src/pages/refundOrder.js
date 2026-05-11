import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { RiArrowLeftLine, RiLoader4Line } from "react-icons/ri";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

const RefundPage = () => {
  const navigate = useNavigate();
  const { orderId, merchantId } = useParams();
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };
  const [loading, setLoading] = useState(true);
  const [refundLoading, setRefundLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState(null);

  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [refundReason, setRefundReason] = useState("");

  const [restockItems, setRestockItems] = useState(true);
  const [refundShipping, setRefundShipping] = useState(false);
  const [notifyCustomer, setNotifyCustomer] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");

      const res = await axios.get(
        `https://multi-vendor-marketplace.vercel.app/order/getOrderFromShopify/${orderId}/${merchantId}`,
        {
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
          },
        }
      );

      const orderData = res.data?.data;

      setOrder(orderData);

      const allProducts = orderData?.products || [];
      setProducts(allProducts);

      const initialQty = {};

      allProducts.forEach((item) => {
        initialQty[item.lineItemId] = 0;
      });

      setSelectedQuantities(initialQty);
    } catch (error) {
      console.error("Refund Page Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getShippingAmount = () => {
    return Number(
      order?.shipping_price ||
      order?.shippingPrice ||
      order?.shipping_amount ||
      order?.shippingAmount ||
      order?.total_shipping_price_set?.shop_money?.amount ||
      150
    );
  };

  const shippingBaseAmount = getShippingAmount();

  const itemRefundTotal = products.reduce((acc, item) => {
    const qty = selectedQuantities[item.lineItemId] || 0;
    const price = Number(item?.variant?.price || 0);

    return acc + qty * price;
  }, 0);

  const shippingRefundAmount = refundShipping ? shippingBaseAmount : 0;

  const refundTotal = itemRefundTotal + shippingRefundAmount;

  const availableRefundAmount = Number(order?.total_price || 0);

  const handleRefund = async () => {
    try {
      const refundItems = products
        .filter((item) => selectedQuantities[item.lineItemId] > 0)
        .map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          lineItemId: item.lineItemId,
          quantity: selectedQuantities[item.lineItemId],
        }));

      if (refundItems.length === 0 && !refundShipping) {
        showToast("error", "Please select at least one item or shipping to refund.");
        return;
      }

      if (refundTotal <= 0) {
        showToast("error", "Refund amount must be greater than 0.");
        return;
      }

      setRefundLoading(true);

      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");

      await axios.post(
        "https://multi-vendor-marketplace.vercel.app/order/createRefund",
        {
          orderId,
          merchantId,
          refundItems,
          reason: refundReason,
          restock: restockItems,
          refundShipping,
          shippingAmount: shippingRefundAmount,
          refundAmount: refundTotal,
          notifyCustomer,
        },
        {
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
          },
        }
      );

      showToast("success", "Refund created successfully");
      navigate(-1);
    } catch (error) {
      console.error(error);

      showToast("error", error?.response?.data?.message || "Failed to create refund");
    } finally {
      setRefundLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f7]">
        <RiLoader4Line className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }
  const getRefundedQtyByLineItemId = (lineItemId) => {
    return (order?.refunds || []).reduce((total, refund) => {
      const matchedItems = refund.refundItems?.filter(
        (refundItem) => String(refundItem.lineItemId) === String(lineItemId)
      );

      const refundedQty = matchedItems?.reduce((sum, item) => {
        return sum + Number(item.quantity || 0);
      }, 0);

      return total + Number(refundedQty || 0);
    }, 0);
  };

  const getRefundableQty = (item) => {
    const originalQty = Number(item?.quantity || 0);
    const fulfilledQty = Number(item?.fulfilled_quantity || 0);
    const refundedQty = getRefundedQtyByLineItemId(item?.lineItemId);

    return Math.max(originalQty - fulfilledQty - refundedQty, 0);
  };
  return (
    <main className="bg-[#f6f6f7] min-h-screen p-8">
      {toast.show && (
        <div
          className={`fixed top-16 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${toast.type === "success" ? "bg-green-500" : "bg-red-500"
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
      <div className="max-w-7xl mx-auto">
        {/* TOP */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-lg border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-100"
          >
            <RiArrowLeftLine size={18} />
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>#{order?.shopifyOrderNo || order?.serialNumber || orderId}</span>
            <span>›</span>
            <span className="text-2xl font-semibold text-gray-900">
              Refund
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
          {/* LEFT SIDE */}
          <div className="space-y-5">
            {/* PRODUCTS */}
            <div className="bg-white border border-gray-300 rounded-2xl p-5">
              {/* BADGES */}
              <div className="flex items-center gap-3 mb-5">
                <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
                  {order?.fulfillment_status || "Unfulfilled"}
                </div>

                <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                  Shop location
                </div>
              </div>

              {/* ITEMS */}
              <div className="space-y-3">
                {products.map((item, index) => {
                  const quantity = selectedQuantities[item.lineItemId] || 0;
                  const itemPrice = Number(item?.variant?.price || 0);
                  const refundableQty = getRefundableQty(item);
                  const fulfilledQty = Number(item?.fulfilled_quantity || 0);
                  const refundedQty = getRefundedQtyByLineItemId(item.lineItemId);

                  return (
                    <div
                      key={item.lineItemId || index}
                      className={`border border-gray-200 rounded-xl p-4 flex items-center justify-between ${refundableQty <= 0 ? "opacity-50 bg-gray-50" : "bg-white"
                        }`}
                    >
                      {/* LEFT */}
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg border overflow-hidden bg-gray-50">
                          {item?.product?.images?.[0]?.src ? (
                            <img
                              src={item.product.images[0].src}
                              alt={item?.product?.title || "Product"}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        <div>
                          <h2 className="text-[15px] font-medium text-gray-900">
                            {item?.product?.title || "Untitled Product"}
                          </h2>

                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <span>{item?.variant?.title || "Default"}</span>
                            <span>{item?.variant?.sku || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs">
                            {fulfilledQty > 0 && (
                              <span className="text-emerald-600 font-medium">
                                Fulfilled: {fulfilledQty}
                              </span>
                            )}

                            {refundedQty > 0 && (
                              <span className="text-red-600 font-medium">
                                Refunded: {refundedQty}
                              </span>
                            )}

                            <span className="text-gray-500 font-medium">
                              Refundable: {refundableQty}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex items-center gap-8">
                        <div className="text-[#005bd3] font-medium text-sm">
                          ${itemPrice.toFixed(2)}
                        </div>

                        {/* QTY */}
                        <div className="flex items-center border border-gray-400 rounded-xl overflow-hidden h-10">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedQuantities((prev) => ({
                                ...prev,
                                [item.lineItemId]: Math.max(0, quantity - 1),
                              }));
                            }}
                            className="w-10 h-full flex items-center justify-center hover:bg-gray-100 text-lg"
                          >
                            -
                          </button>

                          <div className="w-12 h-full border-x border-gray-300 flex items-center justify-center text-sm font-medium">
                            {quantity}
                          </div>

                          <div className="w-12 h-full flex items-center justify-center text-sm text-gray-500">
                            / {refundableQty}
                          </div>
                          <button
                            type="button"
                            disabled={refundableQty <= 0 || quantity >= refundableQty}
                            onClick={() => {
                              setSelectedQuantities((prev) => ({
                                ...prev,
                                [item.lineItemId]: Math.min(
                                  refundableQty,
                                  quantity + 1
                                ),
                              }));
                            }}
                            className={`w-10 h-full flex items-center justify-center text-lg ${refundableQty <= 0 || quantity >= refundableQty
                              ? "text-gray-300 cursor-not-allowed bg-gray-50"
                              : "hover:bg-gray-100"
                              }`}
                          >
                            +
                          </button>
                        </div>

                        <div className="w-14 text-right text-sm text-gray-800 font-medium">
                          ${(itemPrice * quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RESTOCK */}
              <div className="mt-5 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={restockItems}
                  onChange={() => setRestockItems(!restockItems)}
                  className="w-4 h-4"
                />

                <span className="text-sm text-gray-800">Restock item</span>
              </div>
            </div>

            {/* SHIPPING */}
            {/* <div className="bg-white border border-gray-300 rounded-2xl p-5">
              <h2 className="text-lg font-medium text-gray-900 mb-5">
                Refund shipping
              </h2>

              <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={refundShipping}
                    onChange={() => setRefundShipping(!refundShipping)}
                    className="w-4 h-4"
                  />

                  <span className="text-sm text-gray-700">
                    Standard Delivery · ${shippingBaseAmount.toFixed(2)}
                  </span>
                </div>

                <div
                  className={`w-52 h-10 rounded-lg flex items-center px-4 text-sm ${refundShipping
                    ? "bg-white border border-gray-300 text-gray-900"
                    : "bg-gray-100 text-gray-400"
                    }`}
                >
                  ${shippingRefundAmount.toFixed(2)}
                </div>
              </div>
            </div> */}

            {/* REASON */}
            <div className="bg-white border border-gray-300 rounded-2xl p-5">
              <h2 className="text-lg font-medium text-gray-900 mb-5">
                Reason for refund
              </h2>

              <input
                type="text"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full border border-gray-400 rounded-xl px-4 py-3 outline-none"
              />

              <p className="text-sm text-gray-500 mt-3">
                Only you and other staff can see this reason
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white border border-gray-300 rounded-2xl h-fit sticky top-6">
            {/* SUMMARY */}
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-5">
                Summary
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Item subtotal (
                    {
                      products.filter(
                        (item) => (selectedQuantities[item.lineItemId] || 0) > 0
                      ).length
                    }
                    )
                  </span>

                  <span className="font-medium text-gray-900">
                    ${itemRefundTotal.toFixed(2)}
                  </span>
                </div>

                {refundShipping && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>

                    <span className="font-medium text-gray-900">
                      ${shippingRefundAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">
                    Refund total
                  </span>

                  <span className="font-semibold text-gray-900">
                    ${refundTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="p-5">
              <h2 className="text-lg font-medium text-gray-900 mb-3">
                Refund amount
              </h2>

              <div className="border border-gray-400 rounded-xl px-4 h-11 flex items-center text-sm mb-3">
                ${refundTotal.toFixed(2)}
              </div>

              {/* <p className="text-sm text-gray-500 mb-5">
                ${availableRefundAmount.toFixed(2)} available for refund
              </p> */}

              {/* NOTIFY */}
              <div className="flex items-start gap-3 mb-5">
                <input
                  type="checkbox"
                  checked={notifyCustomer}
                  onChange={() => setNotifyCustomer(!notifyCustomer)}
                  className="w-4 h-4 mt-1"
                />

                <p className="text-sm text-gray-700">
                  Send notification once refund is finalized
                </p>
              </div>

              {/* BUTTON */}
              <button
                disabled={refundLoading || refundTotal <= 0}
                onClick={handleRefund}
                className={`w-full h-11 rounded-xl text-sm font-semibold text-white transition ${refundLoading
                  ? "bg-gray-400"
                  : refundTotal <= 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#303030] hover:bg-black"
                  }`}
              >
                {refundLoading
                  ? "Processing..."
                  : `Refund $${refundTotal.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Learn more about refunding orders
        </div>
      </div>
    </main>
  );
};

export default RefundPage;