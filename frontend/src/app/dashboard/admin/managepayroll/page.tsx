"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SetPaymentStatus from "@/components/SetPaymentStatus";

const ManagePayroll = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-black/60 tracking-wider">
        MANAGE PAYROLL
      </h1>

      {/* Selection Buttons */}
      <div className="flex flex-row gap-6">
        {/* Individual Payroll Button */}
        <button
          onClick={() => router.push("/dashboard/admin/managepayroll/SalaryBreakdown")}
          className="px-6 py-3 bg-[#668743] text-white text-sm rounded-lg hover:bg-[#345216] flex items-center gap-2"
        >
          <Image
            src="/SalaryBreakdown.png"
            alt="Individual Payroll"
            width={100}
            height={100}
          />
          <span className="mt-4 text-xl font-semibold text-white">
            INDIVIDUAL
          </span>
        </button>

        {/* Overall Payroll Button */}
        <button
          onClick={() => router.push("/dashboard/admin/managepayroll/ViewGross")}
          className="px-6 py-3 bg-[#668743] text-white text-sm rounded-lg hover:bg-[#345216] flex items-center gap-2"
        >
          <Image
            src="/Gross.png"
            alt="Gross Payroll"
            width={100}
            height={100}
          />
          <span className="mt-4 text-xl font-semibold text-white">
            OVERALL
          </span>
        </button>
      </div>
    </div>
  );
};

export default ManagePayroll;