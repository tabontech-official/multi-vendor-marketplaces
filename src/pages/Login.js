import React, { useState } from 'react';
import { useAuthContext } from '../Hooks/useAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa'; // Import a spinner icon

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // New state for loading
  const { dispatch } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await fetch('https://medspaa.vercel.app/auth/signIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'LOGIN', payload: json });
        localStorage.setItem('user', JSON.stringify(json.token));
        navigate('/dashboard');
      } else {
        setError(json.message || 'Login failed');
      }
    } catch (error) {
      console.log(error);
      setError('An error occurred');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-300 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="mt-4 text-right">
              <p className="text-gray-600">
                <Link to="/Signup" className="text-[#f73a3a] hover:underline">
                  Forget Password
                </Link>
              </p>
            </div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#52c058] text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 relative"
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <FaSpinner className="animate-spin absolute inset-0 m-auto left-0 right-0 top-0 bottom-0" size={20} />
            ) : (
              'Login'
            )}
          </button>
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/Signup" className="text-[#52c058] hover:underline">
                Go to SignUp
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
