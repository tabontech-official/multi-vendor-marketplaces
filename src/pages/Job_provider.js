import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import RTC from '../component/editor'; // Assuming RTC is your custom rich text editor component
import { EditorState , ContentState , convertToRaw } from "draft-js";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CurrencyInput from 'react-currency-input-field';
import draftToHtml from 'draftjs-to-html';
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
    setLocation(product.providerListings[0].location.split("_")[0] || '');
    setCity(product.providerListings[0].location.split("_")[1] || '')
    setQualification(product.providerListings[0].qualificationRequested || '');
    setJobType(product.providerListings[0].jobType || '');
    setJobOfferType(product.providerListings[0].typeOfJobOffered || '');
    setOfferedSalary(product.providerListings[0].offeredYearlySalary || '');
    // const textDescrip = product.body_html.replace(/<br\s*\/?>|&nbsp;/gi, '');
    const textDescrip = product.body_html.replace(
      /<br\s*\/?>|&nbsp;/gi, // Remove unwanted tags
      ""
    );
    setPositionDescription(textDescrip );
   setZip(product.providerListings[0].zip)
  setLocation (product.providerListings[0].location)


    if (product.body_html) {
      const contentState = ContentState.createFromText(textDescrip);
      setEditorState(EditorState.createWithContent(contentState));
    } else {
      setEditorState(EditorState.createEmpty());
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
    const currentText = newEditorState
      .getCurrentContent()
      .getPlainText("\u0001"); // Get plain text from the editor, no HTML
      setPositionDescription(currentText);
  };
  
  // Handler for form submission
  const handleSubmit = async (e , status) => {

    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);

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

    // Get user ID from local storage
    const id = localStorage.getItem('userid');
    
    // Create a new FormData object
    const formData = new FormData();

    // Append the image file if it exists
   

    // Append other fields

    let fullLocation = city.concat("_", location)
  
      formData.append('location', fullLocation);
    formData.append('zip',Zip)
      formData.append('qualificationRequested', qualification);
      formData.append('name', qualification);
   formData.append('jobType', jobType);
    formData.append('typeOfJobOffered', jobOfferType);
    formData.append('offeredYearlySalary', offeredSalary); 
    if(isEditing){
      formData.append('body_html', modifiedContent);
      formData.append('offeredPositionDescription', modifiedContent);
    }else{
      formData.append('offeredPositionDescription', modifiedContent);
 
    }

    formData.append("userId", id);
    if(!isEditing){
      formData.append('status', status);
      }

    try {
        const response = await fetch(isEditing
          ? `https://medspaa.vercel.app/product/updateListing/${product.id}`
          : "https://medspaa.vercel.app/product/addProvider", {
          method: isEditing ? "PUT" : "POST",
          body: formData,
        });;

      const json = await response.json();

      if (response.ok) {
        if(status == "active"){
          setSuccess(json.message);
        }else{
          setSuccess("Your post drafted sucessfully")
        }
        navigate("/")
        setError('');
        // Clear form fields
        // setLocation('');
        // setQualification('');
        // setJobType('');
        // setJobOfferType('');
        // setOfferedSalary('');
        // setPositionDescription('');
        // setImages([]);
        // setImageName('');
        // setEditorState(EditorState.createEmpty());
      } else {
        setSuccess('');
        setError(json.error);
      }
    } catch (error) {
      setSuccess('');
      setError('An unexpected error occurred.');
      console.error(error);
    } finally {
      setLoading(false);
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
                  onChange={(e) => setCity(e.target.value)}
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
              <div className='mb-4'>
                <RTC 
                  name={"Position offered Description"}
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                />
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
