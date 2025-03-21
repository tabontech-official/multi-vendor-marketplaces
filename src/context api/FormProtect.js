import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from '../Hooks/useAuthContext';
import { FiLoader } from 'react-icons/fi'; // Import loader icon
import { height } from "@fortawesome/free-solid-svg-icons/fa0";
const ProtectedForms = ({ element, ...rest }) => {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [requiredCredits, setRequiredCredits] = useState([]);
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const productTypeMap = {
    '/Used_Equipment_Listing': 'Used Equipments',
    '/New_Equipment_listing': 'New Equipments',
    '/Job_Search_listing': 'Providers Available',
    '/Job_Provider_listing': 'Provider Needed',
    '/Rent_Room_listing': 'Spa Room For Rent',
    '/Business_Equipment_listing': 'Businesses To Purchase',
    '/I_AM_LOOKING_FOR': 'Looking For',
  };

  useEffect(() => {
    const id = localStorage.getItem('userid');
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCreditsAndProducts = async () => {
      try {
        const creditResponse = await fetch(`http://localhost:5000/auth/quantity/${id}`, { method: 'GET' });
        if (creditResponse.ok) {
          const creditData = await creditResponse.json();
          setCredits(creditData.quantity || 0);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } 

    try {
      const productResponse = await fetch("http://localhost:5000/product/fetchRequireCredits", { method: 'GET' });
      if (productResponse.ok) {
        const productData = await productResponse.json();
        setRequiredCredits(productData.data);
        console.log("Fetched required credits: ", productData.data); // Debugging log
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }finally{
      setLoading(false)
    }

    };

    fetchCreditsAndProducts();
  }, []);

  if (loading) {
    return  <div className="m-auto flex justify-center items-center " style={{height:"70vh"}} > <FiLoader className="animate-spin text-2xl"/> </div>;
    
  }

  // Match pathname with product_type
  const matchedProductType = productTypeMap[pathname];
  console.log("Matched product type:", matchedProductType); // Debugging log
  
  if (matchedProductType) {
    if (requiredCredits !== 0  && requiredCredits.length > 0) {
    const product = requiredCredits.find((item) => item.product_type === matchedProductType);
    console.log("Found product:", product); // Debugging log
    if (product && user) {
      if (product.credit_required > 0 && credits === 0  ) {
        // Redirect if product requires credits but user has none
        setTimeout(()=>{
         navigate('/')
        },2000)
        return(
          <>
          <h1 className="text-xl">
          This is Paid Listing . First Buy Credits from dash board.
          </h1>
          </>
        )
      }
    } else {
      console.log("No matching product found for:", matchedProductType); // Handle no match case
    } 
  
  }else{
    navigate('/')
  }

  }

  if (user) {
    return element;
  }

  return(
    <>
    This is Paid Listing . First Buy Credits.
    </>
  )
};

export default ProtectedForms;
