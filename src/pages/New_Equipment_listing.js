import React, { useState } from 'react';

const AddNewEquipmentForm = () => {
  // State hooks for form fields
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [sale_price, setSalePrice] = useState('');
  const [equipment_type, setEquipmentType] = useState('');
  const [certification, setCertification] = useState('');
  const [year_manufactured, setYearManufactured] = useState('');
  const [warranty, setWarranty] = useState('');
  const [shipping, setShipping] = useState('');
  const [training, setTraining] = useState('');
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true); // Set loading to true

    // Create a new FormData object
    const formData = new FormData();
  
    // Append the image file if it exists
    if (image) {
      formData.append('image', image);  // Adjust 'file' to the expected form field name for the file
    }
  
    // Append other fields
    formData.append('location', location);
    formData.append('name', name);
    formData.append('brand', brand);
    formData.append('sale_price', sale_price);
    formData.append('equipment_type', equipment_type);
    formData.append('certification', certification);
    formData.append('year_manufactured', year_manufactured);
    formData.append('warranty', warranty);
    formData.append('shipping', shipping);
    formData.append('training', training);

    try {
      const response = await fetch("https://medspaa.vercel.app/product/addNewEquipments", {
        method: "POST",
        body: formData
      });
  
      const json = await response.json();
  
      if (response.ok) {
        setSuccess(json.message);
        setError('');
        // Clear form fields
        setLocation('');
        setBrand('');
        setName('');
        setEquipmentType('');
        setCertification('');
        setShipping('');
        setTraining('');
        setYearManufactured('');
        setSalePrice('');
        setWarranty('');
        setImage(null); // Clear the image file
        e.target.reset();
      } else {
        setSuccess('');
        setError(json.error);
      }
    } catch (error) {
      setSuccess('');
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false); // Set loading to false after operation completes
    }
  };
  
  // Handler for image file change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <main className="flex items-center justify-center bg-gray-100 p-10 max-sm:p-5">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg border shadow-lg border-blue-500">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Add New Equipment Listing</h1>

        {/* Show error and success messages */}
        <div className="mb-4">
          {error && <div className="text-red-500 dark:text-red-400">{error}</div>}
          {success && <div className="text-green-500 dark:text-green-400">{success}</div>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div className="flex flex-col">
              <label htmlFor="location" className="text-gray-700 text-sm font-medium mb-1">Location *</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {/* Equipment Name */}
            <div className="flex flex-col">
              <label htmlFor="name" className="text-gray-700 text-sm font-medium mb-1">Equipment Name *</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {/* Brand Name */}
            <div className="flex flex-col">
              <label htmlFor="brand" className="text-gray-700 text-sm font-medium mb-1">Brand Name</label>
              <input
                type="text"
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Sale Price */}
            <div className="flex flex-col">
              <label htmlFor="sale_price" className="text-gray-700 text-sm font-medium mb-1">Sale Price *</label>
              <input
                type="number"
                id="sale_price"
                min={0}
                value={sale_price}
                onChange={(e) => setSalePrice(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {/* Equipment Type */}
            <div className="flex flex-col">
              <label htmlFor="equipment_type" className="text-gray-700 text-sm font-medium mb-1">Equipment Type *</label>
              <select
                id="equipment_type"
                name="equipment_type"
                value={equipment_type}
                onChange={(e) => setEquipmentType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              >
                <option value="">Select a type</option>
                <option value="Skin care">Skin Care</option>
                <option value="Body shaping">Body Shaping</option>
                <option value="Laser Hair removal">Laser Hair Removal</option>
                <option value="Laser skin care">Laser Skin Care</option>
                <option value="Laser tattoo removal">Laser Tattoo Removal</option>
                <option value="Lab equipment">Lab Equipment</option>
                <option value="Other aesthetic device">Other Aesthetic Device</option>
                <option value="Other Medical device">Other Medical Device</option>
                <option value="Furniture">Furniture</option>
                <option value="Small tools">Small Tools</option>
              </select>
            </div>

            {/* Certification */}
            <div className="flex flex-col">
              <label htmlFor="certification" className="text-gray-700 text-sm font-medium mb-1">Certification *</label>
              <select
                id="certification"
                name="certification"
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              >
                <option value="">Select an option</option>
                <option value="FDA Approved">FDA Approved</option>
                <option value="FDA Registered">FDA Registered</option>
                <option value="No FDA Certification">No FDA Certification</option>
              </select>
            </div>

            {/* Year Manufactured */}
            <div className="flex flex-col">
              <label htmlFor="year_manufactured" className="text-gray-700 text-sm font-medium mb-1">Year Manufactured *</label>
              <input
                type="number"
                id="year_manufactured"
                min={0}
                value={year_manufactured}
                onChange={(e) => setYearManufactured(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {/* Warranty */}
            <div className="flex flex-col">
              <label htmlFor="warranty" className="text-gray-700 text-sm font-medium mb-1">Warranty *</label>
              <input
                type="number"
                min={0}
                id="warranty"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {/* Shipping */}
            <div className="flex flex-col">
              <label htmlFor="shipping" className="text-gray-700 text-sm font-medium mb-1">Shipping *</label>
              <input
                type="text"
                id="shipping"
                value={shipping}
                onChange={(e) => setShipping(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {/* Training */}
            <div className="flex flex-col">
              <label htmlFor="training" className="text-gray-700 text-sm font-medium mb-1">Training *</label>
              <input
                type="text"
                id="training"
                value={training}
                onChange={(e) => setTraining(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col">
              <label htmlFor="image" className="text-gray-700 text-sm font-medium mb-1">Image (optional)</label>
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <svg
                  className="w-5 h-5 mr-2 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 1116 0A8 8 0 014 12zm2-1a6 6 0 1012 0A6 6 0 006 11z"
                  ></path>
                </svg>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddNewEquipmentForm;
