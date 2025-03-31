// import React from "react";
// import ManagePayrollClient from "./ManagePayrollClient";
// import { getSession } from "@/lib/auth";
// import { getUsers } from "@/lib/actions/user.actions";

// export default async function ManagePayroll() {
//   const users = await getUsers();

//   return <ManagePayrollClient users={users} />;
// }



// import React from "react";
// import ManagePayrollClient from "./ManagePayrollClient";
// import { getSession } from "@/lib/auth";
// import { getUsers } from "@/lib/actions/user.actions";

// export default async function ManagePayroll() {
//   try {
//     const session = await getSession();
//     const users = await getUsers();

//     if (!session) {
//       // Handle unauthenticated access
//       return <div>You need to be logged in to view this page.</div>;
//     }

//     return <ManagePayrollClient users={users} />;
//   } catch (error) {
//     console.error("Error fetching users or session", error);
//     return <div>Error loading data. Please try again later.</div>;
//   }
// }



"use client";
import React, { useEffect, useState} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GrossPayrollPDF from "@/components/GrossPayrollPDF"; // update the path if needed
import SalaryBreakdownPDF from "@/components/SalaryBreakdownPDF";

interface User {
  username: string;  
}

interface Employee {
  employee_id: number;
  user: User;
  employee_type: string;
  profile_image: string;
}

const ManagePayroll = () => {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
 
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle Employee Selection
  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEmployeeDropdownOpen(false);
  };

  const handleNavigation = (path: string, requiresSelection = true) => {
    if (requiresSelection && (!selectedEmployee || !startDate || !endDate)) {
      alert("Please select an Employee and both Start and End Dates before proceeding.");
      return;
    }

    const url = requiresSelection
      ? `${path}?employee=${selectedEmployee?.user.username}&start_date=${startDate?.toISOString()}&end_date=${endDate?.toISOString()}`
      : path;

    router.push(url);
  };

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
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="wrapper w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-6 sm:p-8 rounded-2xl shadow-lg bg-black/20">
        {/* Title */}
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-black/50 mb-4 tracking-[0.1em]">
          PAYROLL
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
              />
            </div>
          </div>          
        </div>

        {/* Buttons */}
        <div className="mt-1 flex w-auto items-center justify-center flex-col gap-2">
            <GrossPayrollPDF />
            <SalaryBreakdownPDF />
        </div>
      </div>
    </div>
  );
};

export default ManagePayroll;
