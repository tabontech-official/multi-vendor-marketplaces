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

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   if (!email || !password) {
  //     setError("All fields are required.");
  //     setLoading(false);
  //     return;
  //   }

  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailPattern.test(email)) {
  //     setError("Please enter a valid email address.");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       "http://localhost:5000/auth/signIn",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email, password }),
  //       },
  //     );

  //     const json = await response.json();
  //     const path = localStorage.getItem("path") || "/";

  //     if (response.ok && json.token && json.user) {
  //       localStorage.setItem("usertoken", json.token);
  //       localStorage.setItem("userid", json.user._id);
  //       localStorage.setItem("email", json.user.email);
  //       localStorage.setItem("showApprovalPopup", "true");

  //       if (json.apiKey && json.apiSecretKey) {
  //         localStorage.setItem("apiKey", json.apiKey);
  //         localStorage.setItem("apiSecretKey", json.apiSecretKey);
  //       }

  //       dispatch({ type: "LOGIN", payload: json });
  //       localStorage.removeItem("path");

  //       window.location.href = path;
  //     } else {
  //       setError(json.error || json.message || "Login failed.");
  //     }
  //   } catch (err) {
  //     setError("Something went wrong. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  if (!email || !password) {
    setError("All fields are required.");

    setTimeout(() => {
      setError("");
    }, 2000);

    setLoading(false);
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    setError("Please enter a valid email address.");

    setTimeout(() => {
      setError("");
    }, 2000);

    setLoading(false);
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/auth/signIn",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const json = await response.json();
    const path = localStorage.getItem("path") || "/";

    if (response.ok && json.token && json.user) {
      localStorage.setItem("usertoken", json.token);
      localStorage.setItem("userid", json.user._id);
      localStorage.setItem("email", json.user.email);
      localStorage.setItem("showApprovalPopup", "true");

      if (json.apiKey && json.apiSecretKey) {
        localStorage.setItem("apiKey", json.apiKey);
        localStorage.setItem("apiSecretKey", json.apiSecretKey);
      }

      dispatch({ type: "LOGIN", payload: json });
      localStorage.removeItem("path");

      window.location.href = path;
    } else {
      setError(json.error || json.message || "Login failed.");

      setTimeout(() => {
        setError("");
      }, 2000);
    }
  } catch (err) {
    setError("Something went wrong. Please try again.");

    setTimeout(() => {
      setError("");
    }, 2000);
  } finally {
    setLoading(false);
  }
};


  if (user) {
    return <MainDashboard />;
  }

  return (
    <section className="h-[88vh] flex items-center justify-center bg-black p-4 font-sans">
      <div className="flex w-full max-w-5xl bg-[#121212] rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] mx-auto overflow-hidden min-h-[600px] border border-white/5">
        <div className="hidden md:flex flex-col w-7/12 bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-black p-12 justify-between items-center text-white relative">
          <div className="flex flex-col items-center justify-center flex-grow">
            <div className="absolute w-72 h-72 bg-white/5 rounded-full blur-[100px]"></div>
            <img
              src="/png-logo.png"
              alt="Aydi Active Marketplace"
              className="w-64 h-64 object-contain z-10 brightness-110"
            />
          </div>

          <p className="text-center text-xs tracking-widest uppercase opacity-40 max-w-sm leading-relaxed z-10">
            Aydi Active Marketplace • Premium Vendor Portal
          </p>
        </div>

        <div className="w-full md:w-5/12 p-8 md:p-12 flex flex-col relative bg-[#181818]">
          <div className="absolute top-8 left-0">
            <div className="bg-white text-black px-10 py-3 rounded-r-full shadow-lg shadow-white/10">
              <span className="text-lg font-bold tracking-tight">
                Welcome back
              </span>
            </div>
          </div>

          <div className="mt-28 flex flex-col flex-grow">
            {error && (
              <p className="text-red-400 mb-3 text-xs bg-red-400/10 p-3 rounded border border-red-400/20">
                {error}
              </p>
            )}
            <h2 className="text-2xl font-light text-white mb-12">
              Login your account
            </h2>

            <form onSubmit={handleLogin} className="space-y-12">
              <div className="relative border-b border-white/20 focus-within:border-white transition-all duration-300">
                <label className="block text-[13px] font-medium text-slate-300 mb-1">
                  Username or Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full py-2 bg-transparent focus:outline-none text-white placeholder:text-gray-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative border-b border-white/20 focus-within:border-white transition-all duration-300">
                <label className="block text-[13px] font-medium text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full py-2 bg-transparent focus:outline-none text-white placeholder:text-gray-600 font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-52 bg-white text-black py-3 rounded-full hover:bg-slate-200 transition-all shadow-xl shadow-white/5 disabled:opacity-40 font-bold text-sm active:scale-95"
                >
                  {loading ? "Processing..." : "Login"}
                </button>
              </div>
            </form>

            <div className="mt-auto flex flex-col items-center space-y-5 pt-12">
              <a
                href="/signup"
                className="text-gray-400 hover:text-white text-xs font-semibold tracking-wide transition-colors"
              >
                DON'T HAVE AN ACCOUNT?{" "}
                <span className="text-white ml-1">CREATE</span>
              </a>
              <a
                href="/ForgotPassword"
                className="text-gray-600 hover:text-gray-400 text-[11px] border-b border-gray-800 pb-1"
              >
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;
