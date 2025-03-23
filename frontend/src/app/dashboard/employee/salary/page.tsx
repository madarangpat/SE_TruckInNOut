"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PDFButton from "@/components/PDFButton";

const SalaryPage = () => {
  const router = useRouter();
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Fetch salary details when a date is selected (Simulated API Call)
  useEffect(() => {
    if (!selectedDateRange) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false); // Simulated API delay before showing placeholder
    }, 1000);
  }, [selectedDateRange]);

  // Generate Date Ranges Dynamically
  const generateDateRanges = () => {
    const currentYear = new Date().getFullYear();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let dateRanges: string[] = [];

    months.forEach((month) => {
      for (let week = 1; week <= 4; week++) {
        dateRanges.push(`${month} (${currentYear}), Week ${week}`);
      }
    });

    return dateRanges;
  };

  // Handle Date Selection
  const handleDateSelect = (dateRange: string) => {
    setSelectedDateRange(dateRange);
    setDateDropdownOpen(false);
  };

  // Navigate to Salary Breakdown Page
  const handleViewSalaryBreakdown = () => {
    if (!selectedDateRange) {
      alert("Please select a date range before viewing salary breakdown.");
      return;
    }
    router.push(
      `/dashboard/employee/salary/empsalarydb?date=${selectedDateRange}`
    );
  };

  return (
    <div className="min-h-vh flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 pt-60">
      {/* Title */}
      <h1 className="text-center text-2xl sm:text-3xl font-semibold text-black/50 mb-4 tracking-[0.1em]">
        UPDATED SALARY
      </h1>

      {/* Select Date Range Dropdown */}
      <div className="relative mb-6">
        <button
          onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
          className="innerwrapper w-full max-w-sm px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-white rounded-lg flex justify-between items-center hover:bg-black/40 shadow-md uppercase tracking-widest text-xs sm:text-sm"
        >
          {selectedDateRange || "Select Date Range"}
          <span>▼</span>
        </button>
        {dateDropdownOpen && (
          <div className="dropwrapper absolute w-full max-w-sm bg-black/40 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 sm:max-h-60 overflow-y-auto backdrop-blur-[10px]">
            {generateDateRanges().map((range, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(range)}
                className="w-full text-left px-4 py-2 hover:bg-black/20 uppercase tracking-widest text-xs sm:text-sm"
              >
                {range}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Salary Details Panel */}
      <div
        ref={reportRef}
        className="wrapper w-full max-w-3xl rounded-xl shadow-lg p-6 bg-white text-black/80"
      >
        {selectedDateRange && (
          <h2 className="text-center text-lg text-black font-semibold mb-4">
            {selectedDateRange}
          </h2>
        )}

        {/* Placeholder for Payroll Data */}
        <p className="text-center text-black/50 italic">
          {loading
            ? "Fetching Payroll Data..."
            : "Select a date range to view salary details."}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col gap-0">
        <button
          onClick={handleViewSalaryBreakdown}
          className="px-6 py-2 bg-[#668743] text-white text-sm rounded-lg hover:bg-[#345216] tracking-wide"
        >
          View Salary Breakdown
        </button>
        {/* Generate Report Button with Print Icon */}
        <div className="mt-6 flex justify-center">
          <PDFButton />
        </div>
      </div>
    </div>
  );
};

export default SalaryPage;
