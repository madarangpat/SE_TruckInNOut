"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

interface Employee {
  employee_id: number;
  name: string;
  user: {
    username: string;
    employee_type: string;
  };
  completed_trip_count: number;
}

const EmployeeStatus = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isSaturday = new Date().getDay() === 6;

    const resetTripCountsIfSaturday = async () => {
      if (!isSaturday) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/employees/reset-completed-trips/`, {
          method: "POST",
        });

        const result = await res.json();
        toast.success(result.message || "Completed trip counts reset.");
      } catch (error) {
        console.error("❌ Failed to reset trip counts:", error);
        toast.error("Failed to reset trip counts.");
      }
    };

    const fetchEmployees = async () => {
      try {
        await resetTripCountsIfSaturday(); // Only runs on Saturday

        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/employees/`);
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error("❌ Failed to fetch employee data:", error);
        toast.error("Failed to load employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="wrapper rounded-2xl p-4 shadow-md w-full flex flex-col">
      <div className="flex justify-center items-center mx-3 gap-2 mb-4">
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
        {loading ? (
          <p className="text-white text-sm text-center">Loading employees...</p>
        ) : employees.length > 0 ? (
          employees.map((emp) => (
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
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-sm text-center">No employees found.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeStatus;
