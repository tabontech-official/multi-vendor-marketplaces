// src/AddEquipmentForm.js
import React, { useState } from 'react';

const AddNewEquipmentForm = () => {
  // State hooks for form fields
  const [location, setLocation] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [equipmentType, setEquipmentType] = useState('');
  const [certification, setCertification] = useState('');
  const [yearManufactured, setYearManufactured] = useState('');
  const [yearsWarranty, setYearsWarranty] = useState('');
  const [shipping, setShipping] = useState('');
  const [training, setTraining] = useState('');

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically handle form submission logic
    console.log({ location, equipmentName, brandName, salePrice, equipmentType, certification, yearManufactured, yearsWarranty, shipping, training });
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg border shadow-lg border-blue-500">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Add New Equipment Listing</h1>

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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Equipment Name */}
            <div className="flex flex-col">
              <label htmlFor="equipmentName" className="text-gray-700 text-sm font-medium mb-1">Equipment Name *</label>
              <input
                type="text"
                id="equipmentName"
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Brand Name */}
            <div className="flex flex-col">
              <label htmlFor="brandName" className="text-gray-700 text-sm font-medium mb-1">Brand Name</label>
              <input
                type="text"
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            {/* Sale Price */}
            <div className="flex flex-col">
              <label htmlFor="salePrice" className="text-gray-700 text-sm font-medium mb-1">Sale Price *</label>
              <input
                type="number"
                id="salePrice"
                min={0}
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Equipment Type */}
            <div className="flex flex-col">
              <label htmlFor="equipmentType" className="text-gray-700 text-sm font-medium mb-1">Equipment Type *</label>
              <select
                id="equipmentType"
                name="equipmentType"
                value={equipmentType}
                onChange={(e) => setEquipmentType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
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
              <label htmlFor="yearManufactured" className="text-gray-700 text-sm font-medium mb-1">Year Manufactured *</label>
              <input
                type="number"
                id="yearManufactured"
                min={0}
                value={yearManufactured}
                onChange={(e) => setYearManufactured(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Years Warranty */}
            <div className="flex flex-col">
              <label htmlFor="yearsWarranty" className="text-gray-700 text-sm font-medium mb-1">Years Warranty *</label>
              <input
                type="number"
                min={0}
                id="yearsWarranty"
                value={yearsWarranty}
                onChange={(e) => setYearsWarranty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Shipping */}
            <div className="flex flex-col">
              <label htmlFor="shipping" className="text-gray-700 text-sm font-medium mb-1">Shipping *</label>
              <select
                id="shipping"
                name="shipping"
                value={shipping}
                onChange={(e) => setShipping(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              >
                <option value="">Select an option</option>
                <option value="Free">Free</option>
                <option value="at cost">At Cost</option>
                <option value="pick up available">Pick Up Available</option>
              </select>
            </div>

            {/* Training */}
            <div className="flex flex-col">
              <label htmlFor="training" className="text-gray-700 text-sm font-medium mb-1">Training *</label>
              <select
                id="training"
                name="training"
                value={training}
                onChange={(e) => setTraining(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              >
                <option value="">Select an option</option>
                <option value="Available on site">Available On Site</option>
                <option value="video training">Video Training</option>
                <option value="No training">No Training</option>
              </select>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
              type="submit"
            >
              Add Equipment Listing
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddNewEquipmentForm;
