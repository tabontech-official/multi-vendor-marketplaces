import React, { useEffect, useRef, useState } from "react";
import { HiOutlineCheckCircle, HiOutlineXCircle, HiPlus } from "react-icons/hi";
import { FaArrowDown, FaArrowUp, FaCross, FaFileImport } from "react-icons/fa";
import Papa from "papaparse";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UseFetchUserData from "../component/fetchUser";
import { useAuthContext } from "../Hooks/useAuthContext";
import { HiOutlineRefresh } from "react-icons/hi";
import { jwtDecode } from "jwt-decode";
import { MdEdit } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiImport } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import { useNotification } from "../context api/NotificationContext";
import * as XLSX from "xlsx"; // Make sure you imported this at the top

const Dashboard = () => {
  let admin;
  const { addNotification } = useNotification();
  const location = useLocation();

  // const isAdmin = () => {
  //   const token = localStorage.getItem("usertoken");
  //   if (token) {
  //     const decoded = jwtDecode(token);
  //     if (decoded.payLoad.isAdmin && decoded.exp * 1000 > Date.now()) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };

  // admin = isAdmin();

  // const limit = 20;

  const navigate = useNavigate();
  const { userData, loading, error, variantId } = UseFetchUserData();
  const [starting, setStarting] = useState(0);
  const [ending, setEnding] = useState(10);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchVal, setSearchVal] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { user } = useAuthContext();
  const dropdownRefs = useRef([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStarted, setUploadStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [limit, setLimit] = useState(50); // default 50

  const modalRef = useRef();
  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);
  const [Loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isExportOpen, setIsexportOpen] = useState(false);
  const [exportOption, setExportOption] = useState("current");
  const [isExporting, setIsExporting] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [exportAs, setExportAs] = useState("csv");
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };
  const togglePopup = () => setIsexportOpen(!isOpen);

  // const getUniqueOptions = (criteria) => {
  //   switch (criteria) {
  //     case "listing_name":
  //       return [...new Set(products.map((p) => p.title).filter(Boolean))];
  //     case "approval":
  //       return [
  //         ...new Set(products.map((p) => p.approvalStatus).filter(Boolean)),
  //       ];
  //     case "sku":
  //       return [
  //         ...new Set(products.map((p) => p.variants?.[0]?.sku).filter(Boolean)),
  //       ];
  //     case "price":
  //       return [
  //         ...new Set(
  //           products
  //             .map((p) => p.variants?.[0]?.price?.toString())
  //             .filter(Boolean)
  //         ),
  //       ];
  //     case "product_type":
  //       return [
  //         ...new Set(products.map((p) => p.product_type).filter(Boolean)),
  //       ];
  //     case "vendor":
  //       return [...new Set(products.map((p) => p.vendor).filter(Boolean))];

  //     // ✅ Published By (unique publishers usernames)
  //     case "published_by":
  //       return [...new Set(products.map((p) => p.username).filter(Boolean))];

  //     default:
  //       return [];
  //   }
  // };
  const formatCurrency = (value) => {
    return `$${Number(value).toFixed(2)}`;
  };

  const predefinedRanges = [
    { min: 0, max: 50 },
    { min: 50, max: 100 },
    { min: 100, max: 200 },
    { min: 200, max: 300 },
    { min: 300, max: 400 },
    { min: 400, max: 500 },
    { min: 500, max: 750 },
    { min: 750, max: 1000 },
    { min: 1000, max: 2000 },
    { min: 2000, max: 3000 },
    { min: 3000, max: 5000 },
    { min: 5000, max: 7500 },
    { min: 7500, max: 10000 },
    { min: 10000, max: 20000 },
    { min: 20000, max: 50000 },
    { min: 50000, max: Infinity }, // catch-all above 50k
  ];

  const getUniqueOptions = (criteria) => {
    let options = [];
    switch (criteria) {
      case "listing_name":
        options = [...new Set(products.map((p) => p.title).filter(Boolean))];
        break;
      case "approval":
        options = [
          ...new Set(products.map((p) => p.approvalStatus).filter(Boolean)),
        ];
        break;
      case "sku":
        options = [
          ...new Set(products.map((p) => p.variants?.[0]?.sku).filter(Boolean)),
        ];
        break;
      case "price": {
        const prices = products
          .map((p) => parseFloat(p.variants?.[0]?.price))
          .filter((price) => !isNaN(price));

        if (prices.length === 0) return [];

        return predefinedRanges
          .filter((range) =>
            prices.some((price) => price >= range.min && price <= range.max),
          )
          .map(
            (range) =>
              `${formatCurrency(range.min)} - ${
                range.max === Infinity ? "Above" : formatCurrency(range.max)
              }`,
          );
      }

      case "product_type":
        options = [
          ...new Set(products.map((p) => p.product_type).filter(Boolean)),
        ];
        break;
      case "vendor":
        options = [...new Set(products.map((p) => p.vendor).filter(Boolean))];
        break;
      case "published_by":
        options = [...new Set(products.map((p) => p.username).filter(Boolean))];
        break;
      default:
        return [];
    }

    return options.sort((a, b) => a.localeCompare(b));
  };

  // useEffect(() => {
  //   if (sortBy && sortValue) {
  //     const filtered = products.filter((p) => {
  //       switch (sortBy) {
  //         case "listing_name":
  //           return p.title === sortValue;
  //         case "approval":
  //           return p.approvalStatus === sortValue;
  //         case "sku":
  //           return p.variants?.[0]?.sku === sortValue;
  //         case "price":
  //           return p.variants?.[0]?.price?.toString() === sortValue;
  //         case "product_type":
  //           return p.product_type === sortValue;
  //         case "vendor":
  //           return p.vendor === sortValue;

  //         // ✅ Published By filter
  //         case "published_by":
  //           return p.username === sortValue;

  //         default:
  //           return true;
  //       }
  //     });
  //     setFilteredProducts(filtered);
  //   } else {
  //     setFilteredProducts(products);
  //   }
  // }, [sortBy, sortValue, products]);

  useEffect(() => {
    if (sortBy && sortValue) {
      const filtered = products.filter((p) => {
        switch (sortBy) {
          case "listing_name":
            return p.title === sortValue;
          case "approval":
            return p.approvalStatus === sortValue;
          case "sku":
            return p.variants?.[0]?.sku === sortValue;
          case "price": {
            const price = parseFloat(p.variants?.[0]?.price || 0);

            if (sortValue.includes("Above")) {
              const [minStr] = sortValue
                .split("-")
                .map((val) => parseFloat(val.replace(/[^0-9.]/g, "")));
              return price >= minStr;
            }

            const [minStr, maxStr] = sortValue
              .split("-")
              .map((val) => parseFloat(val.replace(/[^0-9.]/g, "")));

            return price >= minStr && price <= maxStr;
          }

          case "product_type":
            return p.product_type === sortValue;
          case "vendor":
            return p.vendor === sortValue;
          case "published_by":
            return p.username === sortValue;
          default:
            return true;
        }
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [sortBy, sortValue, products]);

  const toggleSelection = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId],
    );
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };
  const [userRole, setUserRole] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const totalPages = Math.ceil(totalProducts / limit);
  useEffect(() => {
    const errorData = sessionStorage.getItem("imageUploadError");

    if (errorData) {
      const { message, productTitle } = JSON.parse(errorData);

      // showToast(
      //   "Failed",
      //   `Image upload failed for "${productTitle}": ${message}`,
      //   {
      //     position: "top-right",
      //     autoClose: 6000,
      //   }
      // );

      // 🔥 clear after showing
      sessionStorage.removeItem("imageUploadError");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      if (decoded?.payLoad?.role) {
        setUserRole(decoded.payLoad.role); // store role in state
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const fetchProductData = async () => {
    setLoading(true);
    const id = localStorage.getItem("userid");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");

    try {
      const isAdmin = userRole === "Dev Admin" || userRole === "Master Admin";

      const url = isAdmin
        ? `https://multi-vendor-marketplace.vercel.app/product/getAllProducts?page=${page}&limit=${limit}`
        : `https://multi-vendor-marketplace.vercel.app/product/getProduct/${id}?page=${page}&limit=${limit}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          "x-api-secret": apiSecretKey,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        const sortedProducts = data.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts);

        if (data.totalProducts) {
          setTotalProducts(data.totalProducts);
        }

        setHasMore(page < data.totalPages);
      } else {
        console.error("Unauthorized or server error:", response.status);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleUploadAndPreview = async () => {
  //   if (!selectedFile) return;

  //   setIsUploading(true);
  //   setUploadStarted(true);
  //   closePopup();

  //   const userId = localStorage.getItem("userid");
  //   const apiKey = localStorage.getItem("apiKey");
  //   const apiSecretKey = localStorage.getItem("apiSecretKey");

  //   if (!userId) {
  //     showToast("error", "User ID not found.");
  //     return;
  //   }

  //   showToast("success", `Uploading "${selectedFile.name}" in background...`);
  //   addNotification(
  //     `Product CSV upload started for "${selectedFile.name}"`,
  //     "Manage product"
  //   );

  //   Papa.parse(selectedFile, {
  //     header: true,
  //     skipEmptyLines: true,
  //     complete: async function (results) {
  //       const allRows = results.data;
  //       const chunkSize = 25;

  //       const totalChunks = Math.ceil(allRows.length / chunkSize);

  //       for (let i = 0; i < allRows.length; i += chunkSize) {
  //         const chunk = allRows.slice(i, i + chunkSize);
  //         const chunkCsv = Papa.unparse(chunk);
  //         const chunkBlob = new Blob([chunkCsv], { type: "text/csv" });

  //         const formData = new FormData();
  //         formData.append("file", chunkBlob, `chunk_${i / chunkSize + 1}.csv`);

  //         try {
  //           const response = await fetch(
  //             `https://multi-vendor-marketplace.vercel.app/product/upload-product-csv`,
  //             {
  //               method: "POST",
  //               body: formData,
  //               headers: {
  //                 "x-api-key": apiKey,
  //                 "x-api-secret": apiSecretKey,
  //               },
  //             }
  //           );

  //           const result = await response.json();

  //           if (response.ok) {
  //             showToast("success", ` Chunk ${i / chunkSize + 1} uploaded.`);
  //             addNotification(
  //               `Chunk ${i / chunkSize + 1} of uploaded.`,
  //               "Manage product"
  //             );
  //           } else {
  //             showToast(
  //               "error",
  //               ` Chunk ${i / chunkSize + 1} failed: ${
  //                 result.message || "Unknown error"
  //               }`
  //             );
  //             addNotification(
  //               ` Chunk ${i / chunkSize + 1} failed.`,
  //               "Manage product"
  //             );
  //           }
  //         } catch (error) {
  //           showToast(
  //             "error",
  //             `Error in chunk ${i / chunkSize + 1}: ${error.message}`
  //           );
  //           addNotification(
  //             ` Upload error in chunk ${i / chunkSize + 1}`,
  //             "Manage product"
  //           );
  //         }

  //         await new Promise((resolve) => setTimeout(resolve, 2000));
  //       }

  //       showToast(
  //         "success",
  //         ` File "${selectedFile.name}" uploaded successfully in ${totalChunks} chunks!`
  //       );
  //       addNotification(
  //         ` Upload complete: "${selectedFile.name}" processed`,
  //         "Manage product"
  //       );

  //       setIsUploading(false);
  //       setUploadStarted(false);
  //       setSelectedFile(null);
  //     },
  //     error: function (err) {
  //       showToast("error", ` CSV parsing failed: ${err.message}`);
  //       setIsUploading(false);
  //       setUploadStarted(false);
  //     },
  //   });
  // };

  const handleUploadAndPreview = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    closePopup();

    const userId = localStorage.getItem("userid");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");

    showToast("success", `Uploading "${selectedFile.name}" in background...`);
    addNotification(
      `Excel upload started for "${selectedFile.name}"`,
      "Manage product",
    );

    try {
      // ----------- READ EXCEL FILE -----------
      const fileBuffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(fileBuffer, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const allRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      const chunkSize = 25;

      const totalChunks = Math.ceil(allRows.length / chunkSize);

      // ----------- PROCESS CHUNKS -----------
      for (let i = 0; i < allRows.length; i += chunkSize) {
        const chunk = allRows.slice(i, i + chunkSize);

        // Convert JSON → CSV because your backend expects CSV
        const csvData = Papa.unparse(chunk);
        const chunkBlob = new Blob([csvData], { type: "text/csv" });

        const formData = new FormData();
        formData.append(
          "file",
          chunkBlob,
          `excel_chunk_${Math.floor(i / chunkSize) + 1}.csv`,
        );

        try {
          const response = await fetch(
            "https://multi-vendor-marketplace.vercel.app/product/upload-product-csv",
            {
              method: "POST",
              headers: {
                "x-api-key": apiKey,
                "x-api-secret": apiSecretKey,
              },
              body: formData,
            },
          );

          const result = await response.json();

          if (response.ok) {
            showToast(
              "success",
              `Chunk ${Math.floor(i / chunkSize) + 1} uploaded successfully`,
            );
            addNotification(
              `Chunk ${Math.floor(i / chunkSize) + 1} uploaded`,
              "Manage product",
            );
          } else {
            showToast(
              "error",
              `Chunk ${Math.floor(i / chunkSize) + 1} failed: ${
                result.message || "Unknown error"
              }`,
            );
            addNotification(
              `Chunk ${Math.floor(i / chunkSize) + 1} failed`,
              "Manage product",
            );
          }
        } catch (err) {
          showToast(
            "error",
            `Error uploading chunk ${Math.floor(i / chunkSize) + 1}: ${
              err.message
            }`,
          );
          addNotification(
            `Upload error in chunk ${Math.floor(i / chunkSize) + 1}`,
            "Manage product",
          );
        }

        // Delay between chunks
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // ----------- UPLOAD DONE -----------
      showToast(
        "success",
        `Excel "${selectedFile.name}" uploaded successfully (${totalChunks} chunks)`,
      );
      addNotification(
        `Upload complete: "${selectedFile.name}"`,
        "Manage product",
      );
    } catch (error) {
      showToast("error", "Excel file parsing failed: " + error.message);
    }

    setIsUploading(false);
    setSelectedFile(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closePopup();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // const OnEdit = (product) => {
  //   console.log(product);
  //   console.log("clicking");

  //   let formPage = "/add-product";

  //   navigate(formPage, { state: { product } });
  // };

  const OnEdit = (product) => {
    if (!product?.id && !product?._id) return;

    // Shopify id ya DB id jo tum use karte ho
    const productId = product.id || product._id;

    navigate(`/edit-product/${productId}`, {
      state: { product },
    });
  };

  const onDeleteSelected = () => {
    setIsPopupOpen(true);
  };

  // const deleteSelectedProducts = async () => {
  //   const apiKey = localStorage.getItem("apiKey");
  //   const apiSecretKey = localStorage.getItem("apiSecretKey");
  //   try {
  //     setIsLoading(true);
  //     await Promise.all(
  //       selectedProducts.map(async (id) => {
  //         const response = await fetch(
  //           `https://multi-vendor-marketplace.vercel.app/product/deleteProduct/${id}`,
  //           {
  //             method: "DELETE",
  //             headers: {
  //               "x-api-key": apiKey,
  //               "x-api-secret": apiSecretKey,
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );
  //         if (!response.ok) throw new Error("Failed to delete product");
  //         addNotification(`${product.title} unpublished successfully!`);

  //       })
  //     );

  //     setProducts(products.filter((p) => !selectedProducts.includes(p._id)));
  //     setFilteredProducts(
  //       filteredProducts.filter((p) => !selectedProducts.includes(p._id))
  //     );
  //     setSelectedProducts([]);
  //   } catch (error) {
  //     console.error("Error deleting products:", error);
  //   } finally {
  //     setIsLoading(false);
  //     setIsPopupOpen(false);
  //   }
  // };

  const deleteSelectedProducts = async () => {
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");

    try {
      setIsLoading(true);
      await Promise.all(
        selectedProducts.map(async (id) => {
          const product = filteredProducts.find((p) => p._id === id);

          const response = await fetch(
            `https://multi-vendor-marketplace.vercel.app/product/deleteProduct/${id}`,
            {
              method: "DELETE",
              headers: {
                "x-api-key": apiKey,
                "x-api-secret": apiSecretKey,
                "Content-Type": "application/json",
              },
            },
          );

          if (!response.ok) throw new Error("Failed to delete product");

          if (product) {
            addNotification(
              `${product.title} deleted successfully!`,
              "Manage product",
            );
          }
          window.location.reload();
        }),
      );

      setProducts(products.filter((p) => !selectedProducts.includes(p._id)));
      setFilteredProducts(
        filteredProducts.filter((p) => !selectedProducts.includes(p._id)),
      );
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error deleting products:", error);
    } finally {
      setIsLoading(false);
      setIsPopupOpen(false);
    }
  };

  const handlePublishSelected = async () => {
    const userId = localStorage.getItem("userid");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    setMessage("");

    try {
      await Promise.all(
        selectedProducts.map(async (id) => {
          const product = filteredProducts.find((p) => p._id === id);
          if (product?.status === "draft") {
            const response = await fetch(
              ` https://multi-vendor-marketplace.vercel.app/product/publishedProduct/${id}`,
              {
                method: "PUT",
                body: JSON.stringify({ userId }),
                headers: {
                  "x-api-key": apiKey,
                  "x-api-secret": apiSecretKey,
                  "Content-Type": "application/json",
                },
              },
            );
            if (!response.ok) throw new Error("Failed to publish product");
            addNotification(
              `${product.title} published successfully!`,
              "Manage product",
            );
          }
        }),
      );

      showToast("success", "Selected products published successfully!");
      fetchProductData();
      setSelectedProducts([]);
    } catch (error) {
      showToast("Failed", error.message || "Error occurred while publishing.");
    }
  };

  const handleUnpublishSelected = async () => {
    setMessage("");

    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    try {
      await Promise.all(
        selectedProducts.map(async (id) => {
          const product = filteredProducts.find((p) => p._id === id);
          if (product?.status === "active") {
            const response = await fetch(
              ` https://multi-vendor-marketplace.vercel.app/product/unpublished/${id}`,
              {
                method: "PUT",
                headers: {
                  "x-api-key": apiKey,
                  "x-api-secret": apiSecretKey,
                  "Content-Type": "application/json",
                },
              },
            );
            if (!response.ok) throw new Error("Failed to unpublish product");
            addNotification(
              `${product.title} unpublished successfully!`,
              "Manage product",
            );
          }
        }),
      );

      showToast("success", "Selected products unpublished successfully!");
      fetchProductData();
      setSelectedProducts([]);
    } catch (error) {
      showToast(
        "Failed",
        error.message || "Error occurred while unpublishing.",
      );
    }
  };

  const handleSearch = () => {
    let filtered =
      searchVal === ""
        ? products
        : products.filter((product) => {
            const titleMatch = product.title
              ?.toLowerCase()
              .includes(searchVal.toLowerCase());
            const typeMatch = product.product_type
              ?.toLowerCase()
              .includes(searchVal.toLowerCase());

            const skuMatch = product.variants?.some((variant) =>
              variant.sku?.toLowerCase().includes(searchVal.toLowerCase()),
            );

            return titleMatch || typeMatch || skuMatch;
          });

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchVal]);

  useEffect(() => {
    if (userRole) {
      fetchProductData(); // this already handles page + limit
    }
  }, [userRole, page, limit]);

  // useEffect(() => {
  //   const fetchProductData2 = async () => {
  //     const id = localStorage.getItem("userid");
  //     const apiKey = localStorage.getItem("apiKey");
  //     const apiSecretKey = localStorage.getItem("apiSecretKey");

  //     try {
  //       const isAdmin = userRole === "Dev Admin" || userRole === "Master Admin";

  //       const url = isAdmin
  //         ? `https://multi-vendor-marketplace.vercel.app/product/getAllProducts/?page=${page}&limit=${limit}`
  //         : `https://multi-vendor-marketplace.vercel.app/product/getProduct/${id}?page=${page}&limit=${limit}`;

  //       const response = await fetch(url, {
  //         method: "GET",
  //         headers: {
  //           "x-api-key": apiKey,
  //           "x-api-secret": apiSecretKey,
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log("Second Product render", data);

  //         const sortedProducts = data.products.sort(
  //           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //         );

  //         setProducts((prev) => [
  //           ...prev,
  //           ...sortedProducts.filter(
  //             (newProduct) =>
  //               !prev.some((prevProduct) => prevProduct.id === newProduct.id)
  //           ),
  //         ]);

  //         setFilteredProducts((prev) => [
  //           ...prev,
  //           ...sortedProducts.filter(
  //             (newProduct) =>
  //               !prev.some((prevProduct) => prevProduct.id === newProduct.id)
  //           ),
  //         ]);

  //         setHasMore(page < data.totalPages);
  //         console.log("Has more:", page < data.totalPages);
  //       } else {
  //         console.error("Unauthorized or error status:", response.status);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     }
  //   };

  //   if (userRole) {
  //     fetchProductData2(); // Trigger only after role is known
  //   }
  // }, [page, userRole]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const userId = localStorage.getItem("userid");
      if (!userId) {
        alert("User ID not found in localStorage");
        return;
      }

      const queryParams = new URLSearchParams({
        userId,
        type: exportOption,
        ...(exportOption === "current" && { page, limit: 10 }),
      });

      if (exportOption === "selected") {
        if (!selectedProducts.length) {
          alert("No products selected for export.");
          setIsExporting(false);
          return;
        }
        queryParams.append("productIds", selectedProducts.join(","));
      }

      const exportUrl = `https://multi-vendor-marketplace.vercel.app/product/csvEportFile/?${queryParams.toString()}`;

      const response = await fetch(exportUrl);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Export failed");
      }

      addNotification("Products export successfully", "Manage product");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `products-${exportOption}-${Date.now()}.xlsx`,
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setIsexportOpen(false);
    } catch (error) {
      alert("Export failed: " + error.message);
    } finally {
      setIsExporting(false);
    }
  };
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      const allProductIds = filteredProducts.map((p) => p._id);
      setSelectedProducts(allProductIds);
    }
    setSelectAll(!selectAll);
  };
  useEffect(() => {
    const allSelected =
      filteredProducts.length > 0 &&
      filteredProducts.every((p) => selectedProducts.includes(p._id));
    setSelectAll(allSelected);
  }, [selectedProducts, filteredProducts]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    query.set("page", page);
    query.set("limit", limit);
    navigate(`?${query.toString()}`, { replace: true });
  }, [page, limit, navigate, location.search]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const urlPage = parseInt(query.get("page")) || 1;
    const urlLimit = parseInt(query.get("limit")) || 50;

    setPage(urlPage);
    setLimit(urlLimit);
  }, [location.search]);

  const [sortField, setSortField] = useState(null); // "title" ya "sku"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" ya "desc"

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);

    const sortedProducts = [...filteredProducts].sort((a, b) => {
      let valA, valB;

      switch (field) {
        case "title":
          valA = a.title?.toLowerCase() || "";
          valB = b.title?.toLowerCase() || "";
          break;
        case "sku":
          valA = a.variants?.[0]?.sku?.toLowerCase() || "";
          valB = b.variants?.[0]?.sku?.toLowerCase() || "";
          break;
        case "price":
          valA = parseFloat(a.variants?.[0]?.price || 0);
          valB = parseFloat(b.variants?.[0]?.price || 0);
          break;
        case "compare_at_price":
          valA = parseFloat(a.variants?.[0]?.compare_at_price || 0);
          valB = parseFloat(b.variants?.[0]?.compare_at_price || 0);
          break;
        case "inventory":
          valA = parseFloat(a.variants?.[0]?.inventory_quantity || 0);
          valB = parseFloat(b.variants?.[0]?.inventory_quantity || 0);
          break;
        default:
          valA = 0;
          valB = 0;
      }

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredProducts(sortedProducts);
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const getProductPreviewImage = (product) => {
    // 1️⃣ Product media image
    if (product.images?.length > 0) {
      return product.images[0].src;
    }

    // 2️⃣ Variant images (first available)
    if (product.variantImages?.length > 0) {
      for (const variantBlock of product.variantImages) {
        if (variantBlock.images?.length > 0) {
          return variantBlock.images[0].src;
        }
      }
    }

    // 3️⃣ Nothing found
    return null;
  };

  return user ? (
    <main className="w-full p-4 ">
      {toast.show && (
        <div
          className={`fixed top-16 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-gray-200 pb-4 gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 mb-0.5">
            Manage products
          </h1>
          <p className="text-sm text-gray-500">Manage your products here.</p>
        </div>

        <div className="flex-1 w-full max-w-sm mx-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="flex-1 flex flex-wrap items-center justify-end gap-2 w-full">
          {selectedProducts.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                // className="bg-[#1A1A1A] hover:bg-gray-900 text-white px-3 h-8 text-sm font-medium rounded-md transition duration-200 flex items-center gap-1.5"
                className="bg-gray-800 hover:bg-gray-900 text-white px-3 h-8 text-sm font-medium rounded-md flex items-center gap-1.5 shadow-sm"
              >
                <span>More actions</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        handlePublishSelected();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Published
                    </button>
                    <button
                      onClick={() => {
                        handleUnpublishSelected();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Unpublished
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        onDeleteSelected();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={openPopup}
            className="bg-gray-400 border border-gray-300 hover:bg-gray-500 text-gray-800 px-3 h-8 text-sm font-medium rounded-md flex items-center gap-1.5 shadow-sm"
          >
            <CiImport className="w-4 h-4" />
            <span>Import</span>
          </button>

          <button
            onClick={togglePopup}
            className="bg-gray-400 border border-gray-300 hover:bg-gray-500 text-gray-800 px-3 h-8 text-sm font-medium rounded-md flex items-center gap-1.5 shadow-sm"
          >
            <FaFileImport className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        {filteredProducts.length === 0 && !Loading ? (
          <div className="text-center py-10 text-gray-500">
            <h2>No products available.</h2>
          </div>
        ) : (
          <div className="w-full overflow-x-auto border rounded-lg bg-white shadow-sm">
            <table className="min-w-full border-collapse text-medium">
              <thead className="bg-gray-100 text-gray-600 text-sm  sticky top-0">
                <tr>
                  <th className="p-3 text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer align-middle"
                      checked={selectAll}
                      onChange={() => handleSelectAll()}
                    />
                  </th>
                  <th className="p-3 whitespace-nowrap text-left">Status</th>
                  {/* <th className="p-3 whitespace-nowrap text-left">Image</th> */}
                  <th className="p-3 whitespace-nowrap text-left"></th>

                  <th
                    className="p-3 cursor-pointer whitespace-nowrap text-left"
                    onClick={() => {
                      let nextOrder = "asc";
                      if (sortField === "title" && sortOrder === "asc")
                        nextOrder = "desc";
                      handleSort("title", nextOrder);
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Listing Name</span>
                      {sortField === "title" ? (
                        sortOrder === "asc" ? (
                          <FaArrowUp className="text-blue-500" />
                        ) : (
                          <FaArrowDown className="text-blue-500" />
                        )
                      ) : (
                        <FaArrowUp className="text-gray-400" />
                      )}
                    </div>
                  </th>

                  {(userRole === "Dev Admin" ||
                    userRole === "Master Admin") && (
                    <th className="p-3 whitespace-nowrap text-left">
                      Merchant
                    </th>
                  )}
                  <th className="p-3 whitespace-nowrap text-left">Approval</th>
                  {/* <th className="p-3 whitespace-nowrap text-left">SKU</th> */}
                  {/* <th className="p-3 whitespace-nowrap text-left">Price</th> */}
                  {/* <th className="p-3 whitespace-nowrap text-left">Compare</th> */}
                  <th className="p-3 whitespace-nowrap text-left">Type</th>
                  <th className="p-3 whitespace-nowrap text-left">Inventory</th>
                  <th className="p-3 whitespace-nowrap text-left">Vendor</th>
                  {admin && (
                    <th className="p-3 whitespace-nowrap text-left">
                      Publisher ID
                    </th>
                  )}
                  <th className="p-3 whitespace-nowrap text-left">Edit</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {Loading ? (
                  <tr>
                    <td
                      colSpan="100%"
                      className="py-10 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer align-middle"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => toggleSelection(product._id)}
                        />
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`inline-block w-3 h-3 rounded-full ${
                            product.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        {(() => {
                          const previewImage = getProductPreviewImage(product);

                          return previewImage ? (
                            <img
                              src={previewImage}
                              alt="Product image"
                              className="w-10 h-10 object-cover rounded border"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">
                              No Image
                            </span>
                          );
                        })()}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        {product.title !== "Job Listing"
                          ? product.title
                          : "Job Search Listing"}
                      </td>

                      {(userRole === "Dev Admin" ||
                        userRole === "Master Admin") && (
                        <td className="p-3 text-gray-700 whitespace-nowrap">
                          {product?.username}
                        </td>
                      )}

                      <td className="p-3 whitespace-nowrap">
                        {product?.approvalStatus ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                              product.approvalStatus === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : product.approvalStatus === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : product.approvalStatus === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {product.approvalStatus}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* <td className="p-3 text-gray-600 whitespace-nowrap">
                        {product.variants?.[0]?.sku || "N/A"}
                      </td> */}

                      {/* <td className="p-3 font-semibold whitespace-nowrap">
                        $
                        {parseFloat(product.variants?.[0]?.price || 0).toFixed(
                          2,
                        )}
                      </td> */}

                      {/* <td className="p-3 text-gray-500 whitespace-nowrap">
                        $
                        {parseFloat(
                          product.variants?.[0]?.compare_at_price || 0,
                        ).toFixed(2)}
                      </td> */}

                      <td className="p-3 whitespace-nowrap">
                        {product.product_type || "N/A"}
                      </td>

                      <td className="p-3 text-gray-700 whitespace-nowrap">
                        {(() => {
                          const totalQuantity = product.variants?.reduce(
                            (sum, v) =>
                              sum + (parseFloat(v.inventory_quantity) || 0),
                            0,
                          );
                          const variantCount = product.variants?.length || 0;
                          return `${totalQuantity} (${variantCount} Var)`;
                        })()}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        {product.vendor || "N/A"}
                      </td>

                      {admin && (
                        <td className="p-3 text-gray-600 whitespace-nowrap font-mono text-xs">
                          #{product.shopifyId}
                        </td>
                      )}

                      <td className="p-3 whitespace-nowrap">
                        <button
                          className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition"
                          onClick={() => OnEdit(product)}
                        >
                          <MdEdit className="mr-1" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="100%"
                      className="py-10 text-center text-gray-500"
                    >
                      No products available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex flex-col md:flex-row justify-between items-center  px-4 py-3 bg-gray-50 border border-gray-200 ">
                <div className="text-sm text-gray-700 mb-2 md:mb-0">
                  Total Products{" "}
                  <span className="font-medium">{totalProducts}</span>
                </div>

                {/* Center: Page Numbers */}
                <div className="flex items-center space-x-2 mb-2 md:mb-0">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className={`px-3 py-1 border rounded ${
                      page === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    &lt;
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3 py-1 border rounded ${
                          page === p
                            ? "bg-blue-500 text-white"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className={`px-3 py-1 border rounded ${
                      page === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    &gt;
                  </button>
                </div>

                {/* Right: Limit Selector */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">
                    Products per page:
                  </label>
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1); // reset to page 1 on limit change
                      setProducts([]);
                      setFilteredProducts([]);
                    }}
                  >
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative transform scale-95 animate-zoomIn transition-all duration-300"
          >
            <div className="border-b px-4 py-3 flex justify-between items-center">
              <h2 className="text-sm font-semibold text-gray-800">
                Import products by Excel
              </h2>
              <button
                onClick={closePopup}
                className="text-gray-500 hover:text-red-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-md flex justify-center items-center h-32 mb-4 relative">
                <input
                  type="file"
                  accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleCSVUpload}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
                <span className="px-4 py-2 text-sm text-white font-semibold bg-[#18181b] border border-gray-300 rounded-lg hover:bg-blue-700">
                  Add file
                </span>
                {selectedFile && (
                  <span className="absolute bottom-2 text-sm text-gray-600">
                    {selectedFile.name}
                  </span>
                )}
              </div>
              <a
                href="/sample-product.xlsx"
                download
                className="text-sm text-gray-800 underline cursor-pointer mb-4 inline-block"
              >
                Download sample Excel file
              </a>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closePopup}
                  className="px-4 py-1 text-sm border font-semibold text-white  bg-red-600 border-gray-300 rounded-lg hover:bg-red-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadAndPreview}
                  disabled={!selectedFile || isUploading}
                  className={`px-4 py-2 text-sm rounded-lg transition ${
                    selectedFile && !isUploading
                      ? "bg-[#18181b] text-white hover:bg-gray-900 font-semibold"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                >
                  {isUploading ? "Uploading..." : "Upload and preview"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fadeInUp p-8 relative border border-gray-200">
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black transition"
            >
              ✕
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Approval
              </h2>
              <p className="text-gray-600">
                Are you sure you want to delete the selected products?
              </p>

              <button
                onClick={deleteSelectedProducts}
                className={`mt-6 inline-block px-6 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-full hover:opacity-90 transition ${
                  isLoading ? "opacity-50 cursor-wait" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="spinner-border animate-spin w-5 h-5 border-t-2 border-b-2 border-white rounded-full"></div>
                ) : (
                  "Okay"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {isExportOpen && (
        <div
          onClick={() => setIsexportOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative transform scale-95 animate-zoomIn transition-all duration-300"
          >
            <div className="flex justify-between border-b border-gray-200">
              <h2 className="text-md text-gray-600 font-semibold mb-2">
                Export products
              </h2>
              <RxCross1
                onClick={() => setIsexportOpen(false)}
                className="hover:text-red-500 cursor-pointer"
              />
            </div>

            <p className="text-sm mb-3 mt-3">
              This CSV file can update all product information. To update just
              inventory quantities use the{" "}
              <a
                href="/sample-inventory.csv"
                download
                className="text-blue-600 underline"
              >
                file for inventory
              </a>
              .
            </p>

            <div className="mb-4">
              <label className="text-md text-gray-600 font-semibold block mb-2">
                Export
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="exportOption"
                    value="current"
                    checked={exportOption === "current"}
                    onChange={() => setExportOption("current")}
                  />
                  Current page
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="exportOption"
                    value="all"
                    checked={exportOption === "all"}
                    onChange={() => setExportOption("all")}
                  />
                  All products
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="exportOption"
                    value="selected"
                    checked={exportOption === "selected"}
                    onChange={() => setExportOption("selected")}
                  />
                  Selected products only
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-md text-gray-600 font-semibold block mb-2">
                Export as
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="exportAs"
                  value="csv"
                  checked={exportAs === "csv"}
                  onChange={() => setExportAs("csv")}
                />
                CSV for Excel, Numbers, or other spreadsheet programs
              </label>
              {/* <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="exportAs"
                  value="plain"
                  checked={exportAs === "plain"}
                  onChange={() => setExportAs("plain")}
                />
                Plain CSV file
              </label> */}
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-300">
              <button
                onClick={() => setIsexportOpen(false)}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg mt-2"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className={`px-4 py-2 rounded-lg mt-2 flex items-center gap-2 ${
                  isExporting ? "bg-[#18181b]" : "bg-[#18181b]"
                } text-white`}
              >
                {isExporting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Exporting...
                  </>
                ) : (
                  "Export products"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  ) : null;
};

export default Dashboard;
