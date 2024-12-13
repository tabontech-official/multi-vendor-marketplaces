// import React, { useEffect, useState } from 'react';
// import { FaTrash } from 'react-icons/fa';
// import RTC from '../component/editor';
// import { convertToRaw, EditorState , ContentState } from "draft-js";
// import { useLocation, useNavigate } from 'react-router-dom';
// import CurrencyInput from 'react-currency-input-field';
// import draftToHtml from 'draftjs-to-html';
// import { Editor } from 'react-draft-wysiwyg'
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; 


// const PostEquipmentForm = () => {
//   // State hooks for form fields
//   const [Location, setLocation] = useState('');
//   const [equipmentName, setEquipmentName] = useState('');
//   const [brandName, setBrandName] = useState('');
//   const [askingPrice, setAskingPrice] = useState('');
//   const [acceptOffers, setAcceptOffers] = useState();
//   const [equipmentType, setEquipmentType] = useState('');
//   const [certification, setCertification] = useState('');
//   const [yearPurchased, setYearPurchased] = useState('');
//   const [warranty, setWarranty] = useState('');
//   const [reasonForSelling, setReasonForSelling] = useState('');
//   const [shipping, setShipping] = useState('');
//   const [images, setImages] = useState([]);
//   const [imageName, setImageName] = useState('');
//   const [success, setSuccess] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showRemoveOption, setShowRemoveOption] = useState(false);
//   const [description, setDescription] = useState("");
//   const [editorState, setEditorState] = useState();
//   const location = useLocation();
//   const [isEditing, setIsEditing] = useState(false); // New state for editing mode
//   const [imagePreviews, setImagePreviews] = useState([]); // Keep previews here
//    const [Zip , setZip] = useState("")
//   const { product } = location.state || {};
//   const navigate = useNavigate()
//   const [city, setCity] = useState('');
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


  
// console.log(product)
//   useEffect(() => {
//     if (product) {
//       setIsEditing(true);
//       const locationParts = product.equipment.location.split('_');
//       const cityFromLocation = locationParts[0] || '';
//       const stateFromLocation = locationParts[1] || '';
      
//       setLocation(product.equipment.location); // Ensure Location is in the correct city_state format
//       setCity(cityFromLocation); // City is the first
//       setEquipmentName(product.equipment.name);
//       setBrandName(product.equipment.brand); // Assuming `brand` is part of the product object
//       setAskingPrice(product.equipment.asking_price);
//       setAcceptOffers(product.equipment.accept_offers);
//       setEquipmentType(product.equipment.equipment_type);
//       setCertification(product.equipment.certification);
//       setYearPurchased(product.equipment.year_purchased);
//       setWarranty(product.equipment.warranty);
//       setReasonForSelling(product.equipment.reason_for_selling);
//       setShipping(product.equipment.shipping);
//       // const textDescrip = product.equipment.description.replace(/<br\s*\/?>|&nbsp;/gi, '');
//       const textDescrip = product.equipment.description.replace(
//         /<br\s*\/?>|&nbsp;/gi, // Remove unwanted tags
//         ""
//       );
//       setDescription(textDescrip)
//      setZip(product.equipment.zip)
     


//      if (product.equipment.description) {
//       const contentState = ContentState.createFromText(textDescrip);
//       setEditorState(EditorState.createWithContent(contentState));
//     } else {
//       setEditorState(EditorState.createEmpty());
//     }

//     if (product.images && Array.isArray(product.images)) {
//       const imageFiles = product.images.map(async(img) => {
//         const blob = await fetch(img.src).then((r) => r.blob());
//         return new File([blob], img.alt || 'product-image.jpg', { type: 'image/jpeg' });
//       });

//       Promise.all(imageFiles).then((files) => {
//         setImages(files);
//         setImagePreviews(product.images.map((img) => img.src));
//       });
//     }
//     }
//   },[]);

  

//   const onEditorStateChange = (newEditorState) => {
//     setEditorState(newEditorState);
//   };

//   console.log(description)

//   // Handler for form submission
//   const handleSubmit = async (e, status) => {

//     const rawContentState = convertToRaw(editorState.getCurrentContent());
//     const htmlContent = draftToHtml(rawContentState);

