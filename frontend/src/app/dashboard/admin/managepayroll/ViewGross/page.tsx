"use client";
import React, { useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GrossPayrollPDF from "@/components/GrossPayrollPDF"; // update the path if needed
import Image from "next/image";

interface User {
  username: string;  
}

interface Employee {
  employee_id: number;
  user: User;
  employee_type: string;
  profile_image: string;
}

const ViewGross = () => {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
 
  //Individual Payroll
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // For Gross Payroll
  const [grossStartDate, setGrossStartDate] = useState<Date | null>(null);
  const [grossEndDate, setGrossEndDate] = useState<Date | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [tripSalaries, setTripSalaries] = useState<any[]>([]);

  const [showIndividual, setShowIndividual] = useState(true);
  const [showGross, setShowGross] = useState(false);

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
          GROSS PAYROLL
        </h1>

        {/* Dropdown Buttons */}
        <div className="flex flex-col gap-4">          
          {/* Start and End Date Pickers Side by Side */}
          <div className="flex gap-4 mb-4">
            {/* Start Date */}
            <div className="w-1/2">
              <label className="block text-sm text-black mb-1 font-bold">Start Date</label>
              <DatePicker
                selected={grossStartDate}
                onChange={(date) => setGrossStartDate(date)}
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
                selected={grossEndDate}
                onChange={(date) => setGrossEndDate(date)}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select end date"
                minDate={startDate || undefined}
                className="w-full px-4 py-2 rounded-md shadow-md text-black cursor-pointer bg-white"
                calendarClassName="rounded-lg"
              />
            </div>
            <button
              onClick={() => {
                setGrossStartDate(null);
                setGrossEndDate(null);
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
            <GrossPayrollPDF />
        </div>
      </div>
    </div>
  );
};

export default ViewGross;
