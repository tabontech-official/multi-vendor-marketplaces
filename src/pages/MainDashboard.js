import React, { useState, useEffect } from "react";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import {
  RiArrowUpSLine,
  RiInboxLine,
  RiLoader4Line,
  RiShieldFlashLine,
  RiStore3Line,
} from "react-icons/ri";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { MdPreview } from "react-icons/md";
import { motion } from "framer-motion";
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
import { useNavigate, useOutletContext } from "react-router-dom";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MainDashboard = () => {
  const navigate = useNavigate();
  const [topProducts, setTopProducts] = useState([]);
  const { setDashboardLoading } = useOutletContext();
  const hasLoadedBefore = localStorage.getItem("dashboardLoaded");
  const [loading, setLoading] = useState(!hasLoadedBefore);
  const [alerts, setAlerts] = useState([]);
  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("usertoken");
      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");

      let decodedRole = null;

      if (token) {
        const decoded = jwtDecode(token);
        decodedRole = decoded.payLoad.role;
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
        // ✅ unique + latest logic
        const uniqueMap = new Map();

        (data.data || []).forEach((item) => {
          const key = `${item.productId}-${item.type}`;

          if (
            !uniqueMap.has(key) ||
            new Date(item.createdAt) > new Date(uniqueMap.get(key).createdAt)
          ) {
            uniqueMap.set(key, item);
          }
        });

        const finalAlerts = Array.from(uniqueMap.values())
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3); // 🔥 only top 3

        setAlerts(finalAlerts);
      }
    } catch (error) {
      console.error("Dashboard Alerts Error:", error);
    }
  };
  // useEffect(() => {
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

  //   fetchTopProducts();
  // }, []);

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
  // useEffect(() => {
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
        apiUrl =
          "https://multi-vendor-marketplace.vercel.app/order/monthlyRevenue";
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

  //   fetchMonthlyRevenue();
  // }, []);

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

  // useEffect(() => {
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
        apiUrl =
          "https://multi-vendor-marketplace.vercel.app/product/getProductCount";
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

  //   getProductCount();
  // }, []);

  // useEffect(() => {
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
        apiUrl =
          "https://multi-vendor-marketplace.vercel.app/order/recurringFinance";
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

  //   fetchSummary();
  // }, []);

  const [viewCount, setViewCount] = useState(0);
  const [perDayCount, setPerDayCount] = useState(0);
  const [perHourCount, setHourCount] = useState(0);

  const userId = localStorage.getItem("userid");

  // useEffect(() => {
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

  //   fetchUserViewCount();
  // }, [userId]);

  useEffect(() => {
    const loadAllData = async () => {
      const hasLoadedBefore = localStorage.getItem("dashboardLoaded");

      try {
        console.log("START LOADING");

        // 🔥 Sirf pehli dafa full loader
        if (!hasLoadedBefore) {
          setLoading(true);
          setDashboardLoading(true);
        }

        await Promise.all([
          fetchTopProducts(),
          fetchMonthlyRevenue(),
          getProductCount(),
          fetchSummary(),
          fetchUserViewCount(),
          fetchAlerts(),
        ]);

        // 🔥 Mark as loaded
        localStorage.setItem("dashboardLoaded", "true");
      } catch (error) {
        console.error(error);
      } finally {
        console.log("STOP LOADING");

        // 🔥 Sirf pehli dafa loader band karo
        if (!hasLoadedBefore) {
          setLoading(false);
          setDashboardLoading(false);
          localStorage.removeItem("initialLoad");
        }
      }
    };

    loadAllData();
  }, []);
  if (loading) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-[#050505] overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Brand Icon with Pulse Effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
            <div className="relative bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-2xl">
              <RiShieldFlashLine className="text-4xl text-blue-500" />
            </div>
          </motion.div>

          {/* Animated Loading Spinner */}
          <div className="flex flex-col items-center gap-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <RiLoader4Line className="text-3xl text-gray-400" />
            </motion.div>

            <div className="text-center">
              {/* Animated Text */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-lg font-semibold tracking-wide"
              >
                Aydi <span className="text-blue-500">Active</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-gray-500 text-xs mt-2 uppercase tracking-[0.2em]"
              >
                Initializing Marketplace...
              </motion.p>
            </div>
          </div>
        </div>

        {/* Subtle Bottom Progress Bar (Optional) */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "30%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"
        />
      </div>
    );
  }
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

          <div className="relative z-10 flex flex-col h-full font-sans">
            {/* --- Header Section --- */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Top Selling Products
                </h2>
                <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md border border-gray-200">
                  This Month
                </span>
              </div>

              <button
                onClick={() => navigate("/top-product-history")}
                className="text-[14px] font-semibold text-blue-600 hover:underline"
              >
                View History →
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-[11px] uppercase font-semibold border-b border-gray-100">
                    <th className="pb-3 pr-2">Product</th>
                    <th className="text-center pb-3 px-2">Units</th>
                    <th className="text-center pb-3 px-2">Revenue</th>
                    <th className="text-center pb-3 px-2">Conv.</th>
                    <th className="text-right pb-3 pl-2">Trend</th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {topProducts.length > 0 ? (
                    topProducts.map((item, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 pr-2">
                          <span className="font-medium text-gray-800 line-clamp-1">
                            {item.productName || "N/A"}
                          </span>
                        </td>

                        <td className="text-center py-4 px-2 text-gray-600">
                          {item.totalUnitsSold?.toLocaleString() || 0}
                        </td>

                        <td className="text-center py-4 px-2 font-medium text-gray-900">
                          $
                          {item.totalRevenue?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          }) || "0.00"}
                        </td>

                        <td className="text-center py-4 px-2 text-gray-500">
                          {item.conversionRate
                            ? `${item.conversionRate}%`
                            : "0%"}
                        </td>

                        <td className="text-right py-4 pl-2">
                          <div
                            className={`inline-flex items-center gap-1 font-medium ${
                              item.trend >= 0
                                ? "text-emerald-600"
                                : "text-red-500"
                            }`}
                          >
                            {item.trend >= 0 ? (
                              <FaArrowTrendUp size={12} />
                            ) : (
                              <FaArrowTrendDown size={12} />
                            )}
                            <span>{Math.abs(item.trend)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-10 text-gray-400 text-xs italic"
                      >
                        No top products found for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="group relative rounded-3xl bg-gray-200 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-300 hover:shadow-md transition-all flex flex-col">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-400/10 blur-3xl opacity-20 group-hover:opacity-30 transition" />

          <div className="relative z-10 flex flex-col h-full">
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

            <div className="space-y-3 flex-1 overflow-auto">
              {alerts.length > 0 ? (
                alerts.map((alert, index) => {
                  const isOutOfStock = alert.type === "out_of_stock";
                  const isLowStock = alert.type === "low_stock";

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl border transition-all flex items-start gap-3 hover:shadow-sm ${
                        isOutOfStock
                          ? "border-red-200 bg-red-50/30 hover:bg-red-50/50"
                          : isLowStock
                            ? "border-amber-200 bg-amber-50/30 hover:bg-amber-50/50"
                            : "border-gray-200 bg-gray-50 hover:bg-white"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                          isOutOfStock
                            ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                            : isLowStock
                              ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                              : "bg-emerald-500"
                        }`}
                      />

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p
                            className={`text-[11px] font-bold uppercase tracking-wider ${
                              isOutOfStock
                                ? "text-red-600"
                                : isLowStock
                                  ? "text-amber-600"
                                  : "text-emerald-600"
                            }`}
                          >
                            {alert.type?.replace("_", " ") || "Alert"}
                          </p>

                          {alert.createdAt && (
                            <span className="text-[10px] text-gray-400 font-medium">
                              {new Date(alert.createdAt).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-semibold text-gray-800 leading-snug">
                          {alert.message}
                        </p>

                        {alert.productId && (
                          <p className="text-[10px] mt-1 font-mono text-gray-400">
                            ID: {alert.productId}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-60">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <RiInboxLine className="text-gray-400" size={24} />
                  </div>
                  <p className="text-xs font-medium text-gray-400 text-center">
                    No system alerts found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainDashboard;
