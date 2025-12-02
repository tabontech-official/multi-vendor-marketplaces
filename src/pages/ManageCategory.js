import React, { useEffect, useState } from "react";
import { IoPricetagsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const ManageCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [replacementNames, setReplacementNames] = useState({});
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
        { replaceData }
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
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded?.payLoad?.role) {
        setRole(decoded.payLoad.role);
      } else {
        setRole("");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");

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
        } else {
          setError(data.message || "Failed to fetch categories.");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("An error occurred while fetching categories");
      }
    };

    fetchCategories();
  }, []);

  const handleButtonClick = () => {
    navigate("/create-categories");
  };
  const handleExport = async () => {
    try {
      const response = await fetch(
        "https://multi-vendor-marketplace.vercel.app/category/getCsvForCategories",
        {
          method: "GET",
        }
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
      await axios.delete("https://multi-vendor-marketplace.vercel.app/category/deleteCategory", {
        headers: {
          "x-api-key": apiKey,
          "x-api-secret": apiSecretKey,
          "Content-Type": "application/json",
        },
        data: {
          categoryIds: selectedCategoryIds,
        },
      });

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
        }
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
      (cat) => selectedCategoryIds.includes(cat._id) && cat.productCount > 0
    );

    if (conflicts.length > 0) {
      setConflictCategories(conflicts);
      setShowDeleteModal(false);
      setShowReplaceModal(true);
    } else {
      performDelete(); // normal delete
    }
  };
  const handleImportCsv = async () => {
  if (!importFile) {
    alert("Please select a CSV file.");
    return;
  }

  const formData = new FormData();
  formData.append("file", importFile); // ✅ MATCHES multer.single("file")

  try {
    setIsImporting(true);

    const response = await axios.post(
      "https://multi-vendor-marketplace.vercel.app/category/uploadCsvForCategories",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
  const [importParentCat1, setImportParentCat1] = useState(""); // for level 2
  const [importParentCat2, setImportParentCat2] = useState(""); // for level 3

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [replaceName, setReplaceName] = useState("");
  const [conflictCategories, setConflictCategories] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  return (
    <div className="p-4">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-2">
          <IoPricetagsOutline size={24} className="text-gray-600" />
          <h1 className="font-semibold text-xl">Collections</h1>
        </div>

        <div className="flex space-x-2 mt-4">
          {selectedCategoryIds.length > 0 && (
            <button
              className="bg-red-500 text-white px-4 py-1 border rounded-md"
              onClick={handleDeleteCategories}
            >
              Delete Collection
            </button>
          )}

          <button
            onClick={handleExport}
            className="bg-green-400 text-white px-4 py-1 border rounded-md hover:bg-green-500"
          >
            Export
          </button>
          {(role === "Master Admin" || role === "Dev Admin") && (
            <button
              onClick={handleButtonClick}
              className="bg-gray-800 text-white px-3 py-1 border rounded-md hover:bg-gray-900"
            >
              Create Collection
            </button>
          )}
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-blue-500 text-white px-4 py-1 border rounded-md hover:bg-blue-600"
          >
            Import CSV
          </button>
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <table className="w-full border-collapse bg-white border rounded-2xl">
        <thead className="bg-gray-100 text-left text-gray-600 text-sm">
          <tr>
            <th className="p-3">
              <input
                type="checkbox"
                checked={
                  categories.length > 0 &&
                  selectedCategoryIds.length === categories.length
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategoryIds(categories.map((cat) => cat._id));
                  } else {
                    setSelectedCategoryIds([]);
                  }
                }}
              />
            </th>
            <th className="p-3">Id</th>
            <th className="p-3">Level</th>
            <th className="p-3">Title</th>
            <th className="p-3">Products</th>
            <th className="p-3">Published</th>
            <th className="p-3">Hierarchy</th>
          </tr>
        </thead>

        <tbody>
          {categories
            .filter((cat) => !cat.parentCatNo) // ✔ SHOW ALL ROOT CATEGORIES
            .map((root, rootIndex) => {
              const level2s = categories.filter(
                (c) => c.parentCatNo === root.catNo
              );

              const rootRow = (
                <tr
                  key={`root-${rootIndex}`}
                  className={`border-b ${
                    rootIndex % 2 === 0 ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <td className="p-1 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(root._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategoryIds((prev) => [...prev, root._id]);
                        } else {
                          setSelectedCategoryIds((prev) =>
                            prev.filter((id) => id !== root._id)
                          );
                        }
                      }}
                    />
                  </td>

                  <td className="p-1 text-sm">{root.catNo}</td>
                  <td className="p-1 text-sm">{root.level}</td>
                  <td className="p-1 text-sm">{root.title}</td>
                  <td className="p-1 text-sm">{root.productCount}</td>
                  <td className="p-1 text-sm">
                    {root.createdAt
                      ? new Date(root.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-1 text-sm">{root.title}</td>
                </tr>
              );

              const level2Rows = level2s.flatMap((lvl2, lvl2Index) => {
                const level3s = categories.filter(
                  (c) => c.parentCatNo === lvl2.catNo
                );

                const lvl2Row = (
                  <tr
                    key={`lvl2-${rootIndex}-${lvl2Index}`}
                    className="border-b bg-gray-50"
                  >
                    <td className="p-1 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes(lvl2._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategoryIds((prev) => [
                              ...prev,
                              lvl2._id,
                            ]);
                          } else {
                            setSelectedCategoryIds((prev) =>
                              prev.filter((id) => id !== lvl2._id)
                            );
                          }
                        }}
                      />
                    </td>

                    <td className="p-1 text-sm">{lvl2.catNo}</td>
                    <td className="p-1 text-sm">{lvl2.level}</td>
                    <td className="p-1 text-sm">{lvl2.title}</td>
                    <td className="p-1 text-sm">{lvl2.productCount}</td>
                    <td className="p-1 text-sm">
                      {lvl2.createdAt
                        ? new Date(lvl2.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-1 text-sm">
                      {`${root.title} > ${lvl2.title}`}
                    </td>
                  </tr>
                );

                const level3Rows = level3s.map((lvl3, lvl3Index) => (
                  <tr
                    key={`lvl3-${rootIndex}-${lvl2Index}-${lvl3Index}`}
                    className="border-b bg-gray-100"
                  >
                    <td className="p-1 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes(lvl3._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategoryIds((prev) => [
                              ...prev,
                              lvl3._id,
                            ]);
                          } else {
                            setSelectedCategoryIds((prev) =>
                              prev.filter((id) => id !== lvl3._id)
                            );
                          }
                        }}
                      />
                    </td>

                    <td className="p-1 text-sm">{lvl3.catNo}</td>
                    <td className="p-1 text-sm">{lvl3.level}</td>
                    <td className="p-1 text-sm">{lvl3.title}</td>
                    <td className="p-1 text-sm">{lvl3.productCount}</td>
                    <td className="p-1 text-sm">
                      {lvl3.createdAt
                        ? new Date(lvl3.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-1 text-sm">
                      {`${root.title} > ${lvl2.title} > ${lvl3.title}`}
                    </td>
                  </tr>
                ));

                return [lvl2Row, ...level3Rows];
              });

              return [rootRow, ...level2Rows];
            })}
        </tbody>
      </table>

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
