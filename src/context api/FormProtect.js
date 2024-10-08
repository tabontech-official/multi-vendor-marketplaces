import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from '../Hooks/useAuthContext';

const ProtectedForms = ({ element, ...rest }) => {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true); // New loading state
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    const id = localStorage.getItem('userid');
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCredits = async () => {
      try {
        const response = await fetch(`https://medspaa.vercel.app/auth/quantity/${id}`, { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          const fetchedCredits = data.quantity || 0; 
          setCredits(fetchedCredits);

          // Redirect if credits are 0
          if (fetchedCredits === 0) {
            navigate("/categories");
          }
        }
      } catch (error) {
        console.error('Error fetching quantity:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchCredits();
  }, []);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>; // or any loading indicator you prefer
  }

  // Check credits and user
  if (credits > 0 && user) {
    return element;
  }

  // Redirect if not authorized
  return <Navigate to="/Categories" replace />;
};

export default ProtectedForms;
