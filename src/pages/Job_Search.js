import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor'; // Assuming RTC is the rich text editor
import { EditorState , ContentState, convertToRaw } from "draft-js";
import { useLocation } from 'react-router-dom';

const AddJobSearchForm = () => {
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [qualificationRequested, setQualificationRequested] = useState('');
  const [availability, setAvailability] = useState('');
  const [requestedYearlySalary, setRequestedYearlySalary] = useState('');
  const [positionRequestedDescription, setPositionRequestedDescription] = useState('');
  const [imageName, setImageName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);
  const [images, setImages] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isEditing, setIsEditing] = useState(false);
  const locationData = useLocation();
  const { product } = locationData.state || {};

  useEffect(() => {
    console.log(product)
    if (product) {
      setIsEditing(true);
      setLocation(product.jobListings[0].location || '');
      setName(product.title || '');
      setQualificationRequested(product.jobListings[0].qualification || '');
      setAvailability(product.jobListings[0].availability || '');
      setRequestedYearlySalary(product.jobListings[0].requestedYearlySalary || '');
      setPositionRequestedDescription(product.jobListings[0].positionRequestedDescription || '');
      setImages(product.image.src)
      setImageName(product.imageName || '');
      // Set the editor state if there's existing description
      if (typeof positionRequestedDescription === 'string') {
        // If it's a plain string, convert it to ContentState
        const contentState = ContentState.createFromText(positionRequestedDescription);
        setEditorState(EditorState.createWithContent(contentState));
      } else if (positionRequestedDescription) {
        // If it's already a ContentState or something similar, use it directly
        setEditorState(EditorState.createWithContent(convertToRaw(positionRequestedDescription)));
      } else {
        // Handle case where description is undefined or null
        setEditorState(EditorState.createEmpty());
      }    }
  }, []);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const currentText = newEditorState.getCurrentContent().getPlainText("\u0001");
    setPositionRequestedDescription(currentText);
  };

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (status === "active") {
      setLoading(true);
    }

    // Create FormData object
    const formData = new FormData();
    
    if (images) {
      formData.append('images', images);
    }

    formData.append('location', location);
    formData.append('name', name);
    formData.append('qualification', qualificationRequested);
    formData.append('availability', availability);
    formData.append('requestedYearlySalary', requestedYearlySalary);
    formData.append('positionRequestedDescription', positionRequestedDescription);
    formData.append('status', status);
    const id = localStorage.getItem('userid');
    formData.append('userId', id);

    try {
      const response = await fetch(isEditing ? `https://medspaa.vercel.app/product/updateListing/${product._id}` : "https://medspaa.vercel.app/product/addJob", {
        method: "POST",
        body: formData
      });

      const json = await response.json();

      if (response.ok) {
        setSuccess(isEditing ? "Job updated successfully!" : json.message);
        setError('');
        // Clear form fields after successful submission
        if (!isEditing) {
          setIsEditing(false)
          setLocation('');
          setName('');
          setQualificationRequested('');
          setAvailability('');
          setRequestedYearlySalary('');
          setPositionRequestedDescription('');
          setImages([]);
          setImageName('');
        }
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

  if (files) {
    const newImages = files.map(file => URL.createObjectURL(file)); // Create object URLs for preview
    setImages(prevImages => [...prevImages, ...newImages]); // Append to the existing images
  }
};



// Handler to remove image
const handleRemoveImage = (index) => {
  setImages(prevImages => prevImages.filter((_, i) => i !== index)); // Remove image at the specified index
};

  return (
    <main className="bg-gray-100 min-h-screen p-8 flex-row">
      <h1 className="text-4xl font-bold mb-4">Provider Job Search Listing</h1>
      <p className="text-lg mb-8 text-gray-700">Here you can {isEditing ? "edit" : "add"} job listings to your site.</p>
      <div className="mb-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </div>
      <div className="flex flex-col lg:flex-row flex-1">
        <div className="flex-1 bg-white px-8 py-4 shadow-md lg:mr-8 mb-8 lg:mb-0">
          <h1 className='text-2xl font-semibold mb-4'>Job Details</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Details */}
            <div className="grid grid-cols-1 gap-6">
              {/* Location */}
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

              {/* Name */}
              <div className="flex flex-col">
                <label htmlFor="name" className="text-gray-700 text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Qualification Requested */}
              <div className="flex flex-col">
                <label htmlFor="qualificationRequested" className="text-gray-700 text-sm font-medium mb-1">Qualification Requested *</label>
                <select
                  id="qualificationRequested"
                  value={qualificationRequested}
                  onChange={(e) => setQualificationRequested(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select Qualification</option>
                  <option value="Medical Director">Medical Director</option>
                  <option value="ARPN Nurse practitioner">ARPN Nurse practitioner</option>
                  <option value="Registered Nurse">Registered Nurse</option>
                  <option value="Medical Assistant">Medical Assistant</option>
                  <option value="Aesthetician">Aesthetician</option>
                  <option value="Laser Technician">Laser Technician</option>
                  <option value="Massage therapist">Massage therapist</option>
                  <option value="Front desk clerk">Front desk clerk</option>
                </select>
              </div>

              {/* Availability */}
              <div className="flex flex-col">
                <label htmlFor="availability" className="text-gray-700 text-sm font-medium mb-1">Availability *</label>
                <input
                  type="text"
                  id="availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Requested Yearly Salary */}
              <div className="flex flex-col">
                <label htmlFor="requestedYearlySalary" className="text-gray-700 text-sm font-medium mb-1">Requested Yearly Salary *</label>
                <input
                  type="number"
                  id="requestedYearlySalary"
                  min={0}
                  value={requestedYearlySalary}
                  onChange={(e) => setRequestedYearlySalary(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Position Description */}
              <div className='mb-4'>
                <RTC 
                  name={"Position Requested Description"}
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                />
              </div>

              {/* Job Type */}
              <div className="flex flex-col mt-4">
                <label htmlFor="jobType" className="text-gray-700 text-sm font-medium mb-1">Job Type *</label>
                <select
                  id="jobType"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select Job Type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
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

            {/* Image Preview */}
            {images.length > 0 ? (
  images.map((image, index) => (
    <div key={index} className="flex items-center mb-4">
      <img
        src={image}
        alt={`Preview ${index}`}
        className="border border-gray-300 w-14 h-14 object-cover"
      />
      <div className="ml-4 flex flex-1 items-center">
        <p className="text-sm text-gray-700 flex-1">file {index + 1}</p>
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
          type="submit"
          onClick={(e) => { handleSubmit(e, "draft") }}
          className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded flex items-center"
        >
          Draft
        </button>
      </div>
    </main>
  );
};

export default AddJobSearchForm;
