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

// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { HiNewspaper, HiCube, HiOfficeBuilding, HiSearch, HiBriefcase, HiHome } from 'react-icons/hi';
// import { Dialog } from '@headlessui/react';
// import { FaTimes, FaShoppingBasket } from 'react-icons/fa';

// const categories = [
//   { path: '/Used_Equipment_Listing', label: 'Post Used Equipments for Sale', icon: <HiCube className="w-6 h-6" />, isFree: true },
//   { path: '/New_Equipment_listing', label: 'Post New Equipments for Sale', icon: <HiNewspaper className="w-6 h-6" />, isFree: false },
//   { path: '/Business_Equipment_listing', label: 'Post SPA Business for Sale', icon: <HiOfficeBuilding className="w-6 h-6" />, isFree: false },
//   { path: '/Job_Search_listing', label: 'Post Provider Job Search', icon: <HiSearch className="w-6 h-6" />, isFree: false },
//   { path: '/Job_Provider_listing', label: 'Post Provider Job Offer', icon: <HiBriefcase className="w-6 h-6" />, isFree: false },
//   { path: '/Rent_Room_listing', label: 'Post a Spa Room for Rent', icon: <HiHome className="w-6 h-6" />, isFree: false },
// ];

// const CategorySelector = () => {
//   const [credits, setCredits] = useState(0);
//   const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state
//   const [quantity, setQuantity] = useState(1);
//   const pricePerCredit = 10; // Example price per credit
//   const dialogRef = useRef(null); // Ref for dialog
//   const [errorMessage, setErrorMessage] = useState('');

//   // Fetching credits from localStorage
//   useEffect(() => {
//     const storedCredits = localStorage.getItem('availableCredits');
//     if (storedCredits) {
//       setCredits(parseInt(storedCredits, 10));
//     }
//   }, []);

//   const handleBuyNow = () => {
//     const buyCreditUrl = `https://www.medspatrader.com/cart/45681550131453:${quantity}`;
//     window.open(buyCreditUrl, "_blank"); // Open the URL in a new tab
//   };

//   const handleClickOutside = (event) => {
//     if (dialogRef.current && !dialogRef.current.contains(event.target)) {
//       setIsDialogOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleCategoryClick = (isFree) => {
//     if (isFree || credits > 0) {
//       return true;
//     } else {
//       setErrorMessage("You have no available credits. Please purchase credits to use this feature.");
//       return false;
//     }
//   };

//   return (
//     <main className="flex justify-center items-center bg-gray-100 p-20 max-sm:p-5">
//       <div className="w-full max-w-lg bg-white border border-blue-500 shadow-lg p-8">
//         <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">Choose a Category</h1>

//         {/* Available Credits Section */}
//         <div className="mb-6 flex justify-between items-center">
//           <span className="text-lg font-medium text-gray-800">Available Credits: {credits}</span>
//           <button
//             onClick={() => setIsDialogOpen(true)} // Open dialog on button click
//             className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded flex items-center"
//           >
//             Buy Credits <FaShoppingBasket className="ml-1" />
//           </button>
//         </div>

//         {/* Error Message */}
//         {errorMessage && (
//           <div className="mb-4 text-red-500 font-semibold text-center">
//             {errorMessage}
//           </div>
//         )}

//         {/* Categories List */}
//         <div className="space-y-4">
//           {categories.map(({ path, label, icon, isFree }) => {
//             const isDisabled = !isFree && credits <= 0;
//             return (
//               <Link
//                 to={isDisabled ? "#" : path}
//                 key={path}
//                 onClick={(e) => {
//                   if (isDisabled) {
//                     e.preventDefault(); // Prevent navigation if credits are insufficient
//                     setErrorMessage("You have no available credits. Please purchase credits to use this feature.");
//                   } else {
//                     setErrorMessage(''); // Clear error message on valid click
//                   }
//                 }}
//                 className={`block w-full py-3 px-4 text-white border-b-4 shadow-lg transition-transform transform hover:scale-105 ${
//                   isDisabled 
//                     ? 'bg-gray-300 border-gray-400 ' // Gray background and border when disabled
//                     : 'bg-blue-500 border-blue-500 hover:bg-blue-400' // Blue background and border when enabled
//                 }`}
//               >
//                 <div className="flex items-center justify-between space-x-4">
//                   <div className="flex items-center space-x-4">
//                     {icon}
//                     <span className="text-lg font-medium">{label}</span>
//                   </div>
//                   <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isFree ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
//                     {isFree ? 'Free' : 'Paid'}
//                   </span>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>

//       {/* Dialog for buying credits */}
//       <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className="fixed inset-0 z-10 overflow-y-auto">
//         <div className="flex items-center justify-center min-h-screen px-4">
//           <div ref={dialogRef} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg border border-black relative">
//             <button
//               onClick={() => setIsDialogOpen(false)}
//               className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//             >
//               <FaTimes size={20} />
//             </button>

//             <h2 className="text-2xl font-bold mb-1">Buy Credits</h2>
//             <span className="text-base">10$/credit</span>

