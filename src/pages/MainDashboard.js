import React, { useCallback, useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import CredentialCheckModal from "../component/credentialModal";
import axios from "axios";

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

 const [salesContributionSeries, setSalesContributionSeries] = useState([]);
  const [salesContributionCategories, setSalesContributionCategories] = useState([]);

  useEffect(() => {
    // Fetch sales contribution data from the backend API
    axios
      .get("https://multi-vendor-marketplace.vercel.app/order/getSalesContribution") // Assuming this API is already created
      .then((response) => {
        const data = response.data;

        // Dynamically create the categories (product names)
        const categories = data.map((item) => item.productName);

        // Get only the first 2 products
        const firstTwoProducts = [...new Set(categories)].slice(0, 2); // Take first two unique products

        // Dynamically create the series data for each product
        const seriesData = [];
        
        firstTwoProducts.forEach((productName) => {
          const productData = data.filter((item) => item.productName === productName);
          const salesData = productData.map((item) => item.totalSales);
          
          seriesData.push({
            name: productName,
            data: salesData,
          });
        });

        // Update state with the first two products' categories and series data
        setSalesContributionCategories(firstTwoProducts);
        setSalesContributionSeries(seriesData);
      })
      .catch((error) => {
        console.error("Error fetching sales data: ", error);
      });
  }, []);

  const salesContributionOptions = {
    title: { text: "Sales Contribution" },

    chart: {
      type: "bar", // Bar chart
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#007bff", "#28a745"], // Customize colors for the products
    xaxis: {
      categories: salesContributionCategories, // Categories (product names)
    },
    yaxis: {
      min: 0,
      max: Math.max(...salesContributionSeries.flatMap((series) => series.data)) + 10, // Set max dynamically
    },
    grid: {
      show: true,
    },
  };

  // const salesContributionSeries = [
  //   {
  //     name: "Product A",
  //     data: [30, 25, 10, 15, 35, 40, 50, 45, 30, 60, 30, 20, 30, 25],
  //   },
  //   {
  //     name: "Product B",
  //     data: [25, 30, 20, 30, 40, 35, 45, 50, 40, 30, 50, 45, 35, 30],
  //   },
  // ];

  const [productCreationSeries, setProductCreationSeries] = useState([
    { name: "Count", data: [] },
  ]);
  const [categories, setCategories] = useState([
    "Active", "Inactive", "Missing Images",
  ]);

  useEffect(() => {
    const userId = localStorage.getItem("userid"); 

    if (!userId) {
      console.error("User ID not found in localStorage.");
      return;
    }

    axios
      .get(`https://multi-vendor-marketplace.vercel.app/product/getProductForCharts/${userId}`) 
      .then((response) => {
        const data = response.data;

        const counts = data.map((item) => item.count);

        setProductCreationSeries([
          { name: "Count", data: counts },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching product data: ", error);
      });
  }, []); 

  const productCreationOptions = {
    chart: { type: "bar" },
    xaxis: {
      categories: categories, 
    },
    title: { text: "New Product Creation in Last 14 Days" },
    grid: { show: true },
    legend: { show: true, position: "bottom" },
    colors: ["#007bff"], // Color for the bars
  };


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


    const [announcementsData, setAnnouncementsData] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userid");  // Get userId from localStorage

    if (!userId) {
      console.error("User ID not found in localStorage.");
      return;
    }

    // Fetch announcement data for the user
    axios
      .get(`https://multi-vendor-marketplace.vercel.app/promo/getAnnouncementsForUser/${userId}`)
      .then((response) => {
        const data = response.data;
        setAnnouncementsData(data); // Set the data for chart
      })
      .catch((error) => {
        console.error("Error fetching announcements data:", error);
      });
  }, []);

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
      data: announcementsData.length ? announcementsData : new Array(12).fill(0), // Fill with 0 if no data
    },
  ];

  return (
    <main className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start border-b-2 border-gray-200 pb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
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
