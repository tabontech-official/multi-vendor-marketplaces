// import React, { useState } from "react";

// const CreateCategory = () => {
//   const [categories, setCategories] = useState([
//     { level: "", name: "", catNo: "", parentCatNo: "" }
//   ]);
//   const [description, setDescription] = useState("");
//   const [image, setImage] = useState(null);

//   const handleCategoryChange = (index, key, value) => {
//     const updated = [...categories];
//     updated[index][key] = value;
//     setCategories(updated);
//   };

//   const handleAddCategory = () => {
//     setCategories([
//       ...categories,
//       { level: "", name: "", catNo: "", parentCatNo: "" }
//     ]);
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setImage(URL.createObjectURL(e.target.files[0]));
//     }
//   };

//   const buildCategoryTree = (flatCategories) => {
//     const map = {};
//     const level1 = [];

//     // Step 1: Map all catNo
//     flatCategories.forEach((cat) => {
//       map[cat.catNo] = { ...cat, children: [] };
//     });

//     // Step 2: Nest Level 3 → Level 2
//     flatCategories.forEach((cat) => {
//       if (cat.level === "3" && map[cat.parentCatNo]) {
//         map[cat.parentCatNo].children.push(map[cat.catNo]);
//       }
//     });

//     // Step 3: Nest Level 2 (+level 3) → Level 1
//     flatCategories.forEach((cat) => {
//       if (cat.level === "2" && map[cat.parentCatNo]) {
//         map[cat.parentCatNo].children.push(map[cat.catNo]);
//       }
//     });

//     // Step 4: Only root level1
//     flatCategories.forEach((cat) => {
//       if (cat.level === "1") {
//         level1.push(map[cat.catNo]);
//       }
//     });

//     return level1;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const nestedCategories = buildCategoryTree(categories);

//     try {
//       const response = await fetch("http://localhost:5000/category/createCategory", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ categories: nestedCategories, description })
//       });

//       const result = await response.json();

//       if (response.ok) {
//         alert("Categories saved successfully!");
//         setCategories([{ level: "", name: "", catNo: "", parentCatNo: "" }]);
//         setDescription("");
//         setImage(null);
//       } else {
//         alert(`Error: ${result.error || "Something went wrong"}`);
//       }
//     } catch (err) {
//       console.error("Submission failed:", err);
//       alert("Failed to save categories.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Left Panel */}
//         <div className="md:col-span-2 space-y-6">
//           {/* Category Setup */}
//           <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
//             <label className="block text-sm font-semibold mb-2">Add Categories</label>

//             {categories.map((cat, index) => (
//               <div key={index} className="grid grid-cols-4 gap-3 mb-4">
//                 {/* Level */}
//                 <select
//                   value={cat.level}
//                   onChange={(e) =>
//                     handleCategoryChange(index, "level", e.target.value)
//                   }
//                   className="border border-gray-300 rounded-xl p-2"
//                 >
//                   <option value="1">Level 1</option>
//                   <option value="2">Level 2</option>
//                   <option value="3">Level 3</option>
//                 </select>

//                 {/* Name */}
//                 <input
//                   type="text"
//                   placeholder="Category Name"
//                   value={cat.name}
//                   onChange={(e) =>
//                     handleCategoryChange(index, "name", e.target.value)
//                   }
//                   className="border border-gray-300 rounded-xl p-2"
//                 />

//                 {/* catNo */}
//                 <input
//                   type="text"
//                   placeholder="catNo"
//                   value={cat.catNo}
//                   onChange={(e) =>
//                     handleCategoryChange(index, "catNo", e.target.value)
//                   }
//                   className="border border-gray-300 rounded-xl p-2"
//                 />

//                 {/* Parent catNo */}
//                 {(cat.level === "2" || cat.level === "3") && (
//                   <input
//                     type="text"
//                     placeholder="Parent catNo"
//                     value={cat.parentCatNo}
//                     onChange={(e) =>
//                       handleCategoryChange(index, "parentCatNo", e.target.value)
//                     }
//                     className="border border-gray-300 rounded-xl p-2"
//                   />
//                 )}
//               </div>
//             ))}

//             <button
//               type="button"
//               onClick={handleAddCategory}
//               className="text-blue-600 text-sm mt-2"
//             >
//               + Add another category
//             </button>
//           </div>

//           {/* Description */}
//           <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
//             <label className="block text-sm font-semibold mb-2">Description</label>
//             <textarea
//               placeholder="Write category description..."
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full border border-gray-300 p-2 rounded-xl"
//             />
//           </div>

//           {/* Save Button */}
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
//             >
//               Save Categories
//             </button>
//           </div>
//         </div>

//         {/* Right Panel: Image Upload */}
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
//                 <span className="text-xs text-gray-500">or drop an image</span>
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
//     </form>
//   );
// };

// export default CreateCategory;
