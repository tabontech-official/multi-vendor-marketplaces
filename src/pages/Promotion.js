import React, { useEffect, useRef, useState } from "react";
import UseFetchUserData from "../component/fetchUser";
import { useAuthContext } from "../Hooks/useAuthContext";
import { HiOutlineRefresh } from "react-icons/hi";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

const Promotion = () => {
  let admin;

  const isAdmin = () => {
    const token = localStorage.getItem("usertoken");
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.payLoad.isAdmin && decoded.exp * 1000 > Date.now()) {
        return true;
      }
    }
    return false;
  };
  const [isSavingPromo, setIsSavingPromo] = useState(false);

  admin = isAdmin();
  const limit = 20;
  const { loading } = UseFetchUserData();
  const [products, setProducts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);
  const [promoName, setPromoName] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sku, setSku] = useState("");
  const [status, setStatus] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [promotions, setPromotions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStartDate, setModalStartDate] = useState("");
  const [modalEndDate, setModalEndDate] = useState("");
  const [promoPrices, setPromoPrices] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthContext();
  const [promoPrice, setPromoPrice] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [Loading, setLoading] = useState(false);
  const modalRef = useRef();
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("Active Promotions") || "Promotions Details";
  });
  const [collapsedProducts, setCollapsedProducts] = useState({});
  useEffect(() => {
    const initialState = {};
    filteredProducts.forEach((p) => {
      initialState[p._id] = false;
    });
    setCollapsedProducts(initialState);
  }, [filteredProducts]);

  const toggleCollapse = (productId) => {
    setCollapsedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };
  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    const uid = localStorage.getItem("userid");
    if (!token || !uid) return;

    try {
      const decoded = jwtDecode(token);
      if (decoded?.payLoad?.role) {
        setUserRole(decoded.payLoad.role);
        setCurrentUserId(uid);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const fetchProductData = async () => {
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    setLoading(true);
    const id = localStorage.getItem("userid");
    try {
      const response = await fetch(
        admin
          ? `https://multi-vendor-marketplace.vercel.app/product/getAllDataForPromotion/?page=${page}&limit=${limit}`
          : `https://multi-vendor-marketplace.vercel.app/product/getPromotionProduct/${id}/?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();

        const sortedProducts = data.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setProducts(sortedProducts);
        setFilteredProducts((prev) => [
          ...prev,
          ...sortedProducts.filter(
            (newProduct) =>
              !prev.some((prevProduct) => prevProduct.id === newProduct.id),
          ),
        ]);

        setHasMore(page < data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
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

  // useEffect(() => {
  //   const fetchPromotions = async () => {
  //     try {
  //       const res = await fetch(
  //         "https://multi-vendor-marketplace.vercel.app/promo"
  //       );
  //       const data = await res.json();
  //       setPromotions(data);
  //     } catch (err) {
  //       console.error("Failed to fetch promotions:", err);
  //     }
  //   };

  //   fetchPromotions();
  // }, []);

  // useEffect(() => {
  //   const fetchPromotions = async () => {
  //     try {
  //       let url = "";
  //       const apiKey = localStorage.getItem("apiKey");
  //       const apiSecretKey = localStorage.getItem("apiSecretKey");

  //       if (userRole === "Merchant" || userRole === "Merchant Staff") {
  //         url = "https://multi-vendor-marketplace.vercel.app/promo/fetchAllPromotions";
  //       } else if (userRole === "Dev Admin" || userRole === "Master Admin") {
  //         url = "https://multi-vendor-marketplace.vercel.app/promo";
  //       }

  //       if (!url) return;

  //       const res = await fetch(url, {
  //         headers: {
  //           "x-api-key": apiKey,
  //           "x-api-secret": apiSecretKey,
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       const data = await res.json();

  //       if (Array.isArray(data)) {
  //         setPromotions(data);
  //       } else if (data) {
  //         setPromotions((prev) => {
  //           const exists = prev.some((p) => p._id === data._id);
  //           return exists ? prev : [...prev, data];
  //         });
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch promotions:", err);
  //       setPromotions([]);
  //     }
  //   };

  //   fetchPromotions();
  // }, [userRole]);

  const fetchPromotions = async () => {
    try {
      let url = "";
      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");

      if (userRole === "Merchant" || userRole === "Merchant Staff") {
        url = "https://multi-vendor-marketplace.vercel.app/promo/fetchAllPromotions";
      } else if (userRole === "Dev Admin" || userRole === "Master Admin") {
        url = "https://multi-vendor-marketplace.vercel.app/promo";
      }

      if (!url) return;

      const res = await fetch(url, {
        headers: {
          "x-api-key": apiKey,
          "x-api-secret": apiSecretKey,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setPromotions(data);
      }
    } catch (err) {
      console.error("Failed to fetch promotions:", err);
      setPromotions([]);
    }
  };
  useEffect(() => {
    fetchPromotions();
  }, [userRole]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };
  const handleSubmitPromotion = async () => {
    const userId = localStorage.getItem("userid");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    const promoPrice = promoPrices[selectedVariant.id];

    if (!modalStartDate || !modalEndDate) {
      return showToast("error", "Please enter both start and end date.");
    }

    try {
      setIsSavingPromo(true);
      const res = await axios.post(
        `https://multi-vendor-marketplace.vercel.app/promo/${selectedVariant.id}`,
        {
          promoPrice,
          startDate: modalStartDate,
          endDate: modalEndDate,
        },
        {
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
        },
      );

      showToast("success", "Promotion created successfully!");
      setModalOpen(false);
      setModalStartDate("");
      setModalEndDate("");
      fetchPromotions();
      // window.location.reload();
    } catch (error) {
      console.error("Error adding promotion:", error);
      showToast("error", "Failed to add promotion.");
    } finally {
      setIsSavingPromo(false); // 🔥 STOP LOADER
    }
  };

  const addToPromotions = (product, variant) => {
    console.log(product);

    setSelectedProduct(product);
    setSelectedVariant(variant); // Crucial: use this in handleSubmitPromotion

    setModalOpen(true);
  };

  const onDeleteSelected = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected listings?",
    );
    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedProducts.map(async (id) => {
          const response = await fetch(`https://multi-vendor-marketplace.vercel.app/promo/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error("Failed to delete product");
        }),
      );

      setProducts(products.filter((p) => !selectedProducts.includes(p._id)));
      setPromotions(
        promotions.filter((p) => !selectedProducts.includes(p._id)),
      );
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error deleting products:", error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const handleScroll = async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 400 >=
      document.documentElement.scrollHeight
    ) {
      if (hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  const [promotionToEnd, setPromotionToEnd] = useState(null);

  const endPromotion = async () => {
    if (!promotionToEnd) {
      showToast("error", "No promotion selected to end.");
      return;
    }

    try {
      setLoading(true);
      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");

      const response = await fetch(
        `https://multi-vendor-marketplace.vercel.app/promo/endPromotions/${promotionToEnd}`,
        {
          method: "DELETE",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to end promotion");

      // ✅ Remove ended promotion from UI
      setPromotions((prev) =>
        prev.filter((promo) => promo._id !== promotionToEnd),
      );

      setPromotionToEnd(null);
      setIsPopupOpen(false);
      showToast("success", "Promotion ended successfully!");
    } catch (error) {
      console.error("❌ Error ending promotion:", error);
      showToast("error", error.message || "Failed to end promotion.");
    } finally {
      setLoading(false);
    }
  };

  return user ? (
    <main className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start border-b-2 border-gray-200 pb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">Promotions</h1>
          <p className="text-gray-600">Auto-updates in 2 min.</p>
          <div className="w-2/4 max-sm:w-full mt-2"></div>
        </div>

        {toast.show && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-lg z-50 text-white text-sm ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 space-y-4 mb-4">
        <div className="flex gap-2">
          {["Promotions Details", "Add Promotions", "Submitted Promotions"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  localStorage.setItem("activeTab", tab);
                }}
                className={`px-4 py-2 text-sm rounded-lg ${
                  activeTab === tab
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>
      </div>
      {activeTab === "Submitted Promotions" && selectedProducts.length > 0 && (
        <div className="flex flex-col md:flex-row md:justify-between items-center mt-4 space-y-4 md:space-y-0">
          <div className="flex gap-2 items-center w-2/4 max-sm:w-full md:ml-auto justify-end">
            <button
              onClick={onDeleteSelected}
              className="bg-red-500 hover:bg-red-400 text-white py-2 px-6 rounded-md mb-2 transition duration-300 ease-in-out flex items-center space-x-2"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {Loading && (
        <div className="flex justify-center items-center py-10 gap-2">
          <HiOutlineRefresh className="animate-spin text-xl text-gray-500" />
          Loading...
        </div>
      )}

      {!Loading && (
        <>
          {activeTab === "Promotions Details" && (
            <div className="space-y-6">
              {promotions
                // .filter((product) => {
                //   // ✅ Show both active and inactive for merchants
                //   if (
                //     userRole === "Merchant" ||
                //     userRole === "Merchant Staff"
                //   ) {
                //     return (
                //       product.createdRole === "Merchant" ||
                //       product.createdRole === "Merchant Staff"
                //     );
                //   }

                //   // ✅ For Admins, keep active filter
                //   if (product.status !== "active") return false;

                //   switch (userRole) {
                //     case "Dev Admin":
                //       return true;
                //     case "Master Admin":
                //       return (
                //         product.createdRole === "Master Admin" ||
                //         product.createdRole === "Merchant" ||
                //         product.createdRole === "Merchant Staff"
                //       );
                //     default:
                //       return false;
                //   }
                // })
                .filter((product) => {
                  // ✅ Merchants & Merchant Staff see all promotions (active or inactive)
                  if (
                    userRole === "Merchant" ||
                    userRole === "Merchant Staff"
                  ) {
                    return true;
                  }

                  // ✅ Admins only see active promotions
                  if (product.status !== "active") return false;

                  switch (userRole) {
                    case "Dev Admin":
                      return true;
                    case "Master Admin":
                      return (
                        product.createdRole === "Master Admin" ||
                        product.createdRole === "Merchant" ||
                        product.createdRole === "Merchant Staff"
                      );
                    default:
                      return false;
                  }
                })

                .map((product) => (
                  <div
                    key={product._id}
                    className="border rounded-md bg-white shadow-sm p-6 text-sm text-gray-700 space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div>
                        <p className="font-semibold text-base text-black">
                          {product.variantName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(product.startDate).toLocaleString()} –{" "}
                          {new Date(product.endDate).toLocaleString()}
                        </p>
                      </div>
                      <CountdownTimer
                        startDate={product.startDate}
                        endDate={product.endDate}
                      />
                    </div>

                    <p className="text-sm mt-2">
                      Promotion details loaded dynamically.
                    </p>

                    <div className="flex items-center gap-8 flex-wrap text-xs mt-4">
                      <div className="flex items-center gap-2">
                        <img
                          src="https://img.icons8.com/ios-filled/50/000000/box.png"
                          alt="Products"
                          className="w-4 h-4"
                        />
                        <span>{product.variantQuantity || 0}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between">
                      <p className="text-sm text-gray-600">
                        Add your products to this promotion, sell them and make
                        profit.
                      </p>

                      <button
                        onClick={() => {
                          setPromotionToEnd(product._id); // store promo id
                          setIsPopupOpen(true); // open modal
                        }}
                        className="text-blue-600 text-md hover:underline"
                      >
                        End Promotion
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {activeTab === "Add Promotions" && (
            <div className="max-sm:overflow-auto border rounded-lg">
              <table className="w-full border-collapse bg-white">
                <thead className="bg-gray-100 text-left text-gray-600 text-xs">
                  <tr>
                    <th className="p-3">LISTING NAME</th>
                    <th className="p-3">SELLER_SKU</th>
                    <th className="p-3">ORIGINAL_PRICE</th>
                    <th className="p-3">PROMO_PRICE</th>
                    <th className="p-3">ADD PROMOTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const isCollapsed = collapsedProducts[product._id];

                    return (
                      <React.Fragment key={product._id}>
                        {/* Product Row (clickable, highlighted and right-aligned arrow) */}
                        <tr
                          className="font-semibold cursor-pointer select-none bg-blue-50"
                          onClick={() => toggleCollapse(product._id)}
                        >
                          <td className="p-3" colSpan={5}>
                            <div className="flex justify-between items-center">
                              <span>
                                {product.title !== "Job Listing"
                                  ? product.title
                                  : "Job Search Listing"}
                              </span>
                              {isCollapsed ? (
                                <FiChevronRight className="ml-2" />
                              ) : (
                                <FiChevronDown className="ml-2" />
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Variant rows */}
                        {!isCollapsed &&
                          product.variants.map((variant) => (
                            <tr
                              key={variant.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-3">
                                <div className="font-medium text-gray-800">
                                  {variant.title ||
                                    [
                                      variant.option1,
                                      variant.option2,
                                      variant.option3,
                                    ]
                                      .filter(Boolean)
                                      .join(" / ")}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Listing:{" "}
                                  {product.title !== "Job Listing"
                                    ? product.title
                                    : "Job Search Listing"}
                                </div>
                              </td>
                              <td className="p-3">{variant.sku || "N/A"}</td>
                              <td className="p-3">
                                ${variant.price || product.oldPrice || "N/A"}
                              </td>
                              <td className="p-3">
                                <input
                                  type="text"
                                  value={promoPrices[variant.id] || ""}
                                  onChange={(e) =>
                                    setPromoPrices((prev) => ({
                                      ...prev,
                                      [variant.id]: e.target.value,
                                    }))
                                  }
                                  className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                                  placeholder="Enter promo price"
                                />
                              </td>
                              <td className="p-3">
                                <button
                                  className="flex items-center text-blue-500 hover:text-blue-700 transition duration-200"
                                  onClick={() =>
                                    addToPromotions(product, variant)
                                  }
                                >
                                  Add to promotion
                                </button>
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Submitted Promotions" && (
            <table className="w-full border-collapse bg-white">
              <thead className="bg-gray-100 text-left text-gray-600 text-sm">
                <tr>
                  <th className="p-3">ACTION</th>
                  <th className="p-3">LISTING NAME</th>
                  <th className="p-3">SELLER_SKU</th>
                  <th className="p-3">ORIGINAL_PRICE</th>
                  <th className="p-3">PROMO_PRICE</th>
                  <th className="p-3">CURRENT_STOCK</th>
                  {/* <th className="p-3">EDIT</th> */}
                </tr>
              </thead>

              <tbody>
                {promotions
                  // .filter((product) => {
                  //   // ✅ Show both active and inactive for merchants
                  //   if (
                  //     userRole === "Merchant" ||
                  //     userRole === "Merchant Staff"
                  //   ) {
                  //     return (
                  //       product.createdRole === "Merchant" ||
                  //       product.createdRole === "Merchant Staff"
                  //     );
                  //   }

                  //   // ✅ For Admins, keep active filter
                  //   if (product.status !== "active") return false;

                  //   switch (userRole) {
                  //     case "Dev Admin":
                  //       return true;
                  //     case "Master Admin":
                  //       return (
                  //         product.createdRole === "Master Admin" ||
                  //         product.createdRole === "Merchant" ||
                  //         product.createdRole === "Merchant Staff"
                  //       );
                  //     default:
                  //       return false;
                  //   }
                  // })
                  .filter((product) => {
                    // ✅ Merchants & Merchant Staff see all promotions (active or inactive)
                    if (
                      userRole === "Merchant" ||
                      userRole === "Merchant Staff"
                    ) {
                      return true;
                    }

                    // ✅ Admins only see active promotions
                    if (product.status !== "active") return false;

                    switch (userRole) {
                      case "Dev Admin":
                        return true;
                      case "Master Admin":
                        return (
                          product.createdRole === "Master Admin" ||
                          product.createdRole === "Merchant" ||
                          product.createdRole === "Merchant Staff"
                        );
                      default:
                        return false;
                    }
                  })

                  .map((product) => (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() =>
                            setSelectedProducts((prev) =>
                              prev.includes(product._id)
                                ? prev.filter((id) => id !== product._id)
                                : [...prev, product._id],
                            )
                          }
                        />
                      </td>
                      <td className="p-3">{product.productName || "-"}</td>
                      <td className="p-3">{product.productSku || "-"}</td>
                      <td className="p-3">${product.currentPrice}</td>
                      <td className="p-3">${product.promoPrice || "-"}</td>
                      <td className="p-3">{product.currentStock || "-"}</td>
                    </tr>
                  ))}

                {promotions.filter((product) => {
                  // ✅ Merchants & Merchant Staff see all promotions (active or inactive)
                  if (
                    userRole === "Merchant" ||
                    userRole === "Merchant Staff"
                  ) {
                    return true;
                  }

                  // ✅ Admins only see active promotions
                  if (product.status !== "active") return false;

                  switch (userRole) {
                    case "Dev Admin":
                      return true;
                    case "Master Admin":
                      return (
                        product.createdRole === "Master Admin" ||
                        product.createdRole === "Merchant" ||
                        product.createdRole === "Merchant Staff"
                      );
                    default:
                      return false;
                  }
                }).length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No active submitted products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fadeInUp p-8 relative border border-gray-200">
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
                Are you sure you want to end this promotion?
              </p>

              <button
                onClick={endPromotion} // ✅ this calls your fixed function
                className="mt-6 inline-block px-6 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-full hover:opacity-90 transition"
              >
                {Loading ? "Ending..." : "Okay"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Add Promotion Duration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={modalStartDate}
                  onChange={(e) => setModalStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={modalEndDate}
                  onChange={(e) => setModalEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPromotion}
                disabled={isSavingPromo}
                className={`px-4 py-2 text-sm rounded text-white flex items-center justify-center gap-2
    ${
      isSavingPromo
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-500"
    }
  `}
              >
                {isSavingPromo ? (
                  <>
                    <HiOutlineRefresh className="animate-spin text-lg" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  ) : null;
};

export default Promotion;

const CountdownTimer = ({ startDate, endDate }) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [status, setStatus] = useState("");

  useEffect(() => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();

      if (now < start) {
        setStatus("upcoming");
        const distance = start - now;
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else if (now >= start && now <= end) {
        setStatus("running");
        const distance = end - now;
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setStatus("expired");
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  const renderLabel = () => {
    if (status === "upcoming") return "Starts in";
    if (status === "running") return "Ends in";
    return "Expired";
  };

  return (
    <div className="flex flex-col items-end text-xs text-gray-600 mt-4 md:mt-0">
      <p className="text-right text-black">{renderLabel()}</p>
      {status !== "expired" && (
        <div className="flex gap-2 text-center text-xs font-semibold mt-1">
          <div>
            <div className="text-lg">{countdown.days}</div>
            <div className="text-[10px]">Days</div>
          </div>
          <div>
            <div className="text-lg">{countdown.hours}</div>
            <div className="text-[10px]">Hours</div>
          </div>
          <div>
            <div className="text-lg">{countdown.minutes}</div>
            <div className="text-[10px]">Minutes</div>
          </div>
          <div>
            <div className="text-lg">{countdown.seconds}</div>
            <div className="text-[10px]">Seconds</div>
          </div>
        </div>
      )}
      {status === "expired" && (
        <p className="text-red-500 text-xs mt-1 font-semibold">
          Promotion Ended
        </p>
      )}
    </div>
  );
};
