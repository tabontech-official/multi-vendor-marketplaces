import React, { useEffect, useState } from "react";

const CreateCategory = () => {
  const [title, setTitle] = useState("");
  const [collectionType, setCollectionType] = useState("smart");
  const [conditions, setConditions] = useState([
    { field: "tag", operator: "equals", value: "" },
  ]);

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://multi-vendor-marketplace.vercel.app/category/getCategory"
        ); // Adjust API URL
        const data = await response.json();

        if (response.ok) {
          setCategories(data); // Set categories to the state
        } else {
          setError(data.message); // Handle error response
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("An error occurred while fetching categories");
      }
    };

    fetchCategories(); // Fetch categories when the component mounts
  }, []);

  const handleAddCondition = () => {
    setConditions([
      ...conditions,
      { field: "tag", operator: "equals", value: "" },
    ]);
  };

  const handleConditionChange = (index, key, value) => {
    const updated = [...conditions];
    updated[index][key] = value;
    setConditions(updated);
  };

  //   const [categories, setCategories] = useState([
  //     { level: "", name: "", catNo: "", parentCatNo: "" },
  //   ]);
  const [categories, setCategories] = useState([]); // Categories state

  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleCategoryChange = (index, key, value) => {
    const updated = [...categories];
    updated[index][key] = value;
    setCategories(updated);
  };

  const handleAddCategory = () => {
    setCategories([
      ...categories,
      { level: "", name: "", catNo: "", parentCatNo: "" },
    ]);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const buildCategoryTree = (flatCategories) => {
    const map = {};
    const level1 = [];

    flatCategories.forEach((cat) => {
      map[cat.catNo] = { ...cat, children: [] };
    });

    flatCategories.forEach((cat) => {
      if (cat.level === "3" && map[cat.parentCatNo]) {
        map[cat.parentCatNo].children.push(map[cat.catNo]);
      }
    });

    flatCategories.forEach((cat) => {
      if (cat.level === "2" && map[cat.parentCatNo]) {
        map[cat.parentCatNo].children.push(map[cat.catNo]);
      }
    });

    flatCategories.forEach((cat) => {
      if (cat.level === "1") {
        level1.push(map[cat.catNo]);
      }
    });

    return level1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Categories before submission:", categories);

    if (categories.length === 0) {
      alert("No categories available to submit.");
      return;
    }

    const categoriesToSubmit = categories;

    console.log("Categories to Submit:", categoriesToSubmit);
    const userId = localStorage.getItem("userid"); // Fetch userId from localStorage

    try {
      const response = await fetch(
        "https://multi-vendor-marketplace.vercel.app/category/createCategory",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categories: categoriesToSubmit,
            description,
            title,
            userId: userId,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Categories saved successfully!");
        setCategories([{ level: "", name: "", catNo: "", parentCatNo: "" }]);
        setDescription("");
        setImage(null);
      } else {
        alert(`Error: ${result.error || "Something went wrong"}`);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to save categories.");
    }
  };
  useEffect(() => {
    const fetchBrandAssetData = async () => {
      const userId = localStorage.getItem("userid");

      if (!userId) {
        console.log("No user ID found in localStorage.");
        return;
      }

      try {
        const res = await fetch(
          `https://multi-vendor-marketplace.vercel.app/category/getCollection/${userId}`
        );

        const data = await res.json();

        if (res.ok) {
          console.log("Fetched Brand Asset Data:", data);

          console.log("Seller Name:", data.sellerName);

          setTitle(data.sellerName);
          setDescription(data.description);
          // setImagePreview(data.image);
        } else {
          console.error("Error fetching brand asset:", data.error);
        }
      } catch (err) {
        console.error("API error:", err);
      }
    };

    fetchBrandAssetData();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
            <label className="block text-sm font-semibold mb-2">Title</label>
            <input
              type="text"
              placeholder="e.g. Summer collection, Under $100, Staff picks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-xl"
            />
          </div>

          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              placeholder="Write category description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-xl h-48" // Increased height here
            />
          </div>

          {/* <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
            <label className="block text-sm font-semibold mb-2">
              Collection Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="collectionType"
                  value="manual"
                  checked={collectionType === "manual"}
                  onChange={(e) => setCollectionType(e.target.value)}
                />
                Manual (Add products one by one)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="collectionType"
                  value="smart"
                  checked={collectionType === "smart"}
                  onChange={(e) => setCollectionType(e.target.value)}
                />
                Smart (Auto product match using conditions)
              </label>
            </div>
          </div> */}

          {/* {collectionType === "smart" && (
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
                    className="border border-gray-300 rounded-xl p-1 w-1/3"
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
                    className="border border-gray-300 rounded-xl p-1 w-1/3"
                  >
                    <option value="equals">is equal to</option>
                    <option value="not_equals">is not equal to</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Value"
                    value={cond.value}
                    onChange={(e) =>
                      handleConditionChange(index, "value", e.target.value)
                    }
                    className="border border-gray-300 rounded-xl p-1 w-1/3"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddCondition}
                className="text-blue-600 text-sm"
              >
                + Add another condition
              </button>
            </div>
          )} */}

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
            {/* <input
              type="text"
              placeholder="SEO Title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2 mb-2"
            /> */}
            {/* <textarea
              placeholder="SEO Description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2 h-20"
            /> */}
          </div>
        </div>

        <div className="space-y-6">
          {/* <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
            {" "}
            <h3 className="font-semibold mb-2">Publishing</h3>
            <div className="mb-2">
              <p className="text-sm font-semibold">Sales Channels</p>
              <label className="block">
                <input type="checkbox" /> Online Store
              </label>
              <label className="block">
                <input type="checkbox" /> Shop
              </label>
              <label className="block">
                <input type="checkbox" /> Point of Sale
              </label>
            </div>
          </div> */}

          {/* Image Upload */}
          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
            {" "}
            <h3 className="font-semibold mb-2">Image</h3>
            {image ? (
              <div className="relative">
                <img
                  src={image}
                  alt="Uploaded"
                  className="w-40 h-40 object-cover rounded border"
                />
                <button
                  onClick={() => setImage(null)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded cursor-pointer hover:bg-gray-50 text-center"
              >
                <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm font-medium mb-2">
                  Add image
                </span>
                <span className="text-xs text-gray-500">
                  or drop an image to upload
                </span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Save Button Full Width */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default CreateCategory;
