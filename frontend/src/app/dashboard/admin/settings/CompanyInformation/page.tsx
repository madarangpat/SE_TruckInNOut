"use client";
import React, { useState } from "react";
import Image from "next/image";
import SettingsOverlayTwo from "@/components/SettingsOverlayTwo";

const CompanyInformation = () => {
  const [showSettings, setShowSettings] = useState(false);

  const companyData = {
    companyName: "BIG C TRUCKING SERVICES",
    companyAddress: "983 J. P. Rizal St, Marikina, 1800 Metro Manila",
    contactNumber: "09173894034 /89486652",
    email: "bigctruckingservices@yahoo.com",
    website: "bigctruckingservices.org",
    tinNo: "761-838-706-000",
    dti: "Business Name No. 1906178",
    businessPermit: "",
    industryType: "Freight & Logistics",
    established: "2018",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="wrapper w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-xl shadow-lg bg-black/20">
        {/* Company Name at the Top */}
        <h1 className="text-center text-lg sm:text-xl md:text-2xl font-semibold text-black/70 mb-4 tracking-[0.1em]">
          {companyData.companyName}
        </h1>

        {/* Company Logo (Rectangular Frame) */}
        <div className="flex justify-center mb-3">
          <Image
            src="/bigc.png"
            alt="Company Logo"
            width={200}
            height={200}
            className="flex items-center justify-center"
          />
        </div>

        {/* Company Information (View-Only) */}
        <div className="p-3 text-black/80 text-xs sm:text-sm">
          {Object.entries(companyData).map(([key, value], index) => {
            let label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase()); // Format labels properly

            return (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b-2 border-black/5"
              >
                <span className="text-black/60">{label}</span>
                <span className="text-black text-xs sm:text-sm">{value}</span>               
              </div>
            );
          })}
        </div>
        {/* Back Button */}
          <div className="mt-6">
            <button 
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 text-black/80 border border-black/40 rounded-lg hover:bg-gray-200 transition"
            >
              ← Back to Settings
            </button>
          </div>
        </div>

        {/* Display Overlay if showSettings is true */}
        {showSettings && <SettingsOverlayTwo onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default CompanyInformation;