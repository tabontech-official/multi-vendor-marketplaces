import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor';
import { EditorState , ContentState, convertToRaw } from "draft-js";
import { useLocation } from 'react-router-dom';


const PostRentalForm = () => {
  // State hooks for form fields
  const [location, setLocation] = useState('');
  const [roomSize, setRoomSize] = useState(null);
  const [monthlyRent, setMonthlyRent] = useState(null);
  const [deposit, setDeposit] = useState(null);
  const [minimumInsuranceRequested, setMinimumInsuranceRequested] = useState(null);
  const [typeOfUseAllowed, setTypeOfUseAllowed] = useState('');
  const [rentalTerms, setRentalTerms] = useState('');
  const [wifiAvailable, setWifiAvailable] = useState(null);
  const [otherDetails, setOtherDetails] = useState('');
  const [images, setImages] = useState([]);  const [imageName, setImageName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]); // Keep previews here
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const locationData = useLocation();
  const [Zip , setZip] = useState("")

  const { product } = locationData.state || {};
console.log(product)
  useEffect(() => {
    if (product) {
      const roomListing = product.roomListing[0];
      setZip(roomListing.zip)
      setLocation(roomListing.location);
      setRoomSize(roomListing.roomSize);
      setMonthlyRent(roomListing.monthlyRent);
      setDeposit(roomListing.deposit);
      setMinimumInsuranceRequested(roomListing.minimumInsuranceRequested);
      setTypeOfUseAllowed(roomListing.typeOfUseAllowed || []);
      setRentalTerms(roomListing.rentalTerms);
      setWifiAvailable(roomListing.wifiAvailable);
      setOtherDetails(roomListing.otherDetails);
      setImages(roomListing.image);
      setImageName(roomListing.imageName || '');
      setIsEditing(true);
      setDescription(roomListing.otherDetails)
      if (roomListing.otherDetails) {
        const contentState = ContentState.createFromText(roomListing.otherDetails);
        setEditorState(EditorState.createWithContent(contentState));
      } else {
        setEditorState(EditorState.createEmpty());
      }
      if (product.images && Array.isArray(product.images)) {
        const existingImages = product.images.map((img) => img.src); // Extract image URLs
        setImagePreviews(existingImages); // Set them as previews
      }
    }
  }, []);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const currentText = newEditorState.getCurrentContent().getPlainText("\u0001");
    setDescription(currentText);
  };


  // Handler for form submission
  const handleSubmit = async (e , status) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if(status == "active"){
      setLoading(true);
    }

    const formData = new FormData();
    const id = localStorage.getItem('userid');

    if(images.length > 0 ){
      images.map((image)=>{
        formData.append('images', image); // Append each file
      })
    }


    formData.append('location', location);
    formData.append('zip', Zip);

    formData.append('roomSize', roomSize);
    formData.append('monthlyRent', monthlyRent);
    formData.append('deposit', deposit);
    formData.append('minimumInsuranceRequested', minimumInsuranceRequested);
    formData.append('typeOfUseAllowed', typeOfUseAllowed); // Updated field
    formData.append('rentalTerms', rentalTerms);
    formData.append('wifiAvailable', wifiAvailable);
    formData.append('otherDetails', otherDetails);
    formData.append('userId', id);
    formData.append('status', status);
    try {
      const response = await fetch(isEditing ? `https://medspaa.vercel.app/product/updateListing/${product.id}`:"https://medspaa.vercel.app/product/addRoom", {
        method: isEditing?"PUT": "POST",
        body: formData
      });

      const json = await response.json();

      if (response.ok) {
        if(status == "active"){
          setSuccess(json.message);
        }else{
          setSuccess("Your post drafted sucessfully")
        }
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

  // Handler for type of use allowed change
  const handleTypeOfUseAllowedChange = (e) => {
    const { value, checked } = e.target;
    setTypeOfUseAllowed(prev =>
      checked ? [...prev, value] : prev.filter(type => type !== value)
    );
  };

  return (
    <main className="bg-gray-100 min-h-screen p-8 flex-row">
      <h1 className="text-4xl font-bold mb-4">Add for Rent Room Listing</h1>
      <p className="text-lg mb-8 text-gray-700">Use this form to list your rental property.</p>
      <div className="mb-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </div>
      <div className="flex flex-col lg:flex-row flex-1">
        
        <div className="flex-1 bg-white px-8 py-4 shadow-md lg:mr-8 mb-8 lg:mb-0">
          <h1 className='text-2xl font-semibold mb-4'>Rental Details</h1>
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
                  id="location"
                  value={Zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm "
                  required
                />
              </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="roomSize" className="text-gray-700 text-sm font-medium mb-1">Room Size *</label>
                <input
                  type="number"
                  id="roomSize"
                  value={roomSize}
                  onChange={(e) => setRoomSize(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div className='mb-4'>
                <RTC 
                  name={"Other Details"}
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="monthlyRent" className="text-gray-700 text-sm font-medium mb-1">Monthly Rent $ *</label>
                <input
                  type="number"
                  id="monthlyRent"
                  min={0}
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="deposit" className="text-gray-700 text-sm font-medium mb-1">Deposit $ *</label>
                <input
                  type="number"
                  id="deposit"
                  min={0}
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="minimumInsuranceRequested" className="text-gray-700 text-sm font-medium mb-1">Minimum Insurance Requested $ *</label>
                <input
                  type="number"
                  id="minimumInsuranceRequested"
                  value={minimumInsuranceRequested}
                  onChange={(e) => setMinimumInsuranceRequested(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="typeOfUseAllowed" className="text-gray-700 text-sm font-medium mb-1">Type of Use Allowed *</label>
                <div id="typeOfUseAllowed" className="flex flex-col">
                  {['Skin care', 'Medical aesthetic', 'Massage therapy', 'General Medical', 'Permanent Makeup', 'Nails', 'Eyelashes', 'Wax'].map((option) => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={option}
                        checked={typeOfUseAllowed.includes(option)}
                        onChange={handleTypeOfUseAllowedChange}
                        className="form-checkbox"
                      />
                      <span className="ml-2 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="rentalTerms" className="text-gray-700 text-sm font-medium mb-1">Rental Terms *</label>
                <select
                  id="rentalTerms"
                  value={rentalTerms}
                  onChange={(e) => setRentalTerms(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select Rental Term</option>
                  <option value="Monthly to month">Monthly to month</option>
                  <option value="6 months">6 months</option>
                  <option value="12 months">12 months</option>
                </select>
              </div>
              <div className="flex flex-col">
  <label htmlFor="wifiAvailable" className="text-gray-700 text-sm font-medium mb-1">Wi-Fi Available *</label>
  <select
    id="wifiAvailable"
    value={wifiAvailable}
    onChange={(e) => setWifiAvailable(e.target.value === 'true')} // Convert string to boolean
    className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
    required
  >
    <option value="">Select Wi-Fi Availability</option>
    <option value="true">Yes</option>
    <option value="false">No</option>
  </select>
</div>

            </div>
          </form>
        </div>

        <div className="lg:w-1/3 lg:pl-8 flex-1">
        
              
        <div className="bg-gray-50 p-4 border border-gray-300 mb-4">
  <h2 className="text-2xl font-semibold mb-4">Room Pictures</h2>
  <p className="text-gray-600 mb-4">
    Upload an image of the equipment. Recommended size: 1024x1024 and less than 15MB.
  </p>
  <p className="text-sm text-gray-500 mb-2"></p>
  
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

export default PostRentalForm;
