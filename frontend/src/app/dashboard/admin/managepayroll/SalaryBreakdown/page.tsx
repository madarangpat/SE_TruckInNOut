"use client";
import { toast } from "sonner";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import PreviewReportSB from "@/components/PreviewReportSB";


interface User {
  username: string;
  employee_type: string;
}

interface Employee {
  employee_id: number;
  user: User;
  profile_image: string;
}

const SalaryBreakdown = () => {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [tripSalaries, setTripSalaries] = useState<any[]>([]);

  const [bale, setBale] = useState("");
  const [cashAdvance, setCashAdvance] = useState("");
  const [cashBond, setCashBond] = useState("");
  const [charges, setCharges] = useState("");
  const [others, setOthers] = useState("");
  const [othersDescription, setOthersDescription] = useState("");
  const [completedTripsSet, setCompletedTripsSet] = useState(false);
  const [deductionsSet, setDeductionsSet] = useState(false);
  const [salaryConfigSet, setSalaryConfigSet] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const adjustForTimezone = (date: Date) => {
    const offset = date.getTimezoneOffset(); // Returns the difference in minutes
    date.setMinutes(date.getMinutes() - offset); // Adjust for the time zone offset
    return date.toISOString().split('T')[0]; // Return only the date part in YYYY-MM-DD format
  };

  const [salaryData, setSalaryData] = useState<any>({
    id: 0,
    sss_contribution: "",
    philhealth_contribution: "",
    pagibig_contribution: "",
    pagibig_loan: "",
    sss_loan: "",
  });

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEmployeeDropdownOpen(false);
  };

  const handleNumericInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight",
    ];
    if (allowedKeys.includes(e.key)) return;
  
    if (e.key === "." && !e.currentTarget.value.includes(".")) return;
  
    if (!/^[0-9.]$/.test(e.key)) {
      e.preventDefault();
    }
  };
  
  const salaryPlaceholders: Record<string, string> = {
    sss_contribution: "SSS Contribution",
    philhealth_contribution: "PhilHealth Contribution",
    pagibig_contribution: "Pag-IBIG Contribution",
    pagibig_loan: "Pag-IBIG Loan",
    sss_loan: "SSS Loan",
  };

  const handleClearAll = () => {
    setSelectedEmployee(null);
    setStartDate(null);
    setEndDate(null);
    setTripSalaries([]);
    setBale("");
    setCashAdvance("");
    setCashBond("");
    setCharges("");
    setOthers("");
    setOthers("");
    setOthersDescription("");
    setSalaryConfigSet(false);
    setCompletedTripsSet(false);
    setDeductionsSet(false);
    setSalaryData({
      id: 0,
      sss_contribution: "",
      philhealth_contribution: "",
      pagibig_contribution: "",
      pagibig_loan: "",
      sss_loan: "",
    });
  };  
  
  useEffect(() => {
    if (selectedEmployee && startDate && endDate) {
      const startDateOnly = adjustForTimezone(startDate).split('T')[0]; // Adjusted start date
      const endDateOnly = adjustForTimezone(endDate).split('T')[0]; // Adjusted end date


      const query = new URLSearchParams({
        employee: selectedEmployee.user.username,
        start_date: startDateOnly,
        end_date: endDateOnly,
      });

      fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/employee-trip-salaries/?${query}`)
        .then((res) => res.json())
        .then((data) => {
          setTripSalaries(data);
        })
        .catch((err) => console.error("Failed to fetch trip-salary data:", err));
    }
  }, [selectedEmployee, startDate, endDate]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/employees/`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          console.error("API response is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  // Fetch Salary data for the selected employee and date range
  useEffect(() => {
    if (selectedEmployee && startDate && endDate) {
      const query = new URLSearchParams({
        employee: selectedEmployee.user.username,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      });
    }
  }, [selectedEmployee, startDate, endDate]);


  const handleApplySalaryConfigToTrips = async () => {
    if (!selectedEmployee || !startDate || !endDate || !completedTripsSet) {
      toast.warning("Please complete all required fields and click 'Set Completed Trips' first.");
      return;
    }

    const startDateOnly = adjustForTimezone(startDate).split('T')[0]; // Adjusted start date
    const endDateOnly = adjustForTimezone(endDate).split('T')[0]; // Adjusted end date

    console.log("Sending Dates:", { startDateOnly, endDateOnly });
  
    try {
      // Use the same method as deductions to update the salary configurations
      await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/update-salaries/`, {
        username: selectedEmployee.user.username,
        start_date: startDateOnly,
        end_date: endDateOnly,
        sss_contribution: parseFloat(salaryData.sss_contribution) || 0,
        philhealth_contribution: parseFloat(salaryData.philhealth_contribution) || 0,
        pagibig_contribution: parseFloat(salaryData.pagibig_contribution) || 0,
        pagibig_loan: parseFloat(salaryData.pagibig_loan) || 0,
        sss_loan: parseFloat(salaryData.sss_loan) || 0,
      });
  
      toast.success("Salary configuration applied to each completed trip!");
      setSalaryConfigSet(true);
    } catch (err) {
      console.error("Failed to update salary configuration:", err);
      toast.error("Something went wrong while saving salary config.");
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-8">
      <div className="wrapper w-full max-w-6xl p-6 sm:p-8 rounded-2xl shadow-lg bg-black/20">
        <div className="self-start mb-4">
          <button
            onClick={() => router.push("/dashboard/admin/managepayroll")}
            className="rounded-lg transition hover:opacity-80"
          >
            <Image src="/Back.png" alt="Back to Manage Payroll" width={30} height={30} />
          </button>
        </div>

        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-black/50 mb-4 tracking-[0.1em]">
          INDIVIDUAL PAYROLL
        </h1>

        {/* Employee Selector + Date Pickers */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <button
              onClick={() => setEmployeeDropdownOpen(!employeeDropdownOpen)}
              className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-[#668743] backdrop-blur-md text-white rounded-lg flex justify-between items-center hover:bg-black/40 shadow-md uppercase tracking-widest text-xs sm:text-sm"
            >
              {selectedEmployee ? selectedEmployee.user.username : "Select Employee Name"}
              <span>▼</span>
            </button>
            {employeeDropdownOpen && (
              <div className="absolute w-full text-black mt-1 rounded-lg shadow-lg bg-white z-10 max-h-48 sm:max-h-60 overflow-y-auto">
                {employees.length === 0 ? (
                  <div className="w-full text-center px-4 py-2 text-sm">No available employees</div>
                ) : (
                  employees.map((emp) => (
                    <button
                      key={emp.employee_id}
                      onClick={() => handleEmployeeSelect(emp)}
                      className="w-full text-left px-4 py-2 hover:bg-black/40 uppercase tracking-widest text-sm"
                    >
                      {emp.user.username}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4 mb-4 items-end">
            <div className="w-1/2">
              <label className="block text-sm text-black mb-1 font-bold">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select start date"
                className="w-full px-4 py-2 rounded-md shadow-md text-black cursor-pointer bg-white"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm text-black mb-1 font-bold">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select end date"
                minDate={startDate || undefined}
                className="w-full px-4 py-2 rounded-md shadow-md text-black cursor-pointer bg-white"
              />
            </div>

            <button onClick={() => { setStartDate(null); setEndDate(null); }}>
              <Image src="/Trash.png" alt="Clear Dates" width={30} height={30} />
            </button>
          </div>
          <button
            onClick={async () => {
              if (!selectedEmployee || !startDate || !endDate) {
                toast.warning("Please select an employee and date range.");
                return;
              }

              try {
                const query = new URLSearchParams({
                  employee: selectedEmployee.user.username,
                  start_date: startDate.toISOString(),
                  end_date: endDate.toISOString(),
                });

                const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/completed-trips/?${query}`);
                if (!res.ok) throw new Error("Failed to fetch completed trips.");

                const data = await res.json();
                console.log("Completed Trips:", data);

                if (data.length === 0) {
                  toast.warning("No completed trips found.");
                  setCompletedTripsSet(false);
                } else {
                  toast.success(`Found ${data.length} completed trip(s). Ready to apply deductions.`);
                  setCompletedTripsSet(true);
                }

              } catch (err) {
                console.error(err);
                alert("Error while fetching completed trips.");
              }
            }}
            disabled={!selectedEmployee || !startDate || !endDate}
            className={`py-2 px-4 rounded-lg shadow text-white ${
              !selectedEmployee || !startDate || !endDate
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#668743] hover:bg-[#345216]"
            }`}
          >
            Set Completed Trips
          </button>
        </div>

        {/* Main Side-by-Side Section */}
        <div className="flex flex-col lg:flex-row gap-6 w-full mt-4">
          {/* Deductions - Left */}
          <div className="w-full lg:w-1/2 p-4 rounded-lg shadow-md text-white" style={{ backgroundColor: "rgba(168, 206, 130, 0.4)" }}>
            <h2 className="text-lg font-semibolWd text-black/70 mb-4">Deductions</h2>
            <div className="space-y-3">
              {[
                { label: "Bale", value: bale, setter: setBale },
                { label: "Cash Advance", value: cashAdvance, setter: setCashAdvance },
                { label: "Cash Bond", value: cashBond, setter: setCashBond },
                { label: "Charges", value: charges, setter: setCharges },
                { label: "Others", value: others, setter: setOthers },
              ].map(({ label, value, setter }) => (
                <div key={label} className="flex items-center gap-4">
                  <label className="w-36 text-sm font-semibold text-black">{label}:</label>
                  <input
                    type="text"
                    step="0.01"
                    min="0"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    onKeyDown={handleNumericInputKeyDown}
                    placeholder={label}
                    className="flex-1 px-4 py-2 rounded-md text-black bg-white shadow"
                  />
                </div>
              ))}
              {/* Show others description input when 'others' is filled */}
              {others && (
                <div className="flex items-center gap-4">
                  <label className="w-36 text-sm font-semibold text-black">Others Description:</label>
                  <input
                    type="text"
                    value={othersDescription}
                    onChange={(e) => setOthersDescription(e.target.value)}
                    placeholder="Enter description"
                    className="flex-1 px-4 py-2 rounded-md text-black bg-white shadow"
                  />
                </div>
              )}
            </div>

            <button
              onClick={async () => {
                if (!selectedEmployee || !startDate || !endDate || !completedTripsSet) {
                  toast.warning("Please complete all required fields and click 'Set Completed Trips' first.");
                  return;
                }

                try {
                  await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/distribute-deductions/`, {
                    username: selectedEmployee.user.username,
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    bale: parseFloat(bale) || 0,
                    cash_advance: parseFloat(cashAdvance) || 0,
                    cash_bond: parseFloat(cashBond) || 0,
                    charges: parseFloat(charges) || 0,
                    others: parseFloat(others) || 0,
                    others_description: othersDescription,
                  });

                  toast.success("Deductions distributed and saved!");
                  setDeductionsSet(true);
                } catch (err) {
                  console.error("Failed to update deductions:", err);
                  toast.warning("❌ Something went wrong while distributing deductions.");
                }
              }}
              disabled={!selectedEmployee || !startDate || !endDate || !completedTripsSet}
              className={`mt-4 py-2 px-4 rounded-lg shadow text-white ${
                !selectedEmployee || !startDate || !endDate || !completedTripsSet
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#668743] hover:bg-[#345216]"
              }`}
            >
              Set
            </button>

          </div>

          {/* Salary Config - Right */}
          <div className="w-full lg:w-1/2 p-4 rounded-lg shadow-md text-white" style={{ backgroundColor: "rgba(168, 206, 130, 0.4)" }}>
            <h2 className="text-lg font-semibold text-black/70 mb-4">Salary Configuration</h2>
            <div className="space-y-3">
              {Object.entries(salaryData).map(([key, value]) => {
                if (key === "id") return null;
                const label = salaryPlaceholders[key] || key;

                return (
                  <div key={key} className="flex items-center gap-4">
                    <label className="w-36 text-sm font-semibold text-black">{label}</label>
                    <input
                      type="text"
                      step="0.01"
                      value={value as number}
                      onChange={(e) =>
                        setSalaryData((prev: any) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      onKeyDown={handleNumericInputKeyDown}
                      placeholder={label}
                      className="flex-1 px-4 py-2 rounded-md text-black bg-white shadow"
                    />
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleApplySalaryConfigToTrips}
              disabled={
                !selectedEmployee ||
                !startDate ||
                !endDate ||
                !completedTripsSet ||
                !deductionsSet
              }
              className={`mt-4 py-2 px-4 rounded-lg shadow ${
                !selectedEmployee || !startDate || !endDate || !completedTripsSet
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[#668743] hover:bg-[#345216] text-white"
              }`}
            >
              Set
            </button>
          </div>
        </div>

        {/* PDF Export Section */}
        <button
            onClick={handleClearAll}
            className="mt-3 justify-start bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow"
          >
            Clear All
        </button>
        <div className="mt-2 flex w-auto items-center justify-center flex-col gap-2">         
          <button
            onClick={() => {
              if (!selectedEmployee || !startDate || !endDate || !salaryConfigSet) {
                alert("Please select an employee and date range to preview the report.");
                return;
              }
              setShowPreviewModal(true);
            }}
            disabled={!selectedEmployee || !startDate || !endDate || !salaryConfigSet}
            className={`mt-1 py-2 px-4 rounded-lg shadow ${
              !selectedEmployee || !startDate || !endDate || !salaryConfigSet
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-[#668743] hover:bg-[#345216] text-white"
            }`}
          >
            Preview Salary Breakdown
          </button>
          {showPreviewModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-xl"
                >
                  &times;
                </button>
                <h2 className="text-lg font-semibold mb-4">Salary Breakdown Preview</h2>
                <PreviewReportSB
                  employee={selectedEmployee?.user.username || ""}
                  start={startDate ? startDate.toISOString().split('T')[0] : ""}
                  end={endDate ? endDate.toISOString().split('T')[0] : ""}
                  onClose={() => setShowPreviewModal(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryBreakdown;
