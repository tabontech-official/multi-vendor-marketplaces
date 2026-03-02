import React, { useEffect, useState } from "react";
import {
  HiCamera,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";
import { FaPercentage, FaTimes } from "react-icons/fa";
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
  const [commission, setCommission] = useState("");

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
  const [imageError, setImageError] = useState("");
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
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [collectionTitle, setCollectionTitle] = useState(sellerName || "");

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
    setCollectionTitle(sellerName || "");
  }, [sellerName]);
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  useEffect(() => {
    const fetchBrandAsset = async () => {
      const userId = localStorage.getItem("userid");
      if (!userId) return;

      try {
        const res = await fetch(
          `http://localhost:5000/auth/getBrandAssets/${userId}`,
        );
        const json = await res.json();

        console.log("📦 Brand Asset API Response:", json);

        if (res.ok && json.data) {
          setCollectionTitle(json.data.sellerName || "");
          setSellerName(json.data.sellerName || "");
          setDescription(json.data.description || "");
          setImagePreview(json.data.images || null);
        }
      } catch (err) {
        console.error("❌ Brand asset fetch error:", err);
      }
    };

    fetchBrandAsset();
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
          `http://localhost:5000/auth/getBrandAssets/${userId}`,
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

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("collectionId", collectionId);
      formData.append("description", description);
      formData.append("title", collectionTitle);

      if (imageFile) {
        formData.append("images", imageFile);
      }

      const response = await axios.post(
        "http://localhost:5000/auth/addBrandAsset",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
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
        const response = await fetch(
          `http://localhost:5000/auth/user/${id}`,
          {
            method: "GET",
          },
        );

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
    form.append("address", formData.address);
    form.append("phoneNumber", formData.phone);
    form.append("city", formData.city);
    form.append("state", formData.state);
    form.append("zip", formData.zip);
    form.append("country", formData.country);

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
        `http://localhost:5000/auth/editProfile/${userId}`,
        {
          method: "PUT",
          body: form,
        },
      );

      if (response.ok) {
        const responseData = await response.json();
        showToast("success", "Profile Updated");
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
        : [...prev, moduleName],
    );
  };

  const updateAllProductsStatus = async (status) => {
    const apiKey = localStorage.getItem("apiKey");
    const token = localStorage.getItem("usertoken");

    const apiSecretKey = localStorage.getItem("apiSecretKey");
    try {
      const response = await fetch(
        "http://localhost:5000/product/holiday",
        {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        showToast("success", `All products updated to ${status}`);
      } else {
        showToast("error", `Failed to update products: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating products:", error);
      showToast("error", "An error occurred while updating product status.");
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
      showToast("error", "Email is required!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/auth/createUserTagsModule",
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
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      showToast("success", "User updated successfully!");
      setIsOpen(false);
      setName("");
      setEmail("");
      setSelectedModules([]);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      showToast("error", "Error updating user: " + error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
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
                          className="form-checkbox text-gray-600"
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
                                  className="form-checkbox text-gray-600"
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
          <button className="flex items-center font-semibold text-gray-900 mb-4">
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </Link>
        <h1 className="text-xl font-semibold text-gray-900 mb-0.5">
          Account Settings
        </h1>
        <div className="flex justify-between border-b border-gray-300 mt-4 text-gray-600">
          <button
            className={`pb-2 flex items-center space-x-2 ${
              activeTab === "contactDetails"
                ? "border-b-2 border-gray-800 text-gray-900 font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("contactDetails")}
          >
            <TiContacts className="text-xl" />
            <span>Contact Details</span>
          </button>

          <button
            className={`pb-2 flex items-center space-x-2 ${
              activeTab === "brandassets"
                ? "border-b-2 border-gray-800 text-gray-900 font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("brandassets")}
          >
            <FaUser className="text-xl" />
            <span>Brand Assets</span>
          </button>

          <button
            className={`pb-2 flex items-center space-x-2 ${
              activeTab === "holiday"
                ? "border-b-2 border-gray-800 text-gray-900 font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("holiday")}
          >
            <MdOutlineHolidayVillage className="text-xl" />
            <span>Holiday</span>
          </button>
        </div>

        <div className="mt-6 p-6 bg-white rounded-lg">
          {activeTab === "contactDetails" && (
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
              <h1 className="text-xl font-semibold text-gray-900 mb-6">
                Edit Profile
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 font-medium mb-1 block">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="lastName"
                    className="text-sm text-gray-600 font-medium mb-1 block"
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
                    className="mt-1 p-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                  />
                </div>

                {/* Email */}
                {/* <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="text-sm text-gray-600 font-medium mb-1 block"
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
                    className="mt-1 p-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                  />
                </div> */}

                {/* Address */}
                <div className="flex flex-col">
                  <label
                    htmlFor="address"
                    className="text-sm text-gray-600 font-medium mb-1 block"
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
                    className="mt-1 p-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 font-medium mb-1 block">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 bg-gray-200 border rounded-md"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 font-medium mb-1 block">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 bg-gray-200 border rounded-md"
                  />
                </div>
                {/* <div className="flex flex-col">
                  <label className="text-sm text-gray-600 font-medium mb-1 block">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 border rounded-md"
                  />
                </div> */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 font-medium mb-1 block">
                    Zip *
                  </label>
                  <input
                    type="number"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 bg-gray-200 border rounded-md"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 font-medium mb-1 block">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 bg-gray-200 border rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="sellerGst"
                    className="text-sm text-gray-600 font-medium mb-1 block"
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
                    className="mt-1 p-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="gstRegistered"
                    className="text-sm text-gray-600 font-medium mb-1 block"
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
                    className="mt-1 p-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="dispatchAddress"
                    className="text-sm text-gray-600 font-medium mb-1 block"
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
                    className="mt-1 p-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="dispatchCity"
                    className="text-sm text-gray-600 font-medium mb-1 block"
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
                    className="mt-1 p-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="dispatchCountry"
                    className="text-sm text-gray-600 font-medium mb-1 block"
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
                    className="mt-1 p-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                  />
                </div>

                {/* <div className="flex flex-col">
                  <label
                    htmlFor="dispatchzip"
                    className="text-sm text-gray-600 font-medium mb-1 block"
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
                    className="mt-1 p-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800"
                  />
                </div> */}
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSubmit}
                  className="bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {activeTab === "brandassets" && (
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm border border-gray-200 space-y-8 ">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 mb-1">
                    Your Collection
                  </h1>
                  <a
                    href={`https://www.aydiactive.com/collections/${sellerName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-700 hover:underline hover:text-gray-600"
                  >
                    seller profile
                  </a>
                </div>

                <button
                  className="bg-[#18181b] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
                  onClick={handleSubmit2}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Collection"}
                </button>
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium mb-1 block">
                  Collection Title *
                </label>
                <input
                  type="text"
                  value={collectionTitle}
                  onChange={(e) => setCollectionTitle(e.target.value)}
                  placeholder="Enter collection title"
                  className="w-full border border-gray-300 text-gray-600 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>
              <div className="rounded-lg border border-gray-200 bg-white shadow-inner p-6">
                <p className="text-sm text-gray-600 mb-2">
                  Upload a banner image for your collection (Max 5MB, .jpg/.jpeg
                  only)
                </p>
                <p className="text-sm text-gray-600 mb-4">
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
                    <span className="text-gray-600 font-medium">
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

              <div>
                <label className="text-sm text-gray-600 font-medium mb-1 block">
                  Description{" "}
                  <span className="text-gray-500">(160–900 characters)</span>
                </label>
                <textarea
                  className="w-full border border-gray-300 text-gray-600 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                  rows="4"
                  placeholder="Describe your collection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="bg-white p-5 border border-gray-200 rounded-lg">
                <h1 className="text-xl font-semibold text-gray-900 mb-0.5">
                  Where your photo appears
                </h1>
                <ul className="list-disc text-sm text-gray-600 space-y-1 pl-5">
                  <li>On the business profile page</li>
                  <li>In your collection ads (if applicable)</li>
                  <li>On premium job search results</li>
                </ul>
              </div>

              {message && (
                <p className="text-center text-sm font-medium text-green-600">
                  {message}
                </p>
              )}
            </div>
          )}

          {activeTab === "holiday" && (
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm border border-gray-200 space-y-8 ">
              <h1 className="text-xl font-semibold text-gray-900 mb-0.5">
                Holiday Mode Settings
              </h1>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                While holiday mode is on, all your products will be hidden, but
                you can still access and fulfill existing orders. <br />
                <span className="font-medium">Note:</span> Your start and end
                dates are
                <strong> inclusive</strong>.
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

              {/* <div className="mt-6 bg-gray-200 border border-gray-200 rounded-lg shadow-sm p-5">
                <div className="flex items-center gap-4 mb-4">
                  <label className="w-28 flex items-center text-sm font-semibold text-gray-600">
                    <CiCalendarDate className="mr-1 text-lg" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="flex-1 p-2 border border-gray-300 rounded-md text-sm text-gray-800 bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <label className="w-28 flex items-center text-sm font-semibold text-gray-600">
                    <CiCalendarDate className="mr-1 text-lg" />
                    End Date
                  </label>
                  <input
                    type="date"
                    className="flex-1 p-2 border border-gray-300 rounded-md text-sm text-gray-800 bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
