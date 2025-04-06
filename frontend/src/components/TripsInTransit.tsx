"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Trip {
  trip_id: number;
  is_completed: boolean;
  employee: {
    employee_id: number;
    user: {
      username: string;
      profile_image: string;
    };
    employee_type: string;
  };
  helper: {
    username: string;
  } | null;
  helper2: {
    username: string;
  } | null;
  addresses: string[];
}

const TripsInTransit = () => {
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

  return (
    <div className="wrapper rounded-2xl p-4 flex-1 shadow-md h-full w-full flex flex-col">
      <div className="flex justify-center items-center mx-3 gap-2">
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

      <div className="flex-1 overflow-y-auto overflow-x-hidden max-h-[400px] bg-black/40 rounded-lg p-3">
        {loading ? (
          <span className="text-white text-center text-sm">Loading trips...</span>
        ) : trips.length > 0 ? (
          trips.map((trip) => {
            const lastDestination = trip.addresses?.[trip.addresses.length - 1] || "Unknown";
            const driverName = trip.employee?.user.username || "None";
            const helperUsernames = [
              trip.helper?.username,
              trip.helper2?.username,
            ].filter(Boolean);

            const helpers =
              helperUsernames.length > 0 ? helperUsernames.join(", ") : "None";

            return (
              <div
                key={trip.trip_id}
                className="flex justify-between items-center p-2 border-b border-gray-600 text-white w-full"
              >
                <span className="text-sm">
                  Last Drop to <strong>{lastDestination}</strong> by Driver: <strong>{driverName}</strong>{" "}
                  and Helper/s: <strong>{helpers}</strong>
                </span>
                <span className="text-xs px-2 py-1 rounded-lg bg-orange-500 text-white">
                  Ongoing
                </span>
              </div>
            );
          })
        ) : (
          <span className="text-white text-center text-sm">No ongoing trips.</span>
        )}
      </div>
    </div>
  );
};

export default TripsInTransit;
