"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import PDFButton from "@/components/PDFButton";

const ViewGross = () => {
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="wrapper w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-3xl p-6 sm:p-8 rounded-2xl shadow-lg bg-black/20">
        {/* Page Title */}
        <div className="flex items-center text-black/60 text-lg font-semibold mb-4">
          <button
            onClick={() => router.back()}
            className="text-2xl mr-2 cursor-pointer"
          >
            «
          </button>
          <span className="uppercase text-xl tracking-wider">
            Gross Payroll
          </span>
        </div>

        {/* Gross Payroll Summary (Ready for Backend Integration) */}
        <div
          ref={reportRef}
          className="wrapperdb2 p-4 rounded-lg shadow-lg text-black/80 text-sm bg-white"
        >
          <h2 className="text-center text-lg font-semibold mb-2">
            Gross Payroll Summary
          </h2>

          {/* 🚀 Backend Will Populate Data Here */}
          <p className="text-center text-gray-500 italic">
            Fetching Payroll Data...
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

export default ViewGross;
