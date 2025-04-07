// "use client";
// import { toast } from "sonner";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import Image from "next/image";
// import PreviewReportSB from "@/components/PreviewReportSB";

// interface User {
//   username: string;
//   employee_type: string;
// }

// interface Employee {
//   employee_id: number;
//   user: User;
//   profile_image: string;
// }

// const SalaryBreakdown = () => {
//   const router = useRouter();

//   const [loggedInEmployee, setLoggedInEmployee] = useState<Employee | null>(null);
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);
//   const [tripSalaries, setTripSalaries] = useState<any[]>([]);
//   const [completedTripsSet, setCompletedTripsSet] = useState(false);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);

//   useEffect(() => {
//     // ✅ Fetch the logged-in user's employee info
//     fetch("http://localhost:8000/api/user/")
//       .then((res) => res.json())
//       .then((data) => setLoggedInEmployee(data))
//       .catch((err) => {
//         console.error("Failed to fetch logged in user:", err);
//         toast.error("Unable to retrieve logged-in user info.");
//       });
//   }, []);

//   useEffect(() => {
//     if (loggedInEmployee && startDate && endDate) {
//       const query = new URLSearchParams({
//         employee: loggedInEmployee.user.username,
//         start_date: startDate.toISOString(),
//         end_date: endDate.toISOString(),
//       });

//       fetch(`http://localhost:8000/api/employee-trip-salaries/?${query}`)
//         .then((res) => res.json())
//         .then((data) => {
//           setTripSalaries(data);
//         })
//         .catch((err) => console.error("Failed to fetch trip-salary data:", err));
//     }
//   }, [loggedInEmployee, startDate, endDate]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-8">
//       <div className="wrapper w-full max-w-6xl p-6 sm:p-8 rounded-2xl shadow-lg bg-black/20">
//         <h1 className="text-center text-2xl sm:text-3xl font-semibold text-black/50 mb-4 tracking-[0.1em]">
//           MY PAYROLL
//         </h1>

//         {/* Date Pickers */}
//         <div className="flex flex-col gap-4">
//           <div className="flex gap-4 mb-4 items-end">
//             <div className="w-1/2">
//               <label className="block text-sm text-black mb-1 font-bold">Start Date</label>
//               <DatePicker
//                 selected={startDate}
//                 onChange={(date) => setStartDate(date)}
//                 dateFormat="MMMM d, yyyy"
//                 placeholderText="Select start date"
//                 className="w-full px-4 py-2 rounded-md shadow-md text-black cursor-pointer bg-white"
//               />
//             </div>

//             <div className="w-1/2">
//               <label className="block text-sm text-black mb-1 font-bold">End Date</label>
//               <DatePicker
//                 selected={endDate}
//                 onChange={(date) => setEndDate(date)}
//                 dateFormat="MMMM d, yyyy"
//                 placeholderText="Select end date"
//                 minDate={startDate || undefined}
//                 className="w-full px-4 py-2 rounded-md shadow-md text-black cursor-pointer bg-white"
//               />
//             </div>

//             <button onClick={() => { setStartDate(null); setEndDate(null); }}>
//               <Image src="/Trash.png" alt="Clear Dates" width={30} height={30} />
//             </button>
//           </div>

//           <button
//             onClick={async () => {
//               if (!loggedInEmployee || !startDate || !endDate) {
//                 toast.warning("Please select a date range.");
//                 return;
//               }

//               try {
//                 const query = new URLSearchParams({
//                   employee: loggedInEmployee.user.username,
//                   start_date: startDate.toISOString(),
//                   end_date: endDate.toISOString(),
//                 });

//                 const res = await fetch(`http://localhost:8000/api/completed-trips/?${query}`);
//                 if (!res.ok) throw new Error("Failed to fetch completed trips.");

//                 const data = await res.json();
//                 console.log("Completed Trips:", data);

//                 if (data.length === 0) {
//                   toast.warning("No completed trips found.");
//                   setCompletedTripsSet(false);
//                 } else {
//                   toast.success(`Found ${data.length} completed trip(s).`);
//                   setCompletedTripsSet(true);
//                 }

//               } catch (err) {
//                 console.error(err);
//                 toast.error("Error while fetching completed trips.");
//               }
//             }}
//             disabled={!loggedInEmployee || !startDate || !endDate}
//             className={`py-2 px-4 rounded-lg shadow text-white ${
//               !loggedInEmployee || !startDate || !endDate
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-[#668743] hover:bg-[#345216]"
//             }`}
//           >
//             Set Completed Trips
//           </button>
//         </div>

//         {/* PDF Export Section */}
//         <div className="mt-2 flex w-auto items-center justify-center flex-col gap-2">
//           <button
//             onClick={() => {
//               if (!loggedInEmployee || !startDate || !endDate || !completedTripsSet) {
//                 alert("Please complete the fields first.");
//                 return;
//               }
//               setShowPreviewModal(true);
//             }}
//             disabled={!loggedInEmployee || !startDate || !endDate || !completedTripsSet}
//             className={`mt-1 py-2 px-4 rounded-lg shadow ${
//               !loggedInEmployee || !startDate || !endDate || !completedTripsSet
//                 ? "bg-gray-400 cursor-not-allowed text-white"
//                 : "bg-[#668743] hover:bg-[#345216] text-white"
//             }`}
//           >
//             Preview Salary Breakdown
//           </button>

//           {showPreviewModal && (
//             <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
//               <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
//                 <button
//                   onClick={() => setShowPreviewModal(false)}
//                   className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-xl"
//                 >
//                   &times;
//                 </button>
//                 <h2 className="text-lg font-semibold mb-4">Salary Breakdown Preview</h2>
//                 <PreviewReportSB
//                   employee={loggedInEmployee?.user.username || ""}
//                   start={startDate?.toLocaleDateString('en-CA') || ""}
//                   end={endDate?.toLocaleDateString('en-CA') || ""}
//                   onClose={() => setShowPreviewModal(false)}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalaryBreakdown;



import React from "react";
import SalaryPageClient from "./SalaryPageClient";
import { getUserProfile } from "@/lib/actions/user.actions";

export default async function SalaryPage() {
  const user = await getUserProfile()

  console.log(user);

  return <SalaryPageClient user={user} />;
}
