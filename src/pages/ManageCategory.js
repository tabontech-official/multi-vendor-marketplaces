import React, { useEffect, useState } from "react";
import { IoPricetagsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { HiOutlineRefresh } from "react-icons/hi";
import { FaFileImport } from "react-icons/fa";
const ManageCategory = () => {
  const navigate = useNavigate();
  const [allCategories, setAllCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterParent, setFilterParent] = useState("");

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [replacementNames, setReplacementNames] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalCategories, setTotalCategories] = useState(0);

  const [totalPages, setTotalPages] = useState(1);
  const Loader = () => (
    <div className="flex justify-center items-center py-10">
      <HiOutlineRefresh className="animate-spin text-xl text-gray-500" />
      loading...
    </div>
  );
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.catNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      filterLevel === "" ||
      cat.level.toLowerCase() === filterLevel.toLowerCase();

    const matchesParent =
      filterParent === "" || cat.parentCatNo === filterParent;

    return matchesSearch && matchesLevel && matchesParent;
  });

  const handleReplaceMulti = async () => {
    for (let cat of conflictCategories) {
      if (!replacementNames[cat._id]) {
        alert(`Please select replacement for "${cat.title}"`);
        return;
      }
    }

    const replaceData = conflictCategories.map((cat) => ({
      oldCategoryId: cat._id,
      newCategoryId: replacementNames[cat._id],
    }));

    try {
      await axios.put(
        "https://multi-vendor-marketplace.vercel.app/category/replaceAndDeleteCategory",
        { replaceData },
      );

      alert("Products moved & Categories deleted!");
      setShowReplaceModal(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Error replacing categories.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      if (decoded?.payLoad?.role) {
        setRole(decoded.payLoad.role);
      } else {
        setRole("");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);
  const getPageNumbers = () => {
    const maxPagesToShow = 4;

    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(1, page - 1);
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = endPage - maxPagesToShow + 1;
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);

      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");

      try {
        const response = await fetch(
          `https://multi-vendor-marketplace.vercel.app/category/getCategory?page=${page}&limit=${limit}`,
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
          setCategories(data.categories || []);
          setTotalPages(data.totalPages || 1);

          setTotalCategories(data.totalCategories || 0);
        } else {
          setError(data.message || "Failed to fetch categories.");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("An error occurred while fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page, limit]);

  const getHierarchy = (cat) => {
    if (!cat.parentCatNo) return cat.title;

    const parent = categories.find((c) => c.catNo === cat.parentCatNo);
    if (!parent) return cat.title;

    if (!parent.parentCatNo) {
      return `${parent.title} > ${cat.title}`;
    }

    const grandParent = categories.find((c) => c.catNo === parent.parentCatNo);

    if (!grandParent) return `${parent.title} > ${cat.title}`;

    return `${grandParent.title} > ${parent.title} > ${cat.title}`;
  };

  const handleButtonClick = () => {
    navigate("/create-categories");
  };
  const handleExport = async () => {
    try {
      const response = await fetch(
        "https://multi-vendor-marketplace.vercel.app/category/getCsvForCategories",
        {
          method: "GET",
        },
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "categories_export.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Failed to export categories");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteCategories = async () => {
    if (selectedCategoryIds.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    setShowDeleteModal(true);
  };
  const performDelete = async () => {
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");

    try {
      await axios.delete(
        "https://multi-vendor-marketplace.vercel.app/category/deleteCategory",
        {
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
          data: {
            categoryIds: selectedCategoryIds,
          },
        },
      );

      alert("Selected categories deleted successfully!");

      setShowDeleteModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Error deleting categories.");
    }
  };

  const handleReplaceAndUpdate = async () => {
    if (!replaceName.trim()) {
      alert("Please enter replacement collection name.");
      return;
    }

    try {
      await axios.put(
        "https://multi-vendor-marketplace.vercel.app/category/updateCategoryInsteadDelete",
        {
          conflictCategoryIds: conflictCategories.map((c) => c._id),
          newName: replaceName,
        },
      );

      alert("Collection updated successfully");

      setShowReplaceModal(false);
      window.location.reload();
    } catch (error) {
      alert("Error updating category");
      console.error(error);
    }
  };

  const checkCategoryProductsBeforeDelete = () => {
    const conflicts = categories.filter(
      (cat) => selectedCategoryIds.includes(cat._id) && cat.productCount > 0,
    );

    if (conflicts.length > 0) {
      setConflictCategories(conflicts);
      setShowDeleteModal(false);
      setShowReplaceModal(true);
    } else {
      performDelete();
    }
  };
  const handleImportCsv = async () => {
    if (!importFile) {
      alert("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", importFile);

    try {
      setIsImporting(true);

      const response = await axios.post(
        "https://multi-vendor-marketplace.vercel.app/category/uploadCsvForCategories",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert("CSV Imported Successfully!");

      setShowImportModal(false);
      setImportFile(null);
      setIsImporting(false);

      window.location.reload();
    } catch (error) {
      console.error("CSV Upload Error:", error);
      alert(error?.response?.data?.error || "Error importing CSV");
      setIsImporting(false);
    }
  };

  const [importLevel, setImportLevel] = useState("");
  const [importParentCat1, setImportParentCat1] = useState("");
  const [importParentCat2, setImportParentCat2] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [replaceName, setReplaceName] = useState("");
  const [conflictCategories, setConflictCategories] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  return (
    <div className="p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-gray-200 p-4 gap-4">
        {/* LEFT: Title */}
        <div className="flex-1 flex items-center gap-2">
          <IoPricetagsOutline size={22} className="text-gray-600" />
          <div>
            <h1 className="font-semibold text-xl text-gray-900">Collections</h1>
          </div>
        </div>

        {/* CENTER: Search */}
        <div className="flex-1 w-full max-w-sm mx-auto">
          <input
            type="text"
            placeholder="Search by title or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-1.5 text-sm border border-gray-300 rounded-md
        focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* RIGHT: Actions */}
        <div className="flex-1 flex flex-wrap items-center justify-end gap-2 w-full">
          {selectedCategoryIds.length > 0 && (
            <button
              onClick={handleDeleteCategories}
              className="bg-red-500 hover:bg-red-600 text-white px-3 h-8 text-sm font-medium rounded-md shadow-sm"
            >
              Delete Collection
            </button>
          )}

          <button
            onClick={handleExport}
            className="bg-gray-400 border border-gray-300 hover:bg-gray-500 text-gray-800 px-3 h-8 text-sm font-medium rounded-md flex items-center gap-1.5 shadow-sm"
          >
            <FaFileImport className="w-4 h-4" />
            <span>Export</span>
          </button>

          {(role === "Master Admin" || role === "Dev Admin") && (
            <button
              onClick={handleButtonClick}
              className="bg-gray-800 hover:bg-gray-900 text-white px-3 h-8 text-sm font-medium rounded-md shadow-sm"
            >
              Create Collection
            </button>
          )}
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}
      {loading ? (
        <Loader />
      ) : (
        <>
          <table className="w-full border-collapse bg-white border rounded-2xl">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase sticky top-0 text-left">
              <tr>
                <th className="p-1">
                  <input
                    type="checkbox"
                    checked={
                      categories.length > 0 &&
                      selectedCategoryIds.length === categories.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategoryIds(
                          categories.map((cat) => cat._id),
                        );
                      } else {
                        setSelectedCategoryIds([]);
                      }
                    }}
                  />
                </th>
                <th className="p-1">Hierarchy</th>

                <th className="p-1">Id</th>
                <th className="p-1">Level</th>
                <th className="p-1">Title</th>
                {(role === "Master Admin" || role === "Dev Admin") && (
                  <th className="p-1">Products</th>
                )}
                {(role === "Master Admin" || role === "Dev Admin") && (
                  <th className="p-1">Published</th>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((cat, index) => (
                <tr key={cat._id} className="border-b">
                  <td className="p-1">
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(cat._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategoryIds((prev) => [...prev, cat._id]);
                        } else {
                          setSelectedCategoryIds((prev) =>
                            prev.filter((id) => id !== cat._id),
                          );
                        }
                      }}
                    />
                  </td>
                  <td className="p-1 text-sm">{getHierarchy(cat)}</td>{" "}
                  <td className="p-1">{cat.catNo}</td>
                  <td className="p-1">{cat.level}</td>
                  <td className="p-1">{cat.title}</td> {/* Title */}
                  <td className="p-1">{cat.productCount}</td>
                  <td className="p-1">
                    {cat.createdAt
                      ? new Date(cat.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  {/* Hierarchy */}
                </tr>
              ))}
            </tbody>
          </table>{" "}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 bg-gray-50 border border-gray-200 mt-4">
              {/* Left Side (Optional) */}
              <div className="text-sm text-gray-700 mb-2 md:mb-0">
                Total Categories:{" "}
                <span className="font-medium">{totalCategories}</span>
              </div>

              {/* Center Pagination */}
              <div className="flex items-center space-x-2 mb-2 md:mb-0">
                {/* PREVIOUS BUTTON */}
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className={`px-3 py-1 border rounded ${
                    page === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
                >
                  &lt;
                </button>

                {/* PAGE NUMBER WINDOW */}
                {getPageNumbers().map((p) => (
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
                ))}

                {/* NEXT BUTTON */}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className={`px-3 py-1 border rounded ${
                    page === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
                >
                  &gt;
                </button>
              </div>

              {/* Right Side Limit Selector */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  Items per page:
                </label>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>
            </div>
          )}
        </>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-semibold">Confirm Delete</h2>
            <p className="text-sm mt-2">
              Are you sure you want to delete selected collections?
            </p>

            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-1 bg-gray-300 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-1 bg-red-500 text-white rounded"
                onClick={checkCategoryProductsBeforeDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showReplaceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-[500px] shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Products Linked!</h2>

            <p className="text-sm text-gray-700 mb-3">
              These collections have products linked. Please provide a
              replacement name for each:
            </p>

            {/* TABLE */}
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-2 text-left">Collection</th>
                  <th className="border px-2 py-2 text-center">Products</th>
                  <th className="border px-2 py-2 text-left">
                    Replacement Name
                  </th>
                </tr>
              </thead>

              <tbody>
                {conflictCategories.map((cat) => (
                  <tr key={cat._id} className="odd:bg-white even:bg-gray-50">
                    <td className="border px-2 py-2 font-medium">
                      {cat.title}
                    </td>

                    <td className="border px-2 py-2 text-center text-blue-600">
                      {cat.productCount}
                    </td>

                    <td className="border px-2 py-2">
                      <select
                        className="w-full border p-1 rounded text-sm"
                        value={replacementNames[cat._id] || ""}
                        onChange={(e) =>
                          setReplacementNames((prev) => ({
                            ...prev,
                            [cat._id]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Replacement Category</option>

                        {categories
                          .filter((c) => c._id !== cat._id) // Exclude the one being replaced
                          .map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.title}
                            </option>
                          ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* BUTTONS */}
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-1 bg-gray-300 rounded"
                onClick={() => setShowReplaceModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-1 bg-blue-600 text-white rounded"
                onClick={handleReplaceMulti}
              >
                Update & Continue
              </button>
            </div>
          </div>
        </div>
      )}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[420px] shadow-lg">
            <h2 className="text-lg font-semibold mb-3">
              Import Categories CSV
            </h2>

            <p className="font-medium mb-2">Select Import Level:</p>

            <div className="space-y-1 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="importLevel"
                  value="level1"
                  onChange={(e) => setImportLevel(e.target.value)}
                />
                Level 1 (CSV does NOT contain parentCatNo)
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="importLevel"
                  value="level2"
                  onChange={(e) => setImportLevel(e.target.value)}
                />
                Level 2 (CSV must include parentCatNo = Level 1 catNo)
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="importLevel"
                  value="level3"
                  onChange={(e) => setImportLevel(e.target.value)}
                />
                Level 3 (CSV must include parentCatNo = Level 2 catNo)
              </label>
            </div>

            {/* CSV SELECT */}
            <input
              type="file"
              accept=".csv"
              className="border p-2 w-full rounded mb-4"
              onChange={(e) => setImportFile(e.target.files[0])}
            />

            {/* BUTTONS */}
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-1 bg-gray-300 rounded"
                disabled={isImporting}
                onClick={() => setShowImportModal(false)}
              >
                Cancel
              </button>

              <button
                className={`px-4 py-1 text-white rounded ${
                  isImporting ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={isImporting || !importFile || !importLevel}
                onClick={handleImportCsv}
              >
                {isImporting ? "Importing..." : "Import"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategory;
