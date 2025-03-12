// src/pages/Auth.js
import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuthContext } from "./Hooks/useAuthContext";
import Dashboard from "./pages/Dashboard";

const AuthSignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch, user } = useAuthContext();

  const [activeTab, setActiveTab] = useState("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phoneNumber, setNumber] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const [success, setSuccess] = useState("");
  const [agreedToPolicies, setAgreedToPolicies] = useState(false); // New state for policy agreement
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous messages
    setSuccess("");
    setLoading(true); // Set loading state to true

    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required.");
      setLoading(false); // Reset loading state
      return;
    }

    if (!agreedToPolicies) {
      setError("You must agree to the policies and terms to sign up.");
      setLoading(false); // Reset loading state
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false); // Reset loading state
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false); // Reset loading state
      return;
    }

    try {
      const response = await fetch(
        "https://multi-vendor-marketplace.vercel.app/auth/signUp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            zip,
            country,
            state,
            phoneNumber,
            city,
          }),
        }
      );

      const json = await response.json();

      if (response.ok) {
        setSuccess("Registration successful! Please log in.");
        // setActiveTab("login");
        navigate("/Login")

      } else {
        setError(json.error || "An error occurred during registration.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after request
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous messages
    setSuccess("");
    setLoading(true); // Set loading state to true

    if (!email || !password) {
      setError("All fields are required.");
      setLoading(false); // Reset loading state
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false); // Reset loading state
      return;
    }

    try {
      const response = await fetch(
        "https://multi-vendor-marketplace.vercel.app/auth/signIn",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const json = await response.json();
      const path = localStorage.getItem("path") || "/";

      if (response.ok) {
        console.log(json);
        if (json.token && json.user._id && json.user.email) {
          localStorage.setItem("usertoken", json.token);
          localStorage.setItem("userid", json.user._id);
          localStorage.setItem("email", json.user.email);
          console.log(json);
          dispatch({ type: "LOGIN", payload: json });
          setSuccess("Login successful!");
          navigate(path);
          localStorage.removeItem("path");
        }
       
      } else {
        setError(json.error || "An error occurred during login.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after request
    }
  };

  if (user) {
    return <Dashboard />; // Redirect to dashboard if the user is already logged in
  }
  return (
    <section className="flex h-screen bg-gradient-to-r from-purple-600 to-indigo-500 items-center justify-center px-6">
    <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
      
      {/* Left Side - Image & Text */}
      <div className="hidden md:flex flex-col w-1/2 bg-gradient-to-br from-purple-600 to-indigo-500 p-8 justify-center items-center text-white">
        <img
          src="/png-logo.png" // Replace with your actual image URL
          alt="SignUp"
          className="w-64 h-64 object-cover"
        />
        <p className="mt-4 text-center text-sm opacity-90">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at
          velit maximus, molestie est a, tempor magna.
        </p>
      </div>
  
      {/* Right Side - Scrollable Signup Form */}
      <div className="w-full md:w-1/2 p-8 h-[330px] max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Welcome
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Sign Up to your account
        </p>
  
        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* First Name */}
          <div>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-400"
              placeholder="First Name*"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
  
          {/* Last Name */}
          <div>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-400"
              placeholder="Last Name*"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
  
          {/* Email */}
          <div>
            <input
              type="email"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-400"
              placeholder="Email Address*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
  
          {/* Password */}
          <div>
            <input
              type="password"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-400"
              placeholder="Password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
  
          {/* Zip */}
          <div>
            <input
              type="number"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-400"
              placeholder="Zip*"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              required
            />
          </div>
  
          {/* Country */}
          <div>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-400"
              placeholder="Country*"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
  
          {/* State */}
          <div>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-400"
              placeholder="State*"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>
  
          {/* City */}
          <div>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-400"
              placeholder="City*"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
  
          {/* Phone Number */}
          <div>
            <input
              type="number"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-400"
              placeholder="Phone Number*"
              value={phoneNumber}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </div>
  
          {/* Policy Agreement */}
          <div className="flex items-center space-x-2 my-3">
            <input
              type="checkbox"
              id="policyAgreement"
              checked={agreedToPolicies}
              onChange={(e) => setAgreedToPolicies(e.target.checked)}
              className="h-5 w-5 text-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="policyAgreement" className="text-sm font-medium text-gray-700">
              I agree with the{" "}
              <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => window.open("/policy", "_blank")}>
                policies and terms
              </span>
            </label>
          </div>
  
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
  
          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600 transition"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  </section>
  
  );
};

export default AuthSignUp;
