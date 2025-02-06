import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor'; // Assuming RTC is the custom editor component
import { convertToRaw, EditorState , ContentState ,convertFromRaw } from "draft-js";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CurrencyInput from 'react-currency-input-field';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; 
import { DndProvider } from "react-dnd"; // Import DndProvider
import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend"; // Import HTML5 backend

const ImageItem = ({ image, index, moveImage, handleRemoveImage }) => {
  const [, drag] = useDrag({
    type: "IMAGE",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "IMAGE",
    hover: (item) => {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="flex items-center mb-4 cursor-move"
    >
      <img
        src={image}
        alt={`Preview ${index}`}
        className="border border-gray-300 w-14 h-14 object-cover"
      />
      <div className="ml-4 flex flex-1 items-center">
        <p className="text-sm text-gray-700 flex-1">Image {index + 1}</p>
        <button
          type="button"
          onClick={() => handleRemoveImage(index)}
          className="text-red-500 hover:text-red-700 text-sm ml-4"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};




const AddBusinessListingForm = () => {
  // State hooks for form fields
  const [location, setLocation] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [numEmployees, setNumEmployees] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [leaseExpiration, setLeaseExpiration] = useState('');
  const [locationSize, setLocationSize] = useState('');
  const [grossYearlyRevenue, setGrossYearlyRevenue] = useState('');
  const [cashFlow, setCashFlow] = useState('');
  const [productsInventory, setProductsInventory] = useState('');
  const [equipmentValue, setEquipmentValue] = useState('');
  const [reasonForSelling, setReasonForSelling] = useState('');
  const [listOfDevices, setListOfDevices] = useState('');
  const [offeredServices, setOfferedServices] = useState('');
  const [supportAndTraining, setSupportAndTraining] = useState('');
  const [images, setImages] = useState([]);
    const [imageName, setImageName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [descriptionText, setText] = useState("");
  const [name, setName] = useState('');
  const [Zip , setZip] = useState("")
  const [imagePreviews, setImagePreviews] = useState([]); // Keep previews here
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false);
  const locationData = useLocation()
  const { product } = locationData.state || {};
  const [city , setCity] = useState("")
  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
    "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ]; 


  useEffect(() => {
    if (product) {
      setIsEditing(true);
      const business = product.business || {};
      setLocation(business.location.split("_")[1] || '');
      setCity(business.location.split("_")[0] || '')
      setZip(business.zip || '');
      setName(business.name || '');
      setAskingPrice( product.variants[0].price || '');
      setEstablishedYear(business.establishedYear || '');
      setNumEmployees(business.numberOfEmployees || '');
      setMonthlyRent(business.locationMonthlyRent || '');
      // setLeaseExpiration(parseInt(business.leaseExpirationDate )|| '');
if (business.leaseExpirationDate) {
      // Convert ISO string to YYYY-MM-DD format
      const formattedDate = new Date(business.leaseExpirationDate).toISOString().split('T')[0];
      setLeaseExpiration(formattedDate);
    }
      setLocationSize(business.locationSize || '');
      setGrossYearlyRevenue(business.grossYearlyRevenue || '');
      setCashFlow(business.cashFlow || '');
      setProductsInventory(business.productsInventory || '');
      setEquipmentValue(business.equipmentValue || '');
      setReasonForSelling(business.reasonForSelling || '');
      setListOfDevices(business.listOfDevices || '');
      setOfferedServices(business.offeredServices || '');
      setSupportAndTraining(business.supportAndTraining || '');

         // Clean and set business description
    const rawDescription = product.business.businessDescription || "";
    const textDescrip = rawDescription; // Remove unwanted tags
    setText(textDescrip || "");

    // Set images for business
    if (business.images) {
      setImages(business.images.map(img => img.src));
    }

   
    try {
      // Try parsing description as JSON first
      const parsedContent = JSON.parse(textDescrip);
      const contentState = convertFromRaw(parsedContent);
      setEditorState(EditorState.createWithContent(contentState));
    } catch (error) {
      // If not JSON, assume it's raw HTML or plain text
      const contentBlock = htmlToDraft(textDescrip);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        setEditorState(EditorState.createWithContent(contentState));
      } else {
        setEditorState(EditorState.createEmpty());
      }
    }

      if (product.images && Array.isArray(product.images)) {
        const imageFiles = product.images.map(async(img) => {
          const blob = await fetch(img.src).then((r) => r.blob());
          return new File([blob], img.alt || 'product-image.jpg', { type: 'image/jpeg' });
        });
  
        Promise.all(imageFiles).then((files) => {
          setImages(files);
          setImagePreviews(product.images.map((img) => img.src));
        });
      }

    }
  }, []);
console.log(product)

const onEditorStateChange = (newEditorState) => {
  setEditorState(newEditorState);
};






     // Handler for form submission
     const handleSubmit = async (e, status) => {
      e.preventDefault(); // Prevent form submission
      
      // Reset error and success states
      setError('');
      setSuccess('');
      setLoading(true);
    
      // Convert editor content to HTML and modify it
      const rawContentState = convertToRaw(editorState.getCurrentContent());
      const htmlContent = draftToHtml(rawContentState);
      
      const modifiedContent = htmlContent
        // .replace(/<p>/g, "")
        // .replace(/<\/p>/g, "<br />") // Replace paragraph tags with <br /> or leave empty if you don't want any formatting
        // .replace(/&nbsp;/g, " "); // Remove non-breaking spaces and replace with normal spaces
    
        // .replace(/<p>/g, "") // Remove <p> tags
        // .replace(/<\/p>/g, "<br />") // Replace closing </p> tags with <br />
        // .replace(/<br\s*\/?>\s*<br\s*\/?>/g, "<br />") // Avoid double <br /> tags
        .replace(/&nbsp;/g, " "); // Replace &nbsp; with normal spaces
    


      // Get user ID from local storage
      const id = localStorage.getItem("userid");
    
      // Prepare form data
      const formData = new FormData();
      let fullLocation = `${city}_${location}`;
    
      formData.append('name', name);
      formData.append('location', fullLocation);
      formData.append('zip', Zip);
      formData.append('businessDescription', modifiedContent);
      formData.append('description', descriptionText);
      formData.append('asking_price', askingPrice);
      formData.append('establishedYear', establishedYear);
      formData.append('numberOfEmployees', numEmployees);
      formData.append('locationMonthlyRent', monthlyRent);
      formData.append('leaseExpirationDate', leaseExpiration);
      formData.append('locationSize', locationSize);
      formData.append('grossYearlyRevenue', grossYearlyRevenue);
      formData.append('cashFlow', cashFlow);
      formData.append('productsInventory', productsInventory);
      formData.append('equipmentValue', equipmentValue);
      formData.append('reasonForSelling', reasonForSelling);
      formData.append('listOfDevices', listOfDevices);
      formData.append('offeredServices', offeredServices);
      formData.append('supportAndTraining', supportAndTraining);
      formData.append('userId', id);
    
      if (!isEditing) {
        formData.append('status', status); // Only add status if it's a new listing
      }
    
      try {
        // API URL and method depending on whether editing or creating
        if (images.length === 0) {
          setError('Please Upload Atleast 1 image ');
          setTimeout(() => setError(''), 8000);
          return;
        }
        
        const response = await fetch(isEditing
          ? `https://multi-vendor-marketplace.vercel.app/product/updateListing/${product.id}`
          : 'https://multi-vendor-marketplace.vercel.app/product/addBusiness', {
          method: isEditing ? 'PUT' : 'POST', 
          body: formData,
        });
    
        const json = await response.json();
    
        if (response.ok) {
          // Show success message
          // setSuccess(isEditing ? "Business updated successfully!" : json.message);
          setError(''); // Clear error message
    
          // Handle image uploads to Cloudinary if images exist
          if (images && images.length > 0) {
            const cloudinaryURLs = [];
    
            // Loop through images and upload each to Cloudinary
            for (let i = 0; i < images.length; i++) {
              const formDataImages = new FormData();
              formDataImages.append('file', images[i]);
              formDataImages.append('upload_preset', 'images'); // Cloudinary preset
    
              // Upload the image to Cloudinary
              const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/djocrwprs/image/upload', {
                method: "POST",
                body: formDataImages,
              });
    
              const cloudinaryJson = await cloudinaryResponse.json();
    
              if (cloudinaryResponse.ok) {
                cloudinaryURLs.push(cloudinaryJson.secure_url); // Store the uploaded image URL
                console.log(`Image ${i + 1} uploaded successfully:`, cloudinaryJson.secure_url);
              } else {
                setError(`Error uploading image ${i + 1} to Cloudinary.`);
                setLoading(false);
                return; // Stop if any image upload fails
              }
            }
    
            // Save the Cloudinary URLs to the database
            const imageResponse = await fetch(`https://multi-vendor-marketplace.vercel.app/product/updateImages/${json.product.id}`, {
              method: "PUT",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ images: cloudinaryURLs }), // Send image URLs
            });
    
            const imageJson = await imageResponse.json();
    
            if (imageResponse.ok) {
              console.log("Image URLs saved successfully:", imageJson);
            } else {
              setError('Error saving image URLs in the database.');
              setLoading(false);
              return; // Stop if saving image URLs fails
            }
          }
    
          // Navigate to homepage after success
          navigate("/");
    
        } else {
          // Handle failure (display error message)
          setSuccess('');
          setError(json.error || "An unexpected error occurred.");
          setTimeout(() => setError(''), 5000); // Clear error message after 5 seconds
        }
    
      } catch (error) {
        // Catch any unexpected errors during fetch or image upload
        setSuccess('');
        setError('An unexpected error occurred.');
        setTimeout(() => setError(''), 5000); // Clear error message after 5 seconds
        console.error(error);
      } finally {
        setLoading(false); // Hide loading spinner once done
      }
    };
    
  


  // Handler for image file change
  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files); // Get all selected files
  //   setImages(prevImages => [...prevImages, ...files]); // Store file objects
  //   const newImagePreviews = files.map(file => URL.createObjectURL(file)); // Create object URLs for preview
  //   setImagePreviews(prevPreviews => [...prevPreviews, ...newImagePreviews]); // Append to the existing previews
  // };


  // // Handler to remove image
  // const handleRemoveImage = (index) => {
  //   setImages(prevImages => prevImages.filter((_, i) => i !== index)); // Remove image at the specified index
  //   setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index)); // Remove preview at the specified index
  // };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []); // Ensure files is an array
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    let validImages = [];
    let invalidImages = [];

    files.forEach((file) => {
      if (file.size > maxSize) {
        // If file size exceeds 50MB, add it to the invalidImages array
        invalidImages.push(file);
      } else {
        // Otherwise, add to the validImages array
        validImages.push(file);
      }
    });

    // If there are any invalid images, show an error message
    if (invalidImages.length > 0) {
      setError(
        `The following images exceed the 50MB size limit: ${invalidImages
          .map((file) => file.name)
          .join(", ")}`
      );
    }

    // Add only the valid images to the state
    setImages((prevImages) => [...prevImages, ...validImages]);

    // Preview the valid images
    const newImagePreviews = validImages.map((file) =>
      URL.createObjectURL(file)
    );
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Remove image at the specified index
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    ); // Remove preview at the specified index
  };

  const moveImage = (fromIndex, toIndex) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    setImages(updatedImages);

    const updatedPreviews = [...imagePreviews];
    const [movedPreview] = updatedPreviews.splice(fromIndex, 1);
    updatedPreviews.splice(toIndex, 0, movedPreview);
    setImagePreviews(updatedPreviews);
  };

  
  return (
    <main className="bg-gray-100 min-h-screen p-5 flex-row">
      <h1 className="text-4xl max-sm:text-xl font-bold mb-4">Add New Business Listing</h1>
      <p className="text-lg mb-8 text-gray-700">Here you can add a business to your platform.</p>
      <div className="mb-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </div>
      <div className="flex flex-col lg:flex-row flex-1">
        <div className="flex-1 bg-white px-8 py-4 shadow-md lg:mr-8 mb-8 lg:mb-0">
          <h1 className="text-2xl font-semibold mb-4">Business Details</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Details */}
            <div className="grid grid-cols-1 gap-6">
              {/* Location */}
            
              <div className='flex flex-row max-sm:flex-col  '>
              <div className="flex flex-col flex-1 mr-4 max-sm:mr-0">
  <label htmlFor="location" className="text-gray-700 text-sm font-medium mb-1">Location STATE *</label>
  <select
    id="location"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
    required
  >
    <option value="">Select a state</option>
    {usStates.map((state) => (
      <option key={state} value={state}>
        {state}
      </option>
    ))}
  </select>
