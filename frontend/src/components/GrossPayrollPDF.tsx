"use client";
import React from "react";
import Image from "next/image";

interface Props {
  startDate: Date | null;
  endDate: Date | null;
}

const GrossPayrollPDF: React.FC<Props> = ({ startDate, endDate }) => {
  const handleDownload = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const params = new URLSearchParams({
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    });

    const pdfUrl = `http://localhost:8000/api/generate-pdf/gross-payroll/?${params}`;
    window.open(pdfUrl, "_blank");
  };

  return (
    <button
      onClick={handleDownload}
      className="px-6 py-2 bg-[#668743] text-white text-sm rounded-lg hover:bg-[#345216] tracking-wide flex justify-center items-center gap-2"
    >
      <Image
        src="/print.png"
        alt="Print Icon"
        width={18}
        height={18}
        className="opacity-80"
      />
      Export Gross Payroll
    </button>
  );
};

export default GrossPayrollPDF;
