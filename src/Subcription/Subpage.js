import React, { useEffect, useState, useRef } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import { CreateCheckoutUrl } from "../component/Checkout";
import UseFetchUserData from "../component/fetchUser";
import { HiOutlineRefresh } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { RxCross1 } from "react-icons/rx";
import { useNotification } from "../context api/NotificationContext";
import { CiImport } from "react-icons/ci";
import { FaFileImport } from "react-icons/fa6";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCheckboxCircleLine,
  RiExchangeDollarLine,
  RiOrderPlayLine,
  RiRefund2Line,
} from "react-icons/ri";

const SubscriptionHistory = () => {
  const { userData, loading, error, variantId } = UseFetchUserData();
  const { addNotification } = useNotification();
  const [exportStatus, setExportStatus] = useState("");
  const [stats, setStats] = useState({
    totalOrders: 0,
    fulfilled: 0,
    refunded: 0,
    totalRevenue: 0,
    totalRefundedValue: 0,
    totalRemainingValue: 0,
    fulfilledQty: 0,
    aov: 0,
    fulfillmentRate: 0,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [hasMore, setHasMore] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [totalListings, setTotalListings] = useState(0);
  const [activeListings, setActiveListings] = useState(0);
  const [paidListing, setPaidListing] = useState(0);
  const [freeListing, setFreeListing] = useState(0);
  const [Price, setPrice] = useState(10);
  const [quantity, setQuantity] = useState(1);
  const pricePerCredit = 10;
  const dynamicPrice = quantity * Price;
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef(null);
  const [selectedMerchants, setSelectedMerchants] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportOpen, setIsexportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportAs, setExportAs] = useState("csv");
  const [exportOption, setExportOption] = useState("all");

  const togglePopup = () => setIsexportOpen((prev) => !prev);
  const fetchSubscriptions = async () => {
    const userId = localStorage.getItem("userid");
    const token = localStorage.getItem("usertoken");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    setIsLoading(true);

    if (!userId || !token) {
      console.error("User ID or token not found in localStorage.");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const role = decoded.payLoad?.role;
      const isTokenValid = decoded.exp * 1000 > Date.now();

      const isAdminFlag =
        isTokenValid && (role === "Master Admin" || role === "Dev Admin");

      setIsAdmin(isAdminFlag);

      const url = isAdminFlag
        ? `https://multi-vendor-marketplace.vercel.app/order/getAllOrder?page=${page}&limit=${limit}`
        : `https://multi-vendor-marketplace.vercel.app/order/order?page=${page}&limit=${limit}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          "x-api-secret": apiSecretKey,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const json = await res.json();
        const sortedSubscriptions = json.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        const orders = sortedSubscriptions;
        let totalOrders = orders.length;
        let fulfilled = 0;
        let refunded = 0;
        let totalRevenue = 0;
        let totalRefundedValue = 0;
        let totalRemainingValue = 0;
        let fulfilledQty = 0;
        orders.forEach((order) => {
          let isFulfilled = true;
          let isRefunded = false;
          let orderOriginalTotal = 0;
          let orderRemainingTotal = 0;
          let orderRefundedTotal = 0;

          let allItems = [];

          // User side structure
          if (order.lineItems && order.lineItems.length) {
            allItems = order.lineItems;
          }

          // Admin side structure
          else if (order.lineItemsByMerchant) {
            allItems = Object.values(order.lineItemsByMerchant).flat();
          }

          allItems.forEach((item) => {
            const price = Number(item.price || 0);

            const originalQty = Number(
              item.original_quantity ?? item.current_quantity ?? item.quantity ?? 0
            );

            const itemFulfilledQty = Number(item.fulfilled_quantity || 0);
            const refundedQty = Number(item.refunded_quantity || 0);

            const handledQty = itemFulfilledQty + refundedQty;
            const remainingQty = Math.max(originalQty - handledQty, 0);

            const refundedAmount = Number(
              item.refunded_amount || price * refundedQty || 0
            );

            orderOriginalTotal += price * originalQty;
            orderRemainingTotal += price * remainingQty;
            orderRefundedTotal += refundedAmount;

            fulfilledQty += itemFulfilledQty;

            if (originalQty <= 0 || handledQty < originalQty) {
              isFulfilled = false;
            }

            if (
              refundedQty > 0 ||
              refundedAmount > 0 ||
              item.refund_status === "partially_refunded" ||
              item.refund_status === "fully_refunded"
            ) {
              isRefunded = true;
            }
          });

          // Fallback: agar backend ne order.refunds bheja ho
          if (orderRefundedTotal === 0 && Array.isArray(order.refunds)) {
            orderRefundedTotal = order.refunds.reduce((sum, refund) => {
              return sum + Number(refund.refundAmount || 0);
            }, 0);

            if (orderRefundedTotal > 0) {
              isRefunded = true;
            }
          }

          if (isFulfilled && allItems.length) fulfilled++;
          if (isRefunded) refunded++;

          totalRevenue += orderOriginalTotal;
          totalRefundedValue += orderRefundedTotal;
          totalRemainingValue += orderRemainingTotal;
        });

        const aov = totalOrders ? totalRevenue / totalOrders : 0;
        const fulfillmentRate = totalOrders
          ? ((fulfilled / totalOrders) * 100).toFixed(1)
          : 0;

        setStats({
          totalOrders,
          fulfilled,
          refunded,
          totalRevenue,
          totalRefundedValue,
          totalRemainingValue,
          fulfilledQty,
          aov,
          fulfillmentRate,
        });
        setSubscriptions(sortedSubscriptions);
        setFilteredSubscriptions(sortedSubscriptions);

        if (json.totalPages) {
          setHasMore(page < json.totalPages);
        }
      } else {
        console.error("Failed to fetch subscriptions:", res.status);
      }
    } catch (error) {
      console.error("Error decoding token or fetching subscriptions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchSubscriptions();
  // }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [page, limit]);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const userId = localStorage.getItem("userid");
      const token = localStorage.getItem("usertoken");
      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");

      if (!userId || !token || !apiKey || !apiSecretKey) {
        alert("Missing credentials or token");
        return;
      }

      const decoded = jwtDecode(token);
      const role = decoded?.payLoad?.role;
      const isTokenValid = decoded?.exp * 1000 > Date.now();

      if (!isTokenValid) {
        alert("Session expired. Please login again.");
        return;
      }

      const isAdminUser =
        role === "Master Admin" || role === "Dev Admin";

      const queryParams = new URLSearchParams();

      queryParams.append("type", exportOption);

      if (exportOption === "current") {
        queryParams.append("page", String(page));
        queryParams.append("limit", String(limit));
      }

      if (exportStatus) {
        queryParams.append("status", exportStatus);
      }

      if (!isAdminUser) {
        queryParams.append("userId", userId);
      }

      const exportUrl = isAdminUser
        ? `https://multi-vendor-marketplace.vercel.app/order/exportAllOrder?${queryParams.toString()}`
        : `https://multi-vendor-marketplace.vercel.app/order/exportOrderByUserId?${queryParams.toString()}`;

      const response = await fetch(exportUrl, {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          "x-api-secret": apiSecretKey,
        },
      });

      if (!response.ok) {
        let message = "Export failed";

        try {
          const error = await response.json();
          message = error.message || message;
        } catch {
          message = response.statusText || message;
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        throw new Error("No data found for export");
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const statusPart = exportStatus || "all-status";
      const fileName = `orders-${exportOption}-${statusPart}-${Date.now()}.csv`;

      link.href = downloadUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

      addNotification("Orders exported successfully", "Orders");
      setIsexportOpen(false);
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed: " + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleClickOutside = (event) => {
    if (dialogRef.current && !dialogRef.current.contains(event.target)) {
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (token) {
      const decoded = jwtDecode(token);
      const role = decoded?.payLoad?.role;
      const isTokenValid = decoded.exp * 1000 > Date.now();
      setIsAdmin(
        isTokenValid && (role === "Master Admin" || role === "Dev Admin"),
      );
    }
  }, []);

  const [searchVal, setSearchVal] = useState("");
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);

  const handleSearch = () => {
    const value = searchVal.toLowerCase().trim();

    if (!value) {
      setFilteredSubscriptions(subscriptions);
      return;
    }

    const filtered = subscriptions.filter((subscription) => {
      const adminItems = Object.values(
        subscription.lineItemsByMerchant || {}
      ).flat();

      const userItems = subscription.lineItems || [];
      const allItems = adminItems.length > 0 ? adminItems : userItems;

      const searchableText = [
        subscription.shopifyOrderNo,
        subscription.serialNo,
        subscription.orderId,
        subscription.createdAt
          ? formatDate(subscription.createdAt)
          : "",

        ...(subscription.merchants || []).flatMap((merchant) => [
          merchant.info?.name,
          merchant.info?.email,
        ]),

        getOrderStatus(allItems),

        ...allItems.flatMap((item) => [
          item.name,
          item.title,
          item.sku,
          item.fulfillment_status || "unfulfilled",
          item.refund_status,
          item.price,
          item.quantity,
          item.customer?.[0]?.created_at
            ? formatDate(item.customer[0].created_at)
            : "",
        ]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(value);
    });

    setFilteredSubscriptions(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchVal, subscriptions]);

  // const getOrderStatus = (items) => {
  //   if (!items || !items.length) return "Unfulfilled";

  //   const hasCancelled = items.some(
  //     (item) => item.fulfillment_status === "cancelled"
  //   );

  //   if (hasCancelled) return "Cancelled";

  //   const statusChecks = items.map((item) => {
  //     const originalQty = Number(
  //       item.original_quantity ?? item.current_quantity ?? item.quantity ?? 0
  //     );

  //     const fulfilledQty = Number(item.fulfilled_quantity || 0);
  //     const refundedQty = Number(item.refunded_quantity || 0);

  //     const handledQty = fulfilledQty + refundedQty;

  //     return {
  //       originalQty,
  //       fulfilledQty,
  //       refundedQty,
  //       handledQty,
  //       isFullyHandled: originalQty > 0 && handledQty >= originalQty,
  //       isPartiallyHandled: handledQty > 0 && handledQty < originalQty,
  //     };
  //   });

  //   const allFullyHandled = statusChecks.every((item) => item.isFullyHandled);
  //   const someHandled = statusChecks.some(
  //     (item) => item.isFullyHandled || item.isPartiallyHandled
  //   );

  //   if (allFullyHandled) return "Fulfilled";
  //   if (someHandled) return "Partial";

  //   return "Unfulfilled";
  // };


  const getOrderStatus = (items) => {
    if (!items || !items.length) return "Unfulfilled";

    const hasCancelled = items.some(
      (item) => item.fulfillment_status === "cancelled"
    );

    if (hasCancelled) return "Cancelled";

    const statusChecks = items.map((item) => {
      const originalQty = Number(
        item.original_quantity ?? item.current_quantity ?? item.quantity ?? 0
      );

      const fulfilledQty = Number(item.fulfilled_quantity || 0);
      const refundedQty = Number(item.refunded_quantity || 0);

      const handledQty = fulfilledQty + refundedQty;

      return {
        originalQty,
        fulfilledQty,
        refundedQty,
        handledQty,

        isFullyRefunded: originalQty > 0 && refundedQty >= originalQty,

        isPartiallyRefunded:
          originalQty > 0 && refundedQty > 0 && refundedQty < originalQty,

        isFullyHandled: originalQty > 0 && handledQty >= originalQty,

        isPartiallyHandled: handledQty > 0 && handledQty < originalQty,
      };
    });

    const allFullyRefunded = statusChecks.every((item) => item.isFullyRefunded);

    const someRefunded = statusChecks.some(
      (item) => item.isFullyRefunded || item.isPartiallyRefunded
    );

    const allFullyHandled = statusChecks.every((item) => item.isFullyHandled);

    const someHandled = statusChecks.some(
      (item) => item.isFullyHandled || item.isPartiallyHandled
    );

    // 1. Agar har product ki full quantity refund ho gayi
    if (allFullyRefunded) return "Refunded";

    // 2. Agar kuch refund hua hai aur baqi fulfilled/handled hai
    if (someRefunded && allFullyHandled) return "Fulfilled";

    // 3. Agar koi refund hua hai lekin order abhi fully handled nahi
    if (someRefunded && !allFullyHandled) return "Partial";

    // 4. Normal fulfilled logic
    if (allFullyHandled) return "Fulfilled";

    if (someHandled) return "Partial";

    return "Unfulfilled";
  };
  return (
    <div
      className={`flex flex-col bg-gray-50 px-3 py-6 ${isDialogOpen ? "blur-background" : ""
        }`}
    >
      <div className="flex">
        <div className="pt-4 min-w-full px-3 bg-white  rounded-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-gray-200 pb-4 gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900 mb-0.5">
                Manage orders
              </h1>
              <p className="text-sm text-gray-500">
                Here you can manage orders.
              </p>
            </div>

            <div className="flex-1 w-full max-w-sm mx-auto">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full p-1.5 text-sm border border-gray-300 rounded-md
        focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
              />
            </div>

            <div className="flex-1 flex items-center justify-end gap-2 w-full">
              {/* <button
                onClick={togglePopup}
                className="bg-gray-400 border border-gray-300 hover:bg-gray-500
        text-gray-800 px-3 h-8 text-sm font-medium rounded-md
        flex items-center gap-1.5 shadow-sm"
              >
                <FaFileImport className="w-4 h-4" />
                Export
              </button> */}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-3">
            {/* --- Total Orders --- */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                  <RiOrderPlayLine
                    className="text-gray-400 group-hover:text-blue-600"
                    size={22}
                  />
                </div>

              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Total Orders
                </p>
                <h2 className="text-2xl font-bold text-gray-900 leading-none">
                  {stats.totalOrders?.toLocaleString() || 0}
                </h2>
              </div>
            </div>

            {/* --- Fulfilled Orders --- */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-emerald-50 transition-colors">
                  <RiCheckboxCircleLine
                    className="text-gray-400 group-hover:text-emerald-600"
                    size={22}
                  />
                </div>
                <div className="h-1.5 w-16 bg-gray-100 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${stats.fulfillmentRate}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Fulfilled
                </p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl font-bold text-gray-900 leading-none">
                    {stats.fulfilled || 0}
                  </h2>
                  <span className="text-[10px] font-bold text-emerald-600">
                    ({stats.fulfillmentRate}%)
                  </span>
                </div>
              </div>
            </div>

            {/* --- Refunded Orders --- */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-red-50 transition-colors">
                  <RiRefund2Line
                    className="text-gray-400 group-hover:text-red-600"
                    size={22}
                  />
                </div>
                <span className="flex items-center text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg">
                  <RiArrowDownSLine size={14} /> 2%
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Refunded
                </p>
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-bold text-gray-900 leading-none">
                    {stats.refunded || 0}
                  </h2>

                  <p className="text-xs font-bold text-red-600">
                    ${Number(stats.totalRefundedValue || 0).toFixed(2)} refunded
                  </p>
                </div>
              </div>
            </div>

            {/* --- AOV (Average Order Value) --- */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                  <RiExchangeDollarLine
                    className="text-gray-400 group-hover:text-indigo-600"
                    size={22}
                  />
                </div>
                <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                  AVG
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Avg. Order Value
                </p>
                <h2 className="text-2xl font-bold text-gray-900 leading-none">
                  ${stats.aov?.toFixed(2) || "0.00"}
                </h2>
              </div>
            </div>
          </div>
          <div className="w-full  max-sm:w-auto  max-sm:flex items-center mt-2">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <HiOutlineRefresh className="animate-spin text-xl text-gray-500" />
                loading...
              </div>
            ) : (
              <div className="max-sm:overflow-auto border rounded-lg">
                <table className="w-full border-collapse bg-white">
                  <thead className="bg-gray-100 text-gray-600 text-sm  sticky top-0 text-left">
                    <tr>
                      <th scope="col" className="p-3">
                        #
                      </th>

                      <th scope="col" className="p-3">
                        Date Purchased
                      </th>

                      {isAdmin && (
                        <th scope="col" className="p-3">
                          Merchant Name
                        </th>
                      )}

                      <th scope="col" className="p-3">
                        Item
                      </th>
                      <th scope="col" className="p-3">
                        Units Sold
                      </th>
                      <th scope="col" className="p-3">
                        Status
                      </th>
                      <th scope="col" className="p-3">
                        Total Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isAdmin
                      ? filteredSubscriptions.map((subscription, index) => {
                        const orderId = subscription.serialNo;

                        return subscription.merchants.map(
                          (merchant, mIndex) => {
                            const merchantId = merchant.id;
                            const merchantItems =
                              subscription.lineItemsByMerchant?.[
                              merchantId
                              ] || [];

                            if (!merchantItems.length) return null;

                            const customer = merchantItems[0]?.customer?.[0];
                            const orderDate = customer?.created_at;
                            const shopifyOrderId = merchantItems[0]?.orderId;

                            const orderStatus = getOrderStatus(merchantItems);

                            const totalQuantity = merchantItems.reduce(
                              (sum, item) => sum + (item.quantity || 0),
                              0,
                            );

                            const totalPrice = merchantItems.reduce(
                              (sum, item) => {
                                const price = parseFloat(item.price || 0);
                                const qty = parseInt(item.quantity || 0);
                                return sum + price * qty;
                              },
                              0,
                            );

                            return (
                              <tr
                                key={`${orderId}-${merchantId}`}
                                className={`border-b ${(index + mIndex) % 2 === 0
                                  ? "bg-white"
                                  : "bg-gray-100"
                                  } w-full`}
                              >
                                <td
                                  className="p-3 cursor-pointer text-blue-600 hover:underline"
                                  onClick={() => {
                                    if (shopifyOrderId) {
                                      navigate(
                                        `/order/${shopifyOrderId}/${merchantId}`,
                                        {
                                          state: {
                                            merchantId,
                                            shopifyOrderId,
                                            serialNo: orderId,
                                            order: subscription,
                                          },
                                        },
                                      );
                                    } else {
                                    }
                                  }}
                                >
                                  #{orderId}
                                </td>
                                {/* <td className="p-3">
                                    {merchantItems[0]?.image?.src ? (
                                      <img
                                        src={merchantItems[0].image.src}
                                        alt={
                                          merchantItems[0].image.alt ||
                                          "Product"
                                        }
                                        className="w-16 h-16 object-contain rounded border"
                                      />
                                    ) : (
                                      <span className="text-gray-400 text-xs">
                                        No Image
                                      </span>
                                    )}
                                  </td> */}
                                <td className="p-3">
                                  {orderDate ? formatDate(orderDate) : "N/A"}
                                </td>

                                <td className="p-3 text-sm">
                                  {merchant.info?.name || "N/A"}
                                </td>
                                <td className="p-3">{totalQuantity} items</td>
                                <td className="p-3">{totalQuantity}</td>
                                {/* <td className="p-3">
                                    <span
                                      className={`px-2 py-1 rounded text-xs font-medium ${
                                        fulfillment_status === "fulfilled"
                                          ? "bg-green-200 text-green-800"
                                          : fulfillment_status === "cancelled"
                                            ? "bg-red-200 text-red-800"
                                            : "bg-yellow-200 text-yellow-800"
                                      }`}
                                    >
                                      {fulfillment_status === "fulfilled"
                                        ? "Fulfilled"
                                        : fulfillment_status === "cancelled"
                                          ? "Cancelled"
                                          : "Unfulfilled"}
                                    </span>
                                  </td> */}
                                <td className="p-3">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${orderStatus === "Refunded"
                                      ? "bg-purple-200 text-purple-800"
                                      : orderStatus === "Fulfilled"
                                        ? "bg-green-200 text-green-800"
                                        : orderStatus === "Cancelled"
                                          ? "bg-red-200 text-red-800"
                                          : orderStatus === "Partial"
                                            ? "bg-blue-200 text-blue-800"
                                            : "bg-yellow-200 text-yellow-800"
                                      }`}
                                  >
                                    {orderStatus}
                                  </span>
                                </td>

                                <td className="p-3">
                                  ${totalPrice.toFixed(2)}
                                </td>
                              </tr>
                            );
                          },
                        );
                      })
                      : filteredSubscriptions.map((subscription, index) => {
                        const address =
                          subscription.customer?.default_address;
                        const firstItem = subscription.lineItems?.[0];
                        if (!firstItem) return null;
                        const orderStatus = getOrderStatus(
                          subscription.lineItems,
                        );

                        return (
                          <tr
                            key={subscription.orderId}
                            className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-100"
                              } w-full`}
                          >
                            <td
                              className="p-3 text-blue-600 hover:underline cursor-pointer"
                              onClick={() => {
                                const merchantId =
                                  subscription.ProductSnapshot?.find(
                                    (p) =>
                                      String(p.variantId) ===
                                      String(firstItem.variant_id),
                                  )?.merchantId;

                                console.log("Navigating with data:", {
                                  order: subscription,
                                  productName: firstItem.name,
                                  sku: firstItem.sku,
                                  index: 101 + index,
                                  serialNumber: subscription.orderId,
                                  merchantId,
                                });

                                navigate(
                                  `/order/${subscription.orderId}/${merchantId}`,
                                  {
                                    state: {
                                      order: subscription,
                                      productName: firstItem.name,
                                      sku: firstItem.sku,
                                      index: 101 + index,
                                      serialNumber: subscription.orderId,
                                      merchantId,
                                    },
                                  },
                                );
                              }}
                            >
                              #{subscription.shopifyOrderNo}
                            </td>
                            {/* <td className="p-3">
                                {firstItem?.image?.src ? (
                                  <img
                                    src={firstItem.image.src}
                                    alt={firstItem.image.alt || "Product"}
                                    className="w-16 h-16 object-contain rounded border"
                                  />
                                ) : (
                                  <span className="text-gray-400 text-xs">
                                    No Image
                                  </span>
                                )}
                              </td> */}
                            <td className="p-3">
                              {formatDate(subscription.createdAt)}
                            </td>

                            <td className="p-3">
                              <div className="text-xs text-blue-500 mt-1">
                                {subscription.lineItems.length}{" "}
                                {subscription.lineItems.length === 1
                                  ? "item"
                                  : "items"}
                              </div>
                            </td>
                            <td className="p-3">
                              {subscription.lineItems.reduce(
                                (sum, item) => sum + (item.quantity || 0),
                                0,
                              )}
                            </td>

                            <td className="p-3">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${orderStatus === "Fulfilled"
                                  ? "bg-green-200 text-green-800"
                                  : orderStatus === "Cancelled"
                                    ? "bg-red-200 text-red-800"
                                    : orderStatus === "Partial"
                                      ? "bg-blue-200 text-blue-800"
                                      : "bg-yellow-200 text-yellow-800"
                                  }`}
                              >
                                {orderStatus}
                              </span>
                            </td>

                            <td className="p-3">
                              $
                              {subscription.lineItems
                                .reduce((total, item) => {
                                  const price = parseFloat(item.price || 0);
                                  const qty = parseInt(item.quantity || 0);
                                  return total + price * qty;
                                }, 0)
                                .toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center px-4 py-3 bg-gray-50 border border-gray-200">
                  <div className="text-sm text-gray-700 mb-2 md:mb-0">
                    Total Orders{" "}
                    <span className="font-medium">{filteredSubscriptions.length}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">
                      Orders per page:
                    </label>
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                    >
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={200}>200</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          {isExportOpen && (
            <div
              onClick={() => setIsexportOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative transform scale-95 animate-zoomIn transition-all duration-300"
              >
                <div className="flex justify-between border-b border-gray-200">
                  <h2 className="text-md text-gray-600 font-semibold mb-2">
                    Export orders
                  </h2>
                  <RxCross1
                    onClick={() => setIsexportOpen(false)}
                    className="hover:text-red-500 cursor-pointer"
                  />
                </div>

                <p className="text-sm mb-3 mt-3">
                  This CSV file can export all order information. .
                </p>

                <div className="mb-4">
                  <label className="text-md text-gray-600 font-semibold block mb-2">
                    Export
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="exportOption"
                        value="current"
                        checked={exportOption === "current"}
                        onChange={() => setExportOption("current")}
                      />
                      Top 10
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="exportOption"
                        value="all"
                        checked={exportOption === "all"}
                        onChange={() => setExportOption("all")}
                      />
                      All orders
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-md text-gray-600 font-semibold block mb-2">
                    Filter by Fulfillment Status
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="statusFilter"
                        value=""
                        checked={exportStatus === ""}
                        onChange={() => setExportStatus("")}
                      />
                      All
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="statusFilter"
                        value="fulfilled"
                        checked={exportStatus === "fulfilled"}
                        onChange={() => setExportStatus("fulfilled")}
                      />
                      Fulfilled
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="statusFilter"
                        value="unfulfilled"
                        checked={exportStatus === "unfulfilled"}
                        onChange={() => setExportStatus("unfulfilled")}
                      />
                      Unfulfilled
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="statusFilter"
                        value="cancelled"
                        checked={exportStatus === "cancelled"}
                        onChange={() => setExportStatus("cancelled")}
                      />
                      Cancelled
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="statusFilter"
                        value="refunded"
                        checked={exportStatus === "refunded"}
                        onChange={() => setExportStatus("refunded")}
                      />
                      Refunded
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-gray-300">
                  <button
                    onClick={() => setIsexportOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded mt-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className={`px-4 py-2 rounded mt-2 flex items-center gap-2 ${isExporting ? "bg-gray-500" : "bg-gray-800"
                      } text-white`}
                  >
                    {isExporting ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Exporting...
                      </>
                    ) : (
                      "Export orders"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHistory;
