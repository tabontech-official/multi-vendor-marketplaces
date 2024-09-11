import React from 'react';
import { Link } from 'react-router-dom';

const CategorySelector = () => {
  return (
    <main className="  flex justify-center items-center bg-gray-100 h-full p-20 max-sm:p-10">
      <div className="w-full max-w-lg bg-white border border-blue-500 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Post a Listing</h1>
        <div className="space-y-4">
          <button
            className="w-full py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-400 transition duration-300"
          >
            <Link to={'/New_Equipment_listing'} className="block text-center">Post New  Equipments for Sale</Link>
          </button>
          <button
            className="w-full py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-400 transition duration-300"
          >
            <Link to={'/Used_Equipment_Listing'} className="block text-center">Post Used Equipments for Sale</Link>
          </button>
          <button
            className="w-full py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-400 transition duration-300"
          >
            <Link to={'/Business_Equipment_listing'} className="block text-center">Post SPA Business for Sale</Link>
          </button>
          <button
            className="w-full py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-400 transition duration-300"
          >
            <Link to={'/Job_Search_listing'} className="block text-center">Post Provider Job Search</Link>
          </button>
          <button
            className="w-full py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-400 transition duration-300"
          >
            <Link to={'/Job_Provider_listing'} className="block text-center">Post Provider Job Offer</Link>
          </button>
          <button
            className="w-full py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-400 transition duration-300"
          >
            <Link to={'/Rent_Room_listing'} className="block text-center">Post a Spa Room for Rent</Link>
          </button>
        </div>
      </div>
    </main>
  );
};

export default CategorySelector;
