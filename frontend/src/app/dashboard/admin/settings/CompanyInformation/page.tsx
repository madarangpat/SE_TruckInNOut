"use client";
import React, { useState } from "react";
import Image from "next/image";
import SettingsOverlayTwo from "@/components/SettingsOverlayTwo";

const CompanyInformation = () => {
  const [showSettings, setShowSettings] = useState(false);

  // Company Information (Static for now, can be fetched from backend)
  const companyData = {
    companyName: "Big C Trucking",
    companyAddress: "456 Freight Lane, Industrial Park, Metro City",
    contactNumber: "+1 987 654 3210",
    email: "info@bigctrucking.com",
    website: "www.bigctrucking.com",
    taxId: "TIN-789-456-123",
    registrationNo: "REG-456123789",
    industryType: "Freight & Logistics",
    established: "1998",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="wrapper w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-xl shadow-lg bg-black/20">
        {/* Company Name at the Top */}
        <h1 className="text-center text-lg sm:text-xl md:text-2xl font-semibold text-black/70 mb-4 tracking-[0.1em]">
          {companyData.companyName} Company
        </h1>

        {/* Company Logo (Rectangular Frame) */}
        <div className="w-full h-24 sm:h-32 md:h-36 bg-black/20 flex items-center justify-center border-2 border-black/10 shadow-lg rounded-lg overflow-hidden mb-4">
          <Image
            src="/tinowlabel2.png" // REPLACE WITH ACTUAL COMPANY LOGO PO HEHE
            alt="Company Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        {/* Company Description Placeholder */}
        <p className="text-center text-xs sm:text-sm text-black/60 italic mb-5 px-4 sm:px-10">
          &quot;A trusted name in freight and logistics, delivering excellence
          since 1998.&quot;
        </p>
        <p className="text-center text-xs sm:text-sm text-black/60 italic mt-1 mb-5 px-4 sm:px-10">
          *REPLACE WITH ACTUAL COMPANY DESCRIPTION*
        </p>

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