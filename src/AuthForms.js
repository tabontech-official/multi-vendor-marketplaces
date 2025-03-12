// src/pages/Auth.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./Hooks/useAuthContext";
import Dashboard from "./pages/Dashboard";

const Auth = () => {
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
        setActiveTab("login");
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
            src="/png-logo.png" // Correct way to access public assets in React
            alt="Login"
            className="w-64 h-64 object-cover"
          />

          <p className="mt-4 text-center text-sm opacity-90">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at
            velit maximus, molestie est a, tempor magna.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Login to your account
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="mt-1 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="mt-1 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-4 text-center text-sm">
            <a
              href="/ForgotPassword"
              className="text-indigo-500 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <div className="mt-2 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <a href="/signup" className="text-indigo-500 hover:underline">
              Create Account
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;
