// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { acceptTrip, declineTrip } from "@/lib/actions/deliveries.actions";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// type DeliveriesClientProps = {
//   assignedTrip: Trip;
//   recentTrips: Trip[];
//   ongoingTrips: Trip[];
// };

// type Trip = {
//     trip_id: number;
//     full_destination?: string;
//     client_info: string;
//     num_of_drops: number;
//     start_date: string;
//     end_date?: string;
//     assignment_status: string;
//     is_completed: boolean;
//     vehicle: {
//       plate_number: string;
//     };
//     employee?: {
//       employee_id: number;
//       user: {
//         username: string;
//         profile_image: string | null;
//       };
//     } | null;
//   };

// const DeliveriesClient = ({
//   assignedTrip,
//   recentTrips,
//   ongoingTrips,

// }: DeliveriesClientProps) => {
//   const router = useRouter();
// //   const [ongoingTrips, setOngoingTrips] = useState<Trip[]>([]);
//   const [loadingOngoing, setLoadingOngoing] = useState(true);

// //   useEffect(() => {
// //     const fetchOngoingTrips = async () => {
// //       try {
// //         const res = await axios.get("http://localhost:8000/api/trips/");
// //         const activeTrips = res.data.filter((trip: Trip) => trip.is_completed === false);
// //         setOngoingTrips(activeTrips);
// //       } catch (err) {
// //         console.error("Failed to fetch ongoing trips:", err);
// //       } finally {
// //         setLoadingOngoing(false);
// //       }
// //     };

// //     fetchOngoingTrips();
// //   }, []);

//   const handleEmployeeClick = (employeeId: number) => {
//     router.push(`/dashboard/employee/viewdeliveries/maps?employee=${employeeId}`);
//   };

//   return (
//     <div className="min-h-fit flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 pt-4">
//       {/* Assigned Trip */}
//       <div className="wrapper w-full max-w-4xl rounded-xl shadow-lg p-4 bg-black/20 mb-4">
//         <h2 className="text-center text-2xl font-semibold text-black/50 mb-4 flex justify-center items-center gap-2">
//           <Image
//             src="/truck.png"
//             alt="Assigned Trip"
//             width={40}
//             height={40}
//             className="opacity-50"
//           />
//           Assigned Trip
//         </h2>

//         <div className="wrapper w-full max-w-4xl rounded-xl shadow-lg p-4 bg-black/20 mb-4">
//           {assignedTrip ? (
//             <>
//               <div className="border-b border-black/20 py-2 flex justify-between">
//                 <span className="text-black/70">Destination</span>
//                 <span className="text-black/50">
//                   {assignedTrip.full_destination}
//                 </span>
//               </div>
//               <div className="border-b border-black/20 py-2 flex justify-between">
//                 <span className="text-black/50">Client</span>
//                 <span className="text-black/50">
//                   {assignedTrip.client_info}
//                 </span>
//               </div>
//               <div className="border-b border-black/20 py-2 flex justify-between">
//                 <span className="text-black/50">No. of Drops</span>
//                 <span className="text-black/50">
//                   {assignedTrip.num_of_drops}
//                 </span>
//               </div>
//               <div className="border-b border-black/20 py-2 flex justify-between">
//                 <span className="text-black/50">Start Date</span>
//                 <span className="text-black/50">
//                   {assignedTrip.start_date?.split("T")[0]}
//                 </span>
//               </div>
//               <div className="py-2 flex justify-between">
//                 <span className="text-black/50">Vehicle</span>
//                 <span className="text-black/50">
//                   {assignedTrip.vehicle.plate_number}
//                 </span>
//               </div>
//             </>
//           ) : (
//             <p className="text-center text-gray-600 text-sm">
//               No assigned trips yet...
//             </p>
//           )}
//         </div>

//         {assignedTrip && (
//           <div className="mt-4 flex justify-center gap-4">
//             <button
//               onClick={async () => {
//                 await acceptTrip(assignedTrip.trip_id);
//                 router.refresh();
//               }}
//               className="px-8 py-5 bg-green-600 text-white rounded-lg hover:bg-green-800"
//             >
//               ACCEPT
//             </button>
//             <button
//               onClick={async () => await declineTrip(assignedTrip.trip_id)}
//               className="px-8 py-5 bg-red-600 text-white rounded-lg hover:bg-red-800"
//             >
//               DECLINE
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Ongoing Trips */}
//       <div className="wrapper w-full max-w-5xl rounded-2xl shadow-lg p-6 my-8 bg-black/40">
//         <div className="flex justify-center items-center mx-3 gap-2">
//           <h2 className="capitalize text-2xl font-semibold flex items-center gap-2 mb-4 text-black/40">
//             <Image src="/truck.png" alt="Truck" width={40} height={40} className="opacity-40" />
//             Ongoing Trips
//           </h2>
//         </div>

