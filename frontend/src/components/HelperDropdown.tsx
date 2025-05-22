import React, { useState, useEffect } from "react";
import axios from "axios";
import { Employee } from "@/types";

interface HelperDropdownProps {
  onSelect: (result: {
    employee: Employee | null; // Selected employee or null if none selected
  }) => void;
}

const HelperDropdown: React.FC<HelperDropdownProps> = ({ onSelect }) => {
  const [employees, setEmployees] = useState<Employee[]>([]); // Using Employee[] type for the state
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);

  // Fetch employees and filter only helpers
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_DOMAIN}/priority-queue/`,
        );
        const data: Employee[] = response.data; // The response is typed as Employee[]

        // Filter employees with employee_type "Driver"
        const filteredEmployees = data.filter(
          (emp) => emp.user.employee_type === "Helper",
        );
        const sortedEmployees = filteredEmployees.sort(
          (a, b) => a.base_salary - b.base_salary,
        );

        setEmployees(sortedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Notify parent component when selection changes
  useEffect(() => {
    onSelect({ employee: selectedEmployee });
  }, [selectedEmployee, onSelect]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setEmployeeDropdownOpen(!employeeDropdownOpen)}
        className="w-full px-4 py-3 bg-zinc-700/40 text-white rounded-lg flex justify-between items-center hover:bg-black/40 shadow-md uppercase tracking-widest text-sm"
      >
        {selectedEmployee ? selectedEmployee.user.username : "Select Helper"}
        <span>▼</span>
      </button>
      {employeeDropdownOpen && (
        <div className="absolute w-full bg-zinc-600 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          <button
            onClick={() => {
              setSelectedEmployee(null); // Reset selection (opt-out choice)
              setEmployeeDropdownOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-black/40 uppercase tracking-widest text-sm"
          >
            Select Helper
          </button>
          {employees.length === 0 ? (
            <div className="w-full text-center px-4 py-2 text-sm">
              No available helpers
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
  );
};

export default HelperDropdown;
