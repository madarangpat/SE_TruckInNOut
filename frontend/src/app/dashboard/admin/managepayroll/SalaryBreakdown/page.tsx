"use client";
import React, { useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
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

const SalaryBreakdown = () => {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
 
  //Individual Payroll
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [tripSalaries, setTripSalaries] = useState<any[]>([]);


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
        </div>
       
        {/* Buttons */}
        <div className="mt-1 flex w-auto items-center justify-center flex-col gap-2">
            <SalaryBreakdownPDF
              employeeUsername={selectedEmployee?.user.username}
              startDate={startDate}
              endDate={endDate}
            />
            {tripSalaries.length > 0 && (
              <div className="mt-4 w-full">
                <h2 className="text-lg font-semibold mb-2 text-white">Trip & Salary Breakdown</h2>
                {tripSalaries.map((item, idx) => (
                  <div key={idx} className="bg-white text-black p-4 mb-4 rounded-lg shadow">
                    <h3 className="font-bold">Trip ID: {item.trip.id}</h3>
                    <p><strong>Destination:</strong> {item.trip.destination}</p>
                    <p><strong>End Date:</strong> {new Date(item.trip.end_date).toLocaleDateString()}</p>

                    {item.salary ? (
                      <>
                        <p><strong>Base Salary:</strong> {item.salary.base_salary}</p>
                        <p><strong>Bonuses:</strong> {item.salary.bonuses}</p>
                        <p><strong>Cash Advance:</strong> {item.salary.cash_advance}</p>
                        {/* Add other fields as needed */}
                      </>
                    ) : (
                      <p className="text-red-500">No salary record found for this trip.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SalaryBreakdown;
