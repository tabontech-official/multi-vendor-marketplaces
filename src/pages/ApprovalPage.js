import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineRefresh,
  HiOutlineSearch,
} from "react-icons/hi";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "../Hooks/useAuthContext";
import { useNotification } from "../context api/NotificationContext";
import UseFetchUserData from "../component/fetchUser";

const ApprovalPage = () => {
  const { user } = useAuthContext();
  const { addNotification } = useNotification();

  const [activeTab, setActiveTab] = useState("products");

  const [userRole, setUserRole] = useState(null);
  const [searchVal, setSearchVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [selectedItems, setSelectedItems] = useState([]);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [pendingUsers, setPendingUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const limit = 20;

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded?.payLoad?.role);
      } catch (e) {
        console.error("Token error", e);
      }
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const userId = localStorage.getItem("userid");
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");

    try {
      const isAdmin =
        userRole === "Dev Admin" ||
        userRole === "Master Admin" ||
        userRole === "Support Staff";

      let url = "";
      if (activeTab === "products") {
        url = isAdmin
          ? `https://multi-vendor-marketplace.vercel.app/product/getProductWithApprovalStatus/?page=${page}&limit=${limit}`
          : `https://multi-vendor-marketplace.vercel.app/product/getProduct/${userId}?page=${page}&limit=${limit}`;
      } else {
        url = `https://multi-vendor-marketplace.vercel.app/users/getPendingUsers/?page=${page}&limit=${limit}`;
      }

      const response = await fetch(url, {
        headers: { "x-api-key": apiKey, "x-api-secret": apiSecretKey },
      });

      if (response.ok) {
        const data = await response.json();
        if (activeTab === "products") {
          const newProducts = data.products || [];
          setProducts((prev) =>
            page === 1 ? newProducts : [...prev, ...newProducts],
          );
          setHasMore(page < data.totalPages);
        } else {
          const newUsers = data.users || [];
          setPendingUsers((prev) =>
            page === 1 ? newUsers : [...prev, ...newUsers],
          );
          setHasMore(page < data.totalPages);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, userRole]);

  useEffect(() => {
    if (userRole) fetchData();
  }, [fetchData]);

  return user ? (
    <main className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b-2 border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Approval Dashboard</h1>
          <p className="text-gray-600">
            Review pending registrations and product listings.
          </p>
        </div>

        <div className="relative mt-4 md:mt-0 w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <HiOutlineSearch className="text-gray-400" />
          </span>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex space-x-8 mt-4">
        <button
          onClick={() => {
            setActiveTab("products");
            setPage(1);
          }}
          className={`pb-3 px-1 font-medium text-sm transition-all ${
            activeTab === "products"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Product Approvals
        </button>
        <button
          onClick={() => {
            setActiveTab("users");
            setPage(1);
          }}
          className={`pb-3 px-1 font-medium text-sm transition-all ${
            activeTab === "users"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          User Approvals
        </button>
      </div>

      <div className="py-6">
        {loading && page === 1 ? (
          <div className="flex justify-center py-10">
            <HiOutlineRefresh className="animate-spin text-3xl text-blue-500" />
          </div>
        ) : activeTab === "products" ? (
          <ProductTable
            products={products.filter((p) =>
              p.title?.toLowerCase().includes(searchVal.toLowerCase()),
            )}
            userRole={userRole}
          />
        ) : (
          <UserTable
            users={pendingUsers.filter((u) =>
              u.username?.toLowerCase().includes(searchVal.toLowerCase()),
            )}
          />
        )}
      </div>
    </main>
  ) : null;
};

const ProductTable = ({ products, loading, userRole }) => (
  <div className="overflow-x-auto border rounded-lg">
    <table className="w-full text-left bg-white">
      <thead className="bg-gray-100 text-xs uppercase text-gray-600">
        <tr>
          <th className="p-3">Image</th>
          <th className="p-3">Title</th>
          <th className="p-3">Status</th>
          {(userRole === "Dev Admin" || userRole === "Master Admin") && (
            <th className="p-3">Publisher</th>
          )}
          <th className="p-3">Price</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product._id} className="border-b hover:bg-gray-50">
            <td className="p-3">
              {product.images?.[0]?.src ? (
                <img
                  src={product.images[0].src}
                  className="w-12 h-12 object-cover rounded"
                  alt={product.title || "Product image"}
                />
              ) : (
                <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                  No Image
                </div>
              )}
            </td>
            <td className="p-3 font-medium">{product.title}</td>
            <td className="p-3">
              <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                {product.approvalStatus || "Pending"}
              </span>
            </td>
            {(userRole === "Dev Admin" || userRole === "Master Admin") && (
              <td className="p-3">{product.username}</td>
            )}
            <td className="p-3">${product.variants?.[0]?.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const UserTable = ({ users, loading }) => (
  <div className="overflow-x-auto border rounded-lg">
    <table className="w-full text-left bg-white">
      <thead className="bg-gray-100 text-xs uppercase text-gray-600">
        <tr>
          <th className="p-3">Username</th>
          <th className="p-3">Email</th>
          <th className="p-3">Role</th>
          <th className="p-3">Date Joined</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((u) => (
            <tr key={u._id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium">{u.username}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3 text-sm">{u.role}</td>
              <td className="p-3 text-sm">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
              <td className="p-3">
                <button className="text-green-600 hover:underline mr-3">
                  Approve
                </button>
                <button className="text-red-600 hover:underline">Reject</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="p-10 text-center text-gray-400">
              No pending users found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default ApprovalPage;
