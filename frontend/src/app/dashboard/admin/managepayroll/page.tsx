// import React from "react";
// import PDFButton from "@/components/PDFButton"; // Ensure correct import path

// const ManagePayroll: React.FC = () => {
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Manage Payroll</h1>
//       <PDFButton />
//     </div>
//   );
// };

// export default ManagePayroll;


"use client";
import React, { useState } from "react";
import Image from "next/image";

const employees = ["Employee 1", "Employee 2", "Employee 3"];
const dateRanges = ["Last Week", "Last Month", "Last Year"];

const ManagePayroll = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="wrapper max-w-3xl w-full p-8 rounded-2xl shadow-lg bg-black/20">
        {/* Title */}
        <h1 className="text-center text-3xl font-semibold text-black/50 mb-6">
          MANAGE PAYROLL
        </h1>

        {/* View Gross Payroll Button */}
        <div className="flex justify-center mb-4">
          <button className="px-6 py-2 bg-green-700 text-white text-sm rounded-lg hover:bg-green-800">
            View Gross Payroll
          </button>
        </div>

        {/* Profile Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-gray-500">
            <Image
              src="/accountsblk.png"
              alt="Profile"
              width={70}
              height={70}
            />
          </div>
        </div>

        {/* Dropdown Buttons */}
        <div className="flex flex-col gap-4">
          {/* Select Employee Dropdown */}
          <div className="relative">
            <button
              onClick={() => setEmployeeDropdownOpen(!employeeDropdownOpen)}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg flex justify-between items-center hover:bg-gray-700"
            >
              {selectedEmployee || "Select Employee Name"}
              <span>▼</span>
            </button>
            {employeeDropdownOpen && (
              <div className="absolute w-full bg-gray-700 text-white mt-1 rounded-lg shadow-lg">
                {employees.map((employee, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setEmployeeDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800"
                  >
                    {employee}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Select Date Range Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg flex justify-between items-center hover:bg-gray-700"
            >
              {selectedDateRange || "Select Date Range"}
              <span>▼</span>
            </button>
            {dateDropdownOpen && (
              <div className="absolute w-full bg-gray-700 text-white mt-1 rounded-lg shadow-lg">
                {dateRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedDateRange(range);
                      setDateDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800"
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-4">
          <button className="w-full px-6 py-3 bg-green-700 text-white text-sm rounded-lg hover:bg-green-800">
            View Performance
          </button>
          <button className="w-full px-6 py-3 bg-green-700 text-white text-sm rounded-lg hover:bg-green-800">
            View Salary Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagePayroll;