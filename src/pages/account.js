import React, { useState } from 'react';
import { HiCamera } from 'react-icons/hi'; // Import the camera icon for profile image upload

const AccountPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    address: '',
    zip: '',
    country: '',
    city: '',
    profileImage: 'https://shopify-digital-delivery.s3.amazonaws.com/shop_logo/59235/vRlqYxKteX848.png'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, profileImage: URL.createObjectURL(e.target.files[0]) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <main className="w-full p-8 flex justify-center items-center bg-gray-100 mt-10">
      <div className="w-full max-w-lg bg-white border border-blue-500 shadow-lg  p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">Account Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={formData.profileImage || 'https://via.placeholder.com/150'}
                alt="Profile"
                className=" w-40 h-32 rounded-full object-cover border-2  border-blue-500"
              />
              <label htmlFor="profileImage" className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 transition">
                <HiCamera className="w-6 h-6" />
                <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Profile Image</h2>
              <p className="text-gray-600">Click the icon to upload or change your profile image.</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['email', 'password', 'phone', 'address', 'zip', 'country', 'city'].map((field) => (
              <div key={field} className="flex flex-col">
                <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">{field.replace(/^\w/, c => c.toUpperCase())}</label>
                <input
                  type={field === 'password' ? 'password' : 'text'}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AccountPage;
