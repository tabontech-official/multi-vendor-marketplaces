// src/Layout.js
import React from "react";
import { Outlet,useLocation } from "react-router-dom";
import Navbar from "./navbar"; // Import Navbar component
import SubNavbar from "./subNavbar";

const Layout = () => {
  const location=useLocation()
  const hideSubNavbar=location.pathname==="/Login" || location.pathname==="/signup" || location.pathname === "/ForgotPassword"
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {!hideSubNavbar && <SubNavbar />}
      <div className="flex-1  ">
        <Outlet />
      </div>

      <footer className="text-white py-4 bg-gradient-to-r from-blue-600  to-[#18262f] left-0 bottom-0 w-full">
        <div className="container mx-auto flex flex-col items-center justify-center">
          <p className="text-center text-sm">
            © Copyright 2020-2024{" "}
            <span className="font-semibold">AYDI Marketplace</span>, All rights
            reserved.
          </p>
          <div className="mt-2 text-center text-xs">
            <a
              href="/policy"
              className=" hover:text-gray-300 transition duration-300"
            >
              Privacy Policy
            </a>{" "}
            |
            <a
              href="/policy"
              className=" hover:text-gray-300 transition duration-300"
            >
              {" "}
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
