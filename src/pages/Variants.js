import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Variants = () => {
  const [variantData, setVariantData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { productId, variantId, isEditing } = location.state || {};

  useEffect(() => {
    const fetchVariantData = async () => {
      try {
        const response = await axios.get(
          `https://multi-vendor-marketplace.vercel.app/product/getSingleVariant/${productId}/variants/${variantId}`
        );
        setVariantData(response.data);
      } catch (error) {
        console.error("Error fetching variant data:", error);
      }
    };

    fetchVariantData();
  }, [productId, variantId]);

  if (!variantData) {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl shadow-lg p-3 rounded-md">
        <FaArrowLeft
          onClick={() =>
            navigate("/add-product", {
              state: {
                isEditing: true,
              },
            })
          }
          className="text-gray-500 hover:text-gray-600 cursor-pointer"
        />

        {/* Option box */}
        <div className="mt-4 bg-white p-3 border border-gray-300 rounded-2xl">
          <h3 className="font-semibold text-md">Options</h3>
          {variantData.options.map((option, index) => (
            <div className="p-1" key={index}>
              <label className="block text-sm font-medium text-gray-700 p-1">
                {option}
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-2 pr-3 py-2 rounded-2xl border border-gray-500 no-spinner"
                  value={variantData[`option${index + 1}`] || ""}
                  readOnly
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pricing box */}
        <div className="mt-4 bg-white p-3 border border-gray-300 rounded-2xl">
          <label className="block text-sm font-medium text-gray-700">
            Pricing
          </label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">
                  $
                </span>
                <input
                  type="number"
                  className="w-full pl-7 pr-3 py-2 rounded-2xl border border-gray-500 no-spinner"
                  value={variantData.price || ""}
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Compare at Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">
                  $
                </span>
                <input
                  type="number"
                  className="w-full pl-7 pr-3 py-2 rounded-2xl border border-gray-500 no-spinner"
                  value={variantData.compare_at_price || ""}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Inventory box */}
        <div className="mt-4 bg-white p-3 border border-gray-300 rounded-2xl">
          <label className="block text-sm font-medium text-gray-700">
            Inventory
          </label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SKU (Stock Keeping Unit)
              </label>
              <input
                type="text"
                className="w-full pl-4 pr-3 py-2 rounded-2xl border border-gray-500 no-spinner"
                value={variantData.sku || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Barcode
              </label>
              <input
                type="text"
                className="w-full pl-4 pr-3 py-2 rounded-2xl border border-gray-500 no-spinner"
                value={variantData.barcode || ""}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Shipping box */}
        <div className="mt-4 bg-white p-3 border border-gray-300 rounded-2xl">
          <label className="text-sm font-medium text-gray-700">Shipping</label>
          <div className="mt-4">
            <label className="text-sm text-gray-700 border-b border-gray-300 pb-2 block">
              Weight
            </label>
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                className="w-20 text-center py-1 border-0 focus:ring-0"
                value={variantData.weight || ""}
                readOnly
              />
              <select
                className="border px-2 py-1 rounded-md"
                value={variantData.weight_unit}
                readOnly
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
                <option value="oz">oz</option>
                <option value="g">g</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Variants;