</div>


              <div className="flex flex-col flex-1 ">
                <label htmlFor="location" className="text-gray-700 text-sm font-medium mb-1">Location ZIP CODE *</label>
                <input
                  type="number"
                  id="location"
                  value={Zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none "
                  required
                />
              </div>
              </div>

              
    <div className="flex flex-col">
                <label htmlFor="name" className="text-gray-700 text-sm font-medium mb-1">City *</label>
                <input
                  type="text"
                  id="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>


              <div className="flex flex-col">
                <label htmlFor="name" className="text-gray-700 text-sm font-medium mb-1">Business Name *</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Business Description */}
              <div className="mb-4">
      {/* Label for the description field */}
      <label className="block text-lg font-medium text-gray-700">{'Description* '}</label>
      
      {/* Editor container with Tailwind styles */}
      <div className="block border border-gray-200 shadow-sm max-h-[300px] overflow-auto">
        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          wrapperClassName="border-none"
          editorClassName="min-h-[200px] bg-white p-2"
        />
      </div>
    </div>

              {/* Asking Price */}
              <div className="flex flex-col">
                <label htmlFor="askingPrice" className="text-gray-700 text-sm font-medium mb-1">Asking Price $ *</label>
               
              <CurrencyInput
  id="validation-example-2-field"
  placeholder="$1,234,567"
  onValueChange={(value, name, values) => {
    const formattedValue = value ? `${parseFloat(value).toFixed(2)}` : '';
    setAskingPrice(formattedValue);
  }}
  value={askingPrice}
  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  prefix={'$'}
  step={10}
