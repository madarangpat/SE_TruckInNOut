"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";

interface Trip {
  trip_id: number;
  trip_status: string;
  num_of_drops: number;
  vehicle: {
    plate_number: string;
    vehicle_type: string;
    is_company_owned: boolean;
    subcon_name?: string | null;
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
  completed: boolean[];
}

const TripStatus = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/trips/`);
        const forVerification = res.data.filter((trip: Trip) =>
          trip.completed.every((status: boolean) => status === true)
        );
        setTrips(forVerification);
      } catch (err) {
        console.error("Failed to fetch trips to verify:", err);
        toast.error("Failed to load trips to verify.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleTripStatusChange = async (tripId: number, isChecked: boolean) => {
    const newStatus = isChecked ? "Confirmed" : "Ongoing";

    try {
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip.trip_id === tripId ? { ...trip, trip_status: newStatus } : trip
        )
      );
  
      await axios.patch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/update/trips/${tripId}/`,
        { trip_status: newStatus }
      );
  
      toast.success("Trip status updated successfully.");
    } catch (err) {
      console.error("Failed to update trip status:", err);
      toast.error("Failed to update trip status.");
    }
  };

  return (
    <div className="wrapper w-full max-w-5xl rounded-2xl shadow-lg p-6 bg-black/40 mb-8">
      <div className="flex justify-center items-center mx-3 gap-2">
        <h2 className="capitalize text-2xl font-semibold flex items-center gap-2 mb-4 text-black/40">
          <Image
            src="/package.png"
            alt="Trips Status"
            width={30}
            height={30}
            className="opacity-40"
          />
          Trip Verification
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
                      {driverName} (
                      {trip.vehicle?.plate_number || "No Plate"} — {trip.vehicle?.vehicle_type || "Unknown Type"}
                      {trip.vehicle?.is_company_owned === false && trip.vehicle?.subcon_name
                        ? ` | Subcon: ${trip.vehicle.subcon_name}`
                        : "" }
                      )
                    </p>

                    <p className="text-sm bg-white/50 text-black px-3 py-1 rounded-md mt-1 w-full">
                      <strong>Final Drop:</strong>{" "}
                      {trip.addresses?.length > 0 && trip.clients?.length > 0
                        ? `${lastAddress} (Client: ${lastClient})`
                        : "No address available"}
                    </p>

                    <p className="text-sm bg-white/50 text-black px-3 py-1 rounded-md mt-1 w-full">
                      <strong>Total Drops:</strong> {trip.num_of_drops || "—"}
                    </p>

                    <div className="text-sm mt-2">
                      <label htmlFor={`status-${trip.trip_id}`} className="font-semibold mr-2">
                        Mark as Completed:
                      </label>
                      <input
                        type="checkbox"
                        id={`status-${trip.trip_id}`}
                        checked={trip.trip_status === "Confirmed"}
                        onChange={(e) => handleTripStatusChange(trip.trip_id, e.target.checked)}
                        className="px-3 py-1 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-black text-center text-lg">No Unverified Trips.</p>
        )}
      </div>
    </div>
  );
};

export default TripStatus;
