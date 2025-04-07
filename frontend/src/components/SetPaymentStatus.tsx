"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Employee {
  employee_id: number;
  username: string;
  payment_status: boolean;
}

const SetPaymentStatus: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/employees/")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((emp: any) => ({
          employee_id: emp.employee_id,
          username: emp.user.username,
          payment_status: emp.payment_status,
        }));
        setEmployees(formatted);
      })
      .catch((err) => console.error("Failed to fetch employees:", err));
  }, []);

  useEffect(() => {
    if (selectedEmployeeId !== null) {
      const emp = employees.find(e => e.employee_id === selectedEmployeeId);
      if (emp) setStatus(emp.payment_status);
    }
  }, [selectedEmployeeId]);

  const handleStatusUpdate = async () => {
    if (selectedEmployeeId === null) return;

    try {
      const response = await fetch(`http://localhost:8000/api/set-payment-status/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: selectedEmployeeId,
          status,
        }),
      });

      if (!response.ok) throw new Error("Update failed");

      toast.success("Payment status updated.");

      // Reset dropdown and checkbox
      setSelectedEmployeeId(null);
      setStatus(false);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-white mb-2">Set Employee Payment Status</h2>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <select
          value={selectedEmployeeId ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedEmployeeId(val ? parseInt(val) : null);
          }}
          className="w-full sm:w-1/2 px-4 py-2 border rounded"
        >
          <option value="" disabled>Select employee</option>
          {employees.map((emp) => (
            <option key={emp.employee_id} value={emp.employee_id}>
              {emp.username}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-black">Paid:</label>
          <input
            type="checkbox"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
          />
        </div>

        <button
          onClick={handleStatusUpdate}
          className="bg-[#668743] hover:bg-[#345216] text-white py-2 px-4 rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SetPaymentStatus;
