import React, { useCallback, useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";

const MainDashboard = () => {
  const pendingOrdersOptions = {
    chart: { type: "area", toolbar: { show: false } },
    title: { text: "Pending Orders" },

    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
    },
    colors: ["#007bff", "#28a745"],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    yaxis: { min: 0, max: 120 },
    grid: { show: true },
    legend: { show: true, position: "bottom" },
  };

  const pendingOrdersSeries = [
    { name: "Series1", data: [30, 40, 35, 50, 49, 100, 95] },
    { name: "Series2", data: [20, 30, 40, 35, 40, 55, 45] },
  ];

  const ratingOptions = {
    chart: { type: "bar" },
    xaxis: { categories: ["Rating", "Cancellation Rate", "Shipped in 24h"] },
    title: { text: "Your Rating" },
  };
  const ratingSeries = [{ name: "Percentage/Score", data: [5.0, 0, 100] }];

  const salesContributionOptions = {
    title: { text: "Sales Contribution" },

    chart: {
      type: "line",
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#007bff", "#28a745"],
    xaxis: {
      categories: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    },
    yaxis: {
      min: 0,
      max: 70,
    },
    grid: {
      show: true,
    },
  };

  const salesContributionSeries = [
    {
      name: "Product A",
      data: [30, 25, 10, 15, 35, 40, 50, 45, 30, 60, 30, 20, 30, 25],
    },
    {
      name: "Product B",
      data: [25, 30, 20, 30, 40, 35, 45, 50, 40, 30, 50, 45, 35, 30],
    },
  ];

  const productCreationOptions = {
    chart: { type: "bar" },
    xaxis: {
      categories: [
        "Rejected (poor quality)",
        "Rejected (image missing)",
        "Approved",
        "Pending",
      ],
    },
    title: { text: "New Product Creation in Last 14 Days" },
  };
  const productCreationSeries = [{ name: "Count", data: [12, 38, 470, 0] }];

  return (
    <main className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start border-b-2 border-gray-200 pb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
        <div className="bg-gray-200 rounded-xl">
          <Chart
            options={pendingOrdersOptions}
            series={pendingOrdersSeries}
            type="line"
            height={300}
          />
        </div>
        <div className="bg-gray-200 rounded-xl">
          <Chart
            options={ratingOptions}
            series={ratingSeries}
            type="bar"
            height={300}
          />
        </div>
        <div className="bg-gray-200 rounded-xl">
          <Chart
            options={salesContributionOptions}
            series={salesContributionSeries}
            type="line"
            height={300}
          />
        </div>
        <div className="bg-gray-200 rounded-xl">
          <Chart
            options={productCreationOptions}
            series={productCreationSeries}
            type="bar"
            height={300}
          />
        </div>
      </div>
    </main>
  );
};

export default MainDashboard;
