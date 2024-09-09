import React, { useState } from 'react';

const VariantDetails = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [variants, setVariants] = useState([]);
  const [newVariant, setNewVariant] = useState({ optionName: '', optionValue: '' });

  const handleAddVariant = () => {
    if (newVariant.optionName && newVariant.optionValue) {
      setVariants([...variants, newVariant]);
      setNewVariant({ optionName: '', optionValue: '' });
      setIsOpen(false); // Close the variant details section
    }
  };

  const handleDeleteVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">VARIANT DETAILS</h2>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white-500 hover:underline  bg-green-500  p-3  rounded-md"
      >
        {isOpen ? 'Cancel' : 'Add Variant'}
      </button>

      {isOpen && (
        <div className="border border-gray-300 p-4 rounded-lg shadow-md">
          <p className="mb-4">Add variant details here, if this product comes in multiple versions, like different sizes or colors.</p>
          <div className="space-y-4 mb-4">
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700">OPTION NAME *</label>
              <input
                type="text"
                value={newVariant.optionName}
                onChange={(e) => setNewVariant({ ...newVariant, optionName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700">OPTION VALUE *</label>
              <input
                type="text"
                value={newVariant.optionValue}
                onChange={(e) => setNewVariant({ ...newVariant, optionValue: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={handleAddVariant}
              className="bg-[#52c058] text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Add Variant
            </button>
          </div>
        </div>
      )}

      {/* Display List of Added Variants */}
      {variants.length > 0 && (
        <div className="border border-gray-300 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Added Variants</h3>
          <ul className="space-y-2">
            {variants.map((variant, index) => (
              <li key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
                <span className="text-gray-700">{`${variant.optionName}: ${variant.optionValue}`}</span>
                <button
                  onClick={() => handleDeleteVariant(index)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VariantDetails;
