import React, { useEffect, useRef, useState } from "react";
import { HiOutlineCheckCircle, HiOutlineXCircle, HiPlus } from "react-icons/hi";
import { FaCross, FaFileImport } from "react-icons/fa";
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

  const getUniqueOptions = (criteria) => {
    switch (criteria) {
      case "listing_name":
        return [...new Set(products.map((p) => p.title).filter(Boolean))];
      case "approval":
        return [
          ...new Set(products.map((p) => p.approvalStatus).filter(Boolean)),
        ];
      case "sku":
        return [
          ...new Set(products.map((p) => p.variants?.[0]?.sku).filter(Boolean)),
        ];
      case "price":
        return [
          ...new Set(
            products
              .map((p) => p.variants?.[0]?.price?.toString())
              .filter(Boolean)
          ),
        ];
      case "product_type":
        return [
          ...new Set(products.map((p) => p.product_type).filter(Boolean)),
        ];
      case "vendor":
        return [...new Set(products.map((p) => p.vendor).filter(Boolean))];

      // ✅ Published By (unique publishers usernames)
      case "published_by":
        return [...new Set(products.map((p) => p.username).filter(Boolean))];

      default:
        return [];
    }
  };

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
          case "price":
            return p.variants?.[0]?.price?.toString() === sortValue;
          case "product_type":
            return p.product_type === sortValue;
          case "vendor":
            return p.vendor === sortValue;

          // ✅ Published By filter
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
        : [...prevSelected, productId]
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

  // const fetchProductData = async () => {
  //   setLoading(true);
  //   const id = localStorage.getItem("userid");
  //   const apiKey = localStorage.getItem("apiKey");
  //   const apiSecretKey = localStorage.getItem("apiSecretKey");

  //   try {
  //     const isAdmin = userRole === "Dev Admin" || userRole === "Master Admin";

  //     const url = isAdmin
  //       ? `https://multi-vendor-marketplace.vercel.app/product/getAllProducts/?page=${page}&limit=${limit}`
  //       : `https://multi-vendor-marketplace.vercel.app/product/getProduct/${id}?page=${page}&limit=${limit}`;

  //     const response = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         "x-api-key": apiKey,
  //         "x-api-secret": apiSecretKey,
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (response.ok) {
  //       const data = await response.json();

  //       const sortedProducts = data.products.sort(
  //         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //       );

  //       setProducts(sortedProducts);

  //       setFilteredProducts((prev) => [
  //         ...prev,
  //         ...sortedProducts.filter(
  //           (newProduct) =>
  //             !prev.some((prevProduct) => prevProduct.id === newProduct.id)
  //         ),
  //       ]);

  //       setHasMore(page < data.totalPages);
  //     } else {
  //       console.error("Unauthorized or server error:", response.status);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // state

  // fetch uses limit

  //   const fetchProductData = async () => {
  //     setLoading(true);
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

  //     if (response.ok) {
  //   const data = await response.json();

  //   const sortedProducts = data.products.sort(
  //     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //   );

  //   if (page === 1) {
  //     setProducts(sortedProducts);
  //     setFilteredProducts(sortedProducts);
  //   } else {
  //     setProducts((prev) => [...prev, ...sortedProducts]);
  //     setFilteredProducts((prev) => [...prev, ...sortedProducts]);
  //   }

  //   // ✅ yahan total products set karo
  //   if (data.totalProducts) {
  //     setTotalProducts(data.totalProducts);
  //   }

  //   setHasMore(page < data.totalPages);
  // } else {
  //         console.error("Unauthorized or server error:", response.status);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // reset when limit changes

  // const handleUploadAndPreview = async () => {
  //   if (!selectedFile) return;

  //   setIsUploading(true);
  //   setUploadStarted(true);
  // showToast("success", `Uploading "${selectedFile.name}". Processing in background...`);

  //   closePopup();

  //   setTimeout(async () => {
  //     try {
  //       const userId = localStorage.getItem("userid");
  //        const apiKey = localStorage.getItem("apiKey");
  //   const apiSecretKey = localStorage.getItem("apiSecretKey");
  //       if (!userId) {
  //         showToast("error", "User ID not found.");
  //         return;
  //       }

  //       const formData = new FormData();
  //       formData.append("file", selectedFile);
  //       // formData.append("userId", userId);
  //      addNotification(
  //       `Product CSV upload triggered for "${selectedFile.name}".`,
  //       "Manage product"
  //     );

  //       const response = await fetch(
  //         `https://multi-vendor-marketplace.vercel.app/product/upload-product-csv/${userId}`,
  //         {
  //           method: "POST",
  //           body: formData,
  //           headers: {
  //         "x-api-key": apiKey,
  //         "x-api-secret": apiSecretKey,
  //       },
  //         }
  //       );

  //       const result = await response.json();

  //     showToast("success", `File "${selectedFile.name}" imported successfully!`);
  //     addNotification(`File "${selectedFile.name}" imported successfully!`);
  //     } catch (error) {
  //       showToast(
  //         "error",
  //         error.message || "Error occurred while importing the file."
  //       );
  //       addNotification(
  //         "error",
  //         error.message || "Error occurred while importing the file."
  //       );
  //     } finally {
  //       setIsUploading(false);
  //       setUploadStarted(false);
  //       setSelectedFile(null);
  //     }
  //   }, 2000);
  // };

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
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // ✅ har page par nayi list overwrite hogi
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

  const handleUploadAndPreview = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStarted(true);
    closePopup();

    const userId = localStorage.getItem("userid");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");

    if (!userId) {
      showToast("error", "User ID not found.");
      return;
    }

    showToast("success", `Uploading "${selectedFile.name}" in background...`);
    addNotification(
      `Product CSV upload started for "${selectedFile.name}"`,
      "Manage product"
    );

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        const allRows = results.data;
        const chunkSize = 25;

        const totalChunks = Math.ceil(allRows.length / chunkSize);

        for (let i = 0; i < allRows.length; i += chunkSize) {
          const chunk = allRows.slice(i, i + chunkSize);
          const chunkCsv = Papa.unparse(chunk);
          const chunkBlob = new Blob([chunkCsv], { type: "text/csv" });

          const formData = new FormData();
          formData.append("file", chunkBlob, `chunk_${i / chunkSize + 1}.csv`);

          try {
            const response = await fetch(
              `https://multi-vendor-marketplace.vercel.app/product/upload-product-csv`,
              {
                method: "POST",
                body: formData,
                headers: {
                  "x-api-key": apiKey,
                  "x-api-secret": apiSecretKey,
                },
              }
            );

            const result = await response.json();

            if (response.ok) {
              showToast("success", ` Chunk ${i / chunkSize + 1} uploaded.`);
              addNotification(
                `Chunk ${i / chunkSize + 1} of uploaded.`,
                "Manage product"
              );
            } else {
              showToast(
                "error",
                ` Chunk ${i / chunkSize + 1} failed: ${
                  result.message || "Unknown error"
                }`
              );
              addNotification(
                ` Chunk ${i / chunkSize + 1} failed.`,
                "Manage product"
              );
            }
          } catch (error) {
            showToast(
              "error",
              `Error in chunk ${i / chunkSize + 1}: ${error.message}`
            );
            addNotification(
              ` Upload error in chunk ${i / chunkSize + 1}`,
              "Manage product"
            );
          }

          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        showToast(
          "success",
          ` File "${selectedFile.name}" uploaded successfully in ${totalChunks} chunks!`
        );
        addNotification(
          ` Upload complete: "${selectedFile.name}" processed`,
          "Manage product"
        );

        setIsUploading(false);
        setUploadStarted(false);
        setSelectedFile(null);
      },
      error: function (err) {
        showToast("error", ` CSV parsing failed: ${err.message}`);
        setIsUploading(false);
        setUploadStarted(false);
      },
    });
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

  const OnEdit = (product) => {
    console.log(product);
    console.log("clicking");

    let formPage = "/add-product";

    navigate(formPage, { state: { product } });
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
            }
          );

          if (!response.ok) throw new Error("Failed to delete product");

          if (product) {
            addNotification(
              `${product.title} deleted successfully!`,
              "Manage product"
            );
          }
        })
      );

      setProducts(products.filter((p) => !selectedProducts.includes(p._id)));
      setFilteredProducts(
        filteredProducts.filter((p) => !selectedProducts.includes(p._id))
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
              }
            );
            if (!response.ok) throw new Error("Failed to publish product");
            addNotification(
              `${product.title} published successfully!`,
              "Manage product"
            );
          }
        })
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
              }
            );
            if (!response.ok) throw new Error("Failed to unpublish product");
            addNotification(
              `${product.title} unpublished successfully!`,
              "Manage product"
            );
          }
        })
      );

      showToast("success", "Selected products unpublished successfully!");
      fetchProductData();
      setSelectedProducts([]);
    } catch (error) {
      showToast(
        "Failed",
        error.message || "Error occurred while unpublishing."
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
              variant.sku?.toLowerCase().includes(searchVal.toLowerCase())
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
        `products-${exportOption}-${Date.now()}.csv`
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
  return user ? (
    <main className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start border-b-2 border-gray-200 pb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">Manage products</h1>
          <p className="text-gray-600 mb-4">Manage your products here.</p>

          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 gap-3">
            {/* Search Bar */}
            <div className="w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search products..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort By Dropdown */}
            <div className="w-full md:w-1/4">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setSortValue(""); // reset when criteria changes
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sort By</option>
                <option value="listing_name">Listing Name</option>
                <option value="approval">Approval</option>
                <option value="sku">SKU</option>
                <option value="price">Price</option>
                <option value="product_type">Product Type</option>
                <option value="vendor">Vendor</option>

                {/* ✅ Published By only for Dev Admin & Master Admin */}
                {(userRole === "Dev Admin" || userRole === "Master Admin") && (
                  <option value="published_by">Published By</option>
                )}
              </select>
            </div>

            {/* Dynamic Options Dropdown */}
            {sortBy && (
              <div className="w-full md:w-1/4">
                <select
                  value={sortValue}
                  onChange={(e) => setSortValue(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select {sortBy.replace("_", " ")}</option>

                  {/* ✅ If published_by is selected → show publishers list */}
                  {sortBy === "published_by"
                    ? [...new Set(products.map((p) => p.username))].map(
                        (publisher) => (
                          <option key={publisher} value={publisher}>
                            {publisher}
                          </option>
                        )
                      )
                    : getUniqueOptions(sortBy).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
          <div className="flex flex-col gap-4 items-center w-full justify-end">
            <div className="flex gap-4 items-center justify-end w-full">
              <button
                onClick={openPopup}
                className="bg-blue-500 hover:bg-blue-400 text-white gap-2 py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
              >
                <CiImport className="w-5 h-5" />
                Import
              </button>

              <button
                onClick={togglePopup}
                className="bg-blue-500 hover:bg-blue-400 text-white gap-2 py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
              >
                <FaFileImport className="w-5 h-5" />
                Export
              </button>
            </div>

            {selectedProducts.length > 0 && (
              <div className="flex gap-4 items-center justify-end w-full">
                <div className="flex gap-4 items-center justify-end w-full">
                  {filteredProducts.some(
                    (product) =>
                      selectedProducts.includes(product._id) &&
                      product.status === "draft"
                  ) && (
                    <button
                      onClick={handlePublishSelected}
                      className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
                    >
                      Publish
                    </button>
                  )}

                  {filteredProducts.some(
                    (product) =>
                      selectedProducts.includes(product._id) &&
                      product.status === "active"
                  ) && (
                    <button
                      onClick={handleUnpublishSelected}
                      className="bg-red-500 hover:bg-red-400 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
                    >
                      Unpublish
                    </button>
                  )}

                  <button
                    onClick={onDeleteSelected}
                    className="bg-red-500 hover:bg-red-400 text-white py-2 px-9 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

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
      </div>

      <div className="p-4">
        {filteredProducts.length === 0 && !Loading ? (
          <div className="text-center py-10 text-gray-500">
            <h2>No products available.</h2>
          </div>
        ) : (
          <div className="max-sm:overflow-auto border rounded-lg">
            <table className="w-full border-collapse bg-white">
              <thead className="bg-gray-100 text-left text-gray-600 text-xs">
                <tr>
                  <th className="p-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer"
                      checked={selectAll}
                      onChange={() => handleSelectAll()}
                    />
                  </th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Listing_name</th>
                  {(userRole === "Dev Admin" ||
                    userRole === "Master Admin") && (
                    <th className="p-3">Publisher</th>
                  )}
                  <th className="p-3">Approval</th>
                  <th className="p-3">Sku</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Compare_at_price</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Inventory</th>
                  <th className="p-3">Vendor</th>
                  {admin && <th className="p-3">PUBLISHER</th>}
                  <th className="p-3">Edit</th>
                </tr>
              </thead>

              {/* <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => toggleSelection(product._id)}
                      />
                    </td>
                    <td className="p-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          product.status === "active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        title={product.status}
                      />
                    </td>
                    <td className="p-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0].src}
                          alt={product.images[0].alt || "Product image"}
                          className="w-16 h-16 object-contain rounded border"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </td>
                    <td className="p-3">
                      {product.title !== "Job Listing"
                        ? product.title
                        : "Job Search Listing"}
                    </td>
                    {(userRole === "Dev Admin" ||
                      userRole === "Master Admin") && (
                      <td>{product?.username}</td>
                    )}
                    <td className="p-3">
                      {product?.approvalStatus ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            product.approvalStatus === "pending"
                              ? "bg-yellow-200 text-yellow-800"
                              : product.approvalStatus === "approved"
                              ? "bg-green-200 text-green-800"
                              : product.approvalStatus === "rejected"
                              ? "bg-red-200 text-red-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {product.approvalStatus}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="p-3">{product.variants[0]?.sku}</td>
                    <td className="p-3">${product.variants[0]?.price}</td>
                    <td className="p-3">
                      ${product.variants[0]?.compare_at_price || 0.0}
                    </td>
                    <td className="p-3">{product.product_type}</td>
                    <td className="p-3">
                      {product.variants[0]?.inventory_quantity}
                    </td>
                    <td className="p-3">{product.vendor}</td>
                    {admin && `#${product.shopifyId}`}
                    <td className="p-3">
                      <button
                        className="flex items-center text-blue-500 hover:text-blue-700 transition duration-200"
                        onClick={() => OnEdit(product)}
                      >
                        <MdEdit className="mr-1" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}

           
              </tbody> */}
              <tbody>
                {Loading ? (
                  <tr>
                    <td colSpan="100%" className="py-10">
                      <div className="flex justify-center items-center">
                        <svg
                          className="animate-spin h-6 w-6 text-blue-500 mr-2"
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
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        <span className="text-gray-600 text-sm">
                          Fetching products...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => toggleSelection(product._id)}
                        />
                      </td>
                      <td className="p-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            product.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                          title={product.status}
                        />
                      </td>
                      <td className="p-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0].src}
                            alt={product.images[0].alt || "Product image"}
                            className="w-16 h-16 object-contain rounded border"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No Image
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {product.title !== "Job Listing"
                          ? product.title
                          : "Job Search Listing"}
                      </td>
                      {(userRole === "Dev Admin" ||
                        userRole === "Master Admin") && (
                        <td>{product?.username}</td>
                      )}
                      <td className="p-3">
                        {product?.approvalStatus ? (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              product.approvalStatus === "pending"
                                ? "bg-yellow-200 text-yellow-800"
                                : product.approvalStatus === "approved"
                                ? "bg-green-200 text-green-800"
                                : product.approvalStatus === "rejected"
                                ? "bg-red-200 text-red-800"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {product.approvalStatus}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-3">{product.variants[0]?.sku}</td>
                      <td className="p-3">${product.variants[0]?.price}</td>
                      <td className="p-3">
                        ${product.variants[0]?.compare_at_price || 0.0}
                      </td>
                      <td className="p-3">{product.product_type}</td>
                      <td className="p-3">
                        {product.variants[0]?.inventory_quantity}
                      </td>
                      <td className="p-3">{product.vendor}</td>
                      {admin && `#${product.shopifyId}`}
                      <td className="p-3">
                        <button
                          className="flex items-center text-blue-500 hover:text-blue-700 transition duration-200"
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
            {/* Pagination */}
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col md:flex-row justify-between items-center  px-4 py-3 bg-gray-50 border border-gray-200 ">
                {/* Left: Total Products */}
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
                    )
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
              <h2 className="text-sm font-semibold text-blue-700">
                Import products by CSV
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
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
                <span className="px-4 py-2 text-sm text-white bg-blue-600 border border-gray-300 rounded hover:bg-blue-700">
                  Add file
                </span>
                {selectedFile && (
                  <span className="absolute bottom-2 text-sm text-gray-600">
                    {selectedFile.name}
                  </span>
                )}
              </div>
              <a
                href="/sample-product.csv"
                download
                className="text-sm text-blue-600 underline cursor-pointer mb-4 inline-block"
              >
                Download sample CSV
              </a>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closePopup}
                  className="px-4 py-1 text-sm border text-white bg-red-500 border-gray-300 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadAndPreview}
                  disabled={!selectedFile || isUploading}
                  className={`px-4 py-2 text-sm rounded transition ${
                    selectedFile && !isUploading
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
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
              <a href="#" className="text-blue-600 underline">
                CSV file for inventory
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
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="exportAs"
                  value="plain"
                  checked={exportAs === "plain"}
                  onChange={() => setExportAs("plain")}
                />
                Plain CSV file
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-300">
              <button
                onClick={() => setIsexportOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded mt-2"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className={`px-4 py-2 rounded mt-2 flex items-center gap-2 ${
                  isExporting ? "bg-gray-500" : "bg-gray-800"
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
