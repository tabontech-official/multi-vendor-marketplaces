import React, { useState, useEffect } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FcAddImage } from "react-icons/fc";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import { FiMinus } from "react-icons/fi";
import { IoIosArrowUp } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";

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
  const [keywordsList, setKeywordsList] = useState([]);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [newOption, setNewOption] = useState({ name: "", values: [""] });
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [checkedImages, setCheckedImages] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const locationData = useLocation();
  const [openOptionIndex, setOpenOptionIndex] = useState(null);
  const [expandedParents, setExpandedParents] = useState([]);
  const toggleChildOptions = (parentIndex) => {
    setExpandedParents((prev) =>
      prev.includes(parentIndex)
        ? prev.filter((index) => index !== parentIndex)
        : [...prev, parentIndex]
    );
  };

  const navigate = useNavigate();
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
  const handleKeyDownForKeyWords = (e) => {
    if (e.key === "Enter" && keyWord.trim() !== "") {
      e.preventDefault();
      if (!keywordsList.includes(keyWord.trim())) {
        setKeywordsList([...keywordsList, keyWord.trim()]);
        setKeyWord("");
      }
    }
  };
  const removeKeyword = (index) => {
    const newList = [...keywordsList];
    newList.splice(index, 1);
    setKeywordsList(newList);
  };
  const handleKeyDown = (e, setState, stateValues) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      setState([...stateValues, e.target.value.trim()]);
      e.target.value = "";
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

  // const generateVariants = () => {
  //   if (options.length < 2) return [];

  //   const parentOption = options[0];
  //   const childOptions = options.slice(1);

  //   let combinations = [];
  //   parentOption.values.forEach((parentValue) => {
  //     let childValues = [];
  //     childOptions.forEach((childOption) => {
  //       childOption.values.forEach((childValue) => {
  //         childValues.push(childValue);
  //       });
  //     });

  //     combinations.push({
  //       parent: parentValue,
  //       children: childValues,
  //     });
  //   });

  //   return combinations;
  // };

  const generateVariants = () => {
    if (options.length < 2) return [];
  
    const parentOption = options[0];
    const childOptions = options.slice(1); // second & third
  
    let combinations = [];
  
    parentOption.values.forEach((parentValue) => {
      let childCombinations = [];
  
      if (childOptions.length === 1) {
        childOptions[0].values.forEach((val) => {
          childCombinations.push(`${val}`);
        });
      } else if (childOptions.length === 2) {
        childOptions[0].values.forEach((val1) => {
          childOptions[1].values.forEach((val2) => {
            childCombinations.push(`${val1} / ${val2}`);
          });
        });
      }
  
      combinations.push({
        parent: parentValue,
        children: childCombinations,
      });
    });
  
    return combinations;
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
    // updateVariants(updatedOptions);
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
      const allVariants = product.variants;

      const groupedVariants = allVariants.reduce((acc, variant) => {
        const leftOption = variant.option1;
        const rightOption = variant.option2;

        if (!acc[leftOption]) {
          acc[leftOption] = {
            parent: {
              ...variant,
              option1: leftOption,
              option2: null,
              option3: null,
              isParent: true,
            },
            children: [],
          };
        }

        if (rightOption) {
          acc[leftOption].children.push({
            ...variant,
            option1: leftOption,
            option2: rightOption,
            option3: null,
            isParent: false,
          });
        }

        return acc;
      }, {});

      const formattedVariants = Object.keys(groupedVariants).map(
        (key, index) => ({
          ...groupedVariants[key].parent,
          group: `parent-${index}`,
          subVariants: groupedVariants[key].children,
        })
      );

      // Set states
      setIsEditing(true);
      setTitle(product.title || "");
      setDescription(product.body_html || "");
      setProductType(product.product_type || "");
      setPrice(product.variants[0]?.price || "");
      setCompareAtPrice(product.variants[0]?.compare_at_price || "");
      setTrackQuantity(product.inventory?.track_quantity || false);
      setQuantity(product.inventory?.quantity || 0);
      setContinueSelling(product.inventory?.continue_selling || false);
      setHasSKU(product.inventory?.has_sku || false);
      setSKU(product.inventory?.sku || "");
      setBarcode(product.inventory?.barcode || "");
      setTrackShipping(product.shipping?.track_shipping || false);
      setWeight(product.shipping?.weight || "");
      setUnit(product.shipping?.weight_unit || "kg");
      setStatus(product.status || "publish");
      setUserId(product.userId || "");
      const tagsArray = Array.isArray(product.tags)
        ? product.tags.flatMap((tag) => tag.split(",").map((t) => t.trim()))
        : [];

      setKeywordsList(tagsArray);

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
      // setKeyWord(product.tags);
    }
  }, [product]);

  const handleAdd = () => {
    const newWeight = (parseFloat(weight) + 1).toFixed(2);
    setWeight(newWeight);
  };

  const handleSubtract = () => {
    const newWeight = (parseFloat(weight) - 1).toFixed(2);
    if (newWeight >= 0) {
      setWeight(newWeight);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*(\.\d{0,2})?$/.test(value)) {
      setWeight(value);
    }
  };
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
    // formData.append("keyWord", keyWord);
    formData.append("keyWord", keywordsList.join(", "));
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
        ? ` https://multi-vendor-marketplace.vercel.app/product/updateProducts/${product._id}`
        : " https://multi-vendor-marketplace.vercel.app/product/addEquipment";

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
        navigate("/MANAGE_PRODUCT");
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

          <div className="mb-4 ">
            <label className="block  text-sm font-medium text-gray-700 ">
              Description
            </label>
            <ReactQuill
              value={description}
              onChange={setDescription}
              modules={modules}
              className="mt-1 block w-full border border-gray-300 min-h-[200px]"
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
            <label className="block text-sm font-medium text-gray-700">
              Pricing
            </label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="text"
                  placeholder="$ 0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border p-2 rounded-2xl border-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Compare at Price
                </label>
                <input
                  type="text"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="$ 0.00"
                  className="w-full border p-2 rounded-2xl border-gray-500"
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
              <div className="mt-4 border-b border-gray-300">
                <div className="flex items-center justify-between  ">
                  <label className="text-sm text-gray-700 block">
                    Quantity
                  </label>{" "}
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-16 border px-3 py-1 rounded-md text-right mb-3"
                  />
                </div>
              </div>
            )}

            {/* Continue Selling Checkbox */}
            {/* <div className="flex items-start mt-3">
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
            </div> */}

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
                className="h-4 w-4 text-blue-500"
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
                  {/* Weight Input and Minus/Plus Buttons */}
                  <div className="flex items-center border border-gray-300 rounded-md">
                    {/* Minus Icon */}
                    <button
                      onClick={handleSubtract}
                      className="px-2 py-1 text-gray-500"
                    >
                      <FaMinus />
                    </button>

                    {/* Weight Input */}
                    <input
                      type="text"
                      value={weight}
                      onChange={handleChange}
                      className="w-20 text-center py-1 border-0 focus:ring-0"
                      placeholder="0.00"
                    />

                    {/* Plus Icon */}
                    <button
                      onClick={handleAdd}
                      className="px-2 py-1 text-gray-500"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  {/* Weight Unit Selector */}
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
                {options.slice(0, 1).map((option, optionIndex) => (
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

                {options.slice(1).map((option, optionIndex) => (
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

                {/* Rendering Variant Combinations */}
                {/* <div className="mt-3">
            <h3 className="text-sm font-medium text-gray-800">Variant Combinations</h3>
            {generateVariants().length > 0 ? (
              generateVariants().map((combination, index) => (
                <div key={index} className="text-sm bg-gray-100 p-2 rounded-md mt-2">
                  <span>{`Parent: ${combination.parent}, Child: ${combination.child}`}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Add more options to generate variants.</p>
            )}
          </div> */}
                {/* <div className="mt-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-lg text-gray-800">
                      Variants
                    </h3>
                    <h3 className="font-medium text-lg text-gray-800">Price</h3>
                    <h3 className="font-medium text-lg text-gray-800">
                      Availability
                    </h3>
                  </div>

                  {generateVariants().length > 0 ? (
                    generateVariants().map((combination, index) => (
                      <div
                        key={index}
                        className="text-sm bg-gray-100 p-2 rounded-md mt-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-700">
                            {combination.parent}
                          </div>
                          <button
                            onClick={() => toggleChildOptions(index)}
                            className="text-gray-500"
                          >
                            {expandedParents.includes(index) ? (
                              <IoIosArrowUp />
                            ) : (
                              <MdOutlineKeyboardArrowDown />
                            )}
                          </button>
                        </div>

                        {expandedParents.includes(index) && (
                          <div className="mt-2">
                            <ul className="ml-4">
                              {combination.children.map((child, idx) => (
                                <li
                                  key={idx}
                                  className="flex justify-between items-center text-gray-600"
                                >
                                  <div className="flex justify-between w-full">
                                    <span className="font-medium">{child}</span>
                                    <div className="flex space-x-4 mt-1">
                                      <input
                                        type="number"
                                        placeholder="Price"
                                        className="w-32 p-1 border border-gray-300 rounded-md text-sm"
                                      />
                                      <input
                                        type="number"
                                        placeholder="Availability"
                                        className="w-32 p-1 border border-gray-300 rounded-md text-sm"
                                      />
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">
                      Add more options to generate variants.
                    </p>
                  )}
                </div> */}
                <div className="mt-3">
  <div className="grid grid-cols-5 gap-4 mb-2">
    <h3 className="font-semibold text-md text-gray-800">Variants</h3>
    <h3 className="font-semibold text-md text-gray-800">Price</h3>
    <h3 className="font-semibold text-md text-gray-800">Availability</h3>
    <h3 className="font-semibold text-md text-gray-800">SKU</h3>
    <h3 className="font-semibold text-md text-gray-800">Action</h3>
  </div>

  {generateVariants().length > 0 ? (
    generateVariants().map((combination, index) => (
      <div key={index} className="bg-gray-100 p-6 rounded-md mt-2">
        <div className="flex items-center justify-between">
          <div className="font-medium text-gray-700">{combination.parent}</div>
          <button
            onClick={() => toggleChildOptions(index)}
            className="text-gray-500"
          >
            {expandedParents.includes(index) ? (
              <IoIosArrowUp className="text-xl" />
            ) : (
              <MdOutlineKeyboardArrowDown className="text-2xl" />
            )}
          </button>
        </div>

        {expandedParents.includes(index) && (
          <div className="mt-2">
            <ul className="space-y-2">
              {combination.children.map((child, idx) => (
                <li key={idx} className="grid grid-cols-5 gap-4 items-center">
                  <span className="font-medium text-gray-700">{child}</span>
                  <input
                    type="text"
                    value={price}
                    placeholder="Price"
                    className="w-full p-1 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    value={quantity}
                    placeholder="Availability"
                    className="w-full p-1 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    value={sku}
                    placeholder="SKU"
                    className="w-full p-1 border border-gray-300 rounded-md text-sm"
                  />
                  <button className="flex justify-end text-red-500">
                    <RiDeleteBin5Fill />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ))
  ) : (
    <p className="text-gray-600">
      Add more options to generate variants.
    </p>
  )}
</div>


                <button
                  onClick={handleOpenForm}
                  className="flex gap-2 items-center text-sm text-blue-600 mt-2 hover:underline"
                >
                  Add another option
                </button>
              </div>
            )}

            {/* Variant form for adding options */}
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
              </label>
              <input
                type="text"
                placeholder="Key Words"
                value={keyWord}
                onKeyDown={handleKeyDownForKeyWords}
                onChange={(e) => setKeyWord(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-xl"
              />

              <div className="flex flex-wrap gap-2 mt-2">
                {keywordsList.map((word, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center"
                  >
                    {word}
                    <button
                      type="button"
                      className="ml-2 text-red-500"
                      onClick={() => removeKeyword(index)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategorySelector;
