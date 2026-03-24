import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  RiTimeLine,
  RiInformationLine,
  RiRefreshLine,
  RiLoader4Line,
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

  // Filter States
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
        decodedRole = decoded.payLoad.role;
        setRole(decodedRole);
      }

      let apiUrl = "";
      if (decodedRole === "Master Admin" || decodedRole === "Dev Admin") {
        apiUrl = "http://localhost:5000/alert";
      } else if (decodedRole === "Merchant" || decodedRole === "Merchant Staff") {
        apiUrl = `http://localhost:5000/alert/alerts`;
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
          const key = `${item.productId}-${item.type}`;
          if (!uniqueMap.has(key) || new Date(item.createdAt) > new Date(uniqueMap.get(key).createdAt)) {
            uniqueMap.set(key, item);
          }
        });
        const finalData = Array.from(uniqueMap.values());
        setAlerts(finalData);
        setFilteredAlerts(finalData);
      }
    } catch (error) {
      console.error("Alerts Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Updated Filter Logic for low_stock & out_of_stock
  useEffect(() => {
    let result = alerts;

    if (searchTerm) {
      result = result.filter((alert) =>
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.productId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((alert) => alert.type === statusFilter);
    }

    if (startDate) {
      result = result.filter((alert) => new Date(alert.createdAt) >= new Date(startDate));
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

  // Helper for Status Badge Styling
  const getStatusStyles = (type) => {
    if (type === "out_of_stock") return "bg-red-50 border-red-100 text-red-600";
    if (type === "low_stock") return "bg-amber-50 border-amber-100 text-amber-600";
    return "bg-gray-50 border-gray-100 text-gray-600";
  };

  return (
    <main className="w-full p-6 antialiased min-h-screen font-sans bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Inventory Alerts</h1>
          <p className="text-sm text-gray-500 font-medium">Track stock levels and critical inventory updates.</p>
        </div>
        <button
          onClick={fetchAlerts}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
        >
          <RiRefreshLine className={`${loading ? 'animate-spin' : ''} text-blue-600`} size={18} />
          {loading ? "Syncing..." : "Refresh Feed"}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search Product ID or message..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <RiFilter3Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer font-medium"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Inventory Levels</option>
            <option value="low_stock">Low Stock Alerts</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        <div className="relative">
          <RiCalendarEventLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="date"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="relative">
          <RiCalendarEventLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Inventory Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Product ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Timestamp</th>
                {isAdmin && <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 text-right">Performed By</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence mode="popLayout">
                {filteredAlerts.length === 0 ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white">
                    <td colSpan={columnCount} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center">
                        <RiInboxLine size={48} className="text-gray-200 mb-4" />
                        <p className="text-lg font-bold text-gray-800">No matching alerts found</p>
                        <p className="text-sm text-gray-400">Try changing your filters or date range.</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredAlerts.map((alert, index) => (
                    <motion.tr
                      key={alert._id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.01 }}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight border ${getStatusStyles(alert.type)}`}>
                          {alert.type?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3 max-w-md">
                          <RiErrorWarningLine className={`mt-0.5 shrink-0 ${alert.type === 'out_of_stock' ? 'text-red-400' : 'text-amber-400'}`} size={16} />
                          <span className="text-sm text-gray-700 font-semibold leading-relaxed">{alert.message}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                          {alert.productId || "SYS-GEN"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-gray-500">
                          <RiTimeLine size={14} />
                          <div className="text-xs font-bold">
                            {new Date(alert.createdAt).toLocaleDateString()}
                            <span className="text-gray-400 ml-2 font-medium">
                              {new Date(alert.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-5 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-gray-900">{alert.user?.name || "System"}</span>
                            <span className="text-[10px] text-blue-500 font-black uppercase">Verified</span>
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
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
           <div className="flex gap-4">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
               Total: {alerts.length}
             </span>
             <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
               Out of Stock: {alerts.filter(a => a.type === 'out_of_stock').length}
             </span>
           </div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              MONITORING ACTIVE
           </div>
        </div>
      </div>
    </main>
  );
};

export default AlertPage;