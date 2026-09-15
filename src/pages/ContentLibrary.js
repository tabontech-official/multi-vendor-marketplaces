import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  HiOutlineUpload,
  HiOutlineSearch,
  HiOutlineRefresh,
  HiCheck,
  HiOutlineClipboardCopy,
  HiOutlineDocumentDownload,
  HiOutlineTrash,
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState("files");
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelType, setExcelType] = useState("Products");
  const [excelFile, setExcelFile] = useState(null);

  const userId = localStorage.getItem("userid");
  const handleDownload = (id, name) => {
    const url = `https://multi-vendor-marketplace.vercel.app/admin-file/download-file/${id}`;

    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const token = localStorage.getItem("usertoken");

    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setRole(decoded?.payLoad?.role || "");
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchFiles = async () => {
    if (!role) return;

    setLoading(true);

    try {
      let res;

      if (activeTab === "downloadable") {
        res = await axios.get(
          "https://multi-vendor-marketplace.vercel.app/admin-file/get-downloadable",
        );
      } else {
        if (role === "Dev Admin" || role === "Master Admin") {
          res = await axios.get(
            "https://multi-vendor-marketplace.vercel.app/api/content/get-all-files",
          );
        } else {
          res = await axios.get(
            `https://multi-vendor-marketplace.vercel.app/api/content/get-by-user/${userId}`,
          );
        }
      }

      setFiles(
        (res.data.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!role) return;

    fetchFiles();
    setSelectedFiles([]);
  }, [role, activeTab]);

  const handleSelect = (file) => {
    const exists = selectedFiles.find((f) => f._id === file._id);

    if (exists) {
      setSelectedFiles(selectedFiles.filter((f) => f._id !== file._id));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedFiles(filteredFiles);
    } else {
      setSelectedFiles([]);
    }
  };

  /* ---------------- Delete Files ---------------- */
  const handleSetActive = async () => {
    try {
      const fileId = selectedFiles[0]._id;

      await axios.put(
        `https://multi-vendor-marketplace.vercel.app/admin-file/set-active/${fileId}`,
      );

      fetchFiles();
      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
      alert("Failed to set active");
    }
  };
  const handleDelete = async () => {
    try {
      for (let file of selectedFiles) {
        if (activeTab === "downloadable") {
          await axios.delete(
            `https://multi-vendor-marketplace.vercel.app/admin-file/delete/${file._id}`,
          );
        } else {
          await axios.delete(
            "https://multi-vendor-marketplace.vercel.app/api/content/delete-file",
            {
              data: { id: file._id },
            },
          );
        }
      }

      setSelectedFiles([]);
      setShowConfirmModal(false);
      fetchFiles();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ---------------- Upload Normal Files ---------------- */

  const handleNormalUpload = async (e) => {
    const selected = e.target.files;

    if (!selected.length) return;

    const formData = new FormData();

    formData.append("userId", userId);

    for (let i = 0; i < selected.length; i++) {
      formData.append("files", selected[i]);
    }

    try {
      setUploading(true);

      await axios.post(
        "https://multi-vendor-marketplace.vercel.app/api/content/upload-content",
        formData,
      );

      fetchFiles();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- Upload Excel ---------------- */

  const handleExcelUpload = async () => {
    if (!excelFile) return alert("Select file first");

    const formData = new FormData();

    formData.append("file", excelFile);
    formData.append("userId", userId);

    try {
      setUploading(true);

      await axios.post(
        `https://multi-vendor-marketplace.vercel.app/admin-file/upload-downloadable/${excelType}`,
        formData,
      );

      setShowExcelModal(false);
      setExcelFile(null);

      fetchFiles();
    } catch (err) {
      alert("Excel upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- Copy Link ---------------- */

  const handleCopy = (url, index) => {
    navigator.clipboard.writeText(url);

    setCopiedId(index);

    setTimeout(() => setCopiedId(null), 2000);
  };
  const [merchantFilter, setMerchantFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const merchantNames = [
    ...new Set(files.map((f) => f.merchantName).filter(Boolean)),
  ];
  const merchantEmails = [
    ...new Set(files.map((f) => f.merchantEmail).filter(Boolean)),
  ];
  /* ---------------- Filter ---------------- */
  const filteredFiles = files.filter((file) => {
    const name = file.originalName || file.fileName || "";
    const merchantName = file.merchantName || "";
    const merchantEmail = file.merchantEmail || "";

    if (activeTab === "files") {
      return (
        name.toLowerCase().includes(search.toLowerCase()) &&
        (merchantFilter ? merchantName === merchantFilter : true) &&
        (emailFilter ? merchantEmail === emailFilter : true)
      );
    }

    return name.toLowerCase().includes(search.toLowerCase());
  });
  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen bg-[#f1f1f1] p-8">
      <div className="mx-auto">
        {/* Tabs */}

        {(role === "Master Admin" || role === "Dev Admin") && (
          <div className="flex gap-6 mb-6 border-b">
            <button
              onClick={() => setActiveTab("files")}
              className={`pb-2 text-sm font-medium ${activeTab === "files" ? "border-b-2 border-[#008060] text-[#008060]" : "text-gray-500"}`}
            >
              All Files
            </button>

            <button
              onClick={() => setActiveTab("downloadable")}
              className={`pb-2 text-sm font-medium ${activeTab === "downloadable" ? "border-b-2 border-[#008060] text-[#008060]" : "text-gray-500"}`}
            >
              Downloadable Excel Files
            </button>
          </div>
        )}

        {/* Header */}

        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-bold">Content & Files</h1>

          <div className="flex gap-3">
            {selectedFiles.length > 0 && (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <HiOutlineTrash /> Delete ({selectedFiles.length})
              </button>
            )}
            {activeTab === "downloadable" && selectedFiles.length === 1 && (
              <button
                onClick={handleSetActive}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <HiCheck /> Set Active
              </button>
            )}
            <button
              onClick={fetchFiles}
              className="bg-white border p-2 rounded-md"
            >
              <HiOutlineRefresh />
            </button>

            {activeTab === "files" ? (
              <label className="bg-[#008060] text-white px-4 py-2 rounded-md cursor-pointer flex items-center gap-2">
                <HiOutlineUpload />

                {uploading ? "Uploading..." : "Add file"}

                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleNormalUpload}
                />
              </label>
            ) : (
              <button
                onClick={() => setShowExcelModal(true)}
                className="bg-[#008060] text-white px-4 py-2 rounded-md"
              >
                Add Excel
              </button>
            )}
          </div>
        </div>

        {/* Table */}

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-3 border-b">
            {activeTab === "files" ? (
              <div className="flex gap-3">
                {/* Search */}

                <div className="relative flex-1">
                  <HiOutlineSearch className="absolute left-3 top-2.5 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Search file / merchant"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-3 py-2 w-full border rounded-md text-sm"
                  />
                </div>

                {/* Merchant Filter */}
                {/* 
      <select
        value={merchantFilter}
        onChange={(e) => setMerchantFilter(e.target.value)}
        className="border px-3 py-2 rounded-md text-sm"
      >
        <option value="">All Merchants</option>

        {merchantNames.map((name, i) => (
          <option key={i} value={name}>
            {name}
          </option>
        ))}
      </select> */}

                {/* Email Filter */}

                <select
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                  className="border px-3 py-2 rounded-md text-sm"
                >
                  <option value="">All Emails</option>

                  {merchantEmails.map((email, i) => (
                    <option key={i} value={email}>
                      {email}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-2.5 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search templates"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 w-full border rounded-md text-sm"
                />
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        filteredFiles.length > 0 &&
                        selectedFiles.length === filteredFiles.length
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>

                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left">File</th>
                  <th className="p-4 text-left">Type</th>
                  {activeTab === "files" &&
                    (role === "Master Admin" || role === "Dev Admin") && (
                      <>
                        <th className="p-4 text-left">Merchant Name</th>
                        <th className="p-4 text-left">Merchant Email</th>
                      </>
                    )}
                  {activeTab === "downloadable" && (
                    <>
                      <th className="p-4 text-left">Version</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-right"></th>
                      <th className="p-4 text-right"></th>
                    </>
                  )}

                  {activeTab !== "downloadable" && (
                    <th className="p-4 text-right"></th>
                  )}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={activeTab === "downloadable" ? 6 : 5}
                      className="text-center py-10"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredFiles.length > 0 ? (
                  filteredFiles.map((file, index) => (
                    <tr key={file._id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedFiles.some(
                            (f) => f._id === file._id,
                          )}
                          onChange={() => handleSelect(file)}
                        />
                      </td>

                      <td className="p-4">
                        {activeTab === "downloadable" ? (
                          <span className="text-gray-500">Excel</span>
                        ) : (
                          <img
                            src={file.url}
                            className="w-10 h-10 object-cover rounded"
                            alt="file"
                          />
                        )}
                      </td>

                      <td className="p-4">
                        {activeTab === "downloadable"
                          ? file.fileName
                          : file.originalName}
                      </td>

                      <td className="p-4">
                        {activeTab === "downloadable"
                          ? `${file.type} Template`
                          : file.contentType || "Image"}
                      </td>
                      {activeTab === "downloadable" && (
                        <>
                          <td className="p-4">
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                              v{file.version || "1.00"}
                            </span>
                          </td>

                          <td className="p-4">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                file.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {file.status}
                            </span>
                          </td>

                          <td className="p-4 text-right">
                            <button
                              onClick={() =>
                                handleDownload(file._id, file.fileName)
                              }
                              className="flex items-center gap-1 text-sm border px-3 py-1 rounded hover:bg-gray-100"
                            >
                              <HiOutlineDocumentDownload /> Download
                            </button>
                          </td>
                        </>
                      )}
                      {activeTab === "files" &&
                        (role === "Master Admin" || role === "Dev Admin") && (
                          <>
                            <td className="p-4">{file.merchantName || "-"}</td>
                            <td className="p-4">{file.merchantEmail || "-"}</td>
                          </>
                        )}
                      <td className="p-4 text-right">
                        {activeTab === "downloadable" ? null : (
                          <button
                            onClick={() => handleCopy(file.url, index)}
                            className="text-sm border px-3 py-1 rounded"
                          >
                            {copiedId === index ? "Copied" : "Copy Link"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={activeTab === "downloadable" ? 6 : 5}
                      className="text-center py-10"
                    >
                      No files found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Files</h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete
              <span className="font-semibold"> {selectedFiles.length} </span>
              file(s)? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showExcelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Upload Excel Template
              </h2>

              <button
                onClick={() => setShowExcelModal(false)}
                className="text-gray-400 hover:text-red-500 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Type Selector */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Template Type
              </label>

              <select
                value={excelType}
                onChange={(e) => setExcelType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008060]"
              >
                <option value="Products">Products_Template</option>
              </select>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 bg-gray-50 hover:border-[#008060] transition">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setExcelFile(e.target.files[0])}
                className="hidden"
                id="excelUpload"
              />

              <label
                htmlFor="excelUpload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <HiOutlineDocumentDownload className="text-4xl text-[#008060]" />{" "}
                <span className="text-sm text-gray-600">
                  Click to upload Excel file
                </span>
                <span className="text-xs text-gray-400">
                  Supported: .xlsx, .xls, .csv
                </span>
              </label>

              {excelFile && (
                <p className="text-sm text-green-600 mt-3 font-medium">
                  {excelFile.name}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowExcelModal(false)}
                className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleExcelUpload}
                disabled={!excelFile}
                className={`px-4 py-2 text-sm rounded-md text-white ${
                  excelFile
                    ? "bg-[#008060] hover:bg-[#006e52]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Upload File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;
