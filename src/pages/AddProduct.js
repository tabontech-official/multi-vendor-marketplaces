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
import { MdEdit, MdOutlineKeyboardArrowDown } from "react-icons/md";
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
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
const CategorySelector = () => {
  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };
  const [optionMode, setOptionMode] = useState("any"); // 'any' or 'other'
  const [dbOptions, setDbOptions] = useState([]); // from backend
  const [matchedOptionValues, setMatchedOptionValues] = useState([]); // values of matched option
  useEffect(() => {
    const fetchDbOptions = async () => {
      try {
        const res = await fetch(
          "https://multi-vendor-marketplace.vercel.app/variantOption/getOptions"
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setDbOptions(data);
        }
      } catch (err) {
        console.error("Error fetching variant options:", err);
      }
    };

    fetchDbOptions();
  }, []);

  const locationData = useLocation();
  const { product } = locationData.state || {};
  const [editing, setEditing] = useState(false);
  const [mongooseProductId, setMongooseProductId] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [productType, setProductType] = useState([]);
  const [seoHandle, setSeoHandle] = useState(
    `https://www.aydiactive.com/products/${product?.title || ""} `
  );
  const [isChanged, setIsChanged] = useState(false);
  const [popupMode, setPopupMode] = useState("variant"); // "variant" | "media"
  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false);

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expandedParents, setExpandedParents] = useState([]);
  const [variantImages, setVariantImages] = useState({});
  const [productTypesList, setProductTypesList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [variantPrices, setVariantPrices] = useState({});
  const [variantCompareAtPrices, setVariantComparePrices] = useState({});
  const [variantSku, setVariantSku] = useState({});
  const [currentVariant, setCurrentVariant] = useState(null);
  const [isSeoEditing, setIsSeoEditing] = useState(false);
  const [seoTitle, setSeoTitle] = useState(product?.title || "");
  const [seoDescription, setSeoDescription] = useState(
    stripHtml(product?.body_html || "")
  );
  const [seoPrice, setSeoPrice] = useState(product?.variants?.[0]?.price || "");
  const [handle, setHandle] = useState(product?.handle || "");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [variantQuantities, setVariantQuantities] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [selectedOptionName, setSelectedOptionName] = useState(""); // dropdown selected name
  const [isCustomOption, setIsCustomOption] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);

    const rawContent = convertToRaw(newEditorState.getCurrentContent());
    setDescription(JSON.stringify(rawContent));
  };
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };
  const toggleChildOptions = (parentIndex) => {
    setExpandedParents((prev) =>
      prev.includes(parentIndex)
        ? prev.filter((index) => index !== parentIndex)
        : [...prev, parentIndex]
    );
  };
  const [variantEditModalVisible, setVariantEditModalVisible] = useState(false);

  const handleVariantEditModal = (index, child) => {
    setCurrentVariant({ index, child });
    setVariantEditModalVisible(true);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");

      if (!apiKey || !apiSecretKey) {
        console.error("API credentials missing.");
        return;
      }

      try {
        const response = await fetch(
          "https://multi-vendor-marketplace.vercel.app/category/getCategory",
          {
            method: "GET",
            headers: {
              "x-api-key": apiKey,
              "x-api-secret": apiSecretKey,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setCategories(data);
          setFilteredCategories(data);
        } else {
          console.error("Server error:", data.message);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const inputRef = useRef(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [highestLevelSelected, setHighestLevelSelected] = useState(null);
  const [selectedVisibleCategories, setSelectedVisibleCategories] = useState(
    []
  );
  const [finalCategoryPayload, setFinalCategoryPayload] = useState([]);
  const [selectedExportTitle, setSelectedExportTitle] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setFilteredCategories([]);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const containerRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      setDropdownWidth(inputRef.current.offsetWidth);
    }
  }, [searchTerm]);

  const buildCategoryPath = (category) => {
    let path = category.title;
    if (category.level === "level2") {
      const parent = categories.find((c) => c.catNo === category.parentCatNo);
      if (parent) path = `${parent.title} > ${category.title}`;
    }
    if (category.level === "level3") {
      const parent = categories.find((c) => c.catNo === category.parentCatNo);
      const grandparent = parent
        ? categories.find((c) => c.catNo === parent.parentCatNo)
        : null;
      if (parent && grandparent) {
        path = `${grandparent.title} > ${parent.title} > ${category.title}`;
      }
    }
    return path;
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setHighlightIndex(-1);

    if (value.trim() === "") {
      setFilteredCategories([]);
    } else {
      const filtered = categories.filter((category) => {
        const path = buildCategoryPath(category).toLowerCase();
        const matchesSearch = path.includes(value.toLowerCase());

        if (!highestLevelSelected) {
          return matchesSearch;
        }

        if (highestLevelSelected === "level1") {
          return matchesSearch;
        }

        if (highestLevelSelected === "level2") {
          if (category.level === "level1") return false;
          return matchesSearch;
        }

        if (highestLevelSelected === "level3") {
          if (category.level === "level1" || category.level === "level2")
            return false;
          return matchesSearch;
        }

        return matchesSearch;
      });

      setFilteredCategories(filtered);
    }
  };

  const handleKeyDown = (e) => {
    if (filteredCategories.length === 0) return;

    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) =>
        prev < filteredCategories.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCategories.length - 1
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      handleCategorySelect(filteredCategories[highlightIndex]);
    }
  };

  const handleCategorySelect = (selectedCategory) => {
    let categoryData = [];
    let payloadData = [];
    let exportTitle = "";

    const pushCategory = (cat) => {
      if (cat && !selectedCategories.includes(cat.catNo)) {
        categoryData.push(cat.catNo);
        payloadData.push({
          catNo: cat.catNo,
          title: buildCategoryPath(cat),
        });
      }
    };

    if (selectedCategory.level === "level1") {
      pushCategory(selectedCategory);
      exportTitle = selectedCategory.title;
    }

    if (selectedCategory.level === "level2") {
      const parent = categories.find(
        (c) => c.catNo === selectedCategory.parentCatNo
      );
      pushCategory(parent);
      pushCategory(selectedCategory);

      exportTitle = `${selectedCategory.title} > ${selectedCategory.title}`;
    }

    if (selectedCategory.level === "level3") {
      const parent = categories.find(
        (c) => c.catNo === selectedCategory.parentCatNo
      );
      const grandparent = parent
        ? categories.find((c) => c.catNo === parent.parentCatNo)
        : null;

      pushCategory(grandparent);
      pushCategory(parent);
      pushCategory(selectedCategory);

      if (grandparent && parent) {
        exportTitle = `${grandparent.title} > ${parent.title} > ${selectedCategory.title}`;
      }
    }

    setSelectedCategories((prev) => [...prev, ...categoryData]);
    setSelectedVisibleCategories((prev) => [...prev, selectedCategory.catNo]);
    setFinalCategoryPayload((prev) => [...prev, ...payloadData]);
    setSearchTerm("");
    setFilteredCategories([]);

    setSelectedExportTitle(exportTitle);
  };

  const removeCategory = (catNoToRemove) => {
    setSelectedVisibleCategories((prev) =>
      prev.filter((catNo) => catNo !== catNoToRemove)
    );
    setSelectedCategories((prev) =>
      prev.filter((catNo) => catNo !== catNoToRemove)
    );
  };
  const [isFocused, setIsFocused] = useState(false);

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
    const removedTitle = keywordsList[index];

    const newKeywords = [...keywordsList];
    newKeywords.splice(index, 1);
    setKeywordsList(newKeywords);

    const categoryToRemove = categories.find(
      (cat) => cat.title === removedTitle
    );

    if (categoryToRemove) {
      const newSelectedCategories = selectedCategories.filter(
        (catNo) => catNo !== categoryToRemove.catNo
      );
      setSelectedCategories(newSelectedCategories);
    }
  };

  const toggleImageSelection = (index) => {
    setCheckedImages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
    setIsChanged(true);
  };

  const handleRemoveSelected = () => {
    const filtered = selectedImages.filter((_, index) => !checkedImages[index]);
    setSelectedImages(filtered);
    setCheckedImages({});
    setIsChanged(true);
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
    if (!options || options.length === 0) return [];

    const validOptions = options.filter(
      (opt) => opt.values && opt.values.some((val) => val.trim() !== "")
    );

    if (validOptions.length === 0) return [];

    if (validOptions.length === 1) {
      return [
        {
          parent: validOptions[0].name,
          children: validOptions[0].values.filter((v) => v.trim() !== ""),
        },
      ];
    }

    const parentOption = validOptions[0];
    const childOptions = validOptions.slice(1);
    let combinations = [];

    parentOption.values
      .filter((v) => v.trim() !== "")
      .forEach((parentValue) => {
        let childCombinations = [];

        if (childOptions.length === 1) {
          childOptions[0].values
            .filter((v) => v.trim() !== "")
            .forEach((val) => {
              childCombinations.push(`${val}`);
            });
        } else if (childOptions.length === 2) {
          const first = childOptions[0].values.filter((v) => v.trim() !== "");
          const second = childOptions[1].values.filter((v) => v.trim() !== "");
          first.forEach((val1) => {
            second.forEach((val2) => {
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
    if (options.length >= 3) {
      showToast("error", "You can only add up to 3 option names.");
      return;
    }
    setNewOption({ name: "", values: [""] });
    setShowVariantForm(true);
  };

  // const handleNewOptionNameChange = (value) => {
  //   setNewOption({ ...newOption, name: value });
  // };
  const handleNewOptionNameChange = (value) => {
    setNewOption({ ...newOption, name: value });

    // Match DB option
    const found = dbOptions.find((opt) =>
      opt.optionName.some(
        (name) => name.toLowerCase().trim() === value.toLowerCase().trim()
      )
    );

    if (found) {
      setMatchedOptionValues(found.optionValues || []);
    } else {
      setMatchedOptionValues([]);
    }
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

  // const handleDone = () => {
  //   if (newOption.name.trim() === "" || newOption.values.length === 0) return;

  //   const updatedOptions = [...options, { ...newOption }];
  //   setOptions(updatedOptions);
  //   setShowVariantForm(false);
  // };

  const handleDone = () => {
    const hasValidValues = newOption.values.some((val) => val.trim() !== "");
    if (newOption.name.trim() === "" || !hasValidValues) {
      alert("Please enter at least one value before saving the option.");
      return;
    }

    const cleanedValues = newOption.values.filter((val) => val.trim() !== "");

    // 🔍 Check if option already exists (e.g., Size, Color)
    const existingOptionIndex = options.findIndex(
      (opt) =>
        opt.name.toLowerCase().trim() === newOption.name.toLowerCase().trim()
    );

    let updatedOptions;

    if (existingOptionIndex !== -1) {
      // 🧩 Merge with existing option (no duplicates)
      const existingOption = options[existingOptionIndex];
      const mergedValues = Array.from(
        new Set([...existingOption.values, ...cleanedValues])
      );

      updatedOptions = options.map((opt, i) =>
        i === existingOptionIndex ? { ...opt, values: mergedValues } : opt
      );
    } else {
      // ➕ Add a completely new option
      updatedOptions = [...options, { ...newOption, values: cleanedValues }];
    }

    setOptions(updatedOptions);
    setShowVariantForm(false);
    setNewOption({ name: "", values: [""] });
    setIsChanged(true);
  };

  const [editingOptionIndex, setEditingOptionIndex] = useState(null);

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

  useEffect(() => {
    if (!product || !categories || categories.length === 0) return;

    const categoryTitlesFromDB = product.categories || [];

    const visibleCategoryIds = categoryTitlesFromDB
      .map((title) => {
        const match = categories.find(
          (cat) =>
            buildCategoryPath(cat).trim().toLowerCase() ===
            title.trim().toLowerCase()
        );
        return match ? match.catNo : null;
      })
      .filter(Boolean);

    setSelectedVisibleCategories(visibleCategoryIds);

    const allTags = Array.isArray(product.tags)
      ? product.tags.flatMap((tag) => tag.split(",").map((t) => t.trim()))
      : [];

    const tagsArray = allTags.filter((tag) => {
      if (tag.startsWith("cat_")) return false;
      return !categoryTitlesFromDB.some(
        (title) => title.trim().toLowerCase() === tag.trim().toLowerCase()
      );
    });

    setKeywordsList(tagsArray);
  }, [product, categories]);

  // useEffect(() => {
  //   const userId = localStorage.getItem("userid");
  //   const apiKey = localStorage.getItem("apiKey");
  //   const apiSecretKey = localStorage.getItem("apiSecretKey");
  //   const productId = product?.id || "null";

  //   if (isPopupVisible && userId) {
  //     fetch(
  //       `https://multi-vendor-marketplace.vercel.app/product/getImageGallery/${productId}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "x-api-key": apiKey,
  //           "x-api-secret": apiSecretKey,

  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         const allImages = data.flatMap((item) => item.images);
  //         setGalleryImages(allImages);
  //       })
  //       .catch((err) => console.error("Failed to fetch images:", err));
  //   }
  // }, [isPopupVisible, product]);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userid");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    const productId = product?.id || "null";

    // Run only if any modal that uses gallery is open
    if ((isPopupVisible || isMediaModalVisible) && userId) {
      fetch(
        `https://multi-vendor-marketplace.vercel.app/product/getImageGallery/${productId}`,
        {
          method: "GET",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("📸 Gallery data fetched:", data); // ✅ For debugging
          const allImages = Array.isArray(data)
            ? data.flatMap((item) => item.images)
            : [];
          setGalleryImages(allImages);
        })
        .catch((err) => console.error("Failed to fetch gallery images:", err));
    }
  }, [isPopupVisible, isMediaModalVisible, product]);

  const normalizeKey = (index, option) => {
    return `${index}-${String(option)
      .replace(/['"]/g, "")
      .replace(/\s+/g, " ")
      .trim()}`;
  };

  useEffect(() => {
    if (product) {
      const normalizeString = (str) => String(str).replace(/['"]/g, "").trim();

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

      // const formattedVariants = Object.keys(groupedVariants).map(
      //   (key, index) => ({
      //     ...groupedVariants[key].parent,
      //     group: `parent-${index}`,
      //     subVariants: groupedVariants[key].children,
      //   })
      // );

      // const hydratedVariantImages = {};

      // product.variants.forEach((variant, idx) => {
      //   const titleKey = normalizeString(variant.title || "");
      //   let matchedImages = [];

      //   if (product.variantImages?.length) {
      //     matchedImages = product.variantImages.filter((img) => {
      //       const alt = normalizeString(img.alt || "");
      //       return (
      //         alt.includes(titleKey.toLowerCase()) ||
      //         alt.includes(titleKey.replace(/\s*\/\s*/g, "-").toLowerCase())
      //       );
      //     });
      //   }

      //   if (!matchedImages.length && variant.image_id) {
      //     const found = product.images?.find(
      //       (img) => String(img.id) === String(variant.image_id)
      //     );
      //     if (found) matchedImages = [found];
      //   }

      //   const combinationAlt = titleKey.replace(/\s*\/\s*/g, "-").toLowerCase();

      //   if (matchedImages.length) {
      //     hydratedVariantImages[titleKey] = matchedImages.map((img) => ({
      //       preview: img.src,
      //       alt: combinationAlt,
      //       loading: false,
      //     }));
      //   }
      // });

      // if (Object.keys(hydratedVariantImages).length > 0) {
      //   const normalizedVariantImages = Object.fromEntries(
      //     Object.entries(hydratedVariantImages).map(([key, value]) => [
      //       key,
      //       Array.isArray(value)
      //         ? value.map((img) => ({
      //             preview: img.preview || img.src,
      //             alt: img.alt || key.replace(/\s*\/\s*/g, "-").toLowerCase(),
      //             loading: false,
      //           }))
      //         : [
      //             {
      //               preview: value.preview || value.src,
      //               alt:
      //                 value.alt || key.replace(/\s*\/\s*/g, "-").toLowerCase(),
      //               loading: false,
      //             },
      //           ],
      //     ])
      //   );

      //   setVariantImages(normalizedVariantImages);
      // } else {
      //   console.log("No variant images found for this product");
      // }

      const formattedVariants = Object.keys(groupedVariants).map(
        (key, index) => ({
          ...groupedVariants[key].parent,
          group: `parent-${index}`,
          subVariants: groupedVariants[key].children,
        })
      );

      const hydratedVariantImages = {};

      product.variants.forEach((variant, idx) => {
        const titleKey = normalizeString(variant.title || "");
        let matchedImages = [];

        // 🧩 1️⃣ Try matching alt text from variantImages
        if (product.variantImages?.length) {
          matchedImages = product.variantImages.filter((img) => {
            const alt = normalizeString(img.alt || "").toLowerCase();
            return (
              alt.includes(titleKey.toLowerCase()) ||
              alt.includes(titleKey.replace(/\s*\/\s*/g, "-").toLowerCase())
            );
          });
        }

        // 🧩 2️⃣ Fallback to Shopify variant.image_id match
        if (!matchedImages.length && variant.image_id) {
          const found = product.images?.find(
            (img) => String(img.id) === String(variant.image_id)
          );
          if (found) matchedImages = [found];
        }

        // 🧩 3️⃣ FINAL fallback — use first product image if variant has none
        if (!matchedImages.length && product.images?.length > 0) {
          matchedImages = [product.images[0]];
        }

        // 🧩 Normalize the alt for consistency
        const combinationAlt = titleKey
          .replace(/\s*\/\s*/g, "-")
          .replace(/\s+/g, "-")
          .toLowerCase();

        // 🧩 Store hydrated images
        hydratedVariantImages[titleKey] = matchedImages.map((img) => ({
          preview: img.src,
          alt: combinationAlt,
          loading: false,
        }));
      });

      // 🧩 Normalize & set final variant image state
      if (Object.keys(hydratedVariantImages).length > 0) {
        const normalizedVariantImages = Object.fromEntries(
          Object.entries(hydratedVariantImages).map(([key, value]) => [
            key,
            Array.isArray(value)
              ? value.map((img) => ({
                  preview: img.preview || img.src,
                  alt: img.alt || key.replace(/\s*\/\s*/g, "-").toLowerCase(),
                  loading: false,
                }))
              : [
                  {
                    preview: value.preview || value.src,
                    alt:
                      value.alt || key.replace(/\s*\/\s*/g, "-").toLowerCase(),
                    loading: false,
                  },
                ],
          ])
        );

        setVariantImages(normalizedVariantImages);
      } else {
        console.log(
          "⚠️ No variant images found, and no fallback images available."
        );
      }

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
      if (product.metafields && product.metafields.length > 0) {
        setEnableMetafields(true);
        setMetafields(product.metafields);
      }
      setMongooseProductId(product._id);
      const imageURLs =
        product.images?.map((img) => ({
          cloudUrl: img.src,
          loading: false,
        })) || [];
      setSelectedImages(imageURLs);

      const tagsArray = Array.isArray(product.tags)
        ? product.tags
            .flatMap((tag) => tag.split(",").map((t) => t.trim()))
            .filter((tag) => !tag.startsWith("cat_"))
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

  // const handleImageChange = async (event) => {
  //   const apiKey = localStorage.getItem("apiKey");
  //   const apiSecretKey = localStorage.getItem("apiSecretKey");
  //   const userId = localStorage.getItem("userid");
  //   const token = localStorage.getItem("usertoken");

  //   const files = Array.from(event.target.files);
  //   if (files.length === 0) return;

  //   const previews = files.map((file) => ({
  //     localUrl: URL.createObjectURL(file),
  //     loading: true,
  //     cloudUrl: null,
  //   }));

  //   setGalleryImages((prev) => [...previews, ...prev]);

  //   for (const file of files) {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("upload_preset", "images");

  //     try {
  //       const res = await fetch(
  //         "https://api.cloudinary.com/v1_1/dt2fvngtp/image/upload",
  //         {
  //           method: "POST",
  //           body: formData,
  //         }
  //       );
  //       const data = await res.json();

  //       if (data.secure_url) {
  //         await fetch(
  //           "https://multi-vendor-marketplace.vercel.app/product/addImageGallery",
  //           {
  //             method: "POST",
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //               "x-api-key": apiKey,
  //               "x-api-secret": apiSecretKey,
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               userId,
  //               images: [data.secure_url],
  //             }),
  //           }
  //         );

  //         setGalleryImages((prev) => [
  //           { id: Date.now(), src: data.secure_url, name: file.name },
  //           ...prev,
  //         ]);

  //         if (currentVariant) {
  //           const parentValue = combinations[currentVariant.index]?.parent;
  //           const combinationKey =
  //             options.length === 1
  //               ? currentVariant.child
  //               : `${parentValue} / ${currentVariant.child}`;

  //           const normalizedKey = combinationKey.replace(/['"]/g, "").trim();
  //           const handleAlt = normalizedKey
  //             .replace(/\s*\/\s*/g, "-")
  //             .toLowerCase();

  //           setVariantImages((prev) => ({
  //             ...prev,
  //             [normalizedKey]: [
  //               ...(Array.isArray(prev[normalizedKey])
  //                 ? prev[normalizedKey]
  //                 : []),
  //               {
  //                 preview: data.secure_url,
  //                 alt: handleAlt,
  //                 loading: false,
  //               },
  //             ],
  //           }));
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Image upload failed:", error);
  //       showToast("error", "Image upload failed");
  //     }
  //   }
  // };

  const handleImageChange = async (event) => {
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    const userId = localStorage.getItem("userid");
    const token = localStorage.getItem("usertoken");

    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const parentValue = combinations[currentVariant?.index]?.parent;
    const combinationKey =
      options.length === 1
        ? currentVariant?.child
        : `${parentValue} / ${currentVariant?.child}`;
    const normalizedKey = combinationKey?.replace(/['"]/g, "").trim();
    const altText = normalizedKey?.replace(/\s*\/\s*/g, "-").toLowerCase();

    const previews = files.map((file) => ({
      id: Date.now() + Math.random(),
      preview: URL.createObjectURL(file),
      alt: altText,
      loading: true,
    }));

    setVariantImages((prev) => ({
      ...prev,
      [normalizedKey]: [
        ...(Array.isArray(prev[normalizedKey]) ? prev[normalizedKey] : []),
        ...previews,
      ],
    }));

    setGalleryImages((prev) => [
      ...previews.map((p) => ({
        id: p.id,
        src: p.preview,
        name: "Uploading...",
      })),
      ...prev,
    ]);

    for (const [index, file] of files.entries()) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "images");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dt2fvngtp/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();

        if (data.secure_url) {
          await fetch(
            "https://multi-vendor-marketplace.vercel.app/product/addImageGallery",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "x-api-key": apiKey,
                "x-api-secret": apiSecretKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                images: [data.secure_url],
              }),
            }
          );

          setVariantImages((prev) => ({
            ...prev,
            [normalizedKey]: prev[normalizedKey].map((img) =>
              img.preview === previews[index].preview
                ? { ...img, preview: data.secure_url, loading: false }
                : img
            ),
          }));

          setGalleryImages((prev) => [
            { id: Date.now(), src: data.secure_url, name: file.name },
            ...prev.filter((img) => img.src !== previews[index].preview),
          ]);
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        showToast("error", "Image upload failed");

        setVariantImages((prev) => ({
          ...prev,
          [normalizedKey]: prev[normalizedKey].filter(
            (img) => img.preview !== previews[index].preview
          ),
        }));
      }
    }
  };

  const normalizeString = (str) => String(str).replace(/['"]/g, "").trim();

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*(\.\d{0,2})?$/.test(value)) {
      setWeight(value);
    }
  };

  const handleMediaUpload = async (event) => {
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    const userId = localStorage.getItem("userid");
    const token = localStorage.getItem("usertoken");

    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newPreviews = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      localUrl: URL.createObjectURL(file),
      loading: true,
      cloudUrl: null,
    }));

    setSelectedImages((prev) => [...newPreviews, ...prev]);
    setIsChanged(true);

    await Promise.all(
      newPreviews.map(async (preview) => {
        const formData = new FormData();
        formData.append("file", preview.file);
        formData.append("upload_preset", "images");

        try {
          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dt2fvngtp/image/upload",
            { method: "POST", body: formData }
          );
          const data = await res.json();

          if (data.secure_url) {
            await fetch(
              "https://multi-vendor-marketplace.vercel.app/product/addImageGallery",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "x-api-key": apiKey,
                  "x-api-secret": apiSecretKey,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, images: [data.secure_url] }),
              }
            );

            setSelectedImages((prev) =>
              prev.map((img) =>
                img.id === preview.id
                  ? { ...img, cloudUrl: data.secure_url, loading: false }
                  : img
              )
            );
          }
        } catch (error) {
          console.error(" Media upload failed:", error);
          showToast("error", "Media upload failed");

          setSelectedImages((prev) =>
            prev.map((img) =>
              img.id === preview.id ? { ...img, loading: false } : img
            )
          );
        }
      })
    );

    event.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userid");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");

    if (!userId) {
      setMessage({
        type: "error",
        text: "User ID is missing. Cannot submit form.",
      });
      return;
    }
    // 🧩 Validate metafields before submitting
    if (enableMetafields) {
      const invalid = metafields.some(
        (m) => !m.label.trim() || !m.value.trim()
      );
      if (invalid) {
        showToast("error", "Please fill all metafield labels and values.");
        return;
      }
    }

    setLoading(true);
    setMessage(null);

    // 🧩 Convert editor content
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);
    const modifiedContent = htmlContent
      .replace(/<p>/g, "")
      .replace(/<\/p>/g, "<br />")
      .replace(/<br\s*\/?>\s*<br\s*\/?>/g, "<br />")
      .replace(/&nbsp;/g, " ");

    // 🧩 Prepare variant-specific arrays
    const prepareVariantPrices = () =>
      combinations.flatMap((combination, index) =>
        combination.children.map((child) => {
          const key = `${index}-${child}`;
          return variantPrices[key] ?? null;
        })
      );

    const prepareVariantCompareAtPrices = () =>
      combinations.flatMap((combination, index) =>
        combination.children.map((child) => {
          const key = `${index}-${child}`;
          return variantCompareAtPrices[key] ?? null;
        })
      );

    const defaultQuantity = parseFloat(quantity) || 0;
    const prepareVariantQuantities = () =>
      combinations.flatMap((combination, index) =>
        combination.children.map((child) => {
          const key = `${index}-${child}`;
          const val = parseFloat(variantQuantities[key]);
          return !isNaN(val) && val > 0 ? val : defaultQuantity;
        })
      );

    const prepareVariantSku = () =>
      combinations.flatMap((combination, index) =>
        combination.children.map((child) => {
          const key = `${index}-${child}`;
          return variantSku[key] ?? null;
        })
      );

    const categoryIds = finalCategoryPayload.map((c) => c.catNo.toString());
    const combinedKeywords = [
      selectedExportTitle,
      ...categoryIds,
      ...keywordsList,
    ].join(", ");

    // 🧩 Main product payload
    const payload = {
      keyWord: combinedKeywords,
      title,
      description: modifiedContent,
      productType,
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
      vendor,
      options,
      variants,
      variantPrices: prepareVariantPrices(),
      variantCompareAtPrices: prepareVariantCompareAtPrices(),
      variantQuantites: prepareVariantQuantities(),
      variantSku: prepareVariantSku(),
      categories: selectedExportTitle,
    };
    if (enableMetafields) {
      payload.metafields = metafields.filter(
        (m) => m.label.trim() !== "" && m.value.trim() !== ""
      );
    }
    console.log("📦 Payload being sent:", payload);

    try {
      // 🧩 Decide if creating or updating
      const url = isEditing
        ? `https://multi-vendor-marketplace.vercel.app/product/updateProducts/${mongooseProductId}`
        : `https://multi-vendor-marketplace.vercel.app/product/createProduct`;

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "x-api-key": apiKey,
          "x-api-secret": apiSecretKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.error || "Something went wrong!",
        });
        setLoading(false);
        return;
      }

      const productId = data.product?.id;
      console.log("✅ Product created/updated:", productId);

      // 🧩 If it's a NEW product → update variants after IDs exist
      if (!isEditing && productId) {
        const variantUpdates = combinations.flatMap((combination, index) =>
          combination.children.map((child) => {
            const key = `${index}-${child}`;
            const matchingVariant = data.product?.variants?.find(
              (v) => v.title.trim().toLowerCase() === child.trim().toLowerCase()
            );

            return {
              variantId: matchingVariant?.id, // Shopify variant ID
              price: variantPrices[key] || price || 0,
              compare_at_price:
                variantCompareAtPrices[key] || compareAtPrice || 0,
              sku: variantSku[key] || "",
              inventory_quantity: variantQuantities[key] || quantity || 0,
              option1: matchingVariant?.option1 || null,
              option2: matchingVariant?.option2 || null,
              option3: matchingVariant?.option3 || null,
            };
          })
        );

        console.log("🧩 Updating each variant via /updateVariant API");

        for (const variant of variantUpdates) {
          if (!variant.variantId) continue;

          await fetch(
            `https://multi-vendor-marketplace.vercel.app/product/updateVariant/${productId}/${variant.variantId}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
                "x-api-key": apiKey,
                "x-api-secret": apiSecretKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ variant }),
            }
          );
        }
      }

      // 🧩 Upload image URLs to product
      const cloudinaryURLs = selectedImages
        .filter((img) => img.cloudUrl)
        .map((img) => img.cloudUrl);

      const uploadedVariantImages = Object.entries(variantImages).flatMap(
        ([key, images]) => {
          // ✅ Generate a clean alt handle like "style-classic"
          const combinationAlt = key.replace(/\s*\/\s*/g, "-").toLowerCase();

          // ✅ Ensure images is always an array
          const safeImages = Array.isArray(images)
            ? images
            : images
            ? [images]
            : [];

          // ✅ Force consistent alt for all images
          return safeImages.map((img) => ({
            key,
            url: img.preview || img.src,
            alt: combinationAlt, // ✅ override any "Variant Image Modern" alt
          }));
        }
      );

      const imageSaveResponse = await fetch(
        `https://multi-vendor-marketplace.vercel.app/product/updateImages/${productId}`,
        {
          method: "PUT",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
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

      // 🧩 Reset form after success
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
      setIsChanged(false);

      setMessage({
        type: "success",
        text: isEditing
          ? "Product updated successfully!"
          : "Product created successfully!",
      });

      navigate("/manage-product");
    } catch (error) {
      console.error("❌ Error uploading product:", error);
      setMessage({ type: "error", text: "Failed to connect to server." });
    } finally {
      setLoading(false);
    }
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

  const handleDuplicate = async () => {
    if (isChanged) {
      showToast("error", "Please update the product first, then duplicate.");
      return;
    }
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    const userId = localStorage.getItem("userid");

    if (!product) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `https://multi-vendor-marketplace.vercel.app/product/duplicateProduct/${product.shopifyId}`,
        {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Product duplicated successfully!",
        });
        navigate(`/manage-product`);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to duplicate product.",
        });
      }
    } catch (err) {
      console.error("Error duplicating product:", err);
      setMessage({ type: "error", text: "Server error while duplicating." });
    } finally {
      setLoading(false);
    }
  };

  // For delete confirmation modal
  const [showDeleteOptionModal, setShowDeleteOptionModal] = useState(false);
  const [deleteOptionTarget, setDeleteOptionTarget] = useState(null);

  const handleDeleteOption = (index) => {
    setDeleteOptionTarget(index);
    setShowDeleteOptionModal(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isChanged) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handlePopState = (e) => {
      if (isChanged) {
        e.preventDefault();
        showToast(
          "error",
          "You have unsaved changes! Please update the product before leaving."
        );

        window.history.forward();
      }
    };

    if (isChanged && !window.__blockerActive) {
      window.__blockerActive = true;
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);
      window.history.pushState(null, "", window.location.href);
    }

    if (!isChanged && window.__blockerActive) {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      window.__blockerActive = false;
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      window.__blockerActive = false;
    };
  }, [isChanged]);
  const handleEditOptionValueChange = (index, value) => {
    const updatedValues = [...newOption.values];
    updatedValues[index] = value;
    setNewOption({ ...newOption, values: updatedValues });
  };

  const handleAddEditedValue = () => {
    setNewOption({ ...newOption, values: [...newOption.values, ""] });
  };

  const handleDeleteEditedValue = (index) => {
    const updatedValues = newOption.values.filter((_, i) => i !== index);
    setNewOption({ ...newOption, values: updatedValues });
  };

  const handleSaveEditedOption = (optionIndex) => {
    const cleanedValues = newOption.values.filter((v) => v.trim() !== "");

    const updated = options.map((opt, i) =>
      i === optionIndex ? { ...opt, values: cleanedValues } : opt
    );

    setOptions(updated);
    setEditingOptionIndex(null);
    setNewOption({ name: "", values: [""] });
    setIsChanged(true);
  };

  const [enableMetafields, setEnableMetafields] = useState(false);
  const [metafields, setMetafields] = useState([{ label: "", value: "" }]);

  const handleMetafieldChange = (index, field, value) => {
    const updated = [...metafields];
    updated[index][field] = value;
    setMetafields(updated);
  };

  const addMetafield = () => {
    setMetafields([...metafields, { label: "", value: "" }]);
  };

  const removeMetafield = (index) => {
    setMetafields(metafields.filter((_, i) => i !== index));
  };

  return (
    <main className="flex justify-center bg-gray-100 p-6">
      {toast.show && (
        <div
          className={`fixed top-16 z-30 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {toast.type === "success" ? (
            <HiOutlineCheckCircle className="w-6 h-6 mr-2" />
          ) : (
            <HiOutlineXCircle className="w-6 h-6 mr-2" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
      <div className="w-full max-w-7xl shadow-lg p-6 rounded-md grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 border border-gray-300 rounded-2xl">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsChanged(true);
              }}
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
                onEditorStateChange={(newEditorState) => {
                  onEditorStateChange(newEditorState);
                  setIsChanged(true);
                }}
                wrapperClassName="border-none"
                editorClassName="min-h-[200px] bg-white p-2"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media
            </label>

            {Object.values(checkedImages).some(Boolean) && (
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
              <div
                onClick={() => setIsMediaModalVisible(true)}
                className="border border-dashed border-gray-400 p-6 text-center rounded-xl cursor-pointer hover:bg-gray-50"
              >
                <label
                  className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMediaModalVisible(true);
                  }}
                >
                  Upload new
                </label>
                <p className="text-gray-500 text-sm mt-2">
                  Accepts images only
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {selectedImages.slice(0, 6).map((img, index) => {
                  const isChecked = checkedImages[index] || false;

                  return (
                    <div
                      key={index}
                      className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border transition
          ${
            isChecked
              ? "ring-2 ring-blue-500 border-blue-400"
              : "border-gray-200 hover:shadow-md"
          }
        `}
                      onClick={() => setIsMediaModalVisible(true)}
                    >
                      {/* Image */}
                      <img
                        src={img.cloudUrl || img.localUrl}
                        alt={`Uploaded ${index}`}
                        className={`w-full h-full object-cover transition duration-300 ${
                          isChecked ? "opacity-60" : "opacity-100"
                        }`}
                      />

                      {/* Hover Overlay */}
                      <div
                        className={`absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 ${
                          isChecked ? "opacity-100" : ""
                        }`}
                      ></div>

                      {/* Checkbox (Top Left) */}
                      <div className="absolute top-2 left-2 opacity-0 hover:opacity-100 transition-opacity duration-200 group-hover:opacity-100">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleImageSelection(index)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-5 h-5 accent-blue-600 cursor-pointer bg-white border border-gray-300 rounded"
                        />
                      </div>

                      {/* Drag Handle Icon (Top Right) */}
                      <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity duration-200 group-hover:opacity-100 text-gray-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="w-4 h-4"
                        >
                          <path d="M8 6h2V4H8v2zm0 7h2v-2H8v2zm0 7h2v-2H8v2zm6-14h2V4h-2v2zm0 7h2v-2h-2v2zm0 7h2v-2h-2v2z" />
                        </svg>
                      </div>

                      {/* Loading Spinner */}
                      {img.loading && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                          <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* + More Tile */}
                {selectedImages.length > 6 && (
                  <div
                    onClick={() => setIsMediaModalVisible(true)}
                    className="aspect-square flex items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-gray-700 font-medium text-lg cursor-pointer hover:bg-gray-200 transition"
                  >
                    +{selectedImages.length - 6}
                  </div>
                )}

                {/* Add Tile */}
                <div
                  onClick={() => setIsMediaModalVisible(true)}
                  className="aspect-square flex items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-500 text-3xl cursor-pointer hover:bg-gray-50 transition"
                >
                  +
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
                        setIsChanged(true);
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
                    onChange={(e) => {
                      setCompareAtPrice(e.target.value);
                      setIsChanged(true); // ✅ This now runs correctly
                    }}
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
                onChange={() => {
                  setTrackQuantity(!trackQuantity);
                  setIsChanged(true);
                }}
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
                  <label className="text-sm text-gray-700 block">
                    Quantity
                  </label>

                  {isEditing ? (
                    <span className="w-full text-sm text-red-500 italic text-right mb-3">
                      You can update quantities inside the variants section
                      below.
                    </span>
                  ) : (
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(e.target.value);
                        setIsChanged(true);
                      }}
                      className="w-20 border px-3 py-1 rounded-md text-center mb-3 no-spinner"
                    />
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="hasSKU"
                checked={hasSKU}
                onChange={() => {
                  setHasSKU(!hasSKU);
                  setIsChanged(true);
                }}
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
                  onChange={(e) => {
                    setSKU(e.target.value);
                    setIsChanged(true);
                  }}
                  className="w-full border p-2 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Barcode"
                  value={barcode}
                  onChange={(e) => {
                    setBarcode(e.target.value);
                    setIsChanged(true); // ✅ Mark as changed
                  }}
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
                onChange={() => {
                  setTrackShipping(!trackShipping);
                  setIsChanged(true); // ✅ mark as changed
                }}
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
                      onChange={(e) => {
                        handleChange(e);
                        setIsChanged(true); // ✅ mark as changed when typing weight
                      }}
                      className="w-20 text-center py-1 border-0 focus:ring-0"
                      placeholder="0.00"
                    />
                  </div>

                  <select
                    value={unit}
                    onChange={(e) => {
                      setUnit(e.target.value);
                      setIsChanged(true); // ✅ mark as changed when changing unit
                    }}
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

          {/*  VARINATS COMBINATION STARTED FROM THERE */}

          <div className="border rounded-2xl p-3 mt-3 bg-white border-gray-300 w-full">
            <h2 className="text-sm font-medium text-gray-800">Variants</h2>

            {!showVariantForm && (
              <div className="flex gap-2 items-center mt-2">
                {/* <button
                  onClick={() => {
                    handleOpenForm();
                    setIsChanged(true);
                  }}
                  className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-200"
                >
                  Add option like size or color
                </button> */}
                <button
                  onClick={() => {
                    if (options.length >= 3) {
                      showToast("warning", "You can only add up to 3 options.");
                      return;
                    }
                    handleOpenForm();
                    setIsChanged(true);
                  }}
                  className={`text-sm text-gray-700 px-3 py-1 rounded-lg border transition ${
                    options.length >= 3
                      ? "bg-gray-200  text-gray-400"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Add option like size or color
                </button>
              </div>
            )}

            {options.length > 0 && (
              <div className="mt-3">
                {options
                  .filter((opt) => opt.values.some((v) => v.trim() !== ""))
                  .map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      onClick={() => {
                        if (editingOptionIndex !== optionIndex) {
                          setEditingOptionIndex(optionIndex);
                          setNewOption({
                            name: option.name,
                            values: [...option.values],
                          });
                        }
                      }}
                      className={`border p-3 rounded-lg mt-2 transition-all duration-200 cursor-pointer ${
                        editingOptionIndex === optionIndex
                          ? "bg-gray-100 border-blue-400 shadow-inner"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-800">
                          {option.name}
                        </h3>

                        {editingOptionIndex === optionIndex && (
                          <div className="flex gap-2">
                            {/* Save changes */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveEditedOption(optionIndex);
                              }}
                              className="text-xs text-white bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-700"
                            >
                              Done
                            </button>

                            {/* Delete entire option */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOption(optionIndex);
                              }}
                              className="text-xs text-red-600 border border-red-400 px-3 py-1 rounded-md hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {editingOptionIndex !== optionIndex && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {option.values
                            .filter((v) => v.trim() !== "")
                            .map((value, valueIndex) => (
                              <span
                                key={valueIndex}
                                className="text-sm bg-gray-200 px-2 py-1 rounded-md"
                              >
                                {value}
                              </span>
                            ))}
                        </div>
                      )}

                      {editingOptionIndex === optionIndex && (
                        <div className="mt-2 space-y-2">
                          {newOption.values.map((value, i) => (
                            <div key={i} className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={value}
                                onChange={(e) =>
                                  handleEditOptionValueChange(i, e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md p-1 text-sm"
                              />
                              {newOption.values.length > 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteEditedValue(i);
                                  }}
                                  className="text-red-600 border p-1 rounded-md hover:bg-red-100"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          ))}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddEditedValue();
                            }}
                            className="text-xs text-blue-600 hover:underline mt-1"
                          >
                            + Add another value
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                <div className="mt-3">
                  <div className="grid grid-cols-6 items-center gap-20 mb-2 p-3">
                    <h3 className="font-semibold text-xs text-gray-800">IMG</h3>
                    <h3 className="font-semibold text-xs text-gray-800">
                      VARIANT
                    </h3>
                    <h3 className="font-semibold text-xs text-gray-800">
                      PRICE
                    </h3>
                    <h3 className="font-semibold text-xs text-gray-800">
                      COMPARE
                    </h3>
                    <h3 className="font-semibold text-xs text-gray-800">QTY</h3>
                    <h3 className="font-semibold text-xs text-gray-800">
                      ACTION
                    </h3>
                  </div>

                  {generateVariants().length > 0 ? (
                    generateVariants().map((combination, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 p-4 rounded-md mt-2"
                      >
                        <div
                          className="flex items-center justify-between gap-6 cursor-pointer"
                          onClick={() => toggleChildOptions(index)}
                        >
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
                                  const parentValue =
                                    combinations[index]?.parent;
                                  const combinationString =
                                    options.length === 1
                                      ? child
                                      : `${parentValue} / ${child}`;
                                  const normalizedKey = combinationString
                                    .replace(/['"]/g, "")
                                    .trim();

                                  const image = variantImages[normalizedKey];
                                  const matchingVariant =
                                    product?.variants?.find(
                                      (variant) =>
                                        normalizeString(variant.title) ===
                                        normalizedKey
                                    );
                                  const variantId = matchingVariant?.id;

                                  return (
                                    <li
                                      key={childIndex}
                                      className="grid grid-cols-6 items-center gap-20"
                                    >
                                      {/* <div className="w-12 relative">
                                        <label className="flex items-center justify-center w-12 h-12 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition overflow-hidden">
                                          <div className="flex gap-2 flex-wrap">
                                            {(
                                              variantImages[normalizedKey] || []
                                            ).map((img, i) => (
                                              <img
                                                src={
                                                  variantImages[
                                                    normalizedKey
                                                  ]?.[0]?.preview
                                                }
                                                alt={
                                                  variantImages[
                                                    normalizedKey
                                                  ]?.[0]?.alt
                                                }
                                                className="w-12 h-12 object-cover rounded-md border border-gray-300"
                                              />
                                            ))}
                                            <label className="flex items-center justify-center w-10 h-10 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition">
                                              <span className="text-xl text-gray-400">
                                                +
                                              </span>
                                              <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onClick={() => {
                                                  setCurrentVariant({
                                                    index,
                                                    child,
                                                  });
                                                  setIsPopupVisible(true);
                                                  setIsChanged(true);
                                                  setPopupMode("variant");
                                                }}
                                              />
                                            </label>
                                          </div>

                                          <input
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onClick={() => {
                                              setCurrentVariant({
                                                index,
                                                child,
                                              });
                                              setIsPopupVisible(true);
                                              setIsChanged(true);
                                            }}
                                          />
                                        </label>
                                      </div> */}
                                      <div className="relative w-14 h-14">
                                        <label className="flex items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition overflow-hidden bg-gray-50">
                                          {variantImages[normalizedKey]
                                            ?.length > 0 ? (
                                            <>
                                              <img
                                                src={
                                                  variantImages[
                                                    normalizedKey
                                                  ][0].preview
                                                }
                                                alt={
                                                  variantImages[
                                                    normalizedKey
                                                  ][0].alt || "variant"
                                                }
                                                className="w-full h-full object-cover rounded-md"
                                              />

                                              {/* ✅ Overlay counter if multiple images exist */}
                                              {variantImages[normalizedKey]
                                                .length > 1 && (
                                                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                                                  +
                                                  {variantImages[normalizedKey]
                                                    .length - 1}
                                                </div>
                                              )}
                                            </>
                                          ) : (
                                            <span className="text-gray-400 text-xl">
                                              +
                                            </span>
                                          )}

                                          <input
                                            multiple
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onClick={() => {
                                              setCurrentVariant({
                                                index,
                                                child,
                                              });
                                              setIsPopupVisible(true);
                                              setIsChanged(true);
                                              setPopupMode("variant");
                                            }}
                                          />
                                        </label>
                                      </div>

                                      <span
                                        className="text-sm font-medium text-gray-500 hover:text-blue-800 transition cursor-pointer whitespace-nowrap"
                                        onClick={() => {
                                          if (isEditing) {
                                            setIsChanged(true);
                                            navigate(
                                              `/product/${product.id}/variants/${variantId}`,
                                              {
                                                state: {
                                                  productId: product.id,
                                                  variantId,
                                                },
                                              }
                                            );
                                          } else {
                                            handleVariantEditModal(
                                              index,
                                              child
                                            );
                                          }
                                        }}
                                      >
                                        {child}
                                      </span>

                                      <div
                                        className="relative w-20 cursor-pointer"
                                        onClick={() => {
                                          if (isEditing) {
                                            navigate(
                                              `/product/${product.id}/variants/${variantId}`,
                                              {
                                                state: {
                                                  productId: product.id,
                                                  variantId,
                                                },
                                              }
                                            );
                                          } else {
                                            handleVariantEditModal(
                                              index,
                                              child
                                            );
                                          }
                                        }}
                                      >
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">
                                          $
                                        </span>
                                        <span className="w-20 p-1 pl-6 text-sm">
                                          {variantPrices[`${index}-${child}`] ??
                                            matchingVariant?.price ??
                                            "0.00"}
                                        </span>
                                      </div>

                                      <div
                                        className="relative w-20 cursor-pointer"
                                        onClick={() => {
                                          if (isEditing) {
                                            navigate(
                                              `/product/${product.id}/variants/${variantId}`,
                                              {
                                                state: {
                                                  productId: product.id,
                                                  variantId,
                                                },
                                              }
                                            );
                                          } else {
                                            handleVariantEditModal(
                                              index,
                                              child
                                            );
                                          }
                                        }}
                                      >
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">
                                          $
                                        </span>
                                        <span className="w-20 p-1 pl-6 text-sm">
                                          {variantCompareAtPrices[
                                            `${index}-${child}`
                                          ] ??
                                            matchingVariant?.compare_at_price ??
                                            "0.00"}
                                        </span>
                                      </div>

                                      <span
                                        className="w-20 p-1 text-sm cursor-pointer"
                                        onClick={() => {
                                          if (isEditing) {
                                            navigate(
                                              `/product/${product.id}/variants/${variantId}`,
                                              {
                                                state: {
                                                  productId: product.id,
                                                  variantId,
                                                },
                                              }
                                            );
                                          } else {
                                            handleVariantEditModal(
                                              index,
                                              child
                                            );
                                          }
                                        }}
                                      >
                                        {variantQuantities[
                                          `${index}-${child}`
                                        ] ??
                                          matchingVariant?.inventory_quantity ??
                                          "0"}
                                      </span>

                                      <button
                                        onClick={() => {
                                          setDeleteTarget({
                                            index,
                                            childIndex,
                                          });
                                          setIsDeleteModalOpen(true);
                                          setIsChanged(true);
                                        }}
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

                        {isDeleteModalOpen && (
                          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Confirm Delete
                              </h2>
                              <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this variant?
                                This action cannot be undone.
                              </p>
                              <div className="flex justify-end gap-3">
                                <button
                                  onClick={() => setIsDeleteModalOpen(false)}
                                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => {
                                    if (deleteTarget) {
                                      handleDeleteCombination(
                                        deleteTarget.index,
                                        deleteTarget.childIndex
                                      );
                                    }
                                    setIsDeleteModalOpen(false);
                                  }}
                                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600"></p>
                  )}
                </div>

                <button
                  onClick={() => {
                    handleOpenForm();
                    setIsChanged(true);
                  }}
                  className="flex gap-2 items-center text-sm text-blue-600 mt-2 hover:underline"
                >
                  Add another option
                </button>
              </div>
            )}

            {showVariantForm && (
              <div className="mt-3 border border-gray-300 rounded-lg p-4 bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option name
                </label>

                {!isCustomOption ? (
                  <select
                    value={selectedOptionName}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedOptionName(value);
                      setIsChanged(true);

                      if (value === "Other") {
                        setIsCustomOption(true);
                        setNewOption({ name: "", values: [""] });
                        setMatchedOptionValues([]);
                      } else {
                        setIsCustomOption(false);
                        setNewOption({ ...newOption, name: value });

                        const found = dbOptions.find((opt) =>
                          opt.optionName.some(
                            (name) =>
                              name.toLowerCase().trim() ===
                              value.toLowerCase().trim()
                          )
                        );

                        if (found) {
                          setMatchedOptionValues(found.optionValues || []);
                        } else {
                          setMatchedOptionValues([]);
                        }
                      }
                    }}
                    className="w-full border-gray-300 rounded-md p-2 focus:ring focus:ring-gray-400 focus:border-gray-500"
                  >
                    <option value="">Select option name</option>
                    {dbOptions.map((opt, i) =>
                      opt.optionName.map((name, j) => (
                        <option key={`${i}-${j}`} value={name}>
                          {name}
                        </option>
                      ))
                    )}
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={newOption.name}
                    onChange={(e) => {
                      handleNewOptionNameChange(e.target.value);
                      setIsChanged(true);
                    }}
                    placeholder="Enter option name (e.g., Material)"
                    className="w-full border-gray-300 rounded-md p-2 focus:ring focus:ring-gray-400 focus:border-gray-500"
                  />
                )}

                <label className="block text-sm font-medium text-gray-700 mt-3">
                  Option values
                </label>

                {!isCustomOption && matchedOptionValues.length > 0 ? (
                  <>
                    {newOption.values.map((value, index) => (
                      <div key={index} className="flex gap-2 items-center mt-2">
                        <select
                          value={value}
                          onChange={(e) =>
                            handleNewOptionValueChange(index, e.target.value)
                          }
                          className="w-full border-gray-300 rounded-md p-2"
                        >
                          <option value="">Select value</option>
                          {matchedOptionValues.map((val, i) => (
                            <option key={i} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>

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
                  </>
                ) : (
                  <>
                    {newOption.values.map((value, index) => (
                      <div key={index} className="flex gap-2 items-center mt-2">
                        <input
                          type="text"
                          value={value}
                          ref={(el) => (inputRefs.current[index] = el)}
                          onChange={(e) =>
                            handleNewOptionValueChange(index, e.target.value)
                          }
                          placeholder="Enter value"
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
                  </>
                )}

                <button
                  onClick={() => {
                    handleAddNewValue();
                    setIsChanged(true);
                  }}
                  className="text-sm text-blue-600 mt-2 hover:underline"
                >
                  + Add another value
                </button>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => {
                      setShowVariantForm(false);
                      setIsChanged(true);
                      setIsCustomOption(false);
                      setSelectedOptionName("");
                    }}
                    className="text-sm text-red-600 border border-red-400 px-3 py-1 rounded-lg hover:bg-red-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleDone();
                      setIsChanged(true);

                      setSelectedOptionName("");
                      setIsCustomOption(false);
                      setNewOption({ name: "", values: [""] });
                      setMatchedOptionValues([]);
                    }}
                    className="text-sm text-white bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-900"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* ✅ META FIELD SECTION */}
          <div className="border rounded-2xl p-4 bg-white border-gray-300 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-800">Metafields</h2>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableMetafields"
                  checked={enableMetafields}
                  onChange={() => setEnableMetafields(!enableMetafields)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="enableMetafields"
                  className="text-sm text-gray-700"
                >
                  Create metafields
                </label>
              </div>
            </div>

            {enableMetafields && (
              <div className="mt-4 space-y-4">
                {metafields.map((field, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative"
                  >
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">
                      Custom Field {index + 1}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">
                          Label
                        </label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) =>
                            handleMetafieldChange(
                              index,
                              "label",
                              e.target.value
                            )
                          }
                          placeholder="Enter label (e.g., Fabric Type)"
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">
                          Value
                        </label>
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) =>
                            handleMetafieldChange(
                              index,
                              "value",
                              e.target.value
                            )
                          }
                          placeholder="Enter value (e.g., Cotton)"
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-400"
                        />
                      </div>
                    </div>

                    {metafields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMetafield(index)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
                        title="Remove this metafield"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addMetafield}
                  className="text-sm text-blue-600 font-medium mt-2 hover:underline"
                >
                  + Add another
                </button>
              </div>
            )}
          </div>

          <div className="border rounded-lg p-4 shadow-sm bg-white mt-3">
            <h2 className="text-md font-medium text-gray-800 mb-3">
              Search engine listing
            </h2>

            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-600">Aydi Active</span>
                <button onClick={() => setEditing(true)}>
                  <MdEdit className="text-gray-500 hover:text-blue-500" />
                </button>
              </div>
              <div className="text-sm text-blue-700 truncate">{seoHandle}</div>
              <div className="text-lg text-blue-800 font-semibold mt-1">
                {seoTitle}
              </div>
              <div className="text-sm text-gray-700 mt-1 leading-snug">
                {seoDescription.length > 120
                  ? `${seoDescription.slice(0, 120)}...`
                  : seoDescription}
              </div>
              <div className="text-sm text-gray-700 font-medium mt-1">
                ${product?.variants?.[0]?.price} AUD
              </div>
            </div>

            {editing && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Page title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    maxLength={70}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {seoTitle.length} of 70 characters used
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Meta description
                  </label>
                  <textarea
                    rows={3}
                    value={seoDescription}
                    maxLength={160}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {seoDescription.length} of 160 characters used
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    URL handle
                  </label>
                  <input
                    type="text"
                    value={seoHandle}
                    onChange={(e) => setSeoHandle(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    https://www.aydiactive.com/products/{seoTitle}
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                    onClick={() => {
                      setEditing(false);
                    }}
                  >
                    Save
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
        <div className="space-y-6 md:sticky md:top-6 self-start h-fit">
          <div className="flex gap-4 mb-4">
            <button
              onClick={handleSubmit}
              type="submit"
              className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              {loading
                ? "Submitting..."
                : isEditing
                ? "Update Product"
                : "Add Product"}
            </button>

            {isEditing && (
              <button
                onClick={handleDuplicate}
                type="button"
                className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
              >
                Duplicate Product
              </button>
            )}
          </div>

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
              <div ref={containerRef} className="relative w-full">
                <label className="block text-sm text-gray-600 mb-1">
                  Category
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    setIsFocused(true);
                    setFilteredCategories(categories);
                  }}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  placeholder="Search category..."
                  className="w-full border border-gray-300 p-2 rounded-xl"
                />

                {isFocused && filteredCategories.length > 0 && (
                  <ul
                    className="absolute z-10 bg-white border border-gray-300 rounded-xl mt-1 max-h-60 overflow-y-auto shadow-lg"
                    style={{ width: `${dropdownWidth}px` }}
                  >
                    {filteredCategories.map((category, index) => (
                      <li
                        key={category.catNo}
                        onClick={() => handleCategorySelect(category)}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${
                          index === highlightIndex ? "bg-gray-200" : ""
                        }`}
                      >
                        {buildCategoryPath(category)}
                      </li>
                    ))}
                  </ul>
                )}
                {selectedVisibleCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedVisibleCategories.map((catNo, index) => {
                      const category = categories.find(
                        (cat) => cat.catNo === catNo
                      );
                      if (!category) return null;

                      return (
                        <span
                          key={index}
                          className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center"
                        >
                          {buildCategoryPath(category)}
                          <button
                            type="button"
                            className="ml-2 text-red-500"
                            onClick={() => removeCategory(catNo)}
                          >
                            &times;
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
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
                {keywordsList.filter(
                  (word) =>
                    word.trim() !== "" &&
                    !word.toLowerCase().startsWith("user_") &&
                    !word.toLowerCase().startsWith("vendor_")
                ).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keywordsList
                      .filter(
                        (word) =>
                          word.trim() !== "" &&
                          !word.toLowerCase().startsWith("user_") &&
                          !word.toLowerCase().startsWith("vendor_")
                      )
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

        {variantEditModalVisible && currentVariant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-6 relative transform transition-all duration-300 scale-100 animate-slideUp">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Edit Variant –{" "}
                  <span className="text-blue-600">{currentVariant.child}</span>
                </h2>
                <button
                  onClick={() => setVariantEditModalVisible(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Price <span className="text-gray-400 text-xs">(USD)</span>
                  </label>
                  <input
                    type="number"
                    value={
                      variantPrices[
                        `${currentVariant.index}-${currentVariant.child}`
                      ] || ""
                    }
                    onChange={(e) =>
                      handlePriceChange(
                        currentVariant.index,
                        currentVariant.child,
                        e.target.value
                      )
                    }
                    className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 w-full p-2 rounded-md text-sm transition"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Compare at Price{" "}
                    <span className="text-gray-400 text-xs">(USD)</span>
                  </label>
                  <input
                    type="number"
                    value={
                      variantCompareAtPrices[
                        `${currentVariant.index}-${currentVariant.child}`
                      ] || ""
                    }
                    onChange={(e) =>
                      handleVariantComparePriceChange(
                        currentVariant.index,
                        currentVariant.child,
                        e.target.value
                      )
                    }
                    className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 w-full p-2 rounded-md text-sm transition"
                    placeholder="Enter compare-at price"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={
                      variantSku[
                        `${currentVariant.index}-${currentVariant.child}`
                      ] || ""
                    }
                    onChange={(e) =>
                      handleVariantSkuChange(
                        currentVariant.index,
                        currentVariant.child,
                        e.target.value
                      )
                    }
                    className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 w-full p-2 rounded-md text-sm transition"
                    placeholder="Enter SKU"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={
                      variantQuantities[
                        `${currentVariant.index}-${currentVariant.child}`
                      ] || ""
                    }
                    onChange={(e) =>
                      handleQuantityChange(
                        currentVariant.index,
                        currentVariant.child,
                        e.target.value
                      )
                    }
                    className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 w-full p-2 rounded-md text-sm transition"
                    placeholder="Enter quantity"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button
                  onClick={() => setVariantEditModalVisible(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setVariantEditModalVisible(false);
                    setIsChanged(true);
                  }}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {isPopupVisible && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-2 sm:px-4">
            <div className="bg-white w-full max-w-5xl h-[90vh] sm:rounded-xl shadow-2xl flex flex-col overflow-hidden">
              <div className="sticky top-0 bg-white z-20 border-b flex justify-between items-center px-6 py-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Select Image for Variant
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPopupVisible(false)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium shadow-sm hover:bg-blue-700 active:scale-95 transition-transform duration-150"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => setIsPopupVisible(false)}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    <RxCross1 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="border-2 border-dashed rounded-lg h-40 flex flex-col justify-center items-center text-gray-500 bg-white shadow-sm transition hover:shadow-md">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="fileUpload"
                  />

                  <div className="flex gap-4 flex-wrap justify-center">
                    <label
                      htmlFor="fileUpload"
                      className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md cursor-pointer hover:bg-blue-700 active:scale-95 transition-transform duration-150"
                    >
                      Add Images
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowGallery(true)}
                      className="px-6 py-2.5 bg-gray-600 text-white font-medium rounded-lg shadow-md cursor-pointer hover:bg-gray-700 active:scale-95 transition-transform duration-150"
                    >
                      Browse
                    </button>
                  </div>

                  <p className="text-sm mt-3 text-gray-500">
                    or drag & drop images here
                  </p>
                </div>

                <div className="mt-8 border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Assign Multiple Images to Variant{" "}
                    <span className="ml-2 text-blue-600 font-medium">
                      {currentVariant?.child
                        ? `${
                            combinations[currentVariant?.index]?.parent || ""
                          } / ${currentVariant?.child}`
                        : "N/A"}
                    </span>
                  </h3>

                  {(() => {
                    const parentValue =
                      combinations[currentVariant?.index]?.parent;
                    const combinationKey =
                      options.length === 1
                        ? currentVariant?.child
                        : `${parentValue} / ${currentVariant?.child}`;
                    const normalizedKey = combinationKey
                      ?.replace(/['"]/g, "")
                      .trim();

                    const assigned = Array.isArray(variantImages[normalizedKey])
                      ? variantImages[normalizedKey]
                      : [];

                    return (
                      <div className="flex flex-wrap gap-3">
                        {assigned.length > 0 ? (
                          assigned.map((img, i) => (
                            <div
                              key={i}
                              className={`relative border border-gray-300 rounded-lg overflow-hidden group cursor-pointer transition-all duration-150 ${
                                i === 0
                                  ? "ring-2 ring-blue-500 shadow-md scale-105"
                                  : "hover:ring-2 hover:ring-gray-400"
                              }`}
                              onClick={() => {
                                if (i === 0) return;
                                setVariantImages((prev) => {
                                  const current = [...prev[normalizedKey]];
                                  const [clicked] = current.splice(i, 1);
                                  current.unshift(clicked);
                                  return { ...prev, [normalizedKey]: current };
                                });
                              }}
                              title={
                                i === 0
                                  ? "Featured image"
                                  : "Click to make this the main image"
                              }
                            >
                              <img
                                src={img.preview}
                                alt={img.alt}
                                className="w-24 h-24 sm:w-28 sm:h-28 object-cover"
                              />

                              {img.loading && (
                                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                  <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                                </div>
                              )}

                              {i === 0 && (
                                <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-[1px] rounded">
                                  Featured
                                </div>
                              )}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setVariantImages((prev) => ({
                                    ...prev,
                                    [normalizedKey]: prev[normalizedKey].filter(
                                      (_, idx) => idx !== i
                                    ),
                                  }));
                                }}
                                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-100 transition"
                              >
                                <RxCross1 className="text-red-500 text-sm" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm italic">
                            No images assigned yet.
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {showGallery && galleryImages.length > 0 && (
                  <div className="mt-8 border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Gallery Images
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {galleryImages.map((file) => {
                        const parentValue =
                          combinations[currentVariant?.index]?.parent;
                        const combinationKey =
                          options.length === 1
                            ? currentVariant?.child
                            : `${parentValue} / ${currentVariant?.child}`;
                        const normalizedKey = combinationKey
                          .replace(/['"]/g, "")
                          .trim();

                        return (
                          <div
                            key={file.id || file.src}
                            className="border rounded-lg p-2 bg-white hover:border-blue-400 hover:shadow-md transition cursor-pointer relative"
                            onClick={() => {
                              setVariantImages((prev) => {
                                const existing = Array.isArray(
                                  prev[normalizedKey]
                                )
                                  ? [...prev[normalizedKey]]
                                  : [];
                                const newImage = {
                                  preview: file.src,
                                  alt: normalizedKey
                                    .replace(/\s*\/\s*/g, "-")
                                    .toLowerCase(),
                                  loading: true,
                                };

                                const updated = [newImage, ...existing];

                                setTimeout(() => {
                                  setVariantImages((prev2) => ({
                                    ...prev2,
                                    [normalizedKey]: prev2[normalizedKey].map(
                                      (img) =>
                                        img.preview === file.src
                                          ? { ...img, loading: false }
                                          : img
                                    ),
                                  }));
                                }, 1000);

                                return { ...prev, [normalizedKey]: updated };
                              });
                            }}
                          >
                            <img
                              src={file.src}
                              alt={file.name || "Image"}
                              className="w-full h-28 object-cover rounded-md"
                            />
                            <p className="text-xs text-center mt-1 truncate text-gray-700">
                              {file.name || "Image"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {showDeleteOptionModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Delete Option
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to delete the option{" "}
                <span className="font-semibold text-gray-800">
                  "{options[deleteOptionTarget]?.name}"
                </span>
                ? <br /> This will remove all its values and related variants.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteOptionModal(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const updated = [...options];
                    updated.splice(deleteOptionTarget, 1);
                    setOptions(updated);
                    setCombinations(generateVariants(updated));
                    setEditingOptionIndex(null);
                    setIsChanged(true);
                    setShowDeleteOptionModal(false);
                  }}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {isMediaModalVisible && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-2 sm:px-4">
            <div className="bg-white w-full max-w-6xl h-[90vh] sm:rounded-xl shadow-2xl flex flex-col overflow-hidden">
              <div className="sticky top-0 bg-white z-20 border-b flex justify-between items-center px-6 py-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Manage Product Media
                </h2>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMediaModalVisible(false)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium shadow-sm hover:bg-blue-700 active:scale-95 transition-transform duration-150"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => setIsMediaModalVisible(false)}
                    className="text-gray-500 hover:text-gray-700 transition"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="border-2 border-dashed rounded-lg h-40 flex flex-col justify-center items-center text-gray-500 bg-white shadow-sm transition hover:shadow-md">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMediaUpload}
                    className="hidden"
                    id="mediaFileUpload"
                  />

                  <div className="flex gap-4 flex-wrap justify-center">
                    <label
                      htmlFor="mediaFileUpload"
                      className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md cursor-pointer 
                         hover:bg-blue-700 active:scale-95 transition-transform duration-150"
                    >
                      Add New Images
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowGallery(true)}
                      className="px-6 py-2.5 bg-gray-600 text-white font-medium rounded-lg shadow-md cursor-pointer 
                         hover:bg-gray-700 active:scale-95 transition-transform duration-150"
                    >
                      Browse
                    </button>
                  </div>

                  <p className="text-sm mt-3 text-gray-500">
                    or drag & drop images here
                  </p>
                </div>

                <div className="mt-8 border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Product Images
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    {selectedImages.length > 0 ? (
                      selectedImages.map((img, i) => (
                        <div
                          key={i}
                          className="relative border border-gray-300 rounded-lg overflow-hidden group hover:shadow-md transition"
                        >
                          <img
                            src={img.cloudUrl || img.localUrl}
                            alt={`Image ${i}`}
                            className="w-24 h-24 sm:w-28 sm:h-28 object-cover"
                          />
                          {img.loading && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                              <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                            </div>
                          )}
                          <button
                            onClick={() => {
                              const updated = [...selectedImages];
                              updated.splice(i, 1);
                              setSelectedImages(updated);
                              setIsChanged(true);
                            }}
                            className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-100 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic text-sm">
                        No product images yet.
                      </p>
                    )}
                  </div>
                </div>

                {showGallery && galleryImages.length > 0 && (
                  <div className="mt-8 border border-gray-200 rounded-lg bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Gallery Images
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {galleryImages.map((file) => (
                        <div
                          key={file.id || file.src}
                          className="border rounded-lg p-2 bg-white hover:border-blue-400 hover:shadow-md transition cursor-pointer"
                          onClick={() => {
                            if (
                              !selectedImages.some(
                                (img) => img.cloudUrl === file.src
                              )
                            ) {
                              setSelectedImages((prev) => [
                                { cloudUrl: file.src, loading: false },
                                ...prev,
                              ]);
                              setIsChanged(true);
                            }
                          }}
                        >
                          <img
                            src={file.src}
                            alt={file.name || "Gallery Image"}
                            className="w-full h-28 object-cover rounded-md"
                          />
                          <p className="text-xs text-center mt-1 truncate text-gray-700">
                            {file.name || "Image"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CategorySelector;
