"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Employee {
  id: number;
  name: string;
  base_salary: number;
}

const PriorityQueue = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/priority-queue/`);
        if (!res.ok) throw new Error("Failed to fetch priority queue");

        const data = await res.json();
        
        // Sort by base salary ascending
        const sorted = data.sort(
          (a: Employee, b: Employee) => (a.base_salary || 0) - (b.base_salary || 0)
        );

        setEmployees(sorted);
      } catch (error) {
        console.error("Error fetching priority queue:", error);
        toast.error("Failed to load priority queue.");
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="wrapper rounded-2xl p-4 flex-1 shadow-md h-full w-full flex flex-col">
      <div className="flex justify-center items-center mx-3 gap-2">
        <h1 className="capitalize text-2xl font-medium text-black/40">
          Priority Queue
        </h1>
        <Image
          src="/prioqueue.png"
          alt="Queue"
          width={30}
          height={30}
          className="opacity-40"
        />
      </div>
      <div className="flex-1 overflow-auto bg-black/40 rounded-lg p-3">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="flex justify-between items-center p-2 border-b border-gray-600 text-white"
          >
            <span>{employee.name}</span>
            <span className="text-xs bg-black/25 text-white px-2 py-1 rounded-lg">
              ₱ {employee.base_salary?.toFixed(2) || "0.00"} BASE SALARY
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityQueue;
