"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ManagePayroll = ({ users }: { users: User[] }) => {
  const router = useRouter();
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [selectedEmployeeImage, setSelectedEmployeeImage] =
    useState("/accountsblk.png"); // Default image
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [employeeDropDownOpen, setEmployeeDropDownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [employees, setEmployees] = useState<{ name: string; image: string }[]>(
    []
  );

  // Generate Date Ranges Dynamically
  const generateDateRanges = () => {
    const currentYear = new Date().getFullYear();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let dateRanges: string[] = [];

    months.forEach((month) => {
      for (let week = 1; week <= 4; week++) {
        dateRanges.push(`${month} (${currentYear}), Week ${week}`);
      }
    });

    return dateRanges;
  };

  // Handle Employee Selection
  const handleEmployeeSelect = (user: User) => {
    setSelectedEmployee(user);
    setSelectedEmployeeImage(user.profile_image ?? "/accountsblk.png");
    setEmployeeDropDownOpen(false);
  };

  // Function to Handle Navigation
  const handleNavigation = (path: string, requiresSelection = true) => {
    if (requiresSelection && (!selectedEmployee || !selectedDateRange)) {
      alert("Please select an Employee and a Date Range before proceeding.");
      return;
    }

    // If selection is required, include query parameters
    const url = requiresSelection
      ? `${path}?employee=${selectedEmployee}&date=${selectedDateRange}`
      : path;

    router.push(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="wrapper w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-6 sm:p-8 rounded-2xl shadow-lg bg-black/20">
        {/* Title */}
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-black/50 mb-4 tracking-[0.1em]">
          MANAGE PAYROLL
        </h1>

        {/* View Gross Payroll Button (Works Without Selections) */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() =>
              handleNavigation(
                "/dashboard/admin/managepayroll/ViewGross",
                false
              )
            }
            className="px-4 sm:px-6 py-2 bg-[#668743] text-white text-xs sm:text-sm rounded-lg hover:bg-[#345216] tracking-wide"
          >
            View Gross Payroll
          </button>
        </div>

        {/* Profile Image (Now Updates Correctly) */}
        <div className="flex justify-center mb-6">
          <div className="w-24 sm:w-28 h-24 sm:h-28 bg-white rounded-full flex items-center justify-center border border-gray-300 shadow-lg relative overflow-hidden">
            <Image
              src={selectedEmployeeImage}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full object-cover"
              unoptimized
            />
          </div>
        </div>

        {/* Dropdown Buttons */}
        <div className="flex flex-col gap-4">
          {/* Select Employee Dropdown */}
          <div className="relative">
            <button
              onClick={() => setEmployeeDropDownOpen(!employeeDropDownOpen)}
              className="innerwrapper w-full px-4 sm:px-6 py-2 sm:py-3 bg-zinc-700/50 backdrop-blur-md text-white rounded-lg flex justify-between items-center hover:bg-black/40 shadow-md uppercase tracking-widest text-xs sm:text-sm"
            >
              {selectedEmployee ? selectedEmployee.username: "Select Employee Name"}
              <span>▼</span>
            </button>

            {employeeDropDownOpen && (
              <div className="dropwrapper absolute w-full text-white mt-1 rounded-lg shadow-lg backdrop-blur-[10px] z-10 max-h-48 sm:max-h-60 overflow-y-auto">
                {users
                    .filter(user => user.role === "employee") 
                    .map((user) => (
                    <button
                        key={user.username}
                        onClick={() => handleEmployeeSelect(user)}
                        className="w-full text-left px-4 py-2 hover:bg-black/40 uppercase tracking-widest text-xs sm:text-sm"
                    >
                        {user.username} ({user.role})
                    </button>
                ))}
              </div>
            )}
          </div>

          {/* Select Date Range Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="innerwrapper w-full px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white rounded-lg flex justify-between items-center hover:bg-black/40 shadow-md uppercase tracking-widest text-xs sm:text-sm"
            >
              {selectedDateRange || "Select Date Range"}
              <span>▼</span>
            </button>
            {dateDropdownOpen && (
              <div className="dropwrapper absolute w-full bg-gray-600 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 sm:max-h-60 overflow-y-auto backdrop-blur-[10px]">
                {generateDateRanges().map((range, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedDateRange(range);
                      setDateDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-black/40 uppercase tracking-widest text-xs sm:text-sm"
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
          <button
            onClick={() =>
              handleNavigation("/dashboard/admin/managepayroll/ViewPerformance")
            }
            className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-[#668743] text-white text-xs sm:text-sm rounded-lg hover:bg-[#345216] tracking-wide"
          >
            View Performance
          </button>
          <button
            onClick={() =>
              handleNavigation("/dashboard/admin/managepayroll/SalaryBreakdown")
            }
            className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-[#668743] text-white text-xs sm:text-sm rounded-lg hover:bg-[#345216] tracking-wide"
          >
            View Salary Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagePayroll;
