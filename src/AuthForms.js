import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./Hooks/useAuthContext";
import MainDashboard from "./pages/MainDashboard";

const Auth = () => {
  const navigate = useNavigate();
  const { dispatch, user } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false); 
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
        if (json.token && json.user._id && json.user.email) {
          localStorage.setItem("usertoken", json.token);
          localStorage.setItem("userid", json.user._id);
          localStorage.setItem("email", json.user.email);
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
      setLoading(false); 
    }
  };

  if (user) {
    return <MainDashboard />; 
  }

  return (
    <section className="h-[82vh] flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-500">
      <div className="flex w-full  max-w-4xl bg-white rounded-lg shadow-lg mx-auto">
        <div className=" md:flex  flex-col w-1/2 bg-gradient-to-br from-purple-600 to-indigo-500 p-8 justify-center items-center text-white">
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

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Login to your account
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

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