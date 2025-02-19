// "use client";
// import Image from "next/image";

// const employees = [
//   { id: 1, name: "Employee #1", status: "Active" },
//   { id: 2, name: "Employee #2", status: "Inactive" },
//   { id: 3, name: "Employee #3", status: "Inactive" },
//   { id: 4, name: "Employee #4", status: "Inactive" },
//   { id: 5, name: "Employee #5", status: "Inactive" },
//   { id: 6, name: "Employee #6", status: "Inactive" },
//   { id: 7, name: "Employee #7", status: "Inactive" },
//   { id: 8, name: "Employee #8", status: "Inactive" },
//   { id: 9, name: "Employee #9", status: "Inactive" },
//   { id: 10, name: "Employee #10", status: "Inactive" },
//   { id: 11, name: "Employee #11", status: "Inactive" },
//   { id: 12, name: "Employee #12", status: "Inactive" },
//   { id: 13, name: "Employee #13", status: "Inactive" },
//   { id: 14, name: "Employee #14", status: "Inactive" },
//   { id: 15, name: "Employee #15", status: "Inactive" },
//   { id: 16, name: "Employee #16", status: "Inactive" },
//   { id: 17, name: "Employee #17", status: "Inactive" },
//   { id: 18, name: "Employee #18", status: "Inactive" },
//   { id: 19, name: "Employee #19", status: "Inactive" },
//   { id: 20, name: "Employee #20", status: "Inactive" },
//   { id: 21, name: "Employee #21", status: "Inactive" },
//   { id: 22, name: "Employee #22", status: "Inactive" },
//   { id: 23, name: "Employee #23", status: "Inactive" },
//   { id: 24, name: "Employee #24", status: "Inactive" },
//   { id: 25, name: "Employee #25", status: "Inactive" },
//   { id: 26, name: "Employee #26", status: "Inactive" },
// ];

// const EmployeeList = () => {
//   return (
//     <div className="wrapperdb rounded-2xl p-4 flex-1 shadow-md h-full w-full max-w-full md:max-w-lg lg:max-w-full flex flex-col">
//       <div className="flex justify-center items-center mx-3 gap-2 mb-4">
//         <h1 className="capitalize text-xl md:text-2xl font-medium text-black/40">
//           Employee List
//         </h1>
//         <Image
//           src="/empicon.png"
//           alt="Employee List"
//           width={30}
//           height={30}
//           className="opacity-40"
//         />
//       </div>
//       <div className="flex-1 overflow-y-auto max-h-[680px] border rounded-lg p-2 bg-black/40 border-black/40 text-white w-full">
//         {employees.length > 0 ? (
//           employees.map((employee) => (
//             <div
//               key={employee.id}
//               className="flex justify-between items-center p-2 border-b border-gray-600 text-sm md:text-base w-full"
//             >
//               <span className="text-sm md:text-lg">{employee.name}</span>
//               <span
//                 className={`text-xs md:text-sm font-semibold px-1 py-1 rounded-full border-[1px] ${
//                   employee.status === "Active"
//                     ? "bg-green-500 text-white border-black"
//                     : "bg-gray-400 text-white border-black"
//                 }`}
//               ></span>
//             </div>
//           ))
//         ) : (
//           <div className="flex justify-center items-center h-full text-gray-300">
//             No Employees Available
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeeList;

"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

const EmployeeList = () => {
  const [employees, setEmployees] = useState<{ id: number; name: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("access_token"); // ✅ Retrieve token from localStorage
        if (!token) {
          setError("No authentication token found.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/employees/", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Send token in headers
        });

        const formattedEmployees = response.data.map((emp: any) => ({
          id: emp.employee_id,
          name: emp.user.username,
          status: "Active",
        }));

        setEmployees(formattedEmployees);
      } catch (error) {
        setError("Failed to load employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="wrapperdb rounded-2xl p-4 flex-1 shadow-md h-full w-full max-w-full md:max-w-lg lg:max-w-full flex flex-col">
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
          <div className="flex justify-center items-center h-full text-gray-300">Loading...</div>
        ) : error ? (
          <div className="flex justify-center items-center h-full text-red-400">{error}</div>
        ) : employees.length > 0 ? (
          employees.map((employee) => (
            <div
              key={employee.id}
              className="flex justify-between items-center p-2 border-b border-gray-600 text-sm md:text-base w-full"
            >
              <span className="text-sm md:text-lg">{employee.name}</span>
              <span
                className={`text-xs md:text-sm font-semibold px-1 py-1 rounded-full border-[1px] ${
                  employee.status === "Active"
                    ? "bg-green-500 text-white border-black"
                    : "bg-gray-400 text-white border-black"
                }`}
              ></span>
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
