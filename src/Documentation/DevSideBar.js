import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { BiGitBranch } from "react-icons/bi";

const formatEndpointName = (str) =>
  str
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();

const apiSidebarData = [
  {
    title: "Auth",
    endpoints: ["SignIn"],
  },
  {
    title: "Product",
    endpoints: [
      "getAllProduct",
      "getProductByUserId",
      "createProduct",
      "updateProduct",
      "publishedProduct",
      "unpublished",
      "addImageGallery",
      "getImageGallery",
      "updateImages",
      "deleteProduct",
      "productBulkUpload",
      "getVariant",
      "updateVariant",
    ],
  },
  {
    title: "Inventory",
    endpoints: [
      "updateInventoryPrice",
      "updateInventoryQuantity",
      "bulkUploadForInventory",
    ],
  },
  {
    title: "Category",
    endpoints: [
      "createCategory",
      "getCategory",
      "getCategoryById",
      "deleteCategories",
    ],
  },
  {
    title: "Order",
    endpoints: [
      "getOrderByUserId",
      "getOrderByOrderId",
      "getAllOrders",
      "getCancellationRequests",
      "cancelOrder",
      "exportOrders",
    ],
  },
  {
    title: "Finance",
    endpoints: [
      "addPayouts",
      "addReferenceNumber",
      "getPendingPayout",
      "getPayout",
      "getPayoutByUserId",
      "getPayoutByQuery",
      "getAllPayoutByQuery",
    ],
  },
];

export default function ApiSidebar({ onSelect }) {
  const [openGroups, setOpenGroups] = useState({});
  const [active, setActive] = useState(null);

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelect = (name) => {
    setActive(name);
    onSelect && onSelect(name);
  };

  return (
    <aside className="w-72 h-screen border-r border-gray-200 bg-white px-4 py-6 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-sm font-bold text-gray-900 tracking-wide uppercase mb-1">
          API Endpoints
        </h1>
        <p className="text-xs text-gray-500">Multi-Vendor Marketplace</p>
      </div>

      <nav className="space-y-4">
        {apiSidebarData.map((group, index) => (
          <div key={index}>
            <button
              onClick={() => toggleGroup(group.title)}
              className="flex justify-between items-center w-full text-sm text-gray-700 font-semibold px-2 py-2 rounded hover:bg-gray-100 transition"
            >
              <span>{group.title}</span>
              {openGroups[group.title] ? (
                <FaChevronDown className="text-xs" />
              ) : (
                <FaChevronRight className="text-xs" />
              )}
            </button>

            {openGroups[group.title] && (
              <ul className="pl-2 mt-2 space-y-1">
                {group.endpoints.map((endpoint, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelect(endpoint)}
                    className={`cursor-pointer flex items-center gap-2 text-sm px-3 py-2 rounded-md transition ${
                      active === endpoint
                        ? "bg-purple-100 text-purple-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <BiGitBranch className="text-base" />
                    <span>{formatEndpointName(endpoint)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* Scrollbar style */}
      <style jsx>{`
        aside::-webkit-scrollbar {
          width: 6px;
        }
        aside::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        aside::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </aside>
  );
}
