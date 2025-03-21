import React, { useState, useEffect } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FcAddImage } from "react-icons/fc";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CategorySelector = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [productType, setProductType] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [keyWord, setKeyWord] = useState([]);
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
  const [status, setStatus] = useState("publish");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [userId, setUserId] = useState("");
  const [options, setOptions] = useState([]);
  const [variants, setVariants] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [newOption, setNewOption] = useState({ name: "", values: [""] });
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [checkedImages, setCheckedImages] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const locationData = useLocation();
const navigate=useNavigate()
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const handleKeyDown = (e, setState, stateValues) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      setState([...stateValues, e.target.value.trim()]);
      e.target.value = ""; // Clear input after adding tag
      e.preventDefault();
    }
  };
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prevImages) => [...prevImages, ...imagePreviews]);

    setImages(files);
  };

  const toggleImageSelection = (index) => {
    setCheckedImages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleRemoveSelected = () => {
    setSelectedImages(
      selectedImages.filter((_, index) => !checkedImages[index])
    );
    setCheckedImages({});
  };

  const generateVariantCombinations = (options, existingVariants = []) => {
    if (options.length === 0) return [];

    let variants = options[0].values.map((value) => ({
      [options[0].name]: value,
    }));

    for (let i = 1; i < options.length; i++) {
      let currentOption = options[i];
      let newVariants = [];

      variants.forEach((variant) => {
        currentOption.values.forEach((value) => {
          const newVariant = { ...variant, [currentOption.name]: value };
          const variantName = Object.values(newVariant).join(" / ");

          if (!existingVariants.some((v) => v.name === variantName)) {
            newVariants.push(newVariant);
          }
        });
      });

      variants = newVariants;
    }

    return variants;
  };

  const updateVariants = (updatedOptions) => {
    setVariants((prevVariants) => {
      let existingVariants = prevVariants.flatMap((variant) =>
        variant.subVariants ? variant.subVariants : [variant]
      );

      const newVariants = generateVariantCombinations(
        updatedOptions,
        existingVariants
      ).map((variant, index) => ({
        id: index + 1,
        name: Object.values(variant).join(" / "),
        group: Object.values(variant)[0],
        subVariant: Object.values(variant).length > 1,
        price: 0,
        quantity: 0,
      }));

      let updatedVariants = [...prevVariants];

      newVariants.forEach((newVariant) => {
        let parentVariantIndex = updatedVariants.findIndex(
          (v) => v.group === newVariant.group && !v.subVariant
        );

        if (parentVariantIndex !== -1) {
          let parentVariant = updatedVariants[parentVariantIndex];

          if (newVariant.subVariant) {
            const existingSubVariants = parentVariant.subVariants || [];
            const alreadyExists = existingSubVariants.some(
              (subV) => subV.name === newVariant.name
            );

            if (!alreadyExists) {
              parentVariant.subVariants = [...existingSubVariants, newVariant];
            }
          }
        } else {
          updatedVariants.push({ ...newVariant, subVariants: [] });
        }
      });

      return updatedVariants;
    });
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handleNestedChange = (variantId, field, value) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant) => ({
        ...variant,
        subVariants: variant.subVariants
          ? variant.subVariants.map((subV) =>
              subV.id === variantId ? { ...subV, [field]: Number(value) } : subV
            )
          : variant.subVariants,
      }))
    );
  };

  const handleOpenForm = () => {
    setNewOption({ name: "", values: [""] });
    setShowVariantForm(true);
  };

  const handleNewOptionNameChange = (value) => {
    setNewOption({ ...newOption, name: value });
  };

  const handleNewOptionValueChange = (index, value) => {
    let updatedValues = [...newOption.values];
    updatedValues[index] = value;
    setNewOption({ ...newOption, values: updatedValues });
  };

  const handleAddNewValue = () => {
    setNewOption({ ...newOption, values: [...newOption.values, ""] });
  };

  const handleDeleteNewValue = (index) => {
    let updatedValues = newOption.values.filter((_, i) => i !== index);
    setNewOption({ ...newOption, values: updatedValues });
  };

  const handleDone = () => {
    if (newOption.name.trim() === "" || newOption.values.length === 0) return;

    const updatedOptions = [...options, { ...newOption }];
    setOptions(updatedOptions);
    updateVariants(updatedOptions);
    setShowVariantForm(false);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userid");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setMessage({ type: "error", text: "User ID not found. Please log in." });
    }
  }, []);

  const { product } = locationData.state || {};

  useEffect(() => {
    setVariants((prevVariants) =>
      prevVariants.map((variant) => {
        if (variant.subVariants && variant.subVariants.length > 0) {
          const totalPrice = variant.subVariants.reduce(
            (sum, v) => sum + Number(v.price || 0),
            0
          );
          const totalQuantity = variant.subVariants.reduce(
            (sum, v) => sum + Number(v.quantity || 0),
            0
          );
          return { ...variant, price: totalPrice, quantity: totalQuantity };
        }
        return variant;
      })
    );
  }, [variants]);

  useEffect(() => {
    if (product) {
      console.log("Fetched Product:", product);
      console.log("Product ID:", product?.id);
      console.log("Product Options:", product.options); 

      const formattedVariants = product.variants.map((variant) => ({
        ...variant,
        subVariants:
          product.variants.filter((v) => v.parent_id === variant.id) || [],
      }));

      setIsEditing(true);
      setTitle(product.title || "");
      setDescription(product.body_html || "");
      setProductType(product.product_type || "");
      setPrice(product.variants[0].price || "");
      setCompareAtPrice(product.variants[0].compare_at_price || "");
      setTrackQuantity(product.inventory.track_quantity || false);
      setQuantity(product.inventory.quantity || 0);
      setContinueSelling(product.inventory.continue_selling || false);
      setHasSKU(product.inventory.has_sku || false);
      setSKU(product.inventory.sku || "");
      setBarcode(product.inventory.barcode || "");
      setTrackShipping(product.shipping.track_shipping || false);
      setWeight(product.shipping.weight || "");
      setUnit(product.shipping.weight_unit || "kg");
      setStatus(product.status || "publish");
      setUserId(product.userId || "");
      setVendor(product.vendor || "");

     
      setOptions(
        product.options?.map((option) => ({
          id: option.id || "No ID",
          name: option.name || "Unnamed Option",
          values: option.values || [],
        })) || []
      );

      setVariants(formattedVariants);
      setImages(product.images || []);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userid");

    if (!userId) {
      setMessage({
        type: "error",
        text: "User ID is missing. Cannot submit form.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    // if (images.length === 0) {
    //   console.error("No images selected!");
    //   setMessage({ type: "error", text: "Please select at least one image." });
    //   setLoading(false);
    //   return;
    // }

    const formData = new FormData();
    formData.append("keyWord", keyWord);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("productType", productType);
    formData.append("price", parseFloat(price));

    if (compareAtPrice)
      formData.append("compare_at_price", parseFloat(compareAtPrice));
    formData.append("track_quantity", trackQuantity ? "true" : "false");
    formData.append("quantity", trackQuantity ? parseInt(quantity) : 0);
    formData.append("continue_selling", continueSelling);
    formData.append("has_sku", hasSKU);

    if (hasSKU && sku) formData.append("sku", sku);
    if (hasSKU && barcode) formData.append("barcode", barcode);

    formData.append("track_shipping", trackShipping);

    if (trackShipping && weight) formData.append("weight", parseFloat(weight));
    if (trackShipping && unit) formData.append("weight_unit", unit);

    formData.append("status", status);
    formData.append("userId", userId);
    formData.append("vendor", vendor);
    formData.append("options", JSON.stringify(options));
    formData.append("variants", JSON.stringify(variants));

    images.forEach((image, index) => {
      formData.append("images", image);
    });

    try {
      const url = isEditing
        ? `http://localhost:5000/product/updateProducts/${product._id}`
        : "http://localhost:5000/product/addEquipment";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Product added successfully!" });

        setTitle("");
        setDescription("");
        setProductType("");
        setPrice("");
        setCompareAtPrice("");
        setTrackQuantity(false);
        setQuantity(0);
        setContinueSelling(false);
        setHasSKU(false);
        setSKU("");
        setBarcode("");
        setTrackShipping(false);
        setWeight("");
        setUnit("kg");
        setOptions([]);
        setVariants([]);
        setVendor("");
        setImages([]);
        setSelectedImages([]);
        setKeyWord("");
        navigate("/MANAGE_PRODUCT")
      } else {
        setMessage({
          type: "error",
          text: data.error || "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      setMessage({ type: "error", text: "Failed to connect to server." });
    }

    setLoading(false);
  };

  const handleParentChange = (variantId, field, value) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant) =>
        variant.id === variantId ? { ...variant, [field]: value } : variant
      )
    );
  };

  const handleVariantImageChange = (variantId, event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setVariants((prevVariants) =>
        prevVariants.map((variant) =>
          variant.id === variantId ? { ...variant, image: imageUrl } : variant
        )
      );
    }
  };
  const [inputValue, setInputValue] = useState("");

  const removeTag = (index, setState, stateValues) => {
    setState(stateValues.filter((_, i) => i !== index));
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
            <label className="block  text-sm font-medium text-gray-700">
              Description
            </label>
            <ReactQuill
              value={description}
              onChange={setDescription}
              modules={modules}
              className="mt-1 block w-full border border-gray-300 "
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media
            </label>

            {Object.values(checkedImages).some((isChecked) => isChecked) && (
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-700">
                  {Object.values(checkedImages).filter(Boolean).length} file
                  selected
                </p>
                <button
                  onClick={handleRemoveSelected}
                  className="text-red-500 text-sm font-medium hover:underline"
                >
                  Remove
                </button>
              </div>
            )}

            {selectedImages.length === 0 ? (
              <div className="border border-dashed border-gray-400 p-6 text-center rounded-xl">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="fileUpload"
                />
                <label
                  htmlFor="fileUpload"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                >
                  Upload new
                </label>
                <p className="text-gray-500 text-sm mt-2">
                  Accepts images, videos, or 3D models
                </p>
              </div>
            ) : (
              <div className="flex gap-2">
                {selectedImages.map((src, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={src}
                      alt={`Uploaded ${index}`}
                      className={`w-40 h-40 object-cover rounded-md border border-gray-300 transition ${
                        checkedImages[index] ? "opacity-50" : "opacity-100"
                      }`}
                    />

                    <input
                      type="checkbox"
                      className="absolute top-2 left-2 w-5 h-5 cursor-pointer opacity-0 group-hover:opacity-100"
                      onChange={() => toggleImageSelection(index)}
                      checked={checkedImages[index] || false}
                    />
                  </div>
                ))}
                <div className="w-[80px] h-[80px] border border-gray-300 flex items-center justify-center rounded-md">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="uploadMore"
                  />
                  <label
                    htmlFor="uploadMore"
                    className="text-gray-500 text-2xl cursor-pointer"
                  >
                    +
                  </label>
                </div>
              </div>
            )}

            {/* Display existing & new images together */}
            {/* <div className="flex gap-2 flex-wrap">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.src || img} // Handle both URL and object preview
                    alt={`Image ${index}`}
                    className={`w-40 h-40 object-cover rounded-md border border-gray-300 transition ${
                      checkedImages[index] ? "opacity-50" : "opacity-100"
                    }`}
                  />
                  <input
                    type="checkbox"
                    className="absolute top-2 left-2 w-5 h-5 cursor-pointer opacity-0 group-hover:opacity-100"
                    onChange={() => toggleImageSelection(index)}
                    checked={checkedImages[index] || false}
                  />
                </div>
              ))}
            </div> */}
          </div>

          {/* pricing  */}
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

          {/* Inventory  */}
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
          {/* shippingh  */}

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
          {/* variants  */}

          <div className="border rounded-2xl p-3 mt-3 bg-white border-gray-300 w-full">
            <h2 className="text-sm font-medium text-gray-800">Variants</h2>

            {!showVariantForm && (
              <div className="flex gap-2 items-center mt-2">
                <FaCirclePlus className="text-gray-600 text-sm" />
                <button
                  onClick={handleOpenForm}
                  className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-200"
                >
                  Add option like size or color
                </button>
              </div>
            )}

            {options.length > 0 && (
              <div className="mt-3">
                {options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="border p-2 rounded-lg mt-2 bg-gray-50"
                  >
                    <h3 className="text-sm font-medium text-gray-800">
                      {option.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {option.values.map((value, valueIndex) => (
                        <span
                          key={valueIndex}
                          className="text-sm bg-gray-200 px-2 py-1 rounded-md"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleOpenForm}
                  className="flex gap-2 items-center text-sm text-blue-600 mt-2 hover:underline"
                >
                  <FaCirclePlus /> Add another option
                </button>
              </div>
            )}

            {showVariantForm && (
              <div className="mt-3 border border-gray-300 rounded-lg p-4 bg-gray-50">
                <label className="block text-sm font-medium text-gray-700">
                  Option name
                </label>
                <input
                  type="text"
                  value={newOption.name}
                  onChange={(e) => handleNewOptionNameChange(e.target.value)}
                  placeholder="Size"
                  className="w-full border-gray-300 rounded-md p-2 mt-1 focus:ring focus:ring-gray-400 focus:border-gray-500"
                />

                <label className="block text-sm font-medium text-gray-700 mt-3">
                  Option values
                </label>
                {newOption.values.map((value, index) => (
                  <div key={index} className="flex gap-2 items-center mt-2">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        handleNewOptionValueChange(index, e.target.value)
                      }
                      placeholder="Medium"
                      className="w-full border-gray-300 rounded-md p-2 focus:ring focus:ring-gray-400 focus:border-gray-500"
                    />
                    {newOption.values.length > 1 && (
                      <button
                        onClick={() => handleDeleteNewValue(index)}
                        className="text-red-600 text-sm border rounded-md p-1 hover:bg-red-100"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={handleAddNewValue}
                  className="text-sm text-blue-600 mt-2 hover:underline"
                >
                  + Add another value
                </button>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setShowVariantForm(false)}
                    className="text-sm text-red-600 border border-red-400 px-3 py-1 rounded-lg hover:bg-red-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDone}
                    className="text-sm text-white bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-900"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {variants.length > 0 && (
              <div className="mt-4 border border-gray-300 rounded-lg p-3 bg-white">
                <h3 className="text-sm font-medium text-gray-800">
                  Generated Variants
                </h3>
                <table className="w-full mt-2 border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left text-gray-700 text-sm p-2 w-1/2">
                        Variant
                      </th>
                      <th className="text-left text-gray-700 text-sm p-2">
                        Price
                      </th>
                      <th className="text-left text-gray-700 text-sm p-2">
                        Available
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((variant) => (
                      <React.Fragment key={variant.id}>
                        <tr className="border-b border-gray-200">
                          <td className="p-2 text-gray-800 flex items-center gap-3">
                            <div className="w-14 h-14 border border-dashed border-gray-300 flex items-center justify-center rounded-md relative">
                              {variant.image ? (
                                <img
                                  src={variant.image}
                                  alt={variant.name}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <label
                                  htmlFor={`upload-${variant.id}`}
                                  className="cursor-pointer"
                                >
                                  <span className="text-blue-500 text-3xl">
                                    <FcAddImage />
                                  </span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id={`upload-${variant.id}`}
                                    className="hidden"
                                    onChange={(e) =>
                                      handleVariantImageChange(variant.id, e)
                                    }
                                  />
                                </label>
                              )}
                            </div>

                            <div className="flex flex-col items-start">
                              <span className="font-medium text-gray-800">
                                {variant.name}
                              </span>

                              <button
                                onClick={() => toggleGroup(variant.group)}
                                className="flex items-center gap-2 mt-1 bg-gray-100 px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-200"
                              >
                                <span className="text-gray-500 text-sm">
                                  {variant.subVariants
                                    ? `${variant.subVariants.length} variants`
                                    : "0 variants"}
                                </span>
                                {expandedGroups[variant.group] ? (
                                  <FaChevronUp />
                                ) : (
                                  <FaChevronDown />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Parent Price - Editable */}
                          <td className="p-2">
                            <input
                              type="number"
                              className="border-gray-300 rounded-md p-1 w-24"
                              value={variant.price}
                              onChange={(e) =>
                                handleParentChange(
                                  variant.id,
                                  "price",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* Parent Quantity - Editable */}
                          <td className="p-2">
                            <input
                              type="number"
                              className="border-gray-300 rounded-md p-1 w-16"
                              value={variant.quantity}
                              onChange={(e) =>
                                handleParentChange(
                                  variant.id,
                                  "quantity",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>

                        {/* Sub-Variants */}
                        {expandedGroups[variant.group] &&
                          variant.subVariants &&
                          variant.subVariants.length > 0 &&
                          variant.subVariants.map((sv) => (
                            <tr
                              key={sv.id}
                              className="border-b border-gray-200 bg-gray-50"
                            >
                              {/* Sub-Variant Image Upload */}
                              <td className="p-2 flex items-center gap-3">
                                <div className="w-14 h-14 border border-dashed border-gray-300 flex items-center justify-center rounded-md relative">
                                  {sv.image ? (
                                    <img
                                      src={sv.image}
                                      alt={sv.name}
                                      className="w-full h-full object-cover rounded-md"
                                    />
                                  ) : (
                                    <label
                                      htmlFor={`upload-${sv.id}`}
                                      className="cursor-pointer"
                                    >
                                      <span className="text-blue-500 text-3xl">
                                        <FcAddImage />
                                      </span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        id={`upload-${sv.id}`}
                                        className="hidden"
                                        onChange={(e) =>
                                          handleVariantImageChange(sv.id, e)
                                        }
                                      />
                                    </label>
                                  )}
                                </div>
                                <span>{sv.name}</span>
                              </td>

                              {/* Sub-Variant Price */}
                              <td className="p-2">
                                <input
                                  type="number"
                                  className="border-gray-300 rounded-md p-1 w-24"
                                  value={sv.price}
                                  onChange={(e) =>
                                    handleNestedChange(
                                      sv.id,
                                      "price",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>

                              {/* Sub-Variant Quantity */}
                              <td className="p-2">
                                <input
                                  type="number"
                                  className="border-gray-300 rounded-md p-1 w-16"
                                  value={sv.quantity}
                                  onChange={(e) =>
                                    handleNestedChange(
                                      sv.id,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <button
            onClick={handleSubmit}
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {loading
              ? "Submitting..."
              : isEditing
              ? "Update Product"
              : "Add Product"}
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
          {/* Status  */}

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
              <option value={"draft"}>Draft</option>
            </select>
          </div>

          <div className="bg-white p-4 border border-gray-300 rounded-xl">
            <label className="block text-sm font-medium text-gray-700">
              Product organization
            </label>
            <div className="mt-2 space-y-2">
              <label htmlFor="keywords" className="block text-gray-600 text-sm">
                Product Type
              </label>
              <input
                type="text"
                placeholder="Type"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-xl"
              />
              <label htmlFor="keywords" className="block text-gray-600 text-sm">
                Vendor
              </label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="Vendor"
                className="w-full border border-gray-300 p-2 rounded-xl"
              />
              <label htmlFor="keywords" className="block text-gray-600 text-sm">
                Keywords
              </label>{" "}
              <input
                type="text"
                placeholder="Key Words"
                value={keyWord}
                onKeyDown={handleKeyDown}
                onChange={(e) => setKeyWord(e.target.value)}
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
