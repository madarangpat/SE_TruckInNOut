import React from "react";
import Image from "next/image";

const SalaryBreakdownPDF: React.FC = () => {
  const handleDownload = () => {
    const pdfUrl = "http://localhost:8000/api/generate-pdf/salary-breakdown/";
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
      Export Salary Breakdown
    </button>
  );
};

export default SalaryBreakdownPDF;