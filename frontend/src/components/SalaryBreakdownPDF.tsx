"use client";
import { getEmployeeTripSalaries } from "@/lib/actions/employee.actions";
import { generateSalaryBreakdownPdf } from "@/lib/actions/pdf.actions";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

interface Props {
  employeeUsername?: string;
  employee_type?: string;
  startDate: Date | null;
  endDate: Date | null;
}

const SalaryBreakdownPDF: React.FC<Props> = ({
  employeeUsername,
  startDate,
  endDate,
  employee_type,
}) => {
  const handleDownload = async () => {
    if (!employeeUsername || !startDate || !endDate) {
      alert("Please select an employee and date range.");
      return;
    }

    try {
      const params = new URLSearchParams({
        employee: employeeUsername,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
      }).toString();

      // Fetch all trips
      const { data } = useQuery({
        queryKey: ["employee-trip-salaries"],
        queryFn: async () => {
          const employeeTripSalaries = await getEmployeeTripSalaries(params);
          const completedTrips = employeeTripSalaries.filter(
            (record: EmployeeTripSalary) => record.trip.is_completed,
          );
          return { completedTrips };
        },
      });

      // Filter only completed trips

      if (data?.completedTrips.length === 0) {
        toast.error(
          "Cannot generate PDF. No completed trips in the selected range.",
        );
        return;
      }

      // 3. Download PDF
      const { data: pdfBlob } = useQuery<Blob, Error>({
        queryKey: ["generate-salary-breakdown-pdf", params],
        queryFn: async () => await generateSalaryBreakdownPdf(params),
      });

      if (!pdfBlob) {
        toast.error("No PDF data received");
      }

      const blob = new Blob([pdfBlob!], { type: "application/pdf" });
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
