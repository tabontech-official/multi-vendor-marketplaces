import React, { useEffect, useState } from 'react';
import { HiDotsVertical, HiPlus, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchVal, setSearchVal] = useState('');

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const onDelete = async (id) => {
    try {
      const response = await fetch(`https://medspaa.vercel.app/product/deleteProduct/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        const data = await response.json(); // Convert response to JSON
  
        // Update state to remove deleted product from the list
        setProducts(products.filter(product => product.id_2 !== id));
        setFilteredProducts(filteredProducts.filter(product => product.id_2 !== id));
      } else {
        console.error('Failed to delete product. Status:', response.status);
        const errorData = await response.json(); // Optional: Get more details about the error
        console.error('Error details:', errorData);
        alert('Failed to delete product.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('An error occurred while deleting the product.');
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      const id = localStorage.getItem('userid');
      
      if (!id) {
        console.error('User ID not found in localStorage.');
        return;
      }

      try {
        const response = await fetch(`https://medspaa.vercel.app/product/getProduct/${id}`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json(); // Convert response to JSON
          console.log(data);
          // Ensure data.products is an array
          if (Array.isArray(data.products)) {
            // Extract and set relevant data
            const extractedData = data.products.map(product => ({
              product_id: product.id,
              id_2 : product._id,
              title: product.title,
              product_type: product.product_type,
              asking_price: product.equipment?.asking_price ?? product.equipment.sale_price, // Use default value if asking_price is undefined
            }));
            setProducts(extractedData);
            setFilteredProducts(extractedData); // Initialize filtered products
          } else {
            console.error('Expected products array, but got:', data.products);
          }
        } else {
          console.error('Failed to fetch product data. Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, []);

  const handleSearch = () => {
    if (searchVal === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchVal.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const clearSearch = () => {
    setSearchVal('');
    setFilteredProducts(products); // Reset to all products
  };

  return (
    <main className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start border-b-2 border-gray-200 pb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">Products</h1>
          <p className="text-gray-600">Here are your products.</p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
          <Link to="/Categories" className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-2">
            <HiPlus className="w-5 h-5" />
            <span>Add Listings</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between items-center mt-4 space-y-4 md:space-y-0">
        {/* Combined Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center w-full md:ml-auto md:space-x-4">
          {/* Filter By Dropdown */}
           



          {/* Search Bar */}
          <div className="flex items-center w-2/4 md:ml-auto justify-end">
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

      <div className="overflow-x-auto p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT NAME</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRICE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No products available</td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr key={product.product_id}>
      
                  <td className="px-6 py-4 whitespace-nowrap">{product.product_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.product_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.asking_price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap relative">
                    <button 
                      onClick={() => toggleDropdown(index)}
                      className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                      <HiDotsVertical className="w-5 h-5" />
                    </button>
                    {openDropdown === index && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                        <ul className="py-1">
                          <li>
                            <button 
                              onClick={() => onDelete(product.id_2)} 
                              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Dashboard;
