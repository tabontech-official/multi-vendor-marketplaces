import React, { useCallback, useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import CredentialCheckModal from "../component/credentialModal";

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



    const options = {
      chart: {
        type: "line",
        height: 350
      },
      stroke: {
        width: [3, 0], // Line for profit, Column for revenue
        curve: "smooth"
      },
      plotOptions: {
        bar: {
          columnWidth: "50%"
        }
      },
      markers: {
        size: 5, // Line markers for profit
        colors: ["#00e396"]
      },
      colors: ["#00e396", "#008ffb"], // Profit (green) & Revenue (blue)
      dataLabels: {
        enabled: false
      },
      labels: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      xaxis: {
        type: "category"
      },
      yaxis: [
        {
          title: {
            text: "Revenue (in $)"
          }
        },
        {
          opposite: true,
          title: {
            text: "Profit (in $)"
          }
        }
      ]
    };
  
    const series = [
      {
        name: "Profit",
        type: "line",
        data: [15, 20, 10, 30, 25, 35, 15, 25, 10, 20, 5, 10] // Monthly profit
      },
      {
        name: "Revenue",
        type: "column",
        data: [100, 120, 90, 150, 130, 180, 100, 140, 90, 130, 110, 80] // Monthly revenue
      }
    ];


    const announcementsOption = {
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true, // Horizontal bars for better readability
          columnWidth: "60%"
        }
      },
      colors: ["#ff9800"], // Orange color for announcements
      dataLabels: {
        enabled: true
      },
      xaxis: {
        categories: [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ],
        title: {
          text: "Number of Announcements"
        }
      },
      yaxis: {
        title: {
          text: "Months"
        }
      }
    };
  
    const annoucementSeries = [
      {
        name: "Announcements",
        data: [5, 8, 4, 10, 6, 12, 8, 5, 9, 6, 7, 4] 
      }
    ];
    const userId = localStorage.getItem("userid");

  return (
    <main className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start border-b-2 border-gray-200 pb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
          <CredentialCheckModal userId={userId} />
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
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
        <div className="bg-gray-200 rounded-xl">
          <Chart
            options={options}
            series={series}
            type="line"
            height={300}
          />
        </div>
        <div className="bg-gray-200 rounded-xl">
          <Chart
            options={announcementsOption}
            series={annoucementSeries}
            type="bar"
            height={300}
          />
        </div>
      </div>
    </main>
  );
};

export default MainDashboard;
