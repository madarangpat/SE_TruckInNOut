"use client";
import React, { useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GrossPayrollPDF from "@/components/GrossPayrollPDF"; // update the path if needed
import Image from "next/image";

const ViewGross = () => {
  const router = useRouter();

  // For Gross Payroll
  const [grossStartDate, setGrossStartDate] = useState<Date | null>(null);
  const [grossEndDate, setGrossEndDate] = useState<Date | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-8">    
      <div className="wrapper w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-6 sm:p-8 rounded-2xl shadow-lg bg-black/20">
        {/* Back */}
        <div className="self-start w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <button
            onClick={() => router.push("/dashboard/admin/managepayroll")}
            className="rounded-lg transition hover:opacity-80"
          >
            <Image
              src="/Back.png"
              alt="Back to Manage Payroll"
              width={30} // You can adjust size here
              height={30}
            />
          </button>
        </div>
        
        {/* Title */}
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-black/50 mb-4 tracking-[0.1em]">
          GROSS PAYROLL
        </h1>

        {/* Start and End Date Pickers Side by Side */}
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
            <button
              onClick={() => {
                setGrossStartDate(null);
                setGrossEndDate(null);
              }}
            >
              <Image
                src="/Trash.png"
                alt="Clear Dates"
                width={30} // You can adjust size here
                height={30}
                className = "mt-5"
              />
            </button> 
          </div>
        </div>
        {/* Buttons */}
        <div className="mt-1 flex w-auto items-center justify-center flex-col gap-2">
            <GrossPayrollPDF startDate={grossStartDate} endDate={grossEndDate} />
        </div>
      </div>
    </div>
  );
};

export default ViewGross;
