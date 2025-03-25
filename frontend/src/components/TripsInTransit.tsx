// "use client";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import axios from "axios";

// interface Trip {
//   trip_id: number;
//   is_completed: boolean;
//   assignment_status: string;  // Assuming trip status exists and could be "Accepted" or others
//   employee: {
//     employee_id: number;
//     user: {
//       username: string;
//       profile_image: string | null;
//     };
//   } | null;
//   start_date: string;
//   end_date: string;
// }

// const TripsInTransit = () => {
//   const [trips, setTrips] = useState<Trip[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTrips = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/trips/");
//         // Filter trips where status is 'Accepted' and is not completed
//         const activeTrips = res.data.filter(
//           (trip: Trip) => trip.assignment_status === "accepted" && trip.is_completed === false
//         );
//         setTrips(activeTrips);
//       } catch (err) {
//         console.error("Failed to fetch trips:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrips();
//   }, []);

//   return (
//     <div className="wrapper w-full max-w-5xl rounded-2xl shadow-lg p-6 mb-8 bg-black/40">
//       <div className="flex justify-center items-center mx-3 gap-2">
//         <h2 className="capitalize text-2xl font-semibold flex items-center gap-2 mb-4 text-black/40">
//           <Image
//             src="/truck.png"
//             alt="Truck"
//             width={40}
//             height={40}
//             className="opacity-40"
//           />
//           Trips in Transit
//         </h2>
//       </div>

//       <div className="innerwrapper max-h-[300px] min-h-[150px] p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex items-center justify-center">
//         {loading ? (
//           <p className="text-white text-center text-lg">Loading trips...</p>
//         ) : trips.length > 0 ? (
//           trips.map((trip) => (
//             <div
//               key={trip.trip_id}
//               className={`wrappersmall flex flex-col items-center justify-center 
//                 ${trip.is_completed ? 'bg-green-500' : 'bg-orange-500'} 
//                 hover:${trip.is_completed ? 'bg-green-600' : 'bg-orange-600'} 
//                 transition rounded-lg p-4`}
//             >
//               <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border-2 border-white">
//                 <Image
//                   src={ 
//                     trip.employee?.user?.profile_image
//                       ? trip.employee.user.profile_image
//                       : "/accounts.png"
//                   }
//                   alt="Profile"
//                   width={70}
//                   height={70}
//                   className="rounded-full object-cover opacity-90"
//                 />
//               </div>
//               <span className="mt-2 text-sm text-white/90">
//                 {trip.employee?.user?.username || "No Employee"}
//               </span>
//               <span
//                 className={`mt-2 text-xs text-white px-2 py-1 rounded-lg 
//                 ${trip.is_completed ? 'bg-green-500' : 'bg-orange-500'}`}
//               >
//                 {trip.is_completed ? 'Completed' : 'Ongoing'}
//               </span>
//             </div>
//           ))
//         ) : (
//           <p className="text-white text-center text-lg">No Current Trip/s.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TripsInTransit;



// "use client";
// import Image from "next/image";

// const employeesInTransit = [
//   { id: 1, name: "Employee #1", status: "ONGOING" },
//   { id: 2, name: "Employee #2", status: "ONGOING" },
//   { id: 3, name: "Employee #3", status: "ONGOING" },
//   { id: 4, name: "Employee #4", status: "ONGOING" },
//   { id: 5, name: "Employee #5", status: "ONGOING" },
//   { id: 6, name: "Employee #6", status: "ONGOING" },
//   { id: 7, name: "Employee #7", status: "ONGOING" },
//   { id: 8, name: "Employee #8", status: "ONGOING" },
//   { id: 9, name: "Employee #9", status: "ONGOING" },
//   { id: 10, name: "Employee #10", status: "ONGOING" },
// ];

// const TripsInTransit = () => {
//   return (
//     <div className="wrapper rounded-2xl p-4 flex-1 shadow-md h-full w-full flex flex-col">
//       <div className="flex justify-start items-center mx-3 gap-2">
//         <h1 className="capitalize text-2xl font-medium text-black/40">
//           Trips In Transit
//         </h1>
//         <Image
//           src="/truck.png"
//           alt="Truck"
//           width={40}
//           height={40}
//           className="opacity-40"
//         />
//       </div>
//       <div className="flex-1 overflow-y-auto overflow-x-hidden max-h-[200px] bg-black/40 rounded-lg p-3">
//         {employeesInTransit.length > 0 ? (
//           employeesInTransit.map((employee) => (
//             <div
//               key={employee.id}
//               className="flex justify-between items-center p-2 border-b border-gray-600 text-white w-full"
//             >
//               <span>{employee.name}</span>
//               <div className="flex items-center gap-2">
//                 <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-lg">
//                   {employee.status}
//                 </span>
//                 <Image
//                   src="/truck.png"
//                   alt="Truck"
//                   width={30}
//                   height={30}
//                   className="opacity-40"
//                 />
//               </div>
//             </div>
//           ))
//         ) : (
//           <span className="text-white text-center text-sm">
//             NO TRIPS IN TRANSIT.
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TripsInTransit;

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Trip {
  trip_id: number;
  is_completed: boolean;
  assignment_status: string;
  employee: {
    employee_id: number;
    user: {
      username: string;
    };
  } | null;
}

const TripsInTransit = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/trips/");
        // Filter trips where assignment_status is 'accepted' and is not completed
        const activeTrips = res.data.filter(
          (trip: Trip) => trip.assignment_status === "accepted" && trip.is_completed === false
        );
        setTrips(activeTrips);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="wrapper rounded-2xl p-4 flex-1 shadow-md h-full w-full flex flex-col">
      {/* Retaining the header with truck icon and title */}
      <div className="flex justify-start items-center mx-3 gap-2">
        <h1 className="capitalize text-2xl font-medium text-black/40">
          Trips In Transit
        </h1>
        <Image
          src="/truck.png"
          alt="Truck"
          width={40}
          height={40}
          className="opacity-40"
        />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden max-h-[200px] bg-black/40 rounded-lg p-3">
        {loading ? (
          <span className="text-white text-center text-sm">Loading trips...</span>
        ) : trips.length > 0 ? (
          trips.map((trip, index) => (
            <div
              key={trip.trip_id}
              className="flex justify-between items-center p-2 border-b border-gray-600 text-white w-full"
            >
              <span>
                Employee {index + 1}: {trip.employee?.user.username || "No Employee"}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-lg ${
                    trip.is_completed ? "bg-green-500" : "bg-orange-500"
                  } text-white`}
                >
                  {trip.is_completed ? "Completed" : "Ongoing"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <span className="text-white text-center text-sm">No trips in transit.</span>
        )}
      </div>
    </div>
  );
};

export default TripsInTransit;