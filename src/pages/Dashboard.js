import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  HiDotsVertical,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiPlus,
  HiX,
  Hiload,
} from "react-icons/hi";
import { FaFileImport } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import UseFetchUserData from "../component/fetchUser";
import { useAuthContext } from "../Hooks/useAuthContext";
import { Dialog } from "@headlessui/react";
import { FaTimes, FaShoppingBasket } from "react-icons/fa";
import { CreateCheckoutUrl } from "../component/Checkout";
import { HiOutlineRefresh } from "react-icons/hi";
import { jwtDecode } from "jwt-decode";
import { debounce } from "lodash";
import { MdEdit } from "react-icons/md";

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
  const [selectedProducts, setSelectedProducts] = useState([]);
  const toggleSelection = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

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
          ? `http://localhost:5000/product/getAllData/?page=${page}&limit=${limit}`
          : `http://localhost:5000/product/getProduct/${id}/?page=${page}&limit=${limit}`,
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

    let formPage = "/PRODUCT_LISTING";

    navigate(formPage, { state: { product } });
  };

  const onDeleteSelected = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected listings?"
    );
    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedProducts.map(async (id) => {
          const response = await fetch(
            `http://localhost:5000/product/deleteProduct/${id}`,
            { method: "DELETE" }
          );
          if (!response.ok) throw new Error("Failed to delete product");
        })
      );

      setProducts(products.filter((p) => !selectedProducts.includes(p._id)));
      setFilteredProducts(
        filteredProducts.filter((p) => !selectedProducts.includes(p._id))
      );
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error deleting products:", error);
    }
  };

  const handlePublishSelected = async () => {
    const userId = localStorage.getItem("userid");
    setMessage("");

    try {
      await Promise.all(
        selectedProducts.map(async (id) => {
          const product = filteredProducts.find((p) => p._id === id);
          if (product?.status === "draft") {
            const response = await fetch(
              `http://localhost:5000/product/publishedProduct/${id}`,
              {
                method: "PUT",
                body: JSON.stringify({ userId }),
                headers: { "Content-Type": "application/json" },
              }
            );
            if (!response.ok) throw new Error("Failed to publish product");
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

    try {
      await Promise.all(
        selectedProducts.map(async (id) => {
          const product = filteredProducts.find((p) => p._id === id);
          if (product?.status === "active") {
            const response = await fetch(
              `http://localhost:5000/product/unpublished/${id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (!response.ok) throw new Error("Failed to unpublish product");
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
            ? `http://localhost:5000/product/getAllData/?page=${page}&limit=${limit}`
            : `http://localhost:5000/product/getProduct/${id}/?page=${page}&limit=${limit}`,
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

          setFilteredProducts((prev) => [
            ...prev,
            ...sortedProducts.filter(
              (newProduct) =>
                !prev.some((prevProduct) => prevProduct.id === newProduct.id)
            ),
          ]);

          setHasMore(page < data.totalPages);
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
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
          <Link
            to="/PRODUCT_LISTING"
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

      {/* <div className="flex flex-col md:flex-row md:justify-between items-center mt-4 space-y-4 md:space-y-0">
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
      </div> */}
      <div className="flex flex-col md:flex-row md:justify-between items-center mt-4 space-y-4 md:space-y-0">
        <div className="flex gap-2 items-center w-2/4 max-sm:w-full md:ml-auto justify-end"></div>
        <button className="bg-blue-500 hover:bg-blue-400 text-white gap-2 py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center space-x-2">
          <FaFileImport className="w-5 h-5"/>
          Import
        </button>
      </div>
      {selectedProducts.length > 0 && (
        <div className="flex flex-col md:flex-row md:justify-between items-center mt-4 space-y-4 md:space-y-0">
          <div className="flex gap-2 items-center w-2/4 max-sm:w-full md:ml-auto justify-end">
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
              className="bg-red-500 hover:bg-red-400 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {Loading ? (
        <div className="flex justify-center items-center py-10">
          <HiOutlineRefresh className="animate-spin text-xl text-gray-500" />
          loading...
        </div>
      ) : (
        <div className="p-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <h2>No products available.</h2>
            </div>
          ) : (
            <div className=" max-sm:overflow-auto border rounded-lg">
              <table className="w-full border-collapse bg-white">
                <thead className="bg-gray-100 text-left text-gray-600 text-sm">
                  <tr>
                    <th className="p-3">ACTION</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3">LISTING NAME</th>
                    {admin && <th className="p-3">Publisher</th>}
                    <th className="p-3">PUBLISHER</th>
                    <th className="p-3">TYPE</th>
                    <th className="p-3">PRICE</th>
                    <th className="p-3">EDIT</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product, index) => (
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
                        {" "}
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
                        {" "}
                        {product.title !== "Job Listing"
                          ? product.title
                          : "Job Search Listing"}
                      </td>
                      {admin && product.tags?.split(",")[1]?.split("_")[1]}
                      <td className="p-3"> {product.email} </td>
                      <td className="p-3"> {product.product_type}</td>
                      <td className="p-3">
                        {" "}
                        ${product.variants[0].price || "..loading"}{" "}
                      </td>
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
