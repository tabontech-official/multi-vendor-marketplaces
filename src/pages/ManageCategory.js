import React, { useEffect, useState } from "react";
import { IoPricetagsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ManageCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(""); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://multi-vendor-marketplace.vercel.app/category/getCategory"); 
        const data = await response.json();

        if (response.ok) {
          setCategories(data); 
        } else {
          setError(data.message); 
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("An error occurred while fetching categories");
      }
    };

    fetchCategories(); 
  }, []);

  const handleButtonClick = () => {
    navigate("/create-categories");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-2">
          <IoPricetagsOutline size={24} className="text-gray-600" />
          <h1 className="font-semibold text-xl">Collections</h1>
        </div>

        <button
          onClick={handleButtonClick}
          className="bg-gray-800 text-white px-3 py-1 border rounded-md hover:bg-gray-900"
        >
          Create Collection
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>} 

      <table className="w-full border-collapse bg-white border rounded-2xl">
        <thead className="bg-gray-100 text-left text-gray-600 text-sm">
          <tr>
            <th scope="col" className="p-3">Select</th>
            <th scope="col" className="p-3">Title</th>
            <th scope="col" className="p-3">Description</th>
            <th scope="col" className="p-3">Level</th>
            <th scope="col" className="p-3">Parent Category</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr
              key={index}
              className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
            >
              <td className="p-3">
                <input type="checkbox" />
              </td>
               <td
                className="p-3 text-sm hover:underline cursor-pointer"
                onClick={() => {
                  navigate(`/collection/${category._id}`);
                }}
              >
                {category.title}
              </td>
              <td className="p-3 text-sm">{category.description}</td>
              <td className="p-3 text-sm">{category.level}</td>
              <td className="p-3 text-sm">{category.parentCatNo || 'Parent'}</td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCategory;
