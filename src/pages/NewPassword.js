import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const NewPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [tokenValid, setTokenValid] = useState(true);

  const navigate = useNavigate();

  function isTokenExpired(token) {
    if (!token) return true;
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  }

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      setTokenValid(false);
      setTimeout(() => {
        navigate("/Login");
      }, 1000);
    }
  }, [token, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch(
        " http://localhost:5000/auth/createpassword",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword, token }),
        }
      );

      const json = await response.json();

      if (response.ok) {
        localStorage.removeItem("reset");
        setSuccess("Password reset successful! You can now log in.");
        navigate("/Login");
      } else {
        setError(json.error || "An error occurred.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  if (!tokenValid) {
    return <div>Invalid or missing token. Redirecting to login...</div>;
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
            Create your password
          </p>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="password"
                className="mt-1 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="mb-4 text-red-500 dark:text-red-400">{error}</div>
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
              Create Password
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewPassword;
