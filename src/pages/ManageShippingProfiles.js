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
} from "react-icons/fa";

const ManageShippingProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  const [activeProfiles, setActiveProfiles] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [profilesPerPage] = useState(10);

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    const id = localStorage.getItem("userid");
    if (id) setUserId(id);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("🔍 Decoded Token:", decoded);

        const userData = decoded.payLoad || decoded.user || decoded;
        setUser(userData);
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const isAdmin = user?.role === "Dev Admin" || user?.role === "Master Admin";
  const isMerchant =
    user?.role === "Merchant" || user?.role === "Merchant Staff";

  const fetchProfiles = async () => {
    try {
      setLoading(true);

      const endpoint = isAdmin
        ? "https://multi-vendor-marketplace.vercel.app/shippingProfile/get/admin"
        : "https://multi-vendor-marketplace.vercel.app/shippingProfile/getProfiles";

      const { data } = await axios.get(endpoint);

      const profilesData = isAdmin ? data.profiles : data;

      const unique = Array.from(
        new Map(profilesData.map((p) => [p.profileId, p])).values()
      );

      // 🟩 Add permanent Free Shipping profile for merchants only
      let allProfiles = unique;
      if (!isAdmin) {
        const freeShippingProfile = {
          _id: "free-shipping-fixed",
          profileId: "free-shipping-fixed",
          profileName: "Free Shipping",
          rateName: "Free",
          ratePrice: 0,
          status: "enabled",
          isLocked: true,
        };
        allProfiles = [freeShippingProfile, ...unique];
      }

      setProfiles(allProfiles);
    } catch (err) {
      console.error("Error fetching shipping profiles:", err);
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
    fetchProfiles();
  }, []);

  const handleUserToggle = async (profile, checked) => {
    try {
      setActiveProfiles((prev) =>
        checked
          ? [...prev, profile.profileId]
          : prev.filter((id) => id !== profile.profileId)
      );

      if (checked) {
        await axios.post("https://multi-vendor-marketplace.vercel.app/shippingProfile/activate", {
          userId: userId,
          profile: {
            profileId: profile.profileId,
            profileName: profile.profileName,
            rateName: profile.rateName,
            ratePrice: profile.ratePrice,
          },
        });
      } else {
        await axios.post("https://multi-vendor-marketplace.vercel.app/shippingProfile/deactivate", {
          userId: userId,
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
      await axios.put(
        `https://multi-vendor-marketplace.vercel.app/shippingProfile/update/${editingProfile._id}`,
        editingProfile
      );
      setEditingProfile(null);
      fetchProfiles();
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this shipping profile?")) return;
    try {
      await axios.delete(`https://multi-vendor-marketplace.vercel.app/shippingProfile/delete/${id}`);
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="flex items-center text-2xl font-semibold text-gray-800">
            <FaShippingFast className="text-blue-600 mr-3" />
            Manage Shipping Profiles
          </h2>
          <button
            onClick={fetchProfiles}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
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
                  {/* 🟦 Profile Name */}
                  <td className="px-4 py-2 font-medium text-gray-800 flex items-center">
                    <FaShippingFast className="text-blue-500 mr-2" />
                    {profile.profileName}
                  </td>

                  {/* 🟦 Rate Name */}
                  <td className="px-4 py-2 text-gray-600">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                      {profile.rateName}
                    </span>
                  </td>

                  {/* 🟦 Rate Price */}
                  <td className="px-4 py-2 font-semibold text-green-600">
                    ${profile.ratePrice?.toFixed(2) ?? "0.00"}
                  </td>

                  {/* 🟦 Admin → Linked Products | Merchant → Active Toggle */}
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

                  {/* 🟦 Admin Action Buttons */}
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
                            onClick={() => handleDelete(profile._id)}
                            className="p-2 rounded-md text-red-600 hover:bg-red-50 transition"
                          >
                            <FaTrash />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-green-700 bg-green-100 px-3 py-1 rounded-md font-medium">
                          🟢 Always Active
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
    </div>
  );
};

export default ManageShippingProfiles;
