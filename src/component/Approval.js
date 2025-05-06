import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "../Hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

const ApprovalPopup = () => {
  const { user, dispatch } = useAuthContext();
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    const storedEmail = localStorage.getItem("email");

    if (!token || !storedEmail) return;

    try {
      const decoded = jwtDecode(token);
      const role = decoded?.payLoad?.role;

      if (role === "User") {
        setShowPopup(true);
        setEmail(storedEmail);
      }
    } catch (err) {
      console.error("Token decode error:", err);
    }
  }, []);

  const LogOut = async () => {
    try {
      const userid = localStorage.getItem("userid");
      if (userid) {
        await fetch(
          `https://multi-vendor-marketplace.vercel.app//auth/logout/${userid}`,
          {
            method: "POST",
          }
        );
        dispatch({ type: "LOGOUT" });
        localStorage.clear();
        navigate("/");
        setShowPopup(false);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fadeInUp p-8 relative border border-gray-200">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-black transition"
          onClick={() => setShowPopup(false)}
        ></button>
        <div className="text-center">
          <div className="text-4xl mb-3 text-yellow-500">⏳</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Approval Pending
          </h2>
          <p className="text-gray-600">
            Please wait for <strong>24 hours</strong> until your account is
            approved.
          </p>
          <p className="text-sm text-gray-400 mt-4">Email: {email}</p>
          <button
            onClick={LogOut}
            className="mt-6 inline-block px-6 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-full hover:opacity-90 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPopup;
