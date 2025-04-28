import React, { useState, useEffect, useRef } from "react";
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
import RTC from "../component/editor";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { RxCross1 } from "react-icons/rx";

import {
  convertToRaw,
  EditorState,
  ContentState,
  convertFromRaw,
} from "draft-js";
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
  const [expandedParents, setExpandedParents] = useState([]);
  const [variantImages, setVariantImages] = useState({});
  const [productTypesList, setProductTypesList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [variantPrices, setVariantPrices] = useState({});
  const [variantCompareAtPrices, setVariantComparePrices] = useState({});
  const [variantSku, setVariantSku] = useState({});
  const [currentVariant, setCurrentVariant] = useState(null);

  const [variantQuantities, setVariantQuantities] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);

    const rawContent = convertToRaw(newEditorState.getCurrentContent());
    setDescription(JSON.stringify(rawContent));
  };

  const toggleChildOptions = (parentIndex) => {
    setExpandedParents((prev) =>
      prev.includes(parentIndex)
        ? prev.filter((index) => index !== parentIndex)
        : [...prev, parentIndex]
    );
  };

  const navigate = useNavigate();

  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current.length > 0) {
      const lastInput = inputRefs.current[inputRefs.current.length - 1];
      lastInput?.focus();
    }
  }, [newOption.values.length]);

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

  // const handleImageChange = (event) => {
  //   const files = Array.from(event.target.files);
  //   const imagePreviews = files.map((file) => URL.createObjectURL(file));
  //   setSelectedImages((prevImages) => [...prevImages, ...imagePreviews]);

  //   setImages(files);
  // };

  const toggleImageSelection = (index) => {
    setCheckedImages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleRemoveSelected = () => {
    const filtered = selectedImages.filter((_, index) => !checkedImages[index]);
    setSelectedImages(filtered);
    setCheckedImages({});
  };

  const handleDeleteCombination = (parentIndex, childIndex) => {
    setCombinations((prevCombinations) => {
      const updatedCombinations = [...prevCombinations];
      const updatedChildren = [...updatedCombinations[parentIndex].children];
      updatedChildren.splice(childIndex, 1);

      if (updatedChildren.length === 0) {
        updatedCombinations.splice(parentIndex, 1);
      } else {
        updatedCombinations[parentIndex] = {
          ...updatedCombinations[parentIndex],
          children: updatedChildren,
        };
      }

      return updatedCombinations;
    });

    setOptions((prevOptions) => {
      const updated = prevOptions.map((option) => {
        const updatedValues = option.values.filter((val) => {
          const parent = combinations[parentIndex]?.parent || "";
          const child = combinations[parentIndex]?.children?.[childIndex] || "";

          return val !== child;
        });

        return {
          ...option,
          values: updatedValues,
        };
      });

      return updated;
    });
  };

  const generateVariants = () => {
    if (options.length < 2) return [];

    const parentOption = options[0];
    const childOptions = options.slice(1);

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

  const [combinations, setCombinations] = useState(generateVariants());
  useEffect(() => {
    setCombinations(generateVariants());
  }, [options]);
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

  const { product } = locationData.state || {};

  useEffect(() => {
    const userId = localStorage.getItem("userid");

    if (isPopupVisible && userId) {
      const productId = product?.id || "null";

      fetch(
        ` https://multi-vendor-marketplace.vercel.app/product/getImageGallery/${userId}/${productId}`
      )
        .then((res) => res.json())
        .then((data) => {
          const allImages = data.flatMap((item) => item.images);
          setGalleryImages(allImages);
        })
        .catch((err) => console.error("Failed to fetch images:", err));
    }
  }, [isPopupVisible, product]);

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
      const hydratedVariantImages = {};
      formattedVariants.forEach((variantGroup, index) => {
        const parent = variantGroup.option1;
        const children = variantGroup.subVariants;

        children.forEach((childVariant) => {
          const key = `${index}-${childVariant.option2}`;
          const imageId = childVariant.image_id;

          const matched = product.variantImages?.find(
            (img) => String(img.id) === String(imageId)
          );

          if (matched?.src) {
            hydratedVariantImages[key] = {
              preview: matched.src,
              loading: false,
            };
          }
        });
      });
      setIsEditing(true);
      setTitle(product.title || "");
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
      const imageURLs =
        product.images?.map((img) => ({
          cloudUrl: img.src,
          loading: false,
        })) || [];
      setSelectedImages(imageURLs);
      const tagsArray = Array.isArray(product.tags)
        ? product.tags.flatMap((tag) => tag.split(",").map((t) => t.trim()))
        : [];
      setKeywordsList(tagsArray);
      setVendor(product.vendor);
      setProductType(product.product_type);
      setOptions(
        product.options?.map((option) => ({
          id: option.id || "No ID",
          name: option.name || "Unnamed Option",
          values: option.values || [],
        })) || []
      );
      setVariants(formattedVariants);
      setVariantPrices(product.variants.map((v) => v.price || ""));
      setVariantQuantities(
        product.variants.map((v) => v.inventory_quantity || 0)
      );
      setVariantSku(product.variants.map((v) => v.sku || ""));
      setImages(product.images || []);
      setVariantImages(hydratedVariantImages);

      const rawDescription = product.body_html || "";
      try {
        const parsedContent = JSON.parse(rawDescription);
        const contentState = convertFromRaw(parsedContent);
        setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        const contentBlock = htmlToDraft(rawDescription);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
          );
          setEditorState(EditorState.createWithContent(contentState));
        } else {
          setEditorState(EditorState.createEmpty());
        }
      }
    }
  }, [product]);

  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files);
    const previews = files.map((file) => ({
      localUrl: URL.createObjectURL(file),
      loading: true,
      cloudUrl: null,
    }));

    const updatedImages = [...selectedImages, ...previews];
    setSelectedImages(updatedImages);
    const userId = localStorage.getItem("userid");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "images");

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dt2fvngtp/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (data.secure_url) {
          await fetch(
            "  https://multi-vendor-marketplace.vercel.app/product/addImageGallery",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                images: [data.secure_url],
              }),
            }
          );

          setSelectedImages((prev) => {
            const updated = [...prev];
            const target = updated.find(
              (img) => img.localUrl === previews[i].localUrl
            );
            if (target) {
              target.cloudUrl = data.secure_url;
              target.loading = false;
            }
            return updated;
          });
        }
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*(\.\d{0,2})?$/.test(value)) {
      setWeight(value);
    }
  };

  const handleVariantImageUpload = (event, parentIndex, child) => {
    const file = event.target.files[0];
    if (!file) return;

    const imagePreview = URL.createObjectURL(file);

    setVariantImages((prev) => ({
      ...prev,
      [`${parentIndex}-${child}`]: { file, preview: imagePreview },
    }));
  };
  const files = [
    {
      id: 1,
      name: "file1.png",
      type: "PNG",
      src: "https://cdn.shopify.com/s/files/1/0730/5553/5360/files/wnxzfpn2njdvpmlmel1o.png?v=1745405853",
    },
    {
      id: 2,
      name: "file2.jpg",
      type: "JPG",
      src: "https://cdn.shopify.com/s/files/1/0730/5553/5360/files/wnxzfpn2njdvpmlmel1o.png?v=1745405853",
    },
    // Add more file objects as needed
  ];
  const handleRemoveVariantImages = (parentIndex, child) => {
    setVariantImages((prev) => {
      const newImages = { ...prev };
      delete newImages[`${parentIndex}-${child}`];
      return newImages;
    });
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

    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);
    const modifiedContent = htmlContent
      .replace(/<p>/g, "")
      .replace(/<\/p>/g, "<br />")
      .replace(/<br\s*\/?>\s*<br\s*\/?>/g, "<br />")
      .replace(/&nbsp;/g, " ");

    const prepareVariantPrices = () => {
      return combinations.flatMap((combination, index) => {
        return combination.children.map((child) => {
          const key = `${index}-${child}`;
          return variantPrices[key] !== undefined ? variantPrices[key] : null;
        });
      });
    };
    const prepareVariantCompareAtPrices = () => {
      return combinations.flatMap((combination, index) => {
        return combination.children.map((child) => {
          const key = `${index}-${child}`;
          return variantCompareAtPrices[key] !== undefined
            ? variantCompareAtPrices[key]
            : null;
        });
      });
    };
    // const prepareVarianQuantities = () => {
    //   return combinations.flatMap((combination, index) => {
    //     return combination.children.map((child) => {
    //       const key = `${index}-${child}`;
    //       return variantQuantities[key] !== undefined
    //         ? variantQuantities[key]
    //         : null;
    //     });
    //   });
    // };
    const defaultQuantity = parseFloat(quantity) || 0;

    const prepareVarianQuantities = () => {
      return combinations.flatMap((combination, index) => {
        return combination.children.map((child) => {
          const key = `${index}-${child}`;
          const variantQty = parseFloat(variantQuantities[key]);

          if (!isNaN(variantQty) && variantQty > 0) {
            return variantQty;
          } else {
            return defaultQuantity;
          }
        });
      });
    };
    const prepareVariansku = () => {
      return combinations.flatMap((combination, index) => {
        return combination.children.map((child) => {
          const key = `${index}-${child}`;
          return variantSku[key] !== undefined ? variantSku[key] : null;
        });
      });
    };
    const payload = {
      keyWord: keywordsList.join(", "),
      title,
      description: modifiedContent,
      productType: productType,
      price: parseFloat(price),
      compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
      track_quantity: trackQuantity,
      quantity: trackQuantity ? parseFloat(quantity) : 0,
      continue_selling: continueSelling,
      has_sku: hasSKU,
      sku: hasSKU && sku ? sku : undefined,
      barcode: hasSKU && barcode ? barcode : undefined,
      track_shipping: trackShipping,
      weight: trackShipping && weight ? parseFloat(weight) : undefined,
      weight_unit: trackShipping && unit ? unit : undefined,
      status,
      userId,
      vendor: vendor,
      options,
      variants,
      variantPrices: prepareVariantPrices(),
      variantCompareAtPrices: prepareVariantCompareAtPrices(),
      variantQuantites: prepareVarianQuantities(),
      variantSku: prepareVariansku(),
    };

    console.log("Payload being sent:", payload);

    try {
      const url = isEditing
        ? `  https://multi-vendor-marketplace.vercel.app/product/updateProducts/${product._id}`
        : "   https://multi-vendor-marketplace.vercel.app/product/addEquipment";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const productId = data.product.id;

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.error || "Something went wrong!",
        });
        setLoading(false);
        return;
      }

      const formData = new FormData();

      images.forEach((image) => formData.append("images", image));
      Object.entries(variantImages).forEach(([key, { file }]) => {
        formData.append("variantImages", file);
        formData.append("variantImageKeys", key);
      });

      // const cloudinaryURLs = [];
      // const uploadedVariantImages = [];

      const cloudinaryURLs = selectedImages
        .filter((img) => img.cloudUrl)
        .map((img) => img.cloudUrl);

      const uploadedVariantImages = Object.entries(variantImages).map(
        ([key, { preview }]) => ({
          key,
          url: preview,
        })
      );

      const imageSaveResponse = await fetch(
        `  https://multi-vendor-marketplace.vercel.app/product/updateImages/${data.product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            images: cloudinaryURLs,
            variantImages: uploadedVariantImages,
          }),
        }
      );

      const imageSaveJson = await imageSaveResponse.json();

      if (!imageSaveResponse.ok) {
        setMessage({
          type: "error",
          text: imageSaveJson.error || "Failed to save image URLs",
        });
        setLoading(false);
        return;
      }
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
      setKeyWord("");
      navigate("/manage-product");
    } catch (error) {
      console.error("Error uploading product:", error);
      setMessage({ type: "error", text: "Failed to connect to server." });
    }

    setLoading(false);
  };

  const handlePriceChange = (index, child, value) => {
    const key = `${index}-${child}`;
    setVariantPrices((prev) => ({
      ...prev,
      [key]: value === "" ? "" : parseFloat(value),
    }));
  };
  const handleVariantComparePriceChange = (index, child, value) => {
    const key = `${index}-${child}`;
    setVariantComparePrices((prev) => ({
      ...prev,
      [key]: value === "" ? "" : parseFloat(value),
    }));
  };

  const handleQuantityChange = (index, child, value) => {
    const key = `${index}-${child}`;
    setVariantQuantities((prev) => ({ ...prev, [key]: value }));
  };
  const handleVariantSkuChange = (index, child, value) => {
    const key = `${index}-${child}`;
    setVariantSku((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <main className="flex justify-center bg-gray-100 p-6">
      <div className="w-full max-w-7xl shadow-lg p-6 rounded-md grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div className="block border border-gray-200 shadow-sm max-h-[300px] overflow-auto">
              <Editor
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                wrapperClassName="border-none"
                editorClassName="min-h-[200px] bg-white p-2"
              />
            </div>
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
                  Accepts images only
                </p>
              </div>
            ) : (
              <div className="flex gap-2">
                {selectedImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.cloudUrl || img.localUrl}
                      alt={`Uploaded ${index}`}
                      className={`w-40 h-40 object-cover rounded-md border border-gray-300 transition ${
                        checkedImages[index] ? "opacity-50" : "opacity-100"
                      }`}
                    />
                    {img.loading && (
                      <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center rounded-md">
                        <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                      </div>
                    )}
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
          </div>

          <div className="mb-4">
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
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(value)) {
                        setPrice(value);
                      }
                    }}
                    className="w-full pl-7 pr-3 py-2 rounded-2xl border border-gray-500 no-spinner"
                    min="0"
                    step="0.01"
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
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder=" 0.00"
                    className="w-full pl-7 pr-3 py-2 rounded-2xl border border-gray-500 no-spinner"
                  />
                </div>
              </div>
            </div>

            <div className="mt-2">
              <input type="checkbox" id="charge-tax" className="mr-2" />
              <label htmlFor="charge-tax" className="text-gray-600">
                Charge tax on this product
              </label>
            </div>
          </div>

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

            {trackQuantity && (
              <div className="mt-4 border-b border-gray-300">
                <div className="flex items-center justify-between  ">
                  <label className="text-sm text-gray-700 block">
                    Quantity
                  </label>{" "}
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-20 border px-3 py-1 rounded-md text-center mb-3 no-spinner"
                  />
                </div>
              </div>
            )}

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
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <input
                      type="text"
                      value={weight}
                      onChange={handleChange}
                      className="w-20 text-center py-1 border-0 focus:ring-0"
                      placeholder="0.00"
                    />
                  </div>

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

                <div className="mt-3">
                  <div className="grid grid-cols-7 items-center gap-20 mb-2 p-3">
                    <h3 className="font-semibold text-xs text-gray-800">
                      VARIANT_IMG
                    </h3>
                    <h3 className="font-semibold text-xs text-gray-800">
                      VARIANT
                    </h3>
                    <h3 className="font-semibold text-xs text-gray-800 ">
                      PRICE
                    </h3>
                    <h3 className="font-semibold text-xs text-gray-800 ">
                      COMPARE_AT
                    </h3>
                    <h3 className="font-semibold text-xs text-gray-800 ">
                      SKU
                    </h3>
                    <h3 className="font-semibold text-xs text-gray-800 ">
                      QTY
                    </h3>
                    <h3 className="font-semibold text-xs text-gray-800 ">
                      ACTION
                    </h3>
                  </div>

                  {generateVariants().length > 0 ? (
                    generateVariants().map((combination, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 p-4 rounded-md mt-2"
                      >
                        <div className="flex items-center justify-between gap-6">
                          <div className="font-medium text-gray-700">
                            {combination.parent}
                          </div>
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
                              {combinations[index]?.children?.map(
                                (child, childIndex) => {
                                  const key = `${index}-${child}`;
                                  const image = variantImages[key];
                                  const variantPrice = variantPrices[key] || "";
                                  const quantities =
                                    variantQuantities[key] || "";
                                  const variantSKU = variantSku[key] || "";
                                  const compareAtPrices =
                                    variantCompareAtPrices[key] || "";
                                  const parentValue =
                                    combinations[index]?.parent;
                                  const normalizeString = (str) =>
                                    str.trim().toLowerCase();

                                  const combinationString = `${parentValue} / ${child}`;

                                  const normalizedCombination =
                                    normalizeString(combinationString);

                                  const matchingVariant =
                                    product?.variants?.find((variant) => {
                                      const normalizedVariantTitle =
                                        normalizeString(variant.title);

                                      return (
                                        normalizedVariantTitle ===
                                        normalizedCombination
                                      );
                                    });
                                  const price = matchingVariant?.price;
                                  const compareAtPrice =
                                    matchingVariant?.compare_at_price;
                                  const sku = matchingVariant?.sku;
                                  const quantity =
                                    matchingVariant?.inventory_quantity;
                                  const variantId = matchingVariant?.id;

                                  const image_id = matchingVariant?.image_id;
                                  const matchedImage = product?.images?.find(
                                    (image) => {
                                      return (
                                        String(image?.id) === String(image_id)
                                      );
                                    }
                                  );

                                  return (
                                    <li
                                      key={childIndex}
                                      className="grid grid-cols-7 items-center gap-20"
                                    >
                                      <div className="w-12 relative">
                                        <label className="flex items-center justify-center w-12 h-12 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition overflow-hidden">
                                          {image?.preview ? (
                                            <img
                                              src={
                                                variantImages[
                                                  `${index}-${child}`
                                                ]?.preview ||
                                                image?.preview ||
                                                ""
                                              }
                                              alt={`Variant ${child}`}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <span className="text-3xl text-gray-400">
                                              +
                                            </span>
                                          )}
                                          <input
                                            // type="file"
                                            // accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onClick={() => {
                                              setCurrentVariant({
                                                index,
                                                child,
                                              });
                                              setIsPopupVisible(true);
                                            }}

                                            // onChange={(e) =>
                                            //   handleVariantImageUpload(
                                            //     e,
                                            //     index,
                                            //     child
                                            //   )
                                            // }
                                          />
                                          {image?.preview && (
                                            <button
                                              onClick={() =>
                                                handleRemoveVariantImages(
                                                  index,
                                                  child
                                                )
                                              }
                                              className="absolute top-0 right-0 text-white bg-red-600 rounded-full px-2 py-1 text-xs"
                                              style={{
                                                transform:
                                                  "translate(25%, -25%)",
                                              }}
                                            >
                                              X
                                            </button>
                                          )}
                                        </label>
                                      </div>

                                      <span
                                        className="font-medium text-sm  text-gray-700  cursor-pointer"
                                        onClick={() => {
                                          navigate(
                                            `/product/${product.id}/variants/${variantId}`,
                                            {
                                              state: {
                                                productId: product.id,
                                                variantId: variantId,
                                              },
                                            }
                                          );
                                        }}
                                      >
                                        {child}
                                      </span>

                                      <div className="relative w-20">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">
                                          $
                                        </span>
                                        <input
                                          type="number"
                                          value={
                                            variantPrice !== ""
                                              ? variantPrice
                                              : price
                                          }
                                          placeholder="Price"
                                          className="w-full p-1 pl-6 border border-gray-300 rounded-md text-sm no-spinner"
                                          onChange={(e) =>
                                            handlePriceChange(
                                              index,
                                              child,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>

                                      <div className="relative w-20 ">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">
                                          $
                                        </span>
                                        <input
                                          type="number"
                                          value={
                                            compareAtPrices !== ""
                                              ? compareAtPrices
                                              : compareAtPrice
                                          }
                                          placeholder="Compare-at"
                                          className="w-full p-1 pl-6 border border-gray-300 rounded-md text-sm no-spinner"
                                          onChange={(e) =>
                                            handleVariantComparePriceChange(
                                              index,
                                              child,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>

                                      <input
                                        type="text"
                                        // value={variantSKU}
                                        value={
                                          variantSKU !== "" ? variantSKU : sku
                                        }
                                        placeholder="SKU"
                                        className="w-20 p-1 border border-gray-300 rounded-md text-sm"
                                        onChange={(e) =>
                                          handleVariantSkuChange(
                                            index,
                                            child,
                                            e.target.value
                                          )
                                        }
                                      />

                                      <input
                                        type="number"
                                        // value={quantity}
                                        value={
                                          quantities !== ""
                                            ? quantities
                                            : quantity
                                        }
                                        placeholder="QTY"
                                        className="w-20 p-1 border border-gray-300 rounded-md text-sm no-spinner"
                                        onChange={(e) =>
                                          handleQuantityChange(
                                            index,
                                            child,
                                            e.target.value
                                          )
                                        }
                                      />

                                      <button
                                        onClick={() =>
                                          handleDeleteCombination(
                                            index,
                                            childIndex
                                          )
                                        }
                                        className="text-red-600"
                                      >
                                        <FaTrash />
                                      </button>
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600"></p>
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
                      ref={(el) => (inputRefs.current[index] = el)}
                      onChange={(e) =>
                        handleNewOptionValueChange(index, e.target.value)
                      }
                      placeholder="Medium"
                      className="w-full border-gray-300 rounded-md p-2 focus:ring focus:ring-gray-400 focus:border-gray-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddNewValue();
                        }
                      }}
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
          {loading && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-80 flex flex-col justify-center items-center z-50">
              <img
                src="https://i.gifer.com/4V0b.gif"
                alt="Loading..."
                className="w-16 h-16"
              />
              <p className="mt-4 text-white font-semibold">
                Please wait, images are being uploaded...{" "}
              </p>
            </div>
          )}
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
          <div className="bg-white p-4 border border-gray-300 rounded-xl">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              className="mt-2 block w-full border border-gray-300 p-2 rounded-xl"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="publish">Publish</option>
              <option value={"draft"}>Draft</option>
            </select>
          </div>

          <div className="bg-white p-4 border border-gray-300 rounded-xl">
            <label className="block text-sm font-medium text-gray-700">
              Product organization
            </label>
            <div className="mt-2 space-y-2">
              <label
                htmlFor="productType"
                className="block text-gray-600 text-sm"
              >
                Product Type
              </label>
              <input
                type="text"
                placeholder="Type"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-xl"
              />

              <label htmlFor="vendor" className="block text-gray-600 text-sm">
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
                {keywordsList.filter((word) => word.trim() !== "").length >
                  0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keywordsList
                      .filter((word) => word.trim() !== "")
                      .map((word, index) => (
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
                )}
              </div>
            </div>
          </div>
        </div>
        {/* {isPopupVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white w-[60%] max-w-5xl rounded-lg shadow-lg p-6 relative">
              <div className="flex justify-between items-center pb-4 border-b">
                <h2 className="text-lg font-medium">Select image</h2>
                <button
                  onClick={() => setIsPopupVisible(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <RxCross1 />
                </button>
              </div>

              <div className="border-2 border-dashed rounded-lg h-32 flex flex-col justify-center items-center text-gray-500 mt-2">
                <button
                  type="file"
                  accept="images/"
                  className="bg-blue-500 text-white px-3 py-1 rounded-md"
                >
                  Add images
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-6">
                {galleryImages.map((file) => (
                  <div
                    key={file.id}
                    className={`border rounded p-2 relative ${
                      selectedFiles.includes(file.id)
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={file.src}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded"
                    />
                    <input
                      type="checkbox"
                      className="absolute top-2 left-2"
                      checked={
                        currentVariant &&
                        variantImages[
                          `${currentVariant.index}-${currentVariant.child}`
                        ]?.preview === file.src
                      }
                      onChange={() => {
                        if (currentVariant) {
                          const key = `${currentVariant.index}-${currentVariant.child}`;
                          setVariantImages((prev) => ({
                            ...prev,
                            [key]: { preview: file.src },
                          }));
                          setIsPopupVisible(false);
                        }
                      }}
                    />{" "}
                    <p className="text-sm text-center mt-2">{file.name}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6 border-t ">
                <button
                  onClick={() => setIsPopupVisible(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 mr-2 mt-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => console.log(selectedFiles)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )} */}
        {isPopupVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white w-[90%] max-w-5xl max-h-[90vh] rounded-lg shadow-lg p-6 relative overflow-y-auto">
              <div className="sticky top-0 bg-white z-10 pb-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  Select Image
                </h2>
                <button
                  onClick={() => setIsPopupVisible(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <RxCross1 />
                </button>
              </div>

              <div className="border-2 border-dashed rounded-lg h-32 flex flex-col justify-center items-center text-gray-500 mt-4">
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
                  className="bg-blue-500 text-white px-4 py-1 rounded-md cursor-pointer"
                >
                  Add images
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                {galleryImages.map((file) => (
                  <div
                    key={file.id || file.src}
                    className={`border rounded p-2 relative ${
                      selectedFiles.includes(file.id)
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    <div
                      onClick={() => {
                        if (currentVariant) {
                          const key = `${currentVariant.index}-${currentVariant.child}`;
                          setVariantImages((prev) => ({
                            ...prev,
                            [key]: { preview: file.src },
                          }));
                          setIsPopupVisible(false);
                        }
                      }}
                      className="cursor-pointer hover:opacity-80 transition"
                    >
                      <img
                        src={file.src}
                        alt={file.name || "Image"}
                        className="w-full h-24 object-cover rounded"
                      />
                    </div>

                    <input
                      type="checkbox"
                      className="absolute top-2 left-2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                      checked={
                        currentVariant &&
                        variantImages[
                          `${currentVariant.index}-${currentVariant.child}`
                        ]?.preview === file.src
                      }
                      readOnly
                    />

                    <p className="text-sm text-center mt-2 truncate">
                      {file.name || "Image"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6 border-t pt-4">
                <button
                  onClick={() => setIsPopupVisible(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 mr-2 mt-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => console.log(selectedFiles)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CategorySelector;
