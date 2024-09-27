// import React from 'react';
// import { Link } from 'react-router-dom';
// import { HiNewspaper, HiCube, HiOfficeBuilding, HiSearch, HiBriefcase, HiHome } from 'react-icons/hi';

// const categories = [
//   { path: '/Used_Equipment_Listing', label: 'Post Used Equipments for Sale', icon: <HiCube className="w-6 h-6" /> },
//   { path: '/New_Equipment_listing', label: 'Post New Equipments for Sale', icon: <HiNewspaper className="w-6 h-6" /> },
//   { path: '/Business_Equipment_listing', label: 'Post SPA Business for Sale', icon: <HiOfficeBuilding className="w-6 h-6" /> },
//   { path: '/Job_Search_listing', label: 'Post Provider Job Search', icon: <HiSearch className="w-6 h-6" /> },
//   { path: '/Job_Provider_listing', label: 'Post Provider Job Offer', icon: <HiBriefcase className="w-6 h-6" /> },
//   { path: '/Rent_Room_listing', label: 'Post a Spa Room for Rent', icon: <HiHome className="w-6 h-6" /> },
// ];

// const CategorySelector = () => {
//   return (
//     <main className="flex justify-center items-center bg-gray-100 p-20 max-sm:p-5">
//       <div className="w-full max-w-lg bg-white border border-blue-500 shadow-lg  p-8">
//         <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">Choose a Category</h1>
//         <div className="space-y-4">
//           {categories.map(({ path, label, icon }) => (
//             <Link
//               to={path}
//               key={path}
//               className="block w-full py-3 px-4 text-white bg-blue-500 border-b-4 border-blue-700 hover:bg-blue-400 hover:border-blue-500  shadow-lg transition-transform transform hover:scale-105"
//             >
//               <div className="flex items-center space-x-4">
//                 {icon}
//                 <span className="text-lg font-medium">{label}</span>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// };

// export default CategorySelector;



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiNewspaper, HiCube, HiOfficeBuilding, HiSearch, HiBriefcase, HiHome } from 'react-icons/hi';

const categories = [
  { path: '/Used_Equipment_Listing', label: 'Post Used Equipments for Sale', icon: <HiCube className="w-6 h-6" /> },
  { path: '/New_Equipment_listing', label: 'Post New Equipments for Sale', icon: <HiNewspaper className="w-6 h-6" /> },
  { path: '/Business_Equipment_listing', label: 'Post SPA Business for Sale', icon: <HiOfficeBuilding className="w-6 h-6" /> },
  { path: '/Job_Search_listing', label: 'Post Provider Job Search', icon: <HiSearch className="w-6 h-6" /> },
  { path: '/Job_Provider_listing', label: 'Post Provider Job Offer', icon: <HiBriefcase className="w-6 h-6" /> },
  { path: '/Rent_Room_listing', label: 'Post a Spa Room for Rent', icon: <HiHome className="w-6 h-6" /> },
];

const CategorySelector = () => {
  const [availableCredits, setAvailableCredits] = useState(0); // State to track available credits

  useEffect(() => {
    // Simulate fetching available credits from an API or local storage
    const credits = localStorage.getItem('credits') || 0; // Simulate getting credits from localStorage
    setAvailableCredits(parseInt(credits));
  }, []);

  const handleBuyCredits = () => {
    // Redirect to the checkout page when buying credits
    window.open(`https://www.medspatrader.com/cart/45681550131453:1`, "_blank");
  };

  const handleCategoryClick = (e, path) => {
    if (availableCredits === 0) {
      e.preventDefault(); // Prevent the link from being followed
      alert("You need to buy credits to use this feature. Please purchase credits to proceed."); // Show alert message
    } else {
      // Proceed to the category path
      window.location.href = path;
    }
  };

  return (
    <main className="flex justify-center items-center bg-gray-100 p-20 max-sm:p-5">
      <div className="w-full max-w-lg bg-white border border-blue-500 shadow-lg p-8">
        <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">Choose a Category</h1>

        {/* Available Credits Box and Buy Credits Button */}
        <div className="flex mb-4">
          <div className="bg-blue-100 text-blue-800 p-3 rounded-lg shadow-md text-center flex-1 transition-transform transform ">
            <span className="font-bold">Available Credits: {availableCredits}</span>
          </div>
          {availableCredits === 0 && (
            <button
              onClick={handleBuyCredits}
              className="bg-red-100 text-red-800 p-3 rounded-lg shadow-md text-center flex-1 ml-2 transition-transform transform hover:bg-red-200"
            >
              Buy Credits
            </button>
          )}
        </div>

        {/* Used Equipment Listing with Free Listing Label */}
        <Link
          to="/Used_Equipment_Listing"
          className="block w-full py-2 px-3 text-white bg-blue-500 border-b-4 border-blue-700 hover:bg-blue-400 hover:border-blue-500 shadow-lg transition-transform transform hover:scale-105 mb-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <HiCube className="w-6 h-6" />
              <span className="text-lg font-medium">Post Used Equipments for Sale</span>
            </div>
            <div className="border border-green-500 text-green-800 p-1 rounded-md flex items-center justify-center">
              <span className="font-medium">Free Listing</span>
            </div>
          </div>
        </Link>

        {/* Render Remaining Categories with Paid Listing Label */}
        {categories.slice(1).map(({ path, label, icon }) => (
          <Link
            to={path}
            key={path}
            className="block w-full py-2 px-3 text-white bg-blue-500 border-b-4 border-blue-700 hover:bg-blue-400 hover:border-blue-500 shadow-lg transition-transform transform hover:scale-105 mb-4"
            onClick={(e) => handleCategoryClick(e, path)} // Attach click handler for other categories
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {icon}
                <span className="text-lg font-medium">{label}</span>
              </div>
              <div className="border border-yellow-500 text-yellow-800 p-1 rounded-md flex items-center justify-center">
                <span className="font-medium">Paid Listing</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default CategorySelector;
