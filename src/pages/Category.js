// import React, { useEffect, useState } from "react";
// import { MdModeEdit } from "react-icons/md";
// import { toast } from "react-toastify"; // Import the toast library
// import "react-toastify/dist/ReactToastify.css"; // Import the style
// const CreateCategory = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedLevel, setSelectedLevel] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [level1Categories, setLevel1Categories] = useState([]);
//   const [level2Categories, setLevel2Categories] = useState([]);
//   const [selectedLevel1Category, setSelectedLevel1Category] = useState("");
//   const [selectedLevel2Category, setSelectedLevel2Category] = useState("");
//   const [selectedLevel3Category, setSelectedLevel3Category] = useState("");
//   const [image, setImage] = useState(null);
//   const [error, setError] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [handle, setHandle] = useState(
//     title.toLowerCase().replace(/\s+/g, "-")
//   );

//   const handleChange = (e) => {
//     setHandle(e.target.value);
//   };

//   // Toggle edit mode
//   const toggleEdit = () => {
//     setIsEditing(!isEditing);
//   };

//   const baseUrl = "https://www.aydiactive.com/collections/";

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(
//           "https://multi-vendor-marketplace.vercel.app/category/getCategory"
//         );
//         const data = await response.json();

//         if (response.ok) {
//           setCategories(data);
//           setLevel1Categories(
//             data.filter((category) => category.level === "level1")
//           );
//         } else {
//           setError(data.message);
//         }
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//         setError("An error occurred while fetching categories");
//       }
//     };

//     fetchCategories();
//   }, []);

// const handleLevelChange = (e) => {
//   const level = e.target.value;
//   setSelectedLevel(level);

//   if (level === "level1") {
//     setFilteredCategories(
//       categories.filter((category) => category.level === "level1")
//     );
//     setLevel2Categories([]);
//     setSelectedLevel1Category("");
//     setSelectedLevel2Category("");
//     setSelectedLevel3Category("");
//   } else if (level === "level2") {
//     setFilteredCategories(
//       categories.filter((category) => category.level === "level1")
//     );
//     setLevel2Categories(
//       categories.filter((category) => category.level === "level2")
//     );
//     setSelectedLevel1Category("");
//     setSelectedLevel2Category("");
//     setSelectedLevel3Category("");
//   } else if (level === "level3") {
//     setFilteredCategories(
//       categories.filter((category) => category.level === "level2")
//     );
//     setSelectedLevel2Category("");
//     setSelectedLevel3Category("");
//   }
// };

// const handleLevel1Change = (e) => {
//   setSelectedLevel1Category(e.target.value);
//   setFilteredCategories(
//     categories.filter(
//       (category) =>
//         category.level === "level2" && category.parentCatNo === e.target.value
//     )
//   );
//   setSelectedLevel3Category("");
// };

// const handleLevel2Change = (e) => {
//   setSelectedLevel2Category(e.target.value);
//   setFilteredCategories(
//     categories.filter(
//       (category) =>
//         category.level === "level3" && category.parentCatNo === e.target.value
//     )
//   );
//   setSelectedLevel3Category("");
// };

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setImage(URL.createObjectURL(e.target.files[0]));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//   if (checkTitleExists()) {
//       toast.error("This handle already exists! Please choose a different one.");
//       return;  // Stop further execution if title exists
//     }
//     const userId = localStorage.getItem("userid");

//     const categoriesToSubmit = [];

//     if (selectedLevel === "level1") {
//       categoriesToSubmit.push({
//         title,
//         description,
//         level: selectedLevel,
//         parentCatNo: "",
//       });
//     } else if (selectedLevel === "level2") {
//       categoriesToSubmit.push({
//         title,
//         description,
//         level: selectedLevel,
//         parentCatNo: selectedLevel1Category,
//       });
//     } else if (selectedLevel === "level3") {
//       categoriesToSubmit.push({
//         title,
//         description,
//         level: selectedLevel,
//         parentCatNo: selectedLevel2Category,
//       });
//     }

//     try {
//       const response = await fetch(
//         "https://multi-vendor-marketplace.vercel.app/category/createCategory",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             title,
//             description,
//             categories: categoriesToSubmit,
//             userId,
//             handle
//           }),
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {
//         alert("Categories saved successfully!");
//         setTitle("");
//         setDescription("");
//         setImage(null);
//         setSelectedLevel("");
//         setSelectedLevel1Category("");
//         setSelectedLevel2Category("");
//         setSelectedLevel3Category("");
//         setFilteredCategories([]);
//       } else {
//         alert(`Error: ${result.error || "Something went wrong"}`);
//       }
//     } catch (err) {
//       console.error("Submission failed:", err);
//       alert("Failed to save categories.");
//     }
//   };
//   useEffect(() => {
//     setHandle(title.toLowerCase().replace(/\s+/g, "-"));
//   }, [title]);
//   const checkTitleExists = () => {
//     const titleExists = categories.some(
//       (category) => category.title.toLowerCase() === title.toLowerCase()
//     );

//     return titleExists;
//   };
//   return (
//     <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="md:col-span-2 space-y-6">
//           <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
//             <label className="block text-sm font-semibold mb-2">Title</label>
//             <input
//               type="text"
//               placeholder="e.g. Summer collection, Under $100, Staff picks"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full border border-gray-300 p-2 rounded-xl"
//             />
//           </div>

//           <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
//             <label className="block text-sm font-semibold mb-2">
//               Description
//             </label>
//             <textarea
//               placeholder="Write category description..."
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full border border-gray-300 p-2 rounded-xl h-48"
//             />
//           </div>

// <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
//   <label className="block text-sm font-semibold mb-2">
//     Select Level
//   </label>
//   <select
//     value={selectedLevel}
//     onChange={handleLevelChange}
//     className="w-full border border-gray-300 p-2 rounded-xl"
//   >
//     <option value="">Select a level</option>
//     <option value="level1">Level 1</option>
//     <option value="level2">Level 2</option>
//     <option value="level3">Level 3</option>
//   </select>
//   {selectedLevel === "level2" && (
//     <div className=" shadow-sm">
//       <label className="block text-sm font-semibold mb-2 mt-2">
//         Select Level 1
//       </label>
//       <select
//         value={selectedLevel1Category}
//         onChange={handleLevel1Change}
//         className="w-full border border-gray-300 p-2 rounded-xl"
//       >
//         <option value="">Select Level 1</option>
//         {level1Categories.map((category) => (
//           <option key={category._id} value={category.catNo}>
//             {category.title}
//           </option>
//         ))}
//       </select>
//     </div>
//   )}

//   {selectedLevel === "level3" && (
//     <div className=" shadow-sm ">
//       <label className="block text-sm font-semibold mb-2">
//         Select Level 2
//       </label>
//       <select
//         value={selectedLevel2Category}
//         onChange={handleLevel2Change}
//         className="w-full border border-gray-300 p-2 rounded-xl"
//       >
//         <option value="">Select Level 2 Category</option>
//         {level2Categories.map((category) => (
//           <option key={category._id} value={category.catNo}>
//             {category.title}
//           </option>
//         ))}
//       </select>
//     </div>
//   )}
// </div>

//           <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
//             <div className="flex justify-between">
//               <label className="block text-sm font-semibold mb-2">
//                 Search Engine Listing
//               </label>
//               <MdModeEdit onClick={toggleEdit} style={{ cursor: "pointer" }} />
//             </div>
//             <h2 className="text-gray-700 font-semibold ">Aydi Active</h2>
//             <p className="text-gray-700">
//               {baseUrl} {handle}
//             </p>
//             <p className="text-blue-700 font-semibold">{title}</p>
//             <p className="text-gray-700 mt-1">{description}</p>

//             {/* Show input field for editing handle */}
//             {isEditing && (
//               <div className="mt-2">
//                 <input
//                   type="text"
//                   value={handle}
//                   onChange={handleChange}
//                   className="border p-2 rounded"
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="space-y-6">
//           <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
//             <h3 className="font-semibold mb-2">Image</h3>
//             {image ? (
//               <div className="relative">
//                 <img
//                   src={image}
//                   alt="Uploaded"
//                   className="w-40 h-40 object-cover rounded border"
//                 />
//                 <button
//                   onClick={() => setImage(null)}
//                   className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ) : (
//               <label
//                 htmlFor="image-upload"
//                 className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded cursor-pointer hover:bg-gray-50 text-center"
//               >
//                 <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm font-medium mb-2">
//                   Add image
//                 </span>
//                 <span className="text-xs text-gray-500">
//                   or drop an image to upload
//                 </span>
//                 <input
//                   id="image-upload"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                 />
//               </label>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 flex justify-end">
//         <button
//           type="submit"
//           className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
//         >
//           Save
//         </button>
//       </div>
//     </form>
//   );
// };

// export default CreateCategory;
import React, { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiOutlineCheckCircle, HiOutlineXCircle, HiPlus } from "react-icons/hi";

const CreateCategory = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [level1Categories, setLevel1Categories] = useState([]);
  const [level2Categories, setLevel2Categories] = useState([]);
  const [selectedLevel1Category, setSelectedLevel1Category] = useState("");
  const [selectedLevel2Category, setSelectedLevel2Category] = useState("");
  const [selectedLevel3Category, setSelectedLevel3Category] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const [isEditing, setIsEditing] = useState(false);
  const [handle, setHandle] = useState("");

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const handleLevelChange = (e) => {
    const level = e.target.value;
    setSelectedLevel(level);

    if (level === "level1") {
      setFilteredCategories(
        categories.filter((category) => category.level === "level1")
      );
      setLevel2Categories([]);
      setSelectedLevel1Category("");
      setSelectedLevel2Category("");
      setSelectedLevel3Category("");
    } else if (level === "level2") {
      setFilteredCategories(
        categories.filter((category) => category.level === "level1")
      );
      setLevel2Categories(
        categories.filter((category) => category.level === "level2")
      );
      setSelectedLevel1Category("");
      setSelectedLevel2Category("");
      setSelectedLevel3Category("");
    } else if (level === "level3") {
      setFilteredCategories(
        categories.filter((category) => category.level === "level2")
      );
      setSelectedLevel2Category("");
      setSelectedLevel3Category("");
    }
  };

  const handleLevel1Change = (e) => {
    setSelectedLevel1Category(e.target.value);
    setFilteredCategories(
      categories.filter(
        (category) =>
          category.level === "level2" && category.parentCatNo === e.target.value
      )
    );
    setSelectedLevel3Category("");
  };

  const handleLevel2Change = (e) => {
    setSelectedLevel2Category(e.target.value);
    setFilteredCategories(
      categories.filter(
        (category) =>
          category.level === "level3" && category.parentCatNo === e.target.value
      )
    );
    setSelectedLevel3Category("");
  };

  const handleChange = (e) => {
    setHandle(e.target.value);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const baseUrl = "https://www.aydiactive.com/collections/";

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
          setLevel1Categories(
            data.filter((category) => category.level === "level1")
          );
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

  useEffect(() => {
    setHandle(title.toLowerCase().replace(/\s+/g, "-"));
  }, [title]);

  const checkHandleExists = (handle) => {
    const handleExists = categories.some(
      (category) => category.title.toLowerCase() === handle.toLowerCase()
    );

    return handleExists;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted");

    if (checkHandleExists(handle)) {
      showToast(
        "error",
        "This handle already exists! Please choose a different one."
      );
      return;
    }

    console.log("Handle is valid, submitting form...");

    const userId = localStorage.getItem("userid");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");

    const categoriesToSubmit = [];

    if (selectedLevel === "level1") {
      categoriesToSubmit.push({
        title,
        description,
        level: selectedLevel,
        parentCatNo: "",
      });
    } else if (selectedLevel === "level2") {
      categoriesToSubmit.push({
        title,
        description,
        level: selectedLevel,
        parentCatNo: selectedLevel1Category,
      });
    } else if (selectedLevel === "level3") {
      categoriesToSubmit.push({
        title,
        description,
        level: selectedLevel,
        parentCatNo: selectedLevel2Category,
      });
    }

    try {
      const response = await fetch(
        "https://multi-vendor-marketplace.vercel.app/category/createCategory",
        {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            categories: categoriesToSubmit,
            userId,
            handle,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Category saved successfully:", result);
        showToast("success", "Categories saved successfully!");
        setTitle("");
        setDescription("");
        setImage(null);
        setSelectedLevel("");
        setSelectedLevel1Category("");
        setSelectedLevel2Category("");
        setSelectedLevel3Category("");
        setFilteredCategories([]);
      } else {
        showToast("error", "Something went wrong");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      showToast("error", "Failed to save categories.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6">
      {toast.show && (
        <div
          className={`fixed top-16 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${
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
              className="w-full border border-gray-300 p-2 rounded-xl h-48"
            />
          </div>

          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
            <label className="block text-sm font-semibold mb-2">
              Select Level
            </label>
            <select
              value={selectedLevel}
              onChange={handleLevelChange}
              className="w-full border border-gray-300 p-2 rounded-xl"
            >
              <option value="">Select a level</option>
              <option value="level1">Level 1</option>
              <option value="level2">Level 2</option>
              <option value="level3">Level 3</option>
            </select>
            {selectedLevel === "level2" && (
              <div className=" shadow-sm">
                <label className="block text-sm font-semibold mb-2 mt-2">
                  Select Level 1
                </label>
                <select
                  value={selectedLevel1Category}
                  onChange={handleLevel1Change}
                  className="w-full border border-gray-300 p-2 rounded-xl"
                >
                  <option value="">Select Level 1</option>
                  {level1Categories.map((category) => (
                    <option key={category._id} value={category.catNo}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedLevel === "level3" && (
              <div className=" shadow-sm ">
                <label className="block text-sm font-semibold mb-2">
                  Select Level 2
                </label>
                <select
                  value={selectedLevel2Category}
                  onChange={handleLevel2Change}
                  className="w-full border border-gray-300 p-2 rounded-xl"
                >
                  <option value="">Select Level 2 Category</option>
                  {level2Categories.map((category) => (
                    <option key={category._id} value={category.catNo}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
            <div className="flex justify-between">
              <label className="block text-sm font-semibold mb-2">
                Search Engine Listing
              </label>
              <MdModeEdit onClick={toggleEdit} style={{ cursor: "pointer" }} />
            </div>
            <h2 className="text-gray-700 font-semibold ">Aydi Active</h2>
            <p className="text-gray-700">
              {baseUrl} {handle}
            </p>
            <p className="text-blue-700 font-semibold">{title}</p>
            <p className="text-gray-700 mt-1">{description}</p>

            {isEditing && (
              <div className="mt-2">
                <input
                  type="text"
                  value={handle}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-xl "
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
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
                  onChange={(e) =>
                    setImage(URL.createObjectURL(e.target.files[0]))
                  }
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

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
