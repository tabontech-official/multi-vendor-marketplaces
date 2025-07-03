import React, { useEffect, useState } from "react";
import { HiCamera } from "react-icons/hi";
import { FaTimes } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaBars, FaArrowLeft } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { MdIntegrationInstructions } from "react-icons/md";
import { IoDocuments } from "react-icons/io5";
import { TiUserAdd } from "react-icons/ti";
import { TiContacts } from "react-icons/ti";
import { RiStarSFill } from "react-icons/ri";
import { MdOutlineHolidayVillage } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { MdManageAccounts } from "react-icons/md";
import axios from "axios";
import { CiCalendarDate } from "react-icons/ci";
const AccountPage = () => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState("Manage User");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState("");
  const [success, setSuccess] = useState("");
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);
  const [activeTab, setActiveTab] = useState("contactDetails");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const [role, setRole] = useState("");
  const [activeButton, setActiveButton] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sellerName, setSellerName] = useState("");
  const [sellerNameInput, setSellerNameInput] = useState("");
  const [collectionId, setCollectionId] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    zip: "",
    country: "",
    city: "",
    dispatchAddress: " ",
    dispatchCity: " ",
    dispatchCountry: " ",
    dispatchzip: " ",
    profileImage: "https://sp-seller.webkul.com/img/store_logo/icon-user.png",
    sellerGst: "",
    gstRegistered: "",
  });
  useEffect(() => {
    const fetchBrandAssetData = async () => {
      const userId = localStorage.getItem("userid");
      if (!userId) return;

      try {
        const res = await fetch(
          `https://multi-vendor-marketplace.vercel.app/auth/getCollcetion/${userId}`
        );
        const data = await res.json();
        if (res.ok) {
          setSellerName(data.sellerName);
          setSellerNameInput(data.sellerName);
          setCollectionId(data.shopifyCollectionId);
          setDescription(data.description);
          setImagePreview(data.image);
        } else {
          console.error("Error fetching brand asset:", data.error);
        }
      } catch (err) {
        console.error("API error:", err);
      }
    };

    fetchBrandAssetData();
  }, []);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  useEffect(() => {
    const fetchBrandAssetData = async () => {
      const userId = localStorage.getItem("userid");
      if (!userId) return;

      try {
        const res = await fetch(
          `https://multi-vendor-marketplace.vercel.app/auth/getBrandAssets/${userId}`
        );
        const json = await res.json();

        if (res.ok && json.data) {
          const { sellerName, description, images } = json.data;
          setSellerName(sellerName || "");
          setDescription(description || "");
          setImagePreview(images || ""); // Cloudinary image URL
          setCollectionId(json.data.shopifyCollectionId || "");
        } else {
          console.error("Failed to fetch brand asset:", json.error);
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    fetchBrandAssetData();
  }, []);

  const handleSubmit2 = async () => {
    const userId = localStorage.getItem("userid");
    if (!userId || !collectionId || !description) {
      setMessage("User ID, Collection ID, and Description are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("collectionId", collectionId);
      formData.append("description", description);
      if (imageFile) {
        formData.append("images", imageFile);
      }

      const response = await axios.post(
        "https://multi-vendor-marketplace.vercel.app/auth/addBrandAsset",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Collection updated successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessage("Failed to update collection");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      const id = localStorage.getItem("userid");

      if (!id) {
        console.error("User ID not found in localStorage.");
        setError("User ID not found.");
        return;
      }

      try {
        const response = await fetch(`https://multi-vendor-marketplace.vercel.app/auth/user/${id}`, {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setInfo(data);
          if (isMounted) {
            setFormData({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || "",
              password: data.password || "",
              phone: data.phoneNumber || "",
              address: data.address || "",
              zip: data.zip || "",
              country: data.country || "",
              city: data.city || "",
              profileImage:
                data.avatar[0] ||
                "https://sp-seller.webkul.com/img/store_logo/icon-user.png",
              gstRegistered: data.gstRegistered,
              sellerGst: data.sellerGst,
              dispatchCountry: data.dispatchCountry,
              dispatchCity: data.dispatchCity,
              dispatchAddress: data.dispatchAddress,
              dispatchzip: data.dispatchzip,
            });
          }
        } else {
          console.error("Failed to fetch user data. Status:", response.status);
          setError(`Failed to fetch user data. Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data.");
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!agreedToPolicies) {
    //   alert("Please agree to the policies before proceeding.");
    //   return;
    // }

    const form = new FormData();

    setLoading(true);

    const userId = localStorage.getItem("userid");
    if (!userId) {
      console.error("User ID not found in localStorage.");
      setLoading(false);
      return;
    }

    form.append("firstName", formData.firstName);
    form.append("lastName", formData.lastName);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("phoneNumber", formData.phone);
    form.append("address", formData.address);
    form.append("zip", formData.zip);
    form.append("country", formData.country);
    form.append("city", formData.city);
    form.append("gstRegistered", formData.gstRegistered);
    form.append("sellerGst", formData.sellerGst);
    form.append("dispatchzip", formData.dispatchzip);
    form.append("dispatchCountry", formData.dispatchCountry);
    form.append("dispatchCity", formData.dispatchCity);
    form.append("dispatchAddress", formData.dispatchAddress);

    if (imageFile) {
      form.append("images", imageFile);
    }

    try {
      const response = await fetch(
        `https://multi-vendor-marketplace.vercel.app/auth/editProfile/${userId}`,
        {
          method: "PUT",
          body: form,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setSuccess("Profile Updated");
      } else {
        console.error("Failed to update profile. Status:", response.status);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleOptions = () => {
    if (userRole === "Dev Admin") {
      return ["DevAdmin", "MasterAdmin", "Client", "Staff"];
    } else if (userRole === "Master Admin") {
      return ["Client", "Staff"];
    } else if (userRole === "Client") {
      return ["Staff"];
    }
    return [];
  };

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      if (decoded?.payLoad?.role) {
        setUserRole(decoded.payLoad.role);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleModuleSelection = (moduleName) => {
    setSelectedModules((prev) =>
      prev.includes(moduleName)
        ? prev.filter((m) => m !== moduleName)
        : [...prev, moduleName]
    );
  };

  const updateAllProductsStatus = async (status) => {
    try {
      const response = await fetch("https://multi-vendor-marketplace.vercel.app/product/holiday", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`All products updated to ${status}`);
      } else {
        alert(`Failed to update products: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating products:", error);
      alert("An error occurred while updating product status.");
    }
  };

  const modules = [
    { name: "Dashboard", subModules: [] },
    {
      name: "Products",
      subModules: ["Manage Product", "Add Product", "Inventory"],
    },
    {
      name: "Orders",
      subModules: ["ManageOrders"],
    },
    {
      name: "Promotions",
      subModules: ["All Promotions"],
    },
    {
      name: "Reports",
      subModules: ["Catalog Performance", "eCommerence Consultion"],
    },
  ];

  const handleUpdateTags = async () => {
    if (!email) {
      alert("Email is required!");
      return;
    }

    try {
      const response = await fetch(
        "https://multi-vendor-marketplace.vercel.app/auth/createUserTagsModule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            role,
            modules: selectedModules,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      alert("User updated successfully!");
      setIsOpen(false);
      setName("");
      setEmail("");
      setSelectedModules([]);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user: " + error.message);
    }
  };

  return (
    <div className="flex bg-blue-50 min-h-screen text-blue-900">
      {/* <aside className="w-52 mt-2 mb-2 ml-4 rounded-r-2xl bg-blue-900 p-6 flex flex-col justify-between min-h-screen">
        <div>
          <div className="flex flex-col items-center border-b-2">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
              <FaUser className="text-yellow-400 w-10 h-10" />
            </div>
            <h2 className="text-lg font-semibold text-white mt-2">
              Business Account
            </h2>

            <div className="flex items-center space-x-1 mt-1">
              <span className="text-yellow-400 text-sm font-semibold">6.0</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, index) => (
                  <span key={index} className="text-yellow-400 text-sm">
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-green-400 text-sm mt-1 mb-2">
              Profile is 75% complete
            </p>
          </div>

          <nav className="mt-6 space-y-4">
            {userRole === "Merchant" && (
              <NavLink
                to="/manage-user"
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 ${
                    isActive ? "text-yellow-400" : "text-blue-300"
                  } hover:text-yellow-400`
                }
              >
                <span className="w-6 h-6 bg-blue-700 flex items-center justify-center rounded-md">
                  <MdManageAccounts />
                </span>
                <span className="text-sm">Manage User</span>
              </NavLink>
            )}
            <NavLink
              to="/edit-account"
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 ${
                  isActive ? "text-yellow-400" : "text-blue-300"
                } hover:text-yellow-400`
              }
            >
              <span className="w-6 h-6 bg-blue-700 flex items-center justify-center rounded-md">
                <IoSettings />
              </span>
              <span className="text-sm">Settings</span>
            </NavLink>
            <NavLink
              to="/api-credentials"
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 ${
                  isActive ? "text-yellow-400" : "text-blue-300"
                } hover:text-yellow-400`
              }
            >
              <span className="w-6 h-6 bg-blue-700 flex items-center justify-center rounded-md">
                <IoSettings />
              </span>
              <span className="text-sm">Api credentials</span>
            </NavLink>
          </nav>
        </div>

        <button className="w-full py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600">
          Promote
        </button>
      </aside> */}
      <aside className="w-56 mt-3 mb-3 ml-4 rounded-2xl bg-blue-900 p-5 flex flex-col justify-between min-h-screen shadow-lg">
  {/* Top: Profile */}
  <div>
    <div className="flex flex-col items-center border-b border-blue-700 pb-4">
      <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center shadow-md">
        <FaUser className="text-yellow-400 w-8 h-8" />
      </div>

      <h2 className="text-lg font-semibold text-white mt-3">Business Account</h2>

      <div className="flex items-center mt-1 space-x-1">
        <span className="text-yellow-400 font-semibold text-sm">6.0</span>
        <div className="flex space-x-0.5">
          {[...Array(5)].map((_, index) => (
            <span key={index} className="text-yellow-400 text-sm">★</span>
          ))}
        </div>
      </div>

      <p className="text-green-400 text-xs mt-1">Profile is 75% complete</p>
    </div>

    {/* Navigation Links */}
    <nav className="mt-6 space-y-3">
      {userRole === "Merchant" && (
        <NavLink
          to="/manage-user"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md transition-all duration-150 ${
              isActive ? "bg-yellow-400 text-blue-900" : "text-blue-200 hover:bg-blue-800"
            }`
          }
        >
          <MdManageAccounts className="mr-2 text-lg" />
          <span className="text-sm font-medium">Manage User</span>
        </NavLink>
      )}
      <NavLink
        to="/edit-account"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md transition-all duration-150 ${
            isActive ? "bg-yellow-400 text-blue-900" : "text-blue-200 hover:bg-blue-800"
          }`
        }
      >
        <IoSettings className="mr-2 text-lg" />
        <span className="text-sm font-medium">Settings</span>
      </NavLink>

      <NavLink
        to="/api-credentials"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md transition-all duration-150 ${
            isActive ? "bg-yellow-400 text-blue-900" : "text-blue-200 hover:bg-blue-800"
          }`
        }
      >
        <IoSettings className="mr-2 text-lg" />
        <span className="text-sm font-medium">API Credentials</span>
      </NavLink>
    </nav>
  </div>

  {/* Bottom: Promote Button */}
  <button className="w-full mt-6 py-2 bg-yellow-400 text-blue-900 font-semibold rounded-md hover:bg-yellow-500 transition-all duration-150">
    🚀 Promote
  </button>
</aside>

      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg w-2/4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm">Manage User</h2>
                <FaArrowRight className="text-sm" />
                <h2 className="text-black text-sm">Add User</h2>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <h2 className="text-black text-sm font-semibold mt-3">Add User</h2>
            <div className="space-y-4">
              {" "}
              <div className="flex flex-col w-full">
                <label className="text-sm text-gray-700 mb-1">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  {getRoleOptions().map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col w-full">
                <label className="text-sm text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email..."
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-sm text-gray-700 mb-1">Modules *</label>
                <div className="border px-3 py-2 rounded-md">
                  {modules.map((module, index) => (
                    <div key={index} className="flex flex-col">
                      <label className="flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          checked={selectedModules.includes(module.name)}
                          onChange={() => handleModuleSelection(module.name)}
                          className="form-checkbox text-blue-500"
                        />
                        <span className="text-sm font-semibold">
                          {module.name}
                        </span>
                      </label>

                      {selectedModules.includes(module.name) &&
                        module.subModules.length > 0 && (
                          <div className="pl-6 mt-1">
                            {module.subModules.map((subModule, subIndex) => (
                              <label
                                key={subIndex}
                                className="flex items-center gap-2 py-1"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedModules.includes(subModule)}
                                  onChange={() =>
                                    handleModuleSelection(subModule)
                                  }
                                  className="form-checkbox text-blue-500"
                                />
                                <span className="text-sm">{subModule}</span>
                              </label>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleUpdateTags}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 p-6 bg-white">
        <Link to={"/"}>
          <button className="flex items-center text-blue-700 hover:text-blue-500 mb-4">
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </Link>
        <h1 className="text-2xl font-semibold text-blue-800">
          Account Settings
        </h1>
        <div className="flex justify-between border-b border-blue-700 mt-4 text-blue-600">
          <button
            className={`pb-2 flex items-center space-x-2 ${
              activeTab === "contactDetails"
                ? "border-b-2 border-blue-600 text-blue-700 font-semibold"
                : "text-blue-500 hover:text-blue-700"
            }`}
            onClick={() => setActiveTab("contactDetails")}
          >
            <TiContacts className="text-xl" />
            <span>Contact Details</span>
          </button>

          <button
            className={`pb-2 flex items-center space-x-2 ${
              activeTab === "brandassets"
                ? "border-b-2 border-blue-600 text-blue-700 font-semibold"
                : "text-blue-500 hover:text-blue-700"
            }`}
            onClick={() => setActiveTab("brandassets")}
          >
            <FaUser className="text-xl" />
            <span>Brand Assets</span>
          </button>

          <button
            className={`pb-2 flex items-center space-x-2 ${
              activeTab === "holiday"
                ? "border-b-2 border-blue-600 text-blue-700 font-semibold"
                : "text-blue-500 hover:text-blue-700"
            }`}
            onClick={() => setActiveTab("holiday")}
          >
            <MdOutlineHolidayVillage className="text-xl" />
            <span>Holiday</span>
          </button>
        </div>

        <div className="mt-6 p-6 bg-white rounded-lg">
          {activeTab === "contactDetails" && (
            <div className="bg-white p-6 rounded-xl shadow-xl mt-6">
              <h2 className="text-2xl font-bold text-blue-800 mb-6">
                Edit Profile
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="flex flex-col">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                  />
                </div>

                {/* Last Name */}
                <div className="flex flex-col">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                  />
                </div>

                {/* Address */}
                <div className="flex flex-col">
                  <label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-700"
                  >
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                  />
                </div>

                {/* Seller GST */}
                <div className="flex flex-col">
                  <label
                    htmlFor="sellerGst"
                    className="text-sm font-medium text-gray-700"
                  >
                    Seller GST *
                  </label>
                  <input
                    type="text"
                    id="sellerGst"
                    name="sellerGst"
                    value={formData.sellerGst}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                  />
                </div>

                {/* GST Registered */}
                <div className="flex flex-col">
                  <label
                    htmlFor="gstRegistered"
                    className="text-sm font-medium text-gray-700"
                  >
                    GST Registered *
                  </label>
                  <input
                    type="text"
                    id="gstRegistered"
                    name="gstRegistered"
                    value={formData.gstRegistered}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                  />
                </div>

                {/* Dispatch Address */}
                <div className="flex flex-col">
                  <label
                    htmlFor="dispatchAddress"
                    className="text-sm font-medium text-gray-700"
                  >
                    Dispatch Address *
                  </label>
                  <input
                    type="text"
                    id="dispatchAddress"
                    name="dispatchAddress"
                    value={formData.dispatchAddress}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                  />
                </div>

                {/* Dispatch City */}
                <div className="flex flex-col">
                  <label
                    htmlFor="dispatchCity"
                    className="text-sm font-medium text-gray-700"
                  >
                    Dispatch City *
                  </label>
                  <input
                    type="text"
                    id="dispatchCity"
                    name="dispatchCity"
                    value={formData.dispatchCity}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                  />
                </div>

                {/* Dispatch Country */}
                <div className="flex flex-col">
                  <label
                    htmlFor="dispatchCountry"
                    className="text-sm font-medium text-gray-700"
                  >
                    Dispatch Country *
                  </label>
                  <input
                    type="text"
                    id="dispatchCountry"
                    name="dispatchCountry"
                    value={formData.dispatchCountry}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                  />
                </div>

                {/* Dispatch Zip */}
                <div className="flex flex-col">
                  <label
                    htmlFor="dispatchzip"
                    className="text-sm font-medium text-gray-700"
                  >
                    Dispatch Zip *
                  </label>
                  <input
                    type="number"
                    id="dispatchzip"
                    name="dispatchzip"
                    value={formData.dispatchzip}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 transition"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* {activeTab === "brandassets" && (
            <div className=" p-6 rounded-lg text-blue-900">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold text-blue-900">
                  Seller Name
                </h2>
              </div>

              <div>
                <div className="mt-6 bg-blue-200 p-4 rounded-lg border border-blue-300 text-center">
                  <p className="text-blue-500">
                    Maximum size for a file is 5MB, format: .jpg, .jpeg
                  </p>
                  <p className="text-blue-600">
                    Recommended image size: 1180×290px
                  </p>
                  <div className="mt-4 h-32 border-2 border-dashed border-blue-500 flex justify-center items-center relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <span className="text-blue-500 z-10">
                        Upload Cover Photo
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-blue-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full p-2 bg-blue-200 text-blue-900 border border-blue-400 rounded-md"
                    placeholder="Minimum 160 and maximum 900 characters"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 bg-blue-200 p-4 rounded-lg border border-blue-300">
                <h3 className="text-lg font-semibold text-blue-900">Photo</h3>
                <ul className="text-blue-600 text-sm mt-2 space-y-1">
                  <li>✔ Your photo will be posted:</li>
                  <li>- On the business page</li>
                  <li>- On the ad page (if you have an ad package)</li>
                  <li>- In job search results (if using premium ads)</li>
                </ul>
              </div>
              <div className="mt-4 text-center">
                <button
                  className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
                  onClick={handleSubmit2}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Collection"}
                </button>
              </div>

              {message && (
                <p className="mt-4 text-center text-blue-700 font-medium">
                  {message}
                </p>
              )}
            </div>
          )} */}
          {activeTab === "brandassets" && (
            <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-xl shadow-md space-y-8 text-blue-900">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-1">
                    Your Collection
                  </h2>
                  <a
                    href={`https://www.aydiactive.com/collections/${sellerName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-700 hover:underline hover:text-blue-900"
                  >
                    🔗 https://www.aydiactive.com/collections/{sellerName}
                  </a>
                </div>

                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-lg text-sm shadow hover:scale-105 transition-transform duration-200 disabled:opacity-60"
                  onClick={handleSubmit2}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Collection"}
                </button>
              </div>

              <div className="rounded-lg border border-blue-200 bg-white shadow-inner p-6">
                <p className="text-sm text-blue-600 mb-2">
                  Upload a banner image for your collection (Max 5MB, .jpg/.jpeg
                  only)
                </p>
                <p className="text-sm text-blue-500 mb-4">
                  Recommended: 1180×290px
                </p>

                <div className="relative h-40 border-2 border-dashed border-gray-300 rounded-md  flex justify-center items-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Cover Preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-blue-400 font-medium">
                      {" "}
                      Upload Cover Photo
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Description Box */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-800">
                  Description{" "}
                  <span className="text-gray-500">(160–900 characters)</span>
                </label>
                <textarea
                  className="w-full border border-gray-300 text-blue-900 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                  rows="4"
                  placeholder="Describe your collection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Where Photo Appears */}
              <div className="bg-white p-5 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Where your photo appears
                </h3>
                <ul className="list-disc text-sm text-blue-700 space-y-1 pl-5">
                  <li>On the business profile page</li>
                  <li>In your collection ads (if applicable)</li>
                  <li>On premium job search results</li>
                </ul>
              </div>

              {/* Status Message */}
              {message && (
                <p className="text-center text-sm font-medium text-green-600">
                  {message}
                </p>
              )}
            </div>
          )}

          {activeTab === "holiday" && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-blue-800 tracking-wide">
                Holiday Mode Settings 🎉
              </h2>
              <p className="text-sm text-blue-600 mt-2 leading-relaxed">
                While holiday mode is on, all your products will be hidden, but
                you can still access and fulfill existing orders. <br />
                Note: Your start and end dates are **inclusive**.
              </p>

              <div className="flex gap-4 mt-5">
                <button
                  onClick={() => {
                    setActiveButton("active");
                    updateAllProductsStatus("active");
                  }}
                  className={`py-2 px-4 rounded-full shadow-sm transition-all duration-200 text-sm font-medium ${
                    activeButton === "active"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-green-100"
                  }`}
                >
                  Active
                </button>

                <button
                  onClick={() => {
                    setActiveButton("inactive");
                    updateAllProductsStatus("draft");
                  }}
                  className={`py-2 px-4 rounded-full shadow-sm transition-all duration-200 text-sm font-medium ${
                    activeButton === "inactive"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-red-100"
                  }`}
                >
                  Inactive
                </button>
              </div>

              <div className="mt-6 bg-white border border-blue-200 rounded-lg shadow-sm p-5">
                <div className="flex items-center gap-4 mb-4">
                  <label className="w-28 flex items-center text-sm font-semibold text-blue-900">
                    <CiCalendarDate className="mr-1 text-lg" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="flex-1 p-2 border border-blue-300 rounded-md text-sm text-blue-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-28 flex items-center text-sm font-semibold text-blue-900">
                    <CiCalendarDate className="mr-1 text-lg" />
                    End Date
                  </label>
                  <input
                    type="date"
                    className="flex-1 p-2 border border-blue-300 rounded-md text-sm text-blue-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-sm font-semibold shadow transition">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
