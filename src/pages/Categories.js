import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiNewspaper,
  HiCube,
  HiOfficeBuilding,
  HiSearch,
  HiBriefcase,
  HiHome,
} from "react-icons/hi";
import { Description, Dialog, DialogTitle } from "@headlessui/react";
import { FaTimes, FaShoppingBasket } from "react-icons/fa";
import { useAuthContext } from "../Hooks/useAuthContext";
import { CreateCheckoutUrl } from "../component/Checkout";
import UseFetchUserData from "../component/fetchUser";

const CategorySelector = () => {
  return (
    <main className="flex justify-center  p-6">
      <div className="w-full max-w-6xl  shadow-lg p-6 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="md:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                placeholder="Short sleeve t-shirt"
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows="4"
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
              ></textarea>
            </div>

            {/* Media */}
            <div className="border border-gray-300 p-4 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media
              </label>
              <div className="border border-dashed border-gray-400 p-6 text-center">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Upload new
                </button>
                <p className="text-gray-500 text-sm mt-2">
                  Accepts images, videos, or 3D models
                </p>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select className="mt-1 block w-full border border-gray-300 p-2 rounded-md">
                <option>Select a category</option>
              </select>
            </div>

            {/* Pricing */}
            <div className="border border-gray-300 p-4 rounded-md">
              <label className="block text-sm font-medium text-gray-700">
                Pricing
              </label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm text-gray-600">Price</label>
                  <input
                    type="text"
                    placeholder="$ 0.00"
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    Compare at price
                  </label>
                  <input
                    type="text"
                    placeholder="$ 0.00"
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>
              </div>
              <div className="mt-2">
                <input type="checkbox" id="charge-tax" className="mr-2" />
                <label htmlFor="charge-tax" className="text-gray-600">
                  Charge tax on this product
                </label>
              </div>
            </div>

            {/* Cost & Margin */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600">
                  Cost per item
                </label>
                <input
                  type="text"
                  placeholder="$ 0.00"
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Profit</label>
                <input
                  type="text"
                  placeholder="$ 0.00"
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Margin</label>
                <input
                  type="text"
                  placeholder="$ 0.00"
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Status */}
            <div className="border border-gray-300 p-4 rounded-md">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select className="mt-2 block w-full border border-gray-300 p-2 rounded-md">
                <option>Active</option>
                <option>Draft</option>
              </select>
            </div>

            {/* Publishing */}
            <div className="border border-gray-300 p-4 rounded-md">
              <label className="block text-sm font-medium text-gray-700">
                Publishing
              </label>
              <div className="mt-2 space-y-2">
                <div>
                  <input type="checkbox" id="online-store" className="mr-2" />
                  <label htmlFor="online-store" className="text-gray-600">
                    Online Store
                  </label>
                </div>
                <div>
                  <input type="checkbox" id="shop" className="mr-2" />
                  <label htmlFor="shop" className="text-gray-600">Shop</label>
                </div>
                <div>
                  <input type="checkbox" id="pos" className="mr-2" />
                  <label htmlFor="pos" className="text-gray-600">
                    Point of Sale
                  </label>
                </div>
              </div>
            </div>

            {/* Markets */}
            <div className="border border-gray-300 p-4 rounded-md">
              <label className="block text-sm font-medium text-gray-700">
                Markets
              </label>
              <p className="text-gray-600 text-sm mt-2">
                International and United States
              </p>
            </div>

            {/* Product Organization */}
            <div className="border border-gray-300 p-4 rounded-md">
              <label className="block text-sm font-medium text-gray-700">
                Product organization
              </label>
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  placeholder="Type"
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Vendor"
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Collections"
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Tags"
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
            </div>

            {/* Theme Template */}
            <div className="border border-gray-300 p-4 rounded-md">
              <label className="block text-sm font-medium text-gray-700">
                Theme template
              </label>
              <input
                type="text"
                placeholder="Default product"
                className="mt-2 block w-full border border-gray-300 p-2 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategorySelector;
