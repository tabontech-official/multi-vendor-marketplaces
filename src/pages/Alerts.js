import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  RiTimeLine,
  RiRefreshLine,
  RiInboxLine,
  RiSearchLine,
  RiFilter3Line,
  RiCalendarEventLine,
  RiErrorWarningLine,
} from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

const AlertPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchAlerts = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("usertoken");
      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");

      let decodedRole = null;

      if (token) {
        const decoded = jwtDecode(token);
        decodedRole = decoded?.payLoad?.role;
        setRole(decodedRole);
      }

      let apiUrl = "";

      if (decodedRole === "Master Admin" || decodedRole === "Dev Admin") {
        apiUrl = "https://multi-vendor-marketplace.vercel.app/alert";
      } else if (
        decodedRole === "Merchant" ||
        decodedRole === "Merchant Staff"
      ) {
        apiUrl = "https://multi-vendor-marketplace.vercel.app/alert/alerts";
      }

      if (!apiUrl) return;

      const response = await fetch(apiUrl, {
        headers: {
          "x-api-key": apiKey,
          "x-api-secret": apiSecretKey,
        },
      });

      const data = await response.json();

      if (response.ok) {
        const uniqueMap = new Map();

        (data.data || []).forEach((item) => {
          const key = `${item.productId || item.orderId || item.referenceId || "system"
            }-${item.type}`;

          if (
            !uniqueMap.has(key) ||
            new Date(item.createdAt) > new Date(uniqueMap.get(key).createdAt)
          ) {
            uniqueMap.set(key, item);
          }
        });

        const finalData = Array.from(uniqueMap.values()).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setAlerts(finalData);
        setFilteredAlerts(finalData);
      }
    } catch (error) {
      console.error("Operational Issues Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    let result = alerts;

    if (searchTerm) {
      const value = searchTerm.toLowerCase();

      result = result.filter((alert) => {
        return (
          alert.message?.toLowerCase().includes(value) ||
          alert.productId?.toString().toLowerCase().includes(value) ||
          alert.orderId?.toString().toLowerCase().includes(value) ||
          alert.referenceId?.toString().toLowerCase().includes(value) ||
          alert.type?.toLowerCase().includes(value)
        );
      });
    }

    if (statusFilter !== "All") {
      result = result.filter((alert) => alert.type === statusFilter);
    }

    if (startDate) {
      result = result.filter(
        (alert) => new Date(alert.createdAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      result = result.filter((alert) => new Date(alert.createdAt) <= end);
    }

    setFilteredAlerts(result);
  }, [searchTerm, statusFilter, startDate, endDate, alerts]);

  const isAdmin = role === "Master Admin" || role === "Dev Admin";
  const columnCount = isAdmin ? 5 : 4;

  const getStatusStyles = (type) => {
    if (type === "critical") {
      return "bg-red-100 border-red-200 text-red-700";
    }

    if (type === "out_of_stock") {
      return "bg-red-50 border-red-100 text-red-600";
    }

    if (type === "seller_cancelled_no_stock") {
      return "bg-red-50 border-red-100 text-red-600";
    }

    if (type === "high_refund_rate" || type === "high_refund_product") {
      return "bg-rose-50 border-rose-100 text-rose-600";
    }

    if (type === "late_shipping") {
      return "bg-orange-50 border-orange-100 text-orange-600";
    }

    if (type === "low_stock") {
      return "bg-amber-50 border-amber-100 text-amber-600";
    }

    if (type === "low_rating" || type === "negative_review_spike") {
      return "bg-purple-50 border-purple-100 text-purple-600";
    }

    if (type === "conversion") {
      return "bg-blue-50 border-blue-100 text-blue-600";
    }

    return "bg-gray-50 border-gray-100 text-gray-600";
  };

  const getIssueLabel = (type) => {
    const labels = {
      low_stock: "Low Stock",
      out_of_stock: "Out of Stock",
      critical: "Critical",
      conversion: "Conversion Issue",
      late_shipping: "Late Shipping",
      seller_cancelled_no_stock: "No Stock Cancellation",
      high_refund_rate: "High Refund Rate",
      high_refund_product: "High Refund Product",
      low_rating: "Low Rating",
      negative_review_spike: "Negative Review Spike",
    };

    return labels[type] || type?.replaceAll("_", " ") || "Issue";
  };

  const getIconColor = (type) => {
    if (
      type === "critical" ||
      type === "out_of_stock" ||
      type === "seller_cancelled_no_stock"
    ) {
      return "text-red-600";
    }

    if (type === "high_refund_rate" || type === "high_refund_product") {
      return "text-rose-500";
    }

    if (type === "late_shipping") {
      return "text-orange-500";
    }

    if (type === "low_rating" || type === "negative_review_spike") {
      return "text-purple-500";
    }

    if (type === "conversion") {
      return "text-blue-500";
    }

    return "text-amber-400";
  };

  const formatAlertMessage = (alert) => {
    if (!alert) return "Unknown operational issue";

    const type = alert.type || "";
    const message = alert.message || "";
    const lowerMessage = message.toLowerCase();
    const refundReason = alert.meta?.refundReason || "";

    // =========================
    // SYSTEM / CRITICAL ISSUES
    // =========================
    if (
      type === "critical" &&
      lowerMessage.includes("max requests limit exceeded")
    ) {
      return `
Redis request quota exceeded.

Marketplace background processing may be temporarily affected.

Recommended Action:
Please upgrade the active Upstash Redis plan.
    `;
    }

    if (
      type === "critical" &&
      lowerMessage.includes("scheduler processing failed")
    ) {
      return `
Critical scheduler processing issue detected.

Queue operations and feed imports may experience interruptions.
    `;
    }

    // =========================
    // SHIPPING ISSUES
    // =========================
 if (type === "late_shipping" || lowerMessage.includes("late shipping")) {
  return (
    message ||
    "Shipping delay detected. Order fulfillment exceeded the expected dispatch timeframe."
  );
}

    // =========================
    // STOCK / SELLER CANCEL ISSUES
    // =========================
    if (
      type === "seller_cancelled_no_stock" ||
      lowerMessage.includes("cancelled due to no stock") ||
      lowerMessage.includes("no stock")
    ) {
      return "Seller cancelled order due to stock mismatch. Inventory sync should be reviewed.";
    }

    if (type === "out_of_stock") {
      return message || "Product is out of stock and may block customer orders.";
    }

    if (type === "low_stock") {
      return message || "Product stock is below the configured threshold.";
    }

    // =========================
    // REFUND ISSUES
    if (type === "high_refund_rate") {
      return (
        refundReason ||
        message ||
        "High refund rate detected. Product may have sizing, quality, or expectation mismatch issues."
      );
    }

    if (type === "high_refund_product") {
      return (
        refundReason ||
        message ||
        "High refunded product detected. This product has an unusually high number of refunded units and should be reviewed."
      );
    }


    // =========================
    // REVIEW / RATING ISSUES
    // =========================
    if (
      type === "negative_review_spike" ||
      lowerMessage.includes("negative review spike")
    ) {
      return "Recent negative review spike detected. Product quality or fulfillment experience should be reviewed.";
    }

    if (type === "low_rating" || lowerMessage.includes("low rating")) {
      return "Low product rating detected. Product performance is below acceptable rating threshold.";
    }

    // =========================
    // CONVERSION ISSUES
    // =========================
    if (type === "conversion") {
      return (
        message ||
        "Conversion issue detected. Product traffic is not converting at the expected rate."
      );
    }

    return message || "Unknown operational issue";
  };

  const totalIssues = alerts.length;

  const stockIssues = alerts.filter(
    (a) =>
      a.type === "out_of_stock" ||
      a.type === "low_stock" ||
      a.type === "seller_cancelled_no_stock"
  ).length;

  const refundIssues = alerts.filter(
    (a) => a.type === "high_refund_rate" || a.type === "high_refund_product"
  ).length;

  const shippingIssues = alerts.filter((a) => a.type === "late_shipping").length;

  return (
    <main className="w-full p-6 antialiased min-h-screen font-sans bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Operational Issues
          </h1>

          <p className="text-sm text-gray-500 font-medium">
            Track inventory, refunds, shipping delays, cancellations, ratings,
            and review issues.
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
        >
          <RiRefreshLine
            className={`${loading ? "animate-spin" : ""} text-blue-600`}
            size={18}
          />

          {loading ? "Syncing..." : "Refresh Feed"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Total Issues
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-2">
            {totalIssues}
          </h2>
        </div>

        <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-red-400">
            Stock Issues
          </p>

          <h2 className="text-2xl font-black text-red-600 mt-2">
            {stockIssues}
          </h2>
        </div>

        <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-400">
            Refund Issues
          </p>

          <h2 className="text-2xl font-black text-rose-600 mt-2">
            {refundIssues}
          </h2>
        </div>

        <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-400">
            Shipping Issues
          </p>

          <h2 className="text-2xl font-black text-orange-600 mt-2">
            {shippingIssues}
          </h2>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <RiSearchLine
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search issue, product ID, order ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <RiFilter3Line
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <select
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer font-medium"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Operational Issues</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="late_shipping">Late Shipping</option>
            {/* <option value="seller_cancelled_no_stock">
              Seller Cancelled - No Stock
            </option> */}
            <option value="high_refund_rate">High Refund Rate</option>
            <option value="high_refund_product">High Refund Product</option>
            {/* <option value="low_rating">Low Product Rating</option> */}
            {/* <option value="negative_review_spike">Negative Review Spike</option> */}
            <option value="conversion">Conversion Issue</option>
            <option value="critical">Critical System Issue</option>
          </select>
        </div>

        <div className="relative">
          <RiCalendarEventLine
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="date"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="relative">
          <RiCalendarEventLine
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="date"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="relative rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">
                  Issue Type
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">
                  Details
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">
                  Reference
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">
                  Triggered At
                </th>

                {isAdmin && (
                  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 text-right">
                    Performed By
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              <AnimatePresence mode="popLayout">
                {filteredAlerts.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white"
                  >
                    <td colSpan={columnCount} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center">
                        <RiInboxLine size={48} className="text-gray-200 mb-4" />

                        <p className="text-lg font-bold text-gray-800">
                          No matching operational issues found
                        </p>

                        <p className="text-sm text-gray-400">
                          Try changing your filters or date range.
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredAlerts.map((alert, index) => (
                    <motion.tr
                      key={alert._id || `${alert.type}-${index}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.01 }}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight border ${getStatusStyles(
                            alert.type
                          )}`}
                        >
                          {getIssueLabel(alert.type)}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3 max-w-md">
                          <RiErrorWarningLine
                            className={`mt-0.5 shrink-0 ${getIconColor(alert.type)}`}
                            size={16}
                          />

                          <div>
                            <span className="text-sm text-gray-700 font-semibold leading-relaxed whitespace-pre-line">
                              {formatAlertMessage(alert)}
                            </span>

                            {(alert.type === "high_refund_rate" ||
                              alert.type === "high_refund_product") &&
                              alert.meta && (
                                <div className="mt-1 text-xs text-gray-500">
                                  Product: {alert.meta.productName || "N/A"} · Refund rate:{" "}
                                  {Number(alert.meta.refundRate || 0).toFixed(1)}% · Refunded qty:{" "}
                                  {alert.meta.totalRefundedQty || 0}
                                </div>
                              )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                          {alert.productId ||
                            alert.orderId ||
                            alert.referenceId ||
                            "SYSTEM"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-gray-500">
                          <RiTimeLine size={14} />

                          <div className="text-xs font-bold">
                            {alert.createdAt
                              ? new Date(alert.createdAt).toLocaleDateString()
                              : "N/A"}

                            <span className="text-gray-400 ml-2 font-medium">
                              {alert.createdAt
                                ? new Date(alert.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                                : ""}
                            </span>
                          </div>
                        </div>
                      </td>

                      {isAdmin && (
                        <td className="px-6 py-5 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-gray-900">
                              {alert.user?.name || "System"}
                            </span>

                            <span className="text-[10px] text-blue-500 font-black uppercase">
                              Verified
                            </span>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer Statistics */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div className="flex flex-wrap gap-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Total Issues: {alerts.length}
            </span>

            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
              Stock Issues: {stockIssues}
            </span>

            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
              Refund Issues: {refundIssues}
            </span>

            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
              Shipping Issues: {shippingIssues}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-100 w-fit">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            MONITORING ACTIVE
          </div>
        </div>
      </div>
    </main>
  );
};

export default AlertPage;