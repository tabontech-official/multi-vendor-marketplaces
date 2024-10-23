// src/pages/Auth.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './Hooks/useAuthContext';
import Dashboard from './pages/Dashboard';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch, user } = useAuthContext();

  const [activeTab, setActiveTab] = useState('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [city, setCity] = useState('');
const [state, setState] = useState('');
const [zip, setZip] = useState('');
const [phoneNumber , setNumber ] = useState('')
const [country, setCountry] = useState('');
const [loading, setLoading] = useState(false); // Loading state
 
const [success, setSuccess] = useState('');
const [agreedToPolicies, setAgreedToPolicies] = useState(false); // New state for policy agreement
const handleSignup = async (e) => {  
  e.preventDefault();
  setError(''); // Clear previous messages
  setSuccess('');
  setLoading(true); // Set loading state to true

  if (!firstName || !lastName  || !email || !password) {
    setError('All fields are required.');
    setLoading(false); // Reset loading state
    return;
  }

  if (!agreedToPolicies) {
    setError('You must agree to the policies and terms to sign up.');
    setLoading(false); // Reset loading state
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    setError('Please enter a valid email address.');
    setLoading(false); // Reset loading state
    return;
  }

  if (password.length < 6) {
    setError('Password must be at least 6 characters long.');
    setLoading(false); // Reset loading state
    return;
  }

  try {
    const response = await fetch('https://medspaa.vercel.app/auth/signUp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName,  email, password, zip, country, state, phoneNumber, city }),
    });

    const json = await response.json();

    if (response.ok) {
      setSuccess('Registration successful! Please log in.');
      setActiveTab('login');
    } else {
      setError(json.error || 'An error occurred during registration.');
    }
  } catch (error) {
    setError('An error occurred. Please try again.');
  } finally {
    setLoading(false); // Reset loading state after request
  }
};


