import React, { useEffect, useState } from 'react';
import { HiCamera } from 'react-icons/hi';
import { FaTimes } from 'react-icons/fa'; // Import the close icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const AccountPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    zip: '',
    country: '',
    city: '',
    profileImage: 'https://sp-seller.webkul.com/img/store_logo/icon-user.png',
  });
  const [imageFile, setImageFile] = useState(null); // State for storing selected image file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState('');
  const [success, setSuccess] = useState('');
  const [agreedToPolicies, setAgreedToPolicies] = useState(false); // New state for policy agreement

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      const id = localStorage.getItem('userid');

      if (!id) {
        console.error('User ID not found in localStorage.');
        setError('User ID not found.');
        return;
      }

      try {
        const response = await fetch(`https://medspaa.vercel.app/auth/user/${id}`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setInfo(data);
          if (isMounted) {
            setFormData({
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              email: data.email || '',
              password: data.password || '',
              phone: data.phoneNumber || '',
              address: data.address || '',
              zip: data.zip || '',
              country: data.country || '',
              city: data.city || '',
              profileImage: data.avatar[0] || 'https://sp-seller.webkul.com/img/store_logo/icon-user.png',
            });
          }
        } else {
          console.error('Failed to fetch user data. Status:', response.status);
          setError(`Failed to fetch user data. Status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data.');
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

    const userId = localStorage.getItem('userid');
    if (!userId) {
      console.error('User ID not found in localStorage.');
      setLoading(false);
      return;
    }

    form.append('firstName', formData.firstName);
    form.append('lastName', formData.lastName);
    form.append('email', formData.email);
    form.append('password', formData.password);
    form.append('phoneNumber', formData.phone);
    form.append('address', formData.address);
    form.append('zip', formData.zip);
    form.append('country', formData.country);
    form.append('city', formData.city);

    // Append image file if it exists
    if (imageFile) {
      form.append('images', imageFile); // Ensure the correct file is sent
    }

    try {
      const response = await fetch(`https://medspaa.vercel.app/auth/editProfile/${userId}`, {
        method: 'PUT',
        body: form,
      });

      if (response.ok) {
        const responseData = await response.json();
        setSuccess("Profile Updated");
      } else {
        console.error('Failed to update profile. Status:', response.status);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full p-8 flex justify-center items-center bg-gray-100 mt-10">
      <div className="w-full max-w-lg bg-white border border-blue-500 shadow-lg p-6 relative">
        {/* Close Icon */}
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
          aria-label="Close"
        >
          <FaTimes className="w-6 h-6 text-red-600" />
        </button>

        <div className="mb-4">
          {success && <div className="text-green-500 text-lg font-semibold">{success}</div>}
        </div>
        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">Account Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={formData.profileImage}
                alt="Profile"
                className="w-40 h-32 rounded-full object-cover border-2 border-blue-500"
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
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Policy Agreement Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="policyAgreement"
              name="policyAgreement"
              checked={agreedToPolicies}
              onChange={(e) => setAgreedToPolicies(e.target.checked)}
              className="h-5 w-5 text-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="policyAgreement" className="text-sm font-medium text-gray-700">
              I agree with the{' '}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate('/policy')}
              >
                policies and terms
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-md shadow hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? 'Loading...' : 'Save Changes'}
          </button>

          {error && <div className="text-red-500">{error}</div>}
        </form>
      </div>
    </main>
  );
};

export default AccountPage;
