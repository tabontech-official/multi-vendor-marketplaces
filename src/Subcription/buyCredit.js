import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FaShoppingBasket, FaTimes } from 'react-icons/fa';

const BuyCreditDialog = ({ isOpen, closeModal }) => {
  const [quantity, setQuantity] = useState(1);
  const pricePerCredit = 10; // Example price per credit
  const dynamicPrice = quantity * pricePerCredit;

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value)); // Ensure quantity is at least 1
    setQuantity(value);
  };

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1)); // Ensure quantity is at least 1
  };

  const handleBuyNow = () => {
    // The original buy credit functionality
    window.open(`https://www.medspatrader.com/cart/45681550131453:${quantity}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg border border-black relative">
          <button
            onClick={closeModal}
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
                onClick={decreaseQuantity}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-4 rounded-l transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                -
              </button>
              <input
                id="quantity"
                type="text"
                value={quantity}
                onChange={handleQuantityChange}
                className="border border-gray-300 rounded text-center w-16 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                min="1"
                style={{ MozAppearance: "textfield" }} // For Firefox
              />
              <button
                onClick={increaseQuantity}
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
  );
};

export default BuyCreditDialog;
