import React, { useState, useEffect } from "react";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { RiStore3Line } from "react-icons/ri";
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
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MainDashboard = () => {
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
      } else if (decodedRole === "Merchant" || decodedRole === "Merchant Staff") {
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

    fetchSummary();
  }, []);

  const [viewCount, setViewCount] = useState(0);
  const [perDayCount, setPerDayCount] = useState(0);
  const [perHourCount, setHourCount] = useState(0);

  const userId = localStorage.getItem("userid");

  // useEffect(() => {
  //   const fetchUserViewCount = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://multi-vendor-marketplace.vercel.app/product/trackingViews/${userId}`
  //       );
  //       if (response.ok) {
  //         const data = await response.json();
  //         setViewCount(data.totalViews);
  //         setPerDayCount(data.weeklyViews);
  //         setHourCount(data.monthlyViews);
  //       } else {
  //         console.error("Failed to fetch user view count");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user view count:", error);
  //     }
  //   };

  //   if (userId) {
  //     fetchUserViewCount();
  //   }
  // }, [userId]);
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
    <main className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start border-b-2 border-gray-200 pb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
          <div className="w-2/4 max-sm:w-full mt-2"></div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        
        <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-300">
              <RiStore3Line className="text-black text-lg" />
            </div>
            <p className="text-sm text-gray-700 font-medium">Orders</p>
          </div>

          <div className="flex justify-between text-xs text-gray-700 font-medium text-center mb-1">
            <div className="w-1/3">Orders</div>
            <div className="w-[1px] bg-gray-300 mx-1" />
            <div className="w-1/3">Fulfilled</div>
            <div className="w-[1px] bg-gray-300 mx-1" /> 
            <div className="w-1/3">Unfulfilled</div>
          </div>

          <div className="flex justify-between text-center text-base font-semibold">
            <div className="w-1/3">{summary.totalOrdersInDb || 0}</div>
            <div className="w-[1px] bg-gray-200 mx-1" />
            <div className="w-1/3 text-green-600">
              {summary.fulfilledOrders || 0}
            </div>
            <div className="w-[1px] bg-gray-200 mx-1" />
            <div className="w-1/3 text-red-500">
              {summary.unfulfilledOrders || 0}
            </div>
          </div>
          {/* <div className="border-t border-gray-300 pt-2 mt-3">
            <p className="text-xs text-green-500 flex items-center gap-1">
              <FaArrowTrendDown className="text-sm" />
              29% vs $303.3K last year
            </p>
          </div> */}
        </div>

        <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gray-300 text-black px-3 py-3 rounded-full">
              <MdOutlineProductionQuantityLimits />
            </div>
            <p className="text-sm text-gray-600 font-medium">Product</p>
          </div>

          <div className="flex justify-between text-xs text-gray-700 font-medium text-center mb-1">
            <div className="w-1/3">Total</div>
            <div className="w-[1px] bg-gray-300 mx-1" />
            <div className="w-1/3">Active</div>
            <div className="w-[1px] bg-gray-300 mx-1" />
            <div className="w-1/3">Inactive</div>
          </div>

          <div className="flex justify-between text-center text-base font-semibold">
            <div className="w-1/3">{productCount || 0}</div>
            <div className="w-[1px] bg-gray-200 mx-1" />
            <div className="w-1/3 text-green-600">
              {productActiveCount || 0}
            </div>
            <div className="w-[1px] bg-gray-200 mx-1" />
            <div className="w-1/3 text-red-500">
              {productInActiveCount || 0}
            </div>
          </div>
          {/* <div className="border-t border-gray-300 pt-2 mt-2">
            <p className="text-xs text-green-500 flex items-center gap-1">
              <FaArrowTrendUp />
              41% vs 320,583 last year
            </p>
          </div> */}
        </div>

        <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gray-300 text-black px-3 py-3 rounded-full">
              <MdPreview />
            </div>
            <p className="text-sm text-gray-600 font-medium">Visitor</p>
          </div>

          <div className="flex justify-between text-xs text-gray-700 font-medium text-center mb-1">
            <div className="w-1/3">Total</div>
            <div className="w-[1px] bg-gray-300 mx-1" />
            <div className="w-1/3">Weekly</div>
            <div className="w-[1px] bg-gray-300 mx-1" />
            <div className="w-1/3">Monthly</div>
          </div>

          <div className="flex justify-between text-center text-base font-semibold">
            <div className="w-1/3">{viewCount || 0}</div>
            <div className="w-[1px] bg-gray-200 mx-1" />
            <div className="w-1/3 text-green-600">{perHourCount || 0}</div>
            <div className="w-[1px] bg-gray-200 mx-1" />
            <div className="w-1/3 text-blue-600">{perDayCount || 0}</div>
          </div>
          {/* <div className="border-t-2 border-gray-300 pt-2 mt-3">
            <p className="text-xs text-red-500 flex items-center gap-1">
              <FaArrowTrendDown className="text-sm" />▼ 17% vs 3.3M last year
            </p>
          </div> */}
        </div>

        <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              $
            </div>
            <p className="text-sm text-gray-600 font-medium">Net Profit</p>
          </div>

          <div className="flex justify-between text-xs text-gray-700 font-medium text-center mb-1">
            <div className="w-1/3">Total</div>
            <div className="w-[1px] bg-gray-300 mx-1" />
            <div className="w-1/3">Paid</div>
            <div className="w-[1px] bg-gray-300 mx-1" />
            <div className="w-1/3">Unpaid</div>
          </div>

          <div className="flex justify-between text-center text-base font-semibold">
            <div className="w-1/3 text-gray-800">${summary.netProfit || 0}</div>
            <div className="w-[1px] bg-gray-200 mx-1" />
            <div className="w-1/3 text-green-600">
              ${summary.paidIncome || 0}
            </div>
            <div className="w-[1px] bg-gray-200 mx-1" />
            <div className="w-1/3 text-red-500">
              ${summary.unpaidIncome || 0}
            </div>
          </div>
          
        </div>

      

     
      </div>

      <div className="flex gap-6 mt-6">
        <div className="bg-gray-100 p-6 rounded-xl shadow-sm w-[65%]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Monthly Recurring Revenue
            </h2>
            <span className="text-gray-400">•••</span>
          </div>

          <div className="flex mb-6">
            <div className="w-1/2 pr-4  border-gray-300">
              <p className="text-sm text-gray-500">Income</p>
              <h3 className="text-2xl font-semibold text-cyan-600">
                ${summary.totalIncome}
              </h3>
             
            </div>

          
          </div>

          <Bar data={chartData} options={options} />
        </div>

      <div className="bg-gray-100 border border-slate-200 p-6 rounded-2xl shadow-sm w-[35%] min-w-[320px] font-sans text-slate-800">
  
  {/* Header */}
  <div className="flex justify-between items-center mb-8">
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">Product Analytics</h2>
      <p className="text-xs text-gray-700">Real-time performance</p>
    </div>
    <span className="bg-white border border-slate-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm">
      This Month
    </span>
  </div>

  {/* Main Metric Section */}
  <div className="flex items-center gap-6 mb-8">
    <div className="relative flex items-center justify-center">
      {/* Decorative Ring */}
      <div className="w-24 h-24 rounded-full border-4 border-slate-100 flex items-center justify-center bg-white shadow-inner">
        <span className="text-3xl font-black text-cyan-600">
          {productCount}
        </span>
      </div>
      {/* Small accent glow */}
      <div className="absolute -z-10 w-24 h-24 bg-cyan-400/20 blur-xl rounded-full"></div>
    </div>

    <div>
      <p className="text-sm text-gray-700 font-medium">Total Inventory</p>
      <p className="text-xs text-emerald-500 font-semibold">+12% from last month</p>
    </div>
  </div>

  {/* Stats Breakdown */}
  <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-100">
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-700font-medium">Active Status</span>
        <span className="text-gray-700 font-bold">{productActiveCount} <span className="text-gray-700 font-normal">/ {productCount}</span></span>
      </div>
      
      {/* Modern Segmented Progress Bar */}
      <div className="flex w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-cyan-500 transition-all duration-500"
          style={{ width: `${productCount ? (productActiveCount / productCount) * 100 : 0}%` }}
        />
        <div
            className="h-full bg-slate-300 transition-all duration-500"
            style={{ width: `${productCount ? (productInActiveCount / productCount) * 100 : 0}%` }}
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 pt-2">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase text-gray-700 font-bold">Inactive</span>
        <span className="text-sm font-semibold text-slate-700">{productInActiveCount}</span>
      </div>
      <div className="flex flex-col border-l pl-4 border-slate-100">
        <span className="text-[10px] uppercase text-gray-700 font-bold">Conversion</span>
        <span className="text-sm font-semibold text-slate-700">84%</span>
      </div>
    </div>
  </div>

  {/* Footer Card */}
  <div className="mt-6 flex items-center justify-between px-2">
    <div>
        <p className="text-xs text-gray-700 font-medium">Total Engagement</p>
        <p className="text-2xl font-bold text-slate-800 tracking-tight">{viewCount.toLocaleString()}</p>
    </div>
    <div className="h-10 w-10 bg-cyan-50 rounded-lg flex items-center justify-center">
        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    </div>
  </div>
</div>

      </div>
    </main>
  );
};

export default MainDashboard;
