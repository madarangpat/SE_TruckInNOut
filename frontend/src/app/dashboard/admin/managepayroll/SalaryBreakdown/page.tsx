"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useRef } from "react";
import PDFButton from "@/components/PDFButton";

const SalaryBreakdown = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeName = searchParams.get("employee") || "Unknown Employee";
  const dateRange = searchParams.get("date") || "Unknown Date";

  // Reference for PDF Export (Uses Browser Print)
  const reportRef = useRef<HTMLDivElement>(null);

  // Employee Images (INTEGRATE BACKEND HERE BRUH)
  const employeeImages: { [key: string]: string } = {
    "Employee 1": "/tinoicon.png",
    "Employee 2": "/tinowlabel2.png",
    "Employee 3": "/tinoicon.png",
    "Employee 4": "/tinowlabel2.png",
    "Employee 5": "/tinoicon.png",
  };
  const employeeImage = employeeImages[employeeName] || "/accountsblk.png";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="wrapper w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-6 sm:p-8 rounded-2xl shadow-lg bg-black/20">
        {/* Back Button & Title */}
        <div className="flex items-center text-black/60 text-lg font-semibold mb-4">
          <button
            onClick={() => router.back()}
            className="text-2xl mr-2 cursor-pointer"
          >
            «
          </button>
          <span className="uppercase text-xl tracking-wider">
            SALARY BREAKDOWN
          </span>
        </div>

        {/* Employee Image */}
        <div className="flex flex-col justify-center items-center mb-4">
          <div className="w-24 sm:w-28 h-24 sm:h-28 bg-white rounded-full flex items-center justify-center border-4 border-gray-400 shadow-lg">
            <Image
              src={employeeImage}
              alt="Employee Profile"
              width={90}
              height={90}
              className="rounded-full object-cover opacity-90"
            />
          </div>
          <p className="mt-2 text-black/60 font-semibold text-sm">
            {employeeName}
          </p>
        </div>

        {/* Salary Breakdown Panel */}
        <div
          ref={reportRef}
          className="wrapperdb2 p-4 rounded-lg shadow-lg text-black/80 text-sm bg-white"
        >
          <h2 className="text-center text-lg font-semibold mb-2">
            {dateRange}
          </h2>

          {/* Backend Will Populate Data Here */}
          <p className="text-center text-gray-500 italic">
            Fetching Salary Breakdown...
          </p>
        </div>

        {/* Generate Report Button */}
        <div className="flex justify-center mt-6">
          <div className="px-6 py-2 bg-[#668743] text-white text-sm rounded-lg hover:bg-[#345216] tracking-wide">
            <PDFButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryBreakdown;