//         <div className="innerwrapper max-h-[300px] min-h-[150px] p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex items-center justify-center">
//           {loadingOngoing ? (
//             <p className="text-white text-center text-lg">Loading trips...</p>
//           ) : ongoingTrips.length > 0 ? (
//             ongoingTrips.map((trip) => (
//               <div
//                 key={trip.trip_id}
//                 className="wrappersmall flex flex-col items-center justify-center bg-[#668743] hover:bg-[#345216] transition rounded-lg p-4 cursor-pointer"
//                 onClick={() => trip.employee && handleEmployeeClick(trip.employee.employee_id)}
//               >
//                 <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border-2 border-white">
//                   <Image
//                     src={
//                       trip.employee?.user?.profile_image
//                         ? trip.employee.user.profile_image
//                         : "/accounts.png"
//                     }
//                     alt="Profile"
//                     width={70}
//                     height={70}
//                     className="rounded-full object-cover opacity-90"
//                   />
//                 </div>
//                 <span className="mt-2 text-sm text-white/90">
//                   {trip.employee?.user?.username || "No Employee"}
//                 </span>
//               </div>
//             ))
//           ) : (
//             <p className="text-white text-center text-lg">No Current Trip/s.</p>
//           )}
//         </div>
//       </div>

//       {/* Recent Trips */}
//       <div className="wrapper w-full max-w-4xl rounded-xl shadow-lg p-6 bg-black/20">
//         <h2 className="text-center text-2xl font-semibold text-black/50 mb-4 flex justify-center items-center gap-2">
//           <Image
//             src="/package.png"
//             alt="Recent Trips"
//             width={30}
//             height={30}
//             className="opacity-50"
//           />
//           Recent Trips
//         </h2>

//         <div className="innerwrapper max-h-[250px] overflow-y-auto bg-gray-900 rounded-lg p-3 border-2 border-white flex flex-col">
//           {recentTrips.length > 0 ? (
//             recentTrips.map((trip) => (
//               <div
//                 key={trip.trip_id}
//                 className="wrappersmall flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-600 text-white w-full"
//               >
//                 <div className="innerwrapper w-full bg-gray-800 rounded-md p-3">
//                   <p className="text-xs text-white uppercase">
//                     <strong>Status:</strong> {trip.assignment_status}
//                     {trip.is_completed &&
//                       ` (Completed on ${trip.end_date?.split("T")[0]})`}
//                   </p>
//                   <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
//                     <strong>CLIENT:</strong> {trip.client_info}
//                   </p>
//                   <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
//                     <strong>DESTINATION:</strong> {trip.full_destination}
//                   </p>
//                   <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
//                     <strong>VEHICLE USED:</strong> {trip.vehicle.plate_number}
//                   </p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-white text-center text-lg">No Trips Recently.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeliveriesClient;


"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { acceptTrip, declineTrip } from "@/lib/actions/deliveries.actions";
import { useRouter } from "next/navigation";
import axios from "axios";

type DeliveriesClientProps = {
  assignedTrip: Trip;
  recentTrips: Trip[];
  ongoingTrips: Trip[];
};

type Trip = {
  trip_id: number;
  full_destination?: string;
  client_info: string;
  num_of_drops: number;
  start_date: string;
  end_date?: string;
  assignment_status: string;
  is_completed: boolean;
  vehicle: {
    plate_number: string;
  };
  employee?: {
    employee_id: number;
    user: {
      username: string;
      profile_image: string | null;
    };
  } | null;
};

