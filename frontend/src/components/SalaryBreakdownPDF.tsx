import React from "react";
import Image from "next/image";

interface Props {
  employeeUsername: string | undefined;
  startDate: Date | null;
  endDate: Date | null;
  tripSalaries?: any[];
}

const SalaryBreakdownPDF: React.FC<Props> = ({ employeeUsername, startDate, endDate }) => {
  const handleDownload = () => {
    if (!employeeUsername || !startDate || !endDate) {
      alert("Please select an employee and date range."); 
      return;
    }
    const params = new URLSearchParams({
      employee: employeeUsername,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    });

    const url = `http://localhost:8000/api/generate-pdf/salary-breakdown/?${params.toString()}`;
    window.open(url, "_blank");
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