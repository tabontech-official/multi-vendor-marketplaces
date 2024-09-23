import React, { useEffect, useRef, useState } from 'react';
import { HiDotsVertical, HiPlus, HiX } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../Hooks/useAuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchVal, setSearchVal] = useState('');
  const { user } = useAuthContext();
  const dropdownRefs = useRef([]);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const OnEdit = (product) => {
    let formPage = '';
    switch (product.product_type) {
      case 'used Equipment':
        formPage = 'Used_Equipment_Listing';
        break;
      case 'New Equipment':
        formPage = 'New_Equipment_listing';
        break;
      case 'Job Listing':
        formPage = 'Job_Search_listing';
        break;
      case 'Provider Search Listing':
        formPage = 'Job_Provider_listing';
        break;
      case 'Room Listing':
        formPage = 'Rent_Room_listing';
        break;
      default:
        console.error('Unknown product type:', product.product_type);
        return;
    }
    navigate(formPage, { state: { product } });
  };

  const onDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`https://medspaa.vercel.app/product/deleteProduct/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProducts(products.filter(product => product._id !== id));
        setFilteredProducts(filteredProducts.filter(product => product._id !== id));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handlePublish = async (product) => {
    let apiEndpoint = '';
    switch (product.product_type) {
      case 'used Equipment':
        apiEndpoint = '/product/addEquipment';
        break;
      case 'New Equipment':
        apiEndpoint = '/product/addNewEquipments';
        break;
      case 'Job Listing':
        apiEndpoint = '/product/addJob';
        break;
      case 'Provider Search Listing':
        apiEndpoint = '/product/addProvider';
        break;
      case 'Room Listing':
        apiEndpoint = '/product/addRoom';
        break;
      default:
        console.error('Unknown product type:', product.product_type);
        return;
    }

    try {
      const response = await fetch(`https://medspaa.vercel.app${apiEndpoint}`, {
        method: 'POST',
        body:  product ,
      });

      if (response.ok) {
        alert('Product published successfully!');
      } else {
        console.error('Failed to publish product. Status:', response.status);
        alert('Failed to publish product.');
      }
    } catch (error) {
      console.error('Error publishing product:', error);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      const id = localStorage.getItem('userid');
      if (!id) return;
      try {
        const response = await fetch(`https://medspaa.vercel.app/product/getProduct/${id}`, { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
          setFilteredProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };
    fetchProductData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdowns = dropdownRefs.current;
      if (dropdowns.every(ref => ref && !ref.contains(event.target))) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    const filtered = searchVal === '' ? products : products.filter(product =>
      product.title.toLowerCase().includes(searchVal.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const clearSearch = () => {
    setSearchVal('');
    setFilteredProducts(products);
  };

  return user ? (
    <main className="w-full p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start border-b-2 border-gray-200 pb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">Listings</h1>
          <p className="text-gray-600">Here are your Listings.</p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
          <Link to="/Categories" className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-2">
            <HiPlus className="w-5 h-5" />
            <span>Add Listings</span>
          </Link>
        </div>
      </div>

      {/* Search Section */}
      <div className="flex flex-col md:flex-row md:justify-between items-center mt-4 space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center w-full md:ml-auto md:space-x-4">
          <div className="flex items-center w-2/4 max-sm:w-full md:ml-auto justify-end">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="md:w-2/4 p-2 max-sm:w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSearch}
              className="ml-2 bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Search
            </button>
            {searchVal && (
              <button 
                onClick={clearSearch}
                className="ml-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                aria-label="Clear Search"
              >
                <HiX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr className='items-center'>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
              <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LISTING NAME</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRICE</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 mb-4">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No products available</td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr key={product._id}>
                  <td className="py-4 whitespace-nowrap relative px-4">
                    <button 
                      onClick={() => toggleDropdown(index)}
                      className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                      <HiDotsVertical className="w-5 h-5" />
                    </button>
                    <div ref={el => dropdownRefs.current[index] = el}>
                      {openDropdown === index && (
                        <div className="absolute w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                          <ul className="py-1">
                            {product.status === 'inactive' && (
                              <li>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent click outside
                                    handlePublish(product);
                                  }}
                                  className="px-4 w-full py-2 text-gray-700 hover:bg-gray-100"
                                >
                                  Publish
                                </button>
                              </li>
                            )}
                            <li>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent click outside
                                  OnEdit(product);
                                }}
                                className="px-4 w-full py-2 text-gray-700 hover:bg-gray-100"
                              >
                                Edit
                              </button>
                            </li>
                            <li>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent click outside
                                  onDelete(product._id);
                                }} 
                                className="px-4 w-full py-2 text-gray-700 hover:bg-gray-100"
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${product.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
                      title={product.status}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.title !== "Job Listing" ? product.title : "Job Search Listing"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.product_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.variants[0].price || "0"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  ) : null;
};

export default Dashboard;
