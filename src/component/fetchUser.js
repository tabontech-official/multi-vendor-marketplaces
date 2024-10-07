import { useState, useEffect } from 'react';

const UseFetchUserData = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const id = localStorage.getItem('userid');

    if (!id) {
      setError('User ID not found.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://medspaa.vercel.app/auth/user/${id}`, {
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
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return { userData, error, loading };
};

export default UseFetchUserData;
