import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar";
import SubNavbar from "./subNavbar";
import ApprovalPopup from "./Approval";

const Layout = () => {
  const location = useLocation();
  const [dashboardLoading, setDashboardLoading] = useState(
    localStorage.getItem("initialLoad") === "true",
  ); 
  const currentPath = location.pathname.toLowerCase();

  const hideSubNavbarRoutes = [
    "/login",
    "/signup",
    "/forgotpassword",
    "/reset",
    "/new",
  ];

  const hideSubNavbar =
    hideSubNavbarRoutes.includes(currentPath) | dashboardLoading;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {!hideSubNavbar && !dashboardLoading && <SubNavbar />}{" "}
      <div className="flex-1">
        <Outlet context={{ setDashboardLoading }} />{" "}
      </div>
      <ApprovalPopup />
      <footer className="text-gray-400 py-4 bg-black border-t border-white/5 w-full flex items-center">
        <div className="container mx-auto flex flex-col items-center justify-center">
          <p className="text-center text-xs opacity-80 font-normal">
            © Copyright 2020–2026{" "}
            <span className="font-semibold text-white">AYDI Marketplace</span>,
            All Rights Reserved.
          </p>

          <div className="mt-2 text-center text-xs flex items-center space-x-3 font-normal">
            <a
              href="/policy"
              className="hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </a>

            <span className="text-gray-700">|</span>

            <a
              href="/policy"
              className="hover:text-white transition-colors duration-300"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
