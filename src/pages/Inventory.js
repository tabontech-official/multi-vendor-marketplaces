import React, { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlineCheckCircle, HiOutlineXCircle, HiPlus } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import UseFetchUserData from "../component/fetchUser";
import { useAuthContext } from "../Hooks/useAuthContext";
import { CreateCheckoutUrl } from "../component/Checkout";
import { HiOutlineRefresh } from "react-icons/hi";
import { jwtDecode } from "jwt-decode";
import { MdModeEdit } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { CiImport } from "react-icons/ci";
import { FaCross, FaEdit, FaFileImport, FaTimes } from "react-icons/fa";
import { useNotification } from "../context api/NotificationContext";

const Inventory = () => {
  const { addNotification } = useNotification();

  let admin;

  const isAdmin = () => {
    const token = localStorage.getItem("usertoken");
    if (token) {
      const decoded = jwtDecode(token);
      if (
        (decoded.payLoad.isAdmin || decoded.payLoad.role === "DevAdmin") &&
        decoded.exp * 1000 > Date.now()
      ) {
        return true;
      }
    }
    return false;
  };

  admin = isAdmin();

  const limit = 20;

  const navigate = useNavigate();
  const { userData, loading, error, variantId } = UseFetchUserData();
  const [products, setProducts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState("");
  const { user } = useAuthContext();
  const [showPromoFields, setShowPromoFields] = useState(false);
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [promoPrice, setPromoPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [Loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [activeTab, setActiveTab] = useState("price");
  const [isExportOpen, setIsexportOpen] = useState(false);
  const [exportOption, setExportOption] = useState("current");
  const [isExporting, setIsExporting] = useState(false);
  const [isOpenImport, setIsOpenImport] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStarted, setUploadStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [exportAs, setExportAs] = useState("csv");
  let buyCreditUrl = "";
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const modalRef = useRef();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [popupProductId, setPopupProductId] = useState(null);
  const openPopupImport = () => setIsOpenImport(true);
  const closePopupImport = () => setIsOpenImport(false);
  const [loadingIds, setLoadingIds] = useState([]);

  const toggleSelection = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const togglePopup = () => setIsexportOpen(!isOpen);

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closePopupImport();
      }
    };
    if (isOpenImport) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenImport]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const fetchProductData = async () => {
    setLoading(true);
    const token = localStorage.getItem("usertoken");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    const isAdmin = () => {
      if (token) {
        const decoded = jwtDecode(token);
        return (
          (decoded.payLoad.isAdmin || decoded.payLoad.role === "Dev Admin") &&
          decoded.exp * 1000 > Date.now()
        );
      }
      return false;
    };

    const admin = isAdmin();

    try {
      const id = localStorage.getItem("userid");
      const response = await fetch(
        // admin
        //   ? `https://multi-vendor-marketplace.vercel.app/product/getAllVariants/${id}/?page=${page}&limit=${limit}`
        //   : `https://multi-vendor-marketplace.vercel.app/product/getAllData/?page=${page}&limit=${limit}`,
        admin
          ? `https://multi-vendor-marketplace.vercel.app/product/getAllVariants/${id}/?page=${page}&limit=${limit}`
          : `https://multi-vendor-marketplace.vercel.app/product/getAllVariants/${id}/?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        const sortedVariants = data.variants.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // setProducts(sortedVariants);

        setProducts((prev) => [
          ...prev,
          ...sortedVariants.filter(
            (newVariant) =>
              !prev.some((prevVariant) => prevVariant.id === newVariant.id)
          ),
        ]);
        setFilteredProducts((prev) => [
          ...prev,
          ...sortedVariants.filter(
            (newVariant) =>
              !prev.some((prevVariant) => prevVariant.id === newVariant.id)
          ),
        ]);

        setHasMore(page < data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching variants:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductData();
  }, [page]);


  const handleSearch = () => {
    let filtered =
      searchVal === ""
        ? products
        : products.filter((product) => {
            const val = searchVal.toLowerCase();

            return (
              product.title?.toLowerCase()?.includes(val) ||
              product.product_type?.toLowerCase()?.includes(val) ||
              product.sku?.toLowerCase()?.includes(val) ||
              product.price?.toString()?.includes(val) ||
              product.compare_at_price?.toString()?.includes(val) ||
              product.inventory_quantity?.toString()?.includes(val)
            );
          });

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchVal]);

  useEffect(() => {
    fetchProductData();
  }, []);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 400 >=
      document.documentElement.scrollHeight
    ) {
      if (hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [hasMore, loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSubmit = async (e) => {
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    e.preventDefault();
    const userId = localStorage.getItem("userid");
    if (selectedProducts.length === 0) {
      alert("Please select at least one variant.");
      return;
    }

    const payload =
      activeTab === "price"
        ? {
            price,
            compareAtPrice,
            userId,
          }
        : {
            quantity,
            userId,
          };

    const endpoint =
      activeTab === "price"
        ? "updateInventoryPrice"
        : "updateInventoryQuantity";

    try {
      const updatePromises = selectedProducts.map(async (variantId) => {
        const response = await fetch(
          `https://multi-vendor-marketplace.vercel.app/product/${endpoint}/${variantId}`,
          {
            method: "PUT",
            headers: {
              "x-api-key": apiKey,
              "x-api-secret": apiSecretKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        const result = await response.json();

        if (!response.ok) {
          console.error(`Error updating variant ${variantId}:`, result.message);
        }

        return { variantId, success: response.ok, message: result.message };
      });

      const results = await Promise.all(updatePromises);

      const failedUpdates = results.filter((r) => !r.success);
      if (failedUpdates.length > 0) {
        showToast(
          `${failedUpdates.length} variant(s) failed to update.\n` +
            failedUpdates
              .map((r) => `• ${r.variantId}: ${r.message}`)
              .join("\n")
        );
      } else {
        showToast("success", "Inventory updated successfully!");
        addNotification("Inventory updated successfully!", "inventory");
      }

      setShowPopup(false);
      fetchProductData();
    } catch (error) {
      console.error("Error during variant update:", error);
      alert("Unexpected error occurred while updating inventory.");
    }
  };

  const handlePriceUpdate = async (variantId) => {
    const userId = localStorage.getItem("userid");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    const variantToUpdate = filteredProducts.find(
      (v) => `${v.id}` === `${variantId}`
    );
    if (!variantToUpdate) {
      console.error("Variant ID not found:", variantId);
      return alert("Variant not found.");
    }

    const payload = {
      price: variantToUpdate.price,
      compareAtPrice: variantToUpdate.compare_at_price,
      userId,
    };

    try {
      const response = await fetch(
        `https://multi-vendor-marketplace.vercel.app/product/updateInventoryPrice/${variantId}`,
        {
          method: "PUT",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // alert(`Price updated for SKU: ${variantToUpdate.sku}`);
        showToast("success", `Price updated for SKU: ${variantToUpdate.sku}`);
        addNotification(
          `Price updated for SKU: ${variantToUpdate.sku}`,
          "inventory"
        );
        fetchProductData();
      } else {
        // alert(result.message || "Price update failed");
        showToast("Failed", result.message || "Price update failed.");
      }
      // window.location.reload()
    } catch (error) {
      console.error("Error updating price:", error);
      showToast("An error occurred while updating price.");
    }
  };

  const handleQuantityUpdate = async (variantId) => {
    const userId = localStorage.getItem("userid");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    const variantToUpdate = filteredProducts.find(
      (v) => `${v.id}` === `${variantId}`
    );
    if (!variantToUpdate) {
      console.error("Variant ID not found:", variantId);
      return alert("Variant not found.");
    }

    const payload = {
      quantity: variantToUpdate.inventory_quantity,
      userId,
    };

    try {
      const response = await fetch(
        `https://multi-vendor-marketplace.vercel.app/product/updateInventoryQuantity/${variantId}`,
        {
          method: "PUT",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        showToast(
          "success",
          `Quantity updated for SKU: ${variantToUpdate.sku}`
        );
        addNotification(
          `Quantity updated for SKU: ${variantToUpdate.sku}`,
          "inventory"
        );
        // window.location.reload();
        fetchProductData();
      } else {
        showToast("Failed", result.message || "Quantity update failed.");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      showToast("An error occurred while updating quantity.");
    }
  };

  const handleUploadAndPreview = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const userId = localStorage.getItem("userid");
      if (!userId) {
        alert("User ID not found");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("userId", userId);
      addNotification(
        "Inventory CSV upload triggered. Processing in background.",
        "inventory"
      );

      fetch(
        "https://multi-vendor-marketplace.vercel.app/product/upload-csv-for-inventory",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((res) => res.json())
        .then((result) => {
          if (result?.message) {
            showToast("success", result.message);
            addNotification(result.message, "inventory");
          } else {
            showToast(
              "info",
              "CSV upload triggered. Processing in background."
            );
            addNotification(
              "CSV upload triggered. Processing in background.",
              "inventory"
            );
          }
        })
        .catch((error) => {
          console.error("Upload error:", error);
          showToast("error", "Upload triggered but failed to track result.");
        });

      closePopupImport();
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload trigger error:", error);
      showToast("error", "Upload triggered but failed to track result.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const userId = localStorage.getItem("userid");
      if (!userId) {
        alert("User ID not found in localStorage");
        return;
      }

      let exportUrl = `https://multi-vendor-marketplace.vercel.app/product/csvInventoryEportFile/`;

      const queryParams = new URLSearchParams({ userId });

      if (exportOption === "selected") {
        if (!selectedProducts.length) {
          showToast("No variants selected for export.");
          setIsExporting(false);
          return;
        }
        queryParams.append("variantIds", selectedProducts.join(","));
      } else if (exportOption === "current") {
      }

      exportUrl += `?${queryParams.toString()}`;

      const response = await fetch(exportUrl);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Export failed");
      }
      addNotification("CSV export started successfully!", "inventory");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute("download", `products-export-${Date.now()}.csv`);
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

  return user ? (
    <main className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start border-gray-200 pb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">Inventory</h1>
          <p className="text-gray-600">
            Here are your total Collection in Inventory.
          </p>
          <div className="w-2/4 max-sm:w-full mt-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="md:w-2/4 p-2 max-sm:w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
          <div className="flex gap-4 items-center w-full justify-end">
            {filteredProducts.some((v) => v.isEditable) && (
              <button
                onClick={() => {
                  const editableVariants = filteredProducts.filter(
                    (v) => v.isEditable
                  );

                  if (editableVariants.length === 0) {
                    alert("Please edit at least one variant first.");
                    return;
                  }

                  const updated = [...filteredProducts];

                  editableVariants.forEach((editableVariant) => {
                    const index = updated.findIndex(
                      (v) => v.id === editableVariant.id
                    );
                    if (index !== -1) {
                      if (activeTab === "price") {
                        updated[index].price = editableVariant.price;
                        updated[index].compare_at_price =
                          editableVariant.compare_at_price;
                      } else if (activeTab === "quantity") {
                        updated[index].inventory_quantity =
                          editableVariant.inventory_quantity;
                      }
                    }
                  });

                  editableVariants.forEach((editableVariant, i) => {
                    setTimeout(() => {
                      if (activeTab === "price") {
                        handlePriceUpdate(editableVariant.id);
                      } else {
                        handleQuantityUpdate(editableVariant.id);
                      }
                    }, i * 100);
                  });

                  editableVariants.forEach((v) => (v.isEditable = false));

                  setFilteredProducts(updated);
                }}
                className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
              >
                {activeTab === "price" ? "Update All" : "Update All"}
              </button>
            )}
            <button
              onClick={openPopupImport}
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
            {/* {filteredProducts.some((p) => p.isEditable) && (
              <button
                onClick={() => {
                  const selectedId = selectedProducts[0];
                  const variant = filteredProducts.find(
                    (v) => `${v.id}` === `${selectedId}`
                  );

                  if (variant) {
                    setSelectedProduct(variant);
                    setPrice(variant.price || "");
                    setCompareAtPrice(variant.compare_at_price || "");
                    setQuantity(variant.inventory_quantity || "");
                    setShowPopup(true);
                  }
                }}
                className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
              >
                {activeTab === "price"
                  ? "Update all"
                  : activeTab === "quantity"
                  ? "Update all"
                  : "Update"}
              </button>
            )} */}
            {/* {filteredProducts.some((v) => v.isEditable) && (
              <button
                onClick={() => {
                  const reference = filteredProducts.find((v) => v.isEditable);

                  if (!reference) {
                    alert("Please edit a variant first.");
                    return;
                  }

                  const updated = [...filteredProducts];

                  updated.forEach((variant, index) => {
                    if (activeTab === "price") {
                      variant.price = reference.price;
                      variant.compare_at_price = reference.compare_at_price;
                    } else if (activeTab === "quantity") {
                      variant.inventory_quantity = reference.inventory_quantity;
                    }

                    setTimeout(() => {
                      if (activeTab === "price") {
                        handlePriceUpdate(variant.id);
                      } else {
                        handleQuantityUpdate(variant.id);
                      }
                    }, index * 100);
                  });
                  updated.forEach((variant) => {
                    variant.isEditable = false;
                  });
                  setFilteredProducts(updated);
                }}
                className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
              >
                {activeTab === "price" ? "Update All " : "Update All "}
              </button>
            )} */}
          </div>
        </div>

        {toast.show && (
          <div
            className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${
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
      <div className="flex items-center space-x-6 border-b border-gray-300 mb-4">
        <button
          onClick={() => setActiveTab("price")}
          className={`pb-2 border-b-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === "price"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
        >
          Update Price
        </button>
        <button
          onClick={() => setActiveTab("quantity")}
          className={`pb-2 border-b-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === "quantity"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
        >
          Update Quantity
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between items-center mt-4 space-y-4 md:space-y-0"></div>
      {/* {selectedProducts.length > 0 && (
        <div className="flex flex-col md:flex-row md:justify-between items-center mt-4 space-y-4 md:space-y-0">
          <div className="flex gap-2 items-center w-2/4 max-sm:w-full md:ml-auto justify-end">
            <button
              onClick={() => {
                const selectedId = selectedProducts[0];
                const variant = filteredProducts.find(
                  (v) => `${v.id}` === `${selectedId}`
                );

                if (variant) {
                  setSelectedProduct(variant);
                  setPrice(variant.price || "");
                  setCompareAtPrice(variant.compare_at_price || "");
                  setQuantity(variant.inventory_quantity || "");
                  setShowPopup(true);
                }
              }}
              className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
            >
              {activeTab === "price"
                ? "Update Price"
                : activeTab === "quantity"
                ? "Update Quantity"
                : "Update"}
            </button>
          </div>
        </div>
      )} */}

      {activeTab === "price" && (
        <div className="p-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <h2>No products available.</h2>
            </div>
          ) : (
            <>
              <table className="w-full border-collapse bg-white">
                <thead className="bg-gray-100 text-left text-gray-600 text-sm">
                  <tr>
                    <th className="p-3">Action</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Image</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Compare_at_price</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((variant, index) => (
                    <tr key={variant._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer"
                          checked={selectedProducts.includes(variant.id)}
                          onChange={() => toggleSelection(variant.id)}
                          disabled={isLoading}
                        />
                      </td>

                      <td className="p-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            variant.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                          title={variant.status}
                        />
                      </td>

                      <td className="p-3">
                        {variant.variantImages &&
                        variant.variantImages.length > 0 ? (
                          <img
                            src={variant.variantImages[0].src}
                            alt={
                              variant.variantImages[0].alt || "Variant image"
                            }
                            className="w-16 h-16 object-contain rounded border"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No Image
                          </span>
                        )}
                      </td>

                      <td
                        className="p-3 cursor-pointer hover:underline"
                        onClick={() => {
                          navigate(
                            `/product/${variant.shopifyId}/variants/${variant.id}`,
                            {
                              state: {
                                productId: variant.shopifyId,
                                variantId: variant.id,
                              },
                            }
                          );
                        }}
                      >
                        {variant.sku || "N/A"}
                      </td>

                      <td className="p-3">
                        <div className="relative w-36 flex items-center">
                          <input
                            type="text"
                            value={variant.price || ""}
                            readOnly={!variant.isEditable || isLoading}
                            onChange={(e) => {
                              const updated = [...filteredProducts];
                              updated[index].price = e.target.value;
                              setFilteredProducts(updated);
                            }}
                            className={`w-full text-sm px-2 py-1 border border-gray-300 rounded-md ${
                              variant.isEditable && !isLoading
                                ? "bg-white"
                                : "bg-gray-100"
                            } text-black pr-12`}
                          />

                          <div className="absolute right-2 flex gap-1 items-center">
                            {!variant.isEditable ? (
                              <FaEdit
                                className="text-gray-400 cursor-pointer"
                                onClick={() => {
                                  const updated = [...filteredProducts];
                                  updated[index].isEditable = true;
                                  setFilteredProducts(updated);
                                }}
                                disabled={isLoading}
                              />
                            ) : (
                              <>
                                <button
                                  className="text-green-600 text-sm flex items-center justify-center"
                                  disabled={isLoading}
                                  onClick={async () => {
                                    setLoadingIds((prev) => [
                                      ...prev,
                                      variant.id,
                                    ]);
                                    try {
                                      await handlePriceUpdate(variant.id);
                                      const updated = [...filteredProducts];
                                      updated[index].isEditable = false;
                                      setFilteredProducts(updated);
                                    } catch (error) {
                                      alert("Update failed");
                                    }
                                    setLoadingIds((prev) =>
                                      prev.filter((id) => id !== variant.id)
                                    );
                                  }}
                                >
                                  {isLoading ? (
                                    <svg
                                      className="animate-spin h-4 w-4 text-green-600"
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
                                  ) : (
                                    "✔"
                                  )}
                                </button>

                                <button
                                  className="text-red-600 text-sm"
                                  disabled={isLoading}
                                  onClick={() => {
                                    const updated = [...filteredProducts];
                                    updated[index].isEditable = false;
                                    setFilteredProducts(updated);
                                  }}
                                >
                                  ✖
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="relative w-36 flex items-center">
                          <input
                            type="text"
                            value={variant.compare_at_price || ""}
                            readOnly={!variant.isEditable || isLoading}
                            onChange={(e) => {
                              const updated = [...filteredProducts];
                              updated[index].compare_at_price = e.target.value;
                              setFilteredProducts(updated);
                            }}
                            className={`w-full text-sm px-2 py-1 border border-gray-300 rounded-md ${
                              variant.isEditable && !isLoading
                                ? "bg-white"
                                : "bg-gray-100"
                            } text-black pr-12`}
                          />

                          <div className="absolute right-2 flex gap-1 items-center">
                            {!variant.isEditable ? (
                              <FaEdit
                                className="text-gray-400 cursor-pointer"
                                onClick={() => {
                                  const updated = [...filteredProducts];
                                  updated[index].isEditable = true;
                                  setFilteredProducts(updated);
                                }}
                                disabled={isLoading}
                              />
                            ) : (
                              <>
                                <button
                                  className="text-green-600 text-sm flex items-center justify-center"
                                  disabled={isLoading}
                                  onClick={async () => {
                                    setLoadingIds((prev) => [
                                      ...prev,
                                      variant.id,
                                    ]);
                                    try {
                                      await handlePriceUpdate(variant.id);
                                      const updated = [...filteredProducts];
                                      updated[index].isEditable = false;
                                      setFilteredProducts(updated);
                                    } catch (error) {
                                      alert("Update failed");
                                    }
                                    setLoadingIds((prev) =>
                                      prev.filter((id) => id !== variant.id)
                                    );
                                  }}
                                >
                                  {isLoading ? (
                                    <svg
                                      className="animate-spin h-4 w-4 text-green-600"
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
                                  ) : (
                                    "✔"
                                  )}
                                </button>

                                <button
                                  className="text-red-600 text-sm"
                                  disabled={isLoading}
                                  onClick={() => {
                                    const updated = [...filteredProducts];
                                    updated[index].isEditable = false;
                                    setFilteredProducts(updated);
                                  }}
                                >
                                  ✖
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 👇 Loader below table instead of replacing it */}
              {Loading && (
                <div className="flex justify-center items-center py-4">
                  <HiOutlineRefresh className="animate-spin text-xl text-gray-500 mr-2" />
                  <span className="text-gray-500 text-sm">Loading more...</span>
                </div>
              )}

              {!hasMore && (
                <div className="text-center text-gray-400 text-sm py-4">
                  No more variants to load.
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "quantity" && (
        <div className="p-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <h2>No variants available.</h2>
            </div>
          ) : (
            <>
              <div className="max-sm:overflow-auto border rounded-lg">
                <table className="w-full border-collapse bg-white">
                  <thead className="bg-gray-100 text-left text-gray-600 text-sm">
                    <tr>
                      <th className="p-3">Action</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Image</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Inventory</th>
                      {admin && <th className="p-3 text-xs">Shopify ID</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((variant, index) => {
                      const isLoading = loadingIds.includes(variant.id);

                      return (
                        <tr
                          key={variant.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-3">
                            <input
                              type="checkbox"
                              className="w-4 h-4 cursor-pointer"
                              checked={selectedProducts.includes(variant.id)}
                              onChange={() => toggleSelection(variant.id)}
                              disabled={isLoading}
                            />
                          </td>

                          <td className="p-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                variant.status === "active"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                              title={variant.status}
                            />
                          </td>

                          <td className="p-3">
                            {variant.variantImages &&
                            variant.variantImages.length > 0 ? (
                              <img
                                src={variant.variantImages[0].src}
                                alt={
                                  variant.variantImages[0].alt ||
                                  "Variant image"
                                }
                                className="w-16 h-16 object-contain rounded border"
                              />
                            ) : (
                              <span className="text-gray-400 text-sm">
                                No Image
                              </span>
                            )}
                          </td>

                          <td className="p-3">{variant.sku || "N/A"}</td>

                          <td className="p-3">
                            <div className="relative w-36 flex items-center">
                              <input
                                type="text"
                                value={variant.inventory_quantity || "0"}
                                readOnly={!variant.isEditable || isLoading}
                                onChange={(e) => {
                                  const updated = [...filteredProducts];
                                  updated[index].inventory_quantity =
                                    e.target.value;
                                  setFilteredProducts(updated);
                                }}
                                className={`w-full text-sm px-2 py-1 border border-gray-300 rounded-md ${
                                  variant.isEditable && !isLoading
                                    ? "bg-white"
                                    : "bg-gray-100"
                                } text-black pr-12`}
                              />

                              <div className="absolute right-2 flex gap-1 items-center">
                                {!variant.isEditable ? (
                                  <FaEdit
                                    className="text-gray-400 cursor-pointer"
                                    onClick={() => {
                                      if (!isLoading) {
                                        const updated = [...filteredProducts];
                                        updated[index].isEditable = true;
                                        setFilteredProducts(updated);
                                      }
                                    }}
                                  />
                                ) : (
                                  <>
                                    <button
                                      className="text-green-600 text-sm flex items-center justify-center"
                                      disabled={isLoading}
                                      onClick={async () => {
                                        setLoadingIds((prev) => [
                                          ...prev,
                                          variant.id,
                                        ]);
                                        try {
                                          await handleQuantityUpdate(
                                            variant.id
                                          );
                                          const updated = [...filteredProducts];
                                          updated[index].isEditable = false;
                                          setFilteredProducts(updated);
                                        } catch (error) {
                                          alert("Update failed");
                                        }
                                        setLoadingIds((prev) =>
                                          prev.filter((id) => id !== variant.id)
                                        );
                                      }}
                                    >
                                      {isLoading ? (
                                        <svg
                                          className="animate-spin h-4 w-4 text-green-600"
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
                                      ) : (
                                        "✔"
                                      )}
                                    </button>
                                    <button
                                      className="text-red-600 text-sm"
                                      disabled={isLoading}
                                      onClick={() => {
                                        const updated = [...filteredProducts];
                                        updated[index].isEditable = false;
                                        setFilteredProducts(updated);
                                      }}
                                    >
                                      ✖
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>

                          {admin && (
                            <td className="p-3 text-xs">
                              #{variant.shopifyId}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 👇 Loader below table */}
              {Loading && (
                <div className="flex justify-center items-center py-4">
                  <HiOutlineRefresh className="animate-spin text-xl text-gray-500 mr-2" />
                  <span className="text-gray-500 text-sm">Loading more...</span>
                </div>
              )}

              {!hasMore && (
                <div className="text-center text-gray-400 text-sm py-4">
                  No more variants to load.
                </div>
              )}
            </>
          )}
        </div>
      )}

      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-[95%] max-w-lg rounded-xl shadow-xl p-6 relative animate-zoomIn"
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl"
              title="Close"
            >
              ✕
            </button>

            <h2 className="text-xl border-b border-gray-300 p-1 font-semibold mb-4 text-gray-800">
              Update Product Inventory
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium text-gray-700">SKU</label>
                <input
                  type="text"
                  value={selectedProduct?.variants?.[0]?.sku || ""}
                  readOnly
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-700"
                />
              </div>

              {activeTab === "price" && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Enter price"
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white no-spinner"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Compare at Price
                    </label>
                    <input
                      type="number"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                      placeholder="Enter compare at price"
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white no-spinner"
                    />
                  </div>
                </>
              )}

              {activeTab === "quantity" && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white no-spinner"
                  />
                </div>
              )}

              <button
                type="submit"
                className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
      {isPopupOpen && (
        <div
          onClick={() => setIsPopupOpen(false)}
          className="fixed inset-0 bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fadeInUp p-8 relative border border-gray-200"
          >
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-gray-400 hover:text-black transition"
            >
              ✕
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Approval
              </h2>
              <p className="text-gray-600">
                {activeTab === "price"
                  ? "Are you sure you want to update price?"
                  : activeTab === "quantity"
                  ? "Are you sure you want to update quantity?"
                  : "Are you sure you want to update inventory?"}
              </p>

              <button
                onClick={() => {
                  if (activeTab === "quantity") {
                    handleQuantityUpdate(popupProductId);
                  } else if (activeTab === "price") {
                    handlePriceUpdate(popupProductId);
                  }
                  setIsPopupOpen(false);
                }}
                className="mt-6 inline-block px-6 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-full hover:opacity-90 transition"
              >
                Okay
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
                  Selected variants only
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
      {isOpenImport && (
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
                onClick={closePopupImport}
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
                href="/sample-inventory.csv"
                download
                className="text-sm text-blue-600 underline cursor-pointer mb-4 inline-block"
              >
                Download sample CSV
              </a>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closePopupImport}
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
    </main>
  ) : null;
};

export default Inventory;
