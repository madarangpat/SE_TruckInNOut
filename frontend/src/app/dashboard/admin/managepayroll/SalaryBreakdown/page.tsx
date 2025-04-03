"use client";
import axios from "axios";
import React, { useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import SalaryBreakdownPDF from "@/components/SalaryBreakdownPDF";

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
 
  //Individual Payroll
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [tripSalaries, setTripSalaries] = useState<any[]>([]);

  // Add these at the top, alongside your other useState hooks
  const [bale, setBale] = useState("");
  const [bonuses, setBonuses] = useState("");
  const [cashAdvance, setCashAdvance] = useState("");
  const [cashBond, setCashBond] = useState("");
  const [charges, setCharges] = useState("");
  const [others, setOthers] = useState("");



  // Handle Employee Selection
  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEmployeeDropdownOpen(false);
  };

  useEffect(() => {
    if (selectedEmployee && startDate && endDate) {
      const query = new URLSearchParams({
        employee: selectedEmployee.user.username,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      });
  
      fetch(`http://localhost:8000/api/employee-trip-salaries/?${query}`)
        .then(res => res.json())
        .then(data => {
          setTripSalaries(data);
        })
        .catch(err => console.error("Failed to fetch trip-salary data:", err));
    }
  }, [selectedEmployee, startDate, endDate]);

  useEffect(() => {   
    // Fetch employees from Django API
    fetch("http://localhost:8000/api/employees/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched employees:", data);
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          console.error("API response is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching employees:", error));
    }, []);

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
          INDIVIDUAL PAYROLL
        </h1>

        {/* Dropdown Buttons */}
        <div className="flex flex-col gap-4">
          {/* Select Employee Dropdown */}
          <div className="relative">
            <button
              onClick={() => setEmployeeDropdownOpen(!employeeDropdownOpen)}
              className="innerwrapper w-full px-4 sm:px-6 py-2 sm:py-3 bg-[#668743] backdrop-blur-md text-white rounded-lg flex justify-between items-center hover:bg-black/40 shadow-md uppercase tracking-widest text-xs sm:text-sm"
            >
              {selectedEmployee 
                ? selectedEmployee.user.username
                : "Select Employee Name"}
              <span>▼</span>
            </button>
            {employeeDropdownOpen && (
              <div className="dropwrapper absolute w-full text-black mt-1 rounded-lg shadow-lg bg-white z-10 max-h-48 sm:max-h-60 overflow-y-auto">
                {employees.length === 0 ? (
                  <div className="w-full text-center px-4 py-2 text-sm">
                    No available employees
                  </div>
                ) : (
                  employees.map((emp) => (
                    <button
                      key={emp.employee_id}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setEmployeeDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-black/40 uppercase tracking-widest text-sm"
                    >
                      {emp.user.username}
                    </button>
                ))
              )}
              </div>
            )}
          </div>

          {/* Start and End Date Pickers Side by Side */}
          <div className="flex gap-4 mb-4">
            {/* Start Date */}
            <div className="w-1/2">
              <label className="block text-sm text-black mb-1 font-bold">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select start date"
                className="w-full px-4 py-2 rounded-md shadow-md text-black cursor-pointer bg-white"
                calendarClassName="rounded-lg"
                popperClassName="z-50"
              />
            </div>

            {/* End Date */}
            <div className="w-1/2">
              <label className="block text-sm text-black mb-1 font-bold">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select end date"
                minDate={startDate || undefined}
                className="w-full px-4 py-2 rounded-md shadow-md text-black cursor-pointer bg-white"
                calendarClassName="rounded-lg"
                popperClassName="z-50"
              />
            </div>
            <button
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
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

          {/* Deduction Inputs */}
          <div className="mt-1">
            <h2 className="text-lg font-semibold text-black/70 mb-4">Update Deductions</h2>

            {/* Input Fields with Labels */}
            <div className="space-y-3">
              {[
                { label: "Bonuses", value: bonuses, setter: setBonuses, name: "bonuses" },
                { label: "Bale", value: bale, setter: setBale, name: "bale" },
                { label: "Cash Advance", value: cashAdvance, setter: setCashAdvance, name: "cashAdvance" },
                { label: "Cash Bond", value: cashBond, setter: setCashBond, name: "cashBond" },
                { label: "Charges", value: charges, setter: setCharges, name: "charges" },
                { label: "Others", value: others, setter: setOthers, name: "others" },
              ].map(({ label, value, setter, name }) => (
                <div key={name} className="flex items-center gap-4">
                  <label className="w-36 text-sm font-semibold text-black">{label}:</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={label}
                    className="flex-1 px-4 py-2 rounded-md text-black bg-white shadow"
                  />
                </div>
              ))}
            </div>

            {/* Set Button */}
            <button
              onClick={async () => {
                if (!selectedEmployee || !startDate || !endDate) {
                  alert("Please select employee and date range");
                  return;
                }

                try {
                  await axios.post("http://localhost:8000/api/update-salary-deductions/", {
                    username: selectedEmployee.user.username,
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    bale,
                    bonuses,
                    cash_advance: cashAdvance,
                    cash_bond: cashBond,
                    charges,
                    others,
                  });
                  alert("Deductions saved successfully!");
                } catch (err) {
                  console.error("Failed to update deductions:", err);
                  alert("Something went wrong while saving deductions.");
                }
              }}
              className="mt-4 bg-[#668743] hover:bg-[#345216] text-white py-2 px-4 rounded-lg shadow"
            >
              Set
            </button>
          </div>
 

        </div>
       
        {/* Buttons */}
        <div className="mt-1 flex w-auto items-center justify-center flex-col gap-2">
        <SalaryBreakdownPDF
          employeeUsername={selectedEmployee?.user.username}
          startDate={startDate}
          endDate={endDate}
          employee_type={selectedEmployee?.user.employee_type} // ✅ corrected
        />
        </div>
      </div>
    </div>
  );
};

export default SalaryBreakdown;