const handleLogin = async (e) => {
  e.preventDefault();
  setError(''); // Clear previous messages
  setSuccess('');
  setLoading(true); // Set loading state to true

  if (!email || !password) {
    setError('All fields are required.');
    setLoading(false); // Reset loading state
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    setError('Please enter a valid email address.');
    setLoading(false); // Reset loading state
    return;
  }

  try {
    const response = await fetch('https://medspaa.vercel.app/auth/signIn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();
    const path = localStorage.getItem('path') || '/';

    if (response.ok) {
      console.log(json)
      if(json.token && json.user._id && json.user.email ){
        localStorage.setItem('usertoken', json.token);
      localStorage.setItem('userid', json.user._id);
      localStorage.setItem('email', json.user.email);
      console.log(json)
        dispatch({ type: 'LOGIN', payload: json });
        setSuccess('Login successful!');
        navigate(path);
        localStorage.removeItem('path');
      }

    } else {
      setError(json.error || 'An error occurred during login.');
    }
  } catch (error) {
    setError('An error occurred. Please try again.');
  } finally {
    setLoading(false); // Reset loading state after request
  }
};

if (user) {
  return <Dashboard />; // Redirect to dashboard if the user is already logged in
}
  return (
    <section className="bg-white dark:bg-gray-900 border-blue-500 mt-5 mb-10">
      <div className="container flex items-center justify-center px-6 mx-auto">
        <div className="w-full max-w-md">
          <div className="flex justify-center mx-auto">
            <img
              className="w-auto h-7 sm:h-8"
              src="https://shopify-digital-delivery.s3.amazonaws.com/shop_logo/59235/vRlqYxKteX848.png"
              alt="Logo"
            />
          </div>
          <div className="flex items-center justify-center mt-2">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`w-1/2 pb-4 font-medium text-center capitalize border-b ${
                activeTab === 'login'
                  ? 'text-gray-800 border-blue-500 dark:border-blue-400 dark:text-white'
                  : 'text-gray-500 border-b dark:border-gray-400 dark:text-gray-300'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`w-1/2 pb-4 font-medium text-center capitalize border-b ${
                activeTab === 'signup'
                  ? 'text-gray-800 border-blue-500 dark:border-blue-400 dark:text-white'
                  : 'text-gray-500 border-b dark:border-gray-400 dark:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>
          <div className="mt-8">
            {activeTab === 'login' ? (
              <div className="bg-white dark:bg-gray-900 p-6 shadow-lg border border-blue-500 dark:border-gray-600">
                <form onSubmit={handleLogin}>
                  <div className="relative flex items-center mb-4">
                    <span className="absolute">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      className="block w-full py-3 text-gray-700 bg-white border border-blue-500 px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-required="true"
                    />
                  </div>
                  <div className="relative flex items-center mb-4">
                    <span className="absolute">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      type="password"
                      className="block w-full px-10 py-3 text-gray-700 bg-white border border-blue-500 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-required="true"
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
                  <div className="mt-2  mb-2 -mt-4">
                    <a href="/ForgotPassword" className="text-blue-500 hover:underline ">
                      Forgot Password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-3 text-white bg-blue-500 rounded focus:outline-none hover:bg-blue-600 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? (
                      <span className="flex justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24" />
                        Loading...
                      </span>
                    ) : (
                      'Login'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 p-6 shadow-lg border border-blue-500 dark:border-gray-600">
              <form onSubmit={handleSignup}>
           
                <div className="relative flex items-center mb-2">
                  <input
                    type="text"
                    className="block w-full pl-3 py-3 text-gray-700 bg-white border border-blue-500 px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="First Name*"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    aria-required="true"
                  />
                </div>
                <div className="relative flex items-center  mb-2">
                  <input
                    type="text"
                    className="block w-full  pl-3 py-3 text-gray-700 bg-white border border-blue-500 px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Last Name*"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    aria-required="true"
                  />
                </div>
                <div className="relative flex items-center  mb-2">
                  <input
                    type="email"
                    className="block w-full pl-3 py-3 text-gray-700 bg-white border border-blue-500 px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-required="true"
                  />
                </div>
                <div className="relative flex items-center  mb-2">
                  <input
                    type="password"
                    className="block w-full pl-3 py-3 text-gray-700 bg-white border border-blue-500 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Password*"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-required="true"
                  />
                </div>

                <div className="relative flex items-center  mb-2">
                  
                  <input
                    type="number"
                    className="block w-full pl-3 py-3 text-gray-700 bg-white border border-blue-500 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Zip*"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    aria-required="true"
                  />
                </div>

                <div className="relative flex items-center  mb-2">
                  <input
                    type="text"
                    className="block w-full pl-3 py-3 text-gray-700 bg-white border border-blue-500 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Country*"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    aria-required="true"
                  />
                </div>

                <div className="relative flex items-center  mb-2">
                  <input
                    type="text"
                    className="block w-full pl-3 py-3 text-gray-700 bg-white border border-blue-500 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="State*"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    aria-required="true"
                  />
                </div>

                
                <div className="relative flex items-center  mb-2">
                  <input
                    type="text"
                    className="block w-full pl-3 py-3 text-gray-700 bg-white border border-blue-500 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="City*"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    aria-required="true"
                  />
                </div>

                <div className="relative flex items-center  mb-2">
                  <input
                    type="number"
                    className="block w-full pl-3 py-3 text-gray-700 bg-white border border-blue-500 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Phone Number*"
                    value={phoneNumber}
                    onChange={(e) => setNumber(e.target.value)}
                    aria-required="true"
                  />
                </div>
                <div className="flex items-center space-x-2 my-3">
            <input
              type="checkbox"
              id="policyAgreement"
              name="policyAgreement"
              checked={agreedToPolicies}
              onChange={(e) => setAgreedToPolicies(e.target.checked)}
              className="h-5 w-5 text-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="policyAgreement" className="text-sm font-medium text-gray-700">
              I agree with the{' '}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate('/policy')}
              >
                policies and terms
              </span>
            </label>
          </div>

      
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-3 py-3 font-semibold text-center text-white transition-colors duration-200 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-600 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {success && <p className="text-green-500 mt-2">{success}</p>}
              </form>
            </div>
          )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;



