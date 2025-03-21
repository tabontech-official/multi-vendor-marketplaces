import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor'; // Assuming RTC is the rich text editor
import { EditorState , ContentState, convertToRaw , convertFromRaw } from "draft-js";
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


const AddJobSearchForm = () => {
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [qualificationRequested, setQualificationRequested] = useState('');
  const [jobType, setJobType] = useState('');
  const [description, setDescription] = useState("");

  const [availability, setAvailability] = useState('');
  const [requestedYearlySalary, setRequestedYearlySalary] = useState('');
  const [positionRequestedDescription, setPositionRequestedDescription] = useState('');
  const [imageName, setImageName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);
  const [images, setImages] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isEditing, setIsEditing] = useState(false);
  const locationData = useLocation();
  const { product } = locationData.state || {};
  const [imagePreviews, setImagePreviews] = useState([]); // Keep previews here
  const [Zip , setZip] = useState("")
  const [city , setCity] = useState("")
const [workas , setWorkAs] = useState("")
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

  useEffect(() => {
    console.log(product)
    if (product) {
      setIsEditing(true);
      setLocation(product.jobListings[0].location.split("_")[1] || '');
      setCity(product.jobListings[0].location.split("_")[0] || '')
      setName(product.title || '');
      setQualificationRequested(product.jobListings[0].qualification || '');
      setJobType(product.jobListings[0].jobType || '');

      setAvailability(product.jobListings[0].availability || '');
      setRequestedYearlySalary(product.jobListings[0].requestedYearlySalary || '');
      // const textDescrip = product.jobListings[0].positionRequestedDescription.replace(/<br\s*\/?>|&nbsp;/gi, '');
    //   const textDescrip = product.jobListings[0].positionRequestedDescription.replace(
    //     /<br\s*\/?>|&nbsp;/gi, // Remove unwanted tags
    //     ""
    //   );
    //   setPositionRequestedDescription(textDescrip || '');
    //   setZip(product.jobListings[0].zip)
    //  setWorkAs(product.jobListings[0].availableToWorkAs || '')
     
    //  if (product.images && Array.isArray(product.images)) {
    //   const imageFiles = product.images.map(async(img) => {
    //     const blob = await fetch(img.src).then((r) => r.blob());
    //     return new File([blob], img.alt || 'product-image.jpg', { type: 'image/jpeg' });
    //   });

    //   Promise.all(imageFiles).then((files) => {
    //     setImages(files);
    //     setImagePreviews(product.images.map((img) => img.src));
    //   });
    // }
    //   if (product.jobListings[0].positionRequestedDescription ) {
    //     const contentState = ContentState.createFromText(textDescrip);
    //     setEditorState(EditorState.createWithContent(contentState));
    //   } else {
    //     setEditorState(EditorState.createEmpty());
    //   }
    const rawDescription = product.jobListings[0]?.positionRequestedDescription || "";
    const textDescrip = rawDescription; // Remove unwanted tags
    setPositionRequestedDescription(textDescrip || "");
  
    // Set other properties from jobListings
    setZip(product.jobListings[0]?.zip || "");
    setWorkAs(product.jobListings[0]?.availableToWorkAs || "");
  
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
 
  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
   // Convert current editor state to HTML
    const rawContent = convertToRaw(newEditorState.getCurrentContent());
    setDescription(JSON.stringify(rawContent)); // Save the raw content as a string
  };

console.log(description)

  const handleSubmit = async (e, status) => {
    // Convert the editor content to raw content and then to HTML
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);
  
    // Modify the content (remove <p> and replace with <br />, and fix non-breaking spaces)
    const modifiedContent = htmlContent
      // .replace(/<p>/g, "")
      // .replace(/<\/p>/g, "<br />")  // Replace <p> with <br />
      // .replace(/&nbsp;/g, " ");     // Replace &nbsp; with regular space
  
      // .replace(/<p>/g, "") // Remove <p> tags
      // .replace(/<\/p>/g, "<br />") // Replace closing </p> tags with <br />
      // .replace(/<br\s*\/?>\s*<br\s*\/?>/g, "<br />") // Avoid double <br /> tags
      // .replace(/&nbsp;/g, " "); // Replace &nbsp; with normal spaces
  

    // Ensure jobType is selected before proceeding
    if (!jobType) {
      setError("Job Type Required");
      return; // Stop further execution if jobType is missing
    }
  
    e.preventDefault(); // Prevent form submission
    setError(''); // Clear any previous error messages
    setSuccess(''); // Clear any previous success messages
    setLoading(true); // Show loading spinner
  
    const formData = new FormData(); // Initialize formData to store form fields
  
    // Combine city and location to create full location
    const fullLocation = `${city}_${location}`;
    formData.append('location', fullLocation);
    formData.append('zip', Zip);
  
    // Add either title or name depending on if it's an edit or a new job
    if (isEditing) {
      formData.append('title', name);
    } else {
      formData.append('name', name);
    }
  
    // Add other fields to the formData
    formData.append('qualification', qualificationRequested);
    formData.append('availability', availability);
    formData.append('requestedYearlySalary', requestedYearlySalary);
    formData.append('jobType', jobType);
    formData.append('positionRequestedDescription', modifiedContent);
    formData.append('availableToWorkAs', workas);
    
    // Add status if it's a new job (not editing)
    if (!isEditing) {
      formData.append('status', status);
    }
  
    formData.append('userId', localStorage.getItem('userid')); // Get userId from local storage
  
    // try {
    //   // API URL and method based on whether it's editing or adding a new job
    //   const url = isEditing
    //     ? `http://localhost:5000/product/updateListing/${product.id}`
    //     : "http://localhost:5000/product/addJob";
  
    //   const method = isEditing ? "PUT" : "POST";
  
    //   // Submit the form data
    //   const response = await fetch(url, {
    //     method: method,
    //     body: formData,
    //   });
  
    //   const json = await response.json();
  
    //   if (response.ok) {
    //     setSuccess(isEditing ? "Job updated successfully!" : json.message);
    //     setError(''); // Clear error message on success
    //     setTimeout(() => setSuccess(''), 5000); // Clear success message after 5 seconds
  
    //     // Handle image upload to Cloudinary
    //     if (images && images.length > 0) {
    //       const cloudinaryURLs = [];
  
    //       for (let i = 0; i < images.length; i++) {
    //         const formDataImages = new FormData();
    //         formDataImages.append('file', images[i]);
    //         formDataImages.append('upload_preset', 'images'); // Cloudinary preset
  
    //         // Upload the image to Cloudinary
    //         const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/djocrwprs/image/upload', {
    //           method: "POST",
    //           body: formDataImages,
    //         });
  
    //         const cloudinaryJson = await cloudinaryResponse.json();
  
    //         if (cloudinaryResponse.ok) {
    //           cloudinaryURLs.push(cloudinaryJson.secure_url); // Save the uploaded image URL
    //           console.log(`Image ${i + 1} uploaded successfully:`, cloudinaryJson.secure_url);
    //         } else {
    //           setError(`Error uploading image ${i + 1} to Cloudinary.`);
    //           setLoading(false);
    //           return; // Stop further execution if any image upload fails
    //         }
    //       }
  
    //       // Save the Cloudinary URLs to the database
    //       const imageResponse = await fetch(`http://localhost:5000/product/updateImages/${json.product.id}`, {
    //         method: "PUT",
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ images: cloudinaryURLs }), // Send Cloudinary URLs
    //       });
  
    //       const imageJson = await imageResponse.json();
  
    //       if (imageResponse.ok) {
    //         console.log("Images URLs saved successfully:", imageJson);
    //       } else {
    //         setError('Error saving image URLs in the database.');
    //         setLoading(false);
    //         return;
    //       }
    //     }
  
    //     // Navigate to the homepage after success
    //     navigate("/");
  
    //   } else {
    //     setSuccess('');
    //     setError(json.error || "An unexpected error occurred.");
    //     setTimeout(() => setError(''), 5000); // Clear error message after 5 seconds
    //   }
  
    // } catch (error) {
    //   setSuccess('');
    //   setError('An unexpected error occurred.');
    //   setTimeout(() => setError(''), 5000); // Clear error message after 5 seconds
    //   console.error(error);
    // } finally {
    //   setLoading(false); // Hide the loading spinner when done
    // }

    try {
      // Set the API URL and method (POST for creating new, PUT for updating)
      let url = "http://localhost:5000/product/addJob";
      let method = "POST";
  
      if (product && product.id) {
        url = `http://localhost:5000/product/updateListing/${product.id}`;
        method = "PUT";
      }

      if (images.length === 0) {
        setError('Please Upload Atleast 1 image ');
        setTimeout(() => setError(''), 8000);
        return;
      }

      // Submit the form data (main product data)
      const response = await fetch(url, {
        method,
        body: formData,
      });

   
  
      const json = await response.json();
  
      if (response.ok) {
  
    const createdProductId = json.product?.id || product.id;
        // Success handling based on status
        if (status === "active") {
          // setSuccess(json.message); // Success message for publishing
        } else {
          setSuccess("Your post drafted successfully"); // Success message for draft
        }
  
        // Handle image upload if there are images
        if (images && images.length > 0) {
          const cloudinaryURLs = [];
          
          // Loop through images and upload each one
          for (let i = 0; i < images.length; i++) {
            const formDataImages = new FormData();
            formDataImages.append('file', images[i]);
            formDataImages.append('upload_preset', 'images'); // Cloudinary preset
  
            // Upload image to Cloudinary
            const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/djocrwprs/image/upload', {
              method: "POST",
              body: formDataImages,
            });
  
            const cloudinaryJson = await cloudinaryResponse.json();
  
            if (cloudinaryResponse.ok) {
              cloudinaryURLs.push(cloudinaryJson.secure_url);
              console.log(`Image ${i + 1} uploaded successfully:`, cloudinaryJson.secure_url);
            } else {
              setError(`Error uploading image ${i + 1} to Cloudinary.`);
              setLoading(false);
              return;  // Stop the process if any image upload fails
            }
          }
  
          // Once all images are uploaded, save the URLs in the database
          const imageResponse = await fetch(`http://localhost:5000/product/updateImages/${createdProductId}`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ images: cloudinaryURLs }),  // Send Cloudinary URLs
          });
  
          const imageJson = await imageResponse.json();
  
          if (imageResponse.ok) {
            console.log("Images URLs saved successfully:", imageJson);
          } else {
            setError('Error saving image URLs in the database.');
            setLoading(false);
            return;
          }
        }
  
        // Navigate to homepage after success
        navigate("/");
  
      } else {
        setSuccess('');
        setError(json.error || "An unexpected error occurred.");
        console.log(json.error);
      }
  
    } catch (error) {
      setSuccess('');
      setError(error.error || "An unexpected error occurred.");
      console.error(error);
    } finally {
      setLoading(false);  // Hide the loading spinner when done
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
      <h1 className="text-2xl font-semibold mb-4 max-sm:text-xl">Provider Job Search Listing</h1>
      <p className="text-lg mb-8 text-gray-700">Here you can {isEditing ? "edit" : "add"} job listings to your site.</p>
      <div className="mb-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </div>
      <div className="flex flex-col lg:flex-row flex-1">
        <div className="flex-1 bg-white px-8 py-4 shadow-md lg:mr-8 mb-8 lg:mb-0">
          <h1 className='text-2xl font-semibold mb-4'>Job Details</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Details */}
            <div className="grid grid-cols-1 gap-6">
              {/* Location */}
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
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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


              {/* Name */}
              <div className="flex flex-col">
                <label htmlFor="name" className="text-gray-700 text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Qualification Requested */}
              <div className="flex flex-col">
                <label htmlFor="qualificationRequested" className="text-gray-700 text-sm font-medium mb-1">Professional Qualifications *</label>
                <select
                  id="qualificationRequested"
                  value={qualificationRequested}
                  onChange={(e) => setQualificationRequested(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select Qualification</option>
                  <option value="Medical Director">Medical Director</option>
                  <option value="ARPN Nurse practitioner">ARPN Nurse practitioner</option>
                  <option value="Registered Nurse">Registered Nurse</option>
                  <option value="Medical Assistant">Medical Assistant</option>
                  <option value="Aesthetician">Aesthetician</option>
                  <option value="Laser Technician">Laser Technician</option>
                  <option value="Massage therapist">Massage therapist</option>
                  <option value="Front desk clerk">Front desk clerk</option>
                </select>
              </div>


                 {/* Work As */}
                 <div className="flex flex-col">
                <label htmlFor="qualificationRequested" className="text-gray-700 text-sm font-medium mb-1">Available to work as  *</label>
                <select
                  id="Workas"
                  value={workas}
                  onChange={(e) => setWorkAs(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select Option</option>
                  <option value="Employee W2">Employee W2</option>
                  <option value="Independant freelancer 1099 on commissions">Independant freelancer 1099 on commissions</option>
                    <option value="Both W2 and 1099">Both W2 and 1099</option>
                </select>
              </div>

              {/* Availability */}
              <div className="flex flex-col">
                <label htmlFor="availability" className="text-gray-700 text-sm font-medium mb-1">Available date*</label>
                <input
                  type="date"
                  id="availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Requested Yearly Salary */}
              <div className="flex flex-col">
                <label htmlFor="requestedYearlySalary" className="text-gray-700 text-sm font-medium mb-1">Requested Yearly Salary *</label>

                <CurrencyInput
  id="validation-example-2-field"
  placeholder="$1,234,567"
  onValueChange={(value, name, values) => {
    const formattedValue = value ? `${parseFloat(value).toFixed(2)}` : '';
    setRequestedYearlySalary(formattedValue);
  }}
  value={requestedYearlySalary}
  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  prefix={'$'}
  step={10}
/>
              {/* job type */}

              </div>
              <div className="flex flex-col">
                <label htmlFor="jobType" className="text-gray-700 text-sm font-medium mb-1">Job Type *</label>
                <select
                  id="jobType"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select job type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
              </div>
              {/* Position Description */}
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


            
            </div>
          </form>
        </div>

        {/* Image Upload */}
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

export default AddJobSearchForm;
