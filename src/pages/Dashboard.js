import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  HiDotsVertical,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiPlus,
  HiX,
  Hiload,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import UseFetchUserData from "../component/fetchUser";
import { useAuthContext } from "../Hooks/useAuthContext";
import { Dialog } from "@headlessui/react";
import { FaTimes, FaShoppingBasket } from "react-icons/fa";
import { CreateCheckoutUrl } from "../component/Checkout";
import { HiOutlineRefresh } from "react-icons/hi";
import { jwtDecode } from "jwt-decode";
import { debounce } from "lodash";

const Dashboard = () => {
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

  admin = isAdmin();

  const limit = 20;

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
  const { user } = useAuthContext();
  const dropdownRefs = useRef([]);

  const [errorMessage, setErrorMessage] = useState("");

  const [Loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const fetchProductData = async () => {
    setLoading(true);
    const id = localStorage.getItem("userid");
    try {
      const response = await fetch(
        admin
          ? `https://multi-vendor-marketplace.vercel.app/product/getAllData/?page=${page}&limit=${limit}`
          : `https://multi-vendor-marketplace.vercel.app/product/getProduct/${id}/?page=${page}&limit=${limit}`,
        { method: "GET" }
      );

      if (response.ok) {
        const data = await response.json();

        const sortedProducts = data.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProducts(sortedProducts);
        setFilteredProducts((prev) => [
          ...prev,
          ...sortedProducts.filter(
            (newProduct) =>
              !prev.some((prevProduct) => prevProduct.id === newProduct.id)
          ),
        ]);

        setHasMore(page < data.totalPages); // Check if more pages are available
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const OnEdit = (product) => {
    console.log(product);
    console.log("clicking");

    let formPage = "/addproducts";

    navigate(formPage, { state: { product } });
  };

  const onDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirmDelete) return;
    try {
      const response = await fetch(
        `https://multi-vendor-marketplace.vercel.app/product/deleteProduct/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setProducts(products.filter((product) => product._id !== id));
        setFilteredProducts(
          filteredProducts.filter((product) => product._id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
    // setOpenDropdown(null);
  };

  const handlePublish = async (product) => {
    const userId = localStorage.getItem("userid");
    setLoadingId(product.id);
    setMessage("");

    try {
      const response = await fetch(
        `https://multi-vendor-marketplace.vercel.app/product/publishedProduct/${product.id}`,
        {
          method: "PUT",
          body: JSON.stringify(userId),
        }
      );
      const json = await response.json();
      if (response.ok) {
        showToast("success", json.message || "Product published successfully!");
        setMessage(json.message || "Product published successfully!");
        fetchProductData();
      } else {
        showToast(
          "Failed",
          json.error || "An error occurred while publishing the product."
        );
        setErrorMessage(
          json.error || "An error occurred while publishing the product."
        );
      }
    } catch (error) {
      showToast(
        "Failed",
        error.message || "An error occurred while publishing the product"
      );
      setErrorMessage(
        error.message || "An error occurred while publishing the product"
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleUnpublish = async (product) => {
    setLoadingId(product.id);
    setMessage("");

    try {
      const response = await fetch(
        `https://multi-vendor-marketplace.vercel.app/product/unpublished/${product.id}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        showToast("success", "Product unpublished successfully!");
        fetchProductData();
      } else {
        showToast("Failed", "Failed to unpublish product.");
      }
    } catch (error) {
      showToast("Failed", "An error occurred while unpublishing the product.");
    } finally {
      setLoadingId(null);
    }

    // setOpenDropdown(null);
  };

  const handleSearch = () => {
    let filtered =
      searchVal === ""
        ? products
        : products.filter(
            (product) =>
              product.title.includes(searchVal) ||
              product.product_type.includes(searchVal)
          );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchVal]);

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    const fetchProductData2 = async () => {
      const id = localStorage.getItem("userid");

      try {
        const response = await fetch(
          admin
            ? `https://multi-vendor-marketplace.vercel.app/product/getAllData/?page=${page}&limit=${limit}`
            : `https://multi-vendor-marketplace.vercel.app/product/getProduct/${id}/?page=${page}&limit=${limit}`,
          { method: "GET" }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Second Product render", data);

          const sortedProducts = data.products.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setProducts((prev) => [
            ...prev,
            ...sortedProducts.filter(
              (newProduct) =>
                !prev.some((prevProduct) => prevProduct.id === newProduct.id)
            ),
          ]);

          // Append only new products
          setFilteredProducts((prev) => [
            ...prev,
            ...sortedProducts.filter(
              (newProduct) =>
                !prev.some((prevProduct) => prevProduct.id === newProduct.id)
            ),
          ]);

          setHasMore(page < data.totalPages); // Check if more pages are available
          console.log(hasMore);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProductData2();
  }, [page]);

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

  return user ? (
    <main className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start border-b-2 border-gray-200 pb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">Manage Products</h1>
          <p className="text-gray-600">Here you can manage products.</p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
          <Link
            to="/addproducts"
            className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
          >
            <HiPlus className="w-5 h-5" />
            <span>Add Products</span>
          </Link>
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

      <div className="flex flex-col md:flex-row md:justify-between items-center mt-4 space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center w-full md:ml-auto md:space-x-4">
          <div className="flex items-center w-2/4 max-sm:w-full md:ml-auto justify-end">
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="md:w-2/4 p-2 max-sm:w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {Loading ? (
        <div className="flex justify-center items-center py-10">
          <HiOutlineRefresh className="animate-spin text-xl text-gray-500" />
          loading...
        </div>
      ) : (
        <div className="p-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {/* Only show this message if there are no products available */}
              <h2>No products available.</h2>
            </div>
          ) : (
            <div className=" max-sm:overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr className="items-center">
                    <th className="py-3 pl-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTION
                    </th>
                    <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      LISTING NAME
                    </th>
                    {admin && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Publisher
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TYPE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PRICE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CREATED AT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EXPIRES AT
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200 mb-4">
                  {filteredProducts.map((product, index) => (
                    <tr key={product._id}>
                      <td className="py-4 whitespace-nowrap relative px-4">
                        <button
                          onClick={() => toggleDropdown(index)}
                          className="text-gray-600 hover:text-gray-800 focus:outline-none"
                        >
                          <HiDotsVertical className="w-5 h-5" />
                        </button>
                        <div
                          ref={(el) => (dropdownRefs.current[index] = el)}
                          onMouseLeave={() => setOpenDropdown(null)} // Close dropdown on mouse leave
                        >
                          {openDropdown === index && (
                            <div className="absolute bg-white border flex justify-start items-start border-gray-300 rounded-md shadow-lg z-10">
                              <ul className="py-1">
                                {product.status === "draft" ? (
                                  <li
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePublish(product);
                                    }}
                                  >
                                    <button className="px-4 w-full py-2 text-gray-700 hover:bg-gray-100">
                                      {loadingId === product._id
                                        ? "Loading..."
                                        : "Publish"}
                                    </button>
                                  </li>
                                ) : (
                                  product.status === "active" && (
                                    <li
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUnpublish(product);
                                      }}
                                    >
                                      <button className="px-4 w-full py-2 text-gray-700 hover:bg-gray-100">
                                        {loadingId === product._id
                                          ? "Loading..."
                                          : "Unpublish"}
                                      </button>
                                    </li>
                                  )
                                )}
                                <li
                                  onClick={(e) => {
                                    OnEdit(product);
                                  }}
                                >
                                  <button className="px-4 w-full py-2 text-gray-700 hover:bg-gray-100">
                                    Edit
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDelete(product._id);
                                    }}
                                    className="px-4 w-full py-2 text-gray-700 hover:bg-gray-100"
                                  >
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            product.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                          title={product.status}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.title !== "Job Listing"
                          ? product.title
                          : "Job Search Listing"}
                      </td>
                      {admin && product.tags?.split(",")[1]?.split("_")[1]}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.product_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${product.variants[0].price || "..loading"}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        {product.expiresAt &&
                        !isNaN(new Date(product.expiresAt))
                          ? new Date(product.expiresAt).toLocaleDateString()
                          : " "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </main>
  ) : null;
};

export default Dashboard;
