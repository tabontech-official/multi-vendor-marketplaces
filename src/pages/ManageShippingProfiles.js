import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  FaEdit,
  FaTrash,
  FaShippingFast,
  FaSyncAlt,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
} from "react-icons/fa";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

const ManageShippingProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const [addingProfile, setAddingProfile] = useState(false); 
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [activeProfiles, setActiveProfiles] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [profilesPerPage] = useState(10);
  const [newProfile, setNewProfile] = useState({
    profileName: "",
    rateName: "",
    ratePrice: "",
  });
  const handleAddProfile = async () => {
    if (
      !newProfile.profileName.trim() ||
      !newProfile.rateName.trim() ||
      newProfile.ratePrice === "" ||
      isNaN(newProfile.ratePrice)
    ) {
      showToast("error", "Please fill in all fields correctly.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        profileName: newProfile.profileName.trim(),
        rateName: newProfile.rateName.trim(),
        ratePrice: parseFloat(newProfile.ratePrice),
      };

      const endpoint =
        "https://multi-vendor-marketplace.vercel.app/shippingProfile/add-shipping-profiles";

      const { data } = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.success) {
        showToast("success", "New shipping profile created successfully!");
        setAddingProfile(false);
        setNewProfile({ profileName: "", rateName: "", ratePrice: "" });
        await fetchProfiles(user); 
      } else {
        showToast("error", "Shopify returned an issue. Check console.");
        console.error("Shopify API Error:", data);
      }
    } catch (err) {
      console.error("❌ Error adding profile:", err);
      showToast(
        "error",
        err.response?.data?.error ||
          "Failed to create shipping profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (profile) => {
    setDeleteModal({
      open: true,
      id: profile._id,
      name: profile.profileName,
    });
  };
  const handleDeleteConfirmed = async () => {
    try {
      if (!deleteModal.id) return;

      setLoading(true);

      await axios.delete(
        `https://multi-vendor-marketplace.vercel.app/shippingProfile/shipping-profiles/${deleteModal.id}`
      );

      showToast("success", "Shipping profile deleted successfully!");
      setDeleteModal({ open: false, id: null, name: "" });
      await fetchProfiles(user);
    } catch (err) {
      console.error("Error deleting profile:", err);
      showToast("error", "Failed to delete profile. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      console.log("🔍 Decoded Token:", decoded);

      const userData = decoded.payLoad;
      setUser(userData);
    } catch (err) {
      console.error("❌ Invalid token:", err);
      localStorage.removeItem("usertoken");
    }
  }, []);

  const isAdmin = user?.role === "Dev Admin" || user?.role === "Master Admin";
  const isMerchant =
    user?.role === "Merchant" || user?.role === "Merchant Staff";

  const fetchProfiles = async (userData) => {
    try {
      setLoading(true);

      const isAdmin =
        userData.role === "Dev Admin" || userData.role === "Master Admin";

      const endpoint = isAdmin
        ? "https://multi-vendor-marketplace.vercel.app/shippingProfile/get/admin"
        : "https://multi-vendor-marketplace.vercel.app/shippingProfile/getProfiles";

      console.log("📡 Fetching profiles from:", endpoint);

      const { data } = await axios.get(endpoint);
      const profilesData = isAdmin ? data.profiles : data;

      const unique = Array.from(
        new Map(profilesData.map((p) => [p.profileId, p])).values()
      );

      let allProfiles = unique;
      if (!isAdmin) {
        allProfiles = [
          {
            _id: "free-shipping-fixed",
            profileId: "free-shipping-fixed",
            profileName: "Free Shipping",
            rateName: "Free",
            ratePrice: 0,
            status: "enabled",
            isLocked: true,
          },
          ...unique,
        ];
      }

      setProfiles(allProfiles);
    } catch (err) {
      console.error("🚨 Error fetching shipping profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActiveProfiles = async (userId) => {
    try {
      const { data } = await axios.get(
        `https://multi-vendor-marketplace.vercel.app/shippingProfile/${userId}`
      );
      setActiveProfiles(data.map((p) => p.profileId));
    } catch (err) {
      console.error("Error fetching user active profiles:", err);
    }
  };

  useEffect(() => {
    if (userId && isMerchant) {
      fetchUserActiveProfiles(userId);
    }
  }, [userId, isMerchant]);
  useEffect(() => {
    if (user) {
      fetchProfiles(user);
    }
  }, [user]);
  const handleUserToggle = async (profile, checked) => {
    try {
      const profileUserId=localStorage.getItem("userid")
      setActiveProfiles((prev) =>
        checked
          ? [...prev, profile.profileId]
          : prev.filter((id) => id !== profile.profileId)
      );

      if (checked) {
        await axios.post("https://multi-vendor-marketplace.vercel.app/shippingProfile/activate", {
          userId: profileUserId,
          profile: {
            profileId: profile.profileId,
            profileName: profile.profileName,
            rateName: profile.rateName,
            ratePrice: profile.ratePrice,
          },
        });
      } else {
        await axios.post("https://multi-vendor-marketplace.vercel.app/shippingProfile/deactivate", {
          userId: profileUserId,
          profileId: profile.profileId,
        });
      }
    } catch (err) {
      console.error("Toggle error:", err);
      fetchUserActiveProfiles(userId);
    }
  };

  const handleAdminToggle = async (profile, checked) => {
    try {
      setProfiles((prev) =>
        prev.map((p) =>
          p._id === profile._id
            ? { ...p, status: checked ? "enabled" : "disabled" }
            : p
        )
      );

      await axios.put(
        `https://multi-vendor-marketplace.vercel.app/shippingProfile/updateStatus/${profile._id}`,
        {
          status: checked ? "enabled" : "disabled",
        }
      );
    } catch (err) {
      console.error("Error updating status:", err);
      fetchProfiles();
    }
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      await axios.put(
        `https://multi-vendor-marketplace.vercel.app/shippingProfile/update/${editingProfile._id}`,
        editingProfile
      );

      showToast("success", "Shipping profile updated successfully!");
      setEditingProfile(null);
      await fetchProfiles(user);
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast("error", "Failed to update profile. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this shipping profile?")) return;
    try {
      await axios.delete(
        `https://multi-vendor-marketplace.vercel.app/shippingProfile/shipping-profiles/${id}`
      );
      fetchProfiles();
    } catch (err) {
      console.error("Error deleting profile:", err);
    }
  };

  const indexOfLast = currentPage * profilesPerPage;
  const indexOfFirst = indexOfLast - profilesPerPage;
  const currentProfiles = profiles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(profiles.length / profilesPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {toast.show && (
        <div
          className={`fixed top-16 z-30 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${
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
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="flex items-center text-2xl font-semibold text-gray-800">
            <FaShippingFast className="text-blue-600 mr-3" />
            Manage Shipping Profiles
          </h2>
          <div className="flex gap-2">
            {isAdmin && (
              <button
                onClick={() => setAddingProfile(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                <FaPlus /> Add New
              </button>
            )}
            <button
              onClick={fetchProfiles}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Profile Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Rate Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Rate Price ($)
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                  {isAdmin ? "Linked Products" : "Active"}
                </th>
                {isAdmin && (
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentProfiles.map((profile) => (
                <tr
                  key={profile._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2 font-medium text-gray-800 flex items-center">
                    <FaShippingFast className="text-blue-500 mr-2" />
                    {profile.profileName}
                  </td>

                  <td className="px-4 py-2 text-gray-600">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                      {profile.rateName}
                    </span>
                  </td>

                  <td className="px-4 py-2 font-semibold text-green-600">
                    ${profile.ratePrice?.toFixed(2) ?? "0.00"}
                  </td>

                  <td className="px-4 py-2 text-center">
                    {isAdmin ? (
                      <span className="text-gray-800 font-semibold">
                        {profile.productCount ?? 0}
                      </span>
                    ) : (
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={
                            profile.isLocked
                              ? true
                              : activeProfiles.includes(profile.profileId)
                          }
                          disabled={profile.isLocked}
                          onChange={(e) =>
                            !profile.isLocked &&
                            handleUserToggle(profile, e.target.checked)
                          }
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
                      </label>
                    )}
                  </td>

                  {isAdmin && (
                    <td className="px-4 py-2 text-center flex justify-center gap-3">
                      {!profile.isLocked ? (
                        <>
                          <button
                            onClick={() => setEditingProfile(profile)}
                            className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => confirmDelete(profile)}
                            className="p-2 rounded-md text-red-600 hover:bg-red-50 transition"
                          >
                            <FaTrash />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-green-700 bg-green-100 px-3 py-1 rounded-md font-medium">
                           Always Active
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {profiles.length > profilesPerPage && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 py-1 border rounded-md text-sm ${
                currentPage === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <FaChevronLeft /> Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 border rounded-md text-sm ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-1 border rounded-md text-sm ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Next <FaChevronRight />
            </button>
          </div>
        )}
      </div>
      {addingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Add New Shipping Profile
            </h3>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-700">
                Profile Name
                <input
                  type="text"
                  value={newProfile.profileName}
                  onChange={(e) =>
                    setNewProfile({
                      ...newProfile,
                      profileName: e.target.value,
                    })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Rate Name
                <input
                  type="text"
                  value={newProfile.rateName}
                  onChange={(e) =>
                    setNewProfile({ ...newProfile, rateName: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Rate Price ($)
                <input
                  type="number"
                  value={newProfile.ratePrice}
                  onChange={(e) =>
                    setNewProfile({ ...newProfile, ratePrice: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setAddingProfile(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProfile}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {editingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Edit Shipping Profile
            </h3>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-700">
                Profile Name
                <input
                  type="text"
                  value={editingProfile.profileName}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      profileName: e.target.value,
                    })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Rate Name
                <input
                  type="text"
                  value={editingProfile.rateName}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      rateName: e.target.value,
                    })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Rate Price ($)
                <input
                  type="number"
                  value={editingProfile.ratePrice}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      ratePrice: parseFloat(e.target.value),
                    })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingProfile(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Confirm Deletion
            </h3>

            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete the shipping profile{" "}
              <span className="font-semibold text-red-600">
                "{deleteModal.name}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteModal({ open: false, id: null, name: "" })
                }
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
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

export default ManageShippingProfiles;
