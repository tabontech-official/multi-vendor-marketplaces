import React, { useEffect, useState } from 'react';
import { FaShoppingBasket } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SubscriptionHistory = () => {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem('email')
    const fetchSubscriptions = async () => {
      try {
        const res = await fetch(`https://medspaa.vercel.app/order/order/${email}`, {
          method: "GET"
        });

        if (res.ok) {
          const json = await res.json();
          setSubscriptions(json.subscriptions); // Store the fetched data
        } else {
          console.error('Failed to fetch subscriptions:', res.status);
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };

    fetchSubscriptions();
  }, []);

  const totalListings = 2
  const activeListings = 3

  return (
    <div className="flex flex-col bg-gray-50 px-3 py-6">
      <div className="flex">
        <div className="pt-4 min-w-full px-3 bg-white shadow-lg rounded-lg">
          <h2 className="text-center text-2xl font-bold mb-8">Subscription History</h2>

          <div className="flex justify-between mb-6">
            <div className="flex flex-col items-center">
              <div className='mb-2 bg-blue-100 p-2 rounded-lg shadow-md'>
                <span className="font-bold text-green-600">Total Listings: {totalListings}</span>
              </div>
              <div className='bg-blue-100 p-2 rounded-lg shadow-md'>
                <span className="font-bold text-green-600">Active Listings: {activeListings}</span>
              </div>
            </div>
            <div className='flex items-center'>
              <Link to={"https://www.medspatrader.com/cart/45664079839485:1"}>
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded flex items-center"
                >
                  Buy Credits
                  <FaShoppingBasket className='ml-1' />
                </button>
              </Link>
            </div>
          </div>

          <div className="w-full max-sm:flex items-center">
            <table className="min-w-full max-sm:flex max-sm:flex-col overflow-auto max-sm:items-center">
              <thead className="bg-gray-200 border-b max-sm:flex max-sm:flex-col min-w-full">
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
              <tbody className='max-sm:flex max-sm:flex-col overflow-auto min-w-full'>
                {subscriptions.map((subscription, index) =>
                  subscription.items.map((item, itemIndex) => (
                    <tr key={`${index}-${itemIndex}`} className={`border-b ${itemIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{itemIndex + 1}</td>
                      <td className="text-sm text-gray-900 font-light px-4 py-2 whitespace-nowrap">{subscription.createdAt}</td>
                      <td className="text-sm text-gray-900 font-light px-4 py-2 whitespace-nowrap">{item.title}</td>
                      <td className="text-sm text-gray-900 font-light px-4 py-2 whitespace-nowrap">${item.price.toFixed(2)}</td>
                      <td className="text-sm text-gray-900 font-light px-4 py-2 whitespace-nowrap">{item.quantity}</td>
                      <td className="text-sm text-gray-900 font-light px-4 py-2 whitespace-nowrap">${subscription.totalAmount.toFixed(2)}</td>
                      <td className="text-sm text-gray-900 font-light px-4 py-2 whitespace-nowrap">{subscription.subscriptionEndDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHistory;
