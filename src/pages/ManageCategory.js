import React, { useEffect, useState } from "react";
import { IoPricetagsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const ManageCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://multi-vendor-marketplace.vercel.app/category/getCategory"
        );
        const data = await response.json();

        if (response.ok) {
          setCategories(data);
        } else {
          setError(data.message);
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
      alert("Please select at least one category to delete.");
      return;
    }

    try {
      await axios.delete("https://multi-vendor-marketplace.vercel.app/category/deleteCollection", {
        data: {
          categoryIds: selectedCategoryIds,
        },
      });

      alert("Selected categories deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Error deleting categories.");
    }
  };

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
              Delete Selected
            </button>
          )}

          <button
            onClick={handleExport}
            className="bg-green-400 text-white px-4 py-1 border rounded-md hover:bg-green-500"
          >
            Export
          </button>

          <button
            onClick={handleButtonClick}
            className="bg-gray-800 text-white px-3 py-1 border rounded-md hover:bg-gray-900"
          >
            Create Collection
          </button>
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {/* <table className="w-full border-collapse bg-white border rounded-2xl">
        <thead className="bg-gray-100 text-left text-gray-600 text-sm">
          <tr>
            <th scope="col" className="p-3">
              Select
            </th>
            <th scope="col" className="p-3">
              Cat No
            </th>
            <th scope="col" className="p-3">
              Level
            </th>
            <th scope="col" className="p-3">
              Title
            </th>
            <th scope="col" className="p-3">
              Hierarchy
            </th>
          </tr>
        </thead>
        <tbody>
          {categories
            .filter((category) => category.level === "level1")
            .map((level1, index1) => {
              // Level 1 row
              const level2s = categories.filter(
                (c) => c.level === "level2" && c.parentCatNo === level1.catNo
              );

              const level1Row = (
                <tr
                  key={`l1-${index1}`}
                  className={`border-b ${
                    index1 % 2 === 0 ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(level1._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategoryIds((prev) => [
                            ...prev,
                            level1._id,
                          ]);
                        } else {
                          setSelectedCategoryIds((prev) =>
                            prev.filter((id) => id !== level1._id)
                          );
                        }
                      }}
                    />{" "}
                  </td>
                  <td className="p-3 text-sm">{level1.catNo}</td>
                  <td className="p-3 text-sm">Level 1</td>
                  <td className="p-3 text-sm">{level1.title}</td>
                  <td className="p-3 text-sm">{level1.title}</td>
                </tr>
              );

              const level2Rows = level2s.flatMap((level2, index2) => {
                const level3s = categories.filter(
                  (c) => c.level === "level3" && c.parentCatNo === level2.catNo
                );

                const level2Row = (
                  <tr
                    key={`l2-${index1}-${index2}`}
                    className="border-b bg-gray-50"
                  >
                    <td className="p-3">
                      <input type="checkbox" />
                    </td>
                    <td className="p-3 text-sm">{level2.catNo}</td>
                    <td className="p-3 text-sm">Level 2</td>
                    <td className="p-3 text-sm">{level2.title}</td>
                    <td className="p-3 text-sm">{`${level1.title} > ${level2.title}`}</td>
                  </tr>
                );

                const level3Rows = level3s.map((level3, index3) => (
                  <tr
                    key={`l3-${index1}-${index2}-${index3}`}
                    className="border-b bg-gray-100"
                  >
                    <td className="p-3">
                      <input type="checkbox" />
                    </td>
                    <td className="p-3 text-sm">{level3.catNo}</td>
                    <td className="p-3 text-sm">Level 3</td>
                    <td className="p-3 text-sm">{level3.title}</td>
                    <td className="p-3 text-sm">{`${level1.title} > ${level2.title} > ${level3.title}`}</td>
                  </tr>
                ));

                return [level2Row, ...level3Rows];
              });

              return [level1Row, ...level2Rows];
            })}
        </tbody>
      </table> */}
      
      <table className="w-full border-collapse bg-white border rounded-2xl">
        <thead className="bg-gray-100 text-left text-gray-600 text-sm">
          <tr>
            <th scope="col" className="p-3">
              Select
            </th>
            <th scope="col" className="p-3">
              Cat No
            </th>
            <th scope="col" className="p-3">
              Level
            </th>
            <th scope="col" className="p-3">
              Title
            </th>
            <th scope="col" className="p-3">
              Hierarchy
            </th>
          </tr>
        </thead>
        <tbody>
          {categories
            .filter((category) => category.level === "level1")
            .map((level1, index1) => {
              const level2s = categories.filter(
                (c) => c.level === "level2" && c.parentCatNo === level1.catNo
              );

              const level1Row = (
                <tr
                  key={`l1-${index1}`}
                  className={`border-b ${
                    index1 % 2 === 0 ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(level1._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategoryIds((prev) => [
                            ...prev,
                            level1._id,
                          ]);
                        } else {
                          setSelectedCategoryIds((prev) =>
                            prev.filter((id) => id !== level1._id)
                          );
                        }
                      }}
                    />
                  </td>
                  <td className="p-3 text-sm">{level1.catNo}</td>
                  <td className="p-3 text-sm">Level 1</td>
                  <td className="p-3 text-sm">{level1.title}</td>
                  <td className="p-3 text-sm">{level1.title}</td>
                </tr>
              );

              const level2Rows = level2s.flatMap((level2, index2) => {
                const level3s = categories.filter(
                  (c) => c.level === "level3" && c.parentCatNo === level2.catNo
                );

                const level2Row = (
                  <tr
                    key={`l2-${index1}-${index2}`}
                    className="border-b bg-gray-50"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes(level2._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategoryIds((prev) => [
                              ...prev,
                              level2._id,
                            ]);
                          } else {
                            setSelectedCategoryIds((prev) =>
                              prev.filter((id) => id !== level2._id)
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="p-3 text-sm">{level2.catNo}</td>
                    <td className="p-3 text-sm">Level 2</td>
                    <td className="p-3 text-sm">{level2.title}</td>
                    <td className="p-3 text-sm">{`${level1.title} > ${level2.title}`}</td>
                  </tr>
                );

                const level3Rows = level3s.map((level3, index3) => (
                  <tr
                    key={`l3-${index1}-${index2}-${index3}`}
                    className="border-b bg-gray-100"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes(level3._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategoryIds((prev) => [
                              ...prev,
                              level3._id,
                            ]);
                          } else {
                            setSelectedCategoryIds((prev) =>
                              prev.filter((id) => id !== level3._id)
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="p-3 text-sm">{level3.catNo}</td>
                    <td className="p-3 text-sm">Level 3</td>
                    <td className="p-3 text-sm">{level3.title}</td>
                    <td className="p-3 text-sm">{`${level1.title} > ${level2.title} > ${level3.title}`}</td>
                  </tr>
                ));

                return [level2Row, ...level3Rows];
              });

              return [level1Row, ...level2Rows];
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCategory;