//     // const modifiedContent = htmlContent.replace(/<p>/g, '').replace(/<\/p>/g, '<br />');
//     const modifiedContent = htmlContent
//     .replace(/<p>/g, "")
//     .replace(/<\/p>/g, "<br />") // You can replace paragraph tags with <br /> or leave empty if you don't want any formatting
//     .replace(/&nbsp;/g, " "); // Remove &nbsp; (non-breaking spaces) and replace with normal spaces.

   

  
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setLoading(true);

//     const  Id = localStorage.getItem('userid');
  
//     const formData = new FormData();


//     if(images.length > 0 ){
//       images.map((image)=>{
//         formData.append('images', image); // Append each file
//       })
//     }
   
   

//     // Append other form fields to FormData
//     const locationValue = `${city}_${Location.split('_')[1] || ''}`;

//     formData.append('location', locationValue);
//     formData.append('city', city);
//     formData.append('zip', Zip)
//     formData.append('name', equipmentName);
//     formData.append('brand', brandName);
//     formData.append('asking_price', askingPrice);
//     formData.append('accept_offers', acceptOffers);
//     formData.append('equipment_type', equipmentType);
//     formData.append('certification', certification);
//     formData.append('year_purchased',yearPurchased);
//     formData.append('warranty', warranty);
//     formData.append('reason_for_selling', reasonForSelling);
//     formData.append('shipping', shipping);
//     formData.append('description', modifiedContent); 
//     formData.append('userId',  Id);
//     if(!isEditing){
//       formData.append('status', status);
//       }
//     try {
//       const response = await fetch(isEditing ? `https://medspaa.vercel.app/product/updateListing/${product.id}` : "https://medspaa.vercel.app/product/addEquipment", {
//         method: isEditing ? "PUT" : "POST",
//         body: formData
//       });

//       const json = await response.json();

//       if (response.ok) {
//         setSuccess(status === "active" ? json.message : "Your post drafted successfully");
//         navigate("/")
//         setError('');
//       } else{
//         setSuccess('');
//       setError( json.error ||'An unexpected error occurred.' || json.error.errors.value);    
//       console.log(json.error)
//       }
 
//     } catch (error) {
//       setSuccess('');
//       setError( error.error ||'An unexpected error occurred.' || error.error.errors.value);
//       console.log(error.error.errors)
//     } finally {
//       setLoading(false); 
//     }
//   };

//   // Handler for image file change
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files); // Get all selected files
//     setImages(prevImages => [...prevImages, ...files]); // Store file objects
//     const newImagePreviews = files.map(file => URL.createObjectURL(file)); // Create object URLs for preview
//     setImagePreviews(prevPreviews => [...prevPreviews, ...newImagePreviews]); // Append to the existing previews
//   };

//   // Handler to remove image
//   const handleRemoveImage = (index) => {
//     setImages(prevImages => prevImages.filter((_, i) => i !== index)); // Remove image at the specified index
//     setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index)); // Remove preview at the specified index
//   };
//   return (
//     <main className="bg-gray-100 min-h-screen p-5 flex-row">
//       <h1 className="text-2xl font-semibold mb-4 max-sm:text-xl">Add Used Equipment Listing</h1>
//       <p className="text-lg mb-8 text-gray-700">Use this form to list your Used equipment.</p>
//       <div className="mb-4">
//         {error && <div className="text-red-500">{error}</div>}
//         {success && <div className="text-green-500">{success}</div>}
//       </div>
//       <div className="flex flex-col lg:flex-row flex-1">
        
//         <div className="flex-1 bg-white px-8 py-4 shadow-md lg:mr-8 mb-8 lg:mb-0">
//           <h1 className='text-2xl font-semibold mb-4 max-sm:text-xl '>Equipment Details</h1>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 gap-6">
            

//             <div className='flex flex-row max-sm:flex-col '>
             
// <div className="flex flex-col flex-1 mr-4 max-sm:mr-0">
//   <label htmlFor="location" className="text-gray-700 text-sm font-medium mb-1">Location STATE *</label>
// <select
//       value={Location.split('_')[2] || Location.split('_')[1]} // Set state from Location
//       onChange={(e) => {
//         setLocation(`${city}_${e.target.value}`); // Dynamically update Location when state is selected
//       }}
//       className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//       required
//     >
//       <option value="">Select a state</option>
//       {usStates.map((state) => (
//         <option key={state} value={state}>
//           {state}
//         </option>
//       ))}
//     </select> 
// </div>

