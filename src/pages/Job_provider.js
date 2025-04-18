import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor'; // Assuming RTC is your custom rich text editor component
import { EditorState , ContentState , convertToRaw , convertFromRaw } from "draft-js";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CurrencyInput from 'react-currency-input-field';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; 


const AddNewJobForm = () => {
  // State hooks for form fields
  const [location, setLocation] = useState('');
  const [qualification, setQualification] = useState('');
  const [jobType, setJobType] = useState('');
  const [jobOfferType, setJobOfferType] = useState('');
  const [offeredSalary, setOfferedSalary] = useState('');
  const [positionDescription, setPositionDescription] = useState('');

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [city , setCity] = useState("")

  const [Enabled , setEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const LocationData = useLocation();
  const [imagePreviews, setImagePreviews] = useState([]); // Keep previews here
  const [Zip , setZip] = useState("")
  const navigate = useNavigate()
  const [customLocation, setCustomLocation] = useState('');

  const { product } = LocationData.state || {};
 console.log(product)
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
    // setLocation(product.providerListings[0].location.split("_")[1] || '');
    // setCity(product.providerListings[0].location.split("_")[0] || '')
    const locationParts = product.providerListings[0].location.split('_');
      const cityFromLocation = locationParts[0] || '';
      setLocation(product.providerListings[0].location); // Ensure Location is in the correct city_state format
      setCity(cityFromLocation); // City is the first
    setQualification(product.providerListings[0].qualificationRequested || '');
    setJobType(product.providerListings[0].jobType || '');
    setJobOfferType(product.providerListings[0].typeOfJobOffered || '');
    setOfferedSalary(product.providerListings[0].offeredYearlySalary || '');
   
    // const textDescrip = product.body_html.replace(/<br\s*\/?>|&nbsp;/gi, '');
    const rawDescription = product.body_html || "";
  const textDescrip = rawDescription; // Remove unwanted tags
  setPositionDescription(textDescrip);
    setPositionDescription(textDescrip );


  // Set additional properties from providerListings
  setZip(product.providerListings?.[0]?.zip || "");
  setLocation(product.providerListings?.[0]?.location || "");


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
   
      }
}, []);

  // const onEditorStateChange = (newEditorState) => {
  //   setEditorState(newEditorState);
  //   const currentText = newEditorState.getCurrentContent().getPlainText("\u0001");
  //   setPositionDescription(currentText);
  // };
  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  
  // Handler for form submission
 const handleSubmit = async (e, status) => {
    e.preventDefault();

    // Step 1: Process content from rich text editor
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);
    const modifiedContent = htmlContent
      // .replace(/<p>/g, "")
      // .replace(/<\/p>/g, "<br />")
      // .replace(/&nbsp;/g, " "); // Clean up content

      // .replace(/<p>/g, "") // Remove <p> tags
      // .replace(/<\/p>/g, "<br />") // Replace closing </p> tags with <br />
      // .replace(/<br\s*\/?>\s*<br\s*\/?>/g, "<br />") // Avoid double <br /> tags
      // .replace(/&nbsp;/g, " "); // Replace &nbsp; with normal spaces
  


    // Step 2: Validation checks for required fields
    // if (!city || !location || !qualification || !Zip || !jobType || !jobOfferType || !offeredSalary) {
    //   setError("Please fill in all required fields.");
    //   return;
    // }

    setError('');
    setSuccess('');
    if (status === "active") {
      setLoading(true);  // Set loading state if status is active
    }

    // Get user ID from local storage
    const id = localStorage.getItem('userid');
    if (!id) {
      setError('User not logged in.');
      return;
    }

    // Step 3: Create FormData object
    const formData = new FormData();

    // Prepare formData fields
    // let fullLocation = city.concat("_", location)
    // formData.append('location', fullLocation);
    const locationValue = `${city}_${location.split('_')[1] || ''}`;

    formData.append('location', locationValue);
    formData.append('zip', Zip);
    formData.append('qualificationRequested', qualification);
    formData.append('name', qualification);  // It seems 'qualification' is being used for 'name' too
    formData.append('jobType', jobType);
    formData.append('typeOfJobOffered', jobOfferType);
    formData.append('offeredYearlySalary', offeredSalary);

    // Add content for editing
    if (isEditing) {
      formData.append('body_html', modifiedContent);
      formData.append('offeredPositionDescription', modifiedContent);
    } else {
      formData.append('offeredPositionDescription', modifiedContent);
    }

    formData.append('userId', id); // Append the user ID

    if (!isEditing) {
      formData.append('status', status); // Add status when not editing
    }

    // try {
    //     const response = await fetch(isEditing
    //       ? ` http://localhost:5000/product/updateListing/${product.id}`
    //       : " http://localhost:5000/product/addProvider", {
    //       method: isEditing ? "PUT" : "POST",
    //       body: formData,
    //     });;

    //   const json = await response.json();

    //   if (response.ok) {
    //     if(status == "active"){
    //       setSuccess(json.message);
    //     }else{
    //       setSuccess("Your post drafted sucessfully")
    //     }
    //     navigate("/")
    //     setError('');
    //     // Clear form fields
    //     // setLocation('');
    //     // setQualification('');
    //     // setJobType('');
    //     // setJobOfferType('');
    //     // setOfferedSalary('');
    //     // setPositionDescription('');
    //     // setImages([]);
    //     // setImageName('');
    //     // setEditorState(EditorState.createEmpty());
    //   } else {
    //     setSuccess('');
    //     setError(json.error);
    //   }
    // } catch (error) {
    //   setSuccess('');
    //   setError('An unexpected error occurred.');
    //   console.error(error);
    // } finally {
    //   setLoading(false);
    // }

    try {
      // Set the API URL and method (POST for creating new, PUT for updating)
      let url = " http://localhost:5000/product/addProvider";
      let method = "POST";
  
      if (product && product.id) {
        url = ` http://localhost:5000/product/updateListing/${product.id}`;
        method = "PUT";
      }
  
      // Submit the form data (main product data)
      const response = await fetch(url, {
        method,
        body: formData,
      });
  
      const json = await response.json();
  
      if (response.ok) {
  
    // const createdProductId = json.product?.id || product.id;
        // Success handling based on status
        if (status === "active") {
          setSuccess(json.message); // Success message for publishing
        } else {
          setSuccess("Your post drafted successfully"); // Success message for draft
        }
  
        // Handle image upload if there are images
        // if (images && images.length > 0) {
        //   const cloudinaryURLs = [];
          
        //   // Loop through images and upload each one
        //   for (let i = 0; i < images.length; i++) {
        //     const formDataImages = new FormData();
        //     formDataImages.append('file', images[i]);
        //     formDataImages.append('upload_preset', 'images'); // Cloudinary preset
  
        //     // Upload image to Cloudinary
        //     const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/djocrwprs/image/upload', {
        //       method: "POST",
        //       body: formDataImages,
        //     });
  
        //     const cloudinaryJson = await cloudinaryResponse.json();
  
        //     if (cloudinaryResponse.ok) {
        //       cloudinaryURLs.push(cloudinaryJson.secure_url);
        //       console.log(`Image ${i + 1} uploaded successfully:`, cloudinaryJson.secure_url);
        //     } else {
        //       setError(`Error uploading image ${i + 1} to Cloudinary.`);
        //       setLoading(false);
        //       return;  // Stop the process if any image upload fails
        //     }
        //   }
  
        //   // Once all images are uploaded, save the URLs in the database
        //   const imageResponse = await fetch(` http://localhost:5000/product/updateImages/${createdProductId}`, {
        //     method: "PUT",
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ images: cloudinaryURLs }),  // Send Cloudinary URLs
        //   });
  
        //   const imageJson = await imageResponse.json();
  
        //   if (imageResponse.ok) {
        //     console.log("Images URLs saved successfully:", imageJson);
        //   } else {
        //     setError('Error saving image URLs in the database.');
        //     setLoading(false);
        //     return;
        //   }
        // }
  
        // // Navigate to homepage after success
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







  return (
    <main className="bg-gray-100 min-h-screen p-5 flex-row">
      <h1 className="text-2xl font-semibold mb-4 max-sm:text-xl">PROVIDER JOB OFFER LISTING</h1>
      <p className="text-lg mb-3 text-gray-700">Here you can add job listings to your site.</p>
      <div className="mb-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </div>
      <div className="flex flex-col lg:flex-row flex-1">
        <div className="flex-1 bg-white px-8 py-4 shadow-md lg:mr-8 mb-8 lg:mb-0">
          <h1 className='text-2xl font-semibold'>Job Details</h1>
          <p className='mb-4'>Add job details here</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Location */}
              <div className='flex flex-row max-sm:flex-col'>
              <div className="flex flex-col flex-1 mr-4 max-sm:mr-0">
  <label htmlFor="location" className="text-gray-700 text-sm font-medium mb-1">Location STATE *</label>
  <select
      value={location.split('_')[2] || location.split('_')[1]} // Set state from Location
      onChange={(e) => {
        setLocation(`${city}_${e.target.value}`); // Dynamically update Location when state is selected
      }}
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
                  onChange={(e) => {
                    setCity(e.target.value);
                    // setLocation(`${e.target.value}_${Location.split('_')[1]}`); // Update Location dynamically
                  }}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              
              {/* Qualification Requested */}
              <div className="flex flex-col">
                <label htmlFor="qualification" className="text-gray-700 text-sm font-medium mb-1">Qualification Requested *</label>
                <select
                  id="qualification"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select qualification</option>
                  <option value="Medical Director">Medical Director</option>
                  <option value="ARPN Nurse Practitioner">ARPN Nurse Practitioner</option>
                  <option value="Registered Nurse">Registered Nurse</option>
                  <option value="Medical Assistant">Medical Assistant</option>
                  <option value="Aesthetician">Aesthetician</option>
                  <option value="Laser Technician">Laser Technician</option>
                  <option value="Massage Therapist">Massage Therapist</option>
                  <option value="Front Desk Clerk">Front Desk Clerk</option>
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

              {/* Job Type */}
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

              {/* Type of Job Offered */}
              <div className="flex flex-col">
                <label htmlFor="jobOfferType" className="text-gray-700 text-sm font-medium mb-1">Type of Job Offered *</label>
                <select
                  id="jobOfferType"
                  value={jobOfferType}
                  onChange={(e) => setJobOfferType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select job offer type</option>
                  <option value="Employee W2">Employee W2</option>
                  <option value="Freelance Provider 1099">Freelance Provider 1099</option>
                </select>
              </div>

              {/* Offered Salary */}
              <div className="flex flex-col">
                <label htmlFor="offeredSalary" className="text-gray-700 text-sm font-medium mb-1"> Offered Yearly Salary $  *</label>
                <CurrencyInput
  id="validation-example-2-field"
  placeholder="$1,234,567"
  onValueChange={(value, name, values) => {
    const formattedValue = value ? `${parseFloat(value).toFixed(2)}` : '';
    setOfferedSalary(formattedValue);
  }}
  value={offeredSalary}
  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  prefix={'$'}
  step={10}
/>
          
              </div>
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
          </form>
        </div>

     {/* Image Upload */}
     <div className="lg:w-1/3 lg:pl-8 flex-1">
          


        
        </div>
      </div>
    </main>
  );
};

export default AddNewJobForm;
