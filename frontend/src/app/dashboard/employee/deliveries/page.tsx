// "use client";
// import React, { useState, useEffect } from "react";
// import Image from "next/image";

// const DeliveriesPage = () => {
//   const loggedInEmployee = "Employee #1"; // Replace with actual logged-in employee

//   // Simulated Assigned Trip Data
//   const [assignedTrip, setAssignedTrip] = useState<{
//     destination: string;
//     client: string;
//     drops: number;
//     startDate: string;
//     vehicle: string;
//   } | null>(null);

//   // Simulated Recent Trips Data
//   const [recentTrips, setRecentTrips] = useState<
//     {
//       id: number;
//       name: string;
//       client: string;
//       destination: string;
//       status: string;
//       date: string;
//       vehicle: string;
//     }[]
//   >([]);

//   useEffect(() => {
//     // Fetch assigned trip (Replace with actual API call)
//     const fetchAssignedTrip = async () => {
//       const trip = {
//         destination: "Los Angeles, CA",
//         client: "ABC Logistics",
//         drops: 3,
//         startDate: "2025-03-01",
//         vehicle: "Truck #15",
//       };
//       setAssignedTrip(trip); // Set assigned trip (Remove this line if testing "No assigned trips yet...")
//     };

//     // Fetch recent trips (Replace with actual API call)
//     const fetchRecentTrips = async () => {
//       const trips = [
//         {
//           id: 1,
//           name: "Employee #1",
//           client: "XYZ Freight",
//           destination: "New York, NY (450 km)",
//           status: "Completed",
//           date: "2025-02-28",
//           vehicle: "Truck #12",
//         },
//         {
//           id: 2,
//           name: "Employee #1",
//           client: "FastCargo Inc.",
//           destination: "San Francisco, CA (320 km)",
//           status: "Not Completed",
//           date: "",
//           vehicle: "Truck #8",
//         },
//       ];
//       setRecentTrips(trips.filter((trip) => trip.name === loggedInEmployee));
//     };

//     fetchAssignedTrip();
//     fetchRecentTrips();
//   }, []);

//   return (
//     <div className="min-h-fit flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 pt-4">
//       {/* Assigned Trip Section */}
//       <div className="wrapper w-full max-w-4xl rounded-xl shadow-lg p-4 bg-black/20 mb-4 mt-0">
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

//         <div className="innerwrapper p-4 rounded-lg bg-white shadow-md text-black/80 text-sm">
//           {assignedTrip ? (
//             <>
//               <div className="border-b border-white/25 py-2 flex justify-between">
//                 <span className="text-white">Destination</span>
//                 <span>{assignedTrip.destination}</span>
//               </div>
//               <div className="border-b border-white/25 py-2 flex justify-between">
//                 <span className="text-white">Client</span>
//                 <span>{assignedTrip.client}</span>
//               </div>
//               <div className="border-b border-white/25 py-2 flex justify-between">
//                 <span className="text-white">No. of Drops</span>
//                 <span>{assignedTrip.drops}</span>
//               </div>
//               <div className="border-b border-white/25 py-2 flex justify-between">
//                 <span className="text-white">Start Date</span>
//                 <span>{assignedTrip.startDate}</span>
//               </div>
//               <div className="py-2 flex justify-between">
//                 <span className="text-white">Vehicle</span>
//                 <span>{assignedTrip.vehicle}</span>
//               </div>
//             </>
//           ) : (
//             <p className="text-center text-gray-600 text-sm">
//               No assigned trips yet...
//             </p>
//           )}
//         </div>

//         {/* Accept/Decline Buttons (Placed Outside Details Div) */}
//         {assignedTrip && (
//           <div className="mt-4 flex justify-center gap-4">
//             <button className="px-10 py-5 bg-green-600 text-white rounded-lg hover:bg-green-800">
//               ACCEPT
//             </button>
//             <button className="px-10 py-5 bg-red-600 text-white rounded-lg hover:bg-red-800">
//               DECLINE
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Recent Trips Section */}
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
//                 key={trip.id}
//                 className="wrappersmall flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-600 text-white w-full"
//               >
//                 <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full">
//                   {/* Trip details */}
//                   <div className="innerwrapper w-full bg-gray-800 rounded-md p-3">
//                     <p className="text-xs text-white uppercase">
//                       <strong>Status:</strong> {trip.status}{" "}
//                       {trip.date && `(Completed on ${trip.date})`}
//                     </p>
//                     <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
//                       <strong>CLIENT:</strong> {trip.client}
//                     </p>
//                     <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
//                       <strong>DESTINATION:</strong> {trip.destination}
//                     </p>
//                     <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
//                       <strong>VEHICLE USED:</strong> {trip.vehicle}
//                     </p>
//                   </div>
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

// export default DeliveriesPage;


"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

