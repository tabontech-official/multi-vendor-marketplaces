import React, { useState } from 'react';

const AddBusinessForm = () => {
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

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically handle form submission logic
    console.log({
      location,
      businessDescription,
      askingPrice,
      establishedYear,
      numEmployees,
      monthlyRent,
      leaseExpiration,
      locationSize,
      grossYearlyRevenue,
      cashFlow,
      productsInventory,
      equipmentValue,
      reasonForSelling,
      listOfDevices,
      offeredServices,
      supportAndTraining,
      image
    });
  };

  // Handler for image file change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <main className="flex items-center justify-center bg-gray-100 p-6 md:p-16">
      <div className="w-full max-w-6xl bg-white p-8 rounded-lg border shadow-lg border-blue-500">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Add Business Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Use Flexbox for form layout */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div className="flex flex-col">
              <label htmlFor="location" className="text-gray-700 text-sm font-medium mb-1">Location *</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Business Description */}
            <div className="flex flex-col ">
              <label htmlFor="businessDescription" className="text-gray-700 text-sm font-medium mb-1">Business Description *</label>
              <textarea
                id="businessDescription"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                rows="4"
                required
              />
            </div>

            {/* Asking Price */}
            <div className="flex flex-col">
              <label htmlFor="askingPrice" className="text-gray-700 text-sm font-medium mb-1">Asking Price ($$) *</label>
              <input
                type="number"
                id="askingPrice"
                min={0}
                value={askingPrice}
                onChange={(e) => setAskingPrice(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Established Year */}
            <div className="flex flex-col">
              <label htmlFor="establishedYear" className="text-gray-700 text-sm font-medium mb-1">Established in (Year) *</label>
              <input
                type="number"
                id="establishedYear"
                min={1900}
                max={new Date().getFullYear()}
                value={establishedYear}
                onChange={(e) => setEstablishedYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Number of Employees/Providers */}
            <div className="flex flex-col">
              <label htmlFor="numEmployees" className="text-gray-700 text-sm font-medium mb-1">Number of Employees/Providers *</label>
              <input
                type="number"
                id="numEmployees"
                min={0}
                value={numEmployees}
                onChange={(e) => setNumEmployees(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Monthly Rent */}
            <div className="flex flex-col">
              <label htmlFor="monthlyRent" className="text-gray-700 text-sm font-medium mb-1">Location Monthly Rent including Sale Taxes ($$) *</label>
              <input
                type="number"
                id="monthlyRent"
                min={0}
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Lease Expiration Date */}
            <div className="flex flex-col">
              <label htmlFor="leaseExpiration" className="text-gray-700 text-sm font-medium mb-1">Lease Expiration Date *</label>
              <input
                type="date"
                id="leaseExpiration"
                value={leaseExpiration}
                onChange={(e) => setLeaseExpiration(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Business Location Size */}
            <div className="flex flex-col">
              <label htmlFor="locationSize" className="text-gray-700 text-sm font-medium mb-1">Business Location Size (Square Feet) *</label>
              <input
                type="number"
                id="locationSize"
                min={0}
                value={locationSize}
                onChange={(e) => setLocationSize(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Gross Yearly Revenue */}
            <div className="flex flex-col">
              <label htmlFor="grossYearlyRevenue" className="text-gray-700 text-sm font-medium mb-1">Gross Yearly Revenue ($$) *</label>
              <input
                type="number"
                id="grossYearlyRevenue"
                min={0}
                value={grossYearlyRevenue}
                onChange={(e) => setGrossYearlyRevenue(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Cash Flow */}
            <div className="flex flex-col">
              <label htmlFor="cashFlow" className="text-gray-700 text-sm font-medium mb-1">Cash Flow ($$) *</label>
              <input
                type="number"
                id="cashFlow"
                min={0}
                value={cashFlow}
                onChange={(e) => setCashFlow(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Products Inventory */}
            <div className="flex flex-col">
              <label htmlFor="productsInventory" className="text-gray-700 text-sm font-medium mb-1">Products Inventory ($$) *</label>
              <input
                type="number"
                id="productsInventory"
                min={0}
                value={productsInventory}
                onChange={(e) => setProductsInventory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Equipment Value */}
            <div className="flex flex-col">
              <label htmlFor="equipmentValue" className="text-gray-700 text-sm font-medium mb-1">Equipment Value ($$) *</label>
              <input
                type="number"
                id="equipmentValue"
                min={0}
                value={equipmentValue}
                onChange={(e) => setEquipmentValue(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Reason for Selling */}
            <div className="flex flex-col ">
              <label htmlFor="reasonForSelling" className="text-gray-700 text-sm font-medium mb-1">Reason for Selling *</label>
              <textarea
                id="reasonForSelling"
                value={reasonForSelling}
                onChange={(e) => setReasonForSelling(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                rows="4"
                required
              />
            </div>

            {/* List of Devices */}
            <div className="flex flex-col ">
              <label htmlFor="listOfDevices" className="text-gray-700 text-sm font-medium mb-1">List of Devices *</label>
              <textarea
                id="listOfDevices"
                value={listOfDevices}
                onChange={(e) => setListOfDevices(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                rows="4"
                required
              />
            </div>

            {/* Offered Services */}
            <div className="flex flex-col ">
              <label htmlFor="offeredServices" className="text-gray-700 text-sm font-medium mb-1">Offered Services *</label>
              <textarea
                id="offeredServices"
                value={offeredServices}
                onChange={(e) => setOfferedServices(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                rows="4"
                required
              />
            </div>

            {/* Support and Training */}
            <div className="flex flex-col ">
              <label htmlFor="supportAndTraining" className="text-gray-700 text-sm font-medium mb-1">Support and Training Offered (Time) *</label>
              <textarea
                id="supportAndTraining"
                value={supportAndTraining}
                onChange={(e) => setSupportAndTraining(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                rows="4"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col ">
              <label htmlFor="image" className="text-gray-700 text-sm font-medium mb-1">Business Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg transform transition-transform duration-300 hover:scale-105"
            >
              Add Business Listing
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddBusinessForm;
