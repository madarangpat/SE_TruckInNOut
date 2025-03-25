import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import dynamic from "next/dynamic";
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false, // 👈 disables server-side rendering
});

interface Trip {
  trip_id: number;
  client_info: string;
  destination_latitude: string;
  destination_longitude: string;
  user_latitude: string;
  user_longitude: string;
  distance_traveled: string;
  street_number: string;
  street_name: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  country: string;
  vehicle: {
    plate_number: string;
  };
  employee: {
    employee_id: number;
    user: {
      username: string;
      profile_image: string | null;
    };
  };
}

const MapsPage = () => {
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("employee");
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // State for checking if user is admin

  useEffect(() => {
    // Assume a function `checkIfAdmin` that checks if the logged-in user is an admin
    const checkIfAdmin = async () => {
      try {
        const res = await axios.get("/api/auth/check_role"); // Replace with actual API call to check the user's role
        if (res.data.role === "admin") {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Error checking user role:", err);
      }
    };

    checkIfAdmin();

    const fetchTrip = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/trips/");
        let filteredTrips;
        if (isAdmin) {
          filteredTrips = res.data; // Admin can see all trips
        } else {
          filteredTrips = res.data.filter(
            (t: Trip) => t.employee?.employee_id === Number(employeeId)
          ); // Employee sees only their own trips
        }

        if (filteredTrips.length > 0) {
          setTrip(filteredTrips[0]); // Assuming an employee only has one active trip at a time
        } else {
          setTrip(null);
        }
      } catch (err) {
        console.error("Error fetching trip data:", err);
      }
    };

    if (employeeId) {
      fetchTrip();
    }
  }, [employeeId, isAdmin]);

  const getDestination = () => {
    if (!trip) return "";
    const parts = [
      trip.street_number,
      trip.street_name,
      trip.barangay,
      trip.city,
      trip.province,
      trip.region,
      trip.country,
    ];
    return parts.filter(Boolean).join(", ");
  };

  const dest_lat = parseFloat(trip?.destination_latitude || "");
  const dest_lng = parseFloat(trip?.destination_longitude || "");
  const user_lat = parseFloat(trip?.user_latitude || "");
  const user_lng = parseFloat(trip?.user_longitude || "");

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 md:px-8">
      <div className="wrapper w-full max-w-5xl mx-auto p-6 rounded-2xl bg-black/40 shadow-lg">
        {/* ✅ Back Button */}
        <div className="flex justify-start mb-4">
          <button
            onClick={() => router.push(isAdmin ? "/dashboard/admin/viewdeliveries" : "/dashboard/employee/viewdeliveries")}
            className="bg-[#668743] text-white px-4 py-2 rounded-lg hover:bg-[#345216] transition-all shadow-md"
          >
            ← Back to View Deliveries
          </button>
        </div>

        <div className="flex justify-center items-center mx-3 gap-2">
          <h2 className="capitalize text-2xl font-semibold flex items-center gap-2 mb-4 text-black/40">
            <Image
              src="/truck.png"
              alt="Truck"
              width={40}
              height={40}
              className="opacity-40"
            />
            {isAdmin ? "All Trips" : "Your Trip"} {/* Dynamic text for admin vs employee */}
          </h2>
        </div>

        {trip ? (
          <div className="wrapper p-4 rounded-lg border-2 border-white text-white">
            {/* Employee Details */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-black/25 rounded-full flex items-center justify-center border-2 border-white overflow-hidden">
                <Image
                  src={trip.employee?.user.profile_image || "/accountsblk.png"}
                  alt="Employee"
                  width={70}
                  height={70}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="w-full text-center md:text-left">
                <p className="text-black/55 font-medium">
                  Employee: {trip.employee?.user.username} (
                  {trip.vehicle?.plate_number || "No Plate"})
                </p>
                <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                  <strong>CLIENT:</strong> {trip.client_info || "__________"}
                </p>
                <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                  <strong>DESTINATION:</strong> {getDestination()} (
                  {trip.distance_traveled || "___"} km)
                </p>
                <p className="text-sm bg-black/45 text-white px-2 py-1 rounded-md mt-1 w-full">
                  <strong>LOCATION:</strong> {trip.user_latitude},{" "}
                  {trip.user_longitude}
                </p>
              </div>
            </div>

            {/* Live Map*/}
            <div className="w-full h-96 bg-gray-700 rounded-lg mt-7">
              <LeafletMap
                lat={dest_lat}
                lng={dest_lng}
                destination={getDestination()}
                userLat={user_lat}
                userLng={user_lng}
                isAdmin={isAdmin} // Pass the admin flag to LeafletMap component
              />
            </div>
          </div>
        ) : (
          <p className="text-white text-center">
            {isAdmin ? "No trips found." : "Trip not found for this employee."}
          </p>
        )}
      </div>
    </div>
  );
};

export default MapsPage;
