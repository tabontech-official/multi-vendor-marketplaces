// src/pages/Auth.js
import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuthContext } from "./Hooks/useAuthContext";
import Dashboard from "./pages/Dashboard";

const AuthSignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch, user } = useAuthContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phoneNumber, setNumber] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (!agreedToPolicies) {
      setError("You must agree to the policies and terms to sign up.");
      setLoading(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        " https://multi-vendor-marketplace.vercel.app/auth/signUp",
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
        navigate("/Login");
      } else {
        setError(json.error || "An error occurred during registration.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Dashboard />;
  }
  return (
    <section className="h-[82vh] flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-500">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg">
        <div className=" md:flex  flex-col w-1/2 bg-gradient-to-br from-purple-600 to-indigo-500 p-8 justify-center items-center text-white ">
          <img
            src="/png-logo.png"
            alt="Login"
            className="w-64 h-64 object-cover"
          />
          <p className="mt-4 text-center text-sm opacity-90">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at
            velit maximus, molestie est a, tempor magna.
          </p>
        </div>

        <div className="w-full md:w-1/2 p-8  h-[65vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Login to your account
          </p>

          <form onSubmit={handleSignup} className="space-y-4 ">
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
              <label
                htmlFor="policyAgreement"
                className="text-sm font-medium text-gray-700"
              >
                I agree with the{" "}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => window.open("/policy", "_blank")}
                >
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

          {/* <div className="mt-4 text-center text-sm">
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
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default AuthSignUp;
