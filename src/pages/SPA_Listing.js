import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor'; // Assuming RTC is the custom editor component
import { EditorState } from 'draft-js';

const AddBusinessListingForm = () => {
  // State hooks for form fields
  const [location, setLocation] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [numEmployees, setNumEmployees] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [leaseExpiration, setLeaseExpiration] = useState('');
  const [locationSize, setLocationSize] = useState('');
  const [grossYearlyRevenue, setGrossYearlyRevenue] = useState('');
  const [cashFlow, setCashFlow] = useState('');
  const [productsInventory, setProductsInventory] = useState('');
  const [equipmentValue, setEquipmentValue] = useState('');
  const [reasonForSelling, setReasonForSelling] = useState('');
  const [listOfDevices, setListOfDevices] = useState('');
  const [offeredServices, setOfferedServices] = useState('');
  const [supportAndTraining, setSupportAndTraining] = useState('');
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [descriptionText, setText] = useState("");

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const currentText = newEditorState.getCurrentContent().getPlainText('\u0001');
    setText(currentText);
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    const id = localStorage.getItem("userid")
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true); // Set loading to true

    // Create a new FormData object
    const formData = new FormData();

    // Append the image file if it exists
    if (image) {
      formData.append('image', image);
    }

    // Append other fields
    formData.append('location', location);
    formData.append('businessDescription', descriptionText);
    formData.append('askingPrice', askingPrice);
    formData.append('establishedYear', establishedYear);
    formData.append('numberOfEmployees', numEmployees); // Consistent naming
    formData.append('locationMonthlyRent', monthlyRent); // Consistent naming
    formData.append('leaseExpirationDate', leaseExpiration); // Consistent naming
    formData.append('locationSize', locationSize);
    formData.append('grossYearlyRevenue', grossYearlyRevenue);
    formData.append('cashFlow', cashFlow);
    formData.append('productsInventory', productsInventory);
    formData.append('equipmentValue', equipmentValue);
    formData.append('reasonForSelling', reasonForSelling);
    formData.append('listOfDevices', listOfDevices);
    formData.append('offeredServices', offeredServices);
    formData.append('supportAndTraining', supportAndTraining);
    formData.append('userId', id);
    try {
      const response = await fetch('https://medspaa.vercel.app/product/addBusiness', {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();

      if (response.ok) {
        setSuccess(json.message);
        setError('');
        // Clear form fields
        setLocation('');
        setBusinessDescription('');
        setAskingPrice('');
        setEstablishedYear('');
        setNumEmployees('');
        setMonthlyRent('');
        setLeaseExpiration('');
        setLocationSize('');
        setGrossYearlyRevenue('');
        setCashFlow('');
        setProductsInventory('');
        setEquipmentValue('');
        setReasonForSelling('');
        setListOfDevices('');
        setOfferedServices('');
        setSupportAndTraining('');
        setImage(null); // Clear the image file
        setText(''); // Clear description
        setImageName(''); // Clear image name
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

  // Handler for image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageName(file.name);
  };

  // Handler to remove image
  const handleRemoveImage = () => {
    setImage(null);
    setImageName('');
    setShowRemoveOption(false); // Hide the remove option after removing the image
  };

  return (
    <main className="bg-gray-100 min-h-screen p-8 flex-row">
      <h1 className="text-4xl font-bold mb-4">Add New Business Listing</h1>
      <p className="text-lg mb-8 text-gray-700">Here you can add a business to your platform.</p>
      <div className="mb-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </div>
      <div className="flex flex-col lg:flex-row flex-1">
        <div className="flex-1 bg-white px-8 py-4 shadow-md lg:mr-8 mb-8 lg:mb-0">
          <h1 className="text-2xl font-semibold mb-4">Business Details</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Details */}
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

              {/* Business Description */}
              <div className='mb-4'>
               <RTC  name={"Business Description"}
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                />
           </div>

              {/* Asking Price */}
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

              {/* Established Year */}
              <div className="flex flex-col">
                <label htmlFor="establishedYear" className="text-gray-700 text-sm font-medium mb-1">Established Year *</label>
                <input
                  type="number"
                  id="establishedYear"
                  value={establishedYear}
                  onChange={(e) => setEstablishedYear(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Number of Employees */}
              <div className="flex flex-col">
                <label htmlFor="numEmployees" className="text-gray-700 text-sm font-medium mb-1">Number of Employees *</label>
                <input
                  type="number"
                  id="numEmployees"
                  value={numEmployees}
                  onChange={(e) => setNumEmployees(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Monthly Rent */}
              <div className="flex flex-col">
                <label htmlFor="monthlyRent" className="text-gray-700 text-sm font-medium mb-1">Monthly Rent $ *</label>
                <input
                  type="text"
                  id="monthlyRent"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Lease Expiration */}
              <div className="flex flex-col">
                <label htmlFor="leaseExpiration" className="text-gray-700 text-sm font-medium mb-1">Lease Expiration *</label>
                <input
                  type="text"
                  id="leaseExpiration"
                  value={leaseExpiration}
                  onChange={(e) => setLeaseExpiration(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Location Size */}
              <div className="flex flex-col">
                <label htmlFor="locationSize" className="text-gray-700 text-sm font-medium mb-1">Location Size (sq ft) *</label>
                <input
                  type="text"
                  id="locationSize"
                  value={locationSize}
                  onChange={(e) => setLocationSize(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Gross Yearly Revenue */}
              <div className="flex flex-col">
                <label htmlFor="grossYearlyRevenue" className="text-gray-700 text-sm font-medium mb-1">Gross Yearly Revenue $ *</label>
                <input
                  type="text"
                  id="grossYearlyRevenue"
                  value={grossYearlyRevenue}
                  onChange={(e) => setGrossYearlyRevenue(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Cash Flow */}
              <div className="flex flex-col">
                <label htmlFor="cashFlow" className="text-gray-700 text-sm font-medium mb-1">Cash Flow $$ >> (Net profit before Taxes and adding back depreciation and owner draws)*</label>
                <input
                  type="text"
                  id="cashFlow"
                  value={cashFlow}
                  onChange={(e) => setCashFlow(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Products/Inventory */}
              <div className="flex flex-col">
                <label htmlFor="productsInventory" className="text-gray-700 text-sm font-medium mb-1">Products/Inventory *</label>
                <input
                  type="text"
                  id="productsInventory"
                  value={productsInventory}
                  onChange={(e) => setProductsInventory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Equipment Value */}
              <div className="flex flex-col">
                <label htmlFor="equipmentValue" className="text-gray-700 text-sm font-medium mb-1">Equipment Value $ *</label>
                <input
                  type="text"
                  id="equipmentValue"
                  value={equipmentValue}
                  onChange={(e) => setEquipmentValue(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Reason for Selling */}
              <div className="flex flex-col">
                <label htmlFor="reasonForSelling" className="text-gray-700 text-sm font-medium mb-1">Reason for Selling</label>
                <input
                  type="text"
                  id="reasonForSelling"
                  value={reasonForSelling}
                  onChange={(e) => setReasonForSelling(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* List of Devices */}
              <div className="flex flex-col">
                <label htmlFor="listOfDevices" className="text-gray-700 text-sm font-medium mb-1">List of Devices</label>
                <input
                  type="text"
                  id="listOfDevices"
                  value={listOfDevices}
                  onChange={(e) => setListOfDevices(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Offered Services */}
              <div className="flex flex-col">
                <label htmlFor="offeredServices" className="text-gray-700 text-sm font-medium mb-1">Offered Services</label>
                <input
                  type="text"
                  id="offeredServices"
                  value={offeredServices}
                  onChange={(e) => setOfferedServices(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Support and Training */}
              <div className="flex flex-col">
                <label htmlFor="supportAndTraining" className="text-gray-700 text-sm font-medium mb-1">Support and Training</label>
                <input
                  type="text"
                  id="supportAndTraining"
                  value={supportAndTraining}
                  onChange={(e) => setSupportAndTraining(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Image Upload */}
        <div className="lg:w-1/3 lg:pl-8 flex-1">
         
        <div className="bg-gray-50 p-4 border border-gray-300 mb-4">
  <h2 className="text-2xl font-semibold mb-4">Business Image</h2>
  <p className="text-gray-600 mb-4">
    Upload an image of the equipment. Recommended size: 1024x1024 and less than 15MB.
  </p>
  <p className="text-sm text-gray-500 mb-2"></p>

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

  <button
    onClick={() => document.getElementById('imageUpload').click()}
    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-4 rounded"
  >
    Upload Image
  </button>
  <input
    type="file"
    id="imageUpload"
    onChange={handleImageChange}
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
                d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
              />
            </svg>
          )}
        Post Listing
        </button>
      </div>
    </main>
  );
};

export default AddBusinessListingForm;
