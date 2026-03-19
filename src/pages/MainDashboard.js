import React, { useState, useEffect } from "react";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { RiArrowUpSLine, RiStore3Line } from "react-icons/ri";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { MdPreview } from "react-icons/md";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MainDashboard = () => {
  const navigate = useNavigate();
  const [topProducts, setTopProducts] = useState([]);
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const token = localStorage.getItem("usertoken");
        const apiKey = localStorage.getItem("apiKey");
        const apiSecretKey = localStorage.getItem("apiSecretKey");
        const userId = localStorage.getItem("userid");

        let decodedRole = null;

        if (token) {
          const decoded = jwtDecode(token);
          decodedRole = decoded.payLoad.role;
        }

        let apiUrl = "";

        // ✅ ADMIN
        if (decodedRole === "Master Admin" || decodedRole === "Dev Admin") {
          apiUrl =
            "https://multi-vendor-marketplace.vercel.app/product/topProducts?limit=4&period=month";
        } else if (
          decodedRole === "Merchant" ||
          decodedRole === "Merchant Staff"
        ) {
          apiUrl = `https://multi-vendor-marketplace.vercel.app/product/topProductsForMerchants/?limit=4&period=month`;
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
          setTopProducts(data.data || []);
        } else {
          console.error("Top Products API failed");
        }
      } catch (error) {
        console.error("Top Products Error:", error);
      }
    };

    fetchTopProducts();
  }, []);
  const alerts = [
    {
      title: "Low Stock",
      message: "Product A – Only 6 left",
      bg: "bg-yellow-50 border-yellow-200 text-yellow-700",
    },
    {
      title: "Out of Stock",
      message: "Product B is out of stock",
      bg: "bg-red-50 border-red-200 text-red-600",
    },
    {
      title: "Low Conversion",
      message: "2 products below 1.5%",
      bg: "bg-blue-50 border-blue-200 text-blue-600",
    },
    {
      title: "High Refund Rate",
      message: "Returns higher than average",
      bg: "bg-purple-50 border-purple-200 text-purple-600",
    },
    {
      title: "Shipping Issue",
      message: "12% orders shipped late",
      bg: "bg-gray-50 border-gray-200 text-gray-700",
    },
  ];

  const visibleAlerts = alerts.slice(0, 3);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    incomeGrowth: 0,
    lastYearIncome: 0,
    spend: 0,
    spendGrowth: 0,
    lastYearSpend: 0,
  });
  const [productCount, setProductCount] = useState(0);
  const [productActiveCount, setActiveProductCount] = useState(0);
  const [productInActiveCount, setInActiveProductCount] = useState(0);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const token = localStorage.getItem("usertoken");
        const apiKey = localStorage.getItem("apiKey");
        const apiSecretKey = localStorage.getItem("apiSecretKey");
        const userId = localStorage.getItem("userid");
        let decodedRole = null;

        if (token) {
          const decoded = jwtDecode(token);
          decodedRole = decoded.payLoad.role;
        }

        let apiUrl = "";
        if (decodedRole === "Master Admin" || decodedRole === "Dev Admin") {
          apiUrl = "https://multi-vendor-marketplace.vercel.app/order/monthlyRevenue";
        } else if (
          decodedRole === "Merchant" ||
          decodedRole === "Merchant Staff"
        ) {
          apiUrl = `https://multi-vendor-marketplace.vercel.app/order/monthlyRevenue/${userId}`;
        }

        const response = await fetch(apiUrl, {
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch monthly revenue");
        }

        const data = await response.json();

        const revenueObj = data.revenue || {};
        const labels = Object.keys(revenueObj);
        const incomeData = Object.values(revenueObj);

        setChartData({
          labels,
          datasets: [
            {
              label: "Income",
              data: incomeData,
              backgroundColor: "#06b6d4",
              borderRadius: 6,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching monthly revenue:", error);
      }
    };

    fetchMonthlyRevenue();
  }, []);

  const data = {
    labels: ["Dec 22", "Jan 23", "Feb 23", "Mar 23", "Apr 23"],
    datasets: [
      {
        label: "Income",
        data: [60000, 100000, 50000, 70000, 90000],
        backgroundColor: "#06b6d4",
        borderRadius: 6,
      },
      {
        label: "Spend",
        data: [30000, 35000, 20000, 40000, 60000],
        backgroundColor: "#d1d5db",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#4b5563",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value / 1000}k`,
          color: "#6b7280",
        },
        grid: {
          color: "#e5e7eb",
        },
      },
      x: {
        ticks: {
          color: "#6b7280",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  useEffect(() => {
    const getProductCount = async () => {
      try {
        const apiKey = localStorage.getItem("apiKey");
        const token = localStorage.getItem("usertoken");

        const apiSecretKey = localStorage.getItem("apiSecretKey");
        let decodedRole = null;
        if (token) {
          const decoded = jwtDecode(token);
          decodedRole = decoded.payLoad.role;
        }

        let apiUrl = "";

        if (decodedRole === "Master Admin" || decodedRole === "Dev Admin") {
          apiUrl = "https://multi-vendor-marketplace.vercel.app/product/getProductCount";
        } else if (decodedRole === "Merchant") {
          const userId = localStorage.getItem("userid");
          apiUrl = `https://multi-vendor-marketplace.vercel.app/product/getProductForCharts/${userId}`;
        }

        if (apiUrl) {
          const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              "x-api-key": apiKey,
              "x-api-secret": apiSecretKey,
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();
          if (response.ok) {
            const dataMap = {};
            data.forEach((item) => {
              dataMap[item.status.toLowerCase()] = item.count;
            });

            setProductCount(dataMap.total || 0);
            setActiveProductCount(dataMap.active || 0);
            setInActiveProductCount(dataMap.inactive || 0);
          } else {
            console.error("Failed to fetch count:", data.message);
          }
        }
      } catch (error) {
        console.error("Error fetching product count:", error);
      }
    };

    getProductCount();
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("usertoken");
        const userRole = localStorage.getItem("userRole");

        let decodedRole = null;
        if (token) {
          const decoded = jwtDecode(token);
          decodedRole = decoded.payLoad.role;
        }
        console.log(decodedRole);
        let apiUrl = "";

        if (decodedRole === "Master Admin" || decodedRole === "Dev Admin") {
          apiUrl = "https://multi-vendor-marketplace.vercel.app/order/recurringFinance";
        } else if (decodedRole === "Merchant") {
          const userId = localStorage.getItem("userid");
          apiUrl = `https://multi-vendor-marketplace.vercel.app/order/getFinanceSummaryForUser/${userId}`;
        }

        if (apiUrl) {
          const response = await fetch(apiUrl);
          const data = await response.json();
          setSummary(data);
        }
      } catch (error) {
        console.error("Failed to fetch finance summary:", error);
      }
    };

    fetchSummary();
  }, []);

  const [viewCount, setViewCount] = useState(0);
  const [perDayCount, setPerDayCount] = useState(0);
  const [perHourCount, setHourCount] = useState(0);

  const userId = localStorage.getItem("userid");

  useEffect(() => {
    const fetchUserViewCount = async () => {
      try {
        const token = localStorage.getItem("usertoken");
        let role = null;

        if (token) {
          const decoded = jwtDecode(token);
          role = decoded.payLoad.role;
        }

        let url = "";

        if (role === "Merchant" || role === "Merchant Staff") {
          url = `https://multi-vendor-marketplace.vercel.app/product/trackingViews/${userId}`;
        } else if (role === "Master Admin" || role === "Dev Admin") {
          url = `https://multi-vendor-marketplace.vercel.app/product/trackingViews`;
        }

        if (!url) return;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();

          if (role === "Merchant" || role === "Merchant Staff") {
            setViewCount(data.totalViews);
            setPerDayCount(data.weeklyViews);
            setHourCount(data.monthlyViews);
          } else {
            setViewCount(data.totalViews);
            setPerDayCount(data.weeklyViews);
            setHourCount(data.monthlyViews);
          }
        } else {
          console.error("Failed to fetch user view count");
        }
      } catch (error) {
        console.error("Error fetching user view count:", error);
      }
    };

    fetchUserViewCount();
  }, [userId]);

  return (
    <main className="w-full p-4 ">
      <div className="flex flex-col md:flex-row md:justify-between items-start border-b-2 border-gray-200 pb-4">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 mb-0.5">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Overview of your store performance and activities.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 lg:grid-rows-2 gap-4 p-4 antialiased">
        {/* --- Card 1: Revenue (Double Height/Focus Card) --- */}
        <div className="xl:row-span-2 group relative overflow-hidden rounded-3xl bg-gray-200 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-300 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="w-24 h-24 bg-emerald-500 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50/50">
                  <span className="text-xl font-bold">$</span>
                </div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Net Revenue
                </h3>
              </div>

              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-1 tabular-nums">
                ${summary.netProfit?.toLocaleString() || 0}
              </h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  summary.revenueGrowth >= 0
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {summary.revenueGrowth >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(summary.revenueGrowth)}% vs last month
              </span>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-gray-500 uppercase">
                  Settled
                </span>
                <span className="text-sm font-bold text-gray-700">
                  ${summary.paidIncome || 0}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000 w-[70%]" />
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Real-time profit tracking after shipping and processing fees.
              </p>
            </div>
          </div>
        </div>

        {/* --- Card 2: Orders (The Minimalist) --- */}
        {/* --- Card 2: Orders --- */}
        <div className="group rounded-3xl bg-gray-200 p-6 shadow-sm border border-gray-300 hover:border-blue-200 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <RiStore3Line size={24} />
            </div>

            <div className="text-right">
              <p className="text-xs font-bold text-gray-500 uppercase">
                Orders
              </p>

              <p className="text-2xl font-black text-gray-900 tabular-nums">
                {summary.totalOrdersInDb || 0}
              </p>

              {/* 🔥 Growth */}
              {/* <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
    ${
      summary.lastMonthOrders === 0
        ? "bg-gray-700 text-gray-300"
        : summary.ordersGrowth >= 0
          ? "bg-green-100 text-green-600"
          : "bg-red-100 text-red-500"
    }`}
              >
                {summary.lastMonthOrders === 0
                  ? "New"
                  : `${summary.ordersGrowth >= 0 ? "↑" : "↓"} ${Math.abs(summary.ordersGrowth)}%`}
              </span> */}
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 bg-gray-100 p-3 rounded-2xl">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                Fulfilled
              </p>
              <p className="text-sm font-bold text-green-600">
                {summary.fulfilledOrders || 0}
              </p>
            </div>

            <div className="flex-1 bg-gray-100 p-3 rounded-2xl">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                Pending
              </p>
              <p className="text-sm font-bold text-orange-500">
                {summary.unfulfilledOrders || 0}
              </p>
            </div>
          </div>
        </div>

        {/* --- Card 3: Traffic --- */}
        <div className="group rounded-3xl bg-gray-200 p-6 shadow-sm border border-gray-300 hover:border-amber-200 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
              <MdPreview size={24} />
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">
                Live Traffic
              </p>

              <p className="text-2xl font-black text-gray-900 tabular-nums">
                {summary.totalViews || 0}
              </p>

              {/* 🔥 Growth */}
              {/* <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
    ${
      summary.lastMonthViews === 0
        ? "bg-gray-700 text-gray-300"
        : summary.visitorsGrowth >= 0
          ? "bg-green-100 text-green-600"
          : "bg-red-100 text-red-500"
    }`}
              >
                {summary.lastMonthViews === 0
                  ? "New"
                  : `${summary.visitorsGrowth >= 0 ? "↑" : "↓"} ${Math.abs(summary.visitorsGrowth)}%`}
              </span> */}
            </div>
          </div>

          {/* ⚠️ Optional (keep or remove) */}
          <div className="grid grid-cols-2 gap-4 border-t border-gray-400 pt-4">
            <div>
              <span className="block text-[10px] text-gray-500 font-bold uppercase">
                Last Month
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {summary.lastMonthViews || 0}
              </span>
            </div>

            <div>
              <span className="block text-[10px] text-gray-500 font-bold uppercase">
                Conversion
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {summary.conversionRate || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* --- Card 4: AOV --- */}
        <div className="group relative rounded-3xl bg-[#0F172A] p-6 shadow-xl hover:shadow-emerald-900/20 transition-all overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-colors" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                AOV Metric
              </div>

              <RiArrowUpSLine
                className="text-emerald-400 animate-bounce"
                size={24}
              />
            </div>

            <p className="text-xs font-medium text-slate-400 mb-1">
              Average Order Value
            </p>

            <p className="text-4xl font-black text-white tabular-nums tracking-tighter">
              ${summary.averageOrderValue || 0}
            </p>

            {/* 🔥 Growth */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2
    ${
      summary.lastMonthAOV === "0.00"
        ? "bg-gray-700 text-gray-300"
        : summary.aovGrowth >= 0
          ? "bg-emerald-900 text-emerald-400"
          : "bg-red-900 text-red-400"
    }`}
            >
              {summary.lastMonthAOV === "0.00"
                ? "New"
                : `${summary.aovGrowth >= 0 ? "↑" : "↓"} ${Math.abs(summary.aovGrowth)}%`}
            </span>

            <div className="mt-4 flex items-center gap-2">
              <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-full shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              </div>
            </div>
          </div>
        </div>
        {/* --- Card 5: Inventory (The Status Bar) --- */}
        <div className="md:col-span-3 group rounded-3xl bg-gray-200 p-6 shadow-sm border border-gray-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4 min-w-[200px]">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
              <MdOutlineProductionQuantityLimits size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">
                Inventory
              </p>
              <p className="text-2xl font-black text-gray-900">
                {productCount || 0}{" "}
                <span className="text-sm font-semibold text-gray-500">
                  (products)
                </span>
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-emerald-600">
                Active ({productActiveCount || 0})
              </span>
              <span className="text-gray-500">
                Inactive ({productInActiveCount || 0})
              </span>
            </div>
            <div className="h-3 w-full bg-gray-100 rounded-xl overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg shadow-inner transition-all duration-1000"
                style={{
                  width: `${(productActiveCount / productCount) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* LEFT CARD - TOP PRODUCTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-4">
        {/* --- LEFT: Top Products (Main Card) --- */}
        <div className="xl:col-span-2 group relative overflow-hidden rounded-3xl bg-gray-200 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all">
          {/* Background glow */}
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
            <div className="w-24 h-24 bg-blue-500 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              {/* LEFT: Heading + Badge */}
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Top Selling Products
                </h2>

                <span className="text-[10px] font-bold bg-gray-300 px-3 py-1 rounded-full text-gray-500">
                  This Month
                </span>
              </div>

              {/* RIGHT: View History */}
              <button
                onClick={() => navigate("/top-product-history")}
                className="text-[14px] font-semibold text-blue-600 hover:underline"
              >
                View History →
              </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-400 text-[10px] uppercase tracking-widest">
                  <tr>
                    <th className="text-left pb-3">Product</th>
                    <th className="text-center">Units</th>
                    <th className="text-center">Revenue</th>
                    <th className="text-center">Conv.</th>
                    <th className="text-center">Trend</th>
                  </tr>
                </thead>

                <tbody className="text-gray-700">
                  {topProducts.length > 0 ? (
                    topProducts.map((item, i) => (
                      <tr
                        key={i}
                        className="border-t border-gray-300 hover:bg-gray-100/60 transition"
                      >
                        <td className="py-3 font-semibold">
                          {item.productName || "N/A"}
                        </td>

                        <td className="text-center font-medium">
                          {item.totalUnitsSold || 0}
                        </td>

                        <td className="text-center font-medium">
                          ${item.totalRevenue?.toFixed(2) || 0}
                        </td>

                        <td className="text-center">
                          {item.conversionRate
                            ? `${item.conversionRate}%`
                            : "0%"}
                        </td>

                        <td
                          className={`text-center flex items-center justify-center gap-1 font-semibold ${
                            item.trend >= 0
                              ? "text-emerald-600"
                              : "text-red-500"
                          }`}
                        >
                          {item.trend >= 0 ? (
                            <FaArrowTrendUp />
                          ) : (
                            <FaArrowTrendDown />
                          )}
                          {Math.abs(item.trend)}%
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-6 text-gray-400"
                      >
                        No top products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- RIGHT: Alerts --- */}
        <div className="group relative rounded-3xl bg-gray-200 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-300 hover:shadow-md transition-all flex flex-col">
          {/* Glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-400/10 blur-3xl opacity-20 group-hover:opacity-30 transition" />

          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                Alerts & Issues
              </h2>

              <button
                onClick={() => navigate("/alerts")}
                className="text-[14px] font-semibold text-blue-600 hover:underline"
              >
                View All →
              </button>
            </div>

            {/* Alerts */}
            <div className="space-y-3 flex-1 overflow-auto">
              {visibleAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-2xl border border-gray-300 bg-gray-100 flex items-start gap-3 hover:bg-gray-50 transition`}
                >
                  <div className="w-2 h-2 mt-1 rounded-full bg-current opacity-70"></div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {alert.title}
                    </p>
                    <p className="text-xs text-gray-500 leading-tight">
                      {alert.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainDashboard;
