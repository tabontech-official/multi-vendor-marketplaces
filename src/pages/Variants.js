import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiImageOn } from "react-icons/ci";

const Variants = () => {
  const [variantData, setVariantData] = useState(null);
  const [updatedVariant, setUpdatedVariant] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [trackQuantity, setTrackQuantity] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { productId, variantId: initialVariantId } = location.state || {};
  const [variantId, setVariantId] = useState(initialVariantId);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://multi-vendor-marketplace.vercel.app/product/getSingleProductForVariants/${productId}`
        );
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch product data.");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleVariantClick = (id) => {
    setVariantId(id);
  };

  useEffect(() => {
    if (!variantId) return;

    const fetchVariantData = async () => {
      try {
        const response = await axios.get(
          `https://multi-vendor-marketplace.vercel.app/product/getSingleVariant/${productId}/variants/${variantId}`
        );
        setVariantData(response.data);
        setUpdatedVariant(response.data);
      } catch (error) {
        console.error("Error fetching variant data:", error);
      }
    };

    fetchVariantData();
  }, [productId, variantId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedVariant((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const response = await axios.put(
        `https://multi-vendor-marketplace.vercel.app/product/updateVariant/${productId}/${variantId}`,
        {
          variant: updatedVariant,
        }
      );
      toast.success("Variant updated successfully!");
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating variant:", error);
      setIsLoading(false);
    }
  };

  if (!variantData) {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex justify-center bg-gray-100 p-6">
      <ToastContainer />
      <div className="w-1/4 bg-white shadow-md p-4 rounded-md">
        <div className="flex items-center space-x-4 mb-4 border-b-2">
          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mb-4">
            {product?.images?.length ? (
              <img
                src={product.images[0].src}
                alt="Product"
                className="w-10 h-10 object-cover"
              />
            ) : (
              <CiImageOn className="text-gray-400 text-2xl" />
            )}
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold">{product?.title}</h2>
            <span className="text-sm text-gray-500">
              {product?.variants?.length || 0} variants
            </span>
          </div>
          <div className="ml-auto mb-4 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
            Active
          </div>
        </div>
        <ul className="space-y-2">
          {product?.variants?.map((variant) => {
            const matchedImage = product?.variantImages?.find(
              (img) => img.id === variant.image_id
            );

            return (
              <li
                key={variant.id}
                onClick={() => {
                  handleVariantClick(variant.id);
                  navigate(`/product/${productId}/variants/${variant.id}`, {
                    state: { productId, variantId: variant.id },
                  });
                }}
                
                className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                  {matchedImage?.src ? (
                    <img
                      src={matchedImage.src}
                      alt={matchedImage.alt || variant.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <CiImageOn className="text-gray-400 text-2xl" />
                  )}
                </div>
                <button>{variant.title || "Unknown variant"}</button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="w-full max-w-2xl shadow-lg p-3 rounded-md pl-4">
        <div className="flex justify-between">
          <FaArrowLeft
            onClick={() =>
              navigate("/manage-product", {
                state: {
                  isEditing: true,
                },
              })
            }
            className="text-gray-500 hover:text-gray-600 cursor-pointer"
          />
          <button
            onClick={handleSave}
            className={`mt-6 inline-block px-6 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-full hover:opacity-90 transition ${
              isLoading ? "opacity-50 cursor-wait" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner-border animate-spin w-5 h-5 border-t-2 border-b-2 border-white rounded-full"></div>
            ) : (
              "Update"
            )}
          </button>
        </div>
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
                  name={`option${index + 1}`}
                  value={updatedVariant[`option${index + 1}`] || ""}
                  onChange={handleInputChange}
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
                  name="price"
                  value={updatedVariant.price || ""}
                  onChange={handleInputChange}
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
                  name="compare_at_price"
                  value={updatedVariant.compare_at_price || ""}
                  onChange={handleInputChange}
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
                name="sku"
                value={updatedVariant.sku || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Barcode
              </label>
              <input
                type="text"
                className="w-full pl-4 pr-3 py-2 rounded-2xl border border-gray-500 no-spinner"
                name="barcode"
                value={updatedVariant.barcode || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className=" items-center mt-3">
            <input
              type="checkbox"
              id="trackQuantity"
              checked={trackQuantity}
              onChange={() => setTrackQuantity(!trackQuantity)}
              className="h-4 w-4 text-blue-500"
            />
            <label
              htmlFor="trackQuantity"
              className="ml-2 text-sm text-gray-700"
            >
              Track quantity
            </label>
          </div>

          {trackQuantity && (
            <div className="mt-4 border-b border-gray-300">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 block font-semibold mb-2">
                  Quantity
                </label>
              </div>

              <div className="flex justify-between border-t border-gray-300 p-2">
                <h1 className="text-sm font-semibold text-gray-700">
                  Unavailable
                </h1>
                <h1 className="text-sm font-semibold text-gray-700">
                  Committed
                </h1>
                <h1 className="text-sm font-semibold text-gray-700">
                  Available
                </h1>
                <h1 className="text-sm font-semibold text-gray-700">On hand</h1>
              </div>

              <div className="flex justify-between border-t border-gray-300 p-2 gap-3">
                <div className="flex flex-col items-center w-1/4">
                  <input
                    type="text"
                    className="border border-gray-400 w-full p-1 rounded-md text-sm"
                    placeholder="0"
                    pattern="\d*"
                    inputMode="numeric"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                  />
                </div>

                <div className="flex flex-col items-center w-1/4">
                  <input
                    type="text"
                    className="border border-gray-400 w-full p-1 rounded-md text-sm"
                    placeholder="0"
                    pattern="\d*"
                    inputMode="numeric"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                  />
                </div>

                <div className="flex flex-col items-center w-1/4">
                  <input
                    type="text"
                    className="border border-gray-400 w-full p-1 rounded-md text-sm"
                    value={variantData.inventory_quantity}
                    placeholder="0"
                    pattern="\d*"
                    inputMode="numeric"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                  />
                </div>

                <div className="flex flex-col items-center w-1/4">
                  <input
                    type="text"
                    className="border border-gray-400 w-full p-1 rounded-md text-sm"
                    placeholder="0"
                    value={variantData.inventory_quantity}
                    pattern="\d*"
                    inputMode="numeric"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                  />
                </div>
              </div>
            </div>
          )}
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
                name="weight"
                value={updatedVariant.weight || ""}
                onChange={handleInputChange}
              />
              <select
                className="border px-2 py-1 rounded-md"
                name="weight_unit"
                value={updatedVariant.weight_unit}
                onChange={handleInputChange}
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
