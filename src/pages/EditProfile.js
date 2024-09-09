// src/EditProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    email: '',
    password: '',
    zip: '',
    country: '',
    city: '',
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    // Fetch initial profile data
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/metafield');
        setProfile(response.data);
        if (response.data.profileImage) {
          setImagePreview(response.data.profileImage);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;
    if (type === 'file') {
      setProfile((prev) => ({
        ...prev,
        profileImage: files[0],
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setProfile((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in profile) {
      formData.append(key, profile[key]);
    }

    try {
      const response = await axios.put('http://localhost:5000/auth/metafield', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
      console.error('Update error:', error);
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={profile.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={profile.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={profile.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={profile.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={profile.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="zip">ZIP:</label>
          <input
            type="text"
            id="zip"
            value={profile.zip}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            value={profile.country}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            value={profile.city}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="profileImage">Profile Image:</label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleChange}
          />
          {imagePreview && (
            <div>
              <img
                src={imagePreview}
                alt="Profile Preview"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;
