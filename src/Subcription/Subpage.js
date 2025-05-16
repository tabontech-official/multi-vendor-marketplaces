import React, { useEffect, useState, useRef } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import { CreateCheckoutUrl } from "../component/Checkout";
import UseFetchUserData from "../component/fetchUser";
import { HiOutlineRefresh } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
const SubscriptionHistory = () => {
  const { userData, loading, error, variantId } = UseFetchUserData();

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

  const fetchSubscriptions = async () => {
    const userId = localStorage.getItem("userid");

    if (!userId) {
      console.error("User ID not found in localStorage.");
      return;
    }

    try {
      const res = await fetch(`https://multi-vendor-marketplace.vercel.app/order/order/${userId}`, {
        method: "GET",
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
      if (!id) {
        console.error("User ID not found in localStorage.");
        return;
      }

      try {
        const response = await fetch(
          `https://multi-vendor-marketplace.vercel.app/product/getProduct/${id}`,
          { method: "GET" }
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
              {/* <div className='bg-blue-100 p-2 mr-3 rounded-lg shadow-md max-sm:mb-2'>
                <span className="font-bold text-green-600">Free Listings: {freeListing}</span>
              </div>
              <div className='bg-blue-100 p-2 rounded-lg shadow-md max-sm:mb-2'>
                <span className="font-bold text-green-600">Paid Listings: {paidListing}</span>
              </div> */}
            </div>
            {/* <div className='flex items-center'>
            <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded flex items-center max-sm:text-xs"
          >
            Buy Credits <FaShoppingBasket className="ml-1" />
          </button>
            </div> */}
          </div>

          <div className="w-full  max-sm:w-auto  max-sm:flex items-center">
            {/* Render loading icon or table based on loading state */}
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
                        Quantity
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
                    {subscriptions.map((subscription, index) =>
                      subscription.lineItems.map((item, itemIndex) => {
                        const address = subscription.customer?.default_address;
                        return (
                          <tr
                            key={`${index}-${itemIndex}`}
                            className={`border-b ${
                              itemIndex % 2 === 0 ? "bg-white" : "bg-gray-100"
                            } w-full`}
                          >
                            <td className="p-3">#{101 + index}</td>
                            <td className="p-3">
                              {formatDate(subscription.createdAt)}
                            </td>
                            <td
                              className="p-3 cursor-pointer hover:underline"
                              onClick={() => {
                                console.log(
                                  "Navigating with order data:",
                                  subscription
                                );
                                navigate(`/order/${item.id}`, {
                                  state: { order: subscription,productName:item.name,sku:item.sku },
                                });
                              }}
                            >
                              {item.name}
                              <br />
                              <span className="text-xs text-gray-500">
                                SKU: {item.sku || "N/A"}
                              </span>
                            </td>
                            <td className="p-3">{item.quantity}</td>
                            <td className="p-3">
                              {address
                                ? `${address.address1}, ${address.city}, ${address.province}`
                                : "N/A"}
                            </td>
                            <td className="p-3">{address?.country || "N/A"}</td>
                            <td className="p-3">
                              $
                              {(parseFloat(item.price) * item.quantity).toFixed(
                                2
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog for buying credits */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <div
            ref={dialogRef}
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg border border-black relative"
          >
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-1">Buy Credits</h2>
            <span className="text-base">${Price}.00/credit</span>

            <div className="flex items-center justify-between mb-4 mt-2">
              <label htmlFor="quantity" className="font-medium">
                Quantity:
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-4 rounded-l transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  -
                </button>
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="border border-gray-300 rounded text-center w-16 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="1"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-4 rounded-r transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-lg font-bold">
                Price:${dynamicPrice}.00
              </span>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded flex justify-center items-center"
            >
              Buy Now <FaShoppingBasket className="ml-2" />
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SubscriptionHistory;