/>
               
               
              </div>

              {/* Established Year */}
              <div className="flex flex-col">
                <label htmlFor="establishedYear" className="text-gray-700 text-sm font-medium mb-1">Established Year *</label>
                <input
                  type="number"
                  id="establishedYear"
                  value={establishedYear}
                  onChange={(e) => setEstablishedYear(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                />
              </div>

              {/* Number of Employees */}
              <div className="flex flex-col">
                <label htmlFor="numEmployees" className="text-gray-700 text-sm font-medium mb-1">Number of Employees *</label>
                <input
                  type="number"
                  id="numEmployees"
                  value={numEmployees}
                  onChange={(e) => setNumEmployees(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                />
              </div>

              {/* Monthly Rent */}
              <div className="flex flex-col">
                <label htmlFor="monthlyRent" className="text-gray-700 text-sm font-medium mb-1">Monthly Rent $ *  (Including Sales Taxes) </label>
                
              <CurrencyInput
   id="validation-example-2-field"
  placeholder="$1,234,567"
   onValueChange={(value, name, values) => {
    const formattedValue = value ? `${parseFloat(value).toFixed(2)}` : '';
    setMonthlyRent(formattedValue);
  }}
   value={monthlyRent}
    className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  prefix={'$'}
  step={10}
/ >
            
              </div>

              {/* Lease Expiration */}
              <div className="flex flex-col">
                <label htmlFor="leaseExpiration" className="text-gray-700 text-sm font-medium mb-1"> Lease Expiration date *</label>
                <input
                  type="date"
                  id="leaseExpiration"
                  value={leaseExpiration}
                  onChange={(e) => setLeaseExpiration(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                />
              </div>

              {/* Location Size */}
              <div className="flex flex-col">
                <label htmlFor="locationSize" className="text-gray-700 text-sm font-medium mb-1">Location Size (sq ft) *</label>
                <input
                  type="number"
                  id="locationSize"
                  value={locationSize}
                  onChange={(e) => setLocationSize(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                />
              </div>

              {/* Gross Yearly Revenue */}
              <div className="flex flex-col">
                <label htmlFor="grossYearlyRevenue" className="text-gray-700 text-sm font-medium mb-1">Gross Yearly Revenue $ *</label>
              
              
                <CurrencyInput
  id="validation-example-2-field"
  placeholder="$1,234,567"
  onValueChange={(value, name, values) => {
    const formattedValue = value ? `${parseFloat(value).toFixed(2)}` : '';
    setGrossYearlyRevenue(formattedValue);
  }}
  value={grossYearlyRevenue}
  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  prefix={'$'}
  step={10}
/>
              
    
              </div>

              {/* Cash Flow */}
              <div className="flex flex-col">
                <label htmlFor="cashFlow" className="text-gray-700 text-sm font-medium mb-1">Cash Flow $$ >> (Net profit before Taxes and adding back depreciation and owner draws)*</label>
              
                <CurrencyInput
  id="validation-example-2-field"
  placeholder="$1,234,567"
  onValueChange={(value, name, values) => {
    const formattedValue = value ? `${parseFloat(value).toFixed(2)}` : '';
    setCashFlow(formattedValue);
  }}
  value={cashFlow}
  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  prefix={'$'}
  step={10}
/>
              
              
              </div>

              {/* Products/Inventory */}
              <div className="flex flex-col">
                <label htmlFor="productsInventory" className="text-gray-700 text-sm font-medium mb-1">Product Inventory Value $$ *</label>
               
              <CurrencyInput
  id="validation-example-2-field"
  placeholder="$1,234,567"
  onValueChange={(value, name, values) => {
    const formattedValue = value ? `${parseFloat(value).toFixed(2)}` : '';
    setProductsInventory(formattedValue);
  }}
  value={productsInventory}
  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  prefix={'$'}
  step={10}
/>
               
              </div>

              {/* Equipment Value */}
              <div className="flex flex-col">
                <label htmlFor="equipmentValue" className="text-gray-700 text-sm font-medium mb-1">Equipment Value $ *</label>
             
                <CurrencyInput
  id="validation-example-2-field"
  placeholder="$1,234,567"
  onValueChange={(value, name, values) => {
    const formattedValue = value ? `${parseFloat(value).toFixed(2)}` : '';
    setEquipmentValue(formattedValue);
  }}
  value={equipmentValue}
  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  prefix={'$'}
  step={10}
/>
           
              </div>

              {/* Reason for Selling */}
              <div className="flex flex-col">
                <label htmlFor="reasonForSelling" className="text-gray-700 text-sm font-medium mb-1">Reason for Selling</label>
                <input
                  type="text"
                  id="reasonForSelling"
                  value={reasonForSelling}
                  onChange={(e) => setReasonForSelling(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* List of Devices */}
              <div className="flex flex-col">
                <label htmlFor="listOfDevices" className="text-gray-700 text-sm font-medium mb-1">List of Devices</label>
                <textarea
                  type="text"
                  id="listOfDevices"
                    rows="5"
                    cols="50"
                  value={listOfDevices}
                  onChange={(e) => setListOfDevices(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Offered Services */}
              <div className="flex flex-col">
                <label htmlFor="offeredServices" className="text-gray-700 text-sm font-medium mb-1">Offered Services</label>
                <textarea
                  type="text"
                  id="offeredServices"
                   rows="5"
                    cols="50"
                  value={offeredServices}
                  onChange={(e) => setOfferedServices(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Support and Training */}
              <div className="flex flex-col">
                <label htmlFor="supportAndTraining" className="text-gray-700 text-sm font-medium mb-1">Support and Training</label>
                <input
                  type="text"
                  id="supportAndTraining"
                  value={supportAndTraining}
                  onChange={(e) => setSupportAndTraining(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </form>
        </div>

     <DndProvider backend={HTML5Backend}>
             {" "}
             {/* Wrap your app with DndProvider */}
             <div className="lg:w-1/3 lg:pl-8 flex-1">
               <div className="bg-gray-50 p-4 border border-gray-300 mb-4">
                 <h2 className="text-2xl font-semibold mb-4">Upload pictures</h2>
                 <p className="text-gray-600 mb-4">
                   Upload an image. Recommended size: 2048x1024 and less than 50MB.
                 </p>
                 <p className="text-sm text-gray-500 mb-2"></p>
   
                 {/* Image Preview */}
                 {error && <div className="text-red-500">{error}</div>}
                 {imagePreviews.length > 0 ? (
                   imagePreviews.map((image, index) => (
                     <ImageItem
                       key={index}
                       index={index}
                       image={image}
                       moveImage={moveImage}
                       handleRemoveImage={handleRemoveImage}
                     />
                   ))
                 ) : (
                   <div className="flex items-center mb-4">
                     <img
                       src={
                         "https://sp-seller.webkul.com/img/No-Image/No-Image-140x140.png"
                       }
                       alt="Preview"
                       className="border border-gray-300 w-24 h-24 object-cover"
                     />
                     <div className="ml-4 flex flex-1 items-center">
                       <p className="text-sm text-gray-700 flex-1">
                         No images uploaded
                       </p>
                     </div>
                   </div>
                 )}
   
                 <button
                   onClick={() => document.getElementById("images").click()}
                   className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-4 rounded"
                 >
                   Browse Image
                 </button>
                 <input
                   type="file"
                   id="images"
                   onChange={handleImageChange}
                   multiple
                   className="hidden"
                 />
               </div>
               <p className="text-sm text-gray-500">
                 Note: Image can be uploaded of any dimension but we recommend you
                 upload an image with dimensions of 2048x1024 & its size must be
                 less than 50MB.
               </p>
             </div>
           </DndProvider>
        </div>
      
      {/* Submit Button */}
      <hr className="border-t border-gray-500 my-4" />
      <div className="mt-8 flex ">
      {loading && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex flex-col justify-center items-center z-50">
    <img
      src="https://i.gifer.com/4V0b.gif" // Replace this with your spinning GIF URL
      alt="Loading..."
      className="w-16 h-16" // You can adjust the size of the GIF here
    />
    <p className="mt-4 text-white font-semibold">Please do not close window</p> {/* Text below the spinner */}
  </div>
)}
      <button
          type="submit"
          onClick={(e) => handleSubmit(e, 'active')}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 mr-4 border-blue-700 hover:border-blue-500 rounded flex items-center"
          disabled={loading}
        >
          {loading && (
            <svg
              className="w-5 h-5 mr-3 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0z"
              />
            </svg>
          )}
          {isEditing ? "Update" : "Publish"}
        </button>
      {!isEditing ?(
  <button
  type="submit"
  onClick={(e) => handleSubmit(e, 'draft')}
  className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded flex items-center"
>
  Draft
</button>
      ):null
      }
      
      </div>
    </main>
  );
};


export default AddBusinessListingForm;
