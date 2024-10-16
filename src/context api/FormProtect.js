import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from '../Hooks/useAuthContext';

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
  };

  useEffect(() => {
    const id = localStorage.getItem('userid');
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCreditsAndProducts = async () => {
      try {
        const creditResponse = await fetch(`https://medspaa.vercel.app/auth/quantity/${id}`, { method: 'GET' });
        if (creditResponse.ok) {
          const creditData = await creditResponse.json();
          setCredits(creditData.quantity || 0);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } 

    try {
      const productResponse = await fetch("https://medspaa.vercel.app/product/fetchRequireCredits", { method: 'GET' });
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
    return <div>Loading...</div>;
  }

  // Match pathname with product_type
  const matchedProductType = productTypeMap[pathname];
  console.log("Matched product type:", matchedProductType); // Debugging log
  
  if (matchedProductType) {
    if (requiredCredits.length > 0) {
    const product = requiredCredits.find((item) => item.product_type === matchedProductType);
    console.log("Found product:", product); // Debugging log
    if (product) {
      if (product.credit_required > 0 && credits === 0) {
        // Redirect if product requires credits but user has none
        setTimeout(()=>{
         navigate('/')
        },2000)
        return(
          <>
          This is Paid Listing . First Buy Credits from dash board.
          </>
        )
      }
    } else {
      console.log("No matching product found for:", matchedProductType); // Handle no match case
    } 
  
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
