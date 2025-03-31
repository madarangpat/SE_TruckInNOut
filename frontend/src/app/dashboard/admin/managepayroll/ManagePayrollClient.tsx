// "use client";
// import React, { useState} from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import GrossPayrollPDF from "@/components/GrossPayrollPDF"; // update the path if needed
// import SalaryBreakdownPDF from "@/components/SalaryBreakdownPDF";

// const ManagePayroll = ({ users }: { users: User[] }) => {
//   const router = useRouter();
//   const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
//   const [selectedEmployeeImage, setSelectedEmployeeImage] = useState("/accountsblk.png"); // Default image
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);
//   const [employeeDropDownOpen, setEmployeeDropDownOpen] = useState(false);

//   // Handle Employee Selection
//   const handleEmployeeSelect = (user: User) => {
//     setSelectedEmployee(user);
//     setSelectedEmployeeImage(user.profile_image ?? "/accountsblk.png");
//     setEmployeeDropDownOpen(false);
//   };

//   const handleNavigation = (path: string, requiresSelection = true) => {
//     if (requiresSelection && (!selectedEmployee || !startDate || !endDate)) {
//       alert("Please select an Employee and both Start and End Dates before proceeding.");
//       return;
//     }

//     const url = requiresSelection
//       ? `${path}?employee=${selectedEmployee?.username}&start_date=${startDate?.toISOString()}&end_date=${endDate?.toISOString()}`
//       : path;

//     router.push(url);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10">
//       <div className="wrapper w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-6 sm:p-8 rounded-2xl shadow-lg bg-black/20">
//         {/* Title */}
//         <h1 className="text-center text-2xl sm:text-3xl font-semibold text-black/50 mb-4 tracking-[0.1em]">
//           PAYROLL
//         </h1>

//         {/* View Gross Payroll Button (Works Without Selections) */}
//         <div className="flex justify-center mb-4">
//           <div className="flex justify-center mb-4">
//             <GrossPayrollPDF />
//           </div>
//         </div>

//         {/* Profile Image (Now Updates Correctly) */}
//         <div className="flex justify-center mb-6">
//           <div className="w-24 sm:w-28 h-24 sm:h-28 bg-white rounded-full flex items-center justify-center border border-gray-300 shadow-lg relative overflow-hidden">
//             <Image
//               src={selectedEmployeeImage}
//               alt="Profile"
//               width={100}
//               height={100}
//               className="rounded-full object-cover"
//               unoptimized
//             />
//           </div>
//         </div>

//         {/* Dropdown Buttons */}
//         <div className="flex flex-col gap-4">
//           {/* Select Employee Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setEmployeeDropDownOpen(!employeeDropDownOpen)}
//               className="innerwrapper w-full px-4 sm:px-6 py-2 sm:py-3 bg-[#668743] backdrop-blur-md text-white rounded-lg flex justify-between items-center hover:bg-black/40 shadow-md uppercase tracking-widest text-xs sm:text-sm"
//             >
//               {selectedEmployee ? selectedEmployee.username: "Select Employee Name"}
//               <span>▼</span>
//             </button>

//             {employeeDropDownOpen && (
//               <div className="dropwrapper absolute w-full text-black mt-1 rounded-lg shadow-lg bg-white z-10 max-h-48 sm:max-h-60 overflow-y-auto">
//                 {users
//                     .filter(user => user.role === "employee") 
//                     .map((user) => (
//                     <button
//                         key={user.username}
//                         onClick={() => handleEmployeeSelect(user)}
//                         className="w-full text-left px-4 py-2 hover:bg-black/40 uppercase tracking-widest text-xs sm:text-sm"
//                     >
//                         {user.username} ({user.role})
//                     </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Start and End Date Pickers Side by Side */}
//           <div className="flex gap-4 mb-4">
//             {/* Start Date */}
//             <div className="w-1/2">
//               <label className="block text-sm text-black mb-1 font-bold">Start Date</label>
//               <DatePicker
//                 selected={startDate}
//                 onChange={(date) => setStartDate(date)}
//                 dateFormat="MMMM d, yyyy"
//                 placeholderText="Select start date"
//                 className="w-full px-4 py-2 rounded-md shadow-md text-black cursor-pointer bg-white"
//                 calendarClassName="rounded-lg"
//               />
//             </div>

//             {/* End Date */}
//             <div className="w-1/2">
//               <label className="block text-sm text-black mb-1 font-bold">End Date</label>
//               <DatePicker
//                 selected={endDate}
//                 onChange={(date) => setEndDate(date)}
//                 dateFormat="MMMM d, yyyy"
//                 placeholderText="Select end date"
//                 minDate={startDate || undefined}
//                 className="w-full px-4 py-2 rounded-md shadow-md text-black cursor-pointer bg-white"
//                 calendarClassName="rounded-lg"
//               />
//             </div>
//           </div>          
       
//         </div>

//         {/* Buttons */}
//         <div className="mt-6 flex flex-col gap-4">
//           <div className="flex justify-center mb-4">
//             <SalaryBreakdownPDF />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagePayroll;
