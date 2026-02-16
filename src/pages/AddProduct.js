import React, { useState, useEffect, useRef } from "react";
import { FaTrash, FaChevronDown, FaChevronUp, FaInfo } from "react-icons/fa";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdEdit, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiDeleteBin5Fill, RiDeleteBin6Line } from "react-icons/ri";
import RTC from "../component/editor";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { RxCross1 } from "react-icons/rx";
import { useParams } from "react-router-dom";

import {
  convertToRaw,
  EditorState,
  ContentState,
  convertFromRaw,
} from "draft-js";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { jwtDecode } from "jwt-decode";
import { useNotification } from "../context api/NotificationContext";
import { FiInfo } from "react-icons/fi";

const CategorySelector = () => {
  const { id } = useParams();
  const slides = [
    {
      title: "Uploading your product",
      desc: "We’re getting everything ready for your store.",
    },
    {
      title: "Saving product information",
      desc: "Title, description, vendor, and product structure are being processed.",
    },
    {
      title: "Configuring variants",
      desc: "Sizes, colors, options, and availability are being set up.",
    },
    {
      title: "Applying pricing & inventory",
      desc: "Prices, compare-at values, and stock levels are being assigned.",
    },
    {
      title: "Organizing your product",
      desc: "Tags, collections, and categories are being applied.",
    },
    {
      title: "Finalizing product setup",
      desc: "Making sure everything is correctly linked and ready to go.",
    },
    {
      title: "Almost there!",
      desc: "Just a few final checks before completion.",
    },
    {
      title: "Product uploaded successfully",
      desc: "Your product is now available in your store.",
    },
  ];

  const { addNotification } = useNotification();
  const [imagesChanged, setImagesChanged] = useState(false);

  const [variantImageModal, setVariantImageModal] = useState({
    open: false,
    variantKey: null,
  });
  const [slideIndex, setSlideIndex] = useState(0);
  const LAST_SLIDE_INDEX = slides.length - 1;
  const [variantsChanged, setVariantsChanged] = useState(false);

  const isEditing = Boolean(id);
  const [bulkUploading, setBulkUploading] = useState(false);

  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedBulkVariants, setSelectedBulkVariants] = useState([]);
  const [bulkUploadedImage, setBulkUploadedImage] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [bulkQuantity, setBulkQuantity] = useState("");
  const toggleBulkVariant = (key) => {
    setSelectedBulkVariants((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateMode, setDuplicateMode] = useState("copy");
  const [duplicateTitle, setDuplicateTitle] = useState("");
  const assignImageToSelectedVariants = (imageUrl, isLoading = false) => {
    if (selectedBulkVariants.length === 0) return;
    setVariantsChanged(true);

    setVariantImages((prev) => {
      const updated = { ...prev };

      selectedBulkVariants.forEach((key) => {
        const normalizedKey = key.replace(/['"]/g, "").trim();

        updated[normalizedKey] = [
          ...(updated[normalizedKey] || []),
          {
            preview: imageUrl,
            alt: normalizedKey.replace(/\s*\/\s*/g, "-").toLowerCase(),
            loading: isLoading,
          },
        ];
      });

      return updated;
    });
    setSelectedBulkVariants([]);

    setIsChanged(true);
  };

  const moveImageToFront = (fromIndex) => {
    if (fromIndex === 0) return;

    setSelectedImages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.unshift(moved);
      return updated;
    });

    setIsChanged(true);
  };
  const getVariantKey = (parent, child) => {
    return options.length === 1
      ? child
      : `${parent} / ${child}`.replace(/['"]/g, "").trim();
  };

  const handleBulkImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || selectedBulkVariants.length === 0) return;
    setImagesChanged(true);

    setBulkUploading(true);

    for (const file of files) {
      const tempPreview = URL.createObjectURL(file);

      assignImageToSelectedVariants(tempPreview, true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "images");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dt2fvngtp/image/upload",
          { method: "POST", body: formData },
        );

        const data = await res.json();

        if (data.secure_url) {
          setVariantImages((prev) => {
            const updated = { ...prev };

            selectedBulkVariants.forEach((key) => {
              const normalizedKey = key.replace(/['"]/g, "").trim();

              updated[normalizedKey] = updated[normalizedKey].map((img) =>
                img.preview === tempPreview
                  ? {
                      ...img,
                      preview: data.secure_url,
                      loading: false,
                    }
                  : img,
              );
            });

            return updated;
          });
          setSelectedBulkVariants([]);
        }
      } catch (err) {
        console.error("Bulk upload failed:", err);
      }
    }

    setBulkUploading(false);
    e.target.value = "";
  };

  const applyBulkImage = () => {
    if (!bulkUploadedImage || selectedBulkVariants.length === 0) return;

    assignImageToSelectedVariants(bulkUploadedImage);
    setShowBulkUploadModal(false); // optional
  };

  const handleDiscard = () => {
    if (isChanged) {
      const confirmDiscard = window.confirm(
        "Are you sure? All unsaved changes will be lost.",
      );
      if (!confirmDiscard) return;
    }

    // 🔄 Reset all form states
    setTitle("");
    setEditorState(EditorState.createEmpty());
    setDescription("");

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
    setCombinations([]);

    setSelectedImages([]);
    setVariantImages({});
    setGalleryImages([]);

    setSelectedVisibleCategories([]);
    setFinalCategoryPayload([]);
    setKeywordsList([]);

    setEnableShippingPlans(false);
    setEnableFreeShipping(false);
    setSelectedShippingPlan("");

    setEnableSizeChart(false);
    setSelectedSizeChart("");
    setChartData({ image: "", loading: false });

    setEnableMetafields(false);
    setMetafields([{ label: "", value: "" }]);

    setStatus("draft");
    setVendor("");
    setProductType("");

    setIsChanged(false);
  };

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };
  const [optionMode, setOptionMode] = useState("any");
  const [dbOptions, setDbOptions] = useState([]);
  const [matchedOptionValues, setMatchedOptionValues] = useState([]);
  const [enableShippingPlans, setEnableShippingPlans] = useState(false);
  const [enableFreeShipping, setEnableFreeShipping] = useState(false);
  const [enableSizeChart, setEnableSizeChart] = useState(false);
  const [sizeCharts, setSizeCharts] = useState([]);
  const [selectedSizeChart, setSelectedSizeChart] = useState("");
  const [shippingPlans, setShippingPlans] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkCompareAtPrice, setBulkCompareAtPrice] = useState("");
  const [chartData, setChartData] = useState({
    image: "",
    loading: false,
  });

  const isFetched = useRef(false);

  useEffect(() => {
    const fetchSizeCharts = async () => {
      try {
        const token = localStorage.getItem("usertoken");
        const userId = localStorage.getItem("userid");

        if (!token) return;

        const decoded = jwtDecode(token);
        const role = decoded?.payLoad?.role;

        let url = "";

        if (role === "Dev Admin" || role === "Master Admin") {
          url = "https://multi-vendor-marketplace.vercel.app/size-chart/all";
        } else {
          if (!userId) return;
          url = `https://multi-vendor-marketplace.vercel.app/size-chart/all/${userId}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (Array.isArray(data.data)) {
          setSizeCharts(data.data);
        }
      } catch (err) {
        console.error("Error loading size charts:", err);
      }
    };

    fetchSizeCharts();
  }, []);

  useEffect(() => {
    const fetchShippingProfiles = async () => {
      if (isFetched.current) return;
      isFetched.current = true;

      try {
        const apiKey = localStorage.getItem("apiKey");
        const apiSecretKey = localStorage.getItem("apiSecretKey");
        const userId = localStorage.getItem("userid");

        if (!userId) {
          console.error("❌ Missing userId in localStorage");
          return;
        }

        console.log("👤 Fetching active shipping profiles for user:", userId);

        const res = await fetch(
          `https://multi-vendor-marketplace.vercel.app/shippingProfile/${userId}`,
          {
            method: "GET",
            headers: {
              "x-api-key": apiKey,
              "x-api-secret": apiSecretKey,
              "Content-Type": "application/json",
            },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch user active profiles");

        const data = await res.json();

        if (Array.isArray(data)) {
          setShippingPlans(data);
        } else {
          setShippingPlans([]);
        }
      } catch (err) {
        console.error("Error fetching user active shipping profiles:", err);
      }
    };

    fetchShippingProfiles();
  }, []);

  useEffect(() => {
    const fetchDbOptions = async () => {
      try {
        const res = await fetch(
          "https://multi-vendor-marketplace.vercel.app/variantOption/getOptions",
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
  // console.log("product data",product)
  const [editing, setEditing] = useState(false);
  const [mongooseProductId, setMongooseProductId] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [productType, setProductType] = useState([]);
  const [seoHandle, setSeoHandle] = useState(`${product?.title || ""} `);
  const [isChanged, setIsChanged] = useState(false);
  const [popupMode, setPopupMode] = useState("variant");
  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

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
  // const [isEditing, setIsEditing] = useState(false);
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
    stripHtml(product?.body_html || ""),
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
  const [selectedOptionName, setSelectedOptionName] = useState("");
  const [isCustomOption, setIsCustomOption] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  const [selectedShippingPlan, setSelectedShippingPlan] = useState("");
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev < LAST_SLIDE_INDEX ? prev + 1 : prev));
    }, 2500);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const userId = localStorage.getItem("userid");
        const apiKey = localStorage.getItem("apiKey");
        const apiSecretKey = localStorage.getItem("apiSecretKey");

        if (!userId) return;

        const res = await fetch(
          `https://multi-vendor-marketplace.vercel.app/auth/getUserWithModules
/${userId}`,
          {
            method: "GET",
            headers: {
              "x-api-key": apiKey,
              "x-api-secret": apiSecretKey,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await res.json();

        if (res.ok) {
          const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;
        }
      } catch (error) {
        console.error("Error fetching vendor:", error);
      }
    };

    fetchVendor();
  }, []);

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
        : [...prev, parentIndex],
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
          "https://multi-vendor-marketplace.vercel.app/category/getCategoryForProduct",
          {
            method: "GET",
            headers: {
              "x-api-key": apiKey,
              "x-api-secret": apiSecretKey,
              "Content-Type": "application/json",
            },
          },
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
    [],
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
  const normalizeLevel = (level) => level.replace(" ", "").toLowerCase();

  const buildCategoryPath = (cat) => {
    if (!cat) return "";

    const level = normalizeLevel(cat.level);

    if (level === "level1") {
      return cat.title;
    }

    if (level === "level2") {
      const parent = categories.find((c) => c.catNo === cat.parentCatNo);
      return `${parent?.title} > ${cat.title}`;
    }

    if (level === "level3") {
      const level2 = categories.find((c) => c.catNo === cat.parentCatNo);
      const level1 = categories.find((c) => c.catNo === level2?.parentCatNo);

      return `${level1?.title} > ${level2?.title} > ${cat.title}`;
    }

    return cat.title;
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
        prev < filteredCategories.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCategories.length - 1,
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      handleCategorySelect(filteredCategories[highlightIndex]);
    }
  };

  const handleCategorySelect = (cat) => {
    const level = normalizeLevel(cat.level);

    let hierarchy = [];

    if (level === "level1") {
      hierarchy = [cat];
    } else if (level === "level2") {
      const parent = categories.find((c) => c.catNo === cat.parentCatNo);
      hierarchy = [parent, cat];
    } else if (level === "level3") {
      const parent2 = categories.find((c) => c.catNo === cat.parentCatNo);
      const parent1 = categories.find((c) => c.catNo === parent2?.parentCatNo);
      hierarchy = [parent1, parent2, cat];
    }

    setSelectedVisibleCategories(hierarchy.map((c) => c.catNo));

    setFinalCategoryPayload(
      hierarchy.map((c) => ({
        catNo: c.catNo,
        title: buildCategoryPath(c),
      })),
    );

    setSelectedExportTitle(buildCategoryPath(cat));

    setSearchTerm("");
    setFilteredCategories([]);
  };

  const removeCategory = (catNoToRemove) => {
    setSelectedVisibleCategories((prev) =>
      prev.filter((catNo) => catNo !== catNoToRemove),
    );
    setSelectedCategories((prev) =>
      prev.filter((catNo) => catNo !== catNoToRemove),
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

  const toggleImageSelection = (index) => {
    setCheckedImages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
    setIsChanged(true);
  };
  const handleRemoveSelected = () => {
    const removedUrls = selectedImages
      .filter((_, index) => checkedImages[index])
      .map((img) => img.cloudUrl || img.localUrl)
      .filter(Boolean);

    const filteredMedia = selectedImages.filter(
      (_, index) => !checkedImages[index],
    );
    setSelectedImages(filteredMedia);

    setVariantImages((prev) => {
      const updated = {};

      Object.entries(prev).forEach(([variantKey, images]) => {
        const remainingImages = images.filter(
          (img) => !removedUrls.includes(img.preview || img.src),
        );

        if (remainingImages.length > 0) {
          updated[variantKey] = remainingImages;
        }
      });

      return updated;
    });

    setCheckedImages({});
    setIsChanged(true);

    console.log("🧹 Bulk removed images (media + variants):", removedUrls);
  };

  const handleDeleteCombination = (parentIndex, childIndex) => {
    setCombinations((prevCombinations) => {
      const updatedCombinations = prevCombinations.map((comb) => ({
        parent: comb.parent,
        children: [...comb.children],
      }));
      setVariantsChanged(true);

      const parentObj = updatedCombinations[parentIndex];
      if (!parentObj) return prevCombinations;

      const deletedChild = parentObj.children[childIndex];
      if (!deletedChild) return prevCombinations;

      parentObj.children.splice(childIndex, 1);

      const nextCombinations = parentObj.children.length
        ? updatedCombinations
        : updatedCombinations.filter((_, i) => i !== parentIndex);

      const pureChildValue = deletedChild.split("/").pop().trim().toLowerCase();

      setOptions((prevOptions) => {
        let updatedOptions = prevOptions.map((opt) => ({
          ...opt,
          values: opt.values.filter(
            (val) => val.trim().toLowerCase() !== pureChildValue,
          ),
        }));
        updatedOptions = updatedOptions.filter((opt) => opt.values.length > 0);
        return [...updatedOptions];
      });

      return [...nextCombinations];
    });
  };

  const generateVariants = () => {
    if (!options || options.length === 0) return [];

    const validOptions = options.filter(
      (opt) => opt.values && opt.values.some((val) => val.trim() !== ""),
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
  const regenerateVariants = (opts) => {
    const validOptions = opts
      .map((opt) => ({
        ...opt,
        values: opt.values.filter((v) => v.trim() !== ""),
      }))
      .filter((opt) => opt.values.length > 0);

    console.log(" Generating variants from:", validOptions);

    if (validOptions.length === 0) {
      setVariants([]);
      return;
    }

    const cartesian = (arr) =>
      arr.reduce(
        (a, b) => a.flatMap((x) => b.values.map((y) => [...x, y])),
        [[]],
      );

    const combos = cartesian(validOptions);

    const newVariants = combos.map((combo) => ({
      options: combo.map((value, i) => ({
        name: validOptions[i].name,
        value,
      })),
    }));

    setVariants(newVariants);
  };

  const [combinations, setCombinations] = useState(generateVariants());
  useEffect(() => {
    setCombinations(generateVariants());
  }, [options]);
  const handleRemoveOptionValue = (optionIndex, valueIndex) => {
    const valueToRemove = newOption.values[valueIndex];

    console.log("🗑️ Removing option value:", valueToRemove);

    const updatedValues = newOption.values.filter((_, i) => i !== valueIndex);

    setNewOption((prev) => ({
      ...prev,
      values: updatedValues,
    }));
    setVariantsChanged(true);

    setVariants((prevVariants) => {
      const filtered = prevVariants.filter(
        (variant) =>
          !variant.options?.some(
            (opt) =>
              opt.name === newOption.name &&
              opt.value?.toLowerCase() === valueToRemove.toLowerCase(),
          ),
      );

      console.log(
        ` Variants removed for value "${valueToRemove}":`,
        prevVariants.length - filtered.length,
      );

      return filtered;
    });
  };

  const handleOpenForm = () => {
    if (options.length >= 3) {
      showToast("error", "You can only add up to 3 option names.");
      return;
    }
    setNewOption({ name: "", values: [""] });
    setShowVariantForm(true);
  };

  const handleNewOptionNameChange = (value) => {
    setNewOption({ ...newOption, name: value });

    const found = dbOptions.find((opt) =>
      opt.optionName.some(
        (name) => name.toLowerCase().trim() === value.toLowerCase().trim(),
      ),
    );

    if (found) {
      setMatchedOptionValues(found.optionValues || []);
    } else {
      setMatchedOptionValues([]);
    }
  };

  const handleNewOptionValueChange = (index, value) => {
    const trimmedValue = value.trim();

    const isDuplicate = newOption.values.some(
      (v, i) =>
        i !== index && v.trim().toLowerCase() === trimmedValue.toLowerCase(),
    );

    if (isDuplicate) {
      showToast("error", "This value already exists in this option.");
      return;
    }

    let updatedValues = [...newOption.values];
    updatedValues[index] = value;
    setNewOption({ ...newOption, values: updatedValues });
  };

  const handleAddNewValue = () => {
    setNewOption({ ...newOption, values: [...newOption.values, ""] });
    setVariantsChanged(true);
  };

  const handleDeleteNewValue = (index) => {
    let updatedValues = newOption.values.filter((_, i) => i !== index);
    setNewOption({ ...newOption, values: updatedValues });
    setVariantsChanged(true);
  };

  const handleDone = () => {
    const hasValidValues = newOption.values.some((val) => val.trim() !== "");
    if (newOption.name.trim() === "" || !hasValidValues) {
      alert("Please enter at least one value before saving the option.");
      return;
    }

    const cleanedValues = newOption.values.filter((val) => val.trim() !== "");

    const existingOptionIndex = options.findIndex(
      (opt) =>
        opt.name.toLowerCase().trim() === newOption.name.toLowerCase().trim(),
    );

    let updatedOptions;

    if (existingOptionIndex !== -1) {
      const existingOption = options[existingOptionIndex];
      const mergedValues = Array.from(
        new Set([...existingOption.values, ...cleanedValues]),
      );

      updatedOptions = options.map((opt, i) =>
        i === existingOptionIndex ? { ...opt, values: mergedValues } : opt,
      );
    } else {
      updatedOptions = [...options, { ...newOption, values: cleanedValues }];
    }

    setOptions(updatedOptions);
    setShowVariantForm(false);
    setNewOption({ name: "", values: [""] });
    setIsChanged(true);
    setVariantsChanged(true);
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
            0,
          );
          const totalQuantity = variant.subVariants.reduce(
            (sum, v) => sum + Number(v.quantity || 0),
            0,
          );
          return { ...variant, price: totalPrice, quantity: totalQuantity };
        }
        return variant;
      }),
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
            title.trim().toLowerCase(),
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
        (title) => title.trim().toLowerCase() === tag.trim().toLowerCase(),
      );
    });

    setKeywordsList(tagsArray);
  }, [product, categories]);

  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userid");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    const productId = product?.id || "null";

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
        },
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("📸 Gallery data fetched:", data);
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

      const formattedVariants = Object.keys(groupedVariants).map(
        (key, index) => ({
          ...groupedVariants[key].parent,
          group: `parent-${index}`,
          subVariants: groupedVariants[key].children,
        }),
      );

      // const hydratedVariantImages = {};

      // product.variants.forEach((variant, idx) => {
      //   const titleKey = normalizeString(variant.title || "");
      //   let matchedImages = [];

      //   if (product.variantImages?.length) {
      //     matchedImages = product.variantImages.filter((img) => {
      //       const alt = normalizeString(img.alt || "").toLowerCase();
      //       return (
      //         alt.includes(titleKey.toLowerCase()) ||
      //         alt.includes(titleKey.replace(/\s*\/\s*/g, "-").toLowerCase())
      //       );
      //     });
      //   }

      //   if (!matchedImages.length && variant.image_id) {
      //     const found = product.images?.find(
      //       (img) => String(img.id) === String(variant.image_id),
      //     );
      //     if (found) matchedImages = [found];
      //   }

      //   // if (!matchedImages.length && product.images?.length > 0) {
      //   //   matchedImages = [product.images[0]];
      //   // }

      //   const combinationAlt = titleKey
      //     .replace(/\s*\/\s*/g, "-")
      //     .replace(/\s+/g, "-")
      //     .toLowerCase();

      //   hydratedVariantImages[titleKey] = matchedImages.map((img) => ({
      //     preview: img.src,
      //     alt: combinationAlt,
      //     loading: false,
      //   }));
      // });
      const hydratedVariantImages = {};

      product.variantImages?.forEach((variantBlock) => {
        const variantId = variantBlock.variantId;
        const images = variantBlock.images || [];

        const variant = product.variants.find(
          (v) => String(v.id) === String(variantId),
        );

        if (!variant || !images.length) return;

        const titleKey = normalizeString(variant.title || "");

        hydratedVariantImages[titleKey] = images.map((img) => ({
          preview: img.src,
          alt: img.alt || titleKey.replace(/\s*\/\s*/g, "-").toLowerCase(),
          loading: false,
        }));
      });
      if (product.variantImages?.length) {
        const isGrouped = product.variantImages.some((variantBlock) =>
          variantBlock.images?.some(
            (img) =>
              typeof img.alt === "string" && img.alt.startsWith("t4option"),
          ),
        );

        setGroupImages(isGrouped);
      }

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
          ]),
        );

        setVariantImages(normalizedVariantImages);
      } else {
        console.log(
          " No variant images found, and no fallback images available.",
        );
      }

      // setIsEditing(true);
      setTitle(product.title || "");
      setPrice(product.variants[0]?.price || "");
      setCompareAtPrice(product.variants[0]?.compare_at_price || "");
      setTrackQuantity(product.inventory?.track_quantity || false);
      setQuantity(product.inventory?.quantity || 0);
      setContinueSelling(product.inventory?.continue_selling || false);
      setHasSKU(product.inventory?.has_sku || false);
      setSKU(product.inventory?.sku || "");
      // ✅ SEO STATES SET
      setSeoTitle(product?.seo?.title || product.title || "");
      setSeoDescription(
        product?.seo?.description || stripHtml(product.body_html || ""),
      );
      setSeoHandle(product?.seo?.handle || "");
      setBarcode(product.inventory?.barcode || "");
      setTrackShipping(product.shipping?.track_shipping || false);
      setWeight(product.shipping?.weight || "");
      setUnit(product.shipping?.weight_unit || "kg");
      setStatus(product.status || "publish");
      setUserId(product.userId || "");
      if (product.shipping) {
        const { freeShipping = false, profile = null } = product.shipping;

        if (freeShipping) {
          setEnableFreeShipping(true);
          setEnableShippingPlans(false);
          setSelectedShippingPlan("");
        } else if (profile && profile.profileId) {
          setEnableShippingPlans(true);
          setEnableFreeShipping(false);
          setSelectedShippingPlan(profile.profileId);
        } else {
          setEnableFreeShipping(false);
          setEnableShippingPlans(false);
          setSelectedShippingPlan("");
        }
      } else {
        setEnableFreeShipping(false);
        setEnableShippingPlans(false);
        setSelectedShippingPlan("");
      }

      if (product.metafields && product.metafields.length > 0) {
        setEnableMetafields(true);

        const validMetafields = product.metafields.filter(
          (m) => m.label?.trim() !== "" || m.value?.trim() !== "",
        );

        const limitedMetafields = validMetafields.slice(0, 4);

        setMetafields(
          limitedMetafields.length > 0
            ? limitedMetafields
            : [{ label: "", value: "" }],
        );
      } else {
        setEnableMetafields(false);
        setMetafields([{ label: "", value: "" }]);
      }
      if (product.custom?.size_chart_id) {
        setEnableSizeChart(true);
        setSelectedSizeChart(product.custom.size_chart_id);

        setChartData({
          image: product.custom.size_chart,
          loading: false,
        });
      } else {
        setEnableSizeChart(false);
        setSelectedSizeChart("");
        setChartData({
          image: "",
          loading: false,
        });
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
        product.options?.map((option) => {
          const normalizedName = option.name?.toLowerCase().trim();

          const dbMatch = dbOptions.find((db) =>
            db.optionName.some(
              (n) => n.toLowerCase().trim() === normalizedName,
            ),
          );

          return {
            id: option.id,
            name: option.name,
            values: option.values || [],

            isFromDB: !!dbMatch,

            dbValues: dbMatch?.optionValues || [],

            isCustom: option.name === "Other",
          };
        }) || [],
      );

      setVariants(formattedVariants);
      setVariantPrices(product.variants.map((v) => v.price || ""));
      setVariantQuantities(
        product.variants.map((v) => v.inventory_quantity || 0),
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
            contentBlock.contentBlocks,
          );
          setEditorState(EditorState.createWithContent(contentState));
        } else {
          setEditorState(EditorState.createEmpty());
        }
      }
    }
  }, [product]);
  useEffect(() => {
    if (selectedImages.length === 0) {
      const firstVariantImage = Object.values(variantImages || {})
        .flat()
        .find((img) => img?.preview || img?.src);

      if (firstVariantImage) {
        setSelectedImages([
          {
            cloudUrl: firstVariantImage.preview || firstVariantImage.src,
            loading: false,
            fromVariant: true,
          },
        ]);
      }
    }
  }, [variantImages, selectedImages.length]);

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
          },
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
            },
          );

          setVariantImages((prev) => ({
            ...prev,
            [normalizedKey]: prev[normalizedKey].map((img) =>
              img.preview === previews[index].preview
                ? { ...img, preview: data.secure_url, loading: false }
                : img,
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
            (img) => img.preview !== previews[index].preview,
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
    setImagesChanged(true);

    await Promise.all(
      newPreviews.map(async (preview) => {
        const formData = new FormData();
        formData.append("file", preview.file);
        formData.append("upload_preset", "images");

        try {
          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dt2fvngtp/image/upload",
            { method: "POST", body: formData },
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
              },
            );

            setSelectedImages((prev) =>
              prev.map((img) =>
                img.id === preview.id
                  ? { ...img, cloudUrl: data.secure_url, loading: false }
                  : img,
              ),
            );
          }
        } catch (error) {
          console.error(" Media upload failed:", error);
          showToast("error", "Media upload failed");

          setSelectedImages((prev) =>
            prev.map((img) =>
              img.id === preview.id ? { ...img, loading: false } : img,
            ),
          );
        }
      }),
    );

    event.target.value = "";
  };

  const isValidImageUrl = (url) => {
    if (!url || typeof url !== "string") return false;

    // ❌ reject blob & base64
    if (url.startsWith("blob:")) return false;
    if (url.startsWith("data:")) return false;

    // ✅ allow only http(s)
    return url.startsWith("http://") || url.startsWith("https://");
  };

  const uploadImagesInBackground = async ({
    productId,
    apiKey,
    apiSecretKey,
    mediaImageUrls,
    uploadedVariantImages,
    groupImages,
    addNotification,
    productTitle,
  }) => {
    try {
      addNotification(
        `Image upload started for "${productTitle}"`,
        "/manage-product",
      );

      const res = await fetch(
        `https://multi-vendor-marketplace.vercel.app/product/updateImages/${productId}`,
        {
          method: "PUT",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            images: mediaImageUrls,
            variantImages: uploadedVariantImages,
            groupImages,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.errors?.image?.[0] || data?.error || "Invalid image URLs",
        );
      }

      addNotification(
        `Images uploaded successfully for "${productTitle}"`,
        "/manage-product",
      );
      setImagesChanged(false);
    } catch (err) {
      console.error("❌ Background image upload failed", err);

      sessionStorage.setItem(
        "imageUploadError",
        JSON.stringify({
          message: err.message || "Images upload failed due to invalid URLs",
          productTitle,
          productId,
        }),
      );

      addNotification(
        `Image upload failed for "${productTitle}"`,
        "/manage-product",
      );
    } finally {
      sessionStorage.removeItem("imageUploadInProgress");

      window.dispatchEvent(
        new CustomEvent("image-upload-finished", {
          detail: { productId },
        }),
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userid");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");

    if (!userId) {
      setMessage({ type: "error", text: "User ID missing" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const rawContentState = convertToRaw(editorState.getCurrentContent());
      const htmlContent = draftToHtml(rawContentState);
      const description = htmlContent
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "<br />")
        .replace(/<br\s*\/?>\s*<br\s*\/?>/g, "<br />")
        .replace(/&nbsp;/g, " ");

      const payload = {
        keyWord: [
          ...finalCategoryPayload.map((c) => c.catNo),
          ...keywordsList,
        ].join(", "),
        title,
        description,
        productType,
        price: Number(price),
        compare_at_price: compareAtPrice ? Number(compareAtPrice) : undefined,
        track_quantity: trackQuantity,
        quantity: trackQuantity ? Number(quantity) : 0,
        continue_selling: continueSelling,
        has_sku: hasSKU,
        sku: hasSKU ? sku : undefined,
        barcode: hasSKU ? barcode : undefined,
        track_shipping: trackShipping,
        weight: trackShipping ? Number(weight) : undefined,
        weight_unit: trackShipping ? unit : undefined,
        status,
        userId: isEditing ? product?.userId : userId,
        vendor,
        seoTitle,
        seoDescription,
        seoHandle,
        options,
        variants,
        categories: finalCategoryPayload.map((c) => c.title),
      };

      if (enableMetafields) {
        payload.metafields = metafields.filter(
          (m) => m.label.trim() && m.value.trim(),
        );
      }

      const productRes = await fetch(
        isEditing
          ? `https://multi-vendor-marketplace.vercel.app/product/updateProducts/${mongooseProductId}`
          : `https://multi-vendor-marketplace.vercel.app/product/createProduct`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const productData = await productRes.json();
      if (!productRes.ok) throw new Error(productData.error);

      const productId = productData.product.id;
      const shopifyVariants = productData.product.variants;

      // for (const v of shopifyVariants) {
      //   await fetch(
      //     `https://multi-vendor-marketplace.vercel.app/product/updateVariant/${productId}/${v.id}`,
      //     {
      //       method: "PUT",
      //       headers: {
      //         Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
      //         "x-api-key": apiKey,
      //         "x-api-secret": apiSecretKey,
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({ variant: v }),
      //     },
      //   );
      // }

      // const mediaImageUrls = selectedImages
      //   .map((img) => img.cloudUrl || img.localUrl)
      //   .filter(Boolean);

      const shouldUpdateVariants = !isEditing || variantsChanged;
      if (shouldUpdateVariants) {
        for (let i = 0; i < shopifyVariants.length; i++) {
          const v = shopifyVariants[i];
          const shopifyTitle = v.title;

          let matchedQuantity;
          let matchedPrice;
          let matchedCompare;

          combinations.forEach((combo, parentIndex) => {
            combo.children.forEach((child) => {
              const combinationString =
                options.length === 1 ? child : `${combo.parent} / ${child}`;

              const normalizedKey = combinationString
                .replace(/['"]/g, "")
                .trim();

              if (normalizedKey === shopifyTitle) {
                const key = `${parentIndex}-${child}`;

                matchedQuantity = variantQuantities?.[key];
                matchedPrice = variantPrices?.[key];
                matchedCompare = variantCompareAtPrices?.[key];
              }
            });
          });

          // 🔥 FINAL FALLBACK SYSTEM

          const finalQuantity =
            matchedQuantity !== undefined && matchedQuantity !== ""
              ? Number(matchedQuantity)
              : quantity !== undefined && quantity !== ""
                ? Number(quantity)
                : 0;

          const finalPrice =
            matchedPrice !== undefined && matchedPrice !== ""
              ? Number(matchedPrice)
              : price !== undefined && price !== ""
                ? Number(price)
                : 0;

          const finalCompare =
            matchedCompare !== undefined && matchedCompare !== ""
              ? Number(matchedCompare)
              : compareAtPrice !== undefined && compareAtPrice !== ""
                ? Number(compareAtPrice)
                : 0;

          await fetch(
            `https://multi-vendor-marketplace.vercel.app/product/updateVariant/${productId}/${v.id}`,
            {
              method: "PUT",
              headers: {
                "x-api-key": apiKey,
                "x-api-secret": apiSecretKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                variant: {
                  price: finalPrice,
                  compare_at_price: finalCompare,
                  inventory_quantity: finalQuantity,
                },
              }),
            },
          );
        }
        setVariantsChanged(false);
      }

      const mediaImageUrls = selectedImages
        .map((img) => img.cloudUrl || img.localUrl)
        .filter(isValidImageUrl);

      const variantImageMap = {};

      Object.entries(variantImages).forEach(([variantKey, images]) => {
        if (!Array.isArray(images)) return;

        const variant = shopifyVariants.find(
          (v) =>
            v.title.replace(/['"]/g, "").trim().toLowerCase() ===
            variantKey.replace(/['"]/g, "").trim().toLowerCase(),
        );

        if (!variant?.id) return;

        images.forEach((img) => {
          const url = img.preview || img.src;
          if (!url) return;

          if (!variantImageMap[url]) variantImageMap[url] = [];
          variantImageMap[url].push(variant.id);
        });
      });

      const uploadedVariantImages = Object.entries(variantImageMap).map(
        ([url, variantIds]) => ({ url, variantIds }),
      );

      setMessage({
        type: "success",
        text: isEditing
          ? "Product updated successfully!"
          : "Product created successfully!",
      });
      setSlideIndex(LAST_SLIDE_INDEX);

      const shouldUploadImages = !isEditing || imagesChanged;

      sessionStorage.setItem(
        "imageUploadInProgress",
        JSON.stringify({
          productId,
          productTitle: title,
          status: shouldUploadImages ? "uploading" : "skipped",
          time: Date.now(),
        }),
      );

      navigate("/manage-product");
      sessionStorage.setItem(
        "productRefreshRequired",
        JSON.stringify({
          productId,
          time: Date.now(),
        }),
      );
      if (shouldUploadImages) {
        uploadImagesInBackground({
          productId,
          apiKey,
          apiSecretKey,
          mediaImageUrls,
          uploadedVariantImages,
          groupImages,
          addNotification,
          productTitle: title,
        });
      } else {
        sessionStorage.removeItem("imageUploadInProgress");

        window.dispatchEvent(
          new CustomEvent("image-upload-finished", {
            detail: { productId },
          }),
        );
      }

      // uploadImagesInBackground({
      //   productId,
      //   apiKey,
      //   apiSecretKey,
      //   mediaImageUrls,
      //   uploadedVariantImages,
      //   groupImages,
      //   addNotification,
      //   productTitle: title,
      // });
    } catch (err) {
      console.error("❌ handleSubmit error:", err);
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const userId = localStorage.getItem("userid");
  //   const apiKey = localStorage.getItem("apiKey");
  //   const apiSecretKey = localStorage.getItem("apiSecretKey");

  //   if (!userId) {
  //     setMessage({ type: "error", text: "User ID missing" });
  //     return;
  //   }

  //   setLoading(true);
  //   setMessage(null);

  //   try {

  //     const rawContentState = convertToRaw(editorState.getCurrentContent());
  //     const htmlContent = draftToHtml(rawContentState);
  //     const description = htmlContent
  //       .replace(/<p>/g, "")
  //       .replace(/<\/p>/g, "<br />")
  //       .replace(/<br\s*\/?>\s*<br\s*\/?>/g, "<br />")
  //       .replace(/&nbsp;/g, " ");

  //     const payload = {
  //       keyWord: [
  //         ...finalCategoryPayload.map((c) => c.catNo),
  //         ...keywordsList,
  //       ].join(", "),
  //       title,
  //       description,
  //       productType,
  //       price: Number(price),
  //       compare_at_price: compareAtPrice ? Number(compareAtPrice) : undefined,
  //       track_quantity: trackQuantity,
  //       quantity: trackQuantity ? Number(quantity) : 0,
  //       continue_selling: continueSelling,
  //       has_sku: hasSKU,
  //       sku: hasSKU ? sku : undefined,
  //       barcode: hasSKU ? barcode : undefined,
  //       track_shipping: trackShipping,
  //       weight: trackShipping ? Number(weight) : undefined,
  //       weight_unit: trackShipping ? unit : undefined,
  //       status,
  //       userId: isEditing ? product?.userId : userId,
  //       vendor,
  //       seoTitle,
  //       seoDescription,
  //       seoHandle,
  //       options,
  //       variants,
  //       categories: finalCategoryPayload.map((c) => c.title),
  //     };

  //     if (enableMetafields) {
  //       payload.metafields = metafields.filter(
  //         (m) => m.label.trim() && m.value.trim(),
  //       );
  //     }

  //     const productRes = await fetch(
  //       isEditing
  //         ? `https://multi-vendor-marketplace.vercel.app/product/updateProducts/${mongooseProductId}`
  //         : `https://multi-vendor-marketplace.vercel.app/product/createProduct`,
  //       {
  //         method: isEditing ? "PATCH" : "POST",
  //         headers: {
  //           "x-api-key": apiKey,
  //           "x-api-secret": apiSecretKey,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       },
  //     );

  //     const productData = await productRes.json();
  //     if (!productRes.ok) throw new Error(productData.error);

  //     const productId = productData.product.id;
  //     const shopifyVariants = productData.product.variants;

  //     for (const v of shopifyVariants) {
  //       await fetch(
  //         `https://multi-vendor-marketplace.vercel.app/product/updateVariant/${productId}/${v.id}`,
  //         {
  //           method: "PUT",
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
  //             "x-api-key": apiKey,
  //             "x-api-secret": apiSecretKey,
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ variant: v }),
  //         },
  //       );
  //     }

  //     const mediaImageUrls = selectedImages
  //       .map((img) => img.cloudUrl || img.localUrl)
  //       .filter(Boolean);

  //     const variantImageMap = {};

  //     Object.entries(variantImages).forEach(([variantKey, images]) => {
  //       if (!Array.isArray(images)) return;

  //       const variant = shopifyVariants.find(
  //         (v) =>
  //           v.title.replace(/['"]/g, "").trim().toLowerCase() ===
  //           variantKey.replace(/['"]/g, "").trim().toLowerCase(),
  //       );

  //       if (!variant?.id) return;

  //       images.forEach((img) => {
  //         const url = img.preview || img.src;
  //         if (!url) return;

  //         if (!variantImageMap[url]) variantImageMap[url] = [];
  //         variantImageMap[url].push(variant.id);
  //       });
  //     });

  //     const uploadedVariantImages = Object.entries(variantImageMap).map(
  //       ([url, variantIds]) => ({ url, variantIds }),
  //     );

  //     const usedVariantUrls = new Set(uploadedVariantImages.map((v) => v.url));
  //     // const finalProductImages = mediaImageUrls.filter(
  //     //   (url) => !usedVariantUrls.has(url),
  //     // );

  //     /* =======================
  //      7. UPDATE IMAGES API
  //   ======================= */
  //     const imageRes = await fetch(
  //       `https://multi-vendor-marketplace.vercel.app/product/updateImages/${productId}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "x-api-key": apiKey,
  //           "x-api-secret": apiSecretKey,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           images: mediaImageUrls   ,
  //           variantImages: uploadedVariantImages,
  //           groupImages,
  //         }),
  //       },
  //     );

  //     const imageJson = await imageRes.json();
  //     if (!imageRes.ok) throw new Error(imageJson.error);

  //     /* =======================
  //      8. SUCCESS
  //   ======================= */
  //     setMessage({
  //       type: "success",
  //       text: isEditing
  //         ? "Product updated successfully!"
  //         : "Product created successfully!",
  //     });

  //     navigate("/manage-product");
  //   } catch (err) {
  //     console.error("❌ handleSubmit error:", err);
  //     setMessage({ type: "error", text: err.message });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  const handleDuplicate = async (newTitle) => {
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
          body: JSON.stringify({
            title: newTitle, // ✅ CORRECT PLACE
          }),
        },
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
      // if (response.ok) {
      //   setMessage({
      //     type: "success",
      //     // text: "Product duplicated successfully!",
      //   });

      //   const duplicatedProduct = data.product;
      //   const duplicatedProductId =
      //     duplicatedProduct.id || duplicatedProduct.shopifyId;

      //   /* ================= IMAGE LOGIC (SAME AS ADD / UPDATE) ================= */

      //   // 🔹 1. Collect all variant image URLs
      //   const usedVariantImageUrls = new Set();

      //   Object.values(variantImages).forEach((imgs) => {
      //     if (Array.isArray(imgs)) {
      //       imgs.forEach((img) => {
      //         if (img.preview) {
      //           usedVariantImageUrls.add(img.preview);
      //         }
      //       });
      //     }
      //   });

      //   // 🔹 2. Collect product images
      //   const mediaImageUrls = selectedImages
      //     .filter((img) => img.cloudUrl)
      //     .map((img) => img.cloudUrl);

      //   // 🔹 3. Remove variant-used images from product images
      //   const finalProductImages = mediaImageUrls.filter(
      //     (url) => !usedVariantImageUrls.has(url),
      //   );

      //   // 🔹 4. Prepare variant images payload (Shopify compatible)
      //   const uploadedVariantImages = Object.entries(variantImages).flatMap(
      //     ([key, images]) => {
      //       const parts = key.split("/").map((p) => p.trim());

      //       const optionName = options[0]?.name || "option";
      //       const optionValue = parts[0];

      //       const safeImages = Array.isArray(images)
      //         ? images
      //         : images
      //           ? [images]
      //           : [];

      //       return safeImages.map((img) => ({
      //         key,
      //         url: img.preview || img.src,
      //         optionName,
      //         optionValue,
      //       }));
      //     },
      //   );

      //   const hasVariantImages = uploadedVariantImages.length > 0;

      //   await fetch(
      //     `https://multi-vendor-marketplace.vercel.app/product/updateImages/${duplicatedProductId}`,
      //     {
      //       method: "PUT",
      //       headers: {
      //         "x-api-key": localStorage.getItem("apiKey"),
      //         "x-api-secret": localStorage.getItem("apiSecretKey"),
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({
      //         images: finalProductImages,
      //         ...(hasVariantImages && { variantImages: uploadedVariantImages }),
      //       }),
      //     },
      //   );

      //   navigate(`/manage-product`, {
      //     state: { product: duplicatedProduct },
      //     replace: true,
      //   });
      // }
    } catch (err) {
      console.error("Error duplicating product:", err);
      setMessage({ type: "error", text: "Server error while duplicating." });
    } finally {
      setLoading(false);
    }
  };

  const handleVariantImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !currentVariant) return;

    const parent = combinations[currentVariant.index]?.parent;
    const key =
      options.length === 1
        ? currentVariant.child
        : `${parent} / ${currentVariant.child}`;

    const normalizedKey = key.replace(/['"]/g, "").trim();
    const altText = normalizedKey.replace(/\s*\/\s*/g, "-").toLowerCase();

    const previews = files.map((file) => ({
      id: Date.now() + Math.random(),
      preview: URL.createObjectURL(file),
      alt: altText,
      loading: true,
    }));

    // ✅ APPEND previews
    setVariantImages((prev) => ({
      ...prev,
      [normalizedKey]: [...(prev[normalizedKey] || []), ...previews],
    }));

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      formData.append("upload_preset", "images");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dt2fvngtp/image/upload",
          { method: "POST", body: formData },
        );
        const data = await res.json();

        if (data.secure_url) {
          setVariantImages((prev) => ({
            ...prev,
            [normalizedKey]: prev[normalizedKey].map((img) =>
              img.preview === previews[i].preview
                ? { ...img, preview: data.secure_url, loading: false }
                : img,
            ),
          }));
          setImagesChanged(true);
        }
      } catch (err) {
        console.error(err);
      }
    }

    e.target.value = "";
  };

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
          "You have unsaved changes! Please save the product before leaving.",
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
    const trimmedValue = value.trim();

    const isDuplicate = newOption.values.some(
      (v, i) =>
        i !== index && v.trim().toLowerCase() === trimmedValue.toLowerCase(),
    );

    if (isDuplicate) {
      showToast("error", "This value already exists in this option.");
      return;
    }

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
    const cleanedValues = newOption.values
      .map((v) => (v === "__OTHER__" ? "" : v))
      .map((v) => v.trim())
      .filter((v) => v !== "");

    console.log("✅ Cleaned option values:", cleanedValues);

    const updated = [...options];

    if (cleanedValues.length === 0) {
      console.log("🧹 No values left, removing option:", newOption.name);
      updated.splice(optionIndex, 1);
    } else {
      updated[optionIndex] = {
        ...updated[optionIndex],
        name: newOption.name.trim(),
        values: cleanedValues,
      };
    }

    setOptions(updated);
    setEditingOptionIndex(null);
    setVariantsChanged(true);

    regenerateVariants(updated);
  };

  const [enableMetafields, setEnableMetafields] = useState(false);
  const [metafields, setMetafields] = useState([{ label: "", value: "" }]);

  const handleMetafieldChange = (index, key, value) => {
    const updated = [...metafields];
    updated[index][key] = value;
    setMetafields(updated);
  };

  const handleAddMetafield = () => {
    if (metafields.length < 4) {
      setMetafields([...metafields, { label: "", value: "" }]);
    }
  };

  const handleRemoveMetafield = (index) => {
    const updated = metafields.filter((_, i) => i !== index);
    setMetafields(updated);
  };
  useEffect(() => {
    if (product && isEditing) {
      localStorage.setItem("edit_product_backup", JSON.stringify(product));
    }
  }, [product, isEditing]);

  useEffect(() => {
    if (!locationData.state?.product && isEditing) {
      const cachedProduct = localStorage.getItem("edit_product_backup");

      if (cachedProduct) {
        navigate(locationData.pathname, {
          replace: true,
          state: { product: JSON.parse(cachedProduct) },
        });
      }
    }
  }, [locationData, isEditing, navigate]);
  const handleRemoveProductImage = (imageUrl) => {
    // 1️⃣ remove from media
    setSelectedImages((prev) =>
      prev.filter((img) => (img.cloudUrl || img.localUrl) !== imageUrl),
    );

    // 2️⃣ 🔥 remove from ALL variants
    setVariantImages((prev) => {
      const updated = {};

      Object.entries(prev).forEach(([variantKey, images]) => {
        const filteredImages = images.filter(
          (img) => (img.preview || img.src) !== imageUrl,
        );

        if (filteredImages.length > 0) {
          updated[variantKey] = filteredImages;
        }
        // 👆 agar empty ho gaya → variant se image fully removed
      });

      return updated;
    });

    setIsChanged(true);
  };

  const handleBack = () => {
    // if (isChanged) {
    //   const confirmLeave = window.confirm(
    //     "You have unsaved changes. Are you sure you want to go back?"
    //   );
    //   if (!confirmLeave) return;
    // }

    navigate("/manage-product");
  };
  const [groupImages, setGroupImages] = useState(false);
  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);

  return (
    <main className="bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-200 transition"
          >
            <IoIosArrowUp className="-rotate-90 text-xl text-gray-700" />
          </button>

          <h1 className="text-lg font-semibold text-gray-800">
            {isEditing ? "Edit Product" : "Add Product"}
          </h1>
        </div>

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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Media
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-600 select-none">
                  <input
                    type="checkbox"
                    checked={groupImages}
                    onChange={(e) => {
                      setGroupImages(e.target.checked);
                      setIsChanged(true);
                      setImagesChanged(true);
                    }}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />

                  <span className="cursor-pointer">Group Variant images</span>

                  <div className="relative group inline-block">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-blue-600 transition"
                    >
                      <FaInfo size={16} />
                    </button>

                    {/* TOOLTIP */}
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
    hidden group-hover:block whitespace-nowrap
    bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-50"
                    >
                      by checking this checkbox you allow to only show variant
                      images in the marketplace.
                    </div>
                  </div>
                </label>
              </div>

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
                    className="w-full bg-[#18181b] text-white px-3 cursor-pointer py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 auto-rows-[120px] gap-2 sm:gap-3">
                  {selectedImages.slice(0, 6).map((img, index) => {
                    const isChecked = checkedImages[index] || false;

                    return (
                      <div
                        key={index}
                        draggable
                        onDragStart={() => setDragIndex(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (dragIndex !== null) {
                            moveImageToFront(dragIndex);
                            setDragIndex(null);
                          }
                        }}
                        className={`group relative rounded-md overflow-hidden cursor-pointer border transition
    ${index === 0 ? "col-span-2 row-span-2" : ""}
    ${
      isChecked
        ? "ring-2 ring-blue-500 border-blue-400"
        : "border-gray-200 hover:shadow-md"
    }
  `}
                        onClick={() => setIsMediaModalVisible(true)}
                      >
                        <img
                          src={img.cloudUrl || img.localUrl}
                          alt={`Uploaded ${index}`}
                          className={`w-full h-full object-cover transition duration-300 ${
                            isChecked ? "opacity-60" : "opacity-100"
                          }`}
                        />

                        {/* FEATURED BADGE */}
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[11px] px-2 py-0.5 rounded">
                            Featured
                          </span>
                        )}

                        {/* DARK OVERLAY ON HOVER */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                        {/* CHECKBOX – SHOW ON IMAGE HOVER */}
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleImageSelection(index)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 accent-blue-600 cursor-pointer bg-white border border-gray-300 rounded"
                          />
                        </div>

                        {/* LOADER */}
                        {img.loading && (
                          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                            <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {selectedImages.length > 6 && (
                    <div
                      onClick={() => setIsMediaModalVisible(true)}
                      className="aspect-square flex items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-gray-700 font-medium text-lg cursor-pointer hover:bg-gray-200 transition"
                    >
                      +{selectedImages.length - 6}
                    </div>
                  )}

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
                        setIsChanged(true);
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
              <h2 className="font-medium text-gray-700">Inventory</h2>

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

              {/* <div className="flex items-center mt-3">
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
              </div> */}

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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU
                    </label>
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Barcode
                    </label>
                    <input
                      type="text"
                      placeholder="Barcode"
                      value={barcode}
                      onChange={(e) => {
                        setBarcode(e.target.value);
                        setIsChanged(true);
                      }}
                      className="w-full border p-2 rounded-md"
                    />
                  </div>
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
                    setIsChanged(true);
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
                          setIsChanged(true);
                        }}
                        className="w-20 text-center py-1 border-0 focus:ring-0"
                        placeholder="0.00"
                      />
                    </div>

                    <select
                      value={unit}
                      onChange={(e) => {
                        setUnit(e.target.value);
                        setIsChanged(true);
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
            <div className="border rounded-2xl p-4 bg-white border-gray-500 mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableShippingPlans"
                  checked={enableShippingPlans}
                  onChange={() => {
                    setEnableShippingPlans(!enableShippingPlans);
                    setIsChanged(true);
                  }}
                  className="h-4 w-4 text-blue-500"
                />
                <label
                  htmlFor="enableShippingPlans"
                  className="ml-2 text-sm text-gray-700"
                >
                  Shipping Options
                </label>
              </div>

              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="enableFreeShipping"
                  checked={enableFreeShipping}
                  onChange={() => {
                    setEnableFreeShipping(!enableFreeShipping);
                    setIsChanged(true);
                  }}
                  className="h-4 w-4 text-blue-500"
                />
                <label
                  htmlFor="enableFreeShipping"
                  className="ml-2 text-sm text-gray-700"
                >
                  Free Shipping
                </label>
              </div>

              {enableShippingPlans && !enableFreeShipping && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Shipping Profile
                  </label>

                  {shippingPlans.length > 0 ? (
                    <>
                      <select
                        value={selectedShippingPlan}
                        onChange={(e) => {
                          setSelectedShippingPlan(e.target.value);
                          setIsChanged(true);
                        }}
                        className="w-full border border-gray-300 p-2 rounded-md"
                      >
                        <option value="">Select a plan</option>
                        {shippingPlans.map((plan) => (
                          <option key={plan._id} value={plan.profileId}>
                            {plan.profileName.toUpperCase()} — {plan.rateName}{" "}
                            ($
                            {plan.ratePrice})
                          </option>
                        ))}
                      </select>

                      {selectedShippingPlan && (
                        <div className="mt-3 text-sm text-gray-700">
                          Selected plan:{" "}
                          <span className="font-medium">
                            {
                              shippingPlans.find(
                                (p) => p.profileId === selectedShippingPlan,
                              )?.profileName
                            }{" "}
                            (
                            {
                              shippingPlans.find(
                                (p) => p.profileId === selectedShippingPlan,
                              )?.rateName
                            }{" "}
                            - $
                            {
                              shippingPlans.find(
                                (p) => p.profileId === selectedShippingPlan,
                              )?.ratePrice
                            }
                            )
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-gray-700 bg-yellow-50 border border-yellow-300 rounded-md p-3">
                      No active shipping profiles found.{" "}
                      <button
                        onClick={() => navigate("/manage-shipping")}
                        className="text-blue-600 underline hover:text-blue-800 font-medium ml-1"
                      >
                        Click here to manage shipping.
                      </button>
                      <p className="mt-2 text-gray-600">
                        Once you activate a profile, it will appear here. Until
                        then, products will default to Free Shipping.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {enableShippingPlans && enableFreeShipping && (
                <div className="mt-4 text-sm text-green-600 font-medium">
                  Free shipping is enabled — no need to select a plan.
                </div>
              )}
            </div>

            <div className="border rounded-2xl p-3 mt-3 bg-white border-gray-300 w-full">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-medium text-gray-700">Variants</h2>

                {/* {combinations.length > 0 && (
                  <button
                    onClick={() => setShowBulkModal(true)}
                    className="text-sm bg-[#18181b] font-medium text-white px-3 py-1.5 rounded-md hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
                  >
                    Bulk Update
                  </button>
                  
                )} */}
                {combinations.length > 0 && (
                  <div className="flex gap-2">
                    {/* BULK UPDATE */}
                    <button
                      onClick={() => setShowBulkModal(true)}
                      className="text-sm bg-[#18181b] font-medium text-white px-3 py-1.5 rounded-md hover:bg-zinc-800 transition-colors shadow-sm"
                    >
                      Bulk Update
                    </button>

                    {/* BULK UPLOAD IMAGES */}
                    <button
                      onClick={() => setShowBulkUploadModal(true)}
                      className="text-sm bg-[#18181b] font-medium text-white px-3 py-1.5 rounded-md hover:bg-zinc-800 transition-colors shadow-sm"
                    >
                      Bulk Upload Images
                    </button>
                  </div>
                )}
              </div>

              {!showVariantForm && (
                <div className="flex gap-2 items-center mt-2">
                  <button
                    onClick={() => {
                      if (options.length >= 3) {
                        showToast(
                          "warning",
                          "You can only add up to 3 options.",
                        );
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
                            const dbMatch = dbOptions.find((db) =>
                              db.optionName.some(
                                (n) =>
                                  n.toLowerCase().trim() ===
                                  option.name.toLowerCase().trim(),
                              ),
                            );

                            setNewOption({
                              name: option.name,
                              values: [...option.values],
                              dbValues: dbMatch ? dbMatch.optionValues : [],
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
                          <h3 className="text-sm font-medium text-gray-700">
                            {option.name}
                          </h3>

                          {editingOptionIndex === optionIndex && (
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveEditedOption(optionIndex);
                                }}
                                className="text-xs text-white bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-700"
                              >
                                Done
                              </button>

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
                            {newOption.values.map((value, i) => {
                              const hasDBValues =
                                newOption.dbValues?.length > 0;

                              const isCustomValue =
                                value === "__OTHER__" ||
                                (value !== "" &&
                                  !newOption.dbValues.some(
                                    (v) =>
                                      v.toLowerCase() === value.toLowerCase(),
                                  ));

                              return (
                                <div
                                  key={i}
                                  className="flex gap-2 items-center"
                                >
                                  {hasDBValues && !isCustomValue ? (
                                    <div className="relative w-full">
                                      <select
                                        value={value === "" ? "" : value}
                                        onChange={(e) => {
                                          console.log(
                                            "Dropdown selected:",
                                            e.target.value,
                                          );

                                          if (e.target.value === "Other") {
                                            console.log(
                                              "👉 Switching to INPUT mode",
                                            );
                                            handleEditOptionValueChange(
                                              i,
                                              "__OTHER__",
                                            );
                                          } else {
                                            handleEditOptionValueChange(
                                              i,
                                              e.target.value,
                                            );
                                          }
                                        }}
                                        className="w-full  border-gray-300 rounded-md p-1 text-sm appearance-none border"
                                      >
                                        <option value="" disabled>
                                          Select value
                                        </option>

                                        {newOption.dbValues.map((val) => (
                                          <option key={val} value={val}>
                                            {val}
                                          </option>
                                        ))}

                                        <option value="Other">Other</option>
                                      </select>
                                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                                        <svg
                                          className="h-5 w-5"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                                        </svg>
                                      </div>
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      value={value === "__OTHER__" ? "" : value}
                                      onChange={(e) => {
                                        console.log(
                                          "Typing custom value:",
                                          e.target.value,
                                        );
                                        handleEditOptionValueChange(
                                          i,
                                          e.target.value,
                                        );
                                      }}
                                      placeholder="Enter custom value"
                                      className="w-full border border-gray-300 rounded-md p-1 text-sm"
                                    />
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveOptionValue(optionIndex, i);
                                    }}
                                    className="text-red-500 hover:text-red-700 transition text-lg"
                                    title="Remove value & variants"
                                  >
                                    <RiDeleteBin6Line />
                                  </button>
                                </div>
                              );
                            })}

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
                      <h3 className="font-semibold text-xs text-gray-800">
                        Image
                      </h3>
                      <h3 className="font-semibold text-xs text-gray-800">
                        Variant
                      </h3>
                      <h3 className="font-semibold text-xs text-gray-800">
                        Price
                      </h3>
                      <h3 className="font-semibold text-xs text-gray-800">
                        Compare
                      </h3>
                      <h3 className="font-semibold text-xs text-gray-800">
                        Qty
                      </h3>
                      <h3 className="font-semibold text-xs text-gray-800">
                        Action
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

                            <div
                              className="flex items-center justify-between gap-6 cursor-pointer"
                              onClick={() => toggleChildOptions(index)}
                            >
                              <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700 transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleChildOptions(index);
                                }}
                              >
                                {expandedParents.includes(index) ? (
                                  <IoIosArrowDown className="h-5 w-5 text-gray-500 transition-transform duration-200 rotate-180" />
                                ) : (
                                  <IoIosArrowDown
                                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                                      expandedParents.includes(index)
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                )}
                              </button>
                            </div>
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
                                          normalizedKey,
                                      );
                                    const variantId = matchingVariant?.id;

                                    return (
                                      <li
                                        key={childIndex}
                                        className="grid grid-cols-6 items-center gap-20"
                                      >
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

                                                {variantImages[normalizedKey]
                                                  .length > 1 && (
                                                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                                                    +
                                                    {variantImages[
                                                      normalizedKey
                                                    ].length - 1}
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
                                            if (isEditing && variantId) {
                                              setIsChanged(true);
                                              navigate(
                                                `/product/${product.id}/variants/${variantId}`,
                                                {
                                                  state: {
                                                    productId: product.id,
                                                    variantId,
                                                  },
                                                },
                                              );
                                            } else {
                                              handleVariantEditModal(
                                                index,
                                                child,
                                              );
                                            }
                                          }}
                                        >
                                          {child}
                                        </span>

                                        <div
                                          className="relative w-20 cursor-pointer"
                                          onClick={() => {
                                            if (isEditing && variantId) {
                                              navigate(
                                                `/product/${product.id}/variants/${variantId}`,
                                                {
                                                  state: {
                                                    productId: product.id,
                                                    variantId,
                                                  },
                                                },
                                              );
                                            } else {
                                              handleVariantEditModal(
                                                index,
                                                child,
                                              );
                                            }
                                          }}
                                        >
                                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">
                                            $
                                          </span>
                                          <span className="w-20 p-1 pl-6 text-sm">
                                            {variantPrices[
                                              `${index}-${child}`
                                            ] ??
                                              matchingVariant?.price ??
                                              "0.00"}
                                          </span>
                                        </div>

                                        <div
                                          className="relative w-20 cursor-pointer"
                                          onClick={() => {
                                            if (isEditing && variantId) {
                                              navigate(
                                                `/product/${product.id}/variants/${variantId}`,
                                                {
                                                  state: {
                                                    productId: product.id,
                                                    variantId,
                                                  },
                                                },
                                              );
                                            } else {
                                              handleVariantEditModal(
                                                index,
                                                child,
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
                                            if (isEditing && variantId) {
                                              navigate(
                                                `/product/${product.id}/variants/${variantId}`,
                                                {
                                                  state: {
                                                    productId: product.id,
                                                    variantId,
                                                  },
                                                },
                                              );
                                            } else {
                                              handleVariantEditModal(
                                                index,
                                                child,
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
                                          className="text-red-500 hover:text-red-700 "
                                        >
                                          <RiDeleteBin6Line />
                                        </button>
                                      </li>
                                    );
                                  },
                                )}
                              </ul>
                            </div>
                          )}

                          {isDeleteModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm z-[100]">
                              <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-[400px] overflow-hidden border border-gray-200 transform transition-all">
                                {/* Top Accent Bar */}
                                <div className="h-1.5 bg-red-500 w-full" />

                                <div className="p-6">
                                  <h2 className="text-xl font-bold text-[#18181b] mb-2">
                                    Confirm Deletion
                                  </h2>

                                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                    Are you sure you want to delete this
                                    variant? This action is
                                    <span className="text-red-600 font-semibold">
                                      {" "}
                                      permanent
                                    </span>{" "}
                                    and cannot be undone.
                                  </p>

                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() =>
                                        setIsDeleteModalOpen(false)
                                      }
                                      className="flex-1 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#F3F4F6] transition-all active:scale-95"
                                    >
                                      Cancel
                                    </button>

                                    <button
                                      onClick={() => {
                                        if (deleteTarget) {
                                          handleDeleteCombination(
                                            deleteTarget.index,
                                            deleteTarget.childIndex,
                                          );
                                        }
                                        setIsDeleteModalOpen(false);
                                      }}
                                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 shadow-md shadow-red-200 transition-all active:scale-95"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>

                                {/* Optional Footer Background for theming */}
                                <div className="bg-[#F3F4F6] px-6 py-3 border-t border-gray-100">
                                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                    System Action Security
                                  </p>
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
                    <div className="relative">
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
                                  value.toLowerCase().trim(),
                              ),
                            );

                            if (found) {
                              setMatchedOptionValues(found.optionValues || []);
                            } else {
                              setMatchedOptionValues([]);
                            }
                          }
                        }}
                        className="w-full  border-gray-300 rounded-md p-1 text-sm appearance-none border"
                      >
                        <option value="">Select option name</option>
                        {dbOptions.map((opt, i) =>
                          opt.optionName.map((name, j) => (
                            <option key={`${i}-${j}`} value={name}>
                              {name}
                            </option>
                          )),
                        )}
                        <option value="Other">Other</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                        </svg>
                      </div>
                    </div>
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
                        <div
                          key={index}
                          className="flex gap-2 items-center mt-2"
                        >
                          <select
                            value={value}
                            onChange={(e) =>
                              handleNewOptionValueChange(index, e.target.value)
                            }
                            className="w-full  border-gray-300 rounded-md p-1 text-sm appearance-none border"
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
                        <div
                          key={index}
                          className="flex gap-2 items-center mt-2"
                        >
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
                      className="text-sm text-white bg-[#18181b] font-medium px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="border rounded-2xl p-4 bg-white border-gray-300 mt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-700">
                  Size Chart
                </h2>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableSizeChart"
                    checked={enableSizeChart}
                    onChange={() => setEnableSizeChart(!enableSizeChart)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label
                    htmlFor="enableSizeChart"
                    className="text-sm text-gray-700"
                  >
                    Add Size Chart
                  </label>
                </div>
              </div>

              {enableSizeChart && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Size Chart
                  </label>

                  {sizeCharts.length > 0 ? (
                    <select
                      value={selectedSizeChart}
                      onChange={(e) => setSelectedSizeChart(e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded-md"
                    >
                      <option value="">Choose Size Chart</option>

                      {sizeCharts.map((chart) => (
                        <option key={chart._id} value={chart._id}>
                          {chart.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-300 p-3 rounded-md">
                      No size charts found.
                      <button
                        className="text-blue-600 underline ml-1"
                        onClick={() => navigate("/create-size-chart")}
                      >
                        Create one
                      </button>
                    </div>
                  )}

                  {selectedSizeChart && (
                    <div className="mt-3">
                      <img
                        src={
                          sizeCharts.find((c) => c._id === selectedSizeChart)
                            ?.image
                        }
                        alt="Size Chart Preview"
                        className="w-40 h-40 border rounded object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border rounded-2xl p-4 bg-white border-gray-300 mt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-700">
                  Custom Fields
                </h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableMetafields"
                    checked={enableMetafields}
                    onChange={() => setEnableMetafields((prev) => !prev)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="enableMetafields"
                    className="text-sm text-gray-700"
                  >
                    Create Custom Fields
                  </label>
                </div>
              </div>

              {enableMetafields && (
                <div className="mt-4 space-y-4">
                  {metafields.map((field, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-800">
                          Custom Field {index + 1}
                        </h3>
                        {metafields.length > 1 && (
                          <button
                            onClick={() => handleRemoveMetafield(index)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>

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
                                e.target.value,
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
                                e.target.value,
                              )
                            }
                            placeholder="Enter value (e.g., Cotton)"
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-400"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {metafields.length < 4 && (
                    <button
                      onClick={handleAddMetafield}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      + Add Field
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="border rounded-lg p-4 shadow-sm bg-white mt-3">
              <h2 className="text-md font-medium text-gray-700 mb-3">
                Search engine listing
              </h2>

              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <button onClick={() => setEditing(true)}>
                    <MdEdit className="text-gray-500 hover:text-blue-500" />
                  </button>
                </div>
                <div className="text-sm text-blue-700 truncate">
                  {seoHandle}
                </div>
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
                      // onChange={(e) => setSeoHandle(e.target.value)}
                      onChange={(e) => {
                        let value = e.target.value;

                        value = value
                          .toLowerCase()
                          .replace(/\s+/g, "-") // space → -
                          .replace(/[^a-z0-9-]/g, "") // special char remove
                          .replace(/-+/g, "-"); // multiple - ko single karo

                        setSeoHandle(value);
                      }}
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
                      className="px-4 py-1 text-sm bg-black hover:bg-gray-800 text-white rounded"
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
              <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-60 text-center px-4">
                <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin mb-6" />

                <h2 className="text-white text-lg font-semibold transition-all duration-500">
                  {slides[slideIndex].title}
                </h2>

                <p className="text-white text-sm mt-1 opacity-90 transition-all duration-500 max-w-md">
                  {slides[slideIndex].desc}
                </p>

                {/* Dots */}
                {/* <div className="flex gap-2 mt-4">
                  {slides.map((_, i) => (
                    <span
                      key={i}
                      className={`h-2 w-2 rounded-full ${
                        i === slideIndex ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div> */}
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
                className="w-full bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
              >
                {loading
                  ? "Submitting..."
                  : isEditing
                    ? "Update Product"
                    : "Save"}
              </button>
              {!isEditing && (
                <button
                  type="button"
                  onClick={handleDiscard}
                  // className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                  className="w-full bg-gray-400  border-gray-300 hover:bg-gray-500 text-gray-800 border px-3 py-1.5 rounded-lg text-sm font-medium  transition-colors shadow-sm"
                >
                  Discard
                </button>
              )}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setDuplicateMode("copy");
                    setDuplicateTitle(`Copy of ${title} `);
                    setShowDuplicateModal(true);
                  }}
                  className="w-full bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                  // className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                >
                  Duplicate Product
                </button>
              )}
            </div>

            <div className="bg-white p-4 border border-gray-300 rounded-xl">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>

              <div className="relative mt-2">
                <select
                  className="block w-full appearance-none border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="publish">Publish</option>
                  <option value="draft">Draft</option>
                </select>

                {/* Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
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
                          (cat) => cat.catNo === catNo,
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
                  onChange={(e) => {
                    setVendor(e.target.value);
                    setIsChanged(true);
                  }}
                  placeholder="Enter vendor name"
                  className="w-full border border-gray-300 p-2 rounded-xl"
                />
              </div>
            </div>
          </div>
          {isPopupVisible && currentVariant && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-2 sm:px-4">
              <div className="bg-white w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
                {/* HEADER */}
                <div className="sticky top-0 bg-white z-20 border-b flex justify-between items-center px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Select Images for Variant
                  </h2>
                  <button
                    onClick={() => {
                      setIsPopupVisible(false);
                      setCurrentVariant(null);
                    }}
                    className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800"
                  >
                    Done
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  {/* UPLOAD */}
                  <div className="bg-white border-b px-6 py-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      id="variantUpload"
                      className="hidden"
                      onChange={handleVariantImageUpload}
                    />

                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center bg-gray-50">
                      <label
                        htmlFor="variantUpload"
                        className="bg-black text-white px-5 py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-800 transition"
                      >
                        Upload Images
                      </label>
                    </div>
                  </div>

                  {/* ASSIGNED IMAGES */}
                  <div className="mt-4 bg-white border rounded-lg p-5">
                    <h3 className="text-sm font-semibold mb-3 text-gray-700">
                      Assigned Images
                    </h3>

                    {(() => {
                      const parent = combinations[currentVariant.index]?.parent;
                      const key =
                        options.length === 1
                          ? currentVariant.child
                          : `${parent} / ${currentVariant.child}`;

                      const normalizedKey = key.replace(/['"]/g, "").trim();
                      const images = variantImages[normalizedKey] || [];

                      return images.length ? (
                        <div className="flex flex-wrap gap-3">
                          {images.map((img, i) => (
                            <div key={i} className="relative w-28 h-28">
                              <img
                                src={img.preview}
                                className="w-full h-full object-cover rounded border"
                                alt="variant"
                              />

                              {img.loading && (
                                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                  <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
                                </div>
                              )}

                              <button
                                onClick={() => {
                                  setVariantImages((prev) => ({
                                    ...prev,
                                    [normalizedKey]: prev[normalizedKey].filter(
                                      (_, idx) => idx !== i,
                                    ),
                                  }));
                                  setIsChanged(true);
                                  setImagesChanged(true);
                                }}
                                className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          No images assigned
                        </p>
                      );
                    })()}
                  </div>

                  {/* PRODUCT MEDIA */}
                  <div className="mt-8 bg-white border rounded-lg p-5">
                    <h3 className="text-sm font-semibold mb-3 text-gray-700">
                      Product Media Images
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {selectedImages.map((img) => {
                        const imageUrl = img.cloudUrl || img.localUrl;

                        return (
                          <div
                            key={imageUrl}
                            className="border rounded-lg p-2 cursor-pointer hover:border-blue-500"
                            onClick={() => {
                              const parent =
                                combinations[currentVariant.index]?.parent;

                              const key =
                                options.length === 1
                                  ? currentVariant.child
                                  : `${parent} / ${currentVariant.child}`;

                              const normalizedKey = key
                                .replace(/['"]/g, "")
                                .trim();

                              // ✅ APPEND image
                              setVariantImages((prev) => ({
                                ...prev,
                                [normalizedKey]: [
                                  ...(prev[normalizedKey] || []),
                                  {
                                    preview: imageUrl,
                                    alt: normalizedKey
                                      .replace(/\s*\/\s*/g, "-")
                                      .toLowerCase(),
                                    loading: false,
                                  },
                                ],
                              }));

                              setIsChanged(true);
                              setImagesChanged(true);
                            }}
                          >
                            <img
                              src={imageUrl}
                              className="w-full h-28 object-cover rounded-md"
                              alt="media"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isMediaModalVisible && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-2 sm:px-4">
              <div className="bg-white w-full max-w-6xl h-[90vh] sm:rounded-xl shadow-2xl flex flex-col overflow-hidden">
                <div className="sticky top-0 bg-white z-20 border-b flex justify-between items-center px-6 py-4">
                  <h1 className="text-xl font-semibold text-gray-900 mb-0.5">
                    Manage Product Media
                  </h1>
                  <button
                    onClick={() => setIsMediaModalVisible(false)}
                    className=" bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
                  >
                    Done
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  <div className="border-2 border-dashed rounded-lg h-40 flex flex-col justify-center items-center bg-white">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMediaUpload}
                      className="hidden"
                      id="productUpload"
                    />

                    <div className="flex gap-4">
                      <label
                        htmlFor="productUpload"
                        className="w-full bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
                      >
                        upload
                      </label>

                      <button
                        onClick={() => setShowGallery(true)}
                        className="w-full bg-gray-400 px-3 py-1.5  border-gray-300 hover:bg-gray-500 text-gray-800 border  rounded-lg text-sm font-medium  transition-colors shadow-sm"
                      >
                        Browse
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 bg-white border rounded-lg p-5">
                    <h3 className="text-sm font-semibold mb-3">
                      Product Images
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      {selectedImages.map((img) => {
                        const imageUrl = img.cloudUrl || img.localUrl;

                        return (
                          // <div
                          //   key={imageUrl}
                          //   className="relative border rounded-lg overflow-hidden"
                          // >
                          //   <img
                          //     src={imageUrl}
                          //     className="w-28 h-28 object-cover"
                          //   />

                          //   {img.loading && (
                          //     <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          //       <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                          //     </div>
                          //   )}
                          // </div>
                          <div
                            key={imageUrl}
                            className="relative border rounded-lg overflow-hidden group"
                          >
                            <img
                              src={imageUrl}
                              className="w-28 h-28 object-cover"
                            />

                            <button
                              onClick={() => handleRemoveProductImage(imageUrl)}
                              className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 
               flex items-center justify-center opacity-0 group-hover:opacity-100 
               transition hover:bg-red-600"
                              title="Remove image"
                            >
                              ✕
                            </button>

                            {img.loading && (
                              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {showGallery && galleryImages.length > 0 && (
                    <div className="mt-8 bg-white border rounded-lg p-5">
                      <h3 className="text-sm font-semibold mb-3">
                        Gallery Images
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {galleryImages.map((file) => (
                          <div
                            key={file.src}
                            className="border rounded-lg p-2 cursor-pointer"
                            onClick={() => {
                              console.log("🟢 BROWSE IMAGE CLICK:", file.src);

                              const exists = selectedImages.some(
                                (img) =>
                                  (img.cloudUrl || img.localUrl) === file.src,
                              );

                              if (exists) {
                                console.warn(
                                  "⛔ DUPLICATE PRODUCT IMAGE SKIPPED",
                                );
                                return;
                              }

                              console.log("✅ PRODUCT IMAGE ADDED");

                              setSelectedImages((prev) => [
                                { cloudUrl: file.src, loading: false },
                                ...prev,
                              ]);
                            }}
                          >
                            <img
                              src={file.src}
                              className="w-full h-28 object-cover rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showDuplicateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={() => setShowDuplicateModal(false)}
              />

              <div className="relative w-full max-w-[440px] overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">
                    Duplicate Product
                  </h2>
                </div>

                <div className="p-6">
                  <p className="text-sm leading-relaxed text-slate-500 mb-6">
                    A new draft will be created with the details of the current
                    product. Please specify a new title below.
                  </p>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      Product Title
                    </label>
                    <input
                      type="text"
                      autoFocus
                      value={duplicateTitle}
                      onChange={(e) => setDuplicateTitle(e.target.value)}
                      placeholder="Enter new title..."
                      className="w-full rounded-lg border-2 border-slate-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition-all outline-none focus:border-gray-500 focus:ring-0"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4">
                  <button
                    onClick={() => setShowDuplicateModal(false)}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      handleDuplicate(duplicateTitle.trim());
                      setShowDuplicateModal(false);
                    }}
                    disabled={!duplicateTitle.trim()}
                    className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-700 active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-blue-600 disabled:active:scale-100"
                  >
                    Duplicate Product
                  </button>
                </div>
              </div>
            </div>
          )}

          {variantEditModalVisible && currentVariant && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-2xl w-[420px] p-6 relative transform transition-all duration-300 scale-100 animate-slideUp">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Edit Variant –{" "}
                    <span className="text-blue-600">
                      {currentVariant.child}
                    </span>
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
                      Price <span className="text-gray-400 text-xs">(AUD)</span>
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
                          e.target.value,
                        )
                      }
                      className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 w-full p-2 rounded-md text-sm transition"
                      placeholder="Enter price"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Compare at Price{" "}
                      <span className="text-gray-400 text-xs">(AUD)</span>
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
                          e.target.value,
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
                          e.target.value,
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
                          e.target.value,
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

          {showBulkModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scaleIn">
                <div className="flex justify-between items-center border-b pb-3 mb-5">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Bulk Update Variants
                  </h2>
                  <button
                    onClick={() => setShowBulkModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm text-gray-500 mb-5">
                  Apply the same price values to{" "}
                  <span className="font-medium">all variants</span>. Leave a
                  field empty if you don’t want to update it.
                </p>

                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={bulkPrice}
                      onChange={(e) => setBulkPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Compare at Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={bulkCompareAtPrice}
                      onChange={(e) => setBulkCompareAtPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={bulkQuantity}
                    onChange={(e) => setBulkQuantity(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t pt-4">
                  <button
                    onClick={() => setShowBulkModal(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      const updatedPrices = {};
                      const updatedComparePrices = {};
                      const updatedQuantities = {};

                      combinations.forEach((combination, index) => {
                        combination.children.forEach((child) => {
                          const key = `${index}-${child}`;

                          if (bulkPrice !== "") {
                            updatedPrices[key] = parseFloat(bulkPrice);
                          }

                          if (bulkCompareAtPrice !== "") {
                            updatedComparePrices[key] =
                              parseFloat(bulkCompareAtPrice);
                          }
                          if (bulkQuantity !== "") {
                            updatedQuantities[key] = parseInt(bulkQuantity, 10);
                          }
                        });
                      });

                      setVariantPrices((prev) => ({
                        ...prev,
                        ...updatedPrices,
                      }));
                      setVariantComparePrices((prev) => ({
                        ...prev,
                        ...updatedComparePrices,
                      }));
                      setVariantQuantities((prev) => ({
                        ...prev,
                        ...updatedQuantities,
                      }));

                      setIsChanged(true);
                      setShowBulkModal(false);
                      setBulkPrice("");
                      setVariantsChanged(true);
                      setBulkCompareAtPrice("");
                      setBulkQuantity("");
                    }}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md transition active:scale-95"
                  >
                    Apply to All
                  </button>
                </div>
              </div>
            </div>
          )}
          {showBulkUploadModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white w-[960px] max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Bulk Variant Image Upload
                  </h2>
                  <button
                    onClick={() => setShowBulkUploadModal(false)}
                    className="text-gray-500 hover:text-gray-800 text-xl"
                  >
                    ×
                  </button>
                </div>

                <div className="flex h-[70vh]">
                  <div className="w-1/2 border-r overflow-y-auto p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                      Select Variants
                    </h3>

                    {combinations.map((combo, i) => (
                      <div key={i} className="mb-4">
                        <p className="text-sm font-medium text-gray-800 mb-2">
                          {combo.parent}
                        </p>

                        {combo.children.map((child, j) => {
                          const key = getVariantKey(combo.parent, child);
                          const imageCount = variantImages[key]?.length || 0;
                          const imagePreview = variantImages[key]?.[0]?.preview;

                          return (
                            <label
                              key={j}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedBulkVariants.includes(key)}
                                onChange={() => toggleBulkVariant(key)}
                                className="accent-blue-600"
                              />

                              <div className="w-10 h-10 rounded-md border overflow-hidden bg-gray-50 flex items-center justify-center relative">
                                {imagePreview ? (
                                  <>
                                    <img
                                      src={imagePreview}
                                      alt={key}
                                      className={`w-full h-full object-cover ${
                                        variantImages[key]?.some(
                                          (img) => img.loading,
                                        )
                                          ? "opacity-60"
                                          : ""
                                      }`}
                                    />

                                    {variantImages[key]?.some(
                                      (img) => img.loading,
                                    ) && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                                        <div className="w-4 h-4 border-2 border-blue-500 border-dashed rounded-full animate-spin" />
                                      </div>
                                    )}

                                    {imageCount > 1 && (
                                      <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1 rounded">
                                        +{imageCount - 1}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-xs text-gray-400">
                                    No Image
                                  </span>
                                )}
                              </div>

                              <span
                                className="text-sm text-gray-700 hover:underline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (variantImages[key]?.length > 0) {
                                    setVariantImageModal({
                                      open: true,
                                      variantKey: key,
                                    });
                                  }
                                }}
                              >
                                {key}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  <div className="w-1/2 p-6 flex flex-col overflow-y-auto">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                      Upload Images
                    </h3>

                    {/* UPLOAD */}
                    <label className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition h-48">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleBulkImageUpload}
                        className="hidden"
                      />

                      <span className="text-3xl text-gray-400">+</span>
                      <p className="text-sm text-gray-600 mt-2">
                        Upload images (applied to selected variants)
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG supported
                      </p>
                    </label>

                    {/* PRODUCT MEDIA */}
                    <div className="mt-8">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Product Media Images
                      </h4>

                      <div className="grid grid-cols-3 gap-4">
                        {selectedImages.map((img) => {
                          const imageUrl = img.cloudUrl || img.localUrl;

                          return (
                            <div
                              key={imageUrl}
                              onClick={() =>
                                selectedBulkVariants.length > 0 &&
                                assignImageToSelectedVariants(imageUrl)
                              }
                              className={`border rounded-lg p-2 transition
                      ${
                        selectedBulkVariants.length === 0
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:border-blue-500"
                      }`}
                            >
                              <img
                                src={imageUrl}
                                className="w-full h-28 object-cover rounded-md"
                                alt="media"
                              />
                            </div>
                          );
                        })}
                      </div>

                      {selectedBulkVariants.length === 0 && (
                        <p className="text-xs text-gray-400 mt-2 italic">
                          Select variants first to assign images
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {variantImageModal.open && (
            <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center">
              <div className="bg-white w-[520px] max-h-[80vh] rounded-xl shadow-xl overflow-hidden">
                {/* HEADER */}
                <div className="flex justify-between items-center px-5 py-3 border-b">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Images for {variantImageModal.variantKey}
                  </h3>
                  <button
                    onClick={() =>
                      setVariantImageModal({ open: false, variantKey: null })
                    }
                    className="text-gray-500 hover:text-gray-800"
                  >
                    ✕
                  </button>
                </div>

                {/* BODY */}
                <div className="p-5 grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                  {variantImages[variantImageModal.variantKey]?.map(
                    (img, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={() => setDraggedIndex(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedIndex === null || draggedIndex === index)
                            return;

                          setVariantImages((prev) => {
                            const updated = { ...prev };
                            const images = [
                              ...updated[variantImageModal.variantKey],
                            ];

                            const [moved] = images.splice(draggedIndex, 1);
                            images.splice(index, 0, moved);

                            updated[variantImageModal.variantKey] = images;
                            return updated;
                          });

                          setDraggedIndex(null);
                          setIsChanged(true);
                          setVariantsChanged(true);
                        }}
                        className={`relative border rounded-lg overflow-hidden group cursor-move transition
              ${draggedIndex === index ? "ring-2 ring-blue-500 opacity-70" : ""}
            `}
                      >
                        <img
                          src={img.preview || img.src}
                          alt="variant"
                          className={`w-full h-28 object-cover ${
                            img.loading ? "opacity-60" : ""
                          }`}
                        />

                        {/* FEATURED BADGE (first image) */}
                        {index === 0 && !img.loading && (
                          <span className="absolute bottom-1 left-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                            Primary
                          </span>
                        )}

                        {/* LOADER */}
                        {img.loading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                            <div className="w-5 h-5 border-2 border-blue-500 border-dashed rounded-full animate-spin" />
                          </div>
                        )}

                        {/* REMOVE BUTTON */}
                        {!img.loading && (
                          <button
                            onClick={() => {
                              setVariantImages((prev) => {
                                const updated = { ...prev };

                                updated[variantImageModal.variantKey] = updated[
                                  variantImageModal.variantKey
                                ].filter((_, i) => i !== index);

                                if (
                                  updated[variantImageModal.variantKey]
                                    .length === 0
                                ) {
                                  delete updated[variantImageModal.variantKey];
                                  setVariantImageModal({
                                    open: false,
                                    variantKey: null,
                                  });
                                }

                                return updated;
                              });
                              setVariantsChanged(true);

                              setIsChanged(true);
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}

          {showGroupInfoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Darker, blurred backdrop for focus */}
              <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fadeIn"
                onClick={() => setShowGroupInfoModal(false)}
              />

              {/* Modal Card */}
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-scaleIn ring-1 ring-black/5">
                {/* Top Decorative Gradient Bar */}
                <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <div className="p-8">
                  {/* Visual Icon */}
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-5">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
                    Group Variant Images
                  </h2>

                  <p className="text-slate-500 text-[15px] leading-relaxed">
                    Streamline your gallery. By enabling this, only
                    <span className="mx-1 font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                      variant images
                    </span>
                    will be visible to customers in the marketplace.
                  </p>

                  <div className="mt-8">
                    <button
                      onClick={() => setShowGroupInfoModal(false)}
                      className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-100 active:scale-[0.98]"
                    >
                      Understood
                    </button>

                    <button
                      onClick={() => setShowGroupInfoModal(false)}
                      className="w-full mt-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CategorySelector;
