import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor';
import { EditorState , ContentState, convertToRaw , convertFromRaw} from "draft-js";
import { useLocation } from 'react-router-dom';
import CurrencyInput from 'react-currency-input-field';
import { useNavigate } from 'react-router-dom';
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

const PostRentalForm = () => {
  // State hooks for form fields
  const [location, setLocation] = useState('');
  const [roomSize, setRoomSize] = useState(null);
  const [monthlyRent, setMonthlyRent] = useState(null);
  const [deposit, setDeposit] = useState(null);
  const [minimumInsuranceRequested, setMinimumInsuranceRequested] = useState(null);
  const [typeOfUseAllowed, setTypeOfUseAllowed] = useState('');
  const [rentalTerms, setRentalTerms] = useState('');
  const [wifiAvailable, setWifiAvailable] = useState(null);

  const [images, setImages] = useState([]);  const [imageName, setImageName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]); // Keep previews here
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const locationData = useLocation();
  const [Zip , setZip] = useState("")
  const [city , setCity] = useState("")
  const navigate = useNavigate()

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
  const { product } = locationData.state || {};
console.log(product)
  useEffect(() => {
    if (product) {
      const roomListing = product.roomListing[0];
      setZip(roomListing.zip)
      setLocation(roomListing.location.split("_")[1]);
      setCity(roomListing.location.split("_")[0])

      setRoomSize(roomListing.roomSize);
      setMonthlyRent(roomListing.monthlyRent);
      setDeposit(roomListing.deposit);
      setMinimumInsuranceRequested(roomListing.minimumInsuranceRequested);
      setTypeOfUseAllowed(roomListing.typeOfUseAllowed || []);
      setRentalTerms(roomListing.rentalTerms);
      setWifiAvailable(roomListing.wifiAvailable);
      setImages(roomListing.image || []); // Fallback to an empty array if undefined
      setImageName(roomListing.imageName || '');
      setIsEditing(true);

        // Clean the description and set it
    const rawDescription = roomListing.otherDetails || "";
    const textDescrip = rawDescription; // Remove unwanted tags
    setDescription(textDescrip || ""); // Set the cleaned description


    
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

  // const onEditorStateChange = (newEditorState) => {
  //   setEditorState(newEditorState);
  //   const currentText = newEditorState.getCurrentContent().getPlainText("\u0001");
  //   setDescription(currentText);
  // };
  // const onEditorStateChange = (newEditorState) => {
  //   setEditorState(newEditorState);
  //   const currentText = newEditorState
  //     .getCurrentContent()
  //     .getPlainText("\u0001"); // Get plain text from the editor, no HTML
  //   setDescription(currentText);
  // };
  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    // Convert current editor state to HTML
    const rawContent = convertToRaw(newEditorState.getCurrentContent());
    setDescription(JSON.stringify(rawContent)); // Save the raw content as a string
  };

console.log(description)


  // Handler for form submission
  const handleSubmit = async (e, status) => {
    e.preventDefault(); // Prevent form submission
  
    // Reset error and success states
    setError('');
    setSuccess('');
  
    // Show loading indicator if status is 'active'
    if (status === "active") {
      setLoading(true);
    }
  
    // Convert editor content to HTML and process it
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);
  
    // Modify content: remove <p> tags and replace with <br /> and convert non-breaking spaces to regular spaces
    const modifiedContent = htmlContent
      // .replace(/<p>/g, "")
      // .replace(/<\/p>/g, "<br />") 
      // .replace(/&nbsp;/g, " "); 
    //   .replace(/<p>/g, "") // Remove <p> tags
    // .replace(/<\/p>/g, "<br />") // Replace closing </p> tags with <br />
    // .replace(/<br\s*\/?>\s*<br\s*\/?>/g, "<br />") // Avoid double <br /> tags
    .replace(/&nbsp;/g, " "); // Replace &nbsp; with normal spaces


    // Prepare form data for submission
    const formData = new FormData();
    const userId = localStorage.getItem('userid');
    const fullLocation = `${city}_${location}`;
  
    // Append necessary form data
    formData.append('location', fullLocation);
    formData.append('zip', Zip);
    formData.append('roomSize', roomSize);
    formData.append('monthlyRent', monthlyRent);
    formData.append('deposit', deposit);
    formData.append('minimumInsuranceRequested', minimumInsuranceRequested);
    formData.append('typeOfUseAllowed', typeOfUseAllowed); // Updated field
    formData.append('rentalTerms', rentalTerms);
    formData.append('wifiAvailable', wifiAvailable);
    formData.append('otherDetails', modifiedContent);
    formData.append('userId', userId);
  
    // Include status if it's a new listing (not editing)
    if (!isEditing) {
      formData.append('status', status);
    }
  
    try {
      // Determine the API URL and HTTP method based on edit or create action
      const url = isEditing
        ? `http://localhost:5000/product/updateListing/${product.id}`
        : "http://localhost:5000/product/addRoom";
  
      const method = isEditing ? "PUT" : "POST";
      if (images.length === 0) {
        setError('Please Upload Atleast 1 image ');
        setTimeout(() => setError(''), 8000);
        return;
      }
      // Send the form data to the server
      const response = await fetch(url, {
        method,
        body: formData,
      });
  
      const json = await response.json();
  
      if (response.ok) {
        // Show success message
        // setSuccess(isEditing ? "Room updated successfully!" : json.message);
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
          const imageResponse = await fetch(`http://localhost:5000/product/updateImages/${json.product.id}`, {
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
  

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files || []); // Ensure files is an array
//     setImages((prevImages) => [...prevImages, ...files]);
//     const newImagePreviews = files.map((file) => URL.createObjectURL(file));
//     setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
//   };
  

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

  // Handler for type of use allowed change
  const handleTypeOfUseAllowedChange = (e) => {
    const { value, checked } = e.target;
    setTypeOfUseAllowed(prev =>
      checked ? [...prev, value] : prev.filter(type => type !== value)
    );
  };

  return (
    <main className="bg-gray-100 min-h-screen p-5 flex-row">
      <h1 className="text-2xl font-semibold mb-4 max-sm:text-xl">Add Room Rental Listing</h1>
      <p className="text-lg mb-8 text-gray-700">Use this form to list your rental property.</p>
      <div className="mb-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </div>
      <div className="flex flex-col lg:flex-row flex-1">
        
        <div className="flex-1 bg-white px-8 py-4 shadow-md lg:mr-8 mb-8 lg:mb-0">
          <h1 className='text-2xl font-semibold mb-4'>Rental Details</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              
            <div className='flex flex-row max-sm:flex-col '>
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
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none "
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
                <label htmlFor="roomSize" className="text-gray-700 text-sm font-medium mb-1">Room size (sq ft)*</label>
                <input
                  type="number"
                  id="roomSize"
                  value={roomSize}
                  onChange={(e) => setRoomSize(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                />
              </div>

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


              <div className="flex flex-col">
                <label htmlFor="monthlyRent" className="text-gray-700 text-sm font-medium mb-1">Monthly Rent $ *</label>
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
/>
      
              </div>

              <div className="flex flex-col">
                <label htmlFor="deposit" className="text-gray-700 text-sm font-medium mb-1">Deposit $ *</label>
                <CurrencyInput
  id="validation-example-2-field"
  placeholder="$1,234,567"
  onValueChange={(value, name, values) => {
    const formattedValue = value ? `${parseFloat(value).toFixed(2)}` : '';
    setDeposit(formattedValue);
  }}
  value={deposit}
  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  prefix={'$'}
  step={10}
/>
              
            
              </div>

              <div className="flex flex-col">
                <label htmlFor="minimumInsuranceRequested" className="text-gray-700 text-sm font-medium mb-1">Minimum Insurance Requested $ *</label>
                <CurrencyInput
  id="validation-example-2-field"
  placeholder="$1,234,567"
  onValueChange={(value, name, values) => {
    const formattedValue = value ? `${parseFloat(value).toFixed(2)}` : '';
    setMinimumInsuranceRequested(formattedValue);
  }}
  value={minimumInsuranceRequested}
  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  prefix={'$'}
  step={10}
/>
               
             
              </div>

              <div className="flex flex-col">
                <label htmlFor="typeOfUseAllowed" className="text-gray-700 text-sm font-medium mb-1">Type of Use Allowed *</label>
                <div id="typeOfUseAllowed" className="flex flex-col">
                  {['Skin care', 'Medical aesthetic', 'Massage therapy', 'General Medical', 'Permanent Makeup', 'Nails', 'Eyelashes', 'Wax'].map((option) => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={option}
                        checked={typeOfUseAllowed.includes(option)}
                        onChange={handleTypeOfUseAllowedChange}
                        className="form-checkbox"
                      />
                      <span className="ml-2 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="rentalTerms" className="text-gray-700 text-sm font-medium mb-1">Rental Terms *</label>
                <select
                  id="rentalTerms"
                  value={rentalTerms}
                  onChange={(e) => setRentalTerms(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select Rental Term</option>
                  <option value="Monthly to month">Monthly to month</option>
                  <option value="6 months">6 months</option>
                  <option value="12 months">12 months</option>
                </select>
              </div>
              <div className="flex flex-col">
  <label htmlFor="wifiAvailable" className="text-gray-700 text-sm font-medium mb-1">Wi-Fi Available *</label>
  <select
    id="wifiAvailable"
    value={wifiAvailable}
    onChange={(e) => setWifiAvailable(e.target.value === 'true')} // Convert string to boolean
    className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
    required
  >
    <option value="">Select Wi-Fi Availability</option>
    <option value="true">Yes</option>
    <option value="false">No</option>
  </select>
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

export default PostRentalForm;
