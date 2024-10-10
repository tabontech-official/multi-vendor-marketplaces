import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor';
import { convertToRaw, EditorState , ContentState } from "draft-js";
import { useLocation } from 'react-router-dom';

const PostEquipmentForm = () => {
  // State hooks for form fields
  const [Location, setLocation] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [acceptOffers, setAcceptOffers] = useState("");
  const [equipmentType, setEquipmentType] = useState('');
  const [certification, setCertification] = useState('');
  const [yearPurchased, setYearPurchased] = useState('');
  const [warranty, setWarranty] = useState('');
  const [reasonForSelling, setReasonForSelling] = useState('');
  const [shipping, setShipping] = useState('');
  const [images, setImages] = useState([]);
  const [imageName, setImageName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);
  const [description, setDescription] = useState("");
  const [editorState, setEditorState] = useState();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false); // New state for editing mode
  const [imagePreviews, setImagePreviews] = useState([]); // Keep previews here
   const [Zip , setZip] = useState("")
  const { product } = location.state || {};
  
console.log(product)
  useEffect(() => {
    if (product) {
      setIsEditing(true);
      setLocation(product.equipment.location);
      setEquipmentName(product.equipment.name);
      setBrandName(product.equipment.brand); // Assuming `brand` is part of the product object
      setAskingPrice(product.equipment.asking_price);
      setAcceptOffers(product.equipment.accept_offers);
      setEquipmentType(product.equipment.equipment_type);
      setCertification(product.equipment.certification);
      setYearPurchased(product.equipment.year_purchased);
      setWarranty(product.equipment.warranty);
      setReasonForSelling(product.equipment.reason_for_selling);
      setShipping(product.equipment.shipping);
      setDescription(product.equipment.description)
     setZip(product.equipment.zip)


      if (typeof description === 'string') {
        // If it's a plain string, convert it to ContentState
        const contentState = ContentState.createFromText(description);
        setEditorState(EditorState.createWithContent(contentState));
      } else if (description) {
        // If it's already a ContentState or something similar, use it directly
        setEditorState(EditorState.createWithContent(convertToRaw(description)));
      } else {
        // Handle case where description is undefined or null
        setEditorState(EditorState.createEmpty());
      }
      
      if (product.images && Array.isArray(product.images)) {
        const existingImages = product.images.map((img) => img.src); // Extract image URLs
        setImagePreviews(existingImages); // Set them as previews
      }
    }
  },[]);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const currentText = newEditorState.getCurrentContent().getPlainText("\u0001");
    setDescription(currentText);
  };

  // Handler for form submission
  const handleSubmit = async (e, status) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const  Id = localStorage.getItem('userid');
  
    const formData = new FormData();


    if(images.length > 0 ){
      images.map((image)=>{
        formData.append('images', image); // Append each file
      })
    }
   
   

    // Append other form fields to FormData
    formData.append('location', Location);
    formData.append('zip', Zip)
    formData.append('name', equipmentName);
    formData.append('brand', brandName);
    formData.append('asking_price', askingPrice);
    formData.append('accept_offers', acceptOffers);
    formData.append('equipment_type', equipmentType);
    formData.append('certification', certification);
    formData.append('year_purchased', parseInt(yearPurchased));
    formData.append('warranty', warranty);
    formData.append('reason_for_selling', reasonForSelling);
    formData.append('shipping', shipping);
    formData.append('description', description);
    formData.append('userId',  Id);
    formData.append('status', status);
     

    try {
      const response = await fetch(isEditing ? `https://medspaa.vercel.app/product/updateListing/${product.id}` : "https://medspaa.vercel.app/product/addEquipment", {
        method: isEditing ? "PUT" : "POST",
        body: formData
      });

      const json = await response.json();

      if (response.ok) {
        setSuccess(status === "active" ? json.message : "Your post drafted successfully");
        console.log(json)
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
    const files = Array.from(e.target.files); // Get all selected files
    setImages(prevImages => [...prevImages, ...files]); // Store file objects
    const newImagePreviews = files.map(file => URL.createObjectURL(file)); // Create object URLs for preview
    setImagePreviews(prevPreviews => [...prevPreviews, ...newImagePreviews]); // Append to the existing previews
  };

  // Handler to remove image
  const handleRemoveImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index)); // Remove image at the specified index
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index)); // Remove preview at the specified index
  };
  return (
    <main className="bg-gray-100 min-h-screen p-8 flex-row">
      <h1 className="text-4xl font-bold mb-4">Add Used Equipment Listing</h1>
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
            

            <div className='flex flex-row '>
              <div className="flex flex-col flex-1 mr-4">
                <label htmlFor="location" className="text-gray-700 text-sm font-medium mb-1">Location STATE *</label>
                <input
                  type="text"
                  id="location"
                  value={Location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm "
                  required
                />
              </div>

              <div className="flex flex-col flex-1 ">
                <label htmlFor="location" className="text-gray-700 text-sm font-medium mb-1">Location ZIP CODE *</label>
                <input
                  type="number"
                  id="location"
                  value={Zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm "
                  required
                />
              </div>
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
                <RTC name={"Description"}
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
                <select
                  id="acceptOffers"
                  value={acceptOffers}
                  onChange={(e) => setAcceptOffers(e.target.value === 'true')}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="true">Yes</option>
                  <option value="false">no</option>
                </select>
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
                  type="date"
                  id="yearPurchased"
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
                  <option value="free shipping">Free shipping</option>
                  <option value="pick up only">Pick up only</option>
                </select>
              </div>

            </div>
          </form>
        </div>

        <div className="lg:w-1/3 lg:pl-8 flex-1">
         
        <div className="bg-gray-50 p-4 border border-gray-300 mb-4">
          <h2 className="text-2xl font-semibold mb-4">Equipment Image</h2>
          <p className="text-gray-600 mb-4">
            Upload an image of the equipment. Recommended size: 1024x1024 and less than 15MB.
          </p>

          {/* Image Preview */}
          {imagePreviews.length > 0 ? (
  imagePreviews.map((image, index) => (
    <div key={index} className="flex items-center mb-4">
      <img
        src={image}
        alt={`Preview ${index}`}
        className="border border-gray-300 w-14 h-14 object-cover"
      />
      <div className="ml-4 flex flex-1 items-center">
        <p className="text-sm text-gray-700 flex-1">Image {index + 1}</p>
        <button
          type="button"
          onClick={() => handleRemoveImage(index)} // Call remove handler with the index
          className="text-red-500 hover:text-red-700 text-sm ml-4"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  ))
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

          <button
            onClick={() => document.getElementById('images').click()}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-4 rounded"
          >
            Upload Image
          </button>
          <input 
                id="images"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
            className="hidden"
          />
        </div>
        <p className="text-sm text-gray-500">
          Note: Image can be uploaded of any dimension but we recommend you upload an image with dimensions of 1024x1024 & its size must be less than 15MB.
        </p>

        </div>
      </div>

      <hr className="border-t border-gray-500 my-4" />
      <div className="mt-8 flex ">
      <button
          type="submit"
          onClick={(e) => handleSubmit(e, 'active')}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 mr-4 border-blue-700 hover:border-blue-500 rounded flex items-center"
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
                d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0z"
              />
            </svg>
          )}
          {isEditing ? "Update" : "Publish"}
        </button>
      {!isEditing ?(
  <button
  type="submit"
  onClick={(e) => handleSubmit(e, 'draft')}
  className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded flex items-center"
>
  Draft
</button>
      ):null
      }
      
      </div>
    </main>
  );
};

export default PostEquipmentForm;
