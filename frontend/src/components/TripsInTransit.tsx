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