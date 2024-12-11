import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor';
import { EditorState , ContentState, convertToRaw } from "draft-js";
import { useLocation } from 'react-router-dom';
import CurrencyInput from 'react-currency-input-field';
import { Editor } from 'react-draft-wysiwyg'
import { useNavigate } from 'react-router-dom';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; 

const PeopleLooking = () => {
  // State hooks for form fields
  const [location, setLocation] = useState('');
  const[lookingfor , setLookingFor]=useState('')
  const [name , setName] = useState('')
  const[budget , setBudget]= useState(null)
  
  const [images, setImages] = useState([]);  const [imageName, setImageName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [city , setCity] = useState("")
  const [imagePreviews, setImagePreviews] = useState([]); // Keep previews here
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const locationData = useLocation();
  const [Zip , setZip] = useState("")
  const navigate = useNavigate()
  const { product } = locationData.state || {};

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
      console.log(product)
      const roomListing = product.looking;
      setZip(roomListing.zip)
      setLookingFor(roomListing.brand)
      setLocation(roomListing.location.split("_")[1]);
      setCity(roomListing.location.split("_")[0])

      setBudget(roomListing.sale_price)
      setImages(roomListing.image || []); // Fallback to an empty array if undefined
      setImageName(roomListing.imageName || '');
      setName(roomListing.name)
      setIsEditing(true);
      // const textDescrip = product.body_html.replace(/<br\s*\/?>|&nbsp;/gi, '');
      const textDescrip = product.body_html.replace(
        /<br\s*\/?>|&nbsp;/gi, // Remove unwanted tags
        ""
      );
      
      setDescription(textDescrip)
      if (roomListing.description) {
        const contentState = ContentState.createFromText(textDescrip);
        setEditorState(EditorState.createWithContent(contentState));
      } else {
        setEditorState(EditorState.createEmpty());
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
  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };
  

  // Handler for form submission
  const handleSubmit = async (e , status) => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState)


    // const modifiedContent = htmlContent.replace(/<p>/g, '').replace(/<\/p>/g, '<br />');
    const modifiedContent = htmlContent
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "<br />") // You can replace paragraph tags with <br /> or leave empty if you don't want any formatting
    .replace(/&nbsp;/g, " "); // Remove &nbsp; (non-breaking spaces) and replace with normal spaces.
   

    e.preventDefault();
    setError('');
    setSuccess('');
    
    if(status == "active"){
      setLoading(true);
    }

    const formData = new FormData();
    const id = localStorage.getItem('userid');

    if (images && images.length > 0) {
      images.map((image) => {
        formData.append('images', image); // Append each file
      });
    }
    