//               <div className="flex flex-col flex-1 ">
//                 <label htmlFor="location" className="text-gray-700 text-sm font-medium mb-1">Location ZIP CODE *</label>
//                 <input
//                   type="number"
//                   id="location"
//                   value={Zip}
//                   onChange={(e) => setZip(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                   required
//                 />
//               </div>
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="name" className="text-gray-700 text-sm font-medium mb-1">City *</label>
//                 <input
//                   type="text"
//                   id="City"
//                   value={city}
//                   onChange={(e) => {
//                     setCity(e.target.value);
//                     // setLocation(`${e.target.value}_${Location.split('_')[1]}`); // Update Location dynamically
//                   }}
//                   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   required
//                 />
//               </div>


//               <div className="flex flex-col">
//                 <label htmlFor="name" className="text-gray-700 text-sm font-medium mb-1">Equipment Name *</label>
//                 <input
//                   type="text"
//                   id="name"
//                   value={equipmentName}
//                   onChange={(e) => setEquipmentName(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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

//               <div className="flex flex-col mt-4">
//                 <label htmlFor="brandName" className="text-gray-700 text-sm font-medium mb-1">Brand Name *</label>
//                 <input
//                   type="text"
//                   id="brandName"
//                   value={brandName}
//                   onChange={(e) => setBrandName(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   required
//                 />
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="askingPrice" className="text-gray-700 text-sm font-medium mb-1">Asking Price $ *</label>
               
               
//               <CurrencyInput 
//   id="validation-example-2-field"
//   placeholder="$1,234,567"
//   onValueChange={(value, name, values) => {
//     const formattedValue = value ? `${parseFloat(value).toFixed(2)}` : '';
//     setAskingPrice(formattedValue);
//   }}
//   value={askingPrice}
//   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//   prefix={'$'}
//   step={10}
// />
               
  
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="acceptOffers" className="text-gray-700 text-sm font-medium mb-1">Accept Offers *</label>
//                 <select
//                   id="acceptOffers"
//                   value={acceptOffers}
//                   onChange={(e) => setAcceptOffers(e.target.value === 'true')}
//                   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   required
//                 >
//                   <option value="">Select an option</option>
//                   <option value="true">Yes</option>
//                   <option value="false">no</option>
//                 </select>
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="equipmentType" className="text-gray-700 text-sm font-medium mb-1">Equipment Type *</label>
//                 <select
//                   id="equipmentType"
//                   value={equipmentType}
//                   onChange={(e) => setEquipmentType(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   required
//                 >
//                   <option value="">Select a type</option>
//                   <option value="Skin care">Skin Care</option>
//                   <option value="Body shaping">Body Shaping</option>
//                   <option value="Laser Hair removal">Laser Hair Removal</option>
//                   <option value="Laser skin care">Laser Skin Care</option>
//                   <option value="Laser tattoo removal">Laser Tattoo Removal</option>
//                   <option value="Lab equipment">Lab Equipment</option>
//                   <option value="Other aesthetic device">Other Aesthetic Device</option>
//                   <option value="Other Medical device">Other Medical Device</option>
//                   <option value="Furniture">Furniture</option>
//                   <option value="Small tools">Small Tools</option>
//                 </select>
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="certification" className="text-gray-700 text-sm font-medium mb-1">Certification *</label>
//                 <select
//                   id="certification"
//                   value={certification}
//                   onChange={(e) => setCertification(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   required
//                 >
//                   <option value="">Select certification</option>
//                   <option value="FDA approved">FDA approved</option>
//                   <option value="FDA Registerd">FDA Registerd</option>
//                   <option value="CE certified">CE certified</option>
//                   <option value="Unknown">Unknown</option>
//                 </select>
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="yearPurchased" className="text-gray-700 text-sm font-medium mb-1">Year Purchased *</label>
//                 <input
//                   type="date"
//                   id="yearPurchased"
//                   value={yearPurchased}
//                   onChange={(e) => setYearPurchased(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   required
//                 />
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="warranty" className="text-gray-700 text-sm font-medium mb-1">Warranty *</label>
//                 <select
//                   id="warranty"
//                   value={warranty}
//                   onChange={(e) => setWarranty(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   required
//                 >
//                   <option value="">Select a warranty</option>
//                   <option value="No warranty, as it is">No warranty, as it is</option>
//                   <option value="Still under manufacturer warranty">Still under manufacturer warranty</option>
//                   <option value="6 month warranty">6 month warranty</option>
//                 </select>
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="reasonForSelling" className="text-gray-700 text-sm font-medium mb-1">Reason for Selling *</label>
//                 <select
//                   id="reasonForSelling"
//                   value={reasonForSelling}
//                   onChange={(e) => setReasonForSelling(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   required
//                 >
//                   <option value="">Select reason</option>
//                   <option value="Upgrading">Upgrading</option>
//                   <option value="No longer needed">No longer needed</option>
//                   <option value="Business closure">Business closure</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="shipping" className="text-gray-700 text-sm font-medium mb-1">Shipping *</label>
//                 <select
//                   id="shipping"
//                   value={shipping}
//                   onChange={(e) => setShipping(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   required
//                 >
//                   <option value="">Select shipping option</option>
//                   <option value="free shipping">Free shipping</option>
//                   <option value="pick up only">Pick up only</option>
//                   <option value="Available at cost">Available at cost</option>
//                 </select>
//               </div>

