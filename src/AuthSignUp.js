import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuthContext } from "./Hooks/useAuthContext";
import Dashboard from "./pages/Dashboard";
import { toast } from "react-toastify";

const AuthSignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch, user } = useAuthContext();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phoneNumber, setNumber] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);

const handleSellerNameChange = (e) => {
  const value = e.target.value;

  // Capital letters check
  if (/[A-Z]/.test(value)) {
    toast.error("Seller name must be in lowercase only");
    return;
  }

  // Space check
  if (/\s/.test(value)) {
    toast.error("Spaces are not allowed in seller name");
    return;
  }

  // Special character check (only lowercase letters + numbers allowed)
  if (!/^[a-z0-9]*$/.test(value)) {
    toast.error("Special characters are not allowed");
    return;
  }

  setSellerName(value);
};


  // const handleSignup = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setSuccess("");
  //   setLoading(true);

  //   if (!firstName || !lastName || !email || !password) {
  //     setError("All fields are required.");
  //     setLoading(false);
  //     return;
  //   }

  //   if (!agreedToPolicies) {
  //     setError("You must agree to the policies and terms to sign up.");
  //     setLoading(false);
  //     return;
  //   }

  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailPattern.test(email)) {
  //     setError("Please enter a valid email address.");
  //     setLoading(false);
  //     return;
  //   }

  //   if (password.length < 6) {
  //     setError("Password must be at least 6 characters long.");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       "http://localhost:5000/auth/signUp",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           firstName,
  //           lastName,
  //           email,
  //           sellerName,
  //           password,
  //           zip,
  //           country,
  //           state,
  //           phoneNumber,
  //           city,
  //         }),
  //       },
  //     );

  //     const json = await response.json();

  //     if (response.ok) {
  //       toast.success("Registration successful! Please log in.");
  //       navigate("/Login");
  //     } else {
  //       toast.error(json.error || "An error occurred during registration.");
  //     }
  //   } catch (error) {
  //     setError("An error occurred. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // clear old errors

    const newErrors = {};

    // Required fields validation
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!sellerName) newErrors.sellerName = "Seller name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!city) newErrors.city = "City is required";
    if (!zip) newErrors.zip = "Zip code is required";
    if (!state) newErrors.state = "State is required";
    if (!country) newErrors.country = "Country is required";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Policy check
    if (!agreedToPolicies) {
      newErrors.policy = "You must agree to the policies and terms";
    }

    // If errors exist stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/auth/signUp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            sellerName,
            password,
            zip,
            country,
            state,
            phoneNumber,
            city,
          }),
        },
      );

      const json = await response.json();

      if (response.ok) {
        navigate("/Login");
      } else {
        setErrors({
          api: json.error || "Registration failed. Please try again.",
        });

        // 2 second ke baad error remove
        setTimeout(() => {
          setErrors((prev) => ({ ...prev, api: "" }));
        }, 2000);
      }
    } catch (err) {
      setErrors({
        api: "Something went wrong. Please try again later.",
      });

      setTimeout(() => {
        setErrors((prev) => ({ ...prev, api: "" }));
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Dashboard />;
  }

  return (
    <section className="h-[88vh] flex items-center justify-center bg-black p-4 font-sans">
      {/* MAIN CONTAINER */}
      <div className="flex w-full max-w-5xl bg-[#121212] rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] mx-auto overflow-hidden min-h-[700px] border border-white/5">
        {/* LEFT SECTION - JET BLACK GRADIENT */}
        <div className="hidden md:flex flex-col w-5/12 bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-black p-12 justify-between items-center text-white relative">
          <div className="flex flex-col items-center justify-center flex-grow">
            <div className="absolute w-72 h-72 bg-white/5 rounded-full blur-[100px]"></div>
            <img
              src="/png-logo.png"
              alt="Logo"
              className="w-56 h-56 object-contain z-10 brightness-110"
            />
          </div>
          <p className="text-center text-xs tracking-widest uppercase opacity-40 max-w-xs leading-relaxed z-10">
            Join Aydi-Active Marketplace and start selling your products online
            today.
          </p>
        </div>

        {/* RIGHT SECTION - SIGNUP FORM */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col relative bg-[#181818]">
          {/* Top Pill Header */}
          <div className="absolute top-8 left-0 z-20">
            <div className="bg-white text-black px-10 py-3 rounded-r-full shadow-lg shadow-white/10">
              <span className="text-lg font-bold tracking-tight">
                Create Account
              </span>
            </div>
          </div>

          <div className="mt-24 flex flex-col h-[60vh]">
            {errors.api && (
              <div className="bg-red-500/10 border mb-3 border-red-500/20 text-red-400 p-3 rounded text-xs font-medium">
                {errors.api}
              </div>
            )}
            <h2 className="text-2xl font-light text-white mb-8">
              Register as a vendor
            </h2>

            {/* SCROLLABLE FORM AREA */}
            <form
              onSubmit={handleSignup}
              className="space-y-8 overflow-y-auto pr-4 custom-scrollbar"
            >
              {/* NAME FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative border-b border-white/20 focus-within:border-white transition-all">
                  <label className="block text-[13px] font-medium text-slate-300 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    className="w-full py-2 bg-transparent focus:outline-none text-white placeholder:text-gray-600"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="relative border-b border-white/20 focus-within:border-white transition-all">
                  <label className="block text-[13px] font-medium text-slate-300 mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    className="w-full py-2 bg-transparent focus:outline-none text-white placeholder:text-gray-600"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* SELLER NAME */}
              <div className="relative border-b border-white/20 focus-within:border-white transition-all">
                <label className="block text-[13px] font-medium text-slate-300 mb-1">
                  Seller Name*{" "}
                  <span className="text-[11px] text-slate-500 font-normal">
                    (lowercase only)
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full py-2 bg-transparent focus:outline-none text-white placeholder:text-gray-600"
                  placeholder="e.g. unique-store"
                  value={sellerName}
                  onChange={handleSellerNameChange}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="relative border-b border-white/20 focus-within:border-white transition-all">
                <label className="block text-[13px] font-medium text-slate-300 mb-1">
                  Email Address*
                </label>
                <input
                  type="email"
                  className="w-full py-2 bg-transparent focus:outline-none text-white placeholder:text-gray-600"
                  placeholder="vendor@aydiactive.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="relative border-b border-white/20 focus-within:border-white transition-all">
                <label className="block text-[13px] font-medium text-slate-300 mb-1">
                  Password*
                </label>
                <input
                  type="password"
                  className="w-full py-2 bg-transparent focus:outline-none text-white placeholder:text-gray-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* ADDRESS FIELDS */}
              <div className="grid grid-cols-2 gap-8">
                <div className="relative border-b border-white/20 focus-within:border-white transition-all">
                  <label className="block text-[13px] font-medium text-slate-300 mb-1">
                    City*
                  </label>
                  <input
                    type="text"
                    className="w-full py-2 bg-transparent focus:outline-none text-white placeholder:text-gray-600"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="relative border-b border-white/20 focus-within:border-white transition-all">
                  <label className="block text-[13px] font-medium text-slate-300 mb-1">
                    Zip Code*
                  </label>
                  <input
                    type="number"
                    className="w-full py-2 bg-transparent focus:outline-none text-white placeholder:text-gray-600"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="relative border-b border-white/20 focus-within:border-white transition-all">
                  <label className="block text-[13px] font-medium text-slate-300 mb-1">
                    State*
                  </label>
                  <input
                    type="text"
                    className="w-full py-2 bg-transparent focus:outline-none text-white placeholder:text-gray-600"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
                <div className="relative border-b border-white/20 focus-within:border-white transition-all">
                  <label className="block text-[13px] font-medium text-slate-300 mb-1">
                    Country*
                  </label>
                  <input
                    type="text"
                    className="w-full py-2 bg-transparent focus:outline-none text-white placeholder:text-gray-600"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* PHONE */}
              <div className="relative border-b border-white/20 focus-within:border-white transition-all">
                <label className="block text-[13px] font-medium text-slate-300 mb-1">
                  Phone Number*
                </label>
                <input
                  type="number"
                  className="w-full py-2 bg-transparent focus:outline-none text-white placeholder:text-gray-600"
                  value={phoneNumber}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                />
              </div>

              {/* POLICY AGREEMENT */}
              <div className="flex items-center space-x-3 py-2">
                <input
                  type="checkbox"
                  id="policyAgreement"
                  checked={agreedToPolicies}
                  onChange={(e) => setAgreedToPolicies(e.target.checked)}
                  className="h-4 w-4 rounded border-white/30 bg-transparent text-white focus:ring-offset-0 focus:ring-0 cursor-pointer"
                />
                <label
                  htmlFor="policyAgreement"
                  className="text-sm text-slate-400 cursor-pointer"
                >
                  I agree with the{" "}
                  <span
                    className="text-white font-semibold hover:underline"
                    onClick={() => window.open("/policy", "_blank")}
                  >
                    Policies and Terms
                  </span>
                </label>
              </div>

              {/* ERROR */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-xs font-medium">
                  {error}
                </div>
              )}

              {/* SIGNUP BUTTON */}
              <div className="flex justify-center pt-6 pb-10">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-52 bg-white text-black py-3 rounded-full hover:bg-slate-200 transition-all shadow-xl shadow-white/5 disabled:opacity-40 font-bold text-sm active:scale-95"
                >
                  {loading ? "Registering..." : "Sign Up"}
                </button>
              </div>
            </form>

            {/* BOTTOM LINK */}
            <div className="mt-6 flex flex-col items-center border-t border-white/5 pt-6">
              <a
                href="/Login"
                className="text-gray-400 hover:text-white text-xs font-semibold tracking-wide transition-colors uppercase"
              >
                Already have an account?{" "}
                <span className="text-white ml-1">Log In</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for hidden scrollbar but scrollable functionality */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>
    </section>
  );
};

export default AuthSignUp;
