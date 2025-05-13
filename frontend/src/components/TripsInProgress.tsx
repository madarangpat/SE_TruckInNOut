"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

interface Trip {
  trip_id: number;
  trip_status: string; 
  employee: {
    employee_id: number;
    user: {
      username: string;
      profile_image: string | null;
    };
  } | null;
  helper: { username: string } | null;
  helper2: { username: string } | null;
  addresses: string[];
}

const TripsInProgress = () => {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/trips/`);
        const ongoingTrips = res.data.filter((trip: Trip) => trip.trip_status === "Ongoing");
        setTrips(ongoingTrips);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
        toast.error("Failed to load trips.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleTripClick = (employeeId: number, tripId: number) => {
    router.push(`/dashboard/admin/viewdeliveries/maps?trip=${tripId}`);
  };

  return (
    <div className="wrapper w-full max-w-5xl rounded-2xl shadow-lg p-6 mb-8 bg-black/40">
      <div className="flex justify-center items-center mx-3 gap-2 mb-4">
        <h2 className="capitalize text-2xl font-semibold text-black/40 flex items-center gap-2">
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
            const totalDrops = trip.addresses?.length || 0;
            const lastAddress = trip.addresses?.[totalDrops - 1] || "Unknown";
            const shortAddress = lastAddress
              .split(",")
              .slice(0, 2)
              .map((s) => s.trim())
              .join(", ");
            const driverName = trip.employee?.user?.username || "None";
            const helpers = [trip.helper?.username, trip.helper2?.username]
              .filter(Boolean)
              .join(", ") || "None";

            return (
              <div
                key={trip.trip_id}
                className="flex flex-col items-start justify-start bg-[#668743] hover:bg-[#345216] transition rounded-lg p-2 py-1 cursor-pointer w-full sm:w-[48%] md:w-[32%] lg:w-[30%]"
                onClick={() =>
                  trip.employee && handleTripClick(trip.employee.employee_id, trip.trip_id)
                }
              >
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border-2 border-white">
                  <Image
                    src={
                      trip.employee?.user?.profile_image || "/accounts.png"
                    }
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full object-cover opacity-90"
                  />
                </div>
                <span className="mt-1 text-xs text-white/90 text-left leading-tight w-full">
                  <strong>{totalDrops}</strong> Drop{totalDrops !== 1 ? "s" : ""} <br />
                  Final Drop to <strong>{shortAddress}</strong> <br />
                  Driver: <strong>{driverName}</strong> <br />
                  Helper/s: <strong>{helpers}</strong>
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-white text-center text-lg w-full">No Current Trip/s.</p>
        )}
      </div>
    </div>
  );
};

export default TripsInProgress;
