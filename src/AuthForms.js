// src/pages/Auth.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './Hooks/useAuthContext';
import Dashboard from './pages/Dashboard';

// const Auth = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { dispatch, user } = useAuthContext(); // Ensure this is getting user and dispatch correctly

//   const [activeTab, setActiveTab] = useState('login');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [name , setName ] = useState('')
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!firstName || !lastName || !email || !password || !confirmPassword) {
//       setError('All fields are required.');
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError('Passwords do not match.');
//       return;
//     }

//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailPattern.test(email)) {
//       setError('Please enter a valid email address.');
//       return;
//     }

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long.');
//       return;
//     }

//     try {
//       const response = await fetch('https://medspaa.vercel.app/auth/signUp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ firstName, lastName, userName : name ,email, password}),
//       });

//       const json = await response.json();

//       if (response.ok) {
//         setSuccess('Registration successful! Please log in.');
//         const redirectTo = new URLSearchParams(location.search).get('redirect') || '/dashboard';
//         setActiveTab('login');
//       } else {
//         setError(json.error || 'An error occurred during registration.');
//       }
//     } catch (error) {
//       setError('An error occurred. Please try again.');
//     }
//   };

  
// const handleLogin = async (e) => {
//   e.preventDefault();
//   setError('');
//   setSuccess('');

//   if (!email || !password) {
//     setError('All fields are required.');
//     return;
//   }

//   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailPattern.test(email)) {
//     setError('Please enter a valid email address.');
//     return;
//   }

//   try {
//     const response = await fetch('https://medspaa.vercel.app/auth/signIn', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });

//     const json = await response.json();
//     const path = localStorage.getItem('path') || '/'; // Default to '/' if path is not found

//     if (response.ok) {


//       localStorage.setItem('usertoken', json.token);
//       localStorage.setItem('userid', json.data.user._id);
//       localStorage.setItem('email', json.data.user.email);
    
//    dispatch({ type: 'LOGIN', payload: json });
//       setSuccess('Login successful!');
//       navigate(path);
//       localStorage.removeItem('path');
//     } else {
//       setError(json.error || 'An error occurred during login.');
//     }
//   } catch (error) {
//     setError('An error occurred. Please try again.');
//   }
// };

//   if (user) {
//     return <Dashboard />; // Redirect to dashboard if the user is already logged in
//   }

//   return (
//     <section className="bg-white dark:bg-gray-900 border-blue-500 mt-10">
//       <div className="container flex items-center justify-center px-6 mx-auto">
//         <div className="w-full max-w-md">
//           <div className="flex justify-center mx-auto">
//             <img
//               className="w-auto h-7 sm:h-8"
//               src="https://shopify-digital-delivery.s3.amazonaws.com/shop_logo/59235/vRlqYxKteX848.png"
//               alt="Logo"
//             />
//           </div>
//           <div className="flex items-center justify-center mt-6">
//             <button
//               type="button"
//               onClick={() => setActiveTab('login')}
//               className={`w-1/2 pb-4 font-medium text-center capitalize border-b ${
//                 activeTab === 'login'
//                   ? 'text-gray-800 border-blue-500 dark:border-blue-400 dark:text-white'
//                   : 'text-gray-500 border-b dark:border-gray-400 dark:text-gray-300'
//               }`}
//             >
//               Login
//             </button>
//             <button
//               type="button"
//               onClick={() => setActiveTab('signup')}
//               className={`w-1/2 pb-4 font-medium text-center capitalize border-b ${
//                 activeTab === 'signup'
//                   ? 'text-gray-800 border-blue-500 dark:border-blue-400 dark:text-white'
//                   : 'text-gray-500 border-b dark:border-gray-400 dark:text-gray-300'
//               }`}
//             >
//               Sign Up
//             </button>
//           </div>
//           <div className="mt-8">
//             {activeTab === 'login' ? (
//               <div className="bg-white dark:bg-gray-900 p-6  shadow-lg border border-blue-500 dark:border-gray-600">
//                 <form onSubmit={handleLogin}>
//                   <div className="relative flex items-center mb-4">
//                     <span className="absolute">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                       </svg>
//                     </span>
//                     <input
//                       type="email"
//                       className="block w-full py-3 text-gray-700 bg-white border border-blue-500  px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
//                       placeholder="Email address"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       aria-required="true"
//                     />
//                   </div>
//                   <div className="relative flex items-center mb-4">
//                     <span className="absolute">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                       </svg>
//                     </span>
//                     <input
//                       type="password"
//                       className="block w-full px-10 py-3 text-gray-700 bg-white border border-blue-500  dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
//                       placeholder="Password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       aria-required="true"
//                     />
//                   </div>
//                   {error && (
//                     <div className="mb-4 text-red-500 dark:text-red-400">
//                       {error}
//                     </div>
//                   )}
//                   {success && (
//                     <div className="mb-4 text-green-500 dark:text-green-400">
//                       {success}
//                     </div>
//                   )}
//                   <button
//                     type="submit"
//                     className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500  hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
//                   >
//                     Login
//                   </button>
//                 </form>
//               </div>
//             ) : (
//               <div className="bg-white dark:bg-gray-900 p-6  shadow-lg border border-blue-500 dark:border-gray-600">
//                 <form onSubmit={handleSignup}>
//                   <div className="relative flex items-center mb-4">
//                     <span className="absolute">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                       </svg>
//                     </span>
//                     <input
//                       type="text"
//                       className="block w-full px-10 py-3 text-gray-700 bg-white border border-blue-500  dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
//                       placeholder="First Name"
//                       value={firstName}
//                       onChange={(e) => setFirstName(e.target.value)}
//                       aria-required="true"
//                     />
//                   </div>
//                   <div className="relative flex items-center mb-4">
//                     <span className="absolute">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                       </svg>
//                     </span>
//                     <input
//                       type="text"
//                       className="block w-full px-10 py-3 text-gray-700 bg-white border border-blue-500  dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
//                       placeholder="Last Name"
//                       value={lastName}
//                       onChange={(e) => setLastName(e.target.value)}
//                       aria-required="true"
//                     />
//                   </div>
//                   <div className="relative flex items-center mb-4">
//                     <span className="absolute">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                       </svg>
//                     </span>
//                     <input
//                       type="text"
//                       className="block w-full px-10 py-3 text-gray-700 bg-white border border-blue-500  dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
//                       placeholder="Last Name"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       aria-required="true"
//                     />
//                   </div>
//                   <div className="relative flex items-center mb-4">
//                     <span className="absolute">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                       </svg>
//                     </span>
//                     <input
//                       type="email"
//                       className="block w-full px-10 py-3 text-gray-700 bg-white border border-blue-500  dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
//                       placeholder="Email address"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       aria-required="true"
//                     />
//                   </div>
//                   <div className="relative flex items-center mb-4">
//                     <span className="absolute">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                       </svg>
//                     </span>
//                     <input
//                       type="password"
//                       className="block w-full px-10 py-3 text-gray-700 bg-white border border-blue-500  dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
//                       placeholder="Password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       aria-required="true"
//                     />
//                   </div>
//                   <div className="relative flex items-center mb-6">
//                     <span className="absolute">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                       </svg>
//                     </span>
//                     <input
//                       type="password"
//                       className="block w-full px-10 py-3 text-gray-700 bg-white border border-blue-500  dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
//                       placeholder="Confirm Password"
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       aria-required="true"
//                     />
//                   </div>
//                   {error && (
//                     <div className="mb-4 text-red-500 dark:text-red-400">
//                       {error}
//                     </div>
//                   )}
//                   {success && (
//                     <div className="mb-4 text-green-500 dark:text-green-400">
//                       {success}
//                     </div>
//                   )}
//                   <button
//                     type="submit"
//                     className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500  hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
//                   >
//                     {activeTab === 'login' ? 'Login' : 'Sign Up'}
//                   </button>
//                 </form>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };


const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch, user } = useAuthContext();

  const [activeTab, setActiveTab] = useState('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState(''); // New state for username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!firstName || !lastName || !userName || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await fetch('https://medspaa.vercel.app/auth/signUp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, userName, email, password }),
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
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('All fields are required.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
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
        localStorage.setItem('usertoken', json.token);
        localStorage.setItem('userid', json.data.user._id);
        localStorage.setItem('email', json.data.user.email);

        dispatch({ type: 'LOGIN', payload: json });
        setSuccess('Login successful!');
        navigate(path);
        localStorage.removeItem('path');
      } else {
        setError(json.error || 'An error occurred during login.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  if (user) {
    return <Dashboard />; // Redirect to dashboard if the user is already logged in
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
          <div className="flex items-center justify-center mt-6">
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
                    <a href="https://www.medspatrader.com/account/login#recover" className="text-blue-500 hover:underline ">
                      Forgot Password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  >
                    Login
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 p-6 shadow-lg border border-blue-500 dark:border-gray-600">
                <form onSubmit={handleSignup}>
                  <div className="mb-4">
                    <input
                      type="text"
                      className="block w-full px-3 py-3 text-gray-700 bg-white border border-blue-500 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      className="block w-full px-3 py-3 text-gray-700 bg-white border border-blue-500 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      className="block w-full px-3 py-3 text-gray-700 bg-white border border-blue-500 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                      placeholder="Username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="email"
                      className="block w-full px-3 py-3 text-gray-700 bg-white border border-blue-500 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      className="block w-full px-3 py-3 text-gray-700 bg-white border border-blue-500 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      className="block w-full px-3 py-3 text-gray-700 bg-white border border-blue-500 dark:bg-gray-900 dark:text-gray-300 dark:border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                      placeholder="Confirm Password"
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
                    Sign Up
                  </button>
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



