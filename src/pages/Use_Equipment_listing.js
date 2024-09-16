import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor';
import { convertToRaw, EditorState } from "draft-js";

const PostEquipmentForm = () => {
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
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);
  const [description , setText] = useState("")
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const currentText = newEditorState.getCurrentContent().getPlainText("\u0001");
    setText(currentText);
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const id = localStorage.getItem('userid')

    const formData = new FormData();
  
    if (image) {
      formData.append('image', image);
    }

    formData.append('location', location);
    formData.append('name', equipmentName);
    formData.append('brand', brandName);
    formData.append('asking_price', askingPrice);
    formData.append('accept_Offers', acceptOffers);
    formData.append('equipment_type', equipmentType);
    formData.append('certification', certification);
    formData.append('year_purchased', yearPurchased);
    formData.append('warranty', warranty);
    formData.append('reason_for_selling', reasonForSelling);
    formData.append('shipping', shipping);
    formData.append('description', description)
    formData.append('userId',id)

    try {
      const response = await fetch("https://medspaa.vercel.app/product/addEquipment", {
        method: "POST",
        body: formData
      });

      const json = await response.json();

      if (response.ok) {
        setSuccess(json.message);
        setError('');
      } else {
        setSuccess('');
        setError(json.error);
      }
    } catch (error) {
      setSuccess('');
      setError('An unexpected error occurred.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Handler for image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageName(file.name);
    setShowRemoveOption(true); // Show remove option when an image is selected
  };

  // Handler to remove image
  const handleRemoveImage = () => {
    setImage(null);
    setImageName('');
    setShowRemoveOption(false);
  };

  return (
    <main className="bg-gray-100 min-h-screen p-8 flex-row">
      <h1 className="text-4xl font-bold mb-4">Add Used Equipment Listing </h1>
      <p className="text-lg mb-8 text-gray-700">Use this form to list your Used equipment.</p>
      <div className="mb-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </div>
      <div className="flex flex-col lg:flex-row flex-1">
        
        <div className="flex-1 bg-white px-8 py-4 shadow-md lg:mr-8 mb-8 lg:mb-0">
          <h1 className='text-2xl font-semibold mb-4'>Equipment Details</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              
              <div className="flex flex-col">
                <label htmlFor="location" className="text-gray-700 text-sm font-medium mb-1">Location *</label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="equipmentName" className="text-gray-700 text-sm font-medium mb-1">Equipment Name *</label>
                <input
                  type="text"
                  id="equipmentName"
                  value={equipmentName}
                  onChange={(e) => setEquipmentName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div className='mb-4'>
               <RTC  name={"Description"}
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                />
           </div>
            

              <div className="flex flex-col mt-4">
                <label htmlFor="brandName" className="text-gray-700 text-sm font-medium mb-1">Brand Name *</label>
                <input
                  type="text"
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="askingPrice" className="text-gray-700 text-sm font-medium mb-1">Asking Price $ *</label>
                <input
                  type="number"
                  id="askingPrice"
                  min={0}
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="acceptOffers" className="text-gray-700 text-sm font-medium mb-1">Accept Offers *</label>
                <input
                  type="text"
                  id="acceptOffers"
                  value={acceptOffers}
                  onChange={(e) => setAcceptOffers(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="equipmentType" className="text-gray-700 text-sm font-medium mb-1">Equipment Type *</label>
                <select
                  id="equipmentType"
                  value={equipmentType}
                  onChange={(e) => setEquipmentType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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

              <div className="flex flex-col">
                <label htmlFor="certification" className="text-gray-700 text-sm font-medium mb-1">Certification *</label>
                <select
                  id="certification"
                  value={certification}
                  onChange={(e) => setCertification(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select certification</option>
                  <option value="CE Certification">CE Certification</option>
                  <option value="FDA Certification">FDA Certification</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="yearPurchased" className="text-gray-700 text-sm font-medium mb-1">Year Purchased *</label>
                <input
                  type="number"
                  id="yearPurchased"
                  min={0}
                  value={yearPurchased}
                  onChange={(e) => setYearPurchased(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="warranty" className="text-gray-700 text-sm font-medium mb-1">Warranty *</label>
                <select
                  id="warranty"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select a warranty</option>
                  <option value="No warranty, as it is">No warranty, as it is</option>
                  <option value="Still under manufacturer warranty">Still under manufacturer warranty</option>
                  <option value="6 month warranty">6 month warranty</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="reasonForSelling" className="text-gray-700 text-sm font-medium mb-1">Reason for Selling *</label>
                <select
                  id="reasonForSelling"
                  value={reasonForSelling}
                  onChange={(e) => setReasonForSelling(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select reason</option>
                  <option value="Upgrading">Upgrading</option>
                  <option value="No longer needed">No longer needed</option>
                  <option value="Business closure">Business closure</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="shipping" className="text-gray-700 text-sm font-medium mb-1">Shipping *</label>
                <select
                  id="shipping"
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select shipping option</option>
                  <option value="available at cost">Available at cost</option>
                  <option value="free shipping">Free shipping</option>
                  <option value="pick up only">Pick up only</option>
                </select>
              </div>

            </div>
          </form>
        </div>

        <div className="lg:w-1/3 lg:pl-8 flex-1">
          <h2 className="text-2xl font-semibold mb-4">Equipment Image</h2>
          <p className="text-gray-600 mb-4">
            Upload an image of the equipment. Recommended size: 1024x1024 and less than 15MB.
          </p>
          <div className="bg-gray-50 p-4 border border-gray-300 mb-4">
            <p className="text-sm text-gray-500 mb-2">Example: equipment.png</p>

            {/* Image Preview */}
            {image ? (
              <div className="flex items-center mb-4">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="border border-gray-300 w-24 h-24 object-cover"
                />
                <div className="ml-4 flex flex-1 items-center">
                  <p className="text-sm text-gray-700 flex-1">{imageName}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRemoveOption(!showRemoveOption);
                    }}
                    className="text-gray-500 hover:text-gray-700 text-3xl"
                  >
                    &#8230;
                  </button>
                  {showRemoveOption && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-red-500 hover:text-red-700 text-sm ml-4"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center mb-4">
                <img
                  src={"https://sp-seller.webkul.com/img/No-Image/No-Image-140x140.png"}
                  alt="Preview"
                  className="border border-gray-300 w-24 h-24 object-cover"
                />
                <div className="ml-4 flex flex-1 items-center">
                  <p className="text-sm text-gray-700 flex-1">{imageName}</p>
                </div>
              </div>
            )}
            
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="py-2 px-4"
            />
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-500 my-4" />
      <div className="mt-8">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded flex items-center"
          disabled={loading}
        >
          {loading && (
            <svg
              className="w-5 h-5 mr-3 text-white animate-spin"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4h-4z"
              />
            </svg>
          )}
          {loading ? 'Submitting...' : 'Post Equipment'}
        </button>
      </div>
    </main>
  );
};

export default PostEquipmentForm;
