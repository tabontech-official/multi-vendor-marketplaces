import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor';
import { EditorState } from "draft-js";

const PostRentalForm = () => {
  // State hooks for form fields
  const [location, setLocation] = useState('');
  const [roomSize, setRoomSize] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [minimumInsuranceRequested, setMinimumInsuranceRequested] = useState('');
  const [typeOfUseAllowed, setTypeOfUseAllowed] = useState([]);
  const [rentalTerms, setRentalTerms] = useState('');
  const [wifiAvailable, setWifiAvailable] = useState();
  const [otherDetails, setOtherDetails] = useState('');
  const [image, setImage] = useState(null); // State for image upload
  const [imageName, setImageName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [description, setDescription] = useState("");

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const currentText = newEditorState.getCurrentContent().getPlainText("\u0001");
    setDescription(currentText);
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const formData = new FormData();
    const id = localStorage.getItem('userid');
    if (image) {
      formData.append('image', image);
    }

    formData.append('location', location);
    formData.append('roomSize', roomSize);
    formData.append('monthlyRent', monthlyRent);
    formData.append('deposit', deposit);
    formData.append('minimumInsuranceRequested', minimumInsuranceRequested);
    formData.append('typeOfUseAllowed', JSON.stringify(typeOfUseAllowed)); // Updated field
    formData.append('rentalTerms', rentalTerms);
    formData.append('wifiAvailable', wifiAvailable);
    formData.append('otherDetails', description);
    formData.append('userId', id);

    try {
      const response = await fetch("https://medspaa.vercel.app/product/addRoom", {
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

  // Handler for type of use allowed change
  const handleTypeOfUseAllowedChange = (e) => {
    const { value, checked } = e.target;
    setTypeOfUseAllowed(prev =>
      checked ? [...prev, value] : prev.filter(type => type !== value)
    );
  };

  return (
    <main className="bg-gray-100 min-h-screen p-8 flex-row">
      <h1 className="text-4xl font-bold mb-4">Add Rent Room Listing</h1>
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
    <option value="true">True</option>
    <option value="false">False</option>
  </select>
</div>

            </div>
          </form>
        </div>

        <div className="lg:w-1/3 lg:pl-8 flex-1">
        
          <div className="bg-gray-50 p-4 border border-gray-300 mb-4">
          <h2 className="text-2xl font-semibold mb-4">Room Picture</h2>
          <p className="text-gray-600 mb-4">
            Upload an image of the property. Recommended size: 1024x1024 and less than 15MB.
          </p>
            <p className="text-sm text-gray-500 mb-2">Example: property.png</p>

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
                    onClick={() => setShowRemoveOption(!showRemoveOption)}
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
          {loading ? 'Submitting...' : 'Post Listing'}
        </button>
      </div>
    </main>
  );
};

export default PostRentalForm;
