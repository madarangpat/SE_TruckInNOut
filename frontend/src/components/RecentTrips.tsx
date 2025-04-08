"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";

interface Trip {
  trip_id: number;
  is_completed: boolean;
  num_of_drops: number;
  base_salary: number;
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
  helper: { username: string } | null;
  helper2: { username: string } | null;
  addresses: string[];
  clients: string[];
}

const RecentTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/trips/`);
        const completedTrips = res.data.filter((trip: Trip) => trip.is_completed === true);
        setTrips(completedTrips);
      } catch (err) {
        console.error("Failed to fetch recent trips:", err);
        toast.error("Failed to load recent trips.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="wrapper w-full max-w-5xl rounded-2xl shadow-lg p-6 bg-black/40">
      <div className="flex justify-center items-center mx-3 gap-2">
        <h2 className="capitalize text-2xl font-semibold flex items-center gap-2 mb-4 text-black/40">
          <Image
            src="/package.png"
            alt="Recent Trips"
            width={30}
            height={30}
            className="opacity-40"
          />
          Recent Trips
        </h2>
      </div>

      <div className="innerwrapper max-h-[250px] overflow-y-auto rounded-lg p-3 flex flex-col">
        {loading ? (
          <p className="text-white text-center text-lg">Loading trips...</p>
        ) : trips.length > 0 ? (
          trips.map((trip) => {
            const driverName = trip.employee?.user.username || "None";
            const helperUsernames = [trip.helper?.username, trip.helper2?.username].filter(Boolean);
            const helpers = helperUsernames.length > 0 ? helperUsernames.join(", ") : "None";

            const lastAddress =
              trip.addresses?.[trip.addresses.length - 1]
                ?.split(",")
                .slice(0, 2)
                .map((part) => part.trim())
                .join(", ") || "N/A";

            const lastClient = trip.clients?.[trip.clients.length - 1] || "Unknown";

            return (
              <div
                key={trip.trip_id}
                className="wrappersmall2 flex flex-col sm:flex-row items-center justify-between p-4 bg-[#d9e0cc] text-black/80 rounded-lg mb-3 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center border border-gray-500 overflow-hidden">
                    <Image
                      src={trip.employee?.user.profile_image || "/accountsblk.png"}
                      alt="Profile"
                      width={70}
                      height={70}
                      className="rounded-full object-cover opacity-90"
                    />
                  </div>

                  <div className="w-full">
                    <p className="font-medium">
                      {driverName} ({trip.vehicle?.plate_number || "No Plate"})
                    </p>

                    <p className="text-sm italic text-black/70 mt-1">
                      <strong>Helpers:</strong> {helpers}
                    </p>

                    <p className="text-sm bg-white/50 text-black px-3 py-1 rounded-md mt-1 w-full">
                      <strong>Number of Drops:</strong> {trip.num_of_drops || "—"}
                    </p>

                    <p className="text-sm bg-white/50 text-black px-3 py-1 rounded-md mt-1 w-full">
                      <strong>Salary:</strong> ₱{trip.base_salary || "—"}
                    </p>

                    <p className="text-sm bg-white/50 text-black px-3 py-1 rounded-md mt-1 w-full">
                      <strong>Final Drop:</strong>{" "}
                      {trip.addresses?.length > 0 && trip.clients?.length > 0
                        ? `${lastAddress} (Client: ${lastClient})`
                        : "No address available"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-black text-center text-lg">No Recent Trips.</p>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={() =>
            window.location.assign("/dashboard/admin/viewdeliveries/newtrip")
          }
          className="px-6 py-3 bg-[#668743] text-white text-sm rounded-lg hover:bg-[#345216] flex items-center gap-2"
        >
          <Image
            src="/plustrip2.png"
            alt="Create New Trip"
            width={20}
            height={20}
            className="opacity-90"
          />
          Create New Trip
        </button>
      </div>
    </div>
  );
};

export default RecentTrips;
