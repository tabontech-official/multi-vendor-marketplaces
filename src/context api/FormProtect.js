import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from '../Hooks/useAuthContext';

const ProtectedForms = ({ element, ...rest }) => {
  const [credits, setCredits] = useState(0);
  const navigate = useNavigate(); // Use navigate for redirection
  const { user } = useAuthContext(); // Access user context

  useEffect(() => {
    const id = localStorage.getItem('userid');
    if (!id) return;

    const fetchCredits = async () => {
      try {
        const response = await fetch(`https://medspaa.vercel.app/auth/quantity/${id}`, { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          const fetchedCredits = data.quantity || 0; // Get available credits
          setCredits(fetchedCredits);

          // If credits are 0, redirect to the categories page
          if (fetchedCredits === 0) {
            navigate("/categories"); // Replace with the desired route when credits are 0
          }
        }
      } catch (error) {
        console.error('Error fetching quantity:', error);
      }
    };

    fetchCredits();
  }, [navigate]);

  // If user is authenticated and has credits, render the element
  if (credits > 0 && user) {
    return element;
  }

  // If not, redirect to the login page
  return <Navigate to="/Categories" replace />;
};

export default ProtectedForms;
