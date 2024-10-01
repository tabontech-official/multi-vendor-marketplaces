import React, { useEffect, useState } from 'react';
import { HiCamera } from 'react-icons/hi';
import { FaTimes } from 'react-icons/fa'; // Import the close icon
import { useNavigate } from 'react-router-dom'; // Import useHistory for navigation
const AccountPage = () => {
  const navigate = useNavigate(); // Initialize useHistory hook
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    address: '',
    zip: '',
    country: '',
    city: '',
    profileImage: 'https://sp-seller.webkul.com/img/store_logo/icon-user.png',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState('');
  const [success, setSuccess] = useState('');

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
          console.log(data)
          setInfo(data);
          if (isMounted) {
            setFormData({
              email: data.email || '',
              password: data.password || '',
              phone: data.phone || '',
              address: data.address || '',
              zip: data.zip || '',
              country: data.country || '',
              city: data.city || '',
              profileImage: data.profileImage || 'https://sp-seller.webkul.com/img/store_logo/icon-user.png',
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
    setFormData({ ...formData, profileImage: URL.createObjectURL(e.target.files[0]) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userId = localStorage.getItem('userid');
    if (!userId) {
      console.error('User ID not found in localStorage.');
      setLoading(false);
      return;
    }

    const data = {
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      zip: formData.zip,
      country: formData.country,
      city: formData.city,
    };

    try {
      const response = await fetch(`https://medspaa.vercel.app/auth/editProfile/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setSuccess(responseData.message);
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
            {['email', 'password', 'phone', 'address', 'zip', 'country', 'city'].map((field) => (
              <div key={field} className="flex flex-col">
                <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">{field.replace(/^\w/, c => c.toUpperCase())}</label>
                <input
                  type={field === 'zip' ? 'number' : field === 'password' ? 'password' : 'text'}
                  id={field}
                  value={formData[field]}
                  name={field}
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
              className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Loading...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AccountPage;
