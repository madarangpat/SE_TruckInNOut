"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GrossPayrollPDF from "@/components/GrossPayrollPDF"; // Adjust path if needed
import Image from "next/image";

const ViewGross = () => {
  const router = useRouter();

  const [grossStartDate, setGrossStartDate] = useState<Date | null>(null);
  const [grossEndDate, setGrossEndDate] = useState<Date | null>(null);
  const [tripData, setTripData] = useState([]); // Trip and salary info
  const [totalsId, setTotalsId] = useState<number | null>(null);

  // Fetch trips + salary on date change
  useEffect(() => {
    if (grossStartDate && grossEndDate) {
      const query = new URLSearchParams({
        start_date: grossStartDate.toISOString(),
        end_date: grossEndDate.toISOString(),
      });

      fetch(`http://localhost:8000/api/trips-by-date-range/?${query}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched Trip Data:", data);
          setTripData(data);
        })
        .catch((err) => console.error("Failed to fetch trips:", err));
    }
  }, [grossStartDate, grossEndDate]);

  // Handle Calculate Totals
  const handleCalculateTotals = async () => {
    if (!grossStartDate || !grossEndDate) {
      alert("Please select a date range first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/calculate_totals/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: grossStartDate.toISOString().split("T")[0],
          end_date: grossEndDate.toISOString().split("T")[0],
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Calculated totals:", result);
        setTotalsId(result.id); // Pass this to PDF export
        alert("Gross totals calculated and saved.");
      } else {
        alert(result.error || "Something went wrong during calculation.");
      }
    } catch (err) {
      console.error("Error calculating totals:", err);
      alert("Failed to calculate totals.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-8">
      <div className="wrapper w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-6 sm:p-8 rounded-2xl shadow-lg bg-black/20">
        {/* Back Button */}
        <div className="self-start w-full">
          <button
            onClick={() => router.push("/dashboard/admin/managepayroll")}
            className="rounded-lg transition hover:opacity-80"
          >
            <Image
              src="/Back.png"
              alt="Back to Manage Payroll"
              width={30}
              height={30}
            />
          </button>
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-black/50 mb-4 tracking-[0.1em]">
          GROSS PAYROLL
        </h1>

        {/* Date Pickers */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 mb-4">
            {/* Start Date */}
            <div className="w-1/2">
              <label className="block text-sm text-black mb-1 font-bold">Start Date</label>
              <DatePicker
                selected={grossStartDate}
                onChange={(date) => setGrossStartDate(date)}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select start date"
                className="w-full px-4 py-2 rounded-md shadow-md text-black cursor-pointer bg-white"
                calendarClassName="rounded-lg"
              />
            </div>

            {/* End Date */}
            <div className="w-1/2">
              <label className="block text-sm text-black mb-1 font-bold">End Date</label>
              <DatePicker
                selected={grossEndDate}
                onChange={(date) => setGrossEndDate(date)}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select end date"
                minDate={grossStartDate || undefined}
                className="w-full px-4 py-2 rounded-md shadow-md text-black cursor-pointer bg-white"
                calendarClassName="rounded-lg"
              />
            </div>

            {/* Clear Button */}
            <button
              onClick={() => {
                setGrossStartDate(null);
                setGrossEndDate(null);
                setTripData([]);
                setTotalsId(null);
              }}
            >
              <Image
                src="/Trash.png"
                alt="Clear Dates"
                width={30}
                height={30}
                className="mt-5"
              />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            onClick={handleCalculateTotals}
            className="bg-[#668743] hover:bg-[#345216] text-white py-2 px-4 rounded-lg shadow"
          >
            Calculate Totals
          </button>

          <GrossPayrollPDF
            startDate={grossStartDate}
            endDate={grossEndDate}
            tripData={tripData}
            totalsId={totalsId}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewGross;
