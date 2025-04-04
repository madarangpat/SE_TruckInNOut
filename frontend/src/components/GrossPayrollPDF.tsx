"use client";
import React from "react";

interface GrossPayrollPDFProps {
  startDate: Date | null;
  endDate: Date | null;
  tripData: any[]; // Not used here but available if needed
  totalsId: number | null;
}

const GrossPayrollPDF: React.FC<GrossPayrollPDFProps> = ({
  startDate,
  endDate,
  tripData,
  totalsId,
}) => {
  const handleExportPDF = () => {
    if (!totalsId) {
      alert("Please calculate totals before exporting the PDF.");
      return;
    }

    const url = `http://localhost:8000/api/generate_gross_payroll_pdf/?totals_id=${totalsId}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleExportPDF}
      disabled={!totalsId}
      className={` bg-[#668743] hover:bg-[#345216] text-white py-2 px-4 rounded-lg shadow transition ${
        !totalsId ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      Export Gross Payroll PDF
    </button>
  );
};

export default GrossPayrollPDF;
