"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";

interface Employee {
  id: number;
  name: string;
  employee_type: string;
}

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/employees/`);

        const formattedEmployees = response.data.map((emp: any) => ({
          id: emp.employee_id,
          name: `${emp.user?.first_name || ""} ${emp.user?.last_name || ""} (${emp.user?.employee_type || "N/A"})`,
          employee_type: emp.user?.employee_type || "N/A",
        }));

        setEmployees(formattedEmployees);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees.");
        toast.error("Failed to load employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="wrapper rounded-2xl p-4 flex-1 shadow-md h-full w-full max-w-full md:max-w-lg lg:max-w-full flex flex-col">
      <div className="flex justify-center items-center mx-3 gap-2 mb-4">
        <h1 className="capitalize text-xl md:text-2xl font-medium text-black/40">
          Employee List
        </h1>
        <Image
          src="/empicon.png"
          alt="Employee List"
          width={30}
          height={30}
          className="opacity-40"
        />
      </div>

      <div className="flex-1 overflow-y-auto max-h-[680px] border rounded-lg p-2 bg-black/40 border-black/40 text-white w-full">
        {loading ? (
          <div className="flex justify-center items-center h-full text-gray-300">
            Loading...
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full text-red-400">
            {error}
          </div>
        ) : employees.length > 0 ? (
          employees.map((employee) => (
            <div
              key={employee.id}
              className="flex justify-start items-center p-2 border-b border-gray-600 text-sm md:text-base w-full"
            >
              <div className="flex flex-col w-full">
                <span className="text-sm md:text-lg">{employee.name.split(" (")[0]}</span>
                <span className="text-xs text-white/70 text-left">
                  {employee.name.split(" (")[1]?.replace(")", "") || "No Type"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full text-gray-300">
            No Employees Available
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
