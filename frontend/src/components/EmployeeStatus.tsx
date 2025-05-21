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
          method: "PATCH",
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
        await updateCompletedTrips(data); // Update completed trip counts after fetching employees
      } catch (error) {
        console.error("❌ Failed to fetch employee data:", error);
        toast.error("Failed to load employee data.");
      } finally {
        setLoading(false);
      }
    };

    const updateCompletedTrips = async (employees: Employee[]) => {
      try {
        // Fetch the confirmed trips
        const tripsRes = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/trips/`);
        const trips = await tripsRes.json();

        // Define the type for tripCounts, where keys are employee usernames and values are completed trip counts.
        const tripCounts: { [username: string]: number } = {};

        trips.forEach((trip: any) => {
          if (trip.trip_status === "Confirmed") {
            // Increment the trip count for the employee, helper, and helper2
            if (trip.employee?.user?.username) {
              tripCounts[trip.employee.user.username] = (tripCounts[trip.employee.user.username] || 0) + 1;
            }
            if (trip.helper?.username) {
              tripCounts[trip.helper.username] = (tripCounts[trip.helper.username] || 0) + 1;
            }
            if (trip.helper2?.username) {
              tripCounts[trip.helper2.username] = (tripCounts[trip.helper2.username] || 0) + 1;
            }
          }
        });

        // Update each employee's completed trip count
        const updatedEmployees = employees.map((emp) => {
          const completedTrips = tripCounts[emp.user.username] || 0; // Get the completed trip count for the employee
          return { ...emp, completed_trip_count: completedTrips };
        });

        setEmployees(updatedEmployees); // Update the state with new completed trip counts
      } catch (error) {
        console.error("❌ Error updating completed trips:", error);
        toast.error("Failed to update completed trips.");
      }
    };

    fetchEmployees();
  }, []); // Runs on mount

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
                {emp.user.username}
              </span>
              <span className="text-xs text-gray-300">
                {emp.user.employee_type}
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
