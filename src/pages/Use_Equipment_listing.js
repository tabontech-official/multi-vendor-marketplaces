import React, { useState } from 'react';

const Used_EquipmentForm = () => {
  // State hooks for form fields
  const [location, setLocation] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [acceptOffers, setAcceptOffers] = useState('');
  const [equipmentType, setEquipmentType] = useState('');
  const [certification, setCertification] = useState('');
  const [yearPurchased, setYearPurchased] = useState('');
  const [warranty, setWarranty] = useState('');
  const [reasonForSelling, setReasonForSelling] = useState('');
  const [shipping, setShipping] = useState('');
  const [image, setImage] = useState(null); // State for image upload

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({ location, equipmentName, brandName, askingPrice, acceptOffers, equipmentType, certification, yearPurchased, warranty, reasonForSelling, shipping, image });
    // Uncomment the following lines to handle form submission
    // try {
    //   const formData = new FormData();
    //   formData.append('location', location);
    //   formData.append('equipmentName', equipmentName);
    //   formData.append('brandName', brandName);
    //   formData.append('askingPrice', askingPrice);
    //   formData.append('acceptOffers', acceptOffers);
    //   formData.append('equipmentType', equipmentType);
    //   formData.append('certification', certification);
    //   formData.append('yearPurchased', yearPurchased);
    //   formData.append('warranty', warranty);
    //   formData.append('reasonForSelling', reasonForSelling);
    //   formData.append('shipping', shipping);
    //   if (image) {
    //     formData.append('image', image);
    //   }
    //   const response = await fetch('https://your-api-endpoint.com/listing/addList', {
    //     method: 'POST',
    //     body: formData,
    //   });
    //   const json = await response.json();
    //   if (response.ok) {
    //     console.log(json);
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    // }
  };

  return (
    <main className="flex items-center justify-center bg-gray-100 p-10 max-sm:p-5">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg border shadow-lg border-blue-500">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Add Used Equipment Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Details Form */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div className="flex flex-col">
              <label htmlFor="image" className="text-gray-700 text-sm font-medium mb-1">Image</label>
              <input
                type="file"
                id="image"
                onChange={(e) => setImage(e.target.files[0])}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

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
              <label htmlFor="equipmentName" className="text-gray-700 text-sm font-medium mb-1">Equipment Name *</label>
              <input
                type="text"
                id="equipmentName"
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Asking Price */}
            <div className="flex flex-col">
              <label htmlFor="askingPrice" className="text-gray-700 text-sm font-medium mb-1">Asking Price *</label>
              <input
                type="number"
                id="askingPrice"
                min={0}
                value={askingPrice}
                onChange={(e) => setAskingPrice(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {/* Accept Offers */}
            <div className="flex flex-col">
              <label htmlFor="acceptOffers" className="text-gray-700 text-sm font-medium mb-1">Accept Offers *</label>
              <select
                id="acceptOffers"
                name="acceptOffers"
                value={acceptOffers}
                onChange={(e) => setAcceptOffers(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              >
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Equipment Type */}
            <div className="flex flex-col">
              <label htmlFor="equipmentType" className="text-gray-700 text-sm font-medium mb-1">Equipment Type *</label>
              <select
                id="equipmentType"
                name="equipmentType"
                value={equipmentType}
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

            {/* Year Purchased */}
            <div className="flex flex-col">
              <label htmlFor="yearPurchased" className="text-gray-700 text-sm font-medium mb-1">Year Purchased *</label>
              <input
                type="number"
                id="yearPurchased"
                min={0}
                value={yearPurchased}
                onChange={(e) => setYearPurchased(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {/* Warranty */}
            <div className="flex flex-col">
              <label htmlFor="warranty" className="text-gray-700 text-sm font-medium mb-1">Warranty *</label>
              <select
                id="warranty"
                name="warranty"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              >
                <option value="">Select an option</option>
                <option value="No warranty, as it is">No Warranty, As It Is</option>
                <option value="Still under manufacturer warranty">Still Under Manufacturer Warranty</option>
                <option value="6 month warranty">6 Month Warranty</option>
              </select>
            </div>

            {/* Reason for Selling */}
            <div className="flex flex-col">
              <label htmlFor="reasonForSelling" className="text-gray-700 text-sm font-medium mb-1">Reason for Selling *</label>
              <textarea
                id="reasonForSelling"
                value={reasonForSelling}
                onChange={(e) => setReasonForSelling(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              >
                <option value="">Select an option</option>
                <option value="available at cost">Available At Cost</option>
                <option value="free shipping">Free Shipping</option>
                <option value="pick up only">Pick Up Only</option>
              </select>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
           
          
            <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
            Add Listing
</button>
            
          </div>
        </form>
      </div>
    </main>
  );
};

export default Used_EquipmentForm;