//             <div className="flex items-center justify-between mb-4 mt-2">
//               <label htmlFor="quantity" className="font-medium">Quantity:</label>
//               <div className="flex items-center">
//                 <button
//                   onClick={() => setQuantity(q => Math.max(1, q - 1))}
//                   className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-4 rounded-l transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//                 >
//                   -
//                 </button>
//                 <input
//                   id="quantity"
//                   type="number"
//                   value={quantity}
//                   onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
//                   className="border border-gray-300 rounded text-center w-16 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
//                   min="1"
//                 />
//                 <button
//                   onClick={() => setQuantity(q => q + 1)}
//                   className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-4 rounded-r transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             <div className="mb-6">
//               <span className="text-lg font-bold">Price: {quantity * pricePerCredit}$</span>
//             </div>

//             <button
//               onClick={handleBuyNow}
//               className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded flex justify-center items-center"
//             >
//               Buy Now <FaShoppingBasket className="ml-2" />
//             </button>
//           </div>
//         </div>
//       </Dialog>
//     </main>
//   );
// };

// export default CategorySelector;

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiNewspaper, HiCube, HiOfficeBuilding, HiSearch, HiBriefcase, HiHome } from 'react-icons/hi';
import { Dialog } from '@headlessui/react';
import { FaTimes, FaShoppingBasket } from 'react-icons/fa';
import { useAuthContext } from '../Hooks/useAuthContext';

const categories = [
  { path: '/Used_Equipment_Listing', label: 'Post Used Equipments for Sale', icon: <HiCube className="w-6 h-6" />, isFree: true },
  { path: '/New_Equipment_listing', label: 'Post New Equipments for Sale', icon: <HiNewspaper className="w-6 h-6" />, isFree: false },
  { path: '/Business_Equipment_listing', label: 'Post SPA Business for Sale', icon: <HiOfficeBuilding className="w-6 h-6" />, isFree: false },
  { path: '/Job_Search_listing', label: 'Post Provider Job Search', icon: <HiSearch className="w-6 h-6" />, isFree: false },
  { path: '/Job_Provider_listing', label: 'Post Provider Job Offer', icon: <HiBriefcase className="w-6 h-6" />, isFree: false },
  { path: '/Rent_Room_listing', label: 'Post a Spa Room for Rent', icon: <HiHome className="w-6 h-6" />, isFree: false },
];

const CategorySelector = () => {
  const [credits, setCredits] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const pricePerCredit = 10; // Example price per credit
  const dialogRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuthContext();

  // Fetching credits from localStorage and server
  useEffect(() => {
    const fetchQuantity = async () => {
      const id = localStorage.getItem('userid');
      if (!id) return;
      try {
        const response = await fetch(`https://medspaa.vercel.app/auth/quantity/${id}`, { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          const fetchedCredits = data.quantity || 0; // Set available credits from server
          setCredits(fetchedCredits);
          localStorage.setItem('availableCredits', fetchedCredits); // Store in local storage
        }
      } catch (error) {
        console.error('Error fetching quantity:', error);
      }
    };
    fetchQuantity();
  }, []);

  const handleBuyNow = () => {
    const buyCreditUrl = `https://www.medspatrader.com/cart/45681550131453:${quantity}`;
    window.open(buyCreditUrl, "_blank");
  };

  const handleClickOutside = (event) => {
    if (dialogRef.current && !dialogRef.current.contains(event.target)) {
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (isFree) => {
    if (isFree || credits > 0) {
      return true;
    } else {
      setErrorMessage("You have no available credits. Please purchase credits to use this feature.");
      return false;
    }
  };

  return (
    <main className="flex justify-center items-center bg-gray-100 p-20 max-sm:p-5">
      <div className="w-full max-w-lg bg-white border border-blue-500 shadow-lg p-8">
        <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">Choose a Category</h1>

        {/* Available Credits Section */}
        <div className="mb-6 flex justify-between items-center">
          <span className="text-lg font-medium text-gray-800">Available Credits: {credits}</span>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            Buy Credits <FaShoppingBasket className="ml-1" />
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 text-red-500 font-semibold text-center">
            {errorMessage}
          </div>
        )}

        {/* Categories List */}
        <div className="space-y-4">
          {categories.map(({ path, label, icon, isFree }) => {
            const isDisabled = !isFree && credits <= 0;
            return (
              <Link
                to={isDisabled ? "#" : path}
                key={path}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                    setErrorMessage("You have no available credits. Please purchase credits to use this feature.");
                  } else {
                    setErrorMessage(''); // Clear error message on valid click
                  }
                }}
                className={`block w-full py-3 px-4 text-white border-b-4 shadow-lg transition-transform transform hover:scale-105 ${
                  isDisabled 
                    ? 'bg-gray-300 border-gray-400 ' 
                    : 'bg-blue-500 border-blue-500 hover:bg-blue-400'
                }`}
              >
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    {icon}
                    <span className="text-lg font-medium">{label}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isFree ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {isFree ? 'Free' : 'Paid'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Dialog for buying credits */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div ref={dialogRef} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg border border-black relative">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-1">Buy Credits</h2>
            <span className="text-base">10$/credit</span>

            <div className="flex items-center justify-between mb-4 mt-2">
              <label htmlFor="quantity" className="font-medium">Quantity:</label>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-4 rounded-l transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  -
                </button>
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="border border-gray-300 rounded text-center w-16 py-1 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-4 rounded-r transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-lg font-bold">Price: {quantity * pricePerCredit}$</span>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded flex justify-center items-center"
            >
              Buy Now <FaShoppingBasket className="ml-2" />
            </button>
          </div>
        </div>
      </Dialog>
    </main>
  );
};

export default CategorySelector;
