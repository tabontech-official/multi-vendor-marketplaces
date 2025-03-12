import React, { useEffect, useState } from "react";
import { HiCamera } from "react-icons/hi";
import { FaTimes } from "react-icons/fa"; // Import the close icon
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { FaUser, FaBars, FaArrowLeft } from "react-icons/fa";

const AccountPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
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
  const [imageFile, setImageFile] = useState(null); // State for storing selected image file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState("");
  const [success, setSuccess] = useState("");
  const [agreedToPolicies, setAgreedToPolicies] = useState(false); // New state for policy agreement

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
          `https://multi-vendor-marketplace.vercel.app/auth/user/${id}`,
          {
            method: "GET",
          }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the selected file
      setFormData({ ...formData, profileImage: URL.createObjectURL(file) }); // Update the profile image preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToPolicies) {
      alert("Please agree to the policies before proceeding.");
      return;
    }

    const form = new FormData(); // Create a new FormData instance

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

    // Append image file if it exists
    if (imageFile) {
      form.append("images", imageFile); // Ensure the correct file is sent
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

  return (
    <div className="flex bg-gray-100 min-h-screen text-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-300 p-6 mt-2 mb-2 ml-2 rounded-r-xl flex flex-col justify-between">
        <div>
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <FaUser className="text-yellow-400 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Business Account</h2>
              <p className="text-sm text-gray-400">Profile is 75% complete</p>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="mt-6 space-y-4">
            <button className="w-full text-left flex items-center space-x-3 text-gray-300 hover:text-yellow-400">
              <span className="w-6 h-6 bg-gray-800 flex items-center justify-center rounded-md">
                <FaBars />
              </span>
              <span>Home</span>
            </button>
            <button className="w-full text-left flex items-center space-x-3 text-gray-300 hover:text-yellow-400">
              <span className="w-6 h-6 bg-gray-800 flex items-center justify-center rounded-md">
                <FaBars />
              </span>
              <span>Partner Program</span>
            </button>
            <button className="w-full text-left flex items-center space-x-3 text-gray-300 hover:text-yellow-400">
              <span className="w-6 h-6 bg-gray-800 flex items-center justify-center rounded-md">
                <FaBars />
              </span>
              <span>Wishlist</span>
            </button>
            <button className="w-full text-left flex items-center space-x-3 text-yellow-400">
              <span className="w-6 h-6 bg-gray-800 flex items-center justify-center rounded-md">
                <FaBars />
              </span>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Promote Button */}
        <button className="w-full py-2 bg-yellow-500 text-black font-semibold rounded-md">
          Promote
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Back Button */}
        <button className="flex items-center text-black hover:text-gray-200 mb-4">
          <FaArrowLeft className="mr-2" /> Back
        </button>

        {/* Account Settings Header */}
        <h1 className="text-2xl font-semibold text-gray-600">Account Settings</h1>

        {/* Tabs */}
        <div className="flex justify-between border-b border-gray-700 mt-4 text-gray-400">
          <button className="pb-2 text-blue-600 w-60 border-b-2 border-blue-600">
            Contact details
          </button>
          <button className="pb-2 text-gray-600 hover:text-gray-800">Profile details</button>
          <button className="pb-2 text-gray-600 hover:text-gray-800">Profile Reviews</button>
          <button className="pb-2 text-gray-600 hover:text-gray-800">Opening hours</button>
        </div>

        {/* Form Section */}
        <div className="bg-gray-300 p-6 rounded-lg mt-6">
          <h2 className="text-lg font-semibold text-gray-600">Edit Profile</h2>

          {/* Account Status Toggle */}
          <div className="flex items-center space-x-4 mt-4">
            <p className="text-sm text-gray-600">Account Status</p>
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-lg ${
                  formData.accountStatus === "Private"
                    ? "bg-red-700 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
                onClick={() =>
                  setFormData({ ...formData, accountStatus: "Private" })
                }
              >
                Private
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  formData.accountStatus === "Business"
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-800 text-gray-400"
                }`}
                onClick={() =>
                  setFormData({ ...formData, accountStatus: "Business" })
                }
              >
                Business
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name Field */}
            <div className="flex flex-col">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
              />
            </div>

            {/* Last Name Field */}
            <div className="flex flex-col">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
              />
            </div>

         

            {/* Phone Field */}
            <div className="flex flex-col">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone *</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
              />
            </div>

            {/* Address Field */}
            <div className="flex flex-col">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
              />
            </div>

            {/* Zip Code Field */}
            <div className="flex flex-col">
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700">Zip *</label>
              <input
                type="number"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
              />
            </div>

            {/* Country Field */}
            <div className="flex flex-col">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country *</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
              />
            </div>

            {/* City Field */}
            <div className="flex flex-col">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
              />
            </div>
            {/* Seller GST */}

            <div className="flex flex-col">
              <label htmlFor="Seller GST" className="block text-sm font-medium text-gray-700">Seller GST *</label>
              <input
                type="text"
                id="Seller GST"
                name="Seller GST"
                value={formData.sellerGst}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
              />
            </div>

               {/* Seller GST */}

               <div className="flex flex-col">
              <label htmlFor="GST Registered" className="block text-sm font-medium text-gray-700">GST Registered *</label>
              <input
                type="text"
                id="GST Registered"
                name="GST Registered"
                value={formData.gstRegistered}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="GST Registered" className="block text-sm font-medium text-gray-700">Dispatch Address *</label>
              <input
                type="text"
                id="Dispatch Address"
                name="Dispatch Address"
                value={formData.dispatchAddress}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="Dispatch City" className="block text-sm font-medium text-gray-700">Dispatch City *</label>
              <input
                type="text"
                id="Dispatch City"
                name="Dispatch City"
                value={formData.dispatchCity}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="dipatch Country" className="block text-sm font-medium text-gray-700">Dispatch Country *</label>
              <input
                type="text"
                id="dipatch Country"
                name="dipatch Country"
                value={formData.dispatchCountry}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="dispatch Zip" className="block text-sm font-medium text-gray-700">Dispatch Zip *</label>
              <input
                type="text"
                id="dispatch Zip"
                name="dispatch Zip"
                value={formData.dispatchzip}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-md"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600">
              Save
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;
