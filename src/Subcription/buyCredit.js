import React, { useState } from 'react';
import { Dialog } from '@headlessui/react'; // You can use any dialog component or create a custom one
import { FaShoppingBasket } from 'react-icons/fa';

const BuyCreditDialog = ({ isOpen, closeModal }) => {
  const [quantity, setQuantity] = useState(1);
  const pricePerCredit = 10; // Example price per credit
  const dynamicPrice = quantity * pricePerCredit;

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value)); // Ensure quantity is at least 1
    setQuantity(value);
  };

  const handleBuyNow = () => {
    // The original buy credit functionality
    window.open(`https://www.medspatrader.com/cart/45681550131453:${quantity}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Buy Credit</h2>
          
          <div className="flex items-center justify-between mb-4">
            <label htmlFor="quantity" className="font-medium">Quantity:</label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="border px-2 py-1 w-20 text-center"
              min="1"
            />
          </div>
          
          <div className="mb-6">
            <span className="text-lg font-bold">Price: {dynamicPrice} $/credit</span>
          </div>

          <button
            onClick={handleBuyNow}
            className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded flex justify-center items-center"
          >
            Buy Now <FaShoppingBasket className="ml-2" />
          </button>

          <button
            onClick={closeModal}
            className="mt-4 text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default BuyCreditDialog;
