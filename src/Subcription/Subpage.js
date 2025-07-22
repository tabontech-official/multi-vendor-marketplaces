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

const SubscriptionHistory = () => {
  const { userData, loading, error, variantId } = UseFetchUserData();
  const { addNotification } = useNotification();
const [exportStatus, setExportStatus] = useState(""); // '' means no filter (all)

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
  const [exportAs, setExportAs] = useState("csv"); // not used yet but can be extended
  const [exportOption, setExportOption] = useState("all"); // default to 'all'

  const togglePopup = () => setIsexportOpen(!isOpen);

  // const fetchSubscriptions = async () => {
  //   const userId = localStorage.getItem("userid");

  //   if (!userId) {
  //     console.error("User ID not found in localStorage.");
  //     return;
  //   }

  //   try {
  //     const res = await fetch(
  //       `https://multi-vendor-marketplace.vercel.app/order/order/${userId}`,
  //       {
  //         method: "GET",
  //       }
  //     );

  //     if (res.ok) {
  //       const json = await res.json();
  //       const sortedSubscriptions = json.data.sort(
  //         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //       );
  //       setSubscriptions(sortedSubscriptions);
  //     } else {
  //       console.error("Failed to fetch subscriptions:", res.status);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching subscriptions:", error);
  //   }
  // };

  const fetchSubscriptions = async () => {
    const userId = localStorage.getItem("userid");
    const token = localStorage.getItem("usertoken");
     const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    setIsLoading(true); // start loader

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
        ? `https://multi-vendor-marketplace.vercel.app/order/getAllOrder`
        : `https://multi-vendor-marketplace.vercel.app/order/order/${userId}`;

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
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setSubscriptions(sortedSubscriptions);
        setFilteredSubscriptions(sortedSubscriptions);
      } else {
        console.error("Failed to fetch subscriptions:", res.status);
      }
    } catch (error) {
      console.error("Error decoding token or fetching subscriptions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleBuyNow = () => {
    const buyCreditUrl = CreateCheckoutUrl(
      userData,
      quantity,
      loading,
      error,
      variantId
    );
    console.log(buyCreditUrl);
    window.open(buyCreditUrl, "_blank");
  };


  // const handleExport = async () => {
  //   try {
  //     setIsExporting(true);

  //     const userId = localStorage.getItem("userid");
  //     const token = localStorage.getItem("usertoken");

  //     if (!userId || !token) {
  //       alert("User ID or token not found in localStorage");
  //       return;
  //     }

  //     const decoded = jwtDecode(token);
  //     const role = decoded?.payLoad?.role;
  //     const isTokenValid = decoded?.exp * 1000 > Date.now();

  //     const isAdmin =
  //       isTokenValid && (role === "Master Admin" || role === "Dev Admin");

  //     let exportUrl;

  //     if (isAdmin) {
  //       const queryParams = new URLSearchParams({
  //         type: exportOption,
  //         ...(exportOption === "current" && { limit: 10 }),
  //       });
  //       exportUrl = `https://multi-vendor-marketplace.vercel.app/order/exportAllOrder?${queryParams.toString()}`;
  //     } else {
  //       const queryParams = new URLSearchParams({
  //         userId,
  //         type: exportOption,
  //         ...(exportOption === "current" && { limit: 10 }),
  //       });
  //       exportUrl = `https://multi-vendor-marketplace.vercel.app/order/exportOrderByUserId?${queryParams.toString()}`;
  //     }

  //     const response = await fetch(exportUrl);
  //     if (!response.ok) {
  //       const error = await response.json();
  //       throw new Error(error.message || "Export failed");
  //     }

  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", `orders-${exportOption}-${Date.now()}.csv`);
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     window.URL.revokeObjectURL(url);

  //     addNotification("Orders exported successfully", "Orders");
  //     setIsexportOpen(false);
  //   } catch (error) {
  //     alert("Export failed: " + error.message);
  //     console.error("Export error:", error);
  //   } finally {
  //     setIsExporting(false);
  //   }
  // };

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
    const isAdmin =
      isTokenValid && (role === "Master Admin" || role === "Dev Admin");

    const queryParams = new URLSearchParams({
      type: exportOption,
      ...(exportOption === "current" && { limit: 10 }),
      ...(exportStatus && { status: exportStatus }),
      ...(isAdmin ? {} : { userId }),
    });

    const exportUrl = isAdmin
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
      const error = await response.json();
      throw new Error(error.message || "Export failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders-${exportOption}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    addNotification("Orders exported successfully", "Orders");
    setIsexportOpen(false);
  } catch (error) {
    alert("Export failed: " + error.message);
    console.error("Export error:", error);
  } finally {
    setIsExporting(false);
  }
};



  useEffect(() => {
    const fetchProductData = async () => {
      const id = localStorage.getItem("userid");
       const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
      if (!id) {
        console.error("User ID not found in localStorage.");
        return;
      }

      try {
        const response = await fetch(
          `https://multi-vendor-marketplace.vercel.app/product/getProduct/${id}`,
          { method: "GET" ,
             headers: {
          "x-api-key": apiKey,
          "x-api-secret": apiSecretKey,
          "Content-Type": "application/json",
        },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          if (Array.isArray(data.products)) {
            setTotalListings(data.products.length);
            const activeCount = data.products.filter(
              (product) => product.status === "active"
            ).length;
            setActiveListings(activeCount);
            const freeCount = data.products.filter(
              (product) =>
                product.product_type === "Used Equipment" &&
                product.status === "active"
            ).length;
            setFreeListing(freeCount);
            const paidCount = data.products.filter(
              (product) =>
                product.product_type !== "Used Equipment" &&
                product.status === "active"
            ).length;
            setPaidListing(paidCount);
          } else {
            console.error("Expected products array, but got:", data.products);
          }
        } else {
          console.error(
            "Failed to fetch product data. Status:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
    fetchSubscriptions();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleClickOutside = (event) => {
    if (dialogRef.current && !dialogRef.current.contains(event.target)) {
      setIsDialogOpen(false); // Close the dialog
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
        isTokenValid && (role === "Master Admin" || role === "Dev Admin")
      );
    }
  }, []);
  
  const [searchVal, setSearchVal] = useState("");
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);

  const handleSearch = () => {
    const value = searchVal.trim();
    if (!value) {
      setFilteredSubscriptions(subscriptions);
      return;
    }

    let regexSafe;
    try {
      regexSafe = new RegExp(value);
    } catch (e) {
      console.error("Invalid regex input:", e);
      return;
    }

    const filtered = subscriptions.filter((subscription) => {
      const orderMatch =
        regexSafe.test(subscription.shopifyOrderNo?.toString()) ||
        regexSafe.test(subscription.serialNo?.toString());

      const merchantMatch = subscription.merchants?.some((merchant) =>
        regexSafe.test(merchant.info?.name || "")
      );

      const merchantEmailMatch = subscription.merchants?.some((merchant) =>
        regexSafe.test(merchant.info?.email || "")
      );

      const statusMatch = Object.values(
        subscription.lineItemsByMerchant || {}
      ).some((items) =>
        items.some((item) => {
          const status = item.fulfillment_status;

          if (value === "unfulfilled") return status === null;
          if (value === "fulfilled") return status === "fulfilled";
          if (value === "cancelled") return status === "cancelled";

          return regexSafe.test(status || "unfulfilled");
        })
      );

      const dateMatchFromLineItems = Object.values(
        subscription.lineItemsByMerchant || {}
      ).some((items) =>
        items.some((item) => {
          const date = item?.customer?.[0]?.created_at;
          const formattedDate =
            date &&
            new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
          return (
            formattedDate &&
            formattedDate.toLowerCase().includes(value.toLowerCase())
          );
        })
      );

      const dateMatchUserSide = (() => {
        if (!subscription.createdAt) return false;
        const formattedDate = new Date(
          subscription.createdAt
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return formattedDate.toLowerCase().includes(value.toLowerCase());
      })();
      return (
        orderMatch ||
        merchantMatch ||
        merchantEmailMatch ||
        statusMatch ||
        dateMatchFromLineItems ||
        dateMatchUserSide
      );
    });

    setFilteredSubscriptions(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchVal]);

  return (
    <div
      className={`flex flex-col bg-gray-50 px-3 py-6 ${
        isDialogOpen ? "blur-background" : ""
      }`}
    >
      <div className="flex">
        <div className="pt-4 min-w-full px-3 bg-white  rounded-lg">
           <div className="flex flex-col md:flex-row md:justify-between items-start border-b-2 border-gray-200 pb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-semibold mb-1">Manage orders</h1>
                    <p className="text-gray-600">Here you can manage orders.</p>
                    <div className="w-2/4 max-sm:w-full mt-2">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        className="md:w-2/4 p-2 max-sm:w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
                    <div className="flex flex-col gap-4 items-center w-full justify-end">
                      <div className="flex gap-4 items-center justify-end w-full">
                       
          
                        <button  onClick={togglePopup}
                          className="bg-blue-500 hover:bg-blue-400 text-white gap-2 py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
                        >
                          <FaFileImport className="w-5 h-5" />
                          Export
                        </button>
                      </div>
          
                     
                    </div>
                  </div>
          
                 
                </div>

          {/* <div className="flex justify-between items-center flex-wrap mb-6">
            <div className="w-full md:w-auto mt-2 max-sm:w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full md:w-96 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-2">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                onClick={togglePopup}
              >
                Export
              </button>
            </div>
          </div> */}

          <div className="w-full  max-sm:w-auto  max-sm:flex items-center mt-2">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <HiOutlineRefresh className="animate-spin text-xl text-gray-500" />
                loading...
              </div>
            ) : (
              <div className="max-sm:overflow-auto border rounded-lg">
                <table className="w-full border-collapse bg-white">
                  <thead className="bg-gray-100 text-left text-gray-600 text-xs">
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
                      {/* <th scope="col" className="p-3">
                        Address
                      </th>
                      <th scope="col" className="p-3">
                        Country
                      </th> */}
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
                              const fulfillment_status =
                                merchantItems[0]?.fulfillment_status;
                              const totalQuantity = merchantItems.reduce(
                                (sum, item) => sum + (item.quantity || 0),
                                0
                              );

                              const totalPrice = merchantItems.reduce(
                                (sum, item) => {
                                  const price = parseFloat(item.price || 0);
                                  const qty = parseInt(item.quantity || 0);
                                  return sum + price * qty;
                                },
                                0
                              );

                              return (
                                <tr
                                  key={`${orderId}-${merchantId}`}
                                  className={`border-b ${
                                    (index + mIndex) % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-100"
                                  } w-full`}
                                >
                                  <td
                                    className="p-3 cursor-pointer text-blue-600 hover:underline"
                                    onClick={() => {
                                      if (shopifyOrderId) {
                                        navigate(`/order/${shopifyOrderId}`, {
                                          state: {
                                            merchantId,
                                            shopifyOrderId,
                                            serialNo: orderId,
                                            order: subscription,
                                          },
                                        });
                                      } else {
                                      }
                                    }}
                                  >
                                    #{orderId}
                                  </td>

                                  <td className="p-3">
                                    {orderDate ? formatDate(orderDate) : "N/A"}
                                  </td>
                                  <td className="p-3 text-sm">
                                    {merchant.info?.name || "N/A"}
                                  </td>
                                  <td className="p-3">{totalQuantity} items</td>
                                  {/* <td className="p-3">
                                    {merchant.info?.dispatchAddress || "N/A"}
                                  </td>
                                  <td className="p-3">
                                    {merchant.info?.dispatchCountry || "N/A"}
                                  </td> */}
                                  <td className="p-3">
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
                                  </td>

                                  <td className="p-3">
                                    ${totalPrice.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            }
                          );
                        })
                      : filteredSubscriptions.map((subscription, index) => {
                          const address =
                            subscription.customer?.default_address;
                          const firstItem = subscription.lineItems?.[0];
                          if (!firstItem) return null;

                          return (
                            <tr
                              key={subscription.orderId}
                              className={`border-b ${
                                index % 2 === 0 ? "bg-white" : "bg-gray-100"
                              } w-full`}
                            >
                              <td
                                className="p-3 text-blue-600 hover:underline cursor-pointer"
                                onClick={() => {
                                  console.log("Navigating with data:", {
                                    order: subscription,
                                    productName: firstItem.name,
                                    sku: firstItem.sku,
                                    index: 101 + index,
                                    serialNumber: subscription.orderId,
                                  });

                                  navigate(`/order/${subscription.orderId}`, {
                                    state: {
                                      order: subscription,
                                      productName: firstItem.name,
                                      sku: firstItem.sku,
                                      index: 101 + index,
                                      serialNumber: subscription.orderId,
                                    },
                                  });
                                }}
                              >
                                #{subscription.shopifyOrderNo}
                              </td>
                              <td className="p-3">
                                {formatDate(subscription.createdAt)}
                              </td>
                              {/* <td
                                className="p-3"
                                // onClick={() => {
                                //   console.log("Navigating with data:", {
                                //     order: subscription,
                                //     productName: firstItem.name,
                                //     sku: firstItem.sku,
                                //     index: 101 + index,
                                //     serialNumber: subscription.orderId,
                                //   });

                                //   navigate(`/order/${subscription.orderId}`, {
                                //     state: {
                                //       order: subscription,
                                //       productName: firstItem.name,
                                //       sku: firstItem.sku,
                                //       index: 101 + index,
                                //       serialNumber: subscription.orderId,
                                //     },
                                //   });
                                // }}
                              >
                                {firstItem.name}
                                <br />
                                <span className="text-xs text-gray-500">
                                  SKU: {firstItem.sku || "N/A"}
                                </span>
                              </td> */}
                              <td className="p-3">
                                <div className="text-xs text-blue-500 mt-1">
                                  {subscription.lineItems.length}{" "}
                                  {subscription.lineItems.length === 1
                                    ? "item"
                                    : "items"}
                                </div>
                              </td>
                              {/* <td className="p-3">
                                {address
                                  ? `${address.address1}, ${address.city}, ${address.province}`
                                  : "N/A"}
                              </td>
                              <td className="p-3">
                                {address?.country || "N/A"}
                              </td> */}
                              <td className="p-3">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    subscription?.lineItems[0]
                                      ?.fulfillment_status === "fulfilled"
                                      ? "bg-green-200 text-green-800"
                                      : subscription?.lineItems[0]
                                          ?.fulfillment_status === "cancelled"
                                      ? "bg-red-200 text-red-800"
                                      : "bg-yellow-200 text-yellow-800"
                                  }`}
                                >
                                  {subscription?.lineItems[0]
                                    ?.fulfillment_status === "fulfilled"
                                    ? "Fulfilled"
                                    : subscription?.lineItems[0]
                                        ?.fulfillment_status === "cancelled"
                                    ? "Cancelled"
                                    : "Unfulfilled"}
                                </span>
                              </td>
                              <td className="p-3">
                                $
                                {(
                                  parseFloat(firstItem.price || 0) *
                                  (firstItem.quantity || 1)
                                ).toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
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
                    Export products
                  </h2>
                  <RxCross1
                    onClick={() => setIsexportOpen(false)}
                    className="hover:text-red-500 cursor-pointer"
                  />
                </div>

                <p className="text-sm mb-3 mt-3">
                  This CSV file can export all order information.
                  <a href="#" className="text-blue-600 underline">
                    CSV file for orders
                  </a>
                  .
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
                    className={`px-4 py-2 rounded mt-2 flex items-center gap-2 ${
                      isExporting ? "bg-gray-500" : "bg-gray-800"
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
