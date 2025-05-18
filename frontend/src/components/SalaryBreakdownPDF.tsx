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
  // Fetch all trips only once when the component renders
  const params = new URLSearchParams({
    employee: employeeUsername || "",
    start_date: startDate?.toISOString().split("T")[0] || "",
    end_date: endDate?.toISOString().split("T")[0] || "",
  }).toString();

  const { data: tripData, error: tripError } = useQuery({
    queryKey: ["employee-trip-salaries", params],
    queryFn: async () => {
      const employeeTripSalaries = await getEmployeeTripSalaries(params);
      const completedTrips = employeeTripSalaries.filter(
        (record: EmployeeTripSalary) => record.trip.is_completed
      );
      return { completedTrips };
    },
  });

  const { data: pdfBlob, error: pdfError } = useQuery<Blob, Error>({
    queryKey: ["generate-salary-breakdown-pdf", params],
    queryFn: async () => await generateSalaryBreakdownPdf(params),
    enabled: !!tripData?.completedTrips.length,  // Only run if there are completed trips
  });

  const handleDownload = () => {
    if (!employeeUsername || !startDate || !endDate) {
      alert("Please select an employee and date range.");
      return;
    }

    if (tripError || pdfError) {
      toast.error("An error occurred while generating the data.");
      return;
    }

    if (tripData?.completedTrips.length === 0) {
      toast.error("Cannot generate PDF. No completed trips in the selected range.");
      return;
    }

    if (!pdfBlob) {
      toast.error("No PDF data received");
      return;
    }

    const blob = new Blob([pdfBlob], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${employeeUsername}_salary_breakdown.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
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
