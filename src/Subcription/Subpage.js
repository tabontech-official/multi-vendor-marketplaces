import React, { useEffect, useState, useRef } from 'react';
import { FaShoppingBasket } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';

const SubscriptionHistory = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [totalListings, setTotalListings] = useState(0);
  const [activeListings, setActiveListings] = useState(0);
  const [paidListing, setPaidListing] = useState(0);
  const [freeListing, setFreeListing] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const pricePerCredit = 10; // Example price per credit
  const dynamicPrice = quantity * pricePerCredit;

  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility
  const dialogRef = useRef(null); // Reference to the dialog

  const handleBuyNow = () => {
    // The original buy credit functionality
    window.open(`https://www.medspatrader.com/cart/45681550131453:${quantity}`, "_blank");
  };


  useEffect(() => {
    const fetchProductData = async () => {
      const id = localStorage.getItem('userid');
      if (!id) {
        console.error('User ID not found in localStorage.');
        return;
      }

      try {
        const response = await fetch(`https://medspaa.vercel.app/product/getProduct/${id}`, { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.products)) {
            setTotalListings(data.products.length);
            const activeCount = data.products.filter(product => product.status === "active").length; 
            setActiveListings(activeCount);
            const freeCount = data.products.filter(product => product.product_type === "Used Equipment").length;
            setFreeListing(freeCount);
            const paidCount = data.products.filter(product => product.product_type !== "Used Equipment").length;
            setPaidListing(paidCount);
          } else {
            console.error('Expected products array, but got:', data.products);
          }
        } else {
          console.error('Failed to fetch product data. Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    const fetchSubscriptions = async () => {
      const email = localStorage.getItem('email');
      if (!email) {
        console.error('Email not found in localStorage.');
        return;
      }

      try {
        const res = await fetch(`https://medspaa.vercel.app/order/order/${email}`, { method: "GET" });
        if (res.ok) {
          const json = await res.json();
          setSubscriptions(json.data);
        } else {
          console.error('Failed to fetch subscriptions:', res.status);
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };

    fetchProductData();
    fetchSubscriptions();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleClickOutside = (event) => {
    if (dialogRef.current && !dialogRef.current.contains(event.target)) {
      setIsDialogOpen(false); // Close the dialog
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`flex flex-col bg-gray-50 px-3 py-6 ${isDialogOpen ? 'blur-background' : ''}`}>
      <div className="flex">
        <div className="pt-4 min-w-full px-3 bg-white shadow-lg rounded-lg">
          <h2 className="text-center text-2xl font-bold mb-8">Subscription History</h2>

          <div className="flex justify-between mb-6">
            <div className="flex flex-row flex-wrap items-center">
              <div className='bg-blue-100 p-2 mr-3 rounded-lg shadow-md max-sm:mb-2'>
                <span className="font-bold text-green-600">Total Listings: {totalListings}</span>
              </div>
              <div className='bg-blue-100 p-2 mr-3 rounded-lg shadow-md max-sm:mb-2'>
                <span className="font-bold text-green-600">Free Listings: {freeListing}</span>
              </div>
              <div className='bg-blue-100 p-2 rounded-lg shadow-md max-sm:mb-2'>
                <span className="font-bold text-green-600">Paid Listings: {paidListing}</span>
              </div>
            </div>
            <div className='flex items-center'>
              <button
                onClick={() => setIsDialogOpen(true)}
                type="button"
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded flex items-center"
              >
                Buy Credits
                <FaShoppingBasket className='ml-1' />
              </button>
            </div>
          </div>

          <div className="w-full max-sm:flex items-center">
            <table className="max-sm:flex max-sm:flex-col overflow-auto max-sm:items-center w-full max-sm:w-auto">
              <thead className="bg-gray-200 border-b max-sm:flex max-sm:flex-col w-full">
                <tr>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-2 text-left">#</th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-2 text-left">Date Purchased</th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-2 text-left">Product Name</th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-2 text-left">Per Credit Price</th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-2 text-left">Total Credit</th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-2 text-left">Total Price</th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-2 text-left">Expiry date</th>
                </tr>
              </thead>
              <tbody className='max-sm:flex max-sm:flex-col w-full'>
                {subscriptions.map((subscription, index) =>
                  subscription.lineItems.map((item, itemIndex) => (
                    <tr key={`${index}-${itemIndex}`} className={`border-b ${itemIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'} w-full`}>
                      <td scope="col" className="px-4 py-2 text-sm font-medium text-gray-900">{index + 1}</td>
                      <td scope="col" className="text-sm text-gray-900 font-light px-4 py-2">{formatDate(subscription.createdAt)}</td>
                      <td scope="col" className="text-sm text-gray-900 font-light px-4 py-2">{item.name}</td>
                      <td scope="col" className="text-sm text-gray-900 font-light px-4 py-2">${item.price}</td>
                      <td scope="col" className="text-sm text-gray-900 font-light px-4 py-2">{item.quantity}</td>
                      <td scope="col" className="text-sm text-gray-900 font-light px-4 py-2 ">${(item.quantity * item.price).toFixed(2)}</td>
                      <td scope="col" className="text-sm text-gray-900 font-light px-4 py-2">{formatDate(subscription.expiresAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dialog for buying credits */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div ref={dialogRef} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg border border-black relative">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-1">Buy Credits</h2>
            <span className="text-base">10$/credit</span>

            <div className="flex items-center justify-between mb-4 mt-2">
              <label htmlFor="quantity" className="font-medium">Quantity:</label>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-4 rounded-l transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  -
                </button>
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="border border-gray-300 rounded text-center w-16 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-4 rounded-r transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-lg font-bold">Price: {dynamicPrice}$</span>
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
