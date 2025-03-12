import React, { useState, useEffect, useRef } from "react";


const CategorySelector = () => {
  return (
    <main className="flex justify-center bg-gray-100 p-6">
  <div className="w-full max-w-6xl shadow-lg p-6 rounded-md grid grid-cols-1 md:grid-cols-3 gap-6">
    
    {/* LEFT COLUMN */}
    <div className="md:col-span-2 bg-white p-6 border border-gray-300 rounded-2xl">
      
      {/* Title */}
      <div className="bg-white p-4">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          placeholder="Short sleeve t-shirt"
          className="mt-1 block w-full  border border-gray-500 p-2 rounded-xl"
        />
      </div>

      {/* Description */}
      <div className="bg-white p-4 ">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea rows="4" className="mt-1 block w-full  border border-gray-500 p-2 rounded-xl"></textarea>
      </div>

      {/* Media */}
      <div className="bg-white p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Media</label>
        <div className="border border-dashed border-gray-400 p-6 text-center rounded-xl">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Upload new</button>
          <p className="text-gray-500 text-sm mt-2">Accepts images, videos, or 3D models</p>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white p-4 ">
        <label className="block text-sm font-medium text-gray-700">Pricing</label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-sm text-gray-600">Price</label>
            <input type="text" placeholder="$ 0.00" className="w-full border border-gray-500 p-2 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Compare at price</label>
            <input type="text" placeholder="$ 0.00" className="w-full border border-gray-500 p-2 rounded-xl" />
          </div>
        </div>
        <div className="mt-2">
          <input type="checkbox" id="charge-tax" className="mr-2" />
          <label htmlFor="charge-tax" className="text-gray-600">Charge tax on this product</label>
        </div>
      </div>

      {/* Cost & Margin */}
      <div className="bg-white p-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Cost per item</label>
            <input type="text" placeholder="$ 0.00" className="w-full border border-gray-500 p-2 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Profit</label>
            <input type="text" placeholder="$ 0.00" className="w-full border border-gray-500 p-2 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Margin</label>
            <input type="text" placeholder="$ 0.00" className="w-full border border-gray-500 p-2 rounded-xl" />
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
      
      {/* Status */}
      <div className="bg-white p-4 border border-gray-300 rounded-xl">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select className="mt-2 block w-full border border-gray-300 p-2 rounded-xl">
          <option>Active</option>
          <option>Draft</option>
        </select>
      </div>

      {/* Publishing */}
      <div className="bg-white p-4 border border-gray-300 rounded-xl">
        <label className="block text-sm font-medium text-gray-700">Publishing</label>
        <div className="mt-2 space-y-2">
          <div>
            <input type="checkbox" id="online-store" className="mr-2" />
            <label htmlFor="online-store" className="text-gray-600">Online Store</label>
          </div>
        </div>
      </div>

      {/* Product Organization */}
      <div className="bg-white p-4 border border-gray-300 rounded-xl">
        <label className="block text-sm font-medium text-gray-700">Product organization</label>
        <div className="mt-2 space-y-2">
          <input type="text" placeholder="Type" className="w-full border border-gray-300 p-2 rounded-xl" />
          <input type="text" placeholder="Vendor" className="w-full border border-gray-300 p-2 rounded-xl" />
          <input type="text" placeholder="Collections" className="w-full border border-gray-300 p-2 rounded-xl" />
          <input type="text" placeholder="Key Words" className="w-full border border-gray-300 p-2 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
</main>

  );
};

export default CategorySelector;
