"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import PreviewReportSB from "@/components/PreviewReportSB";

const SalaryPageClient = ({ user }: { user: User }) => {
  const username = user?.username;
  const router = useRouter();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // This function calculates the start date based on the end date (6 days before)
  const calculateStartDate = (end: Date) => {
    const date = new Date(end);
    date.setDate(date.getDate() - 6); // Subtract 6 days from the end date to get the start date (previous Sunday)
    return date;
  };

  const formattedStart = startDate ? startDate.toLocaleDateString('en-CA') : "";
  const formattedEnd = endDate ? endDate.toLocaleDateString('en-CA') : "";

  useEffect(() => {
      if (endDate) {
        const newStartDate = calculateStartDate(endDate); // Calculate start date based on the end date
        setStartDate(newStartDate); // Set the start date to 6 days before the end date (previous Sunday)
      }
    }, [endDate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-8">
      <div className="wrapper w-auto max-w-6xl p-6 sm:p-8 rounded-2xl shadow-lg bg-black/20">
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-black/50 mb-4 tracking-[0.1em]">
          MY PAYROLL
        </h1>

        {/* Date Pickers Section */}
        <div className="flex gap-4 mb-4 items-end">
          <div className="w-1/2">
            <label className="block text-sm text-black mb-1 font-bold">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select end date"
              className="w-full px-4 py-2 rounded-md shadow-md text-black cursor-pointer bg-white"
              filterDate={(date) => {
                const today = new Date();
                const isSaturday = date.getDay() === 6; // Check if it's a Saturday
                const isPastOrToday = date <= today; // Check if it's not in the future
                return isSaturday && isPastOrToday; // Only allow past Saturdays or today
              }}
            />
          </div>

          <div className="w-1/2">
            <label className="block text-sm text-black mb-1 font-bold">Start Date (Automatic)</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="MMMM d, yyyy"
              placeholderText="Start date (Auto)"
              className="w-full px-4 py-2 rounded-md shadow-md text-black cursor-pointer bg-white"
              disabled
            />
          </div>

          {/* Trash Bin Icon */}
          <button onClick={() => { setStartDate(null); setEndDate(null); }}>
            <Image src="/Trash.png" alt="Clear Dates" width={30} height={30} />
          </button>
        </div>

        {/* Preview Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowPreviewModal(true)}
            disabled={!startDate || !endDate}
            className={`py-2 px-4 rounded-lg shadow text-white ${
              !startDate || !endDate
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#668743] hover:bg-[#345216]"
            }`}
          >
            Preview Salary Breakdown
          </button>
        </div>

        {/* PDF Preview Modal */}
        {showPreviewModal && (
          <PreviewReportSB
            employee={username}
            start={formattedStart}
            end={formattedEnd}
            onClose={() => setShowPreviewModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default SalaryPageClient;