type Trip = {
  trip_id: number;
  get_full_destination: string;
  client_info: string;
  num_of_drops: number;
  start_date: string;
  end_date?: string;
  assignment_status: string;
  is_completed: boolean;
  vehicle: {
    plate_number: string;
  };
};

const DeliveriesPage = () => {
  const [assignedTrip, setAssignedTrip] = useState<Trip | null>(null);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);

  useEffect(() => {
    fetchAssignedTrip();
    fetchRecentTrips();
  }, []);

  const fetchAssignedTrip = async () => {
    try {
      const res = await fetch("/api/trips/assigned/", {
        credentials: "include",
      });

      if (res.status === 200) {
        const data = await res.json();
        setAssignedTrip(data);
      } else {
        setAssignedTrip(null);
      }
    } catch (error) {
      console.error("Error fetching assigned trip:", error);
    }
  };

  const fetchRecentTrips = async () => {
    try {
      const res = await fetch("/api/trips/recent/", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setRecentTrips(data);
      }
    } catch (error) {
      console.error("Error fetching recent trips:", error);
    }
  };

  const handleAccept = async () => {
    if (!assignedTrip) return;
    try {
      const res = await fetch(`/api/trips/${assignedTrip.trip_id}/accept/`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        fetchAssignedTrip();
        fetchRecentTrips();
      }
    } catch (error) {
      console.error("Error accepting trip:", error);
    }
  };

  const handleDecline = async () => {
    if (!assignedTrip) return;
    try {
      const res = await fetch(`/api/trips/${assignedTrip.trip_id}/decline/`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setAssignedTrip(null);
        fetchRecentTrips();
      }
    } catch (error) {
      console.error("Error declining trip:", error);
    }
  };

  return (
    <div className="min-h-fit flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 pt-4">
      {/* Assigned Trip */}
      <div className="wrapper w-full max-w-4xl rounded-xl shadow-lg p-4 bg-black/20 mb-4">
        <h2 className="text-center text-2xl font-semibold text-black/50 mb-4 flex justify-center items-center gap-2">
          <Image src="/truck.png" alt="Assigned Trip" width={40} height={40} className="opacity-50" />
          Assigned Trip
        </h2>

        <div className="innerwrapper p-4 rounded-lg bg-white shadow-md text-black/80 text-sm">
          {assignedTrip ? (
            <>
              <div className="border-b border-white/25 py-2 flex justify-between">
                <span className="text-white">Destination</span>
                <span>{assignedTrip.get_full_destination}</span>
              </div>
              <div className="border-b border-white/25 py-2 flex justify-between">
                <span className="text-white">Client</span>
                <span>{assignedTrip.client_info}</span>
              </div>
              <div className="border-b border-white/25 py-2 flex justify-between">
                <span className="text-white">No. of Drops</span>
                <span>{assignedTrip.num_of_drops}</span>
              </div>
              <div className="border-b border-white/25 py-2 flex justify-between">
                <span className="text-white">Start Date</span>
                <span>{assignedTrip.start_date?.split("T")[0]}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-white">Vehicle</span>
                <span>{assignedTrip.vehicle.plate_number}</span>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600 text-sm">No assigned trips yet...</p>
          )}
        </div>

        {assignedTrip && (
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={handleAccept}
              className="px-10 py-5 bg-green-600 text-white rounded-lg hover:bg-green-800"
            >
              ACCEPT
            </button>
            <button
              onClick={handleDecline}
              className="px-10 py-5 bg-red-600 text-white rounded-lg hover:bg-red-800"
            >
              DECLINE
            </button>
          </div>
        )}
      </div>

      {/* Recent Trips */}
      <div className="wrapper w-full max-w-4xl rounded-xl shadow-lg p-6 bg-black/20">
        <h2 className="text-center text-2xl font-semibold text-black/50 mb-4 flex justify-center items-center gap-2">
          <Image src="/package.png" alt="Recent Trips" width={30} height={30} className="opacity-50" />
          Recent Trips
        </h2>

        <div className="innerwrapper max-h-[250px] overflow-y-auto bg-gray-900 rounded-lg p-3 border-2 border-white flex flex-col">
          {recentTrips.length > 0 ? (
            recentTrips.map((trip) => (
              <div key={trip.trip_id} className="wrappersmall flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-600 text-white w-full">
                <div className="innerwrapper w-full bg-gray-800 rounded-md p-3">
                  <p className="text-xs text-white uppercase">
                    <strong>Status:</strong> {trip.assignment_status}
                    {trip.is_completed && ` (Completed on ${trip.end_date?.split("T")[0]})`}
                  </p>
                  <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                    <strong>CLIENT:</strong> {trip.client_info}
                  </p>
                  <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                    <strong>DESTINATION:</strong> {trip.get_full_destination}
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

export default DeliveriesPage;
