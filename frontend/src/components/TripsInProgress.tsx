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
  helper: {
    username: string;
  } | null;
  helper2: {
    username: string;
  } | null;
  addresses: string[];
}

const TripsInProgress = () => {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/trips/");
        const ongoingTrips = res.data.filter((trip: Trip) => trip.is_completed === false);
        setTrips(ongoingTrips);
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

      <div className="innerwrapper max-h-[250px] overflow-y-auto rounded-lg p-3 flex flex-wrap gap-3 justify-start">
        {loading ? (
          <p className="text-white text-center text-lg w-full">Loading trips...</p>
        ) : trips.length > 0 ? (
          trips.map((trip) => {
            const lastDestination = trip.addresses?.[trip.addresses.length - 1] || "Unknown";
            const driverName = trip.employee?.user?.username || "None";
            const helperUsernames = [
              trip.helper?.username,
              trip.helper2?.username,
            ].filter(Boolean);
            const helpers = helperUsernames.length > 0 ? helperUsernames.join(", ") : "None";

            return (
              <div
                key={trip.trip_id}
                className="flex flex-col items-center justify-center bg-[#668743] hover:bg-[#345216] transition rounded-lg p-2 py-1 cursor-pointer w-full sm:w-[48%] md:w-[32%] lg:w-[30%]"
                onClick={() =>
                  trip.employee && handleEmployeeClick(trip.employee.employee_id)
                }
              >
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border-2 border-white">
                  <Image
                    src={
                      trip.employee?.user?.profile_image
                        ? trip.employee.user.profile_image
                        : "/accounts.png"
                    }
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full object-cover opacity-90"
                  />
                </div>
                <span className="mt-1 text-xs text-white/90 text-center leading-tight">
                  Last Drop to <strong>{lastDestination}</strong><br />
                  by Driver: <strong>{driverName}</strong><br />
                  and Helper/s: <strong>{helpers}</strong>
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-black text-center text-lg w-full">No Current Trip/s.</p>
        )}
      </div>
    </div>
  );
};

export default TripsInProgress;
