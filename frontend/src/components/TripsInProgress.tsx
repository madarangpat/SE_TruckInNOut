"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Trip {
  trip_id: number;
  is_completed: boolean;
  employee: {
    employee_id: number;
    user: {
      username: string;
      profile_image: string | null;
    };
  } | null;
  start_date: string;
  end_date: string;
}

const TripsInProgress = () => {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/trips/");
        const activeTrips = res.data.filter((trip: Trip) => trip.is_completed === false);
        setTrips(activeTrips);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleEmployeeClick = (employeeId: number) => {
    router.push(`/dashboard/admin/viewdeliveries/maps?employee=${employeeId}`);
  };

  return (
    <div className="wrapper w-full max-w-5xl rounded-2xl shadow-lg p-6 mb-8 bg-black/40">
      <div className="flex justify-center items-center mx-3 gap-2">
        <h2 className="capitalize text-2xl font-semibold flex items-center gap-2 mb-4 text-black/40">
          <Image
            src="/truck.png"
            alt="Truck"
            width={40}
            height={40}
            className="opacity-40"
          />
          Trips in Progress
        </h2>
      </div>

      <div className="innerwrapper max-h-[300px] min-h-[150px] p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex items-center justify-center">
        {loading ? (
          <p className="text-white text-center text-lg">Loading trips...</p>
        ) : trips.length > 0 ? (
          trips.map((trip) => (
            <div
              key={trip.trip_id}
              className="wrappersmall flex flex-col items-center justify-center bg-[#668743] hover:bg-[#345216] transition rounded-lg p-4 cursor-pointer"
              onClick={() => trip.employee && handleEmployeeClick(trip.employee.employee_id)}
            >
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border-2 border-white">
                <Image
                  src={
                    trip.employee?.user.profile_image ||
                    "/accounts.png"
                  }
                  alt="Profile"
                  width={70}
                  height={70}
                  className="rounded-full object-cover opacity-90"
                />
              </div>
              <span className="mt-2 text-sm text-white/90">
                {trip.employee?.user.username || "No Employee"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-white text-center text-lg">No Current Trip/s.</p>
        )}
      </div>
    </div>
  );
};

export default TripsInProgress;
