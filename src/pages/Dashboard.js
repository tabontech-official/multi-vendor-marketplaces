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
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState('');
  const [credit, setCredit] = useState(0); // Credit state
  const { user } = useAuthContext();
  const dropdownRefs = useRef([]);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const OnEdit = (product) => {
    let formPage = '';
    switch (product.product_type) {
      case 'Used Equipment':
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
    const userId = localStorage.getItem('userid');
    setLoadingId(product.id);
    setMessage('');

    try {
      const response = await fetch(`https://medspaa.vercel.app/product/publishedProduct/${product.id}`, {
        method: 'PUT',
      });

      if (response.ok) {
        setMessage('Product published successfully!');
      } else {
        setMessage(`You don't have enough credits.`);
      }
    } catch (error) {
      console.error('Error publishing product:', error);
      setMessage('An error occurred while publishing the product.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleUnpublish = async (product) => {
    setLoadingId(product.id);
    setMessage('');

    try {
      const response = await fetch(`https://medspaa.vercel.app/product/unpublished/${product.id}`, {
        method: 'PUT',
      });

      if (response.ok) {
        setMessage('Product unpublished successfully!');
      } else {
        setMessage('Failed to unpublish product.');
      }
    } catch (error) {
      console.error('Error unpublishing product:', error);
      setMessage('An error occurred while unpublishing the product.');
    } finally {
      setLoadingId(null);
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
          console.log(data)
          setProducts(data.products);
          setFilteredProducts(data.products);
        }
      } catch (error) {
        setMessage("You don't have enough credits");
      }

      try {
        const response = await fetch(`https://medspaa.vercel.app/auth/quantity/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCredit(data.quantity || 0);
        }
      } catch (error) {
        console.error('Error fetching quantity:', error);
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
      {/* Message Display */}
      {message && <div className="mb-4 text-red-600">{message}</div>}

      {/* Credit Display */}
      <div className="mb-4 text-blue-600 font-semibold text-lg">
        <span className={credit === 0 ? 'text-red-500' : ''}> Available Credits: {credit}</span>
      </div>

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
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr className='items-center'>
              <th className="py-3 pl-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
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
                        <div className="absolute  bg-white border flex justify-start items-start border-gray-300 rounded-md shadow-lg z-10">
                          <ul className="py-1">
                            {product.status === 'draft' ? (
                              <li   onClick={(e) => {
                                e.stopPropagation();
                                handlePublish(product);
                              }}>
                                <button 
                                
                                  className="px-4 w-full py-2 text-gray-700 hover:bg-gray-100"
                                >
                                  {loadingId === product._id ? 'Loading...' : 'Publish'}
                                </button>
                              </li>
                            ) : (
                              product.status === 'active' && (
                                <li  onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnpublish(product);
                                }}>
                                  <button 
                                   
                                    className="px-4 w-full py-2 text-gray-700 hover:bg-gray-100"
                                  >
                                    {loadingId === product._id ? 'Loading...' : 'Unpublish'}
                                  </button>
                                </li>
                              )
                            )}
                            <li   onClick={(e) => {
                                  e.stopPropagation();
                                  OnEdit(product);
                                }} >
                              <button 
                              
                                className="px-4 w-full py-2 text-gray-700 hover:bg-gray-100"
                              >
                                Edit
                              </button>
                            </li>
                            <li>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
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
                  <td className="px-6 py-4 whitespace-nowrap">
 
  {product.title !== "Job Listing" ? product.title : "Job Search Listing"}
  {product.product_type === "Used Equipment" && (
    <span className="bg-blue-100 text-green-800 text-xs font-medium me-2 px-2.5 mx-3 py-0.5 rounded dark:bg-green-900 dark:text-blue-300">
      Free Listing
    </span>
  )}
</td>

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
