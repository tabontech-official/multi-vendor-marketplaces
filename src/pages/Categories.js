import React from 'react';
import { Link } from 'react-router-dom';
import { HiNewspaper, HiCube, HiOfficeBuilding, HiSearch, HiBriefcase, HiHome } from 'react-icons/hi';

const categories = [
  { path: '/New_Equipment_listing', label: 'Post New Equipments for Sale', icon: <HiNewspaper className="w-6 h-6" /> },
  { path: '/Used_Equipment_Listing', label: 'Post Used Equipments for Sale', icon: <HiCube className="w-6 h-6" /> },
  { path: '/Business_Equipment_listing', label: 'Post SPA Business for Sale', icon: <HiOfficeBuilding className="w-6 h-6" /> },
  { path: '/Job_Search_listing', label: 'Post Provider Job Search', icon: <HiSearch className="w-6 h-6" /> },
  { path: '/Job_Provider_listing', label: 'Post Provider Job Offer', icon: <HiBriefcase className="w-6 h-6" /> },
  { path: '/Rent_Room_listing', label: 'Post a Spa Room for Rent', icon: <HiHome className="w-6 h-6" /> },
];

const CategorySelector = () => {
  return (
    <main className="flex justify-center items-center bg-gray-100 p-20 max-sm:p-5">
      <div className="w-full max-w-lg bg-white border border-blue-500 shadow-lg  p-8">
        <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">Choose a Category</h1>
        <div className="space-y-4">
          {categories.map(({ path, label, icon }) => (
            <Link
              to={path}
              key={path}
              className="block w-full py-3 px-4 text-white bg-blue-500 border-b-4 border-blue-700 hover:bg-blue-400 hover:border-blue-500  shadow-lg transition-transform transform hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                {icon}
                <span className="text-lg font-medium">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CategorySelector;
