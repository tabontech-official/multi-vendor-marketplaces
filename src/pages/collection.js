import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Collection = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigateTo = useNavigate();
const [saving, setSaving] = useState(false);
  const [conditions, setConditions] = useState([
    { field: "tag", operator: "equals", value: "" },
  ]);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchCategoryData = async () => {
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");

    try {
      const response = await fetch(
        `http://localhost:5000/category/category/${id}`,
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
        setCategory(data);
        setTitle(data?.title || "");
        setDescription(data?.description || "");
      } else {
        setError(data.message || "Error fetching category data");
      }
    } catch (err) {
      console.error("Error fetching category data:", err);
      setError("An error occurred while fetching category data.");
    }
  };

  fetchCategoryData();
}, [id]);

  const handleConditionChange = (index, key, value) => {
    const updated = [...conditions];
    updated[index][key] = value;
    setConditions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", { title, description, category });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!category) {
    return <div>Loading...</div>;
  }

  const getCategoryValue = () => {
    if (category.level === "level1") {
      return category.catNo;
    }
    if (category.level === "level2") {
      return `${category.catNo} - ${category.parentCatNo}`;
    }
    if (category.level === "level3") {
      return `${category.catNo} - ${category.parentCatNo}`;
    }
    return "";
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
            <label className="block text-sm font-semibold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-xl"
              disabled
            />
          </div>

          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-xl h-48"
              disabled
            />
          </div>

          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
            <label className="block text-sm font-semibold mb-2">
              Conditions
            </label>
            {conditions.map((cond, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={cond.field}
                  onChange={(e) =>
                    handleConditionChange(index, "field", e.target.value)
                  }
                  className="border border-gray-300 rounded-xl p-1 w-1/3 bg-gray-200 appearance-none"
                  disabled
                >
                  <option value="tag">Tag</option>
                  <option value="title">Title</option>
                  <option value="vendor">Vendor</option>
                </select>

                <select
                  value={cond.operator}
                  onChange={(e) =>
                    handleConditionChange(index, "operator", e.target.value)
                  }
                  className="border border-gray-300 rounded-xl p-1 w-1/3 bg-gray-200 appearance-none"
                  disabled
                >
                  <option value="equals">is equal to</option>
                  <option value="not_equals">is not equal to</option>
                </select>

                {category.level === "level1" && (
                  <input
                    type="text"
                    placeholder="Value"
                    value={category.catNo}
                    onChange={(e) =>
                      handleConditionChange(index, "value", e.target.value)
                    }
                    className="border border-gray-300 rounded-xl p-1 w-1/3 bg-gray-200"
                    disabled
                  />
                )}

                {category.level === "level2" && (
                  <>
                    <input
                      type="text"
                      placeholder="CatNo"
                      value={category.catNo}
                      onChange={(e) =>
                        handleConditionChange(index, "value", e.target.value)
                      }
                      className="border border-gray-300 rounded-xl p-1 w-1/3 bg-gray-200"
                      disabled
                    />
                    <input
                      type="text"
                      placeholder="Parent CatNo"
                      value={category.parentCatNo}
                      onChange={(e) =>
                        handleConditionChange(index, "value", e.target.value)
                      }
                      className="border border-gray-300 rounded-xl p-1 w-1/3 bg-gray-200"
                      disabled
                    />
                  </>
                )}

                {category.level === "level3" && (
                  <>
                    <input
                      type="text"
                      placeholder="CatNo"
                      value={category.catNo}
                      onChange={(e) =>
                        handleConditionChange(index, "value", e.target.value)
                      }
                      className="border border-gray-300 rounded-xl p-1 w-1/3 bg-gray-200"
                      disabled
                    />
                    <input
                      type="text"
                      placeholder="Parent CatNo"
                      value={category.parentCatNo}
                      onChange={(e) =>
                        handleConditionChange(index, "value", e.target.value)
                      }
                      className="border border-gray-300 rounded-xl p-1 w-1/3 bg-gray-200"
                      disabled
                    />
                    <input
                      type="text"
                      placeholder="Grandparent CatNo"
                      value={category.parentCatNo}
                      onChange={(e) =>
                        handleConditionChange(index, "value", e.target.value)
                      }
                      className="border border-gray-300 rounded-xl p-1 w-1/3 bg-gray-200"
                      disabled
                    />
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
            {" "}
            <label className="block text-sm font-semibold mb-2">
              Search Engine Listing
            </label>
            <h2 className="text-gray-700 font-semibold ">Aydi Active</h2>
            <p className="text-gray-700">
              https://www.aydiactive.com › collections › {title}
            </p>
            <p className="text-blue-700 font-semibold">{title}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        {/* <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Save
        </button> */}
      </div>
    </form>
  );
};

export default Collection;
