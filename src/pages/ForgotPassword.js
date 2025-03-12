import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is required.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(
        "https://multi-vendor-marketplace.vercel.app/auth/forgot",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const json = await response.json();

      if (response.ok) {
        setSuccess("Password reset link sent successfully!");
      } else {
        setError(json.error || "An error occurred.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

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
        
        <div className="mt-8">
            <div className=" p-6  ">
              <form onSubmit={handleForgotPassword}>
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
                  Send Reset Password
                </button>
              </form>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
