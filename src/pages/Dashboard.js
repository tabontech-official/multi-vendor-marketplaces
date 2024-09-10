import React, { useState } from 'react';
import { HiDotsVertical, HiPlus } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <>
      <main className="w-full p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:justify-between items-start border-b-2 border-gray-200 pb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold mb-1">Products</h1>
            <p className="text-gray-600">Here are your products.</p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
            <button className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md  transition duration-300 ease-in-out flex items-center space-x-2">
              <HiPlus className="w-5 h-5" />
              <Link to="/Categories" className="ml-2">
                Add Listings
              </Link>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between items-center mt-4 space-y-4 md:space-y-0">
          {/* Combined Filters and Search */}
          <div className="flex flex-col md:flex-row md:items-center w-full  md:ml-auto md:space-x-4  ">
            {/* Filter By Dropdown */}
            <div className="flex items-center md:flex-initial w-full md:w-full max-sm:mb-4 max-sm:flex-col ">
              <label htmlFor="filter-by" className="text-sm text-gray-700 mr-2">Filter By:</label>
              <select id="filter-by" name="filter-by" className="p-2 border border-gray-300 rounded-md md:w-2/4  max-sm:w-full">
                <option value="search-by">Search by SKU</option>
                <option value="approved">Approved</option>
                <option value="disabled">Disabled</option>
                <option value="approval-pending">Approval Pending</option>
                <option value="approval">Re-Approval</option>
                <option value="sold-out">Sold Out</option>
              </select>
            </div>

            {/* Search Bar */}
            <div className="flex items-center w-full md:ml-auto  justify-end">
              <input 
                type="search" 
                placeholder="Search..." 
                className=" md:w-2/4 p-2 max-sm:w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="form-checkbox" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT NAME</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRICE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUANTITY</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="form-checkbox" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">12345</td>
                <td className="px-6 py-4 whitespace-nowrap">Sample Product</td>
                <td className="px-6 py-4 whitespace-nowrap">Normal</td>
                <td className="px-6 py-4 whitespace-nowrap">$99.99</td>
                <td className="px-6 py-4 whitespace-nowrap">50</td>
                <td className="px-6 py-4 whitespace-nowrap">Available</td>
                <td className="px-6 py-4 whitespace-nowrap relative">
                  <button 
                    onClick={() => toggleDropdown(0)}
                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                  >
                    <HiDotsVertical className="w-5 h-5" />
                  </button>
                  {openDropdown === 0 && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      <ul className="py-1">
                        <li>
                          <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">Edit</button>
                        </li>
                        <li>
                          <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">Delete</button>
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
