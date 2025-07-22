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
const CategorySelector = () => {
  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const locationData = useLocation();
  const { product } = locationData.state || {};
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [productType, setProductType] = useState([]);
  const [seoHandle, setSeoHandle] = useState(
    `https://www.aydiactive.com/products/${product?.title || ""} `
  );

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

  // const generateVariants = () => {
  //   if (options.length < 2) return [];

  //   const parentOption = options[0];
  //   const childOptions = options.slice(1);

  //   let combinations = [];

  //   parentOption.values.forEach((parentValue) => {
  //     let childCombinations = [];

  //     if (childOptions.length === 1) {
  //       childOptions[0].values.forEach((val) => {
  //         childCombinations.push(`${val}`);
  //       });
  //     } else if (childOptions.length === 2) {
  //       childOptions[0].values.forEach((val1) => {
  //         childOptions[1].values.forEach((val2) => {
  //           childCombinations.push(`${val1} / ${val2}`);
  //         });
  //       });
  //     }

  //     combinations.push({
  //       parent: parentValue,
  //       children: childCombinations,
  //     });
  //   });

  //   return combinations;
  // };

  const generateVariants = () => {
    if (!options || options.length === 0) return [];

    if (options.length === 1) {
      // Only one option like Size
      return [
        {
          parent: options[0].name,
          children: options[0].values,
        },
      ];
    }

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

  useEffect(() => {
    const userId = localStorage.getItem("userid");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    const productId = product?.id || "null";

    if (isPopupVisible && userId) {
      fetch(
        `https://multi-vendor-marketplace.vercel.app/product/getImageGallery/${userId}/${productId}`,
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
          const allImages = data.flatMap((item) => item.images);
          setGalleryImages(allImages);
        })
        .catch((err) => console.error("Failed to fetch images:", err));
    }
  }, [isPopupVisible, product]);

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
        })
      );

      // const hydratedVariantImages = {};

      // formattedVariants.forEach((variantGroup) => {
      //   const children = variantGroup.subVariants;

      //   children.forEach((childVariant) => {
      //     const titleKey = normalizeString(childVariant.title || "");

      //     const imageId = childVariant.image_id;

      //     const matched =
      //       product.variantImages?.find(
      //         (img) => String(img.id) === String(imageId)
      //       ) ||
      //       product.images?.find((img) => String(img.id) === String(imageId));

      //     if (matched?.src) {
      //       hydratedVariantImages[titleKey] = {
      //         preview: matched.src,
      //         loading: false,
      //       };
      //     }
      //   });
      // });
      const hydratedVariantImages = {};

      product.variants.forEach((variant) => {
        const titleKey = normalizeString(variant.title || "");

        const imageId = variant.image_id;

        const matched =
          product.variantImages?.find(
            (img) => String(img.id) === String(imageId)
          ) ||
          product.images?.find((img) => String(img.id) === String(imageId));

        if (matched?.src) {
          console.log(` Found image for "${titleKey}":`, matched.src);

          hydratedVariantImages[titleKey] = {
            preview: matched.src,
            loading: false,
          };
        }
      });

      console.log(
        "Hydrated Images from formattedVariants (title based):",
        hydratedVariantImages
      );

      if (Object.keys(hydratedVariantImages).length > 0) {
        setVariantImages(hydratedVariantImages);
      } else {
        const fallbackVariantImages = {};

        product?.variants?.forEach((variant) => {
          const titleKey = normalizeString(variant.title || "");

          const matchedImage = product?.variantImages?.find(
            (img) => String(img.id) === String(variant.image_id)
          );

          if (matchedImage?.src) {
            fallbackVariantImages[titleKey] = {
              preview: matchedImage.src,
              loading: false,
            };
          }
        });

        console.log(
          "Fallback Images from product.variants (title based):",
          fallbackVariantImages
        );

        if (Object.keys(fallbackVariantImages).length > 0) {
          setVariantImages(fallbackVariantImages);
        } else {
          console.log("No images found from either method");
        }
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

  const handleImageChange = async (event) => {
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    const files = Array.from(event.target.files);
    const previews = files.map((file) => ({
      localUrl: URL.createObjectURL(file),
      loading: true,
      cloudUrl: null,
    }));

    const updatedImages = [...selectedImages, ...previews];
    setSelectedImages(updatedImages);
    const userId = localStorage.getItem("userid");
    const token = localStorage.getItem("usertoken");
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
          await fetch("https://multi-vendor-marketplace.vercel.app/product/addImageGallery", {
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
          });

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
  const normalizeString = (str) => String(str).replace(/['"]/g, "").trim();

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
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
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

    const categoryIds = finalCategoryPayload.map((item) =>
      item.catNo.toString()
    );

    const combinedKeywords = [
      selectedExportTitle,
      ...categoryIds,
      ...keywordsList,
    ].join(", ");
    const payload = {
      // keyWord: keywordsList.join(", "),
      keyWord: combinedKeywords,

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
      categories: selectedExportTitle,
    };

    console.log("Payload being sent:", payload);

    try {
      const url = isEditing
        ? ` https://multi-vendor-marketplace.vercel.app/product/updateProducts/${product._id}`
        : "  https://multi-vendor-marketplace.vercel.app/product/createProduct";

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
        ` https://multi-vendor-marketplace.vercel.app/product/updateImages/${data.product.id}`,
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
                        {/* {expandedParents.includes(index) && (
                          <div className="mt-2">
                            <ul className="space-y-2">
                              {combinations[index]?.children?.map(
                                (child, childIndex) => {
                                  const parentValue =
                                    combinations[index]?.parent;
                                  const combinationString = `${parentValue} / ${child}`;

                                  const image =
                                    variantImages[combinationString];

                                  const matchingVariant =
                                    product?.variants?.find(
                                      (variant) =>
                                        variant.title === combinationString
                                    );

                                  const variantId = matchingVariant?.id;

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
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onClick={() => {
                                              setCurrentVariant({
                                                index,
                                                child,
                                              });
                                              setIsPopupVisible(true);
                                            }}
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
                                        className="font-medium text-sm text-gray-700 cursor-pointer hover:underline whitespace-nowrap"
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
                                        <span className="w-20 p-1 pl-6   text-sm ">
                                          {price || "N/A"}
                                        </span>
                                      </div>

                                      <div className="relative w-20 ">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">
                                          $
                                        </span>
                                        <span className="w-20 p-1 pl-6   text-sm r">
                                          {compareAtPrice || "N/A"}
                                        </span>
                                      </div>

                                      <span className="w-20 p-1  text-sm r">
                                        {sku || "N/A"}
                                      </span>
                                      <span className="w-20 p-1  text-sm r">
                                        {quantity}
                                      </span>

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
                        )} */}
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
                                      className="grid grid-cols-7 items-center gap-20"
                                    >
                                      <div className="w-12 relative">
                                        <label className="flex items-center justify-center w-12 h-12 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition overflow-hidden">
                                          {image?.preview ? (
                                            <img
                                              src={image.preview}
                                              alt={`Variant ${child}`}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <span className="text-3xl text-gray-400">
                                              +
                                            </span>
                                          )}
                                          <input
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onClick={() => {
                                              setCurrentVariant({
                                                index,
                                                child,
                                              });
                                              setIsPopupVisible(true);
                                            }}
                                          />
                                          {/* {image?.preview && (
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
                                          )} */}
                                        </label>
                                      </div>

                                      <span
                                        className="text-sm font-medium text-blue-500 underline hover:text-blue-800 transition cursor-pointer whitespace-nowrap"
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
                                        <span className="w-20 p-1 pl-6   text-sm ">
                                          {price || "N/A"}
                                        </span>
                                      </div>

                                      <div className="relative w-20 ">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">
                                          $
                                        </span>
                                        <span className="w-20 p-1 pl-6   text-sm r">
                                          {compareAtPrice || "N/A"}
                                        </span>
                                      </div>

                                      <span className="w-20 p-1  text-sm r">
                                        {sku || "N/A"}
                                      </span>
                                      <span className="w-20 p-1  text-sm r">
                                        {quantity}
                                      </span>

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
              {/* <div ref={containerRef} className="relative w-full">
                <label className="block text-sm text-gray-600 mb-1">
                  Category
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search category..."
                  className="w-full border border-gray-300 p-2 rounded-xl"
                />

                {searchTerm.trim() !== "" && filteredCategories.length > 0 && (
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
              </div> */}
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
                          const parentValue =
                            combinations[currentVariant.index]?.parent;
                          const combinationString = `${parentValue} / ${currentVariant.child}`;

                          setVariantImages((prev) => ({
                            ...prev,
                            [combinationString]: { preview: file.src },
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
                          `${combinations[currentVariant.index]?.parent} / ${
                            currentVariant.child
                          }`
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
                      className={`border rounded p-2 relative ${
                        variantImages[normalizedKey]?.preview === file.src
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      <div
                        onClick={() => {
                          if (currentVariant) {
                            setVariantImages((prev) => ({
                              ...prev,
                              [normalizedKey]: {
                                preview: file.src,
                                loading: false,
                              },
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
                          variantImages[normalizedKey]?.preview === file.src
                        }
                        readOnly
                      />

                      <p className="text-sm text-center mt-2 truncate">
                        {file.name || "Image"}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end mt-6 border-t pt-4">
                <button
                  onClick={() => setIsPopupVisible(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 mr-2 mt-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => console.log(variantImages)}
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
