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
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CatalogPerformance = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    incomeGrowth: 0,
    lastYearIncome: 0,
    spend: 0,
    spendGrowth: 0,
    lastYearSpend: 0,
  });
  const [productCount, setProductCount] = useState(0);

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
        const response = await fetch(
          " http://localhost:5000/product/getProductCount"
        ); // replace with your actual API URL
        const data = await response.json();
        if (response.ok) {
          setProductCount(data.count);
        } else {
          console.error("Failed to fetch count:", data.message);
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
        const response = await fetch(
          " http://localhost:5000/order/recurringFinance"
        );
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch finance summary:", error);
      }
    };

    fetchSummary();
  }, []);

  return (
    <main className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start border-b-2 border-gray-200 pb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">Catalog Reports</h1>
          <div className="w-2/4 max-sm:w-full mt-2"></div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500 text-white px-4 py-2 rounded-full">
              $
            </div>
            <p className="text-sm text-gray-600">Net Profit</p>
          </div>
          <h2 className="text-2xl font-semibold mt-2">${summary.netProfit}</h2>
          <div className="border-t-2 border-gray-300 pt-2 mt-2">
            <p className="text-xs text-red-500 flex items-center gap-1">
              <FaArrowTrendDown className="text-sm" />
              29% vs $303.3K last year
            </p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-gray-300 text-white px-3 py-3 rounded-full">
              <RiStore3Line className="text-black" />
            </div>
            <p className="text-sm text-gray-600">Orders</p>
          </div>
          <h2 className="text-2xl font-semibold mt-2">{summary.totalOrdersInDb}</h2>
          <div className="border-t-2 border-gray-300 pt-2 mt-2">
            <p className="text-xs text-green-500 flex items-center gap-1">
              <FaArrowTrendDown className="text-sm" />
              29% vs $303.3K last year
            </p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-gray-300 text-black px-3 py-3 rounded-full">
              <MdOutlineProductionQuantityLimits />
            </div>
            <p className="text-sm text-gray-600">Product</p>
          </div>
          <h2 className="text-2xl font-semibold mt-2">{productCount}</h2>
          <div className="border-t-2 border-gray-300 pt-2 mt-2">
            <p className="text-xs text-green-500 flex items-center gap-1">
              <FaArrowTrendUp />
              41% vs 320,583 last year
            </p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-gray-300 text-black px-3 py-3 rounded-full">
              <MdPreview />
            </div>
            <p className="text-sm text-gray-600">Visitor</p>
          </div>
          <h2 className="text-2xl font-semibold mt-2">3.1M</h2>
          <div className="border-t-2 border-gray-300 pt-2 mt-2">
            <p className="text-xs text-red-500 flex items-center gap-1">
              <FaArrowTrendDown className="text-sm" />▼ 17% vs 3.3M last year
            </p>
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
            <div className="w-1/2 pr-4 border-r border-gray-300">
              <p className="text-sm text-gray-500">Income</p>
              <h3 className="text-2xl font-semibold text-cyan-600">
                ${summary.totalIncome}
              </h3>
              <p className="text-xs text-green-500">
                ▲ {summary.incomeGrowth}% vs ${summary.lastYearIncome} last year
              </p>
            </div>

            <div className="w-1/2 pl-4">
              <p className="text-sm text-gray-500">Spend</p>
              <h3 className="text-2xl font-semibold text-gray-700">
                ${summary.spend || "80,112.02"}
              </h3>
              <p className="text-xs text-green-500">
                ▲ {summary.spendGrowth || "2"}% vs $
                {summary.lastYearSpend || "77,000.02"} last year
              </p>
            </div>
          </div>

          <Bar data={data} options={options} />
        </div>

        <div className="bg-cyan-600 text-white p-6 rounded-xl shadow-sm w-[35%]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Selling Product</h2>
            <button className="bg-cyan-700 text-sm px-3 py-1 rounded">
              This Month
            </button>
          </div>

          {/* Circular gauge placeholder */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-32 h-32 rounded-full border-[10px] border-white border-t-cyan-400 flex items-center justify-center text-2xl font-bold">
            {productCount}
            </div>
            <p className="text-sm mt-1">Product</p>
            <p className="text-xs text-red-300 mt-1">▼ 7% vs 3,000 Expected</p>
          </div>

          {/* Visitor Growth */}
          <div className="mt-2 text-sm">
            <p className="mb-2">
              Visitor Growth <span className="text-red-300">▼ -12%</span>
            </p>
            <h4 className="text-xl font-semibold">24.9K</h4>
            <p className="text-xs">Compare to 27K last month</p>
          </div>

          {/* Class A Progress */}
          <div className="mt-4">
            <p className="text-sm">Class A</p>
            <p className="text-xs">13,028 / 15,000 user</p>
            <div className="w-full h-2 bg-white bg-opacity-30 mt-1 rounded">
              <div className="h-2 bg-white w-[87%] rounded"></div>
            </div>
          </div>

          {/* Class B Progress */}
          <div className="mt-3">
            <p className="text-sm">Class B</p>
            <p className="text-xs">11,912 / 15,000 user</p>
            <div className="w-full h-2 bg-white bg-opacity-30 mt-1 rounded">
              <div className="h-2 bg-white w-[79%] rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CatalogPerformance;
