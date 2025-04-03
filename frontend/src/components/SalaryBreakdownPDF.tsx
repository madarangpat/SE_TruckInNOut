"use client";
import React from "react";
import axios from "axios";

interface Props {
  employeeUsername?: string;
  employee_type?: string;
  startDate: Date | null;
  endDate: Date | null;
}

const SalaryBreakdownPDF: React.FC<Props> = ({ employeeUsername, startDate, endDate, employee_type }) => {
  const handleDownload = async () => {
    if (!employeeUsername || !startDate || !endDate) {
      alert("Please select an employee and date range.");
      return;
    }

    try {
      const params = new URLSearchParams({
        employee: employeeUsername,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      });

      // Fetch all trips
      const response = await axios.get(`http://localhost:8000/api/employee-trip-salaries/?${params}`);
      const allTrips = response.data;

      // Filter only completed trips
      const completedTrips = allTrips.filter((record: any) => record.trip.is_in_progress === false);

      if (completedTrips.length === 0) {
        alert("Cannot generate PDF. No completed trips in the selected range.");
        return;
      }

      // 3. Download PDF
      const pdfResponse = await axios.get(
        `http://localhost:8000/api/generate-pdf/salary-breakdown/?${params}`,
        { responseType: "blob" }
      );

      const blob = new Blob([pdfResponse.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${employeeUsername}_salary_breakdown.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("An error occurred while generating the PDF.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-6 py-2 bg-[#668743] text-white text-sm rounded-lg hover:bg-[#345216] tracking-wide flex justify-center items-center gap-2"
    >
      Export Salary Breakdown PDF
    </button>
  );
};

export default SalaryBreakdownPDF;