console.log("budeget",budget)
let fullLocation = city.concat("_", location)
    formData.append('location', fullLocation);
    formData.append('zip', Zip);
    formData.append('name', lookingfor);
    formData.append('brand', name ); 
    if(budget === null || !budget){
      formData.append('sale_price', 0);
  
    }
    else{
      formData.append('sale_price', budget);
  
    }

    formData.append('description', modifiedContent);

    formData.append('userId', id);
    if(!isEditing){
      formData.append('status', status);
      }
    try {
      const response = await fetch(isEditing ? `https://medspaa.vercel.app/product/updateListing/${product.id}`:"https://medspaa.vercel.app/product/lookingFor", {
        method: isEditing?"PUT": "POST",
        body: formData
      });

      const json = await response.json();

      if (response.ok) {
        if(status == "active"){
          setSuccess(json.message);
        }else{
          setSuccess("Your post drafted sucessfully")
        }
        navigate("/")
        setError('');
      } else {
        setSuccess('');
        setError(json.error);
      }
    } catch (error) {
      setSuccess('');
      setError('An unexpected error occurred.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []); // Ensure files is an array
    setImages((prevImages) => [...prevImages, ...files]);
    const newImagePreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
  };
  

// Handler to remove image
const handleRemoveImage = (index) => {
  setImages(prevImages => prevImages.filter((_, i) => i !== index)); // Remove image at the specified index
  setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index)); // Remove preview at the specified index
};


  return (
    <main className="bg-gray-100 min-h-screen p-5 flex-row">
      <h1 className="text-2xl font-semibold mb-4 max-sm:text-xl">I AM LOOKING FOR</h1>
      <p className="text-lg mb-8 text-gray-700">Use this form to list your requirement.</p>
      <div className="mb-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </div>
      <div className="flex flex-col lg:flex-row flex-1">
        
        <div className="flex-1 bg-white px-8 py-4 shadow-md lg:mr-8 mb-8 lg:mb-0">
          <h1 className='text-2xl font-semibold mb-4'>What are you looking for</h1>
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
                <label htmlFor="roomSize" className="text-gray-700 text-sm font-medium mb-1">Name of what I am looking *</label>
                <input
                  type="text"
              value={lookingfor}
              onChange={(e) => setLookingFor(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                />
              </div>

              <div className="mb-4">
      {/* Label for the description field */}
      <label className="block text-lg font-medium text-gray-700">{'Description* '}</label>
      
      {/* Editor container with Tailwind styles */}
      <div className="block border border-gray-200 shadow-sm max-h-[300px] overflow-hidden">
        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          wrapperClassName="border-none"
          editorClassName="min-h-[200px] bg-white p-2"
        />
      </div>
    </div>
              <div className="flex flex-col">
                <label htmlFor="monthlyRent" className="text-gray-700 text-sm font-medium mb-1">Brand Name *</label>
                <input
                  type="text"
                  id="monthlyRent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="deposit" className="text-gray-700 text-sm font-medium mb-1">My Budget for the Unit $ </label>


                
              <CurrencyInput
  id="validation-example-2-field"
  placeholder="$1,234,567"
  onValueChange={(value, name, values) => {
    const formattedValue = value ? `${parseFloat(value).toFixed(2)}` : '';
    setBudget(formattedValue);
  }}
  value={budget}
  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  prefix={'$'}
  step={10}
/>

              </div>

              
    

            </div>
          </form>
        </div>

        <div className="lg:w-1/3 lg:pl-8 flex-1">
        
              
        <div className="bg-gray-50 p-4 border border-gray-300 mb-4">
  <h2 className="text-2xl font-semibold mb-4">Upload pictures</h2>
  <p className="text-gray-600 mb-4">
    Upload an image . Recommended size: 1024x1024 and less than 15MB.
  </p>
  <p className="text-sm text-gray-500 mb-2"></p>
  
  {/* Image Preview */}
  {imagePreviews.length > 0 ? (
  imagePreviews.map((image, index) => (
    <div key={index} className="flex items-center mb-4">
      <img
        src={image}
        alt={`Preview ${index}`}
        className="border border-gray-300 w-14 h-14 object-cover"
      />
      <div className="ml-4 flex flex-1 items-center">
        <p className="text-sm text-gray-700 flex-1">Image {index + 1}</p>
        <button
          type="button"
          onClick={() => handleRemoveImage(index)} // Call remove handler with the index
          className="text-red-500 hover:text-red-700 text-sm ml-4"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  ))
) : (
            <div className="flex items-center mb-4">
              <img
                src={"https://sp-seller.webkul.com/img/No-Image/No-Image-140x140.png"}
                alt="Preview"
                className="border border-gray-300 w-24 h-24 object-cover"
              />
              <div className="ml-4 flex flex-1 items-center">
                <p className="text-sm text-gray-700 flex-1">{imageName}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => document.getElementById('images').click()}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-4 rounded"
          >
            Upload Image
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
          Note: Image can be uploaded of any dimension but we recommend you upload an image with dimensions of 1024x1024 & its size must be less than 15MB.
        </p>

        </div>
      </div>

      <hr className="border-t border-gray-500 my-4" />
      <div className="mt-8 flex ">
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

export default PeopleLooking;




// import React, { useEffect, useState } from 'react';
// import { FaTrash } from 'react-icons/fa';
// import RTC from '../component/editor';
// import { EditorState , ContentState, convertToRaw } from "draft-js";
// import { useLocation } from 'react-router-dom';
// import CurrencyInput from 'react-currency-input-field';
// import { Editor } from 'react-draft-wysiwyg'
// import { useNavigate } from 'react-router-dom';
// import draftToHtml from 'draftjs-to-html';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; 

// const PeopleLooking = () => {
//   // State hooks for form fields
//   const [location, setLocation] = useState('');
//   const[lookingfor , setLookingFor]=useState('')
//   const [name , setName] = useState('')
//   const[budget , setBudget]= useState(null)
  
//   const [images, setImages] = useState([]);  const [imageName, setImageName] = useState('');
//   const [success, setSuccess] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [city , setCity] = useState("")
//   const [imagePreviews, setImagePreviews] = useState([]); // Keep previews here
//   const [editorState, setEditorState] = useState(EditorState.createEmpty());
//   const [description, setDescription] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const locationData = useLocation();
//   const [Zip , setZip] = useState("")
//   const navigate = useNavigate()
//   const { product } = locationData.state || {};

//   const usStates = [
//     "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
//     "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
//     "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
//     "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
//     "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
//     "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
//     "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
//     "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
//     "Washington", "West Virginia", "Wisconsin", "Wyoming"
//   ]; 





  
//   useEffect(() => {
//     if (product) {
//       console.log(product)
//       const roomListing = product.looking;
//       setZip(roomListing.zip)
//       setLookingFor(roomListing.brand)
//       setLocation(roomListing.location.split("_")[1]);
//       setCity(roomListing.location.split("_")[0])

//       setBudget(roomListing.sale_price)
//       setImages(roomListing.image || []); // Fallback to an empty array if undefined
//       setImageName(roomListing.imageName || '');
//       setName(roomListing.name)
//       setIsEditing(true);
//       // const textDescrip = product.body_html.replace(/<br\s*\/?>|&nbsp;/gi, '');
//       const textDescrip = product.body_html.replace(
//         /<br\s*\/?>|&nbsp;/gi, // Remove unwanted tags
//         ""
//       );
      
//       setDescription(textDescrip)
//       if (roomListing.description) {
//         const contentState = ContentState.createFromText(textDescrip);
//         setEditorState(EditorState.createWithContent(contentState));
//       } else {
//         setEditorState(EditorState.createEmpty());
//       }
//       if (product.images && Array.isArray(product.images)) {
//         const imageFiles = product.images.map(async(img) => {
//           const blob = await fetch(img.src).then((r) => r.blob());
//           return new File([blob], img.alt || 'product-image.jpg', { type: 'image/jpeg' });
//         });
  
//         Promise.all(imageFiles).then((files) => {
//           setImages(files);
//           setImagePreviews(product.images.map((img) => img.src));
//         });
//       }
//     }
//   }, []);

//   // const onEditorStateChange = (newEditorState) => {
//   //   setEditorState(newEditorState);
//   //   const currentText = newEditorState.getCurrentContent().getPlainText("\u0001");
//   //   setDescription(currentText);
//   // };
//   const onEditorStateChange = (newEditorState) => {
//     setEditorState(newEditorState);
//   };
  

//   // Handler for form submission


// // const handleSubmit = async (e, status) => {
// //   const rawContentState = convertToRaw(editorState.getCurrentContent());
// //   const htmlContent = draftToHtml(rawContentState);

// //   const modifiedContent = htmlContent
// //     .replace(/<p>/g, "")
// //     .replace(/<\/p>/g, "<br />")  // Replaces <p> and </p> with <br />
// //     .replace(/&nbsp;/g, " ");      // Replaces &nbsp; with normal spaces.

// //   e.preventDefault();
// //   setError('');
// //   setSuccess('');

// //   if (status === "active") {
// //     setLoading(true);
// //   }

// //   const formData = new FormData();
// //   const id = localStorage.getItem('userid');

// //   let fullLocation = city.concat("_", location);
// //   formData.append('location', fullLocation);
// //   formData.append('zip', Zip);
// //   formData.append('name', lookingfor);
// //   formData.append('brand', name);

// //   if (budget === null || !budget) {
// //     formData.append('sale_price', 0);
// //   } else {
// //     formData.append('sale_price', budget);
// //   }

// //   formData.append('description', modifiedContent);
// //   formData.append('userId', id);

// //   if (!isEditing) {
// //     formData.append('status', status);  // For Publish: active status
// //   }

// //   try {
// //     // Submit the main form data (excluding images)
// //     const response = await fetch(
// //       isEditing
// //         ? `https://medspaa.vercel.app/product/updateListing/${product.id}`
// //         : "https://medspaa.vercel.app/product/lookingFor",
// //       {
// //         method: isEditing ? "PUT" : "POST",
// //         body: formData
// //       }
// //     );

// //     const json = await response.json();

// //     if (response.ok) {
// //       const createdProductId = json.product?.id || product.id; // Use the returned product ID or the existing one for updating
      
// //       if (status === "active") {
// //         setSuccess(json.message); // Success message for publishing
// //       } else {
// //         setSuccess("Your post was drafted successfully");
// //       }

// //       // Proceed with image upload only after the main form submission is successful
// //       if (images && images.length > 0) {
// //         // Loop through images and upload one by one
// //         for (let i = 0; i < images.length; i++) {
// //           const formDataImages = new FormData();
// //           formDataImages.append('images', images[i]); // Add the image to FormData

// //           // Send the request for each image and wait for it to complete before continuing
// //           const imageResponse = await fetch(`https://medspaa.vercel.app/product/updateImages/${createdProductId}`, {
// //             method: "PUT", // Assuming a PUT request to update the image
// //             body: formDataImages
// //           });

// //           const imageJson = await imageResponse.json();
// //           if (imageResponse.ok) {
// //             console.log(`Image ${i + 1} uploaded successfully:`, imageJson);
// //           } else {
// //             setError(imageJson.error || `Error uploading image ${i + 1}.`);
// //             return; // If any image fails, stop the process and do not navigate
// //           }
// //         }
// //       }

// //       // Once the images are successfully uploaded, navigate to the homepage
// //       navigate("/");

// //     } else {
// //       setSuccess('');
// //       setError(json.error);
// //     }
// //   }  catch (error) {
// //     setSuccess('');
// //     setError('The following images exceed the 50MB size limit');
// //     setTimeout(() => {
// //       setError('');  // Clear the error after 5 seconds
// //     }, 5000);
// //     console.log(error);
// //   } finally {
// //     setLoading(false);
// //   }
  
// // };
// const handleSubmit = async (e, status) => {
//   const rawContentState = convertToRaw(editorState.getCurrentContent());
//   const htmlContent = draftToHtml(rawContentState);

//   const modifiedContent = htmlContent
//     .replace(/<p>/g, "")
//     .replace(/<\/p>/g, "<br />")  // Replaces <p> and </p> with <br />
//     .replace(/&nbsp;/g, " ");      // Replaces &nbsp; with normal spaces.

//   e.preventDefault();
//   setError(''); // Clear previous errors
//   setSuccess(''); // Clear previous success messages

//   // Form validation: Ensure all required fields are filled out
//   // Uncomment the validation checks when needed
//   if (!lookingfor || !name || !Zip || !city || !location) {
//     setError('Please fill in all required fields');
//     setLoading(false);  // Stop the loader in case of validation error
//     return;  // Return early and prevent further processing
//   }

//   if (status === "active") {
//     setLoading(true);  // Only set loading if validation passes and status is active
//   }

//   // Image validation: Check image size and type first
//   if (images && images.length > 0) {
//     for (let i = 0; i < images.length; i++) {
//       const image = images[i];

//       // Validate image size (max size limit: 50MB)
//       if (image.size > 4.5 * 1024 * 1024) {
//         setError('One or more images exceed the 50MB size limit');
//         setLoading(false);  // Stop the loader if image validation fails
//         setTimeout(() => setError(''), 5000);
//         return; // Stop the process if any image exceeds size limit
//       }

//       // Validate image type (allowed types: jpeg, png, gif)
//       if (!['image/jpeg', 'image/png', 'image/gif'].includes(image.type)) {
//         setError('One or more images have an unsupported file type');
//         setLoading(false);  // Stop the loader if image validation fails

//         setTimeout(() => setError(''), 5000);
//         return; // Stop the process if any image has an unsupported file type
//       }
      
//     }
//   }

//   const formData = new FormData();
//   const id = localStorage.getItem('userid');

//   let fullLocation = city.concat("_", location);
//   formData.append('location', fullLocation);
//   formData.append('zip', Zip);
//   formData.append('name', lookingfor);
//   formData.append('brand', name);

//   if (budget === null || !budget) {
//     formData.append('sale_price', 0);
//   } else {
//     formData.append('sale_price', budget);
//   }

//   formData.append('description', modifiedContent);
//   formData.append('userId', id);

//   if (!isEditing) {
//     formData.append('status', status);  // For Publish: active status
//   }

//   try {
//     // Submit the main form data (excluding images)
//     const response = await fetch(
//       isEditing
//         ? `https://medspaa.vercel.app/product/updateListing/${product.id}`
//         : "https://medspaa.vercel.app/product/lookingFor",
//       {
//         method: isEditing ? "PUT" : "POST",
//         body: formData
//       }
//     );

//     const json = await response.json();

//     if (response.ok) {
//       const createdProductId = json.product?.id || product.id; // Use the returned product ID or the existing one for updating

//       if (status === "active") {
//         setSuccess(json.message); // Success message for publishing
//       } else {
//         setSuccess("Your post was drafted successfully");
//       }

//       // Proceed with image upload only after the main form submission is successful
//       if (images && images.length > 0) {
//         // Loop through images and upload one by one
//         for (let i = 0; i < images.length; i++) {
//           const formDataImages = new FormData();
//           formDataImages.append('images', images[i]); // Add the image to FormData

//           // Send the request for each image and wait for it to complete before continuing
//           const imageResponse = await fetch(`http://localhost:5000/product/updateImages/${createdProductId}`, {
//             method: "PUT", // Assuming a PUT request to update the image
//             body: formDataImages
//           });
//           console.log(imageResponse);
//           const imageJson = await imageResponse.json();
//           if (imageResponse.ok) {
//             console.log(`Image ${i + 1} uploaded successfully:`, imageJson);
//           } else {
//             setError(imageJson.error || `Error uploading image ${i + 1}.`);
//             setLoading(false);  // Stop the loader if image upload fails
//             return; // If any image fails, stop the process and do not navigate
//           }
//         }
//       }

//       // Once the images are successfully uploaded, navigate to the homepage
//       navigate("/");

//     } else {
//       setSuccess('');
//       setError(json.error);
//       setLoading(false); // Stop the loader if the main form submission fails
//     }
//   } catch (error) {
//     setSuccess('');
//     setError('One or more images exceed the 50MB size limit');
//     setTimeout(() => {
//       setError('');  // Clear the error after 5 seconds
//     }, 5000);
//     console.log(error);
//     setLoading(false); // Stop the loader in case of network errors
//   } finally {
//     // This will stop the loader if the process reaches here
//     setLoading(false);
//   }
// };




//   // const handleImageChange = (e) => {
//   //   const files = Array.from(e.target.files || []); // Ensure files is an array
//   //   setImages((prevImages) => [...prevImages, ...files]);
//   //   const newImagePreviews = files.map((file) => URL.createObjectURL(file));
//   //   setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
//   // };
  
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files || []); // Ensure files is an array
//     const maxSize = 50 * 1024 * 1024; // 50MB in bytes
//     let validImages = [];
//     let invalidImages = [];
  
//     files.forEach((file) => {
//       if (file.size > maxSize) {
//         // If file size exceeds 50MB, add it to the invalidImages array
//         invalidImages.push(file);
//       } else {
//         // Otherwise, add to the validImages array
//         validImages.push(file);
//       }
//     });
  
//     // If there are any invalid images, show an error message
//     if (invalidImages.length > 0) {
//       setError(`The following images exceed the 50MB size limit: ${invalidImages.map(file => file.name).join(", ")}`);
//     }
  
//     // Add only the valid images to the state
//     setImages((prevImages) => [...prevImages, ...validImages]);
  
//     // Preview the valid images
//     const newImagePreviews = validImages.map((file) => URL.createObjectURL(file));
//     setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
//   };
  




// const handleRemoveImage = (index) => {
//   setImages(prevImages => prevImages.filter((_, i) => i !== index)); // Remove image at the specified index
//   setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index)); // Remove preview at the specified index
// };


//   return (
//     <main className="bg-gray-100 min-h-screen p-5 flex-row">
//       <h1 className="text-2xl font-semibold mb-4 max-sm:text-xl">I AM LOOKING FOR</h1>
//       <p className="text-lg mb-8 text-gray-700">Use this form to list your requirement.</p>
//       <div className="mb-4">
//         {error && <div className="text-red-500">{error}</div>}
//         {success && <div className="text-green-500">{success}</div>}
//       </div>
//       <div className="flex flex-col lg:flex-row flex-1">
        
//         <div className="flex-1 bg-white px-8 py-4 shadow-md lg:mr-8 mb-8 lg:mb-0">
//           <h1 className='text-2xl font-semibold mb-4'>What are you looking for</h1>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 gap-6">
              
//             <div className='flex flex-row max-sm:flex-col '>
//             <div className="flex flex-col flex-1 mr-4 max-sm:mr-0">
//   <label htmlFor="location" className="text-gray-700 text-sm font-medium mb-1">Location STATE *</label>
//   <select
//     id="location"
//     value={location}
//     onChange={(e) => setLocation(e.target.value)}
//     className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//     required
//   >
//     <option value="">Select a state</option>
//     {usStates.map((state) => (
//       <option key={state} value={state}>
//         {state}
//       </option>
//     ))}
//   </select>
// </div>

//               <div className="flex flex-col flex-1 ">
//                 <label htmlFor="location" className="text-gray-700 text-sm font-medium mb-1">Location ZIP CODE *</label>
//                 <input
//                   type="number"
//                   id="location"
//                   value={Zip}
//                   onChange={(e) => setZip(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none "
//                   required
//                 />
//               </div>
//               </div>

              
//     <div className="flex flex-col">
//                 <label htmlFor="name" className="text-gray-700 text-sm font-medium mb-1">City *</label>
//                 <input
//                   type="text"
//                   id="City"
//                   value={city}
//                   onChange={(e) => setCity(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   required
//                 />
//               </div>


//               <div className="flex flex-col">
//                 <label htmlFor="roomSize" className="text-gray-700 text-sm font-medium mb-1">Name of what I am looking *</label>
//                 <input
//                   type="text"
//               value={lookingfor}
//               onChange={(e) => setLookingFor(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//       {/* Label for the description field */}
//       <label className="block text-lg font-medium text-gray-700">{'Description* '}</label>
      
//       {/* Editor container with Tailwind styles */}
//       <div className="block border border-gray-200 shadow-sm max-h-[300px] overflow-hidden">
//         <Editor
//           editorState={editorState}
//           onEditorStateChange={onEditorStateChange}
//           wrapperClassName="border-none"
//           editorClassName="min-h-[200px] bg-white p-2"
//         />
//       </div>
//     </div>
//               <div className="flex flex-col">
//                 <label htmlFor="monthlyRent" className="text-gray-700 text-sm font-medium mb-1">Brand Name *</label>
//                 <input
//                   type="text"
//                   id="monthlyRent"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                   required
//                 />
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="deposit" className="text-gray-700 text-sm font-medium mb-1">My Budget for the Unit $ </label>


                
//               <CurrencyInput
//   id="validation-example-2-field"
//   placeholder="$1,234,567"
//   onValueChange={(value, name, values) => {
//     const formattedValue = value ? `${parseFloat(value).toFixed(2)}` : '';
//     setBudget(formattedValue);
//   }}
//   value={budget}
//   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//   prefix={'$'}
//   step={10}
// />

//               </div>

              
    

//             </div>
//           </form>
//         </div>

//         <div className="lg:w-1/3 lg:pl-8 flex-1">
        
              
//         <div className="bg-gray-50 p-4 border border-gray-300 mb-4">
//   <h2 className="text-2xl font-semibold mb-4">Upload pictures</h2>
//   <p className="text-gray-600 mb-4">
//     Upload an image . Recommended size: 2048x1024 and less than 50MB.
//   </p>
//   <p className="text-sm text-gray-500 mb-2"></p>
  
//   {/* Image Preview */}
//   {error && <div className="text-red-500">{error}</div>}
//   {imagePreviews.length > 0 ? (
//   imagePreviews.map((image, index) => (
//     <div key={index} className="flex items-center mb-4">
//       <img
//         src={image}
//         alt={`Preview ${index}`}
//         className="border border-gray-300 w-14 h-14 object-cover"
//       />
//       <div className="ml-4 flex flex-1 items-center">
//         <p className="text-sm text-gray-700 flex-1">Image {index + 1}</p>
//         <button
//           type="button"
//           onClick={() => handleRemoveImage(index)} // Call remove handler with the index
//           className="text-red-500 hover:text-red-700 text-sm ml-4"
//         >
//           <FaTrash />
//         </button>
//       </div>
//     </div>
//   ))
// ) : (
//             <div className="flex items-center mb-4">
//               <img
//                 src={"https://sp-seller.webkul.com/img/No-Image/No-Image-140x140.png"}
//                 alt="Preview"
//                 className="border border-gray-300 w-24 h-24 object-cover"
//               />
//               <div className="ml-4 flex flex-1 items-center">
//                 <p className="text-sm text-gray-700 flex-1">{imageName}</p>
//               </div>
//             </div>
//           )}

//           <button
//             onClick={() => document.getElementById('images').click()}
//             className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-4 rounded"
//           >
//             Browse Image
//           </button>
//           <input
//             type="file"
//                 id="images"
//             onChange={handleImageChange}
//             multiple
//             className="hidden"
//           />
//         </div>
//         <p className="text-sm text-gray-500">
//           Note: Image can be uploaded of any dimension but we recommend you upload an image with dimensions of 2048x1024 & its size must be less than 50MB.
//         </p>

//         </div>
//       </div>

//       <hr className="border-t border-gray-500 my-4" />
//       <div className="mt-8 flex ">
//       {loading && (
//   <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex flex-col justify-center items-center z-50">
//     <img
//       src="https://i.gifer.com/4V0b.gif" // Replace this with your spinning GIF URL
//       alt="Loading..."
//       className="w-16 h-16" // You can adjust the size of the GIF here
//     />
//     <p className="mt-4 text-white font-semibold">Please do not close</p> {/* Text below the spinner */}
//   </div>
// )}

//       <button
//           type="submit"
//           onClick={(e) => handleSubmit(e, 'active')}
//           className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 mr-4 border-blue-700 hover:border-blue-500 rounded flex items-center"
//           disabled={loading}
//         >
//           {loading && (
//             <svg
//               className="w-5 h-5 mr-3 text-white animate-spin"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               />
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0z"
//               />
//             </svg>
//           )}
//           {isEditing ? "Update" : "Publish"}
//         </button>
//       {!isEditing ?(
//   <button
//   type="submit"
//   onClick={(e) => handleSubmit(e, 'draft')}
//   className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded flex items-center"
// >
//   Draft
// </button>
//       ):null
//       }
      
//       </div>
//     </main>
//   );
// };

// export default PeopleLooking;
