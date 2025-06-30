import React, { useEffect, useState } from "react";
import { IoPricetagsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ManageCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

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
  return (
    <div className="p-4">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-2">
          <IoPricetagsOutline size={24} className="text-gray-600" />
          <h1 className="font-semibold text-xl">Collections</h1>
        </div>

        <div className="flex space-x-2">
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

      <table className="w-full border-collapse bg-white border rounded-2xl">
        <thead className="bg-gray-100 text-left text-gray-600 text-sm">
          <tr>
            <th scope="col" className="p-3">
              Select
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
            .map((level1Category, index) => {
              const level2Categories = categories.filter(
                (category) =>
                  category.level === "level2" &&
                  category.parentCatNo === level1Category.catNo
              );

              return (
                <tr
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3 text-sm">
                    <p className="text-md font-semibold">
                      {level1Category.title}
                    </p>
                  </td>
                  <td className="p-3 text-sm">
                    <span>{level1Category.title}</span>
                    {level2Categories.map((level2, idx) => (
                      <span key={idx}>
                        → {level2.title}
                        {categories
                          .filter(
                            (category) =>
                              category.level === "level3" &&
                              category.parentCatNo === level2.catNo
                          )
                          .map((level3, idx3) => (
                            <span key={idx3}> → {level3.title}</span>
                          ))}
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCategory;
