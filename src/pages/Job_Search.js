// src/AddJobSearchForm.js
import React, { useState } from 'react';

const AddJobSearchForm = () => {
  // State hooks for form fields
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [qualification, setQualification] = useState('');
  const [positionDescription, setPositionDescription] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [availability, setAvailability] = useState('');
  const [requestedSalary, setRequestedSalary] = useState('');
  const [resume, setResume] = useState(null);

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically handle form submission logic
    console.log({
      location,
      name,
      qualification,
      positionDescription,
      yearsOfExperience,
      availability,
      requestedSalary,
      resume
    });
  };

  // Handler for file upload
  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg border shadow-lg border-blue-500">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Job Search Listing</h1>

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

            {/* Name and Lastname */}
            <div className="flex flex-col">
              <label htmlFor="name" className="text-gray-700 text-sm font-medium mb-1">Name and Lastname *</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Qualification */}
            <div className="flex flex-col">
              <label htmlFor="qualification" className="text-gray-700 text-sm font-medium mb-1">Qualification *</label>
              <select
                id="qualification"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              >
                <option value="">Select a qualification</option>
                <option value="Medical Director">Medical Director</option>
                <option value="ARPN Nurse practitioner">ARPN Nurse Practitioner</option>
                <option value="Registered Nurse">Registered Nurse</option>
                <option value="Medical Assistant">Medical Assistant</option>
                <option value="Aesthetician">Aesthetician</option>
                <option value="Laser Technician">Laser Technician</option>
                <option value="Massage Therapist">Massage Therapist</option>
                <option value="Front Desk Clerk">Front Desk Clerk</option>
              </select>
            </div>

            {/* Position Requested Description */}
            <div className="flex flex-col col-span-2">
              <label htmlFor="positionDescription" className="text-gray-700 text-sm font-medium mb-1">Position Requested Description *</label>
              <textarea
                id="positionDescription"
                value={positionDescription}
                onChange={(e) => setPositionDescription(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                rows="4"
                required
              />
            </div>

            {/* Years of Experience */}
            <div className="flex flex-col">
              <label htmlFor="yearsOfExperience" className="text-gray-700 text-sm font-medium mb-1">Years of Experience *</label>
              <input
                type="number"
                id="yearsOfExperience"
                min={0}
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Availability */}
            <div className="flex flex-col">
              <label htmlFor="availability" className="text-gray-700 text-sm font-medium mb-1">Availability *</label>
              <select
                id="availability"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              >
                <option value="">Select availability</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
              </select>
            </div>

            {/* Requested Yearly Salary */}
            <div className="flex flex-col">
              <label htmlFor="requestedSalary" className="text-gray-700 text-sm font-medium mb-1">Requested Yearly Salary ($$) *</label>
              <input
                type="number"
                id="requestedSalary"
                min={0}
                value={requestedSalary}
                onChange={(e) => setRequestedSalary(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Upload Resume */}
            <div className="flex flex-col col-span-2">
              <label htmlFor="resume" className="text-gray-700 text-sm font-medium mb-1">Upload Resume *</label>
              <input
                type="file"
                id="resume"
                onChange={handleFileChange}
                className="border border-gray-300 rounded-lg py-2 px-3 text-sm"
                required
              />
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
              type="submit"
            >
              Submit Job Search Listing
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddJobSearchForm;
