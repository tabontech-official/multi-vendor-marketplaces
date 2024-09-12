import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor'; // Assuming RTC is the rich text editor
import { convertToRaw, EditorState } from "draft-js";

const AddJobSearchForm = () => {
  // State hooks for form fields
  const [location, setLocation] = useState('');
  const [qualification, setQualification] = useState('');
  const [jobType, setJobType] = useState('');
  const [jobOfferType, setJobOfferType] = useState('');
  const [offeredSalary, setOfferedSalary] = useState('');
  const [positionDescription, setPositionDescription] = useState('');
  const [CV, setCv] = useState(null);
  const [cvName, setCvName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading
  const [showRemoveOption, setShowRemoveOption] = useState(false); // State to show/hide remove option

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [description, setText] = useState("");

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
    setLoading(true); // Set loading to true

    // Create a new FormData object
    const formData = new FormData();
  
    // Append the CV file if it exists
    if (CV) {
      formData.append('cv', CV);
    }
  
    // Append other fields
    formData.append('location', location);
    formData.append('qualification', qualification);
    formData.append('jobType', jobType);
    formData.append('jobOfferType', jobOfferType);
    formData.append('offeredSalary', offeredSalary);
    formData.append('positionDescription', positionDescription); // Append position description field

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
        setQualification('');
        setJobType('');
        setJobOfferType('');
        setOfferedSalary('');
        setPositionDescription('');
        setCv(null); // Clear the CV file
        setText(''); // Clear description
        setCvName(''); // Clear CV name
      } else {
        setSuccess('');
        setError(json.error);
      }
    } catch (error) {
      setSuccess('');
      setError('An unexpected error occurred.');
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false after operation completes
    }
  };

  // Handler for CV file change
  const handleCvChange = (e) => {
    const file = e.target.files[0];
    setCv(file);
    setCvName(file.name);
  };

  // Handler to remove CV
  const handleRemoveCv = () => {
    setCv(null);
    setCvName('');
    setShowRemoveOption(false); // Hide the remove option after removing the CV
  };

  return (
    <main className="bg-gray-100 min-h-screen p-8 flex-row">
      <h1 className="text-4xl font-bold mb-4">Add New Job Listing</h1>
      <p className="text-lg mb-8 text-gray-700">Here you can add job listings to your site.</p>
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

              {/* Qualification */}
              <div className="flex flex-col">
                <label htmlFor="qualification" className="text-gray-700 text-sm font-medium mb-1">Qualification *</label>
                <input
                  type="text"
                  id="qualification"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Position Description */}
              <RTC 
              name={"Offered Position Description"}
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
              />

              {/* Job Type */}
              <div className="flex flex-col mt-4">
                <label htmlFor="jobType" className="text-gray-700 text-sm font-medium mb-1">Job Type</label>
                <input
                  type="text"
                  id="jobType"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Job Offer Type */}
              <div className="flex flex-col">
                <label htmlFor="jobOfferType" className="text-gray-700 text-sm font-medium mb-1">Job Offer Type *</label>
                <input
                  type="text"
                  id="jobOfferType"
                  value={jobOfferType}
                  onChange={(e) => setJobOfferType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Offered Salary */}
              <div className="flex flex-col">
                <label htmlFor="offeredSalary" className="text-gray-700 text-sm font-medium mb-1">Offered Salary *</label>
                <input
                  type="text"
                  id="offeredSalary"
                  min={0}
                  value={offeredSalary}
                  onChange={(e) => setOfferedSalary(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
            </div>
          </form>
        </div>

        {/* CV Upload */}
        <div className="lg:w-1/3 lg:pl-8 flex-1">
          <h2 className="text-2xl font-semibold mb-4">RESUME</h2>
          <p className="text-gray-600 mb-4">
            Here you can upload the Resume for the job listing.
          </p>
          <div className="bg-gray-50 p-4 border border-gray-300 mb-4">
            <p className="text-sm text-gray-500 mb-2">Example: resume.pdf</p>
           
            {/* CV Preview */}
            {CV ? (
              <div className="flex items-center mb-4">
                <p className="text-sm text-gray-700 flex-1">{cvName}</p>
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
                    onClick={handleRemoveCv}
                    className="text-red-500 hover:text-red-700 text-sm ml-4"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center mb-4">
                <p className="text-sm text-gray-700 flex-1">No Resume uploaded</p>
              </div>
            )}
            
            <input
              type="file"
              id="cv"
              onChange={handleCvChange}
              className="py-2 px-4"
            />
          </div>
          <p className="text-sm text-gray-500">
            Note: The Resume can be uploaded in PDF format only.
          </p>
         
        </div>
      </div>
 
      {/* Submit Button */}
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
          {loading ? 'Submitting...' : 'Save Changes'}
        </button>
      </div>
    </main>
  );
};

export default AddJobSearchForm;
