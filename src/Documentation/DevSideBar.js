import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { BiGitBranch } from "react-icons/bi";

const formatEndpointName = (str) => {
  return str
    .replace(/[_-]/g, " ") // handle snake_case or kebab-case
    .replace(/\b\w/g, (l) => l.toUpperCase()) // capitalize first letters
    .replace(/\s+/g, "") // remove all spaces
    .trim();
};

const apiSidebarData = [
  {
    title: "Product",
    endpoints: [
      "createProduct",
      "updateProduct",
      "getProductByUserId",
      "getAllProduct",
      "publishedProduct",
      "unpublished",
      "updateImages",
      "deleteProduct",
      "addImageGallery",
      "getImageGallery",
      "productBulkUpload",
      "getSingleVariant",
      "updateSingleVariant",
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
      "getPayoutByQuery",
      // "getPayoutByUserId",
      // "getPayoutForAllOrders",
      // "getFinanceSummaryForUser",
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
    <aside className="w-72 bg-gradient-to-b from-white to-gray-50 border-r text-sm font-medium h-screen overflow-y-auto px-4 py-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-bold text-gray-900">
          MULTI-VENDOR-ENDPOINTS
        </h2>
        <div className="text-xs text-gray-500">
          {/* 2025-07 <span className="text-green-600 font-semibold">latest</span> */}
        </div>
      </div>

      {apiSidebarData.map((group, i) => (
        <div key={i} className="mb-4">
          <button
            onClick={() => toggleGroup(group.title)}
            className="w-full flex justify-between items-center text-left font-semibold text-gray-700 hover:text-purple-700 transition"
          >
            <span>{group.title}</span>
            {openGroups[group.title] ? <FaChevronDown /> : <FaChevronRight />}
          </button>

          {openGroups[group.title] && (
            <ul className="pl-4 mt-2 space-y-1">
              {group.endpoints.map((route, j) => (
                <li
                  key={j}
                  className={`cursor-pointer px-3 py-1.5 rounded-md transition-all flex items-center gap-2 ${
                    active === route
                      ? "bg-purple-100 text-purple-700 font-semibold"
                      : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                  }`}
                  onClick={() => handleSelect(route)}
                >
                  <BiGitBranch className="text-sm" />
                  <span>{formatEndpointName(route)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  );
}
