import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { TiUserAdd } from "react-icons/ti";
import { FaArrowRight } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { MdManageAccounts } from "react-icons/md";
import { Link } from "react-router-dom";
const AccountsNavbar = () => {
  const [selectedModule, setSelectedModule] = useState("Manage User");
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
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState("");
  const [success, setSuccess] = useState("");
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);
  const [activeTab, setActiveTab] = useState("contactDetails");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToPolicies) {
      alert("Please agree to the policies before proceeding.");
      return;
    }

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

  const [role, setRole] = useState("");
  const [userRole, setUserRole] = useState(null);
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
  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  const [selectedModules, setSelectedModules] = useState([]);
  const handleModuleSelection = (moduleName) => {
    setSelectedModules((prev) =>
      prev.includes(moduleName)
        ? prev.filter((m) => m !== moduleName)
        : [...prev, moduleName]
    );
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    <div>
      <aside className="w-52 mt-2 mb-2 ml-2 rounded-r-2xl bg-blue-900 p-6 flex flex-col justify-between min-h-screen ">
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
            <button
              onClick={() => {
                setSelectedModule("Manage User");
              }}
              className={`w-full text-left flex items-center space-x-3 ${
                selectedModule === "Manage User"
                  ? "text-yellow-400"
                  : "text-blue-300"
              } hover:text-yellow-400`}
            >
              <span className="w-6 h-6 bg-blue-700 flex items-center justify-center rounded-md">
                <MdManageAccounts />
              </span>

              <Link to="/MANAGE_USER">
                <span className="text-sm">Manage User</span>
              </Link>
            </button>
{/* 
            <button
              onClick={() => {
                setSelectedModule("Add User");
                togglePopup();
              }}
              className={`w-full text-left flex items-center space-x-3 ${
                selectedModule === "Add User"
                  ? "text-yellow-400"
                  : "text-blue-300"
              } hover:text-yellow-400`}
            >
              <span className="w-6 h-6 bg-blue-700 flex items-center justify-center rounded-md">
                <TiUserAdd />
              </span>
              <span className="text-sm">Add User</span>
            </button> */}

            <button
              onClick={() => setSelectedModule("Settings")}
              className={`w-full text-left flex items-center space-x-3 ${
                selectedModule === "Settings"
                  ? "text-yellow-400"
                  : "text-blue-300"
              } hover:text-yellow-400`}
            >
              <span className="w-6 h-6 bg-blue-700 flex items-center justify-center rounded-md">
                <IoSettings />
              </span>
              <Link to="/edit-account">
              <span className="text-sm">Settings</span>
              </Link>
              
            </button>
          </nav>
        </div>

        <button className="w-full py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600">
          Promote
        </button>
      </aside>
      {/* Popup */}
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
    </div>
  );
};

export default AccountsNavbar;
