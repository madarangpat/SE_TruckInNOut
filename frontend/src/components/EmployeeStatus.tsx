"use client";
import Image from "next/image";

const employeeStatus = [
  { id: 1, name: "Employee #1", salary: "P -------", payment: "PAID" },
  { id: 2, name: "Employee #2", salary: "P -------", payment: "PAID" },
  { id: 3, name: "Employee #3", salary: "P -------", payment: "PAID" },
  { id: 4, name: "Employee #4", salary: "P -------", payment: "PAID" },
  { id: 5, name: "Employee #5", salary: "P -------", payment: "PAID" },
];

const EmployeeStatus = () => {
  return (
    <div className="wrapper rounded-2xl p-4 flex-1 shadow-md h-full w-full flex flex-col">
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
        {employeeStatus.map((employee) => (
          <div
            key={employee.id}
            className="p-2 border-b border-gray-600 text-white"
          >
            <span className="block">{employee.name}</span>
            <div className="flex justify-between items-center">
              <span className="text-xs bg-black/25 text-white px-2 py-1 rounded-lg">
                Salary (WEEKLY): {employee.salary}
              </span>
              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-lg">
                Payment Status: {employee.payment}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeStatus;
