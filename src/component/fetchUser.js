import { useState, useEffect } from 'react';
import axios from "axios";  // assuming you're using axios for API requests

const UseFetchUserData = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [variantId, setVariantId] = useState(null);

  const fetchUserData = async () => {
    const id = localStorage.getItem('userid');

    if (!id) {
      setError('User ID not found.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/auth/user/${id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data.');
      }

      const data = await response.json();

      setUserData(data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching user data.');
      setLoading(false);
    }

    const fetchVariantId = async () => {
      try {
        const response = await axios.get("http://localhost:5000/product/getPrice");
        setVariantId(response.data[0].variantId); // assuming response structure
      } catch (error) {
        console.error("Error fetching variant ID", error);
      }
    };
    fetchVariantId();
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return { userData, error, loading , variantId};
};

export default UseFetchUserData;
