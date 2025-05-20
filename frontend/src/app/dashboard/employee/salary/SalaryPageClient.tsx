"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EmployeeSalaryPreview from "@/components/EmployeeSalaryPreview";
import { toast } from "sonner";

const SalaryPageClient = ({ user }: { user: User }) => {
  const username = user?.username;
  const router = useRouter();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const formattedStart = startDate ? startDate.toLocaleDateString("en-CA") : "";
  const formattedEnd = endDate ? endDate.toLocaleDateString("en-CA") : "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-8">
      <div className="wrapper w-auto max-w-6xl p-6 sm:p-8 rounded-2xl shadow-lg bg-black/20">
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-black/50 mb-4 tracking-[0.1em]">
          MY PAYROLL
        </h1>

        {/* Date Pickers Section */}
        <div className="flex gap-4 mb-4 items-end">
          <div className="w-1/2">
            <label className="block text-sm text-black mb-1 font-bold">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                if (date) {
                  const today = new Date();
                  const calculatedEnd = new Date(date);
                  calculatedEnd.setDate(calculatedEnd.getDate() + 6);

                  if (calculatedEnd > today) {
                    toast.warning(
                      "End date exceeds today. Please select an earlier Saturday."
                    );
                    setStartDate(null);
                    setEndDate(null);
                    return;
                  }

                  setStartDate(date);
                  setEndDate(calculatedEnd);
                }
              }}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select start date"
              className="w-full px-4 py-2 rounded-md shadow-md text-black cursor-pointer bg-white"
              filterDate={(date) => {
                const today = new Date();
                const isSaturday = date.getDay() === 6;
                const isPastOrToday = date <= today;
                return isSaturday && isPastOrToday;
              }}
            />
          </div>

          <div className="w-1/2">
            <label className="block text-sm text-black mb-1 font-bold">End Date (Auto)</label>
            <DatePicker
              selected={endDate}
              onChange={() => {}}
              dateFormat="MMMM d, yyyy"
              placeholderText="End date (Auto)"
              className="w-full px-4 py-2 rounded-md shadow-md text-black bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>

          {/* Clear Button */}
          <div className="pb-1">
            <button
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
              }}
              className={`py-2 px-4 rounded-lg shadow text-white ${
                !startDate && !endDate
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#668743] hover:bg-[#345216]"
              }`}
            >
              Clear
            </button>
          </div>
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
          <EmployeeSalaryPreview
            employee={username || ""}
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
