import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor'; // Assuming RTC is the custom editor component
import { convertToRaw, EditorState , ContentState } from "draft-js";
import { useLocation } from 'react-router-dom';

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
  const [images, setImages] = useState([]);
    const [imageName, setImageName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [descriptionText, setText] = useState("");
  const [name, setName] = useState('');
  const [Zip , setZip] = useState("")
  const [imagePreviews, setImagePreviews] = useState([]); // Keep previews here

  const [isEditing, setIsEditing] = useState(false);
  const locationData = useLocation()
  const { product } = locationData.state || {};

  useEffect(() => {
    if (product) {
      setIsEditing(true);
      const business = product.business || {};
      setLocation(business.location || '');
      setZip(business.zip || '');
      setName(business.name || '');
      setAskingPrice( product.variants[0].price || '');
      setEstablishedYear(business.establishedYear || '');
      setNumEmployees(business.numberOfEmployees || '');
      setMonthlyRent(business.locationMonthlyRent || '');
      setLeaseExpiration(parseInt(business.leaseExpirationDate )|| '');
      setLocationSize(business.locationSize || '');
      setGrossYearlyRevenue(business.grossYearlyRevenue || '');
      setCashFlow(business.cashFlow || '');
      setProductsInventory(business.productsInventory || '');
      setEquipmentValue(business.equipmentValue || '');
      setReasonForSelling(business.reasonForSelling || '');
      setListOfDevices(business.listOfDevices || '');
      setOfferedServices(business.offeredServices || '');
      setSupportAndTraining(business.supportAndTraining || '');
      setText(business.businessDescription || '' )
      if(business.images){
        setImages(business.images.map(img => img.src));
      }
      

      if (product.business.businessDescription) {
        const contentState = ContentState.createFromText(product.business.businessDescription);
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
console.log(product)

const onEditorStateChange = (newEditorState) => {
  setEditorState(newEditorState);
  const currentText = newEditorState.getCurrentContent().getPlainText("\u0001");
  setText(currentText);
};





     // Handler for form submission
  const handleSubmit = async (e, status) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const id = localStorage.getItem("userid");

    const formData = new FormData();

    // Append the image file if it exists
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image); // Append each file
      });
    }

    // Append other fields
    formData.append('name', name);
    formData.append('location', location);
    formData.append('zip', Zip);
    formData.append('businessDescription', descriptionText);
    formData.append('asking_price', askingPrice);
    formData.append('establishedYear', establishedYear);
    formData.append('numberOfEmployees', numEmployees);
    formData.append('locationMonthlyRent', monthlyRent);
    formData.append('leaseExpirationDate', leaseExpiration);
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
    formData.append('status', status);

    try {
      const response = await fetch(isEditing
        ? `https://medspaa.vercel.app/product/updateListing/${product._id}`
        : 'https://medspaa.vercel.app/product/addBusiness', {
          method: isEditing ? 'PUT' : 'POST', 
          body: formData,
        });

      const json = await response.json();

      if (response.ok) {
        setSuccess(json.message);
        setError('');
        // Clear form fields
        // setLocation('');
        // setBusinessDescription('');
        // setAskingPrice('');
        // setEstablishedYear('');
        // setNumEmployees('');
        // setMonthlyRent('');
        // setLeaseExpiration('');
        // setLocationSize('');
        // setGrossYearlyRevenue('');
        // setCashFlow('');
        // setProductsInventory('');
        // setEquipmentValue('');
        // setReasonForSelling('');
        // setListOfDevices('');
        // setOfferedServices('');
        // setSupportAndTraining('');
        // setImages([]);
        // setText('');
        // setImageName('');
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
                <label htmlFor="name" className="text-gray-700 text-sm font-medium mb-1">Business Name *</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                <label htmlFor="monthlyRent" className="text-gray-700 text-sm font-medium mb-1">Monthly Rent $ *  (Including Sales Taxes) </label>
                <input
                  type="number"
                  id="monthlyRent"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Lease Expiration */}
              <div className="flex flex-col">
                <label htmlFor="leaseExpiration" className="text-gray-700 text-sm font-medium mb-1"> Lease Expiration date *</label>
                <input
                  type="number"
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
                  type="number"
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
                  type="number"
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
                  type="number"
                  id="cashFlow"
                  value={cashFlow}
                  onChange={(e) => setCashFlow(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Products/Inventory */}
              <div className="flex flex-col">
                <label htmlFor="productsInventory" className="text-gray-700 text-sm font-medium mb-1">Product Inventory Value $$ *</label>
                <input
                  type="number"
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
                  type="number"
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
                <textarea
                  type="text"
                  id="listOfDevices"
                    rows="5"
                    cols="50"
                  value={listOfDevices}
                  onChange={(e) => setListOfDevices(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Offered Services */}
              <div className="flex flex-col">
                <label htmlFor="offeredServices" className="text-gray-700 text-sm font-medium mb-1">Offered Services</label>
                <textarea
                  type="text"
                  id="offeredServices"
                   rows="5"
                    cols="50"
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

export default AddBusinessListingForm;
