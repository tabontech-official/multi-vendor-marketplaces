import React, { useState } from 'react';

const ProviderSearchForm = () => {
  // State hooks for form fields
  const [location, setLocation] = useState('');
  const [qualification, setQualification] = useState('');
  const [jobType, setJobType] = useState('');
  const [jobOfferType, setJobOfferType] = useState('');
  const [offeredSalary, setOfferedSalary] = useState('');
  const [positionDescription, setPositionDescription] = useState('');
  const [image, setImage] = useState(null);
  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically handle form submission logic
    console.log({
      location,
      qualification,
      jobType,
      jobOfferType,
      offeredSalary,
      positionDescription
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <main className="flex items-center justify-center bg-gray-100 p-6 sm:p-8 md:p-8 lg:p-20">
      <div className="w-full max-w-full lg:max-w-4xl bg-white p-6 sm:p-8 lg:p-10 rounded-lg border shadow-lg border-blue-500">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center">Provider Search Listing</h1>

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

            {/* Qualification Requested */}
            <div className="flex flex-col">
              <label htmlFor="qualification" className="text-gray-700 text-sm font-medium mb-1">Qualification Requested *</label>
              <select
                id="qualification"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              >
                <option value="">Select a qualification</option>
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

            {/* Job Type */}
            <div className="flex flex-col">
              <label htmlFor="jobType" className="text-gray-700 text-sm font-medium mb-1">Job Type *</label>
              <select
                id="jobType"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              >
                <option value="">Select a job type</option>
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              >
                <option value="">Select job offer type</option>
                <option value="Employee W2">Employee W2</option>
                <option value="Freelance Provider 1099">Freelance Provider 1099</option>
              </select>
            </div>

            {/* Offered Yearly Salary */}
            <div className="flex flex-col">
              <label htmlFor="offeredSalary" className="text-gray-700 text-sm font-medium mb-1">Offered Yearly Salary ($$) *</label>
              <input
                type="number"
                id="offeredSalary"
                min={0}
                value={offeredSalary}
                onChange={(e) => setOfferedSalary(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Offered Position Description */}
            <div className="flex flex-col col-span-1 ">
              <label htmlFor="positionDescription" className="text-gray-700 text-sm font-medium mb-1">Offered Position Description *</label>
              <textarea
                id="positionDescription"
                value={positionDescription}
                onChange={(e) => setPositionDescription(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                rows="4"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="image" className="text-gray-700 text-sm font-medium mb-1">Equipment Image</label>
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg transform transition-transform duration-300 hover:scale-105 flex items-center space-x-2"
            >
              Submit Provider Search Listing
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ProviderSearchForm;
