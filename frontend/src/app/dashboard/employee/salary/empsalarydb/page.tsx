"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import PDFButton from "@/components/PDFButton"; // Adjust the path if necessary


const EmpSalaryBreakdownPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateRange = searchParams.get("date") || "Unknown Date";
  const [loading, setLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  // Simulated API Fetch for Salary Breakdown (Replace with backend integration)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Simulated API delay
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10">
      {/* Title with Back Button */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => router.back()}
          className="text-2xl text-black/60 hover:text-black/80 transition"
        >
          «
        </button>
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-black/50 tracking-[0.1em]">
          SALARY BREAKDOWN
        </h1>
      </div>

      {/* Salary Breakdown Panel */}
      <div
        ref={reportRef}
        className="wrapper w-full max-w-3xl rounded-xl shadow-lg p-6 bg-white text-black/80"
      >
        <h2 className="text-center text-lg text-black font-semibold mb-4">
          {dateRange}
        </h2>

        {/* Placeholder for Salary Breakdown Data */}
        <p className="text-center text-black/50 italic">
          {loading
            ? "Fetching Salary Breakdown..."
            : "Salary breakdown data will be displayed here."}
        </p>
      </div>

      {/* Generate Report Button with Print Icon */}
      <div className="mt-6 flex justify-center">
        <PDFButton />
      </div>
    </div>
  );
};

export default EmpSalaryBreakdownPage;