const DeliveriesClient = ({
  assignedTrip,
  recentTrips,
  ongoingTrips,
}: DeliveriesClientProps) => {
  const router = useRouter();

  const handleEmployeeClick = (employeeId: number) => {
    router.push(`/dashboard/employee/viewdeliveries/maps?employee=${employeeId}`);
  };

  return (
    <div className="min-h-fit flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 pt-4">
      {/* Assigned Trip */}
      <div className="wrapper w-full max-w-4xl rounded-xl shadow-lg p-4 bg-black/20 mb-4">
        <h2 className="text-center text-2xl font-semibold text-black/50 mb-4 flex justify-center items-center gap-2">
          <Image src="/truck.png" alt="Assigned Trip" width={40} height={40} className="opacity-50" />
          Assigned Trip
        </h2>

        <div className="wrapper w-full max-w-4xl rounded-xl shadow-lg p-4 bg-black/20 mb-4">
          {assignedTrip ? (
            <>
              <div className="border-b border-black/20 py-2 flex justify-between">
                <span className="text-black/70">Destination</span>
                <span className="text-black/50">{assignedTrip.full_destination}</span>
              </div>
              <div className="border-b border-black/20 py-2 flex justify-between">
                <span className="text-black/50">Client</span>
                <span className="text-black/50">{assignedTrip.client_info}</span>
              </div>
              <div className="border-b border-black/20 py-2 flex justify-between">
                <span className="text-black/50">No. of Drops</span>
                <span className="text-black/50">{assignedTrip.num_of_drops}</span>
              </div>
              <div className="border-b border-black/20 py-2 flex justify-between">
                <span className="text-black/50">Start Date</span>
                <span className="text-black/50">{assignedTrip.start_date?.split("T")[0]}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-black/50">Vehicle</span>
                <span className="text-black/50">{assignedTrip.vehicle.plate_number}</span>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600 text-sm">No assigned trips yet...</p>
          )}
        </div>

        {assignedTrip && (
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={async () => {
                await acceptTrip(assignedTrip.trip_id);
                router.refresh();
              }}
              className="px-8 py-5 bg-green-600 text-white rounded-lg hover:bg-green-800"
            >
              ACCEPT
            </button>
            <button
              onClick={async () => await declineTrip(assignedTrip.trip_id)}
              className="px-8 py-5 bg-red-600 text-white rounded-lg hover:bg-red-800"
            >
              DECLINE
            </button>
          </div>
        )}
      </div>

      {/* Ongoing Trips */}
    <div className="wrapper w-full max-w-5xl rounded-2xl shadow-lg p-6 my-8 bg-black/40">
        <div className="flex justify-center items-center mx-3 gap-2">
            <h2 className="capitalize text-2xl font-semibold flex items-center gap-2 mb-4 text-black/40">
            <Image src="/truck.png" alt="Truck" width={40} height={40} className="opacity-40" />
            Ongoing Trips
            </h2>
        </div>

        <div className="innerwrapper max-h-[300px] min-h-[150px] p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex items-center justify-center">
            {ongoingTrips.length > 0 ? (
            ongoingTrips.map((trip) => (
                <div
                key={trip.trip_id}
                className="wrappersmall flex flex-col items-center justify-center bg-[#668743] hover:bg-[#345216] transition rounded-lg p-4 cursor-pointer"
                onClick={() => trip.employee && handleEmployeeClick(trip.employee.employee_id)}
                >
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border-2 border-white">
                    <Image
                    src={
                        trip.employee?.user?.profile_image
                        ? trip.employee.user.profile_image
                        : "/accounts.png"
                    }
                    alt="Profile"
                    width={70}
                    height={70}
                    className="rounded-full object-cover opacity-90"
                    />
                </div>
                <span className="mt-2 text-sm text-white/90">
                    {trip.employee?.user?.username || "No Employee"}
                </span>
                </div>
            ))
            ) : (
            <p className="text-white text-center text-lg">No Current Trip/s.</p>
            )}
        </div>
    </div>


      {/* Recent Trips */}
      <div className="wrapper w-full max-w-4xl rounded-xl shadow-lg p-6 bg-black/20">
        <h2 className="text-center text-2xl font-semibold text-black/50 mb-4 flex justify-center items-center gap-2">
          <Image
            src="/package.png"
            alt="Recent Trips"
            width={30}
            height={30}
            className="opacity-50"
          />
          Recent Trips
        </h2>

        <div className="innerwrapper max-h-[250px] overflow-y-auto bg-gray-900 rounded-lg p-3 border-2 border-white flex flex-col">
          {recentTrips.length > 0 ? (
            recentTrips.map((trip) => (
              <div
                key={trip.trip_id}
                className="wrappersmall flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-600 text-white w-full"
              >
                <div className="innerwrapper w-full bg-gray-800 rounded-md p-3">
                  <p className="text-xs text-white uppercase">
                    <strong>Status:</strong> {trip.assignment_status}
                    {trip.is_completed &&
                      ` (Completed on ${trip.end_date?.split("T")[0]})`}
                  </p>
                  <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                    <strong>CLIENT:</strong> {trip.client_info}
                  </p>
                  <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                    <strong>DESTINATION:</strong> {trip.full_destination}
                  </p>
                  <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                    <strong>VEHICLE USED:</strong> {trip.vehicle.plate_number}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white text-center text-lg">No Trips Recently.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveriesClient;

