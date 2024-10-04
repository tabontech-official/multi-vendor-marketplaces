import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const ResetPassword = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token')

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [tokenValid, setTokenValid] = useState(true); // State to track if token exists

  const navigate = useNavigate();



  useEffect(() => {
    // If no token is found, mark it as invalid and redirect or show an error
    if (!token) {
      setTokenValid(false);
      setTimeout(() => {
        navigate('/Login'); // Redirect to login or forgot password page after 2 seconds
      }, 1000);
    }
  }, [token, navigate]);


  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');



    if (!newPassword || !confirmPassword) {
      setError('Both password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await fetch('https://medspaa.vercel.app/auth/resetpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword , token }),
      });

      const json = await response.json();

      if (response.ok) {
        localStorage.removeItem('reset')
        setSuccess('Password reset successful! You can now log in.');
        navigate('/Login');
      } else {
        setError(json.error || 'An error occurred.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  if (!tokenValid) {
    return <div>Invalid or missing token. Redirecting to login...</div>;
  }

  return (
    <section className="bg-white dark:bg-gray-900 border-blue-500 mt-20">
      <div className="container flex items-center justify-center px-6 mx-auto">
        <div className="w-full max-w-md">
          <div className="flex justify-center mx-auto">
            <img
              className="w-auto h-7 sm:h-8"
              src="https://shopify-digital-delivery.s3.amazonaws.com/shop_logo/59235/vRlqYxKteX848.png"
              alt="Logo"
            />
          </div>
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-900 p-6 shadow-lg border border-blue-500 dark:border-gray-600">
              <form onSubmit={handleResetPassword}>
                <div className="mb-4">
                  <input
                    type="password"
                    className="block w-full px-3 py-3 text-gray-700 bg-white border border-blue-500 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    className="block w-full px-3 py-3 text-gray-700 bg-white border border-blue-500 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <div className="mb-4 text-red-500 dark:text-red-400">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 text-green-500 dark:text-green-400">
                    {success}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  Reset Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
