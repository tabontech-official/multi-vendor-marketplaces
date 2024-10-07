import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor'; // Assuming RTC is your custom rich text editor component
import { EditorState , ContentState , convertToRaw } from "draft-js";
import { useLocation } from 'react-router-dom';

const AddNewJobForm = () => {
  // State hooks for form fields
  const [location, setLocation] = useState('');
  const [qualification, setQualification] = useState('');
  const [jobType, setJobType] = useState('');
  const [jobOfferType, setJobOfferType] = useState('');
  const [offeredSalary, setOfferedSalary] = useState('');
  const [positionDescription, setPositionDescription] = useState('');
  const [images, setImages] = useState([]);
  const [imageName, setImageName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [Enabled , setEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const LocationData = useLocation();
  const [imagePreviews, setImagePreviews] = useState([]); // Keep previews here
  const [Zip , setZip] = useState("")

  const { product } = LocationData.state || {};
 console.log(product)


 useEffect(() => {
  if (product) {
    setIsEditing(true);
    setLocation(product.providerListings[0].location || '');
    setQualification(product.providerListings[0].qualificationRequested || '');
    setJobType(product.providerListings[0].jobType || '');
    setJobOfferType(product.providerListings[0].typeOfJobOffered || '');
    setOfferedSalary(product.providerListings[0].offeredYearlySalary || '');
    setPositionDescription(product.providerListings[0].offeredPositionDescription || '');



    if (product.providerListings[0].offeredPositionDescription) {
      const contentState = ContentState.createFromText(product.providerListings[0].offeredPositionDescription);
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
    setPositionDescription(currentText);
  };

  // Handler for form submission
  const handleSubmit = async (e , status) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if(status == "active"){
      setLoading(true);
    }

    // Get user ID from local storage
    const id = localStorage.getItem('userid');
    
    // Create a new FormData object
    const formData = new FormData();

    // Append the image file if it exists
   
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    // Append other fields
    formData.append('location', location);
    formData.append('zip',Zip)
    if(isEditing){
      formData.append('title', qualification);
    }else{
      formData.append('qualificationRequested', qualification);
 
    }
   formData.append('jobType', jobType);
    formData.append('typeOfJobOffered', jobOfferType);
    formData.append('offeredYearlySalary', offeredSalary); // Fixed key
    if(isEditing){
      formData.append('body_html', positionDescription);
    }else{
      formData.append('offeredPositionDescription', positionDescription);
 
    }

    formData.append("userId", id);
    formData.append("status", status);

    try {
        const response = await fetch(isEditing
          ? `https://medspaa.vercel.app/product/updateListing/${product._id}`
          : "https://medspaa.vercel.app/product/addProvider", {
          method: isEditing ? "PUT" : "POST",
          body: formData,
        });;

      const json = await response.json();

      if (response.ok) {
        if(status == "active"){
          setImages([])
          setImagePreviews([])
          setSuccess(json.message);
        }else{
          setSuccess("Your post drafted sucessfully")
        }
        setError('');
        // Clear form fields
        setLocation('');
        setQualification('');
        setJobType('');
        setJobOfferType('');
        setOfferedSalary('');
        setPositionDescription('');
        setImages([]);
        setImageName('');
        setEditorState(EditorState.createEmpty());
      } else {
        setSuccess('');
        setError(json.error);
      }
    } catch (error) {
      setSuccess('');
      setError('An unexpected error occurred.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /// Handler for image file change
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
      <h1 className="text-3xl font-bold mb-1">PROVIDER JOB OFFER LISTING</h1>
      <p className="text-lg mb-3 text-gray-700">Here you can add job listings to your site.</p>
      <div className="mb-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </div>
      <div className="flex flex-col lg:flex-row flex-1">
        <div className="flex-1 bg-white px-8 py-4 shadow-md lg:mr-8 mb-8 lg:mb-0">
          <h1 className='text-2xl font-semibold'>Job Details</h1>
          <p className='mb-4'>Add job details here</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Location */}
              <div className='flex flex-row'>
              <div className="flex flex-col flex-1 mr-4">
                <label htmlFor="location" className="text-gray-700 text-sm font-medium mb-1">Location STATE *</label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select a location</option>
                  <option value="New York">New York</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Chicago">Chicago</option>
                  <option value="Houston">Houston</option>
                  <option value="Other">Other</option>
                </select>
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
              {/* Qualification Requested */}
              <div className="flex flex-col">
                <label htmlFor="qualification" className="text-gray-700 text-sm font-medium mb-1">Qualification Requested *</label>
                <select
                  id="qualification"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select qualification</option>
                  <option value="Medical Director">Medical Director</option>
                  <option value="ARPN Nurse Practitioner">ARPN Nurse Practitioner</option>
                  <option value="Registered Nurse">Registered Nurse</option>
                  <option value="Medical Assistant">Medical Assistant</option>
                  <option value="Aesthetician">Aesthetician</option>
                  <option value="Laser Technician">Laser Technician</option>
                  <option value="Massage Therapist">Massage Therapist</option>
                  <option value="Front Desk Clerk">Front Desk Clerk</option>
                </select>
              </div>

              {/* Position Description */}
              <div className='mb-4'>
                <RTC 
                  name={"Position offered Description"}
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                />
              </div>

              {/* Job Type */}
              <div className="flex flex-col">
                <label htmlFor="jobType" className="text-gray-700 text-sm font-medium mb-1">Job Type *</label>
                <select
                  id="jobType"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select job type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
              </div>

              {/* Type of Job Offered */}
              <div className="flex flex-col">
                <label htmlFor="jobOfferType" className="text-gray-700 text-sm font-medium mb-1">Type of Job Offered *</label>
                <select
                  id="jobOfferType"
                  value={jobOfferType}
                  onChange={(e) => setJobOfferType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select job offer type</option>
                  <option value="Employee W2">Employee W2</option>
                  <option value="Freelance Provider 1099">Freelance Provider 1099</option>
                </select>
              </div>

              {/* Offered Salary */}
              <div className="flex flex-col">
                <label htmlFor="offeredSalary" className="text-gray-700 text-sm font-medium mb-1"> Offered Yearly Salary $  *</label>
                <input
                  type="number"
                  id="offeredSalary"
                  min={0}
                  value={offeredSalary}
                  onChange={(e) => setOfferedSalary(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
            </div>
            <hr className="border-t border-gray-500 my-4" />
            <div className="mt-8 flex ">
            <button
          type="submit"
          onClick={(e) => { handleSubmit(e, "active") }}
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
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4h-4z"
              />
            </svg>
          )}
{loading ? (isEditing ? 'Updating...' : 'Publishing...') : (isEditing ? 'Update' : 'Publish')}
</button>

       
        <button
          type="button"
          onClick={(e)=>{handleSubmit(e,"draft")}}
          className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded flex items-center"
        >
         Draft
        </button>
      </div>
          </form>
        </div>

     {/* Image Upload */}
     <div className="lg:w-1/3 lg:pl-8 flex-1">
          
            
     <div className="bg-gray-50 p-4 border border-gray-300 mb-4">
  <h2 className="text-2xl font-semibold mb-4">Resume</h2>
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
    </main>
  );
};

export default AddNewJobForm;
