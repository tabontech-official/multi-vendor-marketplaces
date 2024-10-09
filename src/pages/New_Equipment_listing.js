import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor';
import { convertToRaw, EditorState , ContentState } from "draft-js";
import { useLocation } from 'react-router-dom';

const AddNewEquipmentForm = () => {
  const Location = useLocation();
  const { product } = Location.state || {};
  const [isEdit, setIsEdit] = useState(false);
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
  const [file, setImage] = useState();
  const [imageName, setImageName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);
  const [editorState, setEditorState] = useState();
  const [description, setText] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // Keep previews here
  const [Zip , setZip] = useState("")

  // Use effect to set initial state from product


  useEffect(() => {
    if (product && product.equipment) {
      setIsEdit(true);  // We're editing, not creating

      setLocation(product.equipment.location || '');
      setName(product.title || '');
      setBrand(product.equipment.name || ''); // Assuming brand is same as name
      setSalePrice(product.equipment.sale_price || '');
      setEquipmentType(product.equipment.equipment_type || '');
      setCertification(product.equipment.certification || '');
      setYearManufactured(product.equipment.year_purchased || '');
      setWarranty(product.equipment.warranty || '');
      setShipping(product.equipment.shipping || '');
      setTraining(product.equipment.training || '');
      setYearManufactured(product.equipment.year_manufactured);
      setText(product.equipment.description ||'');
     setZip(product.equipment.zip)
      

      if (product.equipment.description) {
        const contentState = ContentState.createFromText(product.equipment.description);
        setEditorState(EditorState.createWithContent(contentState));
      } else {
        setEditorState(EditorState.createEmpty());
      }
  
      // Preload product images if available
      if (product.images && Array.isArray(product.images)) {
        const existingImages = product.images.map((img) => img.src); // Extract image URLs
        setImagePreviews(existingImages); // Set them as previews
      }
    }
  }, []);
  

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const currentText = newEditorState.getCurrentContent().getPlainText("\u0001");
    setText(currentText);
  };

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (status === "active") {
      setLoading(true);
    }
  
    const id = localStorage.getItem('userid');
    const formData = new FormData();
  
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }
  
    formData.append('location', location);
    formData.append('zip', Zip);

    if(isEdit){
      formData.append('title', name);
    }else{
      formData.append('name', name);
    }
    formData.append('brand', brand);
    formData.append('sale_price', sale_price);
    formData.append('equipment_type', equipment_type);
    formData.append('certification', certification);
    formData.append('year_manufactured', parseInt(year_manufactured));
    formData.append('warranty', warranty);
    formData.append('shipping', shipping);
    formData.append('training', training);
   
      formData.append('description', description);
 
    formData.append('userId', id);
    formData.append('status', status);
  
    try {
      let url = "https://medspaa.vercel.app/product/addNewEquipments";
      let method = "POST";
  
      // If editing, switch to update API
      if (product && product._id) {
        url = `https://medspaa.vercel.app/product/updateListing/${product._id}`;
        method = "PUT";
      }
  
      const response = await fetch(url, {
        method,
        body: formData,
      });
  
      const json = await response.json();
  
      if (response.ok) {
        if (status === "active") {
          setSuccess(json.message);
        } else {
          setSuccess("Your post drafted successfully");
        }
        setError('');
  
        // // Reset the form fields
        // resetFormFields();
      } else {
        setError(json.error);
        setSuccess('');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      setSuccess('');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // const resetFormFields = () => {
  //   setLocation('');
  //   setName('');
  //   setBrand('');
  //   setSalePrice('');
  //   setEquipmentType('');
  //   setCertification('');
  //   setYearManufactured('');
  //   setWarranty('');
  //   setShipping('');
  //   setTraining('');
  //   setText('');
  //   setImages([]);
  //   setImagePreviews([]);
  // };
  // Handler for image file change
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Get all selected files
    setImages(prevImages => [...prevImages, ...files]); // Store file objects
    const newImagePreviews = files.map(file => URL.createObjectURL(file)); // Create object URLs for preview
    setImagePreviews(prevPreviews => [...prevPreviews, ...newImagePreviews]); // Append to the existing previews
  };

  // Handler to remove image
  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Remove from images
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index)); // Remove preview
  };
  
  return (
    <main className="bg-gray-100 min-h-screen p-8 flex-row">
      <h1 className="text-4xl font-bold mb-4">Add New Equipment Listing</h1>
      <p className="text-lg mb-8 text-gray-700">Here you can add products to your store.</p>
      <div className="mb-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </div>
      <div className="flex flex-col lg:flex-row flex-1">
        <div className="flex-1 bg-white px-8 py-4 shadow-md lg:mr-8 mb-8 lg:mb-0">
          <h1 className='text-2xl font-semibold mb-4'>Product Details</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">


               <div className='flex flex-row '>
              <div className="flex flex-col flex-1 mr-4">
                <label htmlFor="location" className="text-gray-700 text-sm font-medium mb-1">Location STATE *</label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm "
                  required
                />
              </div>

              <div className="flex flex-col flex-1 ">
                <label htmlFor="location" className="text-gray-700 text-sm font-medium mb-1">Location ZIP CODE *</label>
                <input
                  type="number"
                  value={Zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm "
                  required
                />
              </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="name" className="text-gray-700 text-sm font-medium mb-1">Equipment Name *</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div className='mb-4'>
                <RTC
                  name={"Description"}
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                />
              </div>
              <div className="flex flex-col mt-4">
                <label htmlFor="brand" className="text-gray-700 text-sm font-medium mb-1">Brand Name</label>
                <input
                  type="text"
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="sale_price" className="text-gray-700 text-sm font-medium mb-1">Sale Price $ *</label>
                <input
                  type="number"
                  id="sale_price"
                  min={0}
                  value={sale_price}
                  onChange={(e) => setSalePrice(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="equipment_type" className="text-gray-700 text-sm font-medium mb-1">Equipment Type *</label>
                <select
                  id="equipment_type"
                  name="equipment_type"
                  value={equipment_type}
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
                  name="certification"
                  value={certification}
                  onChange={(e) => setCertification(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select certification</option>
                  <option value="CE Certification">CE Certification</option>
                  <option value="FDA Certification">FDA Approved</option>
                  <option value="FDA Certification">FDA Registered</option>
                  <option value="FDA Certification">Unknown</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="year_manufactured" className="text-gray-700 text-sm font-medium mb-1">Year Manufactured *</label>
                <input
                  type="date"
                  id="year_manufactured"
                  min={0}
                  value={year_manufactured}
                  onChange={(e) => setYearManufactured(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="warranty" className="text-gray-700 text-sm font-medium mb-1">Warranty *</label>
                <input
                  type="text"
                  id="warranty"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
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
                  <option value="Pick up only">Pick up only</option>
                  <option value="Free Shipping">Free Shipping</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="training" className="text-gray-700 text-sm font-medium mb-1">Training *</label>
                <select
                  id="training"
                  value={training}
                  onChange={(e) => setTraining(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select training option</option>
                  <option value="Available on site">Available On Site</option>
                  <option value="Video training">Video Training</option>
                  <option value="No training">No Training</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Image Upload */}
        <div className="lg:w-1/3 lg:pl-8 flex-1">
          <div className="bg-gray-50 p-4 border border-gray-300 mb-4">
            <h2 className="text-2xl font-semibold mb-4">Equipment Image</h2>
            <p className="text-gray-600 mb-4">
              Upload an image of the equipment. Recommended size: 1024x1024 and less than 15MB.
            </p>

            {/* Image Preview */}
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
            type="file"
                id="images"
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

      {/* Submit Button */}
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
          {isEdit? "Update" : "Publish"}
        </button>
      {!isEdit ?(
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

export default AddNewEquipmentForm;
