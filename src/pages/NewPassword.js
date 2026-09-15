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
        "https://multi-vendor-marketplace.vercel.app/auth/createpassword",
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
  <section className="h-[88vh] flex items-center justify-center bg-black p-4 font-sans">
    <div className="flex w-full max-w-5xl bg-[#121212] rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] mx-auto overflow-hidden min-h-[500px] border border-white/5">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col w-7/12 bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-black p-12 justify-between items-center text-white relative">
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="absolute w-72 h-72 bg-white/5 rounded-full blur-[100px]"></div>

          <img
            src="/png-logo.png"
            alt="Marketplace"
            className="w-64 h-64 object-contain z-10 brightness-110"
          />
        </div>

        <p className="text-center text-xs tracking-widest uppercase opacity-40 max-w-sm leading-relaxed z-10">
          Aydi Active Marketplace • Secure Password Setup
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-5/12 p-8 md:p-12 flex flex-col relative bg-[#181818]">

        <div className="absolute top-8 left-0">
          <div className="bg-white text-black px-10 py-3 rounded-r-full shadow-lg shadow-white/10">
            <span className="text-lg font-bold tracking-tight">
              Create Password
            </span>
          </div>
        </div>

        <div className="mt-28 flex flex-col flex-grow">

          {error && (
            <p className="text-red-400 mb-3 text-xs bg-red-400/10 p-3 rounded border border-red-400/20">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-400 mb-3 text-xs bg-green-400/10 p-3 rounded border border-green-400/20">
              {success}
            </p>
          )}

          <h2 className="text-2xl font-light text-white mb-12">
            Set your new password
          </h2>

          <form onSubmit={handleResetPassword} className="space-y-12">

            <div className="relative border-b border-white/20 focus-within:border-white transition-all duration-300">
              <label className="block text-[13px] font-medium text-slate-300 mb-1">
                New Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                className="w-full py-2 bg-transparent focus:outline-none text-white placeholder:text-gray-600"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="relative border-b border-white/20 focus-within:border-white transition-all duration-300">
              <label className="block text-[13px] font-medium text-slate-300 mb-1">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                className="w-full py-2 bg-transparent focus:outline-none text-white placeholder:text-gray-600"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-center ">
              <button
                type="submit"
                className="w-52 bg-white text-black py-3 rounded-full hover:bg-slate-200 transition-all shadow-xl shadow-white/5 font-bold text-sm active:scale-95"
              >
                Create Password
              </button>
            </div>

          </form>
{/* 
          <div className="mt-auto flex justify-center">
            <a
              href="/Login"
              className="text-gray-400 hover:text-white text-xs font-semibold tracking-wide transition-colors"
            >
              BACK TO LOGIN
            </a>
          </div> */}

        </div>
      </div>
    </div>
  </section>
);
};

export default NewPassword;
