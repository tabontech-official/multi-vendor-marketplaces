import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  HiOutlineUpload,
  HiOutlineSearch,
  HiOutlineRefresh,
  HiCheck,
  HiOutlineClipboardCopy,
} from "react-icons/hi";
import { jwtDecode } from "jwt-decode";
const ContentLibrary = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [role, setRole] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setRole(decoded?.payLoad?.role || "");
    } catch (error) {
      console.error("Token decode error:", error);
    }
  }, []);
  const userId = localStorage.getItem("userid");
  useEffect(() => {
    if (role) fetchFiles();
  }, [role]);
  const handleSelect = (file) => {
    const exists = selectedFiles.find((f) => f.public_id === file.public_id);

    if (exists) {
      setSelectedFiles(
        selectedFiles.filter((f) => f.public_id !== file.public_id),
      );
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

 const handleDelete = async () => {
  try {
    for (let file of selectedFiles) {
      await axios.delete(
        "https://multi-vendor-marketplace.vercel.app/api/content/delete-file",
        {
          data: { id: file._id },
        }
      );
    }

    setShowDeleteModal(false);
    setSelectedFiles([]);
    fetchFiles();
  } catch (error) {
    console.error("Delete failed:", error);
  }
};

  const fetchFiles = async () => {
    setLoading(true);
    try {
      let res;

      if (role === "Dev Admin" || role === "Master Admin") {
        res = await axios.get(
          "https://multi-vendor-marketplace.vercel.app/api/content/get-all-files",
        );
      } else {
        res = await axios.get(
          `https://multi-vendor-marketplace.vercel.app/api/content/get-by-user/${userId}`,
        );
      }

      setFiles(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles.length) return;

    const formData = new FormData();
    formData.append("userId", userId);
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    try {
      setUploading(true);
      await axios.post(
        "https://multi-vendor-marketplace.vercel.app/api/content/upload-content",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      fetchFiles();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url, index) => {
    navigator.clipboard.writeText(url);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFiles = files.filter((file) =>
    file.originalName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f1f1f1] p-8 font-sans text-[#303030]">
      <div className=" mx-auto">
        {/* Shopify Page Header */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-bold text-[#1a1a1a]">Content Library</h1>
          <div className="flex gap-3">
            {selectedFiles.length > 0 && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm shadow-sm"
              >
                Delete ({selectedFiles.length})
              </button>
            )}
            <button
              onClick={fetchFiles}
              className="bg-white border border-[#d1d1d1] p-2 rounded-md hover:bg-gray-50 shadow-sm transition"
            >
              <HiOutlineRefresh className="text-gray-600" />
            </button>
            <label className="bg-[#008060] hover:bg-[#006e52] text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 cursor-pointer shadow-sm transition">
              <HiOutlineUpload />
              {uploading ? "Uploading..." : "Add file"}
              <input type="file" hidden multiple onChange={handleUpload} />
            </label>
          </div>
        </div>

        {/* Shopify "Card" Layout */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e3e3e3] overflow-hidden">
          {/* Filters Area */}
          <div className="p-3 border-b border-[#f1f1f1] flex items-center gap-2">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Filter files"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 w-full border border-[#d1d1d1] rounded-md text-sm focus:outline-none focus:border-[#008060] focus:ring-1 focus:ring-[#008060]"
              />
            </div>
          </div>

          {/* Shopify Table Style */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#f7f7f7] text-[#616161] font-medium border-b border-[#e3e3e3]">
                <tr>
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        filteredFiles.length > 0 &&
                        selectedFiles.length === filteredFiles.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFiles(filteredFiles);
                        } else {
                          setSelectedFiles([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="p-4">File</th>
                  {/* <th className="p-4">Date Added</th> */}
                  {/* <th className="p-4">Size</th>
                  <th className="p-4 text-right"></th> */}
                                    <th className="p-4 text-right"></th>

                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f1f1]">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-12 text-gray-500 italic"
                    >
                      Loading your library...
                    </td>
                  </tr>
                ) : filteredFiles.length > 0 ? (
                  filteredFiles.map((file, index) => (
                    <tr
                      key={index}
                      className="hover:bg-[#f9f9f9] transition-colors group"
                    >
                      <td className="p-4">
                        <th className="p-4 w-10">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedFiles.some(
                                (f) => f._id === file._id,
                              )}
                              onChange={() => handleSelect(file)}
                              className="rounded border-gray-300"
                            />
                          </td>
                        </th>
                      </td>
                      <td className="p-4 flex items-center gap-4 relative">
                        <div className="w-12 h-12 flex-shrink-0 bg-[#f1f1f1] rounded-md overflow-hidden border border-[#e3e3e3] flex items-center justify-center">
                          {/\.(jpg|jpeg|png|gif|webp)$/i.test(
                            file.originalName,
                          ) ? (
                            <img
                              src={file.url.replace(
                                "/raw/upload/",
                                "/image/upload/",
                              )}
                              alt={file.originalName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400">
                              FILE
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#1a1a1a]">
                            {file.originalName}
                          </span>
                          {/* <span className="text-xs text-gray-500">
                            Resource ID: {index}
                          </span> */}
                        </div>

                        {/* Hover Action Button - Classic Shopify style */}
                      </td>
                      {/* <td className="p-4 text-[#616161]">
                        {new Date(file.createdAt).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </td> */}
                      {/* <td className="p-4 text-[#616161]">
                        {(file.bytes / 1024).toFixed(1)} KB
                      </td> */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleCopy(file.url, index)}
                          className="bg-white border border-[#d1d1d1] p-1.5 rounded-md shadow-sm hover:bg-gray-50 flex items-center gap-1 text-xs"
                        >
                          {copiedId === index ? (
                            <>
                              <HiCheck className="text-green-600" /> Copied
                            </>
                          ) : (
                            <>
                              <HiOutlineClipboardCopy /> Copy Link
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-20">
                      <div className="flex flex-col items-center opacity-60">
                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                          <HiOutlineSearch size={32} />
                        </div>
                        <p className="font-medium">No files found</p>
                        <p className="text-xs">
                          Try changing your search filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination Placeholder */}
          <div className="p-4 border-t border-[#f1f1f1] flex justify-center bg-[#fcfcfc]">
            <span className="text-xs text-gray-500">
              Showing {filteredFiles.length} files
            </span>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-3">Delete Files?</h2>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete {selectedFiles.length} selected
              file(s)? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm border rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   HiOutlineUpload,
//   HiOutlineSearch,
//   HiOutlineRefresh,
//   HiCheck,
//   HiOutlineClipboardCopy,
// } from "react-icons/hi";
// import { jwtDecode } from "jwt-decode";

// const ContentLibrary = () => {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [copiedId, setCopiedId] = useState(null);
//   const [role, setRole] = useState("");
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   const [activeTab, setActiveTab] = useState("files");
//   const [showExcelModal, setShowExcelModal] = useState(false);
//   const [excelType, setExcelType] = useState("products");
//   const [excelFile, setExcelFile] = useState(null);

//   const userId = localStorage.getItem("userid");

//   useEffect(() => {
//     const token = localStorage.getItem("usertoken");
//     if (!token) return;

//     try {
//       const decoded = jwtDecode(token);
//       setRole(decoded?.payLoad?.role || "");
//     } catch (error) {
//       console.error(error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchFiles();
//   }, [role, activeTab]);

//   const fetchFiles = async () => {
//     setLoading(true);
//     try {
//       let res;

//       if (activeTab === "downloadable") {
//         res = await axios.get(
//           "https://multi-vendor-marketplace.vercel.app/admin-file/get-downloadable",
//         );
//       } else {
//         if (role === "Dev Admin" || role === "Master Admin") {
//           res = await axios.get(
//             "https://multi-vendor-marketplace.vercel.app/api/content/get-all-files",
//           );
//         } else {
//           res = await axios.get(
//             `https://multi-vendor-marketplace.vercel.app/api/content/get-by-user/${userId}`,
//           );
//         }
//       }

//       setFiles(res.data.data || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNormalUpload = async (e) => {
//     const selectedFiles = e.target.files;
//     if (!selectedFiles.length) return;

//     const formData = new FormData();
//     formData.append("userId", userId);
//     for (let i = 0; i < selectedFiles.length; i++) {
//       formData.append("files", selectedFiles[i]);
//     }

//     try {
//       setUploading(true);
//       await axios.post(
//         "https://multi-vendor-marketplace.vercel.app/api/content/upload-content",
//         formData,
//       );
//       fetchFiles();
//     } catch (error) {
//       alert("Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleExcelUpload = async () => {
//     if (!excelFile) return alert("Select file first");

//     const formData = new FormData();
//     formData.append("file", excelFile);
//     formData.append("userId", userId);

//     try {
//       setUploading(true);
//       await axios.post(
//         `https://multi-vendor-marketplace.vercel.app/admin-file/upload-downloadable/${excelType}`,
//         formData,
//       );

//       setShowExcelModal(false);
//       setExcelFile(null);
//       fetchFiles();
//     } catch (error) {
//       alert("Excel upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleCopy = (url, index) => {
//     navigator.clipboard.writeText(url);
//     setCopiedId(index);
//     setTimeout(() => setCopiedId(null), 2000);
//   };

//   const filteredFiles = files.filter((file) =>
//     file.originalName?.toLowerCase().includes(search.toLowerCase()),
//   );
//   return (
//     <div className="min-h-screen bg-[#f1f1f1] p-8">
//       <div className="mx-auto">
//         {/* Tabs */}
//         {(role === "Master Admin" || role === "Dev Admin") && (
//           <div className="flex gap-6 mb-6 border-b">
//             <button
//               onClick={() => setActiveTab("files")}
//               className={`pb-2 text-sm font-medium ${
//                 activeTab === "files"
//                   ? "border-b-2 border-[#008060] text-[#008060]"
//                   : "text-gray-500"
//               }`}
//             >
//               All Files
//             </button>
//             <button
//               onClick={() => setActiveTab("downloadable")}
//               className={`pb-2 text-sm font-medium ${
//                 activeTab === "downloadable"
//                   ? "border-b-2 border-[#008060] text-[#008060]"
//                   : "text-gray-500"
//               }`}
//             >
//               Downloadable Excel Files
//             </button>
//           </div>
//         )}

//         {/* Header */}
//         <div className="flex justify-between items-center mb-5">
//           <h1 className="text-xl font-bold">Content Library</h1>

//           <div className="flex gap-3">
//             <button
//               onClick={fetchFiles}
//               className="bg-white border p-2 rounded-md"
//             >
//               <HiOutlineRefresh />
//             </button>

//             {activeTab === "files" ? (
//               <label className="bg-[#008060] text-white px-4 py-2 rounded-md cursor-pointer flex items-center gap-2">
//                 <HiOutlineUpload />
//                 {uploading ? "Uploading..." : "Add file"}
//                 <input
//                   type="file"
//                   hidden
//                   multiple
//                   onChange={handleNormalUpload}
//                 />
//               </label>
//             ) : (
//               <button
//                 onClick={() => setShowExcelModal(true)}
//                 className="bg-[#008060] text-white px-4 py-2 rounded-md"
//               >
//                 Add Excel
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//           <div className="p-3 border-b">
//             <div className="relative">
//               <HiOutlineSearch className="absolute left-3 top-2.5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Filter files"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="pl-9 pr-3 py-1.5 w-full border rounded-md text-sm"
//               />
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50 border-b">
//                 <tr>
//                   <th className="p-4 text-left">Image</th>

//                   <th className="p-4 text-left">File</th>
//                   <th className="p-4 text-left">Type</th>
//                   <th className="p-4 text-right">Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="3" className="text-center py-10">
//                       Loading...
//                     </td>
//                   </tr>
//                 ) : filteredFiles.length > 0 ? (
//                   filteredFiles.map((file, index) => (
//                     <tr key={file._id} className="border-t hover:bg-gray-50">
//                       <td className="p-4">
//                         <img
//                           src={file.url}
//                           className="w-10 h-10 object-cover rounded"
//                         />
//                       </td>
//                       <td className="p-4">{file.originalName}</td>
//                       <td className="p-4">{file.type || "Normal"}</td>
//                       <td className="p-4 text-right">
//                         <button
//                           onClick={() => handleCopy(file.url, index)}
//                           className="text-sm border px-3 py-1 rounded"
//                         >
//                           {copiedId === index ? "Copied" : "Copy Link"}
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="3" className="text-center py-10">
//                       No files found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Excel Modal */}
//       {showExcelModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h2 className="font-semibold mb-4">Upload Downloadable Excel</h2>

//             <select
//               value={excelType}
//               onChange={(e) => setExcelType(e.target.value)}
//               className="w-full border p-2 rounded mb-4"
//             >
//               <option value="products">Products</option>
//               <option value="inventory">Inventory</option>
//               <option value="categories">Categories</option>
//             </select>

//             <input
//               type="file"
//               accept=".xlsx,.xls,.csv"
//               onChange={(e) => setExcelFile(e.target.files[0])}
//               className="mb-4"
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowExcelModal(false)}
//                 className="border px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleExcelUpload}
//                 className="bg-[#008060] text-white px-4 py-2 rounded"
//               >
//                 Upload
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ContentLibrary;