//             </div>
//           </form>
//         </div>

//         <div className="lg:w-1/3 lg:pl-8 flex-1">
         
//         <div className="bg-gray-50 p-4 border border-gray-300 mb-4">
//           <h2 className="text-2xl font-semibold mb-4">Equipment Image</h2>
//           <p className="text-gray-600 mb-4">
//             Upload an image of the equipment. Recommended size: 1024x1024 and less than 15MB.
//           </p>

//           {/* Image Preview */}
//           {imagePreviews.length > 0 ? (
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
//             Upload Image
//           </button>
//           <input 
//                 id="images"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 multiple
//             className="hidden"
//           />
//         </div>
//         <p className="text-sm text-gray-500">
//           Note: Image can be uploaded of any dimension but we recommend you upload an image with dimensions of 1024x1024 & its size must be less than 15MB.
//         </p>

//         </div>
//       </div>

//       <hr className="border-t border-gray-500 my-4" />
//       <div className="mt-8 flex ">
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

// export default PostEquipmentForm;

import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor';
import { convertToRaw, EditorState , ContentState , convertFromRaw } from "draft-js";
import { useLocation, useNavigate } from 'react-router-dom';
import CurrencyInput from 'react-currency-input-field';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; 


const PostEquipmentForm = () => {
  // State hooks for form fields
  const [Location, setLocation] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [acceptOffers, setAcceptOffers] = useState();
  const [equipmentType, setEquipmentType] = useState('');
  const [certification, setCertification] = useState('');
  const [yearPurchased, setYearPurchased] = useState('');
  const [warranty, setWarranty] = useState('');
  const [reasonForSelling, setReasonForSelling] = useState('');
  const [shipping, setShipping] = useState('');
  const [images, setImages] = useState([]);
  const [imageName, setImageName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);
  const [description, setDescription] = useState("");
  const [editorState, setEditorState] = useState();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false); // New state for editing mode
  const [imagePreviews, setImagePreviews] = useState([]); // Keep previews here
   const [Zip , setZip] = useState("")
  const { product } = location.state || {};
  const navigate = useNavigate()
  const [city, setCity] = useState('');
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


  
console.log(product)
  useEffect(() => {
    if (product) {
      setIsEditing(true);
      const locationParts = product.equipment.location.split('_');
      const cityFromLocation = locationParts[0] || '';
      const stateFromLocation = locationParts[1] || '';
      
      setLocation(product.equipment.location); // Ensure Location is in the correct city_state format
      setCity(cityFromLocation); // City is the first
      setEquipmentName(product.equipment.name);
      setBrandName(product.equipment.brand); // Assuming `brand` is part of the product object
      setAskingPrice(product.equipment.asking_price);
      setAcceptOffers(product.equipment.accept_offers);
      setEquipmentType(product.equipment.equipment_type);
      setCertification(product.equipment.certification);
      setYearPurchased(product.equipment.year_purchased);
      setWarranty(product.equipment.warranty);
      setReasonForSelling(product.equipment.reason_for_selling);
      setShipping(product.equipment.shipping);
      // const textDescrip = product.equipment.description.replace(/<br\s*\/?>|&nbsp;/gi, '');
    //   const textDescrip = product.equipment.description.replace(
    //     /<br\s*\/?>|&nbsp;/gi, // Remove unwanted tags
    //     ""
    //   );
    //   setDescription(textDescrip)
    //  setZip(product.equipment.zip)
     


    //  if (product.equipment.description) {
    //   const contentState = ContentState.createFromText(textDescrip);
    //   setEditorState(EditorState.createWithContent(contentState));
    // } else {
    //   setEditorState(EditorState.createEmpty());
    // }

    const rawDescription = product.equipment.description || ""; // Your fetched description

  // Remove unwanted tags
  const textDescrip = rawDescription.replace(/<br\s*\/?>|&nbsp;/gi, "");
  setDescription(textDescrip);

  // Set zip code if available
  setZip(product.equipment.zip);

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
  },[]);

  

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  console.log(description)

  // Handler for form submission
  // const handleSubmit = async (e, status) => {

  //   const rawContentState = convertToRaw(editorState.getCurrentContent());
  //   const htmlContent = draftToHtml(rawContentState);

  //   // const modifiedContent = htmlContent.replace(/<p>/g, '').replace(/<\/p>/g, '<br />');
  //   const modifiedContent = htmlContent
  //   .replace(/<p>/g, "")
  //   .replace(/<\/p>/g, "<br />") // You can replace paragraph tags with <br /> or leave empty if you don't want any formatting
  //   .replace(/&nbsp;/g, " "); // Remove &nbsp; (non-breaking spaces) and replace with normal spaces.

   

  
  //   e.preventDefault();
  //   setError('');
  //   setSuccess('');
  //   setLoading(true);

  //   const  Id = localStorage.getItem('userid');
  
  //   const formData = new FormData();


  //   if(images.length > 0 ){
  //     images.map((image)=>{
  //       formData.append('images', image); // Append each file
  //     })
  //   }
   
   

  //   // Append other form fields to FormData
  //   const locationValue = `${city}_${Location.split('_')[1] || ''}`;

  //   formData.append('location', locationValue);
  //   formData.append('city', city);
  //   formData.append('zip', Zip)
  //   formData.append('name', equipmentName);
  //   formData.append('brand', brandName);
  //   formData.append('asking_price', askingPrice);
  //   formData.append('accept_offers', acceptOffers);
  //   formData.append('equipment_type', equipmentType);
  //   formData.append('certification', certification);
  //   formData.append('year_purchased',yearPurchased);
  //   formData.append('warranty', warranty);
  //   formData.append('reason_for_selling', reasonForSelling);
  //   formData.append('shipping', shipping);
  //   formData.append('description', modifiedContent); 
  //   formData.append('userId',  Id);
  //   if(!isEditing){
  //     formData.append('status', status);
  //     }
  //   try {
  //     const response = await fetch(isEditing ? `https://medspaa.vercel.app/product/updateListing/${product.id}` : "https://medspaa.vercel.app/product/addEquipment", {
  //       method: isEditing ? "PUT" : "POST",
  //       body: formData
  //     });

  //     const json = await response.json();

  //     if (response.ok) {
  //       setSuccess(status === "active" ? json.message : "Your post drafted successfully");
  //       navigate("/")
  //       setError('');
  //     } else{
  //       setSuccess('');
  //     setError( json.error ||'An unexpected error occurred.' || json.error.errors.value);    
  //     console.log(json.error)
  //     }
 
  //   } catch (error) {
  //     setSuccess('');
  //     setError( error.error ||'An unexpected error occurred.' || error.error.errors.value);
  //     console.log(error.error.errors)
  //   } finally {
  //     setLoading(false); 
  //   }
  // };

  const handleSubmit = async (e, status) => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);
  
    // Modify content (replace <p> with <br /> and handle &nbsp;)
    const modifiedContent = htmlContent
      .replace(/<p>/g, "")
      .replace(/<\/p>/g, "<br />")  // Replaces <p> and </p> with <br />
      .replace(/&nbsp;/g, " ");      // Replaces &nbsp; with normal spaces.
  
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
  
    const id = localStorage.getItem('userid');  // Get user ID from localStorage
    const formData = new FormData();
  
    // Append other form fields to FormData
    const locationValue = `${city}_${Location.split('_')[1] || ''}`;
    formData.append('location', locationValue);
    formData.append('city', city);
    formData.append('zip', Zip);
    formData.append('name', equipmentName);
    formData.append('brand', brandName);
    formData.append('asking_price', askingPrice);
    formData.append('accept_offers', acceptOffers);
    formData.append('equipment_type', equipmentType);
    formData.append('certification', certification);
    formData.append('year_purchased', yearPurchased);
    formData.append('warranty', warranty);
    formData.append('reason_for_selling', reasonForSelling);
    formData.append('shipping', shipping);
    formData.append('description', modifiedContent);
    formData.append('userId', id);
  
    // Add status for non-editing form submissions
    if (!isEditing) {
      formData.append('status', status);  // Set the post status (active, draft)
    }
  
    try {
      // Submit the form data (images + other details)
      const response = await fetch(
        isEditing
          ? `https://medspaa.vercel.app/product/updateListing/${product.id}`
          : "https://medspaa.vercel.app/product/addEquipment",
        {
          method: isEditing ? "PUT" : "POST", // PUT for update, POST for new post
          body: formData
        }
      );
  
      const json = await response.json();
  
      if (response.ok) {
        setSuccess(status === "active" ? json.message : "Your post drafted successfully");
  
        // After successful form submission, handle image upload if needed
        if (images && images.length > 0) {
          const cloudinaryURLs = [];
          
          // Loop through images and upload each one
          for (let i = 0; i < images.length; i++) {
            const formDataImages = new FormData();
            formDataImages.append('file', images[i]);
            formDataImages.append('upload_preset', 'images'); // Replace with your Cloudinary preset
  
            // Upload image to Cloudinary
            const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/djocrwprs/image/upload', {
              method: "POST",
              body: formDataImages,
            });
  
            const cloudinaryJson = await cloudinaryResponse.json();
  
            if (cloudinaryResponse.ok) {
              cloudinaryURLs.push(cloudinaryJson.secure_url);
              console.log(`Image ${i + 1} uploaded successfully to Cloudinary:`, cloudinaryJson.secure_url);
            } else {
              setError(`Error uploading image ${i + 1} to Cloudinary.`);
              setLoading(false);
              return;  // Stop the process if any image fails
            }
          }
  
          // Once all images are uploaded, save the URLs in the database
          const imageResponse = await fetch(`https://medspaa.vercel.app/product/updateImages/${json.product.id}`, {
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
  
        // Navigate to the homepage after success
        navigate("/");
  
      } else {
        setSuccess('');
        setError(json.error || "An unexpected error occurred.");
        console.log(json.error);
      }
  
    } catch (error) {
      setSuccess('');
      setError(error.error || "An unexpected error occurred.");
      console.log(error);
    } finally {
      setLoading(false);  // Stop the loading spinner when done
    }
  };
  
  
  

  // Handler for image file change
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Get all selected files
    setImages(prevImages => [...prevImages, ...files]); // Store file objects
    const newImagePreviews = files.map(file => URL.createObjectURL(file)); // Create object URLs for preview
    setImagePreviews(prevPreviews => [...prevPreviews, ...newImagePreviews]); // Append to the existing previews
  };

  // Handler to remove image
  const handleRemoveImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index)); // Remove image at the specified index
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index)); // Remove preview at the specified index
  };
  return (
    <main className="bg-gray-100 min-h-screen p-5 flex-row">
      <h1 className="text-2xl font-semibold mb-4 max-sm:text-xl">Add Used Equipment Listing</h1>
      <p className="text-lg mb-8 text-gray-700">Use this form to list your Used equipment.</p>
      <div className="mb-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </div>
      <div className="flex flex-col lg:flex-row flex-1">
        
        <div className="flex-1 bg-white px-8 py-4 shadow-md lg:mr-8 mb-8 lg:mb-0">
          <h1 className='text-2xl font-semibold mb-4 max-sm:text-xl '>Equipment Details</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
            

            <div className='flex flex-row max-sm:flex-col '>
             
<div className="flex flex-col flex-1 mr-4 max-sm:mr-0">
  <label htmlFor="location" className="text-gray-700 text-sm font-medium mb-1">Location STATE *</label>
<select
      value={Location.split('_')[2] || Location.split('_')[1]} // Set state from Location
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
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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


              <div className="flex flex-col">
                <label htmlFor="name" className="text-gray-700 text-sm font-medium mb-1">Equipment Name *</label>
                <input
                  type="text"
                  id="name"
                  value={equipmentName}
                  onChange={(e) => setEquipmentName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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

              <div className="flex flex-col mt-4">
                <label htmlFor="brandName" className="text-gray-700 text-sm font-medium mb-1">Brand Name *</label>
                <input
                  type="text"
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

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

              <div className="flex flex-col">
                <label htmlFor="acceptOffers" className="text-gray-700 text-sm font-medium mb-1">Accept Offers *</label>
                <select
                  id="acceptOffers"
                  value={acceptOffers}
                  onChange={(e) => setAcceptOffers(e.target.value === 'true')}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="true">Yes</option>
                  <option value="false">no</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="equipmentType" className="text-gray-700 text-sm font-medium mb-1">Equipment Type *</label>
                <select
                  id="equipmentType"
                  value={equipmentType}
                  onChange={(e) => setEquipmentType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select a type</option>
                  <option value="Skin care">Skin Care</option>
                  <option value="Body shaping">Body Shaping</option>
                  <option value="Laser Hair removal">Laser Hair Removal</option>
                  <option value="Laser skin care">Laser Skin Care</option>
                  <option value="Laser tattoo removal">Laser Tattoo Removal</option>
                  <option value="Lab equipment">Lab Equipment</option>
                  <option value="Other aesthetic device">Other Aesthetic Device</option>
                  <option value="Other Medical device">Other Medical Device</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Small tools">Small Tools</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="certification" className="text-gray-700 text-sm font-medium mb-1">Certification *</label>
                <select
                  id="certification"
                  value={certification}
                  onChange={(e) => setCertification(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select certification</option>
                  <option value="FDA approved">FDA approved</option>
                  <option value="FDA Registerd">FDA Registerd</option>
                  <option value="CE certified">CE certified</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="yearPurchased" className="text-gray-700 text-sm font-medium mb-1">Year Purchased *</label>
                <input
                  type="date"
                  id="yearPurchased"
                  value={yearPurchased}
                  onChange={(e) => setYearPurchased(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="warranty" className="text-gray-700 text-sm font-medium mb-1">Warranty *</label>
                <select
                  id="warranty"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select a warranty</option>
                  <option value="No warranty, as it is">No warranty, as it is</option>
                  <option value="Still under manufacturer warranty">Still under manufacturer warranty</option>
                  <option value="6 month warranty">6 month warranty</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="reasonForSelling" className="text-gray-700 text-sm font-medium mb-1">Reason for Selling *</label>
                <select
                  id="reasonForSelling"
                  value={reasonForSelling}
                  onChange={(e) => setReasonForSelling(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select reason</option>
                  <option value="Upgrading">Upgrading</option>
                  <option value="No longer needed">No longer needed</option>
                  <option value="Business closure">Business closure</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="shipping" className="text-gray-700 text-sm font-medium mb-1">Shipping *</label>
                <select
                  id="shipping"
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select shipping option</option>
                  <option value="free shipping">Free shipping</option>
                  <option value="pick up only">Pick up only</option>
                  <option value="Available at cost">Available at cost</option>
                </select>
              </div>

            </div>
          </form>
        </div>

        <div className="lg:w-1/3 lg:pl-8 flex-1">
         
        <div className="bg-gray-50 p-4 border border-gray-300 mb-4">
          <h2 className="text-2xl font-semibold mb-4">Equipment Image</h2>
          <p className="text-gray-600 mb-4">
            Upload an image of the equipment. Recommended size: 1024x1024 and less than 15MB.
          </p>

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
                id="images"
                type="file"
                accept="image/*"
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

export default PostEquipmentForm;

