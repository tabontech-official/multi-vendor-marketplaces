import React, { useEffect, useState, useRef } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import { CreateCheckoutUrl } from "../component/Checkout";
import UseFetchUserData from "../component/fetchUser";
import { HiOutlineRefresh } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const MerchantSubPage = () => {
  const { userData, loading, error, variantId } = UseFetchUserData();
  const location = useLocation(); 

  const { order, productName, sku, index, merchantId } =
    location.state || {};
  const [subscriptions, setSubscriptions] = useState([]);
  const [totalListings, setTotalListings] = useState(0);
  const [activeListings, setActiveListings] = useState(0);
  const [paidListing, setPaidListing] = useState(0);
  const [freeListing, setFreeListing] = useState(0);
  const [Price, setPrice] = useState(10);
  const [quantity, setQuantity] = useState(1);
  const pricePerCredit = 10;
  const dynamicPrice = quantity * Price;
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef(null);
  const [selectedMerchants, setSelectedMerchants] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

const fetchSubscriptions = async () => {
   const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
  try {
    const res = await fetch(`https://multi-vendor-marketplace.vercel.app/order/order/${merchantId}`, {
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
    } else {
      console.error("Failed to fetch subscriptions:", res.status);
    }
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
  }
};


useEffect(() => {
  if (merchantId) {
    fetchSubscriptions();
  }
}, [merchantId]);

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
          { method: "GET",
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

  return (
    <div
      className={`flex flex-col bg-gray-50 px-3 py-6 ${
        isDialogOpen ? "blur-background" : ""
      }`}
    >
      <div className="flex">
        <div className="pt-4 min-w-full px-3 bg-white shadow-lg rounded-lg">
          <h2 className="text-center text-2xl font-bold mb-8">Order History</h2>

          <div className="flex justify-between mb-6">
            <div className="flex flex-row flex-wrap items-center">
              <div className="bg-blue-100 p-2 mr-3 rounded-lg shadow-md max-sm:mb-2">
                <span className="font-bold text-green-600">
                  Total Orders: {totalListings}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full  max-sm:w-auto  max-sm:flex items-center">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <HiOutlineRefresh className="animate-spin text-xl text-gray-500" />
                loading...
              </div>
            ) : (
              <div className="max-sm:overflow-auto border rounded-lg">
                <table className="w-full border-collapse bg-white">
                  <thead className="bg-gray-100 text-left text-gray-600 text-sm">
                    <tr>
                      <th scope="col" className="p-3">
                        #
                      </th>
                      <th scope="col" className="p-3">
                        Date Purchased
                      </th>

                      <th scope="col" className="p-3">
                        Product Name
                      </th>
                      <th scope="col" className="p-3">
                        Item
                      </th>
                      <th scope="col" className="p-3">
                        Address
                      </th>
                      <th scope="col" className="p-3">
                        Country
                      </th>
                      <th scope="col" className="p-3">
                        Total Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((subscription, index) => {
                      const address = subscription.customer?.default_address;
                      const firstItem = subscription.lineItems?.[0];
                      if (!firstItem) return null;

                      return (
                        <tr
                          key={subscription.orderId}
                          className={`border-b ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                          } w-full`}
                        >
                          <td className="p-3">#{subscription.serialNumber}</td>
                          <td className="p-3">
                            {formatDate(subscription.createdAt)}
                          </td>
                          <td
                            className="p-3 cursor-pointer hover:underline"
                            onClick={() =>
                              navigate(`/order/${subscription.orderId}`, {
                                state: {
                                  order: subscription,
                                  productName: firstItem.name,
                                  sku: firstItem.sku,
                                  index: 101 + index,
                                  serialNumber: subscription.orderId,
                                  merchantId,
                                },
                              })
                            }
                          >
                            {firstItem.name}
                            <br />
                            <span className="text-xs text-gray-500">
                              SKU: {firstItem.sku || "N/A"}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="text-xs text-blue-500 mt-1">
                              {subscription.lineItems.length}{" "}
                              {subscription.lineItems.length === 1
                                ? "item"
                                : "items"}
                            </div>
                          </td>
                          <td className="p-3">
                            {address
                              ? `${address.address1}, ${address.city}, ${address.province}`
                              : "N/A"}
                          </td>
                          <td className="p-3">{address?.country || "N/A"}</td>
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
        </div>
      </div>

    
    </div>
  );
};

export default MerchantSubPage;
