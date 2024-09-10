// src/AddRoomForRentForm.js
import React, { useState } from 'react';

const AddRoomForRentForm = () => {
  // State hooks for form fields
  const [location, setLocation] = useState('');
  const [roomSize, setRoomSize] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [insurance, setInsurance] = useState('');
  const [allowedUses, setAllowedUses] = useState([]);
  const [rentalTerms, setRentalTerms] = useState('');
  const [wifiAvailable, setWifiAvailable] = useState('');
  const [otherDetails, setOtherDetails] = useState('');

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically handle form submission logic
    console.log({
      location,
      roomSize,
      monthlyRent,
      deposit,
      insurance,
      allowedUses,
      rentalTerms,
      wifiAvailable,
      otherDetails
    });
  };

  // Handler to toggle allowed uses
  const handleAllowedUsesChange = (e) => {
    const { value, checked } = e.target;
    setAllowedUses(prev => 
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg border shadow-lg border-blue-500">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Room for Rent Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Room Size */}
            <div className="flex flex-col">
              <label htmlFor="roomSize" className="text-gray-700 text-sm font-medium mb-1">Room Size (square feet) *</label>
              <input
                type="number"
                id="roomSize"
                min={0}
                value={roomSize}
                onChange={(e) => setRoomSize(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Monthly Rent */}
            <div className="flex flex-col">
              <label htmlFor="monthlyRent" className="text-gray-700 text-sm font-medium mb-1">Monthly Rent ($$) *</label>
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

            {/* Deposit */}
            <div className="flex flex-col">
              <label htmlFor="deposit" className="text-gray-700 text-sm font-medium mb-1">Deposit ($$) *</label>
              <input
                type="number"
                id="deposit"
                min={0}
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Minimum Insurance Requested */}
            <div className="flex flex-col">
              <label htmlFor="insurance" className="text-gray-700 text-sm font-medium mb-1">Minimum Insurance Requested ($$) *</label>
              <input
                type="number"
                id="insurance"
                min={0}
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Type of Use Allowed */}
            <div className="flex flex-col col-span-2">
              <label className="text-gray-700 text-sm font-medium mb-1">Type of Use Allowed *</label>
              <div className="space-y-2">
                {[
                  'Skin care',
                  'Medical aesthetic',
                  'Massage therapy',
                  'General Medical',
                  'Permanent Makeup',
                  'Nails',
                  'Eyelashes',
                  'Wax'
                ].map(option => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={option}
                      checked={allowedUses.includes(option)}
                      onChange={handleAllowedUsesChange}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded"
                    />
                    <span className="text-gray-700 text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rental Terms */}
            <div className="flex flex-col">
              <label htmlFor="rentalTerms" className="text-gray-700 text-sm font-medium mb-1">Rental Terms *</label>
              <select
                id="rentalTerms"
                value={rentalTerms}
                onChange={(e) => setRentalTerms(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              >
                <option value="">Select rental terms</option>
                <option value="Monthly to month">Monthly to Month</option>
                <option value="6 months">6 Months</option>
                <option value="12 months">12 Months</option>
              </select>
            </div>

            {/* Wi-Fi Available */}
            <div className="flex flex-col">
              <label htmlFor="wifiAvailable" className="text-gray-700 text-sm font-medium mb-1">Wi-Fi Available *</label>
              <select
                id="wifiAvailable"
                value={wifiAvailable}
                onChange={(e) => setWifiAvailable(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Other Details */}
            <div className="flex flex-col col-span-2">
              <label htmlFor="otherDetails" className="text-gray-700 text-sm font-medium mb-1">Other Details</label>
              <textarea
                id="otherDetails"
                value={otherDetails}
                onChange={(e) => setOtherDetails(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                rows="4"
              />
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
              type="submit"
            >
              Submit Room for Rent Listing
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddRoomForRentForm;
