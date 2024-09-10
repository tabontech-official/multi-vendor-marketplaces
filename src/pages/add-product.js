import React, { useState } from 'react';
import VariantDetails from './add-variants';
const AddProductForm = () => {
  // State hooks for product details
  const [productType, setProductType] = useState('');
  const [productName, setProductName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [shippingDetails, setShippingDetails] = useState(false);
  const[Price , setPrice ] = useState('0')
const [date , setDate] = useState('')
const [Warranty, setWarranty] = useState('');
const [Scope , setScope] = useState('')
const [contact , setContact ] = useState('')
const [location , setlocation] = useState('')

  // State hooks for additional details
  const [images, setImages] = useState([]);
  const [otherDetails, setOtherDetails] = useState({
    certification: '',
    yearPurchased: '',
    // Add other fields as needed
  });

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      productType,
      productName,
      brandName,
      description,
      images,
      otherDetails,
    });
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-6xl bg-white p-8 rounded-lg border border-gray-300 shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Add Listings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Form Layout: Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Details Form */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-700">PRODUCT DETAILS</h2>
              <p className="text-gray-600">Add product details here</p>

              {/* Choose Product */}
              <div>
                <label htmlFor="Choose-Product" className="block text-gray-600 text-sm font-medium mb-2">CHOOSE PRODUCT *</label>
                <select
                  id="Choose-Product"
                  name="Choose-Product"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select a product</option>
                  <option value="normal">Normal Product</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {/* Product Name */}
              <div>
                <label htmlFor="Product-Name" className="block text-gray-600 text-sm font-medium mb-2">PRODUCT NAME *</label>
                <input
                  type="text"
                  id="Product-Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              {/* Brand Name */}
              <div>
                <label htmlFor="BRAND-NAME" className="block text-gray-600 text-sm font-medium mb-2">BRAND NAME</label>
                <input
                  type="text"
                  id="BRAND-NAME"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              {/* Product Type */}
              <div>
                <label htmlFor="PRODUCT-TYPE" className="block text-gray-600 text-sm font-medium mb-2">PRODUCT TYPE *</label>
                <select
                  id="PRODUCT-TYPE"
                  name="PRODUCT-TYPE"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select a type</option>
                  <option value="Business to purchase">Business to purchase</option>
                  <option value="Business to Sale">Business to Sale</option>
                  <option value="New Equipment">New Equipment</option>
                  <option value="Provider available">Provider available</option>
                  <option value="Provider Needed">Provider Needed</option>
                  <option value="Spa Room for Rent">Spa Room for Rent</option>
                  <option value="Used Equipment">Used Equipment</option>
                </select> 
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-gray-600 text-sm font-medium mb-2">DESCRIPTION</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter product description here"
                />
              </div>

             

              <div className="flex flex-col space-y-4">
      {/* Checkbox and Label */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="shipping-details"
          checked={shippingDetails}
          onClick={()=> setShippingDetails(!shippingDetails)}
          className="h-5 w-5 text-green-500 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
        />
        <label
          htmlFor="shipping-details"
          className="text-gray-600 text-sm font-medium"
        >
          Shipping Details
        </label>
      </div>


      <div>
                <label htmlFor="Price" className="block text-gray-600 text-sm font-medium mb-2">PRICE </label>
                <input
                  type="number"
                  id="Price"
                  value={Price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="Date" className="block text-gray-600 text-sm font-medium mb-2">Year Purchased </label>
                <input
                  type="date"
                  id="Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="Warranty" className="block text-gray-600 text-sm font-medium mb-2">Still Under Warranty *</label>
                <select
                  id="Warranty"
                  name="Warranty"
                  value={Warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select a type</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label htmlFor="Scope" className="block text-gray-600 text-sm font-medium mb-2">Device Scope  *</label>
                <select
                  id="Scope"
                  name="Scope"
                  value={Scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select a type</option>
                  <option value="Yes">Skin Care</option>
                  <option value="No">Skin Resurfacing</option>
                  <option value="Yes">Body Sculpting</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-gray-600 text-sm font-medium mb-2">Contact Details</label>
                <textarea
                  id="description"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter Contact Details here"
                />
              </div>


              <div>
                <label htmlFor="location" className="block text-gray-600 text-sm font-medium mb-2">Location *</label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setlocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>



    </div>

            </section>

            {/* Additional Details Form */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-700">ADDITIONAL DETAILS</h2>
              <p className="text-gray-600">Add additional details here</p>

              {/* Images Upload */}
              <div>
                <label htmlFor="images" className="block text-gray-600 text-sm font-medium mb-2">UPLOAD IMAGES</label>
                <input
                  type="file"
                  id="images"
                  multiple
                  onChange={(e) => setImages(Array.from(e.target.files))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Additional Fields */}
              {/* Certification */}
              <div>
                <label htmlFor="certification" className="block text-gray-600 text-sm font-medium mb-2">CERTIFICATION *</label>
                <select
                  id="certification"
                  name="certification"
                  value={otherDetails.certification}
                  onChange={(e) => setOtherDetails({ ...otherDetails, certification: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="certified">FDA Approved</option>
                  <option value="not_certified">FDA Registered</option>
                  <option value="not_certified">CE European Certification</option>
                </select>
              </div>

              <VariantDetails/>

              {/* Add more fields as needed here */}
            </section>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-[#52c058] text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddProductForm;
