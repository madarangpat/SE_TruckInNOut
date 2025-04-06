"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const EmployeeStatus = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/employees/");
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employee data:", error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="wrapper rounded-2xl p-4 shadow-md w-full flex flex-col">
      <div className="flex justify-center items-center mx-3 gap-2">
        <h1 className="capitalize text-2xl font-medium text-black/40">
          Employee Status
        </h1>
        <Image
          src="/empicon.png"
          alt="Status"
          width={30}
          height={30}
          className="opacity-40"
        />
      </div>

      <div className="flex-1 overflow-auto bg-black/40 rounded-lg p-3">
        {employees.length > 0 ? (
          employees.map((emp: any) => (
            <div
              key={emp.employee_id}
              className="p-2 border-b border-gray-600 text-white"
            >
              <span className="block font-semibold">
                {emp.name} ({emp.user.username})
              </span>
              <span className="text-xs italic text-gray-300">
                Type: {emp.user.employee_type}
              </span>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs bg-black/25 text-white px-2 py-1 rounded-lg">
                  Completed Trips: {emp.completed_trip_count}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-lg ${
                    emp.payment_status ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  Payment Status: {emp.payment_status ? "PAID" : "UNPAID"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-sm text-center">Loading employees...</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeStatus;
