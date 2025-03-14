import React, { useState, useEffect } from "react";

const CategorySelector = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [productType, setProductType] = useState("");
  const [vendor, setVendor] = useState("");
  const [keyWord, setkeyWord] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [trackQuantity, setTrackQuantity] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [continueSelling, setContinueSelling] = useState(false);
  const [hasSKU, setHasSKU] = useState(false);
  const [sku, setSKU] = useState("");
  const [barcode, setBarcode] = useState("");
  const [trackShipping, setTrackShipping] = useState(false);
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg");
  const [status, setStatus] = useState("publish"); // Default to "draft"
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userid");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setMessage({ type: "error", text: "User ID not found. Please log in." });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setMessage({
        type: "error",
        text: "User ID is missing. Cannot submit form.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    const productData = {
      keyWord,
      title,
      description,
      productType,
      price: parseFloat(price),
      compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : null,
      track_quantity: trackQuantity,
      quantity: trackQuantity ? parseInt(quantity) : 0,
      continue_selling: continueSelling,
      has_sku: hasSKU,
      sku: hasSKU ? sku : null,
      barcode: hasSKU ? barcode : null,
      track_shipping: trackShipping,
      weight: trackShipping ? parseFloat(weight) : null,
      weight_unit: trackShipping ? unit : null,
      status,
      userId,
      vendor,
    };

    try {
      const response = await fetch(
        "https://multi-vendor-marketplace.vercel.app/product/addEquipment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Product added successfully!" });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Something went wrong!",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to connect to server." });
    }

    setLoading(false);
  };
  return (
    <main className="flex justify-center bg-gray-100 p-6">
      <div className="w-full max-w-6xl shadow-lg p-6 rounded-md grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 border border-gray-300 rounded-2xl">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter product title"
              className="mt-1 block w-full border border-gray-500 p-2 rounded-xl"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-500 p-2 rounded-xl"
            ></textarea>
          </div>

          {/* Media Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media
            </label>
            <div className="border border-dashed border-gray-400 p-6 text-center rounded-xl">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Upload new
              </button>
              <p className="text-gray-500 text-sm mt-2">
                Accepts images, videos, or 3D models
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700  ">
              Pricing
            </label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <input
                type="text"
                placeholder="$ 0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border p-2 rounded-2xl  border-gray-500"
              />
              <input
                type="text"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="$ 0.00"
                className="w-full border p-2 rounded-2xl  border-gray-500"
              />
            </div>
            <div className="mt-2">
              <input type="checkbox" id="charge-tax" className="mr-2" />
              <label htmlFor="charge-tax" className="text-gray-600">
                Charge tax on this product
              </label>
            </div>
          </div>
          {/* cost per item */}

          {/* <div className="bg-white p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600">
                  Cost per item
                </label>
                <input
                  type="text"
                  placeholder="$ 0.00"
                  value={costPerItem}
                  onChange={(e)=>setCostPerItem(e.target.value)}
                  className="w-full border border-gray-500 p-2 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Profit</label>
                <input
                  type="text"
                  value={profit}
                  onChange={(e)=>setProfit(e.target.value)}
                  placeholder="$ 0.00"
                  className="w-full border border-gray-500 p-2 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Margin</label>
                <input
                  type="text"
                  value={margin}
                  onChange={(e)=>setMargin(e.target.value)}
                  placeholder="$ 0.00"
                  className="w-full border border-gray-500 p-2 rounded-xl"
                />
              </div>
            </div>
          </div> */}

          {/* Inventory Section */}
          <div className="border rounded-2xl p-4 bg-white mb-4 border-gray-500">
            <h2 className="font-semibold text-gray-700">Inventory</h2>
            <div className="flex items-center mt-3">
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

            {/* Quantity Input */}
            {trackQuantity && (
              <div className="mt-4">
                <label className="text-sm text-gray-700 border-b border-gray-300 pb-2 block">
                  Quantity
                </label>
                <div className="flex items-center justify-between mt-2">
                  <label className="text-sm text-gray-700">Shop location</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-16 border px-3 py-1 rounded-md text-right"
                  />
                </div>
              </div>
            )}

            {/* Continue Selling Checkbox */}
            <div className="flex items-start mt-3">
              <input
                type="checkbox"
                id="continueSelling"
                checked={continueSelling}
                onChange={() => setContinueSelling(!continueSelling)}
                className="h-4 w-4 text-blue-500"
              />
              <div className="ml-2">
                <label
                  htmlFor="continueSelling"
                  className="text-sm text-gray-700"
                >
                  Continue selling when out of stock
                </label>
                <p className="text-xs text-gray-500">
                  This won’t affect{" "}
                  <a href="#" className="text-blue-500">
                    Shopify POS
                  </a>
                  . Staff can still complete sales.
                </p>
              </div>
            </div>

            {/* SKU & Barcode Section */}
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="hasSKU"
                checked={hasSKU}
                onChange={() => setHasSKU(!hasSKU)}
                className="h-4 w-4 text-blue-500"
              />
              <label htmlFor="hasSKU" className="ml-2 text-sm text-gray-700">
                This product has a SKU or barcode
              </label>
            </div>

            {/* SKU & Barcode Inputs */}
            {hasSKU && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="SKU"
                  value={sku}
                  onChange={(e) => setSKU(e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Barcode"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
              </div>
            )}
          </div>

          {/* Weight Section */}
          <div className="border rounded-2xl p-4 bg-white border-gray-500">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="trackShipping"
                checked={trackShipping}
                onChange={() => setTrackShipping(!trackShipping)}
                className="h-4 w-4 text-blue-500 "
              />
              <label
                htmlFor="trackShipping"
                className="ml-2 text-sm text-gray-700"
              >
                This is a physical product
              </label>
            </div>
            {trackShipping && (
              <div className="mt-4">
                <label className="text-sm text-gray-700 border-b border-gray-300 pb-2 block">
                  Weight
                </label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-20 border px-3 py-1 rounded-md text-right"
                    placeholder="0.00"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="border px-2 py-1 rounded-md"
                  >
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                    <option value="oz">oz</option>
                    <option value="g">g</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleSubmit}
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          {/* Status Message */}
          {message && (
            <p
              className={`mt-2 text-${
                message.type === "error" ? "red" : "green"
              }-500`}
            >
              {message.text}
            </p>
          )}
        </div>
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white p-4 border border-gray-300 rounded-xl">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              className="mt-2 block w-full border border-gray-300 p-2 rounded-xl"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="publish">publish</option>
              <option>Draft</option>
            </select>
          </div>

          {/* Publishing */}
          <div className="bg-white p-4 border border-gray-300 rounded-xl">
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
            </div>
          </div>

          {/* Product Organization */}
          <div className="bg-white p-4 border border-gray-300 rounded-xl">
            <label className="block text-sm font-medium text-gray-700">
              Product organization
            </label>
            <div className="mt-2 space-y-2">
              <input
                type="text"
                placeholder="Type"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-xl"
              />
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="Vendor"
                className="w-full border border-gray-300 p-2 rounded-xl"
              />
              {/* <input
                type="text"
                placeholder="Collections"
                className="w-full border border-gray-300 p-2 rounded-xl"
              /> */}
              <input
                type="text"
                placeholder="Key Words"
                value={keyWord}
                onChange={(e) => setkeyWord(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategorySelector;
